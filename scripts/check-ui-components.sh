#!/bin/bash

# Script to check for missing UI components

echo "Checking for missing UI components..."

# Check if the Switch component exists
if [ ! -f "frontend/components/ui/switch.js" ]; then
  echo "Switch component is missing. Creating it..."
  
  # Create the directory if it doesn't exist
  mkdir -p frontend/components/ui
  
  # Create the Switch component
  cat > frontend/components/ui/switch.js << 'EOL'
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "../../lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
EOL

  echo "Switch component created successfully!"
else
  echo "Switch component already exists."
fi

# Check if the utils.js file exists
if [ ! -f "frontend/lib/utils.js" ]; then
  echo "utils.js is missing. Creating it..."
  
  # Create the directory if it doesn't exist
  mkdir -p frontend/lib
  
  # Create the utils.js file
  cat > frontend/lib/utils.js << 'EOL'
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
EOL

  echo "utils.js created successfully!"
else
  echo "utils.js already exists."
fi

# Check if the package.json has the required dependencies
if ! grep -q "@radix-ui/react-switch" frontend/package.json; then
  echo "Adding @radix-ui/react-switch to package.json..."
  # This is a simple approach; in a real scenario, you might want to use npm or yarn to add the dependency
  sed -i 's/"@radix-ui\/react-tabs": "^1.0.4",/"@radix-ui\/react-tabs": "^1.0.4",\n    "@radix-ui\/react-switch": "^1.0.3",/g' frontend/package.json
  echo "Dependency added to package.json. Please run 'npm install' in the frontend directory."
else
  echo "@radix-ui/react-switch dependency already exists in package.json."
fi

echo "UI components check completed!" 