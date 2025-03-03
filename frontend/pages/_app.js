import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import Layout from '../components/layout';
import { AuthService } from '../services/auth-service';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Public routes that don't require authentication
  const publicRoutes = ['/welcome', '/login', '/signup'];
  
  // Onboarding routes
  const onboardingRoutes = [
    '/onboarding/profile',
    '/onboarding/goals',
    '/onboarding/health',
    '/onboarding/measurements',
    '/onboarding/complete'
  ];
  
  useEffect(() => {
    // Check authentication status
    const user = AuthService.getCurrentUser();
    const authenticated = !!user;
    setIsAuthenticated(authenticated);
    
    // Check if onboarding is completed
    if (authenticated) {
      const onboardingCompleted = user.onboardingCompleted || false;
      setIsOnboardingCompleted(onboardingCompleted);
    }
    
    setIsLoading(false);
  }, [router.pathname]);
  
  useEffect(() => {
    if (isLoading) return;
    
    // If not authenticated and trying to access a protected route
    if (!isAuthenticated && !publicRoutes.includes(router.pathname)) {
      router.push('/welcome');
      return;
    }
    
    // If authenticated but onboarding not completed and not on an onboarding route
    if (isAuthenticated && !isOnboardingCompleted && !onboardingRoutes.includes(router.pathname) && router.pathname !== '/welcome') {
      // Get the current onboarding step from localStorage or default to profile
      const onboardingStep = localStorage.getItem('onboardingStep');
      
      // Map numeric or string steps to route names
      let routeName = 'profile';
      
      if (onboardingStep === 'goals' || onboardingStep === '1' || onboardingStep === 1) {
        routeName = 'goals';
      } else if (onboardingStep === 'health' || onboardingStep === '2' || onboardingStep === 2) {
        routeName = 'health';
      } else if (onboardingStep === 'measurements' || onboardingStep === '3' || onboardingStep === 3) {
        routeName = 'measurements';
      } else if (onboardingStep === 'complete' || onboardingStep === '4' || onboardingStep === 4) {
        routeName = 'complete';
      }
      
      router.push(`/onboarding/${routeName}`);
      return;
    }
    
    // If authenticated and onboarding completed but trying to access onboarding routes
    if (isAuthenticated && isOnboardingCompleted && onboardingRoutes.includes(router.pathname)) {
      router.push('/');
      return;
    }
    
    // If authenticated and trying to access public routes (except welcome)
    if (isAuthenticated && publicRoutes.includes(router.pathname) && router.pathname !== '/welcome') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, isOnboardingCompleted, router.pathname, isLoading]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Determine if we should use the layout
  const useLayout = !publicRoutes.includes(router.pathname) && !onboardingRoutes.includes(router.pathname);
  
  return useLayout ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <Component {...pageProps} />
  );
}

export default MyApp; 