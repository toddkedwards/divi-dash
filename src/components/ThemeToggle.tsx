'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { themeConfig, type Theme } from '@/lib/theme';
import Button from './Button';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark, isLoaded } = useTheme();

  if (!isLoaded) {
    return (
      <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'system' ? (
        isDark ? (
          <span className="text-lg">{themeConfig.dark.icon}</span>
        ) : (
          <span className="text-lg">{themeConfig.light.icon}</span>
        )
      ) : (
        <span className="text-lg">{themeConfig[theme as Theme].icon}</span>
      )}
    </Button>
  );
} 