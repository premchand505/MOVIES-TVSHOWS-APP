// src/components/custom/ThemeToggle.tsx (Updated Logic)
"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the root element once
const root = window.document.documentElement;

// Function to read the current theme from storage or system
const getInitialTheme = (): 'light' | 'dark' => {
  const storedPrefs = localStorage.getItem('theme');
  if (typeof storedPrefs === 'string') {
    return storedPrefs as 'light' | 'dark';
  }

  // Check system preference
  const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
  if (userMedia.matches) {
    return 'dark';
  }
  
  return 'light'; // Default
}

// Function to physically set the theme class on the HTML element
const setHtmlThemeClass = (theme: 'light' | 'dark') => {
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
};


export const ThemeToggle = () => {
  // Use a state initialized by the stored/system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const initialTheme = getInitialTheme();
    // Run the setting logic immediately during component initialization
    setHtmlThemeClass(initialTheme); 
    return initialTheme;
  });

  // Effect runs only when theme state changes (e.g., button click)
  useEffect(() => {
    setHtmlThemeClass(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}