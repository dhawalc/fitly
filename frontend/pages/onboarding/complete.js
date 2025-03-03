import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import OnboardingLayout from '../../components/onboarding/onboarding-layout';
import { AuthService } from "../../services/auth-service";

export default function OnboardingComplete() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Get user data from localStorage
    const user = AuthService.getCurrentUser();
    if (!user) {
      router.push('/welcome');
      return;
    }
    
    setUserData(user);
    
    // Check if this step should be accessible
    const onboardingStep = localStorage.getItem('onboardingStep');
    if (!onboardingStep || (onboardingStep !== 'complete' && onboardingStep !== '4')) {
      router.push('/onboarding/measurements');
    }
  }, [router]);
  
  const handleComplete = () => {
    // Update user data to mark onboarding as completed
    const updatedUserData = {
      ...userData,
      onboardingCompleted: true
    };
    
    // Save updated user data
    AuthService.updateUserProfile(updatedUserData);
    
    // Remove onboarding step from localStorage
    localStorage.removeItem('onboardingStep');
    
    // Navigate to dashboard
    router.push('/');
  };
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <OnboardingLayout step={4} totalSteps={4}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Welcome to Fitly!</CardTitle>
          <CardDescription className="text-center">
            You're all set to start your health and fitness journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Profile Created Successfully</h3>
            <p className="mt-2 text-sm text-gray-500">
              We've created your personalized health profile based on the information you provided.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800">What's Next?</h4>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• Track your daily nutrition and workouts</li>
              <li>• Monitor your body composition changes</li>
              <li>• Get AI-powered insights about your progress</li>
              <li>• Set and achieve your health and fitness goals</li>
            </ul>
          </div>
          
          <Button onClick={handleComplete} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
} 