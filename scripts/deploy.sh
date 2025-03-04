#!/bin/bash

# Script to push changes to GitHub and deploy to GCP

# Get the current branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# Check if there are any changes to commit
if [[ -z $(git status -s) ]]; then
  echo "No changes to commit."
  read -p "Do you want to deploy the current version? (y/n): " DEPLOY_CURRENT
  if [[ $DEPLOY_CURRENT != "y" ]]; then
    exit 0
  fi
else
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
fi

# Deploy to GCP
echo "Deploying to GCP..."

# Build the Docker image
docker build -t gcr.io/$GCP_PROJECT_ID/fitness-app:latest .

# Push the Docker image to GCR
docker push gcr.io/$GCP_PROJECT_ID/fitness-app:latest

# Deploy to Cloud Run
gcloud run deploy fitness-app \
  --image gcr.io/$GCP_PROJECT_ID/fitness-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

echo "Deployment completed successfully!" 