/**
 * Theme Context
 * Global state for light/dark mode theme management
 * Persists theme preference to localStorage and applies to DOM
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * Manages dark/light mode state and DOM class updates
 * Initializes theme from localStorage or system preference
 */
export const ThemeProvider = ({ children }) => {
  // Initialize isDarkMode from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  /**
   * Update DOM and localStorage whenever theme changes
   * Adds/removes 'dark' class on html element for Tailwind CSS
   */
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark'); // Enable dark mode in Tailwind
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark'); // Disable dark mode
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 * @returns {object} {isDarkMode, toggleTheme}
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
