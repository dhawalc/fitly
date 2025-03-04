import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function WorkoutsBackupPage() {
  const router = useRouter();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Workouts (Backup Page)</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Workouts Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This is a backup page for the workouts section.</p>
          <Button onClick={() => router.push('/workouts/index')}>
            Try Original Workouts Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 