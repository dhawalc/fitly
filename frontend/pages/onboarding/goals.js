import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import OnboardingLayout from '../../components/onboarding/onboarding-layout';
import { AuthService } from "../../services/auth-service";

export default function GoalsSetup() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    goal: 'fat-loss',
    activityLevel: 'moderate',
    dietPreferences: []
  });
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/welcome');
      return;
    }
    
    setUserData(JSON.parse(storedUser));
    
    // Check if this step should be accessible
    const onboardingStep = localStorage.getItem('onboardingStep');
    if (!onboardingStep || parseInt(onboardingStep) < 1) {
      router.push('/onboarding/profile');
    }
  }, [router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDietPreferenceChange = (preference) => {
    setFormData(prev => {
      const current = [...prev.dietPreferences];
      if (current.includes(preference)) {
        return { ...prev, dietPreferences: current.filter(p => p !== preference) };
      } else {
        return { ...prev, dietPreferences: [...current, preference] };
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user data with form data
    const updatedUserData = {
      ...userData,
      goal: formData.goal,
      activityLevel: formData.activityLevel,
      dietPreferences: formData.dietPreferences
    };
    
    // Save updated user data
    AuthService.updateUserProfile(updatedUserData);
    
    // Set onboarding step to 'health' instead of a number
    localStorage.setItem('onboardingStep', 'health');
    
    // Navigate to next step
    router.push('/onboarding/health');
  };
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <OnboardingLayout step={2} totalSteps={4}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Your Goals & Preferences</CardTitle>
          <CardDescription className="text-center">
            Help us understand what you want to achieve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                What is your primary goal?
              </label>
              <select
                id="goal"
                name="goal"
                className="w-full p-2 border rounded-md"
                value={formData.goal}
                onChange={handleChange}
              >
                <option value="fat-loss">Fat Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Maintain Current Weight</option>
                <option value="general-health">Improve Overall Health</option>
                <option value="athletic-performance">Improve Athletic Performance</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                How active are you?
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                className="w-full p-2 border rounded-md"
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Lightly active (light exercise 1-3 days/week)</option>
                <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
                <option value="active">Very active (hard exercise 6-7 days/week)</option>
                <option value="very-active">Extra active (very hard exercise & physical job)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diet Preferences (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'high-protein', 'low-carb', 'vegetarian', 'vegan', 
                  'keto', 'paleo', 'intermittent-fasting', 'mediterranean'
                ].map((diet) => (
                  <div key={diet} className="flex items-center">
                    <input
                      id={diet}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData.dietPreferences.includes(diet)}
                      onChange={() => handleDietPreferenceChange(diet)}
                    />
                    <label htmlFor={diet} className="ml-2 block text-sm text-gray-700 capitalize">
                      {diet.replace(/-/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
} 