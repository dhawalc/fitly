#!/bin/bash

# Script to ensure all health app features are preserved

echo "Ensuring all health app features are preserved..."

# Check if the AI insights component exists
if [ ! -f "frontend/components/ai/ai-insights.js" ]; then
  echo "Creating AI insights component..."
  mkdir -p frontend/components/ai
  
  cat > frontend/components/ai/ai-insights.js << 'EOL'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Lightbulb } from 'lucide-react';

export default function AIInsightsComponent({ insights, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            AI Health Insights
          </CardTitle>
          <CardDescription>Personalized recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">Loading your personalized insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            AI Health Insights
          </CardTitle>
          <CardDescription>Personalized recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">Add more health data to get personalized insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-primary" />
          AI Health Insights
        </CardTitle>
        <CardDescription>Personalized recommendations based on your data</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
              <p>{insight}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
EOL

  echo "AI insights component created successfully!"
fi

# Check if the AI insights service exists
if [ ! -f "frontend/services/ai-insights-service.js" ]; then
  echo "Creating AI insights service..."
  mkdir -p frontend/services
  
  cat > frontend/services/ai-insights-service.js << 'EOL'
// AI Insights Service
// This service handles generating AI-powered health insights based on user data

export class AIInsightsService {
  static async generateInsights(userData) {
    try {
      // In a real app, this would call an API endpoint that uses OpenAI or another AI service
      // For now, we'll simulate a response based on the user data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const insights = [];
      
      // Generate insights based on weight data
      if (userData.weight) {
        const { current, previous, goal } = userData.weight;
        
        if (current > previous) {
          insights.push(`You've gained ${(current - previous).toFixed(1)} lbs since your last weigh-in. Consider increasing your activity level.`);
        } else if (current < previous) {
          insights.push(`Great job! You've lost ${(previous - current).toFixed(1)} lbs since your last weigh-in.`);
        }
        
        if (goal && current > goal) {
          const percentToGoal = (((current - goal) / (previous - goal)) * 100).toFixed(0);
          insights.push(`You're ${percentToGoal}% of the way to your weight goal. Keep up the good work!`);
        }
      }
      
      // Generate insights based on workout data
      if (userData.workouts && userData.workouts.length > 0) {
        const workoutTypes = userData.workouts.map(w => w.type);
        const uniqueTypes = [...new Set(workoutTypes)];
        
        if (uniqueTypes.length === 1) {
          insights.push(`You've been focusing on ${uniqueTypes[0]} workouts. Consider adding variety to your routine for better overall fitness.`);
        }
        
        const totalWorkouts = userData.workouts.length;
        if (totalWorkouts < 3) {
          insights.push(`You've completed ${totalWorkouts} workouts recently. Aim for at least 3-4 workouts per week for optimal results.`);
        } else if (totalWorkouts >= 5) {
          insights.push(`You've completed ${totalWorkouts} workouts recently. Make sure you're allowing enough recovery time between sessions.`);
        }
      } else {
        insights.push("You haven't logged any workouts yet. Start with 2-3 sessions per week to build consistency.");
      }
      
      // Generate insights based on nutrition data
      if (userData.nutrition) {
        const { avgProtein, avgCalories } = userData.nutrition;
        
        if (avgProtein < 100) {
          insights.push(`Your average protein intake (${avgProtein}g) is below the recommended amount. Aim for at least 0.8g per pound of body weight.`);
        }
        
        if (avgCalories < 1500) {
          insights.push(`Your average calorie intake (${avgCalories}) seems low. Make sure you're eating enough to fuel your workouts and recovery.`);
        }
      }
      
      // Generate insights based on sleep data
      if (userData.sleep) {
        const { avgDuration, avgQuality } = userData.sleep;
        
        if (avgDuration < 7) {
          insights.push(`You're averaging ${avgDuration} hours of sleep per night. Try to get at least 7-8 hours for optimal recovery and performance.`);
        }
        
        if (avgQuality < 70) {
          insights.push(`Your sleep quality score (${avgQuality}%) indicates room for improvement. Consider establishing a consistent sleep schedule.`);
        }
      }
      
      // If we don't have enough insights, add some general ones
      if (insights.length < 3) {
        insights.push("Consistency is key to achieving your health and fitness goals. Try to establish a regular routine.");
        insights.push("Don't forget to stay hydrated! Aim for at least 64oz of water daily.");
        insights.push("Consider tracking your nutrition to ensure you're getting the right balance of macronutrients.");
      }
      
      return insights;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return ["Unable to generate insights at this time. Please try again later."];
    }
  }
}
EOL

  echo "AI insights service created successfully!"
fi

echo "Health app features preserved!" 