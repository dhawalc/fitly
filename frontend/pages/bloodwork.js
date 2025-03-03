import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function BloodWork() {
  // Sample data - in a real app, this would come from your API
  const [bloodWorkData, setBloodWorkData] = useState({
    lastUpdated: "2023-08-15",
    history: [
      { date: "2023-08-15", id: "test1" },
      { date: "2023-05-10", id: "test2" },
      { date: "2023-02-22", id: "test3" },
      { date: "2022-11-05", id: "test4" }
    ],
    currentTest: {
      date: "2023-08-15",
      metrics: [
        { 
          category: "Metabolic",
          tests: [
            { name: "Glucose", value: 95, unit: "mg/dL", range: "70-99", status: "normal", trend: "stable", previous: 94 },
            { name: "HbA1c", value: 5.2, unit: "%", range: "4.0-5.6", status: "normal", trend: "stable", previous: 5.3 },
            { name: "Insulin", value: 8.2, unit: "μIU/mL", range: "2.6-24.9", status: "normal", trend: "stable", previous: 8.5 }
          ]
        },
        { 
          category: "Lipids",
          tests: [
            { name: "Total Cholesterol", value: 185, unit: "mg/dL", range: "<200", status: "normal", trend: "improving", previous: 195 },
            { name: "LDL", value: 110, unit: "mg/dL", range: "<100", status: "borderline", trend: "improving", previous: 120 },
            { name: "HDL", value: 55, unit: "mg/dL", range: ">40", status: "normal", trend: "stable", previous: 54 },
            { name: "Triglycerides", value: 100, unit: "mg/dL", range: "<150", status: "normal", trend: "improving", previous: 110 }
          ]
        },
        { 
          category: "Hormones",
          tests: [
            { name: "Testosterone (Total)", value: 650, unit: "ng/dL", range: "280-1100", status: "normal", trend: "stable", previous: 640 },
            { name: "Free Testosterone", value: 15.2, unit: "pg/mL", range: "8.7-25.1", status: "normal", trend: "stable", previous: 14.8 },
            { name: "Estradiol", value: 25, unit: "pg/mL", range: "10-40", status: "normal", trend: "stable", previous: 26 },
            { name: "Cortisol", value: 15, unit: "μg/dL", range: "5-23", status: "normal", trend: "stable", previous: 16 }
          ]
        },
        { 
          category: "Vitamins & Minerals",
          tests: [
            { name: "Vitamin D", value: 28, unit: "ng/mL", range: "30-100", status: "low", trend: "improving", previous: 22 },
            { name: "Vitamin B12", value: 550, unit: "pg/mL", range: "200-900", status: "normal", trend: "stable", previous: 540 },
            { name: "Iron", value: 95, unit: "μg/dL", range: "65-175", status: "normal", trend: "stable", previous: 90 },
            { name: "Magnesium", value: 2.1, unit: "mg/dL", range: "1.7-2.2", status: "normal", trend: "stable", previous: 2.0 }
          ]
        },
        { 
          category: "Thyroid",
          tests: [
            { name: "TSH", value: 2.1, unit: "μIU/mL", range: "0.4-4.0", status: "normal", trend: "stable", previous: 2.2 },
            { name: "Free T4", value: 1.3, unit: "ng/dL", range: "0.8-1.8", status: "normal", trend: "stable", previous: 1.2 },
            { name: "Free T3", value: 3.2, unit: "pg/mL", range: "2.3-4.2", status: "normal", trend: "stable", previous: 3.1 }
          ]
        }
      ],
      recommendations: [
        "Increase Vitamin D intake to reach optimal levels (>30 ng/mL). Consider supplementation of 5000 IU daily.",
        "Continue monitoring LDL cholesterol. Consider increasing omega-3 fatty acids in your diet.",
        "Your testosterone levels are optimal for muscle maintenance and fat loss.",
        "All metabolic markers are in healthy ranges, indicating good insulin sensitivity."
      ]
    }
  });

  // State for selected test
  const [selectedTest, setSelectedTest] = useState(bloodWorkData.history[0].id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Blood Work</h1>
        <p className="text-gray-600">Track and analyze your blood test results</p>
      </header>
      
      {/* Test History Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Test History</CardTitle>
          <CardDescription>Select a test to view detailed results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {bloodWorkData.history.map((test) => (
              <Button 
                key={test.id}
                variant={selectedTest === test.id ? "default" : "outline"}
                onClick={() => setSelectedTest(test.id)}
              >
                {test.date}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">Upload New Test Results</Button>
        </CardFooter>
      </Card>
      
      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>Last updated: {bloodWorkData.currentTest.date}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={bloodWorkData.currentTest.metrics[0].category.toLowerCase()}>
            <TabsList className="mb-4 flex flex-wrap">
              {bloodWorkData.currentTest.metrics.map((category) => (
                <TabsTrigger 
                  key={category.category} 
                  value={category.category.toLowerCase()}
                >
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {bloodWorkData.currentTest.metrics.map((category) => (
              <TabsContent key={category.category} value={category.category.toLowerCase()}>
                <div className="space-y-4">
                  {category.tests.map((test, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{test.name}</h3>
                        <Badge 
                          className={
                            test.status === 'normal' ? 'bg-green-100 text-green-800' : 
                            test.status === 'low' ? 'bg-yellow-100 text-yellow-800' : 
                            test.status === 'borderline' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {test.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-2xl font-bold">{test.value} <span className="text-sm font-normal text-gray-500">{test.unit}</span></p>
                          <p className="text-sm text-gray-500">Reference range: {test.range}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Previous: {test.previous} {test.unit}</p>
                          <p className="text-sm">
                            {test.trend === 'improving' ? (
                              <span className="text-green-600">↗ Improving</span>
                            ) : test.trend === 'declining' ? (
                              <span className="text-red-600">↘ Declining</span>
                            ) : (
                              <span className="text-blue-600">→ Stable</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Based on your latest blood test results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bloodWorkData.currentTest.recommendations.map((recommendation, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p>{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Generate Detailed Health Report</Button>
        </CardFooter>
      </Card>
      
      {/* Trends Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Trends Analysis</CardTitle>
          <CardDescription>Track changes in key biomarkers over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border rounded-lg">
            <p className="text-gray-500">Biomarker trends chart will be displayed here</p>
            {/* In a real implementation, we would use a chart library like Chart.js or Recharts */}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Metabolic</Button>
          <Button variant="outline">Lipids</Button>
          <Button variant="outline">Hormones</Button>
          <Button variant="outline">Vitamins</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 