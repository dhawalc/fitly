# Fitly - Health & Fitness Tracking App

Fitly is a comprehensive health and fitness tracking application that helps users monitor their progress, get personalized AI-powered insights, and achieve their fitness goals.

## Features

- **User Authentication**: Secure sign-up and login functionality
- **Personalized Dashboard**: View your key health metrics at a glance
- **Body Composition Tracking**: Monitor weight, body fat, muscle mass, and other measurements
- **Nutrition Tracking**: Log and analyze your daily nutrition intake
- **Workout Logging**: Record and track your workouts
- **AI-Powered Insights**: Get personalized recommendations based on your data
- **Goal Setting**: Set and track progress toward your health and fitness goals

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Authentication**: JWT-based authentication
- **AI Integration**: OpenAI API for personalized insights
- **Data Visualization**: Chart.js for progress tracking

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fitly.git
   cd fitly
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The app can be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js applications.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 