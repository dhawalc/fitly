import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import AccountSettings from '../../components/settings/account-settings';
import IntegrationsSettings from '../../components/settings/integrations-settings';
import GoalsSettings from '../../components/settings/goals-settings';
import NotificationsSettings from '../../components/settings/notifications-settings';

export default function SettingsPage() {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState("account");
  
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
    router.push({
      pathname: '/settings',
      query: { tab: value }
    }, undefined, { shallow: true });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="integrations">
          <IntegrationsSettings />
        </TabsContent>
        
        <TabsContent value="goals">
          <GoalsSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
} 