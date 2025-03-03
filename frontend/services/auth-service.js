// This is a mock authentication service
// In a real app, this would interact with your backend API

import { encryptData, decryptData } from './crypto-service';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const SENSITIVE_DATA_KEY = 'sensitive_data';

export const AuthService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    // In a real app, you would call your backend API to authenticate
    // For now, we'll just simulate a successful sign-in
    
    // Check if the credentials are valid (mock validation)
    if (email && password) {
      // Create a user object
      const user = {
        id: 'user-123',
        name: 'Test User',
        email: email,
        avatar: null, // No avatar URL
        onboardingCompleted: false
      };
      
      // Store the user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    }
    
    throw new Error('Invalid credentials');
  },
  
  // Sign in with Google
  signInWithGoogle: async (googleUser) => {
    // In a real app, you would verify the Google token with your backend
    // For now, we'll just simulate a successful sign-in
    
    // Create a user object from the Google user data
    const user = {
      id: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      avatar: null, // Don't use the avatar URL
      onboardingCompleted: false
    };
    
    // Store the user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  },
  
  // Sign out
  signOut: () => {
    // Remove the user from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingStep');
  },
  
  // Get the current user
  getCurrentUser: () => {
    // Get the user from localStorage
    const user = localStorage.getItem('user');
    
    if (user) {
      return JSON.parse(user);
    }
    
    return null;
  },
  
  // Update user profile
  updateUserProfile: async (userData) => {
    // In a real app, you would call your backend API to update the user profile
    // For now, we'll just update the user in localStorage
    
    // Store the updated user in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  },
  
  // Get sensitive user data (like medical info)
  getSensitiveUserData: () => {
    // In a real app, this would be stored securely and possibly encrypted
    // For now, we'll just return mock data
    
    return {
      bloodwork: {
        cholesterol: 180,
        hdl: 60,
        ldl: 100,
        triglycerides: 100,
        glucose: 90
      }
    };
  },
  
  // Check if onboarding is completed
  isOnboardingCompleted: () => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    const userData = JSON.parse(user);
    return userData.onboardingCompleted || false;
  },
  
  // Add this method back to the AuthService
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
}; 