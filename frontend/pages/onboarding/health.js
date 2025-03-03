import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import OnboardingLayout from '../../components/onboarding/onboarding-layout';
import { AuthService } from "../../services/auth-service";

export default function HealthSetup() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    medicalConditions: [],
    allergies: '',
    medications: '',
    bodyFat: '',
    restingHeartRate: ''
  });
  
  const medicalConditionsList = [
    'diabetes', 'hypertension', 'heart-disease', 'asthma', 
    'thyroid-disorder', 'arthritis', 'depression', 'anxiety'
  ];
  
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
    if (!onboardingStep || parseInt(onboardingStep) < 2) {
      router.push('/onboarding/goals');
    }
  }, [router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMedicalConditionChange = (condition) => {
    setFormData(prev => {
      const current = [...prev.medicalConditions];
      if (current.includes(condition)) {
        return { ...prev, medicalConditions: current.filter(c => c !== condition) };
      } else {
        return { ...prev, medicalConditions: [...current, condition] };
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user data with form data
    const updatedUserData = {
      ...userData,
      medicalConditions: formData.medicalConditions,
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
      medications: formData.medications.split(',').map(m => m.trim()).filter(m => m),
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
      restingHeartRate: formData.restingHeartRate ? parseInt(formData.restingHeartRate) : null
    };
    
    // Save updated user data
    AuthService.updateUserProfile(updatedUserData);
    
    // Set onboarding step to 'measurements' instead of a number
    localStorage.setItem('onboardingStep', 'measurements');
    
    // Navigate to next step
    router.push('/onboarding/measurements');
  };
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <OnboardingLayout step={3} totalSteps={4}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Health Information</CardTitle>
          <CardDescription className="text-center">
            This helps us provide more accurate recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have any medical conditions? (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {medicalConditionsList.map((condition) => (
                  <div key={condition} className="flex items-center">
                    <input
                      id={condition}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData.medicalConditions.includes(condition)}
                      onChange={() => handleMedicalConditionChange(condition)}
                    />
                    <label htmlFor={condition} className="ml-2 block text-sm text-gray-700 capitalize">
                      {condition.replace(/-/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                Any food allergies or intolerances? (comma separated)
              </label>
              <input
                id="allergies"
                name="allergies"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="e.g., peanuts, dairy, gluten"
                value={formData.allergies}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                Current medications (comma separated)
              </label>
              <input
                id="medications"
                name="medications"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="e.g., metformin, lisinopril"
                value={formData.medications}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 mb-1">
                  Body Fat % (if known)
                </label>
                <input
                  id="bodyFat"
                  name="bodyFat"
                  type="number"
                  min="5"
                  max="50"
                  step="0.1"
                  className="w-full p-2 border rounded-md"
                  value={formData.bodyFat}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="restingHeartRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Resting Heart Rate (if known)
                </label>
                <div className="flex items-center">
                  <input
                    id="restingHeartRate"
                    name="restingHeartRate"
                    type="number"
                    min="40"
                    max="120"
                    className="w-full p-2 border rounded-md"
                    value={formData.restingHeartRate}
                    onChange={handleChange}
                  />
                  <span className="ml-2">bpm</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-4">
                Note: All health information is optional but helps us provide more personalized recommendations.
              </p>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
} 