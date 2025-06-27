import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  darkMode: boolean;
  currentTheme: Theme;
  toggleDarkMode: () => void;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultThemes: Theme[] = [
  {
    id: 'orange',
    name: 'Pomarańczowy',
    colors: {
      primary: '#ea580c',
      secondary: '#fb923c',
      accent: '#fed7aa',
      background: '#fef3f2',
      surface: '#ffffff',
      text: '#1f2937'
    }
  },
  {
    id: 'blue',
    name: 'Niebieski',
    colors: {
      primary: '#2563eb',
      secondary: '#60a5fa',
      accent: '#bfdbfe',
      background: '#eff6ff',
      surface: '#ffffff',
      text: '#1f2937'
    }
  },
  {
    id: 'green',
    name: 'Zielony',
    colors: {
      primary: '#16a34a',
      secondary: '#4ade80',
      accent: '#bbf7d0',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#1f2937'
    }
  },
  {
    id: 'purple',
    name: 'Fioletowy',
    colors: {
      primary: '#9333ea',
      secondary: '#a855f7',
      accent: '#ddd6fe',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#1f2937'
    }
  }
];

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedTheme = localStorage.getItem('currentTheme');
    
    setDarkMode(savedDarkMode);
    if (savedTheme) {
      const theme = defaultThemes.find(t => t.id === savedTheme) || defaultThemes[0];
      setCurrentTheme(theme);
    }

    // Apply dark mode class to document
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('currentTheme', theme.id);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
  };

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{
      darkMode,
      currentTheme,
      toggleDarkMode,
      setTheme,
      availableThemes: defaultThemes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};