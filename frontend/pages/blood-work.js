import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Droplet, Calendar, Plus, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { AIInsightsService } from "../services/ai-insights-service";
import AIInsightsComponent from "../components/ai/ai-insights";

export default function BloodWorkPage() {
  const [bloodWorkData, setBloodWorkData] = useState({
    latestTest: {
      date: '2023-07-15',
      results: [
        { name: 'Total Cholesterol', value: 185, unit: 'mg/dL', range: '125-200', status: 'normal' },
        { name: 'HDL Cholesterol', value: 62, unit: 'mg/dL', range: '> 40', status: 'optimal' },
        { name: 'LDL Cholesterol', value: 110, unit: 'mg/dL', range: '< 130', status: 'normal' },
        { name: 'Triglycerides', value: 95, unit: 'mg/dL', range: '< 150', status: 'normal' },
        { name: 'Glucose (Fasting)', value: 92, unit: 'mg/dL', range: '70-99', status: 'normal' },
        { name: 'Hemoglobin A1C', value: 5.4, unit: '%', range: '< 5.7', status: 'normal' },
        { name: 'Vitamin D', value: 38, unit: 'ng/mL', range: '30-100', status: 'normal' },
        { name: 'Testosterone (Total)', value: 650, unit: 'ng/dL', range: '300-1000', status: 'normal' },
        { name: 'Thyroid Stimulating Hormone', value: 2.1, unit: 'mIU/L', range: '0.4-4.0', status: 'normal' }
      ]
    }
  });
  
  const [insights, setInsights] = useState([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  
  useEffect(() => {
    // Load AI insights
    const loadInsights = async () => {
      setIsLoadingInsights(true);
      try {
        const userData = {
          bloodWork: bloodWorkData.latestTest
        };
        const generatedInsights = await AIInsightsService.generateInsights(userData);
        setInsights(generatedInsights);
      } catch (error) {
        console.error('Error loading insights:', error);
      } finally {
        setIsLoadingInsights(false);
      }
    };
    
    loadInsights();
  }, [bloodWorkData]);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'optimal':
        return <Badge className="bg-green-500">Optimal</Badge>;
      case 'normal':
        return <Badge className="bg-blue-500">Normal</Badge>;
      case 'high':
        return <Badge className="bg-yellow-500">High</Badge>;
      case 'low':
        return <Badge className="bg-yellow-500">Low</Badge>;
      case 'critical':
        return <Badge className="bg-red-500">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Blood Work</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Latest Blood Test Results</CardTitle>
              <CardDescription>
                Test Date: {new Date(bloodWorkData.latestTest.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bloodWorkData.latestTest.results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between pb-2 border-b">
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground">Reference Range: {result.range}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-medium">{result.value} {result.unit}</div>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                View Historical Results
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <AIInsightsComponent insights={insights} isLoading={isLoadingInsights} />
        </div>
      </div>
    </div>
  );
} 