#!/bin/bash

# Script to fix the duplicate page issue

# Check if the workouts.js file exists
if [ -f "frontend/pages/workouts.js" ]; then
  echo "Removing duplicate workouts.js file..."
  rm frontend/pages/workouts.js
  echo "File removed successfully!"
else
  echo "No duplicate workouts.js file found."
fi

# Restart the development server
echo "Restarting the development server..."
npm run dev 