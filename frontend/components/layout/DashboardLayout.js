import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/workouts', label: 'Workouts', icon: '💪' },
    { href: '/nutrition', label: 'Nutrition', icon: '🥗' },
    { href: '/progress', label: 'Progress', icon: '📈' },
    { href: '/bloodwork', label: 'Blood Tests', icon: '🩸' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Health & Fitness</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md ${
                router.pathname === item.href 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E" 
                alt="User" 
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Premium Plan</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Health & Fitness</h1>
          <Button variant="ghost" size="icon">
            <span className="text-xl">☰</span>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <div className="md:p-6 p-4 pt-16 md:pt-6">
          {children}
        </div>
      </div>
    </div>
  );
} 