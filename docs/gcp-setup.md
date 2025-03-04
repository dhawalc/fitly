# Setting Up the Fitness App on Google Cloud Platform

This guide will walk you through setting up the Fitness App on Google Cloud Platform (GCP).

## Prerequisites

1. A GCP account with billing enabled
2. Google Cloud SDK installed locally
3. Docker installed locally

## Steps

### 1. Create a New GCP Project

```bash
gcloud projects create fitness-app-project --name="Fitness App"
gcloud config set project fitness-app-project
```

### 2. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable run.googleapis.com
```

### 3. Create a Service Account for GitHub Actions

```bash
gcloud iam service-accounts create github-actions
gcloud projects add-iam-policy-binding fitness-app-project \
    --member="serviceAccount:github-actions@fitness-app-project.iam.gserviceaccount.com" \
    --role="roles/editor"
```

### 4. Create and Download a Service Account Key

```bash
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@fitness-app-project.iam.gserviceaccount.com
```

### 5. Add the Service Account Key to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets
3. Add a new secret named `GCP_SA_KEY` with the contents of the `key.json` file
4. Add another secret named `GCP_PROJECT_ID` with your GCP project ID

### 6. Deploy Manually for the First Time

```bash
docker build -t gcr.io/fitness-app-project/fitness-app:initial .
docker push gcr.io/fitness-app-project/fitness-app:initial

gcloud run deploy fitness-app \
    --image gcr.io/fitness-app-project/fitness-app:initial \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

### 7. Verify the Deployment

After the deployment is complete, you'll receive a URL where your application is hosted. Visit this URL to verify that your application is running correctly.

## Continuous Deployment

With the GitHub Actions workflow set up, any push to the main branch will trigger a new deployment to Cloud Run. 