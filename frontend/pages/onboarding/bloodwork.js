import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import OnboardingLayout from '../../components/onboarding/onboarding-layout';

export default function BloodworkSetup() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [hasBloodwork, setHasBloodwork] = useState(null);
  const [formData, setFormData] = useState({
    glucose: '',
    cholesterol: '',
    hdl: '',
    ldl: '',
    triglycerides: '',
    vitaminD: '',
    testosterone: ''
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
    if (!onboardingStep || parseInt(onboardingStep) < 3) {
      router.push('/onboarding/health');
    }
  }, [router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleHasBloodworkChange = (value) => {
    setHasBloodwork(value);
    
    if (!value) {
      // If user doesn't have bloodwork, clear the form
      setFormData({
        glucose: '',
        cholesterol: '',
        hdl: '',
        ldl: '',
        triglycerides: '',
        vitaminD: '',
        testosterone: ''
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save bloodwork data if user has it
    let updatedUser = { ...userData };
    
    if (hasBloodwork) {
      updatedUser.bloodwork = {
        glucose: formData.glucose ? parseFloat(formData.glucose) : null,
        cholesterol: formData.cholesterol ? parseFloat(formData.cholesterol) : null,
        hdl: formData.hdl ? parseFloat(formData.hdl) : null,
        ldl: formData.ldl ? parseFloat(formData.ldl) : null,
        triglycerides: formData.triglycerides ? parseFloat(formData.triglycerides) : null,
        vitaminD: formData.vitaminD ? parseFloat(formData.vitaminD) : null,
        testosterone: formData.testosterone ? parseFloat(formData.testosterone) : null,
        date: new Date().toISOString()
      };
    }
    
    // Mark onboarding as completed
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('onboardingStep', '4');
    localStorage.setItem('profileSetup', 'completed');
    
    // Save user data to database (in a real app)
    saveUserToDatabase(updatedUser);
    
    // Redirect to dashboard
    router.push('/');
  };
  
  // Mock function to simulate saving user to database
  const saveUserToDatabase = async (user) => {
    // In a real app, this would be an API call to save the user data
    console.log('Saving user to database:', user);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Encrypt sensitive data before storing (in a real app)
        const encryptedUser = {
          ...user,
          // Remove sensitive data from localStorage
          medicalConditions: undefined,
          allergies: undefined,
          medications: undefined,
          bloodwork: undefined
        };
        
        // Store only non-sensitive data in localStorage
        localStorage.setItem('user', JSON.stringify(encryptedUser));
        
        // Store a flag indicating sensitive data exists on the server
        localStorage.setItem('hasSensitiveData', 'true');
        
        resolve({ success: true });
      }, 1000);
    });
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
          <CardTitle className="text-center">Blood Work Information</CardTitle>
          <CardDescription className="text-center">
            This helps us provide more accurate health insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Do you have recent blood test results you'd like to share? This helps us provide more personalized health recommendations.
            </p>
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant={hasBloodwork === true ? "default" : "outline"}
                onClick={() => handleHasBloodworkChange(true)}
              >
                Yes, I have results
              </Button>
              <Button 
                type="button" 
                variant={hasBloodwork === false ? "default" : "outline"}
                onClick={() => handleHasBloodworkChange(false)}
              >
                No, skip this step
              </Button>
            </div>
          </div>
          
          {hasBloodwork === true && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="glucose" className="block text-sm font-medium text-gray-700 mb-1">
                    Fasting Glucose (mg/dL)
                  </label>
                  <input
                    id="glucose"
                    name="glucose"
                    type="number"
                    min="50"
                    max="300"
                    className="w-full p-2 border rounded-md"
                    value={formData.glucose}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="cholesterol" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Cholesterol (mg/dL)
                  </label>
                  <input
                    id="cholesterol"
                    name="cholesterol"
                    type="number"
                    min="100"
                    max="400"
                    className="w-full p-2 border rounded-md"
                    value={formData.cholesterol}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hdl" className="block text-sm font-medium text-gray-700 mb-1">
                    HDL Cholesterol (mg/dL)
                  </label>
                  <input
                    id="hdl"
                    name="hdl"
                    type="number"
                    min="20"
                    max="100"
                    className="w-full p-2 border rounded-md"
                    value={formData.hdl}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="ldl" className="block text-sm font-medium text-gray-700 mb-1">
                    LDL Cholesterol (mg/dL)
                  </label>
                  <input
                    id="ldl"
                    name="ldl"
                    type="number"
                    min="50"
                    max="300"
                    className="w-full p-2 border rounded-md"
                    value={formData.ldl}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="triglycerides" className="block text-sm font-medium text-gray-700 mb-1">
                    Triglycerides (mg/dL)
                  </label>
                  <input
                    id="triglycerides"
                    name="triglycerides"
                    type="number"
                    min="50"
                    max="500"
                    className="w-full p-2 border rounded-md"
                    value={formData.triglycerides}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="vitaminD" className="block text-sm font-medium text-gray-700 mb-1">
                    Vitamin D (ng/mL)
                  </label>
                  <input
                    id="vitaminD"
                    name="vitaminD"
                    type="number"
                    min="10"
                    max="100"
                    className="w-full p-2 border rounded-md"
                    value={formData.vitaminD}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="testosterone" className="block text-sm font-medium text-gray-700 mb-1">
                  Testosterone (ng/dL) {userData.gender === 'female' ? '(for women: 15-70 ng/dL)' : ''}
                </label>
                <input
                  id="testosterone"
                  name="testosterone"
                  type="number"
                  min={userData.gender === 'female' ? "10" : "200"}
                  max={userData.gender === 'female' ? "100" : "1200"}
                  className="w-full p-2 border rounded-md"
                  value={formData.testosterone}
                  onChange={handleChange}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Complete Setup
              </Button>
            </form>
          )}
          
          {hasBloodwork === false && (
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-6">
                No problem! You can always add your blood work results later in your profile settings.
              </p>
              <Button onClick={handleSubmit} className="w-full">
                Complete Setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
} 