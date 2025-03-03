import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { AuthService } from "../services/auth-service";

export default function Nutrition() {
  const [userData, setUserData] = useState(null);
  const [nutritionData, setNutritionData] = useState({
    dailyLogs: [
      {
        date: '2023-08-15',
        meals: [
          { name: 'Breakfast', calories: 450, protein: 30, carbs: 45, fat: 15 },
          { name: 'Lunch', calories: 650, protein: 40, carbs: 60, fat: 25 },
          { name: 'Dinner', calories: 550, protein: 35, carbs: 40, fat: 20 },
          { name: 'Snacks', calories: 200, protein: 10, carbs: 15, fat: 10 }
        ],
        totals: { calories: 1850, protein: 115, carbs: 160, fat: 70 }
      },
      {
        date: '2023-08-14',
        meals: [
          { name: 'Breakfast', calories: 400, protein: 25, carbs: 40, fat: 15 },
          { name: 'Lunch', calories: 700, protein: 45, carbs: 65, fat: 25 },
          { name: 'Dinner', calories: 600, protein: 40, carbs: 45, fat: 25 },
          { name: 'Snacks', calories: 150, protein: 5, carbs: 20, fat: 5 }
        ],
        totals: { calories: 1850, protein: 115, carbs: 170, fat: 70 }
      }
    ],
    weeklyAverage: {
      calories: 1850,
      protein: 140, // grams
      carbs: 160, // grams
      fat: 65 // grams
    },
    goals: {
      calories: 1900,
      protein: 150, // grams
      carbs: 150, // grams
      fat: 65 // grams
    }
  });
  
  useEffect(() => {
    // Get user data
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserData(user);
      
      // In a real app, we would fetch the nutrition data from the API
      // For now, we'll use the mock data
    }
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nutrition</h1>
        <p className="text-gray-600">Track your daily nutrition and macronutrients</p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Log</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>Nutrition Overview</CardTitle>
              <CardDescription>Your weekly average macronutrient breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Protein</div>
                    <div className="text-lg font-medium">{nutritionData.weeklyAverage.protein}g</div>
                    <div className="text-xs">{Math.round(nutritionData.weeklyAverage.protein * 4)} cal</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Carbs</div>
                    <div className="text-lg font-medium">{nutritionData.weeklyAverage.carbs}g</div>
                    <div className="text-xs">{Math.round(nutritionData.weeklyAverage.carbs * 4)} cal</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Fat</div>
                    <div className="text-lg font-medium">{nutritionData.weeklyAverage.fat}g</div>
                    <div className="text-xs">{Math.round(nutritionData.weeklyAverage.fat * 9)} cal</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total Calories</span>
                    <span>{nutritionData.weeklyAverage.calories} cal</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="flex h-full">
                      <div className="bg-blue-500 h-full" style={{ width: `${(nutritionData.weeklyAverage.protein * 4 / nutritionData.weeklyAverage.calories) * 100}%` }}></div>
                      <div className="bg-yellow-500 h-full" style={{ width: `${(nutritionData.weeklyAverage.carbs * 4 / nutritionData.weeklyAverage.calories) * 100}%` }}></div>
                      <div className="bg-red-500 h-full" style={{ width: `${(nutritionData.weeklyAverage.fat * 9 / nutritionData.weeklyAverage.calories) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Protein: {Math.round((nutritionData.weeklyAverage.protein * 4 / nutritionData.weeklyAverage.calories) * 100)}%</span>
                    <span>Carbs: {Math.round((nutritionData.weeklyAverage.carbs * 4 / nutritionData.weeklyAverage.calories) * 100)}%</span>
                    <span>Fat: {Math.round((nutritionData.weeklyAverage.fat * 9 / nutritionData.weeklyAverage.calories) * 100)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>Today's Nutrition</CardTitle>
              <CardDescription>Your meals and macros for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nutritionData.dailyLogs[0].meals.map((meal, index) => (
                  <div key={index} className="border-b pb-3">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{meal.name}</h3>
                      <span className="text-gray-500">{meal.calories} cal</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-blue-600">{meal.protein}g</span> protein
                      </div>
                      <div>
                        <span className="text-yellow-600">{meal.carbs}g</span> carbs
                      </div>
                      <div>
                        <span className="text-red-600">{meal.fat}g</span> fat
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-3">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Daily Total</h3>
                    <span className="font-medium">{nutritionData.dailyLogs[0].totals.calories} cal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">{nutritionData.dailyLogs[0].totals.protein}g</span> protein
                    </div>
                    <div>
                      <span className="text-yellow-600 font-medium">{nutritionData.dailyLogs[0].totals.carbs}g</span> carbs
                    </div>
                    <div>
                      <span className="text-red-600 font-medium">{nutritionData.dailyLogs[0].totals.fat}g</span> fat
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Log a Meal</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Other tabs content... */}
      </Tabs>
    </div>
  );
} 