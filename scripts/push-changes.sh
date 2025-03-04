#!/bin/bash

# Script to push changes to the repository after major updates

# Get the current branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# Check if there are any changes to commit
if [[ -z $(git status -s) ]]; then
  echo "No changes to commit."
  exit 0
fi

# Prompt for commit message
echo "Enter commit message:"
read COMMIT_MESSAGE

# Add all changes
git add .

# Commit changes
git commit -m "$COMMIT_MESSAGE"

# Push changes to the current branch
git push origin $BRANCH_NAME

echo "Changes pushed to $BRANCH_NAME successfully!" 