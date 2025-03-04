import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import { BarChart2, Clock, Calendar, TrendingUp } from 'lucide-react';

export default function WorkoutProgressChart() {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('week');
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // Load workout history from localStorage
    const storedHistory = localStorage.getItem('workoutHistory');
    if (storedHistory) {
      setWorkoutHistory(JSON.parse(storedHistory));
    } else {
      // Mock data if no history exists
      const mockHistory = [
        {
          id: '1',
          title: '30 Minute Full Body HIIT Workout',
          date: '2023-08-15T10:30:00Z',
          duration: 30,
          youtubeId: 'ml6cT4AZdqI',
          completed: true,
          channel: 'SELF'
        },
        {
          id: '2',
          title: '20 Minute Full Body Workout - Beginner Version',
          date: '2023-08-12T09:15:00Z',
          duration: 20,
          youtubeId: 'UItWltVZZmE',
          completed: true,
          channel: 'MadFit'
        },
        {
          id: '3',
          title: '45 Minute Yoga Flow',
          date: '2023-08-10T16:45:00Z',
          duration: 45,
          youtubeId: 'sTANio_2E0Q',
          completed: true,
          channel: 'Yoga With Adriene'
        }
      ];
      setWorkoutHistory(mockHistory);
      localStorage.setItem('workoutHistory', JSON.stringify(mockHistory));
    }
  }, []);
  
  useEffect(() => {
    // Generate chart data based on active tab
    if (workoutHistory.length === 0) return;
    
    let days = 7;
    if (activeTab === 'month') days = 30;
    if (activeTab === 'year') days = 365;
    
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    
    // Get all days in the interval
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Count workouts per day
    const data = daysInRange.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const workoutsOnDay = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.date);
        return format(workoutDate, 'yyyy-MM-dd') === dayStr;
      });
      
      return {
        date: dayStr,
        count: workoutsOnDay.length,
        duration: workoutsOnDay.reduce((sum, workout) => sum + workout.duration, 0)
      };
    });
    
    setChartData(data);
  }, [workoutHistory, activeTab]);
  
  // Calculate stats
  const totalWorkouts = workoutHistory.length;
  const totalDuration = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
  const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
  
  // Find the max value for scaling
  const maxCount = Math.max(...chartData.map(d => d.count), 1);
  
  return (
    <Card className="overflow-hidden border-none shadow-lg dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Workout Progress</CardTitle>
        <CardDescription>Track your workout consistency over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="week" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Week</TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Month</TabsTrigger>
            <TabsTrigger value="year" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Year</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="h-48 flex items-end space-x-1 mb-6">
          {chartData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center group relative">
              <div 
                className="w-full bg-gradient-to-t from-primary/70 to-primary rounded-t transition-all duration-300 group-hover:from-primary/90 group-hover:to-primary"
                style={{ 
                  height: `${(day.count / maxCount) * 100}%`,
                  minHeight: day.count > 0 ? '4px' : '0'
                }}
              ></div>
              <span className="text-xs mt-1 text-muted-foreground">
                {format(new Date(day.date), activeTab === 'year' ? 'MMM' : 'd')}
              </span>
              
              {/* Tooltip */}
              {day.count > 0 && (
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-popover text-popover-foreground text-xs rounded px-2 py-1 shadow-lg">
                    <p className="font-medium">{format(new Date(day.date), 'MMM d, yyyy')}</p>
                    <p>{day.count} workout{day.count !== 1 ? 's' : ''}</p>
                    <p>{day.duration} minutes</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">Total Workouts</p>
            <p className="text-2xl font-bold text-foreground">{totalWorkouts}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">Total Minutes</p>
            <p className="text-2xl font-bold text-foreground">{totalDuration}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">Avg. Duration</p>
            <p className="text-2xl font-bold text-foreground">{averageDuration} min</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 