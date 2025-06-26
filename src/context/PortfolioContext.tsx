'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { Holding } from '@/data/holdings';
import { getHoldings, saveHolding } from '@/utils/holdingsLocal';
import { useAuth } from './AuthContext';
import { loadPortfolios, savePortfolios } from '@/lib/firestore';
import LoadingSpinner from '@/components/LoadingSpinner';

export interface Portfolio {
  id: string;
  name: string;
  holdings: Holding[];
}

export interface PortfolioContextType {
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  selectPortfolio: (id: string) => void;
  createPortfolio: (name: string) => void;
  renamePortfolio: (id: string, name: string) => void;
  deletePortfolio: (id: string) => void;
  holdings: Holding[];
  addHolding: (holding: Holding) => void;
  removeHolding: (index: number) => void;
  updateHolding: (index: number, holding: Holding) => void;
  editHolding: (symbol: string, h: Partial<Holding>) => void;
  deleteHolding: (symbol: string) => void;
  refreshHoldings: () => void;
  isProUser: boolean;
  syncing: boolean;
  syncError: string | null;
  loading: boolean;
}

// Create default portfolio for initial state
const defaultPortfolio: Portfolio = { 
  id: 'default', 
  name: 'My Portfolio', 
  holdings: [] 
};

const defaultContextValue: PortfolioContextType = {
  portfolios: [defaultPortfolio],
  selectedPortfolioId: 'default',
  selectPortfolio: () => {},
  createPortfolio: () => {},
  renamePortfolio: () => {},
  deletePortfolio: () => {},
  holdings: [],
  addHolding: () => {},
  removeHolding: () => {},
  updateHolding: () => {},
  editHolding: () => {},
  deleteHolding: () => {},
  refreshHoldings: () => {},
  isProUser: false,
  syncing: false,
  syncError: null,
  loading: true,
};

