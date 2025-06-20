'use client';

import { useEffect, useState } from 'react';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { type Theme } from '@/lib/theme';

export function useTheme() {
  const { theme, setTheme, isDark } = useUserPreferences();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Apply theme class
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  return {
    theme,
    setTheme,
    isDark,
    isLoaded: mounted,
    toggleTheme: () => {
      if (theme === 'system') {
        setTheme(isDark ? 'light' : 'dark');
      } else {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }
    },
    isSystemTheme: theme === 'system',
  };
} 