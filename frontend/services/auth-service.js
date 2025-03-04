// This is a mock authentication service
// In a real app, this would interact with your backend API

import { encryptData, decryptData } from './crypto-service';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const SENSITIVE_DATA_KEY = 'sensitive_data';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class AuthServiceClass {
  constructor() {
    this.user = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Only access localStorage in browser environment
    if (isBrowser) {
      // Load user from localStorage if available
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (e) {
          console.error('Error parsing user data from localStorage', e);
          localStorage.removeItem('user');
        }
      }
      
      // If no user exists, create a default one for demo purposes
      if (!this.user) {
        this.user = {
          id: 'user-123',
          name: 'Dhawal Chheda',
          email: 'user@example.com',
          photoURL: null
        };
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    } else {
      // Default user for server-side rendering
      this.user = {
        id: 'user-123',
        name: 'Dhawal Chheda',
        email: 'user@example.com',
        photoURL: null
      };
    }
    
    this.initialized = true;
  }

  getCurrentUser() {
    if (!this.initialized) {
      this.init();
    }
    return this.user;
  }

  updateUser(userData) {
    this.user = { ...this.user, ...userData };
    if (isBrowser) {
      localStorage.setItem('user', JSON.stringify(this.user));
    }
    return this.user;
  }

  signOut() {
    if (isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('fitbit_connection');
    }
    this.user = null;
    this.initialized = false;
  }

  // Sign in with email and password
  async signIn(email, password) {
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
      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return user;
    }
    
    throw new Error('Invalid credentials');
  }
  
  // Sign in with Google
  async signInWithGoogle(googleUser) {
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
    if (isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return user;
  }
  
  // Update user profile
  async updateUserProfile(userData) {
    // In a real app, you would call your backend API to update the user profile
    // For now, we'll just update the user in localStorage
    
    // Store the updated user in localStorage
    if (isBrowser) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return userData;
  }
  
  // Get sensitive user data (like medical info)
  getSensitiveUserData() {
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
  }
  
  // Check if onboarding is completed
  isOnboardingCompleted() {
    if (!isBrowser) return false;
    
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    const userData = JSON.parse(user);
    return userData.onboardingCompleted || false;
  }
  
  // Add this method back to the AuthService
  isAuthenticated() {
    if (!isBrowser) return false;
    return !!localStorage.getItem('user');
  }
}

export const AuthService = new AuthServiceClass(); 