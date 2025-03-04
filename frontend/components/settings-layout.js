import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SettingsLayout({ children }) {
  const router = useRouter();
  
  const isActive = (path) => {
    return router.pathname === path ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <nav className="flex flex-col">
              <Link href="/settings/profile" className={`${isActive('/settings/profile')} px-4 py-3 text-sm font-medium border-l-4 border-transparent transition-all duration-200`}>
                Profile
              </Link>
              <Link href="/settings/account" className={`${isActive('/settings/account')} px-4 py-3 text-sm font-medium border-l-4 border-transparent transition-all duration-200`}>
                Account
              </Link>
              <Link href="/settings/goals" className={`${isActive('/settings/goals')} px-4 py-3 text-sm font-medium border-l-4 border-transparent transition-all duration-200`}>
                Goals & Targets
              </Link>
              <Link href="/settings/notifications" className={`${isActive('/settings/notifications')} px-4 py-3 text-sm font-medium border-l-4 border-transparent transition-all duration-200`}>
                Notifications
              </Link>
              <Link href="/settings/integrations" className={`${isActive('/settings/integrations')} px-4 py-3 text-sm font-medium border-l-4 border-transparent transition-all duration-200`}>
                Integrations & Devices
              </Link>
              <Link href="/settings/privacy" className={`${isActive('/settings/privacy')} px-4 py-3 text-sm font-medium border-l-4 border-transparent transition-all duration-200`}>
                Privacy & Data
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Settings Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
} 