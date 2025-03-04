# Fitness Tracking Application

A comprehensive fitness tracking application built with Next.js and Node.js.

## Features

- User authentication
- Workout tracking
- Activity monitoring
- Progress visualization
- Personalized recommendations

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fitness-app.git
cd fitness-app
```

2. Install dependencies
```bash
npm install
cd frontend && npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Start the development server
```bash
npm run dev
```

## Deployment

### Deploying to Google Cloud Run

1. Make sure you have the Google Cloud SDK installed

2. Authenticate with Google Cloud
```bash
gcloud auth login
```

3. Set your project ID
```bash
gcloud config set project YOUR_PROJECT_ID
```

4. Build and deploy
```bash
./scripts/deploy.sh
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 