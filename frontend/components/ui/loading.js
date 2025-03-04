import React from 'react';

export const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-500',
    white: 'text-white',
    gray: 'text-gray-400',
  };
  
  return (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export const LoadingCard = ({ height = 'h-32', width = 'w-full' }) => {
  return (
    <div className={`${height} ${width} bg-gray-100 rounded-lg animate-pulse flex items-center justify-center`}>
      <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
    </div>
  );
};

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="xl" color="primary" />
        <p className="mt-4 text-gray-600 font-medium">Loading your health data...</p>
      </div>
    </div>
  );
}; 