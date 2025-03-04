import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Filter, Clock, Dumbbell, Play, Heart } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

export default function WorkoutsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  
  // Mock data for workouts
  useEffect(() => {
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
        favorite: true
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
        favorite: false
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
        favorite: true
      }
    ];
    
    setWorkouts(mockWorkouts);
    setFilteredWorkouts(mockWorkouts);
  }, []);
  
  // Filter workouts based on search query and active tab
  useEffect(() => {
    let filtered = [...workouts];
    
    // Filter by category
    if (activeTab !== 'all') {
      filtered = filtered.filter(workout => workout.category === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(workout => 
        workout.title.toLowerCase().includes(query) ||
        workout.channel.toLowerCase().includes(query)
      );
    }
    
    setFilteredWorkouts(filtered);
  }, [workouts, activeTab, searchQuery]);
  
  const handleStartWorkout = (workout) => {
    // Save to localStorage for history
    const now = new Date().toISOString();
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    const newWorkoutEntry = {
      id: workout.id,
      title: workout.title,
      date: now,
      duration: workout.duration,
      youtubeId: workout.youtubeId,
      completed: true,
      channel: workout.channel
    };
    
    workoutHistory.push(newWorkoutEntry);
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    
    // Open YouTube video in a new tab
    window.open(`https://www.youtube.com/watch?v=${workout.youtubeId}`, '_blank');
  };
  
  const toggleFavorite = (id) => {
    setWorkouts(workouts.map(workout => 
      workout.id === id 
        ? { ...workout, favorite: !workout.favorite } 
        : workout
    ));
  };
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'hiit':
        return 'bg-red-500';
      case 'strength':
        return 'bg-blue-500';
      case 'yoga':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getLevelBadge = (level) => {
    switch (level) {
      case 'beginner':
        return { text: 'Beginner', color: 'text-green-500 border-green-500' };
      case 'intermediate':
        return { text: 'Intermediate', color: 'text-yellow-500 border-yellow-500' };
      case 'advanced':
        return { text: 'Advanced', color: 'text-red-500 border-red-500' };
      default:
        return { text: 'All Levels', color: 'text-blue-500 border-blue-500' };
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workouts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="hiit">HIIT</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="yoga">Yoga</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map(workout => (
            <Card key={workout.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src={workout.thumbnail} 
                  alt={workout.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    size="lg" 
                    className="rounded-full"
                    onClick={() => handleStartWorkout(workout)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Workout
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <button 
                    className={`rounded-full p-2 ${workout.favorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => toggleFavorite(workout.id)}
                  >
                    <Heart className="h-4 w-4" fill={workout.favorite ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${getCategoryColor(workout.category)}`}></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{workout.title}</CardTitle>
                <CardDescription>{workout.channel}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{workout.duration} min</span>
                  </div>
                  <Badge variant="outline" className={getLevelBadge(workout.level).color}>
                    {getLevelBadge(workout.level).text}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => handleStartWorkout(workout)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Workout
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tabs>
    </div>
  );
} 