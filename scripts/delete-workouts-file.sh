#!/bin/bash

# Script to delete the problematic workouts.js file

echo "Deleting the problematic workouts.js file..."

# Check if the file exists
if [ -f "frontend/pages/workouts.js" ]; then
  # Remove the file
  rm frontend/pages/workouts.js
  echo "File deleted successfully!"
else
  echo "File not found. It may have been deleted already."
fi

# Make sure the workouts/index.js file exists
if [ -f "frontend/pages/workouts/index.js" ]; then
  echo "Workouts index file exists. Good!"
else
  echo "Warning: workouts/index.js file not found. This could cause issues."
fi

echo "Done!" 