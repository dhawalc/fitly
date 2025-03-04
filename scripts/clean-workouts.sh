#!/bin/bash

# Script to completely remove all workouts-related files

echo "Cleaning up all workouts-related files..."

# Remove all workouts files
rm -f frontend/pages/workouts.js
rm -f frontend/pages/workouts-backup.js
rm -rf frontend/pages/workouts
rm -f frontend/pages/workouts-simple.js

echo "All workouts files have been removed."
echo "Now we'll create a fresh, simple workouts page."

# Create a simple workouts page
cat > frontend/pages/workouts.js << 'EOL'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Workouts Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a simple workouts page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
EOL

echo "Simple workouts page created successfully!"
echo "Restarting the development server..."
cd frontend && npm run dev 