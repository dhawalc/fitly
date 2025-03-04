import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Sparkles, RefreshCw, Lightbulb } from 'lucide-react';

export default function AIInsightsComponent({ insights, isLoading, onRefresh }) {
  // Check if insights is an array (as expected in some places) or an object (as expected in others)
  const isInsightsArray = Array.isArray(insights);
  
  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Health Insights
          </CardTitle>
          <CardDescription>Personalized recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Analyzing your health data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Handle empty insights
  if (!insights || (isInsightsArray && insights.length === 0) || (!isInsightsArray && Object.keys(insights).length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Health Insights
          </CardTitle>
          <CardDescription>Personalized recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Lightbulb className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Add more health data to get personalized insights</p>
            {onRefresh && (
              <Button variant="outline" className="mt-4" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Insights
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render array-type insights
  if (isInsightsArray) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Health Insights
          </CardTitle>
          <CardDescription>Personalized recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p>{insight}</p>
              </div>
            ))}
          </div>
          {onRefresh && (
            <Button variant="outline" className="w-full mt-4" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Insights
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Render object-type insights with safe access
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Health Insights
        </CardTitle>
        <CardDescription>Personalized recommendations based on your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.progress && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800">{insights.progress?.title || 'Progress'}</h3>
              <p className="mt-2">{insights.progress?.content || 'No progress data available.'}</p>
            </div>
          )}
          
          {insights.recommendations && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800">{insights.recommendations?.title || 'Recommendations'}</h3>
              <p className="mt-2">{insights.recommendations?.content || 'No recommendations available.'}</p>
            </div>
          )}
          
          {insights.warnings && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800">{insights.warnings?.title || 'Warnings'}</h3>
              <p className="mt-2">{insights.warnings?.content || 'No warnings to display.'}</p>
            </div>
          )}
          
          {!insights.progress && !insights.recommendations && !insights.warnings && (
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground">No specific insights available at this time.</p>
            </div>
          )}
        </div>
        
        {onRefresh && (
          <Button variant="outline" className="w-full mt-4" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Insights
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 