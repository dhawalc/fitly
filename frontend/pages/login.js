import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import GoogleSignIn from '../components/auth/google-signin';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/');
    }
  }, [router]);
  
  const handleGoogleSuccess = (user) => {
    router.push('/');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600">HealthTrack</h1>
          <p className="mt-3 text-lg text-gray-600">
            Your AI-powered health and fitness companion
          </p>
        </div>
        
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              <span className="text-blue-600">Fitly</span>
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your Fitly account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full max-w-xs">
              <GoogleSignIn onSuccess={handleGoogleSuccess} />
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            HealthTrack helps you monitor your fitness, nutrition, and overall health with AI-powered insights
          </p>
        </div>
      </div>
    </div>
  );
} 