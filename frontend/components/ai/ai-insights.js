import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AIInsightsService } from "../../services/ai-insights-service";

export default function AIInsightsComponent({ insights, isLoading, userData, healthMetrics, onRefresh }) {
  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Default refresh behavior if no onRefresh prop is provided
      try {
        const newInsights = await AIInsightsService.generateInsights(userData, healthMetrics);
        // Since we can't update the insights state here, we'll just log it
        console.log('New insights generated:', newInsights);
      } catch (error) {
        console.error('Error refreshing insights:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>AI Health Insights</CardTitle>
          <CardDescription>
            Generating personalized recommendations based on your data...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!insights) {
    return (
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>AI Health Insights</CardTitle>
          <CardDescription>
            Personalized recommendations based on your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Unable to generate insights at this time.</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>AI Health Insights</CardTitle>
        <CardDescription>
          Personalized recommendations based on your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800">{insights.progress.title}</h3>
            <p className="mt-2">{insights.progress.content}</p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-medium text-purple-800">{insights.workout.title}</h3>
            <p className="mt-2">{insights.workout.content}</p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800">{insights.nutrition.title}</h3>
            <p className="mt-2">{insights.nutrition.content}</p>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800">{insights.health.title}</h3>
            <p className="mt-2">{insights.health.content}</p>
          </div>
          
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <h3 className="font-medium text-indigo-800">{insights.sleep.title}</h3>
            <p className="mt-2">{insights.sleep.content}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleRefresh}>
          Refresh Insights
        </Button>
        <Button>
          Generate Comprehensive Report
        </Button>
      </CardFooter>
    </Card>
  );
} 