import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
      <Card>
        <CardHeader>
          <CardTitle>Activity Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your activity tracking and history will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
} 