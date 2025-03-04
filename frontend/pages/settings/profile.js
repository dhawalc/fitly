import React, { useState, useEffect } from 'react';
import SettingsLayout from "../../components/settings-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AuthService } from "../../services/auth-service";

export default function ProfileSettings() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: ''
  });
  
  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        age: parsedUser.age || '',
        gender: parsedUser.gender || '',
        height: parsedUser.height || '',
        weight: parsedUser.weight || ''
      });
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const updatedUser = {
        ...parsedUser,
        ...userData
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profile updated successfully!');
    }
  };
  
  return (
    <SettingsLayout>
      <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input 
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input 
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <Input 
                  name="age"
                  type="number"
                  value={userData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select 
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Height (inches)</label>
                <Input 
                  name="height"
                  type="number"
                  value={userData.height}
                  onChange={handleChange}
                  placeholder="Your height in inches"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Weight (lbs)</label>
                <Input 
                  name="weight"
                  type="number"
                  value={userData.weight}
                  onChange={handleChange}
                  placeholder="Your weight in pounds"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
} 