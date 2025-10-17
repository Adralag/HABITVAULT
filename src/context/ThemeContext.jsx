import { createContext, useState, useEffect, useContext } from 'react';

// Create a context for theme
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has previously set a theme preference
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPrefs = window.localStorage.getItem('color-theme');
      if (typeof storedPrefs === 'string') {
        return storedPrefs;
      }

      // Check if browser has dark mode preference
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return 'dark';
      }
    }

    // Default theme
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme());

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Update theme in localStorage and DOM when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme class and add the new one
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    
    // Save theme to localStorage
    localStorage.setItem('color-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};