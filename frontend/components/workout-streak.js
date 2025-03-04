import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';
import parseISO from 'date-fns/parseISO';
import { Flame, Award, Calendar } from 'lucide-react';

export default function WorkoutStreak() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastWorkout, setLastWorkout] = useState(null);
  const [streakStatus, setStreakStatus] = useState('inactive');
  
  useEffect(() => {
    // Load workout history from localStorage
    const storedHistory = localStorage.getItem('workoutHistory');
    if (!storedHistory) return;
    
    const workoutHistory = JSON.parse(storedHistory);
    if (workoutHistory.length === 0) return;
    
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...workoutHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Set last workout
    setLastWorkout(sortedWorkouts[0]);
    
    // Calculate current streak
    let streak = 0;
    let dateToCheck = new Date();
    let foundWorkoutToday = false;
    
    // Check if there's a workout today
    const todayWorkouts = sortedWorkouts.filter(workout => 
      isToday(parseISO(workout.date))
    );
    
    if (todayWorkouts.length > 0) {
      foundWorkoutToday = true;
      streak = 1;
    }
    
    // If no workout today, check if there was one yesterday
    if (!foundWorkoutToday) {
      const yesterdayWorkouts = sortedWorkouts.filter(workout => 
        isYesterday(parseISO(workout.date))
      );
      
      if (yesterdayWorkouts.length === 0) {
        // Streak is broken
        setCurrentStreak(0);
        setStreakStatus('broken');
        
        // Calculate longest streak
        calculateLongestStreak(sortedWorkouts);
        return;
      }
      
      // There was a workout yesterday, streak is at risk
      streak = 1;
      setStreakStatus('at-risk');
    } else {
      setStreakStatus('active');
    }
    
    // Continue counting streak for previous days
    let currentDate = new Date(dateToCheck);
    currentDate.setDate(currentDate.getDate() - (foundWorkoutToday ? 1 : 2));
    
    let i = foundWorkoutToday ? 1 : 0;
    while (i < sortedWorkouts.length) {
      const workoutDate = parseISO(sortedWorkouts[i].date);
      
      // Check if this workout is from the day we're looking for
      if (format(workoutDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (format(workoutDate, 'yyyy-MM-dd') < format(currentDate, 'yyyy-MM-dd')) {
        // This workout is from an earlier day, streak is broken
        break;
      }
      
      i++;
    }
    
    setCurrentStreak(streak);
    
    if (foundWorkoutToday) {
      setStreakStatus('active');
    } else if (streak > 0) {
      setStreakStatus('at-risk');
    } else {
      setStreakStatus('broken');
    }
    
    // Calculate longest streak
    calculateLongestStreak(sortedWorkouts);
  }, []);
  
  const calculateLongestStreak = (workouts) => {
    if (workouts.length === 0) {
      setLongestStreak(0);
      return;
    }
    
    // Get unique dates
    const uniqueDates = [...new Set(workouts.map(workout => 
      format(parseISO(workout.date), 'yyyy-MM-dd')
    ))];
    
    // Sort dates (oldest first)
    const daysWithWorkouts = uniqueDates.sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    let maxStreak = 1;
    let currentMaxStreak = 1;
    
    for (let i = 1; i < daysWithWorkouts.length; i++) {
      const currentDay = parseISO(daysWithWorkouts[i]);
      const prevDay = parseISO(daysWithWorkouts[i-1]);
      
      const dayDiff = differenceInDays(currentDay, prevDay);
      
      if (dayDiff === 1) {
        // Consecutive days
        currentMaxStreak++;
      } else {
        // Streak broken
        maxStreak = Math.max(maxStreak, currentMaxStreak);
        currentMaxStreak = 1;
      }
    }
    
    maxStreak = Math.max(maxStreak, currentMaxStreak);
    setLongestStreak(maxStreak);
  };
  
  const getStreakIcon = () => {
    if (currentStreak >= 30) return <Flame className="h-6 w-6 text-orange-500" />;
    if (currentStreak >= 14) return <Flame className="h-6 w-6 text-orange-400" />;
    if (currentStreak >= 7) return <Flame className="h-6 w-6 text-orange-300" />;
    return <Flame className="h-6 w-6 text-gray-400" />;
  };
  
  const getStreakMessage = () => {
    if (streakStatus === 'active') {
      if (currentStreak === 1) return "You've started your streak! Keep it going!";
      if (currentStreak < 7) return `Great job! You're on a ${currentStreak}-day streak!`;
      if (currentStreak < 14) return `Impressive! A ${currentStreak}-day streak!`;
      if (currentStreak < 30) return `Amazing discipline! ${currentStreak} days in a row!`;
      return `Incredible! You're on fire with a ${currentStreak}-day streak!`;
    } else if (streakStatus === 'at-risk') {
      return "Don't break your streak! Work out today to keep it going!";
    } else {
      return "Start a new streak today by completing a workout!";
    }
  };
  
  const getCardBorderColor = () => {
    if (streakStatus === 'active') return 'border-l-green-500';
    if (streakStatus === 'at-risk') return 'border-l-yellow-500';
    return 'border-l-gray-300 dark:border-l-gray-700';
  };
  
  return (
    <Card className={`border-l-4 ${getCardBorderColor()} bg-card hover:shadow-md transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <span className="mr-2">{getStreakIcon()}</span>
          <span>Workout Streak: {currentStreak} days</span>
        </CardTitle>
        <CardDescription className="text-foreground/80">{getStreakMessage()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Longest Streak</p>
            <p className="font-semibold flex items-center">
              <Award className="h-4 w-4 mr-1 text-yellow-500" />
              {longestStreak} days
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Workout</p>
            <p className="font-semibold flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
              {lastWorkout ? format(parseISO(lastWorkout.date), 'MMM d, yyyy') : 'None'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 