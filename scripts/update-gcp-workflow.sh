#!/bin/bash

# Script to update the GCP deployment workflow

echo "Updating GCP deployment workflow..."

# Update the GitHub workflow file
cat > .github/workflows/deploy.yml << 'EOL'
name: Deploy to Google Cloud Run

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Google Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: ${{ secrets.GCP_PROJECT_ID }}
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        export_default_credentials: true
    
    - name: Build and push Docker image
      run: |
        gcloud auth configure-docker
        docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/fitness-app:${{ github.sha }} .
        docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/fitness-app:${{ github.sha }}
    
    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy fitness-app \
          --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/fitness-app:${{ github.sha }} \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated
EOL

echo "GCP deployment workflow updated successfully!" 