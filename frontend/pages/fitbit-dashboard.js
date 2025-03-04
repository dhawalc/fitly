import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { FitbitService } from "../services/fitbit-service";
import FitbitLogo from "../components/fitbit-logo";

export default function FitbitDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('activity');
  const [isLoading, setIsLoading] = useState(true);
  const [fitbitData, setFitbitData] = useState({
    activity: null,
    sleep: null,
    weight: null,
    heart: null
  });
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
    fetchFitbitData();
  }, [router.query.tab]);
  
  const fetchFitbitData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data;
      
      switch (activeTab) {
        case 'activity':
          data = await FitbitService.getActivityData();
          setFitbitData(prev => ({ ...prev, activity: data }));
          break;
        case 'sleep':
          data = await FitbitService.getSleepData();
          setFitbitData(prev => ({ ...prev, sleep: data }));
          break;
        case 'weight':
          data = await FitbitService.getWeightData();
          setFitbitData(prev => ({ ...prev, weight: data }));
          break;
        case 'heart':
          data = await FitbitService.getHeartRateData();
          setFitbitData(prev => ({ ...prev, heart: data }));
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} data:`, error);
      setError(`Failed to load ${activeTab} data. Please try again later.`);
      
      // For testing, set mock data
      setMockData();
    } finally {
      setIsLoading(false);
    }
  };
  
  const setMockData = () => {
    // Mock data for testing UI
    const mockData = {
      activity: {
        summary: {
          steps: 8432,
          distance: 6.7,
          calories: 2145,
          activeMinutes: 42
        }
      },
      sleep: {
        summary: {
          totalMinutesAsleep: 412,
          totalTimeInBed: 480,
          efficiency: 86
        },
        stages: {
          deep: 90,
          light: 240,
          rem: 82,
          wake: 68
        }
      },
      weight: {
        current: 165.2,
        goal: 160,
        history: [
          { date: '2023-07-01', weight: 168.5 },
          { date: '2023-07-15', weight: 166.8 },
          { date: '2023-08-01', weight: 165.2 }
        ]
      },
      heart: {
        restingHeartRate: 68,
        zones: {
          outOfRange: { min: 30, max: 91, minutes: 1220 },
          fatBurn: { min: 91, max: 127, minutes: 180 },
          cardio: { min: 127, max: 154, minutes: 35 },
          peak: { min: 154, max: 220, minutes: 5 }
        }
      }
    };
    
    setFitbitData(prev => ({ 
      ...prev, 
      [activeTab]: mockData[activeTab] 
    }));
  };
  
  const renderActivityData = () => {
    const activity = fitbitData.activity;
    if (!activity) return <p>No activity data available</p>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-600">{activity.summary.steps.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">Daily Goal: 10,000 steps</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-600">{activity.summary.distance} mi</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-600">{activity.summary.calories.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Minutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-600">{activity.summary.activeMinutes}</div>
            <p className="text-sm text-gray-500 mt-2">Daily Goal: 30 minutes</p>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderSleepData = () => {
    const sleep = fitbitData.sleep;
    if (!sleep) return <p>No sleep data available</p>;
    
    // Calculate hours and minutes
    const hours = Math.floor(sleep.summary.totalMinutesAsleep / 60);
    const minutes = sleep.summary.totalMinutesAsleep % 60;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sleep Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-600">{hours}h {minutes}m</div>
            <p className="text-sm text-gray-500 mt-2">Total sleep time</p>
            
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Sleep Efficiency</span>
                <span className="text-sm font-medium">{sleep.summary.efficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${sleep.summary.efficiency}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sleep Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-center p-4 bg-indigo-100 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{sleep.stages.deep} min</div>
                  <p className="text-sm text-gray-500 mt-1">Deep</p>
                </div>
              </div>
              <div>
                <div className="text-center p-4 bg-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{sleep.stages.light} min</div>
                  <p className="text-sm text-gray-500 mt-1">Light</p>
                </div>
              </div>
              <div>
                <div className="text-center p-4 bg-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{sleep.stages.rem} min</div>
                  <p className="text-sm text-gray-500 mt-1">REM</p>
                </div>
              </div>
              <div>
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{sleep.stages.wake} min</div>
                  <p className="text-sm text-gray-500 mt-1">Awake</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderHeartData = () => {
    const heart = fitbitData.heart;
    if (!heart) return <p>No heart rate data available</p>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Resting Heart Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-600">{heart.restingHeartRate} bpm</div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Heart Rate Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Out of Range ({heart.zones.outOfRange.min}-{heart.zones.outOfRange.max} bpm)</span>
                  <span className="text-sm font-medium">{Math.round(heart.zones.outOfRange.minutes / 60 * 10) / 10} hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gray-400 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Fat Burn ({heart.zones.fatBurn.min}-{heart.zones.fatBurn.max} bpm)</span>
                  <span className="text-sm font-medium">{Math.round(heart.zones.fatBurn.minutes / 60 * 10) / 10} hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${(heart.zones.fatBurn.minutes / heart.zones.outOfRange.minutes) * 100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Cardio ({heart.zones.cardio.min}-{heart.zones.cardio.max} bpm)</span>
                  <span className="text-sm font-medium">{heart.zones.cardio.minutes} minutes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: `${(heart.zones.cardio.minutes / heart.zones.outOfRange.minutes) * 100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Peak ({heart.zones.peak.min}-{heart.zones.peak.max} bpm)</span>
                  <span className="text-sm font-medium">{heart.zones.peak.minutes} minutes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-400 h-2.5 rounded-full" style={{ width: `${(heart.zones.peak.minutes / heart.zones.outOfRange.minutes) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderWeightData = () => {
    const weight = fitbitData.weight;
    if (!weight) return <p>No weight data available</p>;
    
    return (
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-600">{weight.current} lbs</div>
            <p className="text-sm text-gray-500 mt-2">Goal: {weight.goal} lbs</p>
            
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">
                  {Math.round((1 - (weight.current - weight.goal) / (weight.history[0].weight - weight.goal)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${Math.round((1 - (weight.current - weight.goal) / (weight.history[0].weight - weight.goal)) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weight History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weight.history.map((entry, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="font-medium">{entry.weight} lbs</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FitbitLogo className="h-8 mr-3" />
        Fitbit Dashboard
      </h1>
      
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        router.push(`/fitbit-dashboard?tab=${value}`, undefined, { shallow: true });
      }}>
        <TabsList className="mb-6">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="heart">Heart Rate</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          {isLoading ? (
            <div className="text-center py-8">Loading activity data...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            renderActivityData()
          )}
        </TabsContent>
        
        <TabsContent value="sleep">
          {isLoading ? (
            <div className="text-center py-8">Loading sleep data...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            renderSleepData()
          )}
        </TabsContent>
        
        <TabsContent value="heart">
          {isLoading ? (
            <div className="text-center py-8">Loading heart rate data...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            renderHeartData()
          )}
        </TabsContent>
        
        <TabsContent value="weight">
          {isLoading ? (
            <div className="text-center py-8">Loading weight data...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            renderWeightData()
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 