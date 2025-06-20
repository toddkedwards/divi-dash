'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { useTheme } from 'next-themes';

type Theme = 'light' | 'dark' | 'system';

interface UserPreferences {
  theme: Theme;
  currency: string;
  tableSort: {
    key: string;
    direction: 'asc' | 'desc';
  };
  setTheme: (theme: Theme) => void;
  setCurrency: (currency: string) => void;
  setTableSort: (key: string, direction: 'asc' | 'desc') => void;
  isDark: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  currency: 'USD',
  tableSort: { key: 'marketValue', direction: 'desc' as const },
  setTheme: () => {},
  setCurrency: () => {},
  setTableSort: () => {},
  isDark: false,
};

const UserPreferencesContext = createContext<UserPreferences>(defaultPreferences);

export function useUserPreferences() {
  return useContext(UserPreferencesContext);
}

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { theme: nextTheme, setTheme: setNextTheme, resolvedTheme } = useTheme();
  const [currency, setCurrencyState] = useState<string>(defaultPreferences.currency);
  const [tableSort, setTableSortState] = useState<{ key: string; direction: 'asc' | 'desc' }>(defaultPreferences.tableSort);
  const [mounted, setMounted] = useState(false);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedCurrency = localStorage.getItem('user-currency');
    const storedTableSort = localStorage.getItem('user-table-sort');

    if (storedCurrency) setCurrencyState(storedCurrency);
    if (storedTableSort) {
      try {
        const parsed = JSON.parse(storedTableSort);
        if (parsed.key && (parsed.direction === 'asc' || parsed.direction === 'desc')) {
          setTableSortState({ key: parsed.key, direction: parsed.direction });
        }
      } catch {}
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user-currency', currency);
  }, [currency]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user-table-sort', JSON.stringify(tableSort));
  }, [tableSort]);

  // Theme handling
  const setTheme = (newTheme: Theme) => {
    setNextTheme(newTheme);
  };

  const setCurrency = (c: string) => setCurrencyState(c);
  const setTableSort = (key: string, direction: 'asc' | 'desc') => setTableSortState({ key, direction });

  const contextValue = useMemo(() => ({
    theme: (nextTheme as Theme) || 'system',
    currency,
    tableSort,
    setTheme,
    setCurrency,
    setTableSort,
    isDark: resolvedTheme === 'dark',
  }), [nextTheme, currency, tableSort, resolvedTheme]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-24" />
      </div>
    );
  }

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {children}
    </UserPreferencesContext.Provider>
  );
} 