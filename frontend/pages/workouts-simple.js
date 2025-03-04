import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useRouter } from 'next/router';

export default function SimpleWorkoutsPage() {
  const router = useRouter();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Workouts (Simple Page)</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Temporary Workouts Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This is a temporary page while we fix the workouts section.</p>
          <p className="mb-4">Please run the fix-workouts-pages.sh script to restore full functionality.</p>
          <Button onClick={() => router.push('/')}>
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 