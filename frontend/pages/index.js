import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { AuthService } from "../services/auth-service";
import { AIInsightsService } from "../services/ai-insights-service";
import AIInsightsComponent from "../components/ai/ai-insights";
import { useRouter } from 'next/router';
import { FitbitService } from "../services/fitbit-service";
import FitbitLogo from "../components/fitbit-logo";
import WorkoutRecommendations from "../components/workout-recommendations";
import { Dumbbell, Heart, TrendingUp, Calendar, Clock, Award, ArrowRight, Activity, Utensils, Weight } from 'lucide-react';
import Link from 'next/link';
import WorkoutStreak from '../components/workout-streak';
import WorkoutProgressChart from '../components/workout-progress-chart';

export default function Dashboard() {
  const [userData, setUserData] = useState({
    name: "Dhawal Chheda",
    metrics: {
      weight: { current: 187, goal: 165, unit: 'lbs', progress: 81 },
      bodyFat: { current: 22, goal: 15, unit: '%', progress: 78 },
      muscleMass: { current: 137, goal: 142, unit: 'lbs', progress: 38 }
    }
  });
  
  const [activityData, setActivityData] = useState(null);
  const [sleepData, setSleepData] = useState(null);
  const [heartRateData, setHeartRateData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  
  const [stats, setStats] = useState({
    workoutsCompleted: 0,
    totalMinutes: 0,
    streakDays: 0,
    caloriesBurned: 0
  });
  
  const [goals, setGoals] = useState({
    weeklyWorkouts: 4,
    weeklyMinutes: 150,
    weeklyCalories: 1500
  });
  
  const [progress, setProgress] = useState({
    workouts: 0,
    minutes: 0,
    calories: 0
  });
  
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from Fitbit
        const activity = await FitbitService.getActivityData('7d');
        const sleep = await FitbitService.getSleepData('7d');
        const heartRate = await FitbitService.getHeartRateData('7d');
        
        if (activity) setActivityData(activity);
        if (sleep) setSleepData(sleep);
        if (heartRate) setHeartRateData(heartRate);
        
        // Generate AI insights
        const aiData = {
          activity: activity,
          sleep: sleep,
          heartRate: heartRate,
          bodyComposition: userData.metrics
        };
        
        const generatedInsights = await AIInsightsService.generateInsights(aiData);
        setInsights(generatedInsights);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    // Load workout history from localStorage
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    // Calculate stats
    const totalWorkouts = workoutHistory.length;
    const totalMinutes = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
    const caloriesBurned = totalMinutes * 5; // Simple estimation
    
    setStats({
      workoutsCompleted: totalWorkouts,
      totalMinutes,
      streakDays: calculateStreak(workoutHistory),
      caloriesBurned
    });
    
    // Calculate weekly progress
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weeklyWorkouts = workoutHistory.filter(workout => 
      new Date(workout.date) >= startOfWeek
    );
    
    const weeklyMinutes = weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
    const weeklyCalories = weeklyWorkouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
    
    setProgress({
      workouts: (weeklyWorkouts.length / goals.weeklyWorkouts) * 100,
      minutes: (weeklyMinutes / goals.weeklyMinutes) * 100,
      calories: (weeklyCalories / goals.weeklyCalories) * 100
    });
    
    // Get recent workouts
    const sortedWorkouts = [...workoutHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setRecentWorkouts(sortedWorkouts.slice(0, 3));
  }, []);
  
  const calculateStreak = (workouts) => {
    if (!workouts.length) return 0;
    
    // Sort workouts by date
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Check if there's a workout today
    const today = new Date().toISOString().split('T')[0];
    const latestWorkoutDate = new Date(sortedWorkouts[0].date).toISOString().split('T')[0];
    
    if (latestWorkoutDate !== today) {
      return 0; // Streak broken if no workout today
    }
    
    let streak = 1;
    let currentDate = new Date(today);
    
    for (let i = 1; i < sortedWorkouts.length; i++) {
      currentDate.setDate(currentDate.getDate() - 1);
      const expectedDate = currentDate.toISOString().split('T')[0];
      const workoutDate = new Date(sortedWorkouts[i].date).toISOString().split('T')[0];
      
      if (workoutDate === expectedDate) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  const getWorkoutTypeColor = (type) => {
    const types = {
      'hiit': 'bg-red-500',
      'yoga': 'bg-blue-500',
      'strength': 'bg-purple-500',
      'cardio': 'bg-orange-500',
      'stretching': 'bg-green-500'
    };
    
    return types[type] || 'bg-gray-500';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {userData.name}</h1>
          <p className="text-muted-foreground">Here's your health and fitness overview</p>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weight Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weight</CardTitle>
                <CardDescription>Current progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {userData.metrics.weight.current} <span className="text-sm font-normal text-muted-foreground">{userData.metrics.weight.unit}</span>
                </div>
                <Progress value={userData.metrics.weight.progress} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {userData.metrics.weight.current} {userData.metrics.weight.unit}</span>
                  <span>Goal: {userData.metrics.weight.goal} {userData.metrics.weight.unit}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Body Fat Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Body Fat</CardTitle>
                <CardDescription>Current progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {userData.metrics.bodyFat.current} <span className="text-sm font-normal text-muted-foreground">{userData.metrics.bodyFat.unit}</span>
                </div>
                <Progress value={userData.metrics.bodyFat.progress} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {userData.metrics.bodyFat.current} {userData.metrics.bodyFat.unit}</span>
                  <span>Goal: {userData.metrics.bodyFat.goal} {userData.metrics.bodyFat.unit}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Muscle Mass Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Muscle Mass</CardTitle>
                <CardDescription>Current progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {userData.metrics.muscleMass.current} <span className="text-sm font-normal text-muted-foreground">{userData.metrics.muscleMass.unit}</span>
                </div>
                <Progress value={userData.metrics.muscleMass.progress} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {userData.metrics.muscleMass.current} {userData.metrics.muscleMass.unit}</span>
                  <span>Goal: {userData.metrics.muscleMass.goal} {userData.metrics.muscleMass.unit}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest workouts and measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentWorkouts.map((workout, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border-b last:border-0">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          workout.type?.includes('Strength') ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {workout.type?.includes('Strength') ? 
                            <Activity className="h-5 w-5" /> : 
                            <Dumbbell className="h-5 w-5" />
                          }
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{workout.type || 'Workout'}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{workout.duration} min</div>
                        <div className="text-xs text-muted-foreground">{workout.calories} cal</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/activity">
                  <Button variant="ghost" className="w-full mt-4">
                    View All Activity
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* AI Insights Card */}
            <AIInsightsComponent insights={insights} isLoading={isLoading} />
          </div>
        </TabsContent>
        
        <TabsContent value="body">
          <Card>
            <CardHeader>
              <CardTitle>Body Composition</CardTitle>
              <CardDescription>Track your body metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Link href="/body-composition">
                  <Button>
                    Go to Body Composition
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition</CardTitle>
              <CardDescription>Track your meals and macros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Link href="/nutrition">
                  <Button>
                    Go to Nutrition
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Workouts</CardTitle>
              <CardDescription>View and log your workouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Link href="/workouts">
                  <Button>
                    Go to Workouts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Sleep</CardTitle>
              <CardDescription>Track your sleep patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Link href="/sleep">
                  <Button>
                    Go to Sleep
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-insights">
          <Card>
            <CardHeader>
              <CardTitle>AI Health Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <p className="text-muted-foreground">Loading your personalized insights...</p>
                  </div>
                ) : insights && insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <p>{insight}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <p className="text-muted-foreground">Add more health data to get personalized insights</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 