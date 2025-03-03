import React from 'react';
import { cn } from "../../lib/utils"

export function Avatar({ children, className = '', ...props }) {
  return (
    <div
      className={`relative inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, className = '', ...props }) {
  // If src is null or undefined, don't render the img element
  if (!src) return null;
  
  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      {...props}
    />
  );
}

export function AvatarFallback({ children, className = '', ...props }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-blue-500 text-white text-lg font-medium ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 