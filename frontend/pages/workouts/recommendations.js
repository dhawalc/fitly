import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { WorkoutRecommendationService } from "../../services/workout-recommendation-service";

export default function WorkoutRecommendations() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      
      // Get recommendations based on user data
      const workouts = WorkoutRecommendationService.getRecommendations(parsedUser);
      setRecommendations(workouts);
    } else {
      // Get default recommendations if no user data
      const workouts = WorkoutRecommendationService.getRecommendations(null);
      setRecommendations(workouts);
    }
  }, []);
  
  // Filter recommendations based on active tab
  const filteredRecommendations = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(workout => {
        if (activeTab === 'short' && workout.duration <= 20) return true;
        if (activeTab === 'medium' && workout.duration > 20 && workout.duration <= 40) return true;
        if (activeTab === 'long' && workout.duration > 40) return true;
        return false;
      });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Workout Recommendations</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          These workouts are recommended based on your profile, goals, and fitness level.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="short">Short (≤20 min)</TabsTrigger>
          <TabsTrigger value="medium">Medium (21-40 min)</TabsTrigger>
          <TabsTrigger value="long">Long (&gt;40 min)</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map(workout => (
          <Card key={workout.id} className="overflow-hidden">
            <div className="relative pb-[56.25%] bg-gray-100">
              <img 
                src={workout.thumbnail} 
                alt={workout.title}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                {workout.duration} min
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{workout.title}</CardTitle>
              <CardDescription className="text-xs">{workout.channel}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <p className="text-sm text-gray-600">{workout.description}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                className="w-full"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${workout.youtubeId}`, '_blank')}
              >
                Watch on YouTube
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {filteredRecommendations.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No workouts found for this filter. Try another category.</p>
          </div>
        )}
      </div>
    </div>
  );
} 