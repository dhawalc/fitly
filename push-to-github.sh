#!/bin/bash

# Initialize Git repository if not already initialized
if [ ! -d .git ]; then
  git init
  echo "Git repository initialized."
fi

# Add all files to Git
git add .

# Commit changes
git commit -m "Initial commit - Fitly health and fitness app"

# Check if remote origin exists
if git remote | grep -q "origin"; then
  echo "Remote 'origin' already exists."
else
  # Prompt for GitHub repository URL
  echo "Enter your GitHub repository URL (e.g., https://github.com/yourusername/fitly.git):"
  read repo_url
  
  # Add remote origin
  git remote add origin $repo_url
  echo "Remote 'origin' added."
fi

# Push to GitHub
git push -u origin main || git push -u origin master

echo "Code pushed to GitHub successfully!" 