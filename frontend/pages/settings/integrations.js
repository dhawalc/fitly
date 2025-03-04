import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SettingsLayout from "../../components/settings-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { AuthService } from "../../services/auth-service";
import { FitbitService } from '../../services/fitbit-service';
import DebugData from '../../components/debug-data';

export default function Integrations() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [integrations, setIntegrations] = useState({
    fitbit: { connected: false, lastSync: null }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fitbitConnected, setFitbitConnected] = useState(false);
  const [fitbitUsername, setFitbitUsername] = useState('');
  const [lastSync, setLastSync] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false });
  
  useEffect(() => {
    // Get user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      
      // Check if user has connected integrations
      if (parsedUser.fitbit?.connected) {
        setIntegrations({
          ...integrations,
          fitbit: {
            connected: true,
            lastSync: parsedUser.fitbit.lastSync || null
          }
        });
      }
    }
    
    // Check URL for integration status
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const provider = urlParams.get('provider');
    
    if (status && provider) {
      if (status === 'success' && provider === 'fitbit') {
        // Immediately update UI to show connected status
        setIntegrations({
          ...integrations,
          fitbit: {
            connected: true,
            lastSync: new Date().toISOString()
          }
        });
        
        // Then fetch the latest user data
        fetchUserData();
      }
    }
    
    // Check for URL parameters after OAuth callback
    FitbitService.updateFromUrlParams();
    
    // Get the current connection status
    const checkConnectionStatus = async () => {
      const status = await FitbitService.getConnectionStatus();
      setFitbitConnected(status.isConnected);
      setFitbitUsername(status.username);
      setLastSync(status.lastSync);
      setConnectionStatus(status);
    };
    
    checkConnectionStatus();
  }, []);
  
  const fetchUserData = async () => {
    try {
      // First check if Fitbit is connected
      const fitbitStatusResponse = await fetch('/api/fitbit/status');
      const fitbitStatus = await fitbitStatusResponse.json();
      
      if (fitbitStatus.connected) {
        setIntegrations({
          ...integrations,
          fitbit: {
            connected: true,
            lastSync: fitbitStatus.lastSync || new Date().toISOString()
          }
        });
        
        // Update local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const updatedUser = {
            ...parsedUser,
            fitbit: {
              connected: true,
              lastSync: fitbitStatus.lastSync || new Date().toISOString()
            }
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUserData(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error fetching Fitbit status:', error);
    }
  };
  
  const connectFitbit = () => {
    window.location.href = '/api/fitbit/auth-test';
  };
  
  const disconnectFitbit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/fitbit/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setIntegrations({
          ...integrations,
          fitbit: { connected: false, lastSync: null }
        });
        
        // Refresh user data
        fetchUserData();
      }
    } catch (error) {
      console.error('Error disconnecting Fitbit:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const syncFitbitData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/fitbit/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Refresh user data after sync
        fetchUserData();
      }
    } catch (error) {
      console.error('Error syncing Fitbit data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SettingsLayout>
      <h2 className="text-xl font-semibold mb-6">Integrations & Connected Devices</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <img src="/images/fitbit-logo.svg" alt="Fitbit" className="h-6 mr-2" />
                Fitbit
              </CardTitle>
              {integrations.fitbit.connected && (
                <Badge className="bg-green-500">Connected</Badge>
              )}
            </div>
            <CardDescription>
              Sync your activity, sleep, weight, and heart rate data from Fitbit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {integrations.fitbit.connected ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Your Fitbit account is connected. Data will automatically sync daily.
                </p>
                {integrations.fitbit.lastSync && (
                  <p className="text-xs text-gray-500">
                    Last synced: {new Date(integrations.fitbit.lastSync).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Connect your Fitbit account to automatically import your activity, sleep, and other health data.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {integrations.fitbit.connected ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={disconnectFitbit}
                  disabled={isLoading}
                >
                  Disconnect
                </Button>
                <div>
                  <Button 
                    onClick={syncFitbitData}
                    disabled={isLoading}
                    className="mr-2"
                  >
                    Sync Now
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => router.push('/fitbit-dashboard')}
                  >
                    View Data
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500"
                onClick={connectFitbit}
                disabled={isLoading}
              >
                Connect Fitbit
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Add more integration cards here (Google Fit, Apple Health, etc.) */}
      </div>
      
      <div className="mt-8">
        <DebugData data={connectionStatus} title="Fitbit Connection Status" />
      </div>
    </SettingsLayout>
  );
} 