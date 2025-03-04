import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2, Save, Upload } from 'lucide-react';
import { AuthService } from "../../services/auth-service";

export default function AccountSettings() {
  const [user, setUser] = useState(() => {
    const userData = AuthService.getCurrentUser() || {
      name: "Dhawal Chheda",
      email: "user@example.com",
      photoURL: null,
      phone: "+1 (555) 123-4567"
    };
    return userData;
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success toast
  };
  
  const getInitials = (name) => {
    if (!name) return 'DC';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Update your personal information and how we can reach you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Avatar className="h-24 w-24">
            {user.photoURL ? (
              <AvatarImage src={user.photoURL} alt={user.name} />
            ) : (
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-medium">{user.name}</h3>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Change Photo
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={user.name} 
                onChange={(e) => setUser({...user, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email} 
                onChange={(e) => setUser({...user, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={user.phone || ""} 
                onChange={(e) => setUser({...user, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 