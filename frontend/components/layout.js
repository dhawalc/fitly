import React from 'react';
import Sidebar from './sidebar';
import TopNav from './top-nav';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from './ui/use-toast';

export default function Layout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-y-auto p-4">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
} 