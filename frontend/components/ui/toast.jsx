import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const Toast = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variantClasses = {
    default: "bg-white border border-gray-200 text-gray-900",
    destructive: "bg-red-100 border border-red-200 text-red-900",
    success: "bg-green-100 border border-green-200 text-green-900",
  };

  return (
    <div
      ref={ref}
      className={`rounded-md shadow-md p-4 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
Toast.displayName = "Toast";

const ToastProvider = ({ children }) => {
  return <>{children}</>;
};

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-[420px] max-h-screen overflow-hidden ${className}`}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={`absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 ${className}`}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`font-medium text-sm ${className}`}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm opacity-90 ${className}`}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
}; 