const PortfolioContext = createContext<PortfolioContextType>(defaultContextValue);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // Placeholder for Pro check
  const isProUser = false; // TODO: Replace with real check
  const [portfolios, setPortfolios] = useState<Portfolio[]>([defaultPortfolio]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('default');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [wasSyncing, setWasSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(false);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingSync) {
        syncToCloud();
      }
    };
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSync]);

  // Sync to cloud when online
  const syncToCloud = async () => {
    if (!isOnline || !user || !isProUser) return;
    
    try {
      setSyncing(true);
      setSyncError(null);
      await savePortfolios(portfolios);
      setPendingSync(false);
    } catch (e: any) {
      setSyncError('Failed to sync to cloud');
      setPendingSync(true);
    } finally {
      setSyncing(false);
    }
  };

  // Load portfolios from storage or Firestore
  useEffect(() => {
    async function fetchPortfolios() {
      setLoading(true);
      let loaded: Portfolio[] = [];
      let selectedId = '';
      
      try {
        if (user && isProUser) {
          // Cloud sync for Pro users
          try {
            setSyncing(true);
            setSyncError(null);
            const cloudPortfolios = await loadPortfolios();
            if (cloudPortfolios && Array.isArray(cloudPortfolios) && cloudPortfolios.length > 0) {
              loaded = cloudPortfolios;
              selectedId = cloudPortfolios[0].id;
            }
          } catch (e: any) {
            console.warn('Failed to load from cloud:', e);
            setSyncError('Failed to load from cloud');
          } finally {
            setSyncing(false);
          }
        } else {
          // Local storage for free users or when auth is not available
          try {
            const local = localStorage.getItem('portfolios');
            loaded = local ? JSON.parse(local) : [];
            selectedId = localStorage.getItem('selectedPortfolioId') || '';
          } catch (e: any) {
            console.warn('Failed to load from localStorage:', e);
            loaded = [];
            selectedId = '';
          }
        }
      } catch (error) {
        console.error('Error loading portfolios:', error);
        loaded = [];
        selectedId = '';
      }
      
      // Ensure at least one portfolio exists
      if (loaded.length === 0) {
        const defaultPortfolio: Portfolio = { 
          id: Math.random().toString(36).substr(2, 9), 
          name: 'My Portfolio', 
          holdings: [] 
        };
        loaded = [defaultPortfolio];
        selectedId = defaultPortfolio.id;
      }
      
      // Ensure a selected portfolio is set
      if (!selectedId && loaded.length > 0) {
        selectedId = loaded[0].id;
      }
      
      setPortfolios(loaded);
      setSelectedPortfolioId(selectedId);
      setLoading(false);
    }
    
    fetchPortfolios();
  }, [user, isProUser]);

  // Save portfolios to storage or Firestore
  useEffect(() => {
    if (loading) return;
    
    try {
      if (user && isProUser) {
        // Cloud sync for Pro users
        (async () => {
          try {
            setSyncing(true);
            setSyncError(null);
            await savePortfolios(portfolios);
          } catch (e: any) {
            console.warn('Failed to sync to cloud:', e);
            setSyncError('Failed to sync to cloud');
          } finally {
            setSyncing(false);
          }
        })();
      } else {
        // Local storage for free users or when auth is not available
        try {
          localStorage.setItem('portfolios', JSON.stringify(portfolios));
          localStorage.setItem('selectedPortfolioId', selectedPortfolioId);
        } catch (e: any) {
          console.warn('Failed to save to localStorage:', e);
        }
      }
    } catch (error) {
      console.error('Error saving portfolios:', error);
    }
  }, [portfolios, selectedPortfolioId, user, isProUser, loading]);

  // Helper: get selected portfolio
  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId) || portfolios[0];
  const holdings = selectedPortfolio ? selectedPortfolio.holdings : [];

  // Portfolio actions
  const selectPortfolio = (id: string) => {
    setSelectedPortfolioId(id);
  };
  const createPortfolio = (name: string) => {
    if (!isProUser && portfolios.length >= 1) return; // Gate for free users
    const id = Math.random().toString(36).substr(2, 9);
    const newPortfolio: Portfolio = { id, name, holdings: [] };
    setPortfolios(prev => [...prev, newPortfolio]);
    setSelectedPortfolioId(id);
  };
  const renamePortfolio = (id: string, name: string) => {
    setPortfolios(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  };
  const deletePortfolio = (id: string) => {
    setPortfolios(prev => prev.filter(p => p.id !== id));
    if (selectedPortfolioId === id && portfolios.length > 1) {
      const next = portfolios.find(p => p.id !== id);
      setSelectedPortfolioId(next ? next.id : '');
    }
  };

  // Holding actions (operate on selected portfolio)
  const setHoldingsForSelected = (fn: (prev: Holding[]) => Holding[]) => {
    setPortfolios(prev => prev.map(p =>
      p.id === selectedPortfolioId ? { ...p, holdings: fn(p.holdings) } : p
    ));
  };
  const addHolding = (holding: Holding) => {
    setHoldingsForSelected(prev => {
      const idx = prev.findIndex(x => x.symbol === holding.symbol);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = holding;
        return updated;
      }
      return [...prev, holding];
    });
  };
  const removeHolding = (index: number) => {
    setHoldingsForSelected(prev => prev.filter((_, i) => i !== index));
  };
  const updateHolding = (index: number, holding: Holding) => {
    setHoldingsForSelected(prev => prev.map((h, i) => i === index ? holding : h));
  };
  const editHolding = (symbol: string, h: Partial<Holding>) => {
    setHoldingsForSelected(prev => prev.map(x => x.symbol === symbol ? { ...x, ...h } : x));
  };
  const deleteHolding = (symbol: string) => {
    setHoldingsForSelected(prev => prev.filter(x => x.symbol !== symbol));
  };
  const refreshHoldings = () => {
    // No-op for now; could reload from backend
  };

  const contextValue = useMemo(() => ({
    portfolios,
    selectedPortfolioId,
    selectPortfolio,
    createPortfolio,
    renamePortfolio,
    deletePortfolio,
    holdings,
    addHolding,
    removeHolding,
    updateHolding,
    editHolding,
    deleteHolding,
    refreshHoldings,
    isProUser,
    syncing,
    syncError,
    loading,
  }), [portfolios, selectedPortfolioId, holdings, isProUser, syncing, syncError, loading]);

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    // Return default context value instead of throwing error
    return defaultContextValue;
  }
  return context;
} 