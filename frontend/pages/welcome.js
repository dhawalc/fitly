import React from 'react';
import { useRouter } from 'next/router';
import { Button } from "../components/ui/button";
import GoogleSignIn from '../components/auth/google-signin';

export default function Welcome() {
  const router = useRouter();
  
  const handleGoogleSuccess = (user) => {
    // After successful sign-in, redirect to the onboarding flow
    router.push('/onboarding/profile');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Fitly</h1>
            <p className="text-xl text-gray-600 mb-8">Your Personal Health & Fitness Companion</p>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Track your progress, get personalized insights, and achieve your fitness goals with Fitly.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Button onClick={() => router.push('/login')} className="px-8 py-2">
                  Sign In
                </Button>
                <Button onClick={() => router.push('/signup')} variant="outline" className="px-8 py-2">
                  Create Account
                </Button>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-gray-600">
                Monitor your weight, body composition, workouts, and nutrition in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
              <p className="text-gray-600">
                Get personalized recommendations and insights based on your health data.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Reports</h3>
              <p className="text-gray-600">
                Generate detailed health reports to share with your healthcare providers.
              </p>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="italic text-gray-600 mb-4">
                  "HealthTrack has completely transformed my fitness journey. The AI insights helped me understand what was working and what wasn't."
                </p>
                <p className="font-medium">— Michael S.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="italic text-gray-600 mb-4">
                  "I've tried many fitness apps, but none have provided the level of personalization that HealthTrack offers. It's like having a personal trainer and nutritionist in your pocket."
                </p>
                <p className="font-medium">— Sarah L.</p>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to start your health journey?</h2>
            <div className="max-w-xs mx-auto">
              <GoogleSignIn onSuccess={handleGoogleSuccess} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 