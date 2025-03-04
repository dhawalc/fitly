#!/bin/bash

# Master script to fix all issues

echo "Starting to fix all issues..."

# Fix duplicate pages
echo "Step 1: Fixing duplicate pages..."
./scripts/fix-duplicates.sh

# Check UI components
echo "Step 2: Checking UI components..."
./scripts/check-ui-components.sh

# Create Label component
echo "Step 3: Creating Label component..."
mkdir -p frontend/components/ui
cat > frontend/components/ui/label.js << 'EOL'
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
EOL

# Restore health features
echo "Step 4: Restoring health app features..."
./scripts/restore-health-features.sh

# Install dependencies if needed
echo "Step 5: Installing dependencies..."
cd frontend && npm install @radix-ui/react-label --save && npm install

echo "All issues have been fixed!"
echo "Please restart the development server with 'cd frontend && npm run dev'" 