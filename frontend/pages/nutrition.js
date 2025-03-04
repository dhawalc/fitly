import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { AuthService } from "../services/auth-service";

export default function Nutrition() {
  // State for user data
  const [userData, setUserData] = useState(null);
  
  // State for nutrition data
  const [nutritionData, setNutritionData] = useState({
    dailyGoals: {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 70
    },
    meals: []
  });
  
  // State for new meal
  const [newMeal, setNewMeal] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    type: 'breakfast',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    foods: []
  });
  
  // State for new food item
  const [newFood, setNewFood] = useState({
    name: '',
    servingSize: '1 serving',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      
      // Load nutrition data from localStorage
      const storedNutrition = localStorage.getItem('nutrition');
      if (storedNutrition) {
        setNutritionData(JSON.parse(storedNutrition));
      } else {
        // Create mock meal data
        const mockMeals = [
          {
            id: 1,
            date: '2023-08-15',
            name: 'Breakfast',
            type: 'breakfast',
            calories: 450,
            protein: 30,
            carbs: 45,
            fat: 15,
            foods: [
              { name: 'Eggs', servingSize: '3 large', calories: 210, protein: 18, carbs: 0, fat: 15 },
              { name: 'Oatmeal', servingSize: '1 cup', calories: 150, protein: 5, carbs: 27, fat: 3 },
              { name: 'Banana', servingSize: '1 medium', calories: 90, protein: 1, carbs: 23, fat: 0 }
            ]
          },
          {
            id: 2,
            date: '2023-08-15',
            name: 'Lunch',
            type: 'lunch',
            calories: 650,
            protein: 45,
            carbs: 65,
            fat: 20,
            foods: [
              { name: 'Chicken Breast', servingSize: '6 oz', calories: 300, protein: 35, carbs: 0, fat: 7 },
              { name: 'Brown Rice', servingSize: '1 cup', calories: 200, protein: 5, carbs: 45, fat: 2 },
              { name: 'Mixed Vegetables', servingSize: '1 cup', calories: 80, protein: 3, carbs: 15, fat: 0 },
              { name: 'Olive Oil', servingSize: '1 tbsp', calories: 120, protein: 0, carbs: 0, fat: 14 }
            ]
          },
          {
            id: 3,
            date: '2023-08-15',
            name: 'Dinner',
            type: 'dinner',
            calories: 550,
            protein: 40,
            carbs: 50,
            fat: 20,
            foods: [
              { name: 'Salmon', servingSize: '5 oz', calories: 300, protein: 30, carbs: 0, fat: 15 },
              { name: 'Sweet Potato', servingSize: '1 medium', calories: 150, protein: 2, carbs: 35, fat: 0 },
              { name: 'Broccoli', servingSize: '1 cup', calories: 50, protein: 3, carbs: 10, fat: 0 },
              { name: 'Butter', servingSize: '1 tsp', calories: 50, protein: 0, carbs: 0, fat: 5 }
            ]
          }
        ];
        
        const newNutritionData = {
          dailyGoals: nutritionData.dailyGoals,
          meals: mockMeals
        };
        
        setNutritionData(newNutritionData);
        localStorage.setItem('nutrition', JSON.stringify(newNutritionData));
      }
    }
  }, []);
  
  // Calculate daily totals
  const dailyTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };
  
  // Filter meals for today
  const todayMeals = nutritionData.meals.filter(meal => meal.date === new Date().toISOString().split('T')[0]);
  
  // Calculate totals
  todayMeals.forEach(meal => {
    dailyTotals.calories += meal.calories;
    dailyTotals.protein += meal.protein;
    dailyTotals.carbs += meal.carbs;
    dailyTotals.fat += meal.fat;
  });
  
  // Add food to new meal
  const addFood = () => {
    if (!newFood.name) return;
    
    const updatedMeal = {
      ...newMeal,
      calories: newMeal.calories + newFood.calories,
      protein: newMeal.protein + newFood.protein,
      carbs: newMeal.carbs + newFood.carbs,
      fat: newMeal.fat + newFood.fat,
      foods: [...newMeal.foods, { ...newFood }]
    };
    
    setNewMeal(updatedMeal);
    setNewFood({
      name: '',
      servingSize: '1 serving',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });
  };
  
  // Save meal
  const saveMeal = () => {
    if (newMeal.foods.length === 0) return;
    
    const updatedMeals = [
      ...nutritionData.meals,
      {
        id: Date.now(),
        ...newMeal
      }
    ];
    
    const updatedNutritionData = {
      ...nutritionData,
      meals: updatedMeals
    };
    
    setNutritionData(updatedNutritionData);
    localStorage.setItem('nutrition', JSON.stringify(updatedNutritionData));
    
    setNewMeal({
      date: new Date().toISOString().split('T')[0],
      name: '',
      type: 'breakfast',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      foods: []
    });
  };
  
  if (!userData) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nutrition Tracking</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="meals" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            Meals
          </TabsTrigger>
          <TabsTrigger 
            value="add" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            Add Meal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="mb-8">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <CardHeader>
                  <CardTitle>Today's Nutrition</CardTitle>
                  <CardDescription>Daily progress towards your goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <div className="text-sm text-gray-500 mb-1">Calories</div>
                      <div className="text-2xl font-bold">{dailyTotals.calories} / {nutritionData.dailyGoals.calories}</div>
                      <Progress 
                        value={Math.min((dailyTotals.calories / nutritionData.dailyGoals.calories) * 100, 100)} 
                        className="h-2 mt-2" 
                      />
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <div className="text-sm text-gray-500 mb-1">Protein</div>
                      <div className="text-2xl font-bold">{dailyTotals.protein}g / {nutritionData.dailyGoals.protein}g</div>
                      <Progress 
                        value={Math.min((dailyTotals.protein / nutritionData.dailyGoals.protein) * 100, 100)} 
                        className="h-2 mt-2 bg-gray-100" 
                      />
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <div className="text-sm text-gray-500 mb-1">Carbs</div>
                      <div className="text-2xl font-bold">{dailyTotals.carbs}g / {nutritionData.dailyGoals.carbs}g</div>
                      <Progress 
                        value={Math.min((dailyTotals.carbs / nutritionData.dailyGoals.carbs) * 100, 100)} 
                        className="h-2 mt-2 bg-gray-100" 
                      />
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <div className="text-sm text-gray-500 mb-1">Fat</div>
                      <div className="text-2xl font-bold">{dailyTotals.fat}g / {nutritionData.dailyGoals.fat}g</div>
                      <Progress 
                        value={Math.min((dailyTotals.fat / nutritionData.dailyGoals.fat) * 100, 100)} 
                        className="h-2 mt-2 bg-gray-100" 
                      />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="meals" className="space-y-6">
          <div className="space-y-4">
            {todayMeals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No meals logged for today</p>
                <Button 
                  onClick={() => document.querySelector('[data-state="inactive"][value="add"]').click()}
                  className="mt-4"
                >
                  Add a Meal
                </Button>
              </div>
            ) : (
              todayMeals.map(meal => (
                <Card key={meal.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{meal.name || meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</CardTitle>
                        <CardDescription>{new Date(meal.date).toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge>{meal.calories} kcal</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {meal.foods.map((food, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <div>
                            <div className="font-medium">{food.name}</div>
                            <div className="text-sm text-gray-500">{food.servingSize}</div>
                          </div>
                          <div className="text-right">
                            <div>{food.calories} kcal</div>
                            <div className="text-xs text-gray-500">
                              P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-4 pt-2 border-t border-gray-200">
                      <div className="text-sm">Protein: {meal.protein}g</div>
                      <div className="text-sm">Carbs: {meal.carbs}g</div>
                      <div className="text-sm">Fat: {meal.fat}g</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="add" className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Add New Meal</CardTitle>
              <CardDescription>Log what you've eaten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <Input 
                    type="date" 
                    value={newMeal.date} 
                    onChange={(e) => setNewMeal({...newMeal, date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Meal Type</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    value={newMeal.type}
                    onChange={(e) => setNewMeal({...newMeal, type: e.target.value})}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Meal Name (Optional)</label>
                  <Input 
                    placeholder="e.g., Post-workout Lunch" 
                    value={newMeal.name} 
                    onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Foods</h3>
                
                <div className="space-y-4">
                  {newMeal.foods.map((food, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{food.name} ({food.servingSize})</span>
                        <span className="text-gray-600">{food.calories} kcal</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Food Name</label>
                      <Input 
                        placeholder="e.g., Chicken Breast" 
                        value={newFood.name} 
                        onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Serving Size</label>
                      <Input 
                        placeholder="e.g., 100g or 1 cup" 
                        value={newFood.servingSize} 
                        onChange={(e) => setNewFood({...newFood, servingSize: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Calories</label>
                      <Input 
                        type="number" 
                        placeholder="kcal" 
                        value={newFood.calories} 
                        onChange={(e) => setNewFood({...newFood, calories: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Protein (g)</label>
                      <Input 
                        type="number" 
                        placeholder="grams" 
                        value={newFood.protein} 
                        onChange={(e) => setNewFood({...newFood, protein: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Carbs (g)</label>
                      <Input 
                        type="number" 
                        placeholder="grams" 
                        value={newFood.carbs} 
                        onChange={(e) => setNewFood({...newFood, carbs: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Fat (g)</label>
                      <Input 
                        type="number" 
                        placeholder="grams" 
                        value={newFood.fat} 
                        onChange={(e) => setNewFood({...newFood, fat: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Button 
                        onClick={addFood}
                        className="w-full"
                        disabled={!newFood.name}
                      >
                        Add Food
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveMeal}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500"
                disabled={newMeal.foods.length === 0}
              >
                Save Meal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 