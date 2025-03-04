import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Heart, Clock, Award, Share2 } from 'lucide-react';
import { Badge } from "../../components/ui/badge";

export default function WorkoutDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [workout, setWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    // Mock data - in a real app, you would fetch this from an API
    const mockWorkouts = [
      {
        id: '1',
        title: '30 Minute Full Body HIIT Workout',
        duration: 30,
        category: 'hiit',
        level: 'intermediate',
        youtubeId: 'ml6cT4AZdqI',
        thumbnail: 'https://i.ytimg.com/vi/ml6cT4AZdqI/maxresdefault.jpg',
        channel: 'SELF',
        favorite: true,
        description: 'This 30-minute HIIT workout is perfect for a quick, effective full-body session. It includes cardio and strength exercises to help you build muscle and burn fat.',
        calories: 300,
        equipment: ['None', 'Optional: Light Dumbbells']
      },
      {
        id: '2',
        title: '20 Minute Full Body Workout - Beginner Version',
        duration: 20,
        category: 'strength',
        level: 'beginner',
        youtubeId: 'UItWltVZZmE',
        thumbnail: 'https://i.ytimg.com/vi/UItWltVZZmE/maxresdefault.jpg',
        channel: 'MadFit',
        favorite: false,
        description: 'A beginner-friendly full body workout that requires no equipment. Perfect for those just starting their fitness journey.',
        calories: 200,
        equipment: ['None']
      },
      {
        id: '3',
        title: '45 Minute Yoga Flow for Total Relaxation',
        duration: 45,
        category: 'yoga',
        level: 'all',
        youtubeId: 'sTANio_2E0Q',
        thumbnail: 'https://i.ytimg.com/vi/sTANio_2E0Q/maxresdefault.jpg',
        channel: 'Yoga With Adriene',
        favorite: true,
        description: 'A calming yoga flow to help you relax and unwind. This practice focuses on deep stretching and mindful breathing.',
        calories: 150,
        equipment: ['Yoga Mat', 'Optional: Yoga Block']
      }
    ];
    
    const foundWorkout = mockWorkouts.find(w => w.id === id);
    setWorkout(foundWorkout);
    setIsLoading(false);
  }, [id]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (!workout) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workouts
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p>Workout not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'hiit':
        return 'bg-red-500 text-white';
      case 'strength':
        return 'bg-blue-500 text-white';
      case 'yoga':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const getLevelBadge = (level) => {
    switch (level) {
      case 'beginner':
        return { text: 'Beginner', color: 'bg-green-100 text-green-800 border-green-500' };
      case 'intermediate':
        return { text: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 border-yellow-500' };
      case 'advanced':
        return { text: 'Advanced', color: 'bg-red-100 text-red-800 border-red-500' };
      default:
        return { text: 'All Levels', color: 'bg-blue-100 text-blue-800 border-blue-500' };
    }
  };
  
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Workouts
      </Button>
      
      <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${workout.youtubeId}`}
          title={workout.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{workout.title}</CardTitle>
                  <CardDescription className="text-lg">{workout.channel}</CardDescription>
                </div>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5" fill={workout.favorite ? 'currentColor' : 'none'} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge className={getCategoryColor(workout.category)}>
                  {workout.category.toUpperCase()}
                </Badge>
                <Badge variant="outline" className={getLevelBadge(workout.level).color}>
                  {getLevelBadge(workout.level).text}
                </Badge>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{workout.duration} min</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>~{workout.calories} cal</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground mb-4">{workout.description}</p>
              
              <h3 className="text-lg font-semibold mb-2">Equipment Needed</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {workout.equipment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => router.push(`/workouts/${id}/start`)}>
                Start Workout
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Similar Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                More {workout.category} workouts will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 