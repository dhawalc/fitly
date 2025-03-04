import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { FitbitService } from "../../services/fitbit-service";
import { Loader2, Check, AlertCircle, RefreshCw, Link as LinkIcon } from 'lucide-react';
import FitbitLogo from "../fitbit-logo";
import { useToast } from "../ui/use-toast";
import { AuthService } from "../../services/auth-service";

export default function IntegrationsSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fitbitStatus, setFitbitStatus] = useState({ 
    isConnected: false, 
    lastSync: null,
    username: null
  });
  
  useEffect(() => {
    loadFitbitStatus();
  }, []);
  
  const loadFitbitStatus = async () => {
    setIsLoading(true);
    try {
      // Check Fitbit connection from user profile
      const user = AuthService.getCurrentUser();
      const status = await FitbitService.getConnectionStatus(user?.id);
      setFitbitStatus(status);
    } catch (error) {
      console.error('Error loading Fitbit status:', error);
      toast({
        title: "Error",
        description: "Failed to load Fitbit connection status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConnectFitbit = async () => {
    try {
      await FitbitService.connect();
      // After successful connection, update the status
      loadFitbitStatus();
      toast({
        title: "Success",
        description: "Fitbit account connected successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error connecting to Fitbit:', error);
      toast({
        title: "Error",
        description: "Failed to connect Fitbit account",
        variant: "destructive"
      });
    }
  };
  
  const handleDisconnectFitbit = async () => {
    try {
      await FitbitService.disconnect();
      setFitbitStatus({ isConnected: false, lastSync: null, username: null });
      toast({
        title: "Success",
        description: "Fitbit account disconnected successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error disconnecting Fitbit:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect Fitbit account",
        variant: "destructive"
      });
    }
  };
  
  const handleSyncFitbit = async () => {
    setIsSyncing(true);
    try {
      await FitbitService.sync();
      // Update the last sync time
      loadFitbitStatus();
      toast({
        title: "Success",
        description: "Fitbit data synced successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error syncing Fitbit data:', error);
      toast({
        title: "Error",
        description: "Failed to sync Fitbit data",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FitbitLogo className="h-6 w-6 mr-2" />
            Fitbit Integration
          </CardTitle>
          <CardDescription>
            Connect your Fitbit account to sync your activity, sleep, and heart rate data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Connection Status</h3>
                <p className="text-sm text-muted-foreground">
                  {fitbitStatus.isConnected 
                    ? "Your Fitbit account is connected" 
                    : "Your Fitbit account is not connected"}
                </p>
              </div>
              <div className="flex items-center">
                {fitbitStatus.isConnected ? (
                  <div className="flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-1" />
                    <span>Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="h-5 w-5 mr-1" />
                    <span>Not Connected</span>
                  </div>
                )}
              </div>
            </div>
            
            {fitbitStatus.isConnected && (
              <>
                {fitbitStatus.username && (
                  <div>
                    <h3 className="font-medium">Connected Account</h3>
                    <p className="text-sm text-muted-foreground">
                      {fitbitStatus.username}
                    </p>
                  </div>
                )}
                
                {fitbitStatus.lastSync && (
                  <div>
                    <h3 className="font-medium">Last Synced</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(fitbitStatus.lastSync).toLocaleString()}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium">Data Access</h3>
                  <p className="text-sm text-muted-foreground">
                    We have access to your activity, sleep, heart rate, and weight data
                  </p>
                </div>
              </>
            )}
            
            {!fitbitStatus.isConnected && (
              <div>
                <h3 className="font-medium">Benefits of Connecting</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mt-2">
                  <li>Automatically sync your activity and workout data</li>
                  <li>Track your sleep patterns and quality</li>
                  <li>Monitor your heart rate and health metrics</li>
                  <li>Get personalized insights based on your Fitbit data</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {fitbitStatus.isConnected ? (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleSyncFitbit} disabled={isSyncing}>
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>
              <Button variant="destructive" onClick={handleDisconnectFitbit}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnectFitbit}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Connect Fitbit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 