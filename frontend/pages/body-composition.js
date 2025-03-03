import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { AuthService } from "../services/auth-service";
import { AIInsightsService } from "../services/ai-insights-service";
import AIInsightsComponent from "../components/ai/ai-insights";

export default function BodyComposition() {
  // State for user data
  const [userData, setUserData] = useState(null);
  
  // State for body metrics
  const [bodyMetrics, setBodyMetrics] = useState({
    weight: {
      current: 0,
      previous: 0,
      goal: 0,
      history: []
    },
    bodyFat: {
      current: 0,
      previous: 0,
      goal: 0,
      history: []
    },
    muscleMass: {
      current: 0,
      previous: 0,
      goal: 0,
      history: []
    },
    measurements: {
      chest: { current: 0, previous: 0, goal: 0 },
      waist: { current: 0, previous: 0, goal: 0 },
      hips: { current: 0, previous: 0, goal: 0 },
      arms: { current: 0, previous: 0, goal: 0 },
      thighs: { current: 0, previous: 0, goal: 0 }
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
      
      // Update body metrics with user data
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
        
        // Generate mock history data
        const today = new Date();
        const weightHistory = [];
        const bodyFatHistory = [];
        const muscleMassHistory = [];
        
        for (let i = 30; i >= 0; i -= 5) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          // Weight progresses from previous to current
          const progress = (30 - i) / 30;
          const weightDiff = parsedUser.weight - previousWeight;
          const weight = previousWeight + (weightDiff * progress);
          
          // Body fat decreases if goal is fat loss
          const bodyFatStart = parsedUser.goal === 'fat-loss' ? (parsedUser.bodyFat || 22) + 2 : (parsedUser.bodyFat || 22);
          const bodyFatEnd = parsedUser.goal === 'fat-loss' ? (parsedUser.bodyFat || 22) : (parsedUser.bodyFat || 22);
          const bodyFat = bodyFatStart - ((bodyFatStart - bodyFatEnd) * progress);
          const muscleMassStart = parsedUser.goal === 'muscle-gain' 
            ? Math.round(parsedUser.weight * 0.75) - 3 
            : Math.round(parsedUser.weight * 0.75);
          const muscleMassEnd = Math.round(parsedUser.weight * 0.75);
          const muscleMass = muscleMassStart + ((muscleMassEnd - muscleMassStart) * progress);
          
          weightHistory.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(weight * 10) / 10
          });
          
          bodyFatHistory.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(bodyFat * 10) / 10
          });
          
          muscleMassHistory.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(muscleMass * 10) / 10
          });
        }
        
        // Update body metrics
        setBodyMetrics({
          weight: {
            current: parsedUser.weight,
            previous: previousWeight,
            goal: goalWeight,
            history: weightHistory
          },
          bodyFat: {
            current: parsedUser.bodyFat || 22,
            previous: parsedUser.goal === 'fat-loss' ? (parsedUser.bodyFat || 22) + 2 : (parsedUser.bodyFat || 22),
            goal: parsedUser.goal === 'fat-loss' ? 15 : (parsedUser.bodyFat || 22),
            history: bodyFatHistory
          },
          muscleMass: {
            current: Math.round(parsedUser.weight * 0.75),
            previous: parsedUser.goal === 'muscle-gain' 
              ? Math.round(parsedUser.weight * 0.75) - 3 
              : Math.round(parsedUser.weight * 0.75),
            goal: parsedUser.goal === 'muscle-gain' 
              ? Math.round(parsedUser.weight * 0.75) + 10 
              : Math.round(parsedUser.weight * 0.75),
            history: muscleMassHistory
          },
          measurements: parsedUser.measurements
        });
      }
      
      // Generate AI insights
      generateInsights(parsedUser);
    }
  }, []);
  
  const generateInsights = async (user) => {
    setIsLoadingInsights(true);
    try {
      // Create health metrics object for AI insights
      const healthMetrics = {
        weight: bodyMetrics.weight,
        bodyFat: bodyMetrics.bodyFat,
        muscleMass: bodyMetrics.muscleMass,
        period: '30 days',
        workouts: [],
        nutrition: {
          avgCalories: 1850,
          avgProtein: 140,
          avgCarbs: 160,
          avgFat: 65
        },
        sleep: {
          avgDuration: 6.8,
          avgQuality: 75
        }
      };
      
      // Get sensitive user data
      const sensitiveData = AuthService.getSensitiveUserData();
      
      // Combine user data with sensitive data
      const fullUserData = {
        ...user,
        ...(sensitiveData || {})
      };
      
      // Generate insights
      const generatedInsights = await AIInsightsService.generateInsights(fullUserData, healthMetrics);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };
  
  const handleRefreshInsights = async () => {
    setIsLoadingInsights(true);
    try {
      // Create health metrics object for AI insights
      const healthMetrics = {
        weight: bodyMetrics.weight,
        bodyFat: bodyMetrics.bodyFat,
        muscleMass: bodyMetrics.muscleMass,
        period: '30 days',
        workouts: [],
        nutrition: {
          avgCalories: 1850,
          avgProtein: 140,
          avgCarbs: 160,
          avgFat: 65
        },
        sleep: {
          avgDuration: 6.8,
          avgQuality: 75
        }
      };
      
      // Generate insights
      const generatedInsights = await AIInsightsService.generateInsights(userData, healthMetrics);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };
  
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Body Composition</h1>
        <p className="text-gray-600">Track your physical measurements and progress</p>
      </header>
      
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">Body Metrics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="space-y-4">
          {/* Body metrics content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weight</CardTitle>
                <CardDescription>Current</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bodyMetrics.weight.current} lbs</div>
                <div className={`text-sm ${bodyMetrics.weight.current < bodyMetrics.weight.previous ? 'text-green-600' : 'text-red-600'}`}>
                  {bodyMetrics.weight.current < bodyMetrics.weight.previous 
                    ? `↓ ${(bodyMetrics.weight.previous - bodyMetrics.weight.current).toFixed(1)} lbs` 
                    : `↑ ${(bodyMetrics.weight.current - bodyMetrics.weight.previous).toFixed(1)} lbs`}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Goal: {bodyMetrics.weight.goal} lbs</span>
                    <span>{Math.round(((bodyMetrics.weight.current - bodyMetrics.weight.previous) / (bodyMetrics.weight.goal - bodyMetrics.weight.previous)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round(((bodyMetrics.weight.current - bodyMetrics.weight.previous) / (bodyMetrics.weight.goal - bodyMetrics.weight.previous)) * 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Body Fat</CardTitle>
                <CardDescription>Current</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bodyMetrics.bodyFat.current}%</div>
                <div className={`text-sm ${bodyMetrics.bodyFat.current < bodyMetrics.bodyFat.previous ? 'text-green-600' : 'text-red-600'}`}>
                  {bodyMetrics.bodyFat.current < bodyMetrics.bodyFat.previous 
                    ? `↓ ${(bodyMetrics.bodyFat.previous - bodyMetrics.bodyFat.current).toFixed(1)}%` 
                    : `↑ ${(bodyMetrics.bodyFat.current - bodyMetrics.bodyFat.previous).toFixed(1)}%`}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Goal: {bodyMetrics.bodyFat.goal}%</span>
                    <span>{Math.round(((bodyMetrics.bodyFat.current - bodyMetrics.bodyFat.previous) / (bodyMetrics.bodyFat.goal - bodyMetrics.bodyFat.previous)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round(((bodyMetrics.bodyFat.current - bodyMetrics.bodyFat.previous) / (bodyMetrics.bodyFat.goal - bodyMetrics.bodyFat.previous)) * 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Muscle Mass</CardTitle>
                <CardDescription>Current Estimate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bodyMetrics.muscleMass.current} lbs</div>
                <div className={`text-sm ${bodyMetrics.muscleMass.current > bodyMetrics.muscleMass.previous ? 'text-green-600' : 'text-red-600'}`}>
                  {bodyMetrics.muscleMass.current > bodyMetrics.muscleMass.previous 
                    ? `↑ ${(bodyMetrics.muscleMass.current - bodyMetrics.muscleMass.previous).toFixed(1)} lbs` 
                    : `↓ ${(bodyMetrics.muscleMass.previous - bodyMetrics.muscleMass.current).toFixed(1)} lbs`}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Goal: {bodyMetrics.muscleMass.goal} lbs</span>
                    <span>{Math.round(((bodyMetrics.muscleMass.current - bodyMetrics.muscleMass.previous) / (bodyMetrics.muscleMass.goal - bodyMetrics.muscleMass.previous)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round(((bodyMetrics.muscleMass.current - bodyMetrics.muscleMass.previous) / (bodyMetrics.muscleMass.goal - bodyMetrics.muscleMass.previous)) * 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* History charts would go here */}
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="text-center py-8">
                <p className="text-gray-500">Charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button>Update Measurements</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <AIInsightsComponent 
            insights={insights} 
            isLoading={isLoadingInsights} 
            userData={userData} 
            healthMetrics={bodyMetrics}
            onRefresh={handleRefreshInsights}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 