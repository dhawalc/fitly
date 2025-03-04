import React, { useState, createContext, useContext } from "react";

const ToastContext = createContext({
  toast: () => {},
  toasts: [],
  dismissToast: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = 'default', duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    if (duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    
    return id;
  };

  const dismissToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, dismissToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-md shadow-md max-w-md transform transition-all duration-300 ease-in-out ${
                t.variant === 'destructive'
                  ? 'bg-destructive text-destructive-foreground'
                  : t.variant === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-background border'
              }`}
            >
              {t.title && <h3 className="font-medium">{t.title}</h3>}
              {t.description && <p className="text-sm mt-1">{t.description}</p>}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

export const toast = (options) => {
  const { toast } = useContext(ToastContext);
  if (toast) {
    return toast(options);
  }
  // Fallback for when context is not available
  console.log("Toast:", options.title, options.description);
};

toast.success = (options) => {
  return toast({ ...options, variant: "success" });
};

toast.error = (options) => {
  return toast({ ...options, variant: "destructive" });
};

toast.default = (options) => {
  return toast({ ...options, variant: "default" });
}; 