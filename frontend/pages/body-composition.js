import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Weight, Ruler, TrendingUp, Plus } from 'lucide-react';
import { AuthService } from "../services/auth-service";
import { AIInsightsService } from "../services/ai-insights-service";
import AIInsightsComponent from "../components/ai/ai-insights";

export default function BodyCompositionPage() {
  const [measurements, setMeasurements] = useState({
    weight: {
      current: 187,
      previous: 192,
      goal: 165,
      unit: 'lbs',
      history: [
        { date: '2023-07-01', value: 192 },
        { date: '2023-07-08', value: 190 },
        { date: '2023-07-15', value: 189 },
        { date: '2023-07-22', value: 188 },
        { date: '2023-07-29', value: 187 }
      ]
    },
    bodyFat: {
      current: 22,
      previous: 24,
      goal: 15,
      unit: '%',
      history: [
        { date: '2023-07-01', value: 24 },
        { date: '2023-07-08', value: 23.5 },
        { date: '2023-07-15', value: 23 },
        { date: '2023-07-22', value: 22.5 },
        { date: '2023-07-29', value: 22 }
      ]
    },
    muscleMass: {
      current: 137,
      previous: 134,
      goal: 142,
      unit: 'lbs',
      history: [
        { date: '2023-07-01', value: 134 },
        { date: '2023-07-08', value: 135 },
        { date: '2023-07-15', value: 135.5 },
        { date: '2023-07-22', value: 136 },
        { date: '2023-07-29', value: 137 }
      ]
    }
  });
  
  const [newMeasurement, setNewMeasurement] = useState({
    type: 'weight',
    value: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurement(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddMeasurement = () => {
    if (!newMeasurement.value) return;
    
    const value = parseFloat(newMeasurement.value);
    if (isNaN(value)) return;
    
    const type = newMeasurement.type;
    const newEntry = { date: newMeasurement.date, value };
    
    setMeasurements(prev => {
      const updatedHistory = [...prev[type].history, newEntry].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      return {
        ...prev,
        [type]: {
          ...prev[type],
          previous: prev[type].current,
          current: value,
          history: updatedHistory
        }
      };
    });
    
    // Reset form
    setNewMeasurement({
      type,
      value: '',
      date: new Date().toISOString().split('T')[0]
    });
  };
  
  const calculateProgress = (current, goal, previous) => {
    if (goal === current) return 100;
    if (goal > previous) {
      // Gaining (e.g., muscle mass)
      const totalNeeded = goal - previous;
      const gained = current - previous;
      return Math.min(100, Math.max(0, (gained / totalNeeded) * 100));
    } else {
      // Losing (e.g., weight, body fat)
      const totalNeeded = previous - goal;
      const lost = previous - current;
      return Math.min(100, Math.max(0, (lost / totalNeeded) * 100));
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Body Composition</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weight Card */}
        <Card>
          <CardHeader>
            <CardTitle>Weight</CardTitle>
            <CardDescription>Current progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {measurements.weight.current} {measurements.weight.unit}
              <span className="text-sm font-normal text-green-500 ml-2">
                {measurements.weight.current < measurements.weight.previous ? 
                  `- ${(measurements.weight.previous - measurements.weight.current).toFixed(1)} ${measurements.weight.unit}` : 
                  `+ ${(measurements.weight.current - measurements.weight.previous).toFixed(1)} ${measurements.weight.unit}`
                }
              </span>
            </div>
            <Progress 
              value={calculateProgress(
                measurements.weight.current, 
                measurements.weight.goal, 
                measurements.weight.previous
              )} 
              className="h-2 mb-2"
            />
            <div className="text-sm text-muted-foreground">
              Goal: {measurements.weight.goal} {measurements.weight.unit} 
              ({calculateProgress(
                measurements.weight.current, 
                measurements.weight.goal, 
                measurements.weight.previous
              ).toFixed(0)}% Complete)
            </div>
          </CardContent>
        </Card>
        
        {/* Body Fat Card */}
        <Card>
          <CardHeader>
            <CardTitle>Body Fat</CardTitle>
            <CardDescription>Current progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {measurements.bodyFat.current} {measurements.bodyFat.unit}
              <span className="text-sm font-normal text-green-500 ml-2">
                {measurements.bodyFat.current < measurements.bodyFat.previous ? 
                  `- ${(measurements.bodyFat.previous - measurements.bodyFat.current).toFixed(1)} ${measurements.bodyFat.unit}` : 
                  `+ ${(measurements.bodyFat.current - measurements.bodyFat.previous).toFixed(1)} ${measurements.bodyFat.unit}`
                }
              </span>
            </div>
            <Progress 
              value={calculateProgress(
                measurements.bodyFat.current, 
                measurements.bodyFat.goal, 
                measurements.bodyFat.previous
              )} 
              className="h-2 mb-2"
            />
            <div className="text-sm text-muted-foreground">
              Goal: {measurements.bodyFat.goal} {measurements.bodyFat.unit} 
              ({calculateProgress(
                measurements.bodyFat.current, 
                measurements.bodyFat.goal, 
                measurements.bodyFat.previous
              ).toFixed(0)}% Complete)
            </div>
          </CardContent>
        </Card>
        
        {/* Muscle Mass Card */}
        <Card>
          <CardHeader>
            <CardTitle>Muscle Mass</CardTitle>
            <CardDescription>Current progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {measurements.muscleMass.current} {measurements.muscleMass.unit}
              <span className="text-sm font-normal text-green-500 ml-2">
                {measurements.muscleMass.current > measurements.muscleMass.previous ? 
                  `+ ${(measurements.muscleMass.current - measurements.muscleMass.previous).toFixed(1)} ${measurements.muscleMass.unit}` : 
                  `- ${(measurements.muscleMass.previous - measurements.muscleMass.current).toFixed(1)} ${measurements.muscleMass.unit}`
                }
              </span>
            </div>
            <Progress 
              value={calculateProgress(
                measurements.muscleMass.current, 
                measurements.muscleMass.goal, 
                measurements.muscleMass.previous
              )} 
              className="h-2 mb-2"
            />
            <div className="text-sm text-muted-foreground">
              Goal: {measurements.muscleMass.goal} {measurements.muscleMass.unit} 
              ({calculateProgress(
                measurements.muscleMass.current, 
                measurements.muscleMass.goal, 
                measurements.muscleMass.previous
              ).toFixed(0)}% Complete)
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add New Measurement */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Measurement</CardTitle>
          <CardDescription>Record your latest body composition data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="measurement-type">Measurement Type</Label>
              <select
                id="measurement-type"
                name="type"
                value={newMeasurement.type}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="weight">Weight</option>
                <option value="bodyFat">Body Fat</option>
                <option value="muscleMass">Muscle Mass</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="measurement-value">Value</Label>
              <div className="flex items-center">
                <Input
                  id="measurement-value"
                  name="value"
                  type="number"
                  step="0.1"
                  placeholder={`Enter ${newMeasurement.type} value`}
                  value={newMeasurement.value}
                  onChange={handleInputChange}
                />
                <span className="ml-2">{measurements[newMeasurement.type].unit}</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="measurement-date">Date</Label>
              <Input
                id="measurement-date"
                name="date"
                type="date"
                value={newMeasurement.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleAddMeasurement} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Measurement
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Measurement History</CardTitle>
          <CardDescription>Track your progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weight">
            <TabsList className="mb-4">
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="bodyFat">Body Fat</TabsTrigger>
              <TabsTrigger value="muscleMass">Muscle Mass</TabsTrigger>
            </TabsList>
            
            {Object.keys(measurements).map(key => (
              <TabsContent key={key} value={key}>
                <div className="h-[300px] flex items-end space-x-2">
                  {measurements[key].history.map((entry, index) => {
                    const max = Math.max(...measurements[key].history.map(e => e.value));
                    const min = Math.min(...measurements[key].history.map(e => e.value));
                    const range = max - min || 1;
                    const height = ((entry.value - min) / range) * 200 + 50;
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full ${key === 'muscleMass' ? 'bg-blue-500/80' : 'bg-primary/80'} rounded-t-sm`} 
                          style={{ height: `${height}px` }}
                        ></div>
                        <div className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-xs font-medium mt-2">
                          {entry.value} {measurements[key].unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 