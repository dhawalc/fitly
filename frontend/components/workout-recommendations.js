import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { WorkoutRecommendationService } from "../services/workout-recommendation-service";
import { useRouter } from 'next/router';
import { toast } from "../components/ui/use-toast";

export default function WorkoutRecommendations({ userData }) {
  const router = useRouter();
  const recommendations = WorkoutRecommendationService.getRecommendations(userData);
  
  // Show only top 2 recommendations on dashboard
  const topRecommendations = recommendations.slice(0, 2);
  
  const markAsCompleted = (workout) => {
    // Get existing workout history
    const storedHistory = localStorage.getItem('workoutHistory');
    let workoutHistory = storedHistory ? JSON.parse(storedHistory) : [];
    
    // Add the workout to history
    const completedWorkout = {
      ...workout,
      date: new Date().toISOString(),
      completed: true
    };
    
    workoutHistory = [completedWorkout, ...workoutHistory];
    
    // Save back to localStorage
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    
    // Show success toast
    toast({
      title: "Workout Completed!",
      description: "Your workout has been added to your history.",
      variant: "success",
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recommended Workouts</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/workouts/recommendations')}
        >
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topRecommendations.map(workout => (
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
              <CardTitle className="text-base line-clamp-1">{workout.title}</CardTitle>
              <CardDescription className="text-xs">{workout.channel}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <p className="text-sm text-gray-600 line-clamp-2">{workout.description}</p>
            </CardContent>
            <CardFooter className="pt-0 flex flex-col space-y-2">
              <Button 
                className="w-full"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${workout.youtubeId}`, '_blank')}
              >
                Watch on YouTube
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => markAsCompleted(workout)}
              >
                Mark as Completed
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 