import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function ProfileSetup() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    goal: 'fat-loss',
    dietPreferences: []
  });
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    setUserData(JSON.parse(storedUser));
    
    // Check if profile is already set up
    const profileSetup = localStorage.getItem('profileSetup');
    if (profileSetup === 'completed') {
      router.push('/');
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
    
    // Convert height from feet/inches to total inches for storage
    const heightInches = (parseInt(formData.heightFeet) * 12) + parseInt(formData.heightInches || 0);
    
    // Save profile data
    const updatedUser = {
      ...userData,
      age: formData.age,
      height: heightInches, // Store height in total inches
      weight: formData.weight,
      goal: formData.goal,
      dietPreferences: formData.dietPreferences,
      units: 'imperial' // Store the user's preference for imperial units
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('profileSetup', 'completed');
    
    // Redirect to dashboard
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-600">Complete Your Profile</h1>
          <p className="mt-2 text-gray-600">
            Help us personalize your health and fitness experience
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="text-2xl">{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-center">{userData.name}</CardTitle>
            <CardDescription className="text-center">{userData.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center">
                      <input
                        id="heightFeet"
                        name="heightFeet"
                        type="number"
                        required
                        min="1"
                        max="8"
                        placeholder="5"
                        className="w-full p-2 border rounded-md"
                        value={formData.heightFeet}
                        onChange={handleChange}
                      />
                      <span className="ml-2">ft</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <input
                        id="heightInches"
                        name="heightInches"
                        type="number"
                        required
                        min="0"
                        max="11"
                        placeholder="10"
                        className="w-full p-2 border rounded-md"
                        value={formData.heightInches}
                        onChange={handleChange}
                      />
                      <span className="ml-2">in</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (lbs)
                </label>
                <div className="flex items-center">
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                  <span className="ml-2">lbs</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Goal
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
                  <option value="maintenance">Maintenance</option>
                  <option value="general-health">General Health</option>
                  <option value="athletic-performance">Athletic Performance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diet Preferences
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['high-protein', 'low-carb', 'vegetarian', 'vegan', 'keto', 'paleo', 'intermittent-fasting', 'mediterranean'].map((diet) => (
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
                Complete Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 