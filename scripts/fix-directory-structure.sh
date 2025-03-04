#!/bin/bash

# Script to fix the directory structure for the workouts pages

echo "Fixing directory structure for workouts pages..."

# Make sure the workouts directory exists
if [ ! -d "frontend/pages/workouts" ]; then
  echo "Creating workouts directory..."
  mkdir -p frontend/pages/workouts
fi

# Check if workouts.js exists and delete it
if [ -f "frontend/pages/workouts.js" ]; then
  echo "Removing workouts.js file..."
  rm frontend/pages/workouts.js
fi

# Check if workouts/index.js exists
if [ ! -f "frontend/pages/workouts/index.js" ]; then
  echo "Warning: workouts/index.js file not found. Creating a basic version..."
  
  # Create a basic version of the file
  cat > frontend/pages/workouts/index.js << 'EOL'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Workouts Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the workouts page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
EOL
fi

echo "Directory structure fixed!"
echo "Restarting the development server..."
cd frontend && npm run dev 