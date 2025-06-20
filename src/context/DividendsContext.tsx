import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { loadDividends, saveDividends } from '@/lib/firestore';
import LoadingSpinner from '@/components/LoadingSpinner';

type Dividend = {
  symbol: string;
  amount: number;
  date: string;
};

interface DividendsContextType {
  dividends: Dividend[];
  addDividend: (d: Dividend) => void;
  editDividend: (index: number, d: Partial<Dividend>) => void;
  deleteDividend: (index: number) => void;
  refreshDividends: () => void;
}

const DividendsContext = createContext<DividendsContextType | undefined>(undefined);

const STORAGE_KEY = 'dividends';

export const DividendsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDividends() {
      setLoading(true);
      if (user) {
        const cloudDividends = await loadDividends();
        setDividends(cloudDividends || []);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        setDividends(stored ? JSON.parse(stored) : []);
      }
      setLoading(false);
    }
    fetchDividends();
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (user) {
      saveDividends(dividends);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dividends));
    }
  }, [dividends, user, loading]);

  const addDividend = (d: Dividend) => {
    setDividends(prev => [...prev, d]);
  };

  const editDividend = (index: number, d: Partial<Dividend>) => {
    setDividends(prev => prev.map((x, i) => i === index ? { ...x, ...d } : x));
  };

  const deleteDividend = (index: number) => {
    setDividends(prev => prev.filter((_, i) => i !== index));
  };

  const refreshDividends = () => {
    if (user) {
      loadDividends().then(cloudDividends => {
        setDividends(cloudDividends || []);
      });
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      setDividends(stored ? JSON.parse(stored) : []);
    }
  };

  if (loading) return <LoadingSpinner size="md" />;

  return (
    <DividendsContext.Provider value={{ dividends, addDividend, editDividend, deleteDividend, refreshDividends }}>
      {children}
    </DividendsContext.Provider>
  );
};

export function useDividends() {
  const ctx = useContext(DividendsContext);
  if (!ctx) throw new Error('useDividends must be used within a DividendsProvider');
  return ctx;
} 