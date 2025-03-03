import React from 'react';
import { useRouter } from 'next/router';
import { Progress } from "../ui/progress";

export default function OnboardingLayout({ children, step, totalSteps }) {
  const router = useRouter();
  
  // Calculate progress percentage
  const progress = ((step) / totalSteps) * 100;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600">HealthTrack</h1>
          <p className="mt-2 text-gray-600">
            Setting up your personalized health experience
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {children}
      </div>
    </div>
  );
} 