import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

const Select = ({ children, value, onChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative" {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            selectedValue,
          });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, {
            onSelect: handleSelect,
          });
        }
        return null;
      })}
    </div>
  );
};

const SelectTrigger = ({ className, children, selectedValue, ...props }) => {
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
        className
      )}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 opacity-50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};

const SelectValue = ({ children, placeholder }) => {
  return <span>{children || placeholder}</span>;
};

const SelectContent = ({ className, children, onSelect, ...props }) => {
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg",
        className
      )}
      {...props}
    >
      <div className="py-1">
        {React.Children.map(children, (child) => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, {
              onSelect,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

const SelectItem = ({ className, children, value, onSelect, ...props }) => {
  return (
    <div
      className={cn(
        "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer",
        className
      )}
      onClick={() => onSelect && onSelect(value)}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}; 