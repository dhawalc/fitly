import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2, Save, Target, Dumbbell, Footprints, Heart, Scale } from 'lucide-react';

export default function GoalsSettings() {
  const [goals, setGoals] = useState({
    steps: 10000,
    calories: 2500,
    activeMinutes: 30,
    workoutsPerWeek: 4,
    weight: {
      current: 187,
      target: 165,
      unit: 'lbs'
    },
    heartRate: {
      restingTarget: 60,
      maxTarget: 160
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success toast
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Daily Activity Goals
          </CardTitle>
          <CardDescription>
            Set your daily activity targets to track your progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="steps-goal">Daily Steps</Label>
                <span className="text-sm font-medium">{goals.steps.toLocaleString()}</span>
              </div>
              <Slider
                id="steps-goal"
                min={1000}
                max={20000}
                step={500}
                value={[goals.steps]}
                onValueChange={(value) => setGoals({...goals, steps: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                The recommended daily step count is 10,000 steps.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="calories-goal">Daily Calories</Label>
                <span className="text-sm font-medium">{goals.calories} cal</span>
              </div>
              <Slider
                id="calories-goal"
                min={1500}
                max={4000}
                step={50}
                value={[goals.calories]}
                onValueChange={(value) => setGoals({...goals, calories: value[0]})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="active-minutes-goal">Active Minutes</Label>
                <span className="text-sm font-medium">{goals.activeMinutes} min</span>
              </div>
              <Slider
                id="active-minutes-goal"
                min={10}
                max={120}
                step={5}
                value={[goals.activeMinutes]}
                onValueChange={(value) => setGoals({...goals, activeMinutes: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                The WHO recommends at least 30 minutes of moderate activity daily.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-2" />
            Workout Goals
          </CardTitle>
          <CardDescription>
            Set your workout frequency and intensity goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="workouts-per-week">Workouts Per Week</Label>
              <span className="text-sm font-medium">{goals.workoutsPerWeek}</span>
            </div>
            <Slider
              id="workouts-per-week"
              min={1}
              max={7}
              step={1}
              value={[goals.workoutsPerWeek]}
              onValueChange={(value) => setGoals({...goals, workoutsPerWeek: value[0]})}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scale className="h-5 w-5 mr-2" />
            Weight Goals
          </CardTitle>
          <CardDescription>
            Set your target weight and track your progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-weight">Current Weight</Label>
              <div className="flex">
                <Input 
                  id="current-weight" 
                  type="number" 
                  value={goals.weight.current}
                  onChange={(e) => setGoals({
                    ...goals, 
                    weight: {...goals.weight, current: parseInt(e.target.value) || 0}
                  })}
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                  {goals.weight.unit}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-weight">Target Weight</Label>
              <div className="flex">
                <Input 
                  id="target-weight" 
                  type="number" 
                  value={goals.weight.target}
                  onChange={(e) => setGoals({
                    ...goals, 
                    weight: {...goals.weight, target: parseInt(e.target.value) || 0}
                  })}
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                  {goals.weight.unit}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight-unit">Weight Unit</Label>
            <Select 
              value={goals.weight.unit}
              onValueChange={(value) => setGoals({
                ...goals, 
                weight: {...goals.weight, unit: value}
              })}
            >
              <SelectTrigger id="weight-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Heart Rate Goals
          </CardTitle>
          <CardDescription>
            Set your target heart rate zones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resting-hr">Target Resting Heart Rate</Label>
              <div className="flex">
                <Input 
                  id="resting-hr" 
                  type="number" 
                  value={goals.heartRate.restingTarget}
                  onChange={(e) => setGoals({
                    ...goals, 
                    heartRate: {...goals.heartRate, restingTarget: parseInt(e.target.value) || 0}
                  })}
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                  bpm
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-hr">Target Max Heart Rate</Label>
              <div className="flex">
                <Input 
                  id="max-hr" 
                  type="number" 
                  value={goals.heartRate.maxTarget}
                  onChange={(e) => setGoals({
                    ...goals, 
                    heartRate: {...goals.heartRate, maxTarget: parseInt(e.target.value) || 0}
                  })}
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                  bpm
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Goals
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 