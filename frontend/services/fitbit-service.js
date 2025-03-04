import axios from 'axios';
import { AuthService } from './auth-service';
import { 
  generateMockSleepData, 
  generateMockActivityData, 
  generateMockHeartRateData, 
  generateMockWorkoutData 
} from './mock-data-service';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class FitbitServiceClass {
  constructor() {
    this.baseUrl = '/api/fitbit';
    this.connectionStatus = null;
    this.authWindow = null;
    this.mockData = {
      sleep: null,
      activity: null,
      heartRate: null,
      workouts: null
    };
  }

  async getConnectionStatus(userId) {
    try {
      // Only access localStorage in browser environment
      if (isBrowser) {
        // First check local storage for cached status
        const cachedStatus = localStorage.getItem('fitbit_connection');
        if (cachedStatus) {
          this.connectionStatus = JSON.parse(cachedStatus);
          console.log('Using cached Fitbit connection status for user:', this.connectionStatus.username);
          return this.connectionStatus;
        }
      }
      
      // If not in cache or not in browser, fetch from API
      try {
        console.log('Fetching Fitbit connection status from API...');
        const response = await axios.get(`${this.baseUrl}/status`);
        this.connectionStatus = response.data;
        
        // Cache the result if in browser
        if (isBrowser) {
          console.log('Caching Fitbit connection status for user:', this.connectionStatus.username);
          localStorage.setItem('fitbit_connection', JSON.stringify(this.connectionStatus));
        }
        
        return this.connectionStatus;
      } catch (apiError) {
        console.error('API error getting Fitbit status:', apiError);
        // Return a default status if API call fails
        return { isConnected: false, lastSync: null, username: null };
      }
    } catch (error) {
      console.error('Error getting Fitbit connection status:', error);
      // Return a default status if any error occurs
      return { isConnected: false, lastSync: null, username: null };
    }
  }

  async connect() {
    try {
      // Clear any existing connection first
      if (isBrowser) {
        localStorage.removeItem('fitbit_connection');
      }
      this.connectionStatus = null;
      
      // Start the real OAuth flow
      // Redirect to the backend endpoint that will handle the OAuth flow
      console.log('Starting Fitbit OAuth flow...');
      window.location.href = `${this.baseUrl}/authorize`;
      
      // The function will effectively end here as the page will redirect
      // The OAuth callback will handle saving the connection status
      
      return null;
    } catch (error) {
      console.error('Error connecting to Fitbit:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      // Call the backend to revoke the Fitbit access token
      console.log('Disconnecting from Fitbit...');
      await axios.post(`${this.baseUrl}/revoke`);
      
      // Clear connection status if in browser
      if (isBrowser) {
        localStorage.removeItem('fitbit_connection');
      }
      this.connectionStatus = null;
      
      return true;
    } catch (error) {
      console.error('Error disconnecting from Fitbit:', error);
      throw error;
    }
  }

  async sync() {
    try {
      // Call the backend to sync the latest data from Fitbit
      console.log('Syncing Fitbit data...');
      const response = await axios.post(`${this.baseUrl}/sync`);
      
      // Update last sync time
      if (this.connectionStatus) {
        this.connectionStatus.lastSync = new Date().toISOString();
        if (isBrowser) {
          localStorage.setItem('fitbit_connection', JSON.stringify(this.connectionStatus));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error syncing Fitbit data:', error);
      throw error;
    }
  }

  // Get activity data from Fitbit
  async getActivityData(period = '7d') {
    try {
      console.log('Fetching Fitbit activity data for period:', period);
      const response = await axios.get(`${this.baseUrl}/data/activity?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Fitbit activity data:', error);
      return null;
    }
  }
  
  // Get sleep data from Fitbit
  async getSleepData(period = '7d') {
    try {
      console.log('Fetching Fitbit sleep data for period:', period);
      const response = await axios.get(`${this.baseUrl}/data/sleep?period=${period}`);
      console.log('Sleep data response status:', response.status);
      console.log('Sleep data response type:', typeof response.data);
      console.log('Sleep data is array:', Array.isArray(response.data));
      console.log('Sleep data length:', response.data ? response.data.length : 0);
      
      if (response.data && response.data.length > 0) {
        console.log('First sleep data item:', response.data[0]);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching Fitbit sleep data:', error);
      return null;
    }
  }
  
  // Get heart rate data from Fitbit
  async getHeartRateData(period = '7d') {
    try {
      console.log('Fetching Fitbit heart rate data for period:', period);
      const response = await axios.get(`${this.baseUrl}/data/heart-rate?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Fitbit heart rate data:', error);
      return null;
    }
  }
  
  // Get workout data from Fitbit
  async getWorkoutData(period = '30d') {
    try {
      console.log('Fetching Fitbit workout data for period:', period);
      const response = await axios.get(`${this.baseUrl}/data/workouts?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Fitbit workout data:', error);
      return null;
    }
  }
  
  // Update connection status from URL parameters (used after OAuth callback)
  updateFromUrlParams() {
    if (isBrowser) {
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('username');
      const fitbitStatus = urlParams.get('fitbit');
      
      if (fitbitStatus === 'connected' && username) {
        console.log('Updating Fitbit connection from URL params for user:', username);
        
        // Get existing connection status or create a new one
        const existingStatus = localStorage.getItem('fitbit_connection');
        let connectionStatus = existingStatus ? JSON.parse(existingStatus) : {};
        
        // Update with the username from URL
        connectionStatus = {
          ...connectionStatus,
          isConnected: true,
          username: username,
          lastSync: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('fitbit_connection', JSON.stringify(connectionStatus));
        this.connectionStatus = connectionStatus;
      }
    }
  }
}

export const FitbitService = new FitbitServiceClass(); 