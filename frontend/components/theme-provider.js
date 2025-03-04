"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Create a context for theme
const ThemeContext = createContext({
  theme: "system",
  setTheme: () => null,
})

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  )
}

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  // If we're not in the provider, use next-themes directly
  if (context === undefined) {
    // This is a workaround for when the hook is used outside the context
    // We'll use the imported useTheme from next-themes
    const { useTheme: useNextTheme } = require("next-themes")
    return useNextTheme()
  }
  
  return context
} 