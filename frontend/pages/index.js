import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { AuthService } from "../services/auth-service";
import { AIInsightsService } from "../services/ai-insights-service";
import AIInsightsComponent from "../components/ai/ai-insights";

export default function Dashboard() {
  // State for user data
  const [userData, setUserData] = useState(null);
  
  // State for health metrics
  const [healthMetrics, setHealthMetrics] = useState({
    weight: {
      current: 0,
      previous: 0,
      goal: 0
    },
    bodyFat: {
      current: 0,
      previous: 0,
      goal: 0
    },
    muscleMass: {
      current: 0,
      previous: 0,
      goal: 0
    },
    period: '3 weeks',
    workouts: [
      { date: '2023-08-01', type: 'strength', duration: 45, calories: 320 },
      { date: '2023-08-03', type: 'hiit', duration: 30, calories: 400 },
      { date: '2023-08-05', type: 'strength', duration: 50, calories: 350 },
      { date: '2023-08-08', type: 'cardio', duration: 40, calories: 380 },
      { date: '2023-08-10', type: 'strength', duration: 45, calories: 330 },
      { date: '2023-08-12', type: 'hiit', duration: 30, calories: 410 },
      { date: '2023-08-15', type: 'strength', duration: 50, calories: 360 }
    ],
    nutrition: {
      avgCalories: 1850,
      avgProtein: 140, // grams
      avgCarbs: 160, // grams
      avgFat: 65 // grams
    },
    sleep: {
      avgDuration: 6.8, // hours
      avgQuality: 75 // percentage
    }
  });
  
  // State for AI insights
  const [insights, setInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  
  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      
      // Update health metrics with user data
      if (parsedUser.weight) {
        // Calculate goal weight based on user's goal
        let goalWeight = parsedUser.weight;
        if (parsedUser.goal === 'fat-loss') {
          goalWeight = Math.max(parsedUser.weight - 20, 120); // Target 20 lbs loss with minimum of 120 lbs
        } else if (parsedUser.goal === 'muscle-gain') {
          goalWeight = parsedUser.weight + 10; // Target 10 lbs gain for muscle
        }
        
        // Calculate previous weight (mock data)
        const previousWeight = parsedUser.goal === 'fat-loss' 
          ? parsedUser.weight + 5 // If goal is fat loss, previous weight was higher
          : parsedUser.goal === 'muscle-gain' 
            ? parsedUser.weight - 3 // If goal is muscle gain, previous weight was lower
            : parsedUser.weight; // If maintenance, previous weight was the same
        
        // Update health metrics
        setHealthMetrics(prev => ({
          ...prev,
          weight: {
            current: parsedUser.weight,
            previous: previousWeight,
            goal: goalWeight
          },
          bodyFat: {
            current: parsedUser.bodyFat || 22,
            previous: parsedUser.goal === 'fat-loss' ? (parsedUser.bodyFat || 22) + 2 : (parsedUser.bodyFat || 22),
            goal: parsedUser.goal === 'fat-loss' ? Math.max((parsedUser.bodyFat || 22) - 5, 10) : (parsedUser.bodyFat || 22)
          },
          muscleMass: {
            current: Math.round(parsedUser.weight * 0.75),
            previous: parsedUser.goal === 'muscle-gain' 
              ? Math.round(parsedUser.weight * 0.75) - 3 
              : Math.round(parsedUser.weight * 0.75),
            goal: parsedUser.goal === 'muscle-gain' 
              ? Math.round(parsedUser.weight * 0.75) + 10 
              : Math.round(parsedUser.weight * 0.75)
          }
        }));
      }
      
      // Generate AI insights
      generateInsights(parsedUser);
    }
  }, []);
  
  // Function to generate AI insights
  const generateInsights = async (user) => {
    setIsLoadingInsights(true);
    try {
      const generatedInsights = await AIInsightsService.generateInsights(user, healthMetrics);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };
  
  // Format height as feet and inches
  const formatHeight = (heightFeet, heightInches) => {
    if (!heightFeet) return 'Not set';
    return `${heightFeet}'${heightInches || 0}"`;
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{userData ? userData.name.charAt(0) + (userData.name.split(' ')[1] ? userData.name.split(' ')[1].charAt(0) : '') : 'U'}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="text-2xl font-bold">{userData?.name || 'User'}</h2>
              <p className="text-gray-600">
                {userData?.age} years • {formatHeight(userData?.heightFeet, userData?.heightInches)} • {userData?.weight} lbs
              </p>
              <div className="flex mt-1">
                <Badge variant="outline" className="mr-2 capitalize">
                  {userData?.goal?.replace('-', ' ') || 'No goal set'}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {userData?.gender || 'Gender not set'}
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <Button>Update Profile</Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weight</CardTitle>
                <CardDescription>Current</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthMetrics.weight.current} lbs</div>
                <div className={`text-sm ${healthMetrics.weight.current < healthMetrics.weight.previous ? 'text-green-600' : 'text-red-600'}`}>
                  {healthMetrics.weight.current < healthMetrics.weight.previous 
                    ? `↓ ${(healthMetrics.weight.previous - healthMetrics.weight.current).toFixed(1)} lbs` 
                    : `↑ ${(healthMetrics.weight.current - healthMetrics.weight.previous).toFixed(1)} lbs`}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Goal: {healthMetrics.weight.goal} lbs</span>
                    <span>{Math.round(((healthMetrics.weight.current - healthMetrics.weight.previous) / (healthMetrics.weight.goal - healthMetrics.weight.previous)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round(((healthMetrics.weight.current - healthMetrics.weight.previous) / (healthMetrics.weight.goal - healthMetrics.weight.previous)) * 100)} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Body Fat</CardTitle>
                <CardDescription>Current</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthMetrics.bodyFat.current}%</div>
                <div className={`text-sm ${healthMetrics.bodyFat.current < healthMetrics.bodyFat.previous ? 'text-green-600' : 'text-red-600'}`}>
                  {healthMetrics.bodyFat.current < healthMetrics.bodyFat.previous 
                    ? `↓ ${(healthMetrics.bodyFat.previous - healthMetrics.bodyFat.current).toFixed(1)}%` 
                    : `↑ ${(healthMetrics.bodyFat.current - healthMetrics.bodyFat.previous).toFixed(1)}%`}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Goal: {healthMetrics.bodyFat.goal}%</span>
                    <span>{Math.round(((healthMetrics.bodyFat.current - healthMetrics.bodyFat.previous) / (healthMetrics.bodyFat.goal - healthMetrics.bodyFat.previous)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round(((healthMetrics.bodyFat.current - healthMetrics.bodyFat.previous) / (healthMetrics.bodyFat.goal - healthMetrics.bodyFat.previous)) * 100)} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Workouts</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {healthMetrics.workouts.slice(0, 3).map((workout, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium capitalize">{workout.type}</div>
                        <div className="text-sm text-gray-500">{workout.date}</div>
                      </div>
                      <div className="text-right">
                        <div>{workout.duration} min</div>
                        <div className="text-sm text-gray-500">{workout.calories} cal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Workouts</Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>AI Health Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingInsights ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : insights ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800">{insights.progress.title}</h3>
                  <p className="mt-2">{insights.progress.content}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Unable to generate insights at this time.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => generateInsights(userData)}>
                View All Insights
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="body" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weight</CardTitle>
                <CardDescription>Current</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthMetrics.weight.current} lbs</div>
                <div className={`text-sm ${healthMetrics.weight.current < healthMetrics.weight.previous ? 'text-green-600' : 'text-red-600'}`}>
                  {healthMetrics.weight.current < healthMetrics.weight.previous 
                    ? `↓ ${(healthMetrics.weight.previous - healthMetrics.weight.current).toFixed(1)} lbs` 
                    : `↑ ${(healthMetrics.weight.current - healthMetrics.weight.previous).toFixed(1)} lbs`}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Goal: {healthMetrics.weight.goal} lbs</span>
                    <span>{Math.round(((healthMetrics.weight.current - healthMetrics.weight.previous) / (healthMetrics.weight.goal - healthMetrics.weight.previous)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round(((healthMetrics.weight.current - healthMetrics.weight.previous) / (healthMetrics.weight.goal - healthMetrics.weight.previous)) * 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Body Fat</CardTitle>
                <CardDescription>Current</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthMetrics.bodyFat.current}%</div>
                <div className={`text-sm ${healthMetrics.bodyFat.current < healthMetrics.bodyFat.previous ? 'text-green-600' : 'text-red-600'}`}>
                  {healthMetrics.bodyFat.current < healthMetrics.bodyFat.previous 
                    ? `↓ ${(healthMetrics.bodyFat.previous - healthMetrics.bodyFat.current).toFixed(1)}%` 
                    : `↑ ${(healthMetrics.bodyFat.current - healthMetrics.bodyFat.previous).toFixed(1)}%`}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Goal: {healthMetrics.bodyFat.goal}%</span>
                    <span>{Math.round(((healthMetrics.bodyFat.current - healthMetrics.bodyFat.previous) / (healthMetrics.bodyFat.goal - healthMetrics.bodyFat.previous)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round(((healthMetrics.bodyFat.current - healthMetrics.bodyFat.previous) / (healthMetrics.bodyFat.goal - healthMetrics.bodyFat.previous)) * 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Muscle Mass</CardTitle>
                <CardDescription>Current Estimate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthMetrics.muscleMass.current} lbs</div>
                <div className={`text-sm ${healthMetrics.muscleMass.current > healthMetrics.muscleMass.previous ? 'text-green-600' : 'text-red-600'}`}>
                  {healthMetrics.muscleMass.current > healthMetrics.muscleMass.previous 
                    ? `↑ ${(healthMetrics.muscleMass.current - healthMetrics.muscleMass.previous).toFixed(1)} lbs` 
                    : `↓ ${(healthMetrics.muscleMass.previous - healthMetrics.muscleMass.current).toFixed(1)} lbs`}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Goal: {healthMetrics.muscleMass.goal} lbs</span>
                    <span>{Math.round(((healthMetrics.muscleMass.current - healthMetrics.muscleMass.previous) / (healthMetrics.muscleMass.goal - healthMetrics.muscleMass.previous)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round(((healthMetrics.muscleMass.current - healthMetrics.muscleMass.previous) / (healthMetrics.muscleMass.goal - healthMetrics.muscleMass.previous)) * 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>Body Measurements</CardTitle>
              <CardDescription>Current measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Chest</div>
                  <div className="text-xl font-bold">{userData?.measurements?.chest || '--'}"</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Waist</div>
                  <div className="text-xl font-bold">{userData?.measurements?.waist || '--'}"</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Hips</div>
                  <div className="text-xl font-bold">{userData?.measurements?.hips || '--'}"</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Arms</div>
                  <div className="text-xl font-bold">{userData?.measurements?.arms || '--'}"</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Thighs</div>
                  <div className="text-xl font-bold">{userData?.measurements?.thighs || '--'}"</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Update Measurements</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition" className="space-y-4">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>Nutrition Overview</CardTitle>
              <CardDescription>Daily averages for the last week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Daily Calories</div>
                    <div className="text-sm text-gray-500">Weekly average</div>
                  </div>
                  <div className="text-2xl font-bold">{healthMetrics.nutrition.avgCalories}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Protein</span>
                    <span>{healthMetrics.nutrition.avgProtein}g ({Math.round((healthMetrics.nutrition.avgProtein * 4 / healthMetrics.nutrition.avgCalories) * 100)}%)</span>
                  </div>
                  <Progress value={Math.round((healthMetrics.nutrition.avgProtein * 4 / healthMetrics.nutrition.avgCalories) * 100)} className="h-2 bg-gray-100" indicatorClassName="bg-blue-500" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Carbs</span>
                    <span>{healthMetrics.nutrition.avgCarbs}g ({Math.round((healthMetrics.nutrition.avgCarbs * 4 / healthMetrics.nutrition.avgCalories) * 100)}%)</span>
                  </div>
                  <Progress value={Math.round((healthMetrics.nutrition.avgCarbs * 4 / healthMetrics.nutrition.avgCalories) * 100)} className="h-2 bg-gray-100" indicatorClassName="bg-yellow-500" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Fat</span>
                    <span>{healthMetrics.nutrition.avgFat}g ({Math.round((healthMetrics.nutrition.avgFat * 9 / healthMetrics.nutrition.avgCalories) * 100)}%)</span>
                  </div>
                  <Progress value={Math.round((healthMetrics.nutrition.avgFat * 9 / healthMetrics.nutrition.avgCalories) * 100)} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Nutrition Details</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <AIInsightsComponent 
            insights={insights} 
            isLoading={isLoadingInsights} 
            userData={userData} 
            healthMetrics={healthMetrics}
            onRefresh={() => generateInsights(userData)}
          />
        </TabsContent>
        
        {/* Other tabs content... */}
      </Tabs>
    </div>
  );
} 