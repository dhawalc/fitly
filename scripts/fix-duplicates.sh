#!/bin/bash

# Script to fix duplicate pages without changing their content

echo "Fixing duplicate pages issue..."

# Check if both workouts.js and workouts/index.js exist
if [ -f "frontend/pages/workouts.js" ] && [ -f "frontend/pages/workouts/index.js" ]; then
  echo "Duplicate workouts pages detected. Removing workouts/index.js..."
  rm -f frontend/pages/workouts/index.js
  rmdir --ignore-fail-on-non-empty frontend/pages/workouts
fi

# Check if both settings.js and settings/index.js exist
if [ -f "frontend/pages/settings.js" ] && [ -f "frontend/pages/settings/index.js" ]; then
  echo "Duplicate settings pages detected. Removing settings/index.js..."
  rm -f frontend/pages/settings/index.js
  rmdir --ignore-fail-on-non-empty frontend/pages/settings
fi

echo "Duplicate pages issue fixed!"
echo "The original workouts.js and settings.js files have been preserved." 