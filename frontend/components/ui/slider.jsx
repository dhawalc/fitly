"use client"

import React from "react"
import { cn } from "../../lib/utils"

const Slider = React.forwardRef(({ className, min = 0, max = 100, step = 1, value = [0], onValueChange, ...props }, ref) => {
  const handleChange = (e) => {
    const newValue = Number(e.target.value)
    onValueChange && onValueChange([newValue])
  }

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer"
        style={{
          '--track-color': 'hsl(var(--primary))',
          '--thumb-color': 'hsl(var(--primary))',
          '--thumb-size': '1.25rem',
        }}
      />
    </div>
  )
})

Slider.displayName = "Slider"

export { Slider } 