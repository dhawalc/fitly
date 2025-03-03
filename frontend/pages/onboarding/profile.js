import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import OnboardingLayout from '../../components/onboarding/onboarding-layout';
import { AuthService } from "../../services/auth-service";

export default function ProfileSetup() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    gender: ''
  });
  
  useEffect(() => {
    // Get user data from localStorage
    const user = AuthService.getCurrentUser();
    if (!user) {
      router.push('/welcome');
      return;
    }
    
    setUserData(user);
  }, [router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user data with form data
    const updatedUserData = {
      ...userData,
      ...formData
    };
    
    // Save updated user data
    AuthService.updateUserProfile(updatedUserData);
    
    // Set onboarding step to 'goals' instead of a number
    localStorage.setItem('onboardingStep', 'goals');
    
    // Navigate to next step
    router.push('/onboarding/goals');
  };
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <OnboardingLayout step={1} totalSteps={4}>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <div className="font-medium text-lg">{userData.name}</div>
              <div className="text-gray-500">{userData.email}</div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="18"
                  max="100"
                  className="w-full p-2 border rounded-md"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="heightFeet" className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      id="heightFeet"
                      name="heightFeet"
                      type="number"
                      required
                      min="4"
                      max="7"
                      className="w-full p-2 border rounded-md"
                      value={formData.heightFeet}
                      onChange={handleChange}
                    />
                    <span className="ml-2">ft</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="heightInches"
                      name="heightInches"
                      type="number"
                      min="0"
                      max="11"
                      className="w-full p-2 border rounded-md"
                      value={formData.heightInches}
                      onChange={handleChange}
                    />
                    <span className="ml-2">in</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <div className="flex items-center">
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    required
                    min="50"
                    max="500"
                    className="w-full p-2 border rounded-md"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                  <span className="ml-2">lbs</span>
                </div>
              </div>
              
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