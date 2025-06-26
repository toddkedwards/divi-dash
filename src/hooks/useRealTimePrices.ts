import { useState, useEffect, useCallback } from 'react';
import { stockDataService, StockQuote } from '@/utils/stockDataAPIs';
import { Holding } from '@/data/holdings';

interface PriceUpdate {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}

export function useRealTimePrices(holdings: Holding[], refreshInterval = 30000) {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lastManualRefresh, setLastManualRefresh] = useState<Date | null>(null);

  const updatePrices = useCallback(async () => {
    if (holdings.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use the new stock data service with multiple providers
      const quotes = await stockDataService.getPortfolioQuotes(holdings);
      
      const updates: PriceUpdate[] = quotes.map(quote => ({
        symbol: quote.symbol,
        currentPrice: quote.currentPrice,
        change: quote.change,
        changePercent: quote.changePercent,
        lastUpdated: quote.lastUpdated
      }));

      setPriceUpdates(updates);
      setLastUpdated(new Date());
      
      if (updates.length > 0) {
        console.log(`✓ Updated ${updates.length}/${holdings.length} stock prices`);
      } else {
        console.warn('⚠ No price updates received');
        setError('No price data available');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update prices';
      setError(errorMessage);
      console.error('Price update error:', err);
      
      // Only set fallback prices if we don't have any current prices
      setPriceUpdates(currentPrices => {
        if (currentPrices.length === 0) {
          console.log('Using fallback prices from holdings data');
          return holdings.map(holding => ({
            symbol: holding.symbol,
            currentPrice: holding.currentPrice,
            change: 0,
            changePercent: 0,
            lastUpdated: new Date()
          }));
        }
        return currentPrices;
      });
    } finally {
      setIsLoading(false);
    }
  }, [holdings]);

  // Initial price update
  useEffect(() => {
    updatePrices();
  }, [updatePrices]);

  // Set up interval for periodic updates
  useEffect(() => {
    const interval = setInterval(updatePrices, refreshInterval);
    return () => clearInterval(interval);
  }, [updatePrices, refreshInterval]);

  // Manual refresh function with debounce
  const refreshPrices = useCallback(() => {
    const now = new Date();
    const timeSinceLastRefresh = lastManualRefresh ? now.getTime() - lastManualRefresh.getTime() : Infinity;
    
    // Prevent rapid clicking - minimum 2 seconds between manual refreshes
    if (timeSinceLastRefresh < 2000) {
      console.log('Manual refresh blocked - too soon since last refresh');
      return;
    }
    
    if (!isLoading) {
      setLastManualRefresh(now);
      updatePrices();
    }
  }, [updatePrices, isLoading, lastManualRefresh]);

  // Get current price for a specific symbol
  const getCurrentPrice = useCallback((symbol: string): PriceUpdate | null => {
    return priceUpdates.find(p => p.symbol === symbol) || null;
  }, [priceUpdates]);

  // Get all current prices
  const getAllPrices = useCallback((): PriceUpdate[] => {
    return priceUpdates;
  }, [priceUpdates]);

  // Calculate portfolio value with real-time prices
  const getPortfolioValue = useCallback((): number => {
    return holdings.reduce((total, holding) => {
      const priceUpdate = priceUpdates.find(p => p.symbol === holding.symbol);
      const currentPrice = priceUpdate?.currentPrice || holding.currentPrice;
      return total + (holding.shares * currentPrice);
    }, 0);
  }, [holdings, priceUpdates]);

  // Calculate total gain/loss
  const getTotalGainLoss = useCallback((): { amount: number; percent: number } => {
    let totalCost = 0;
    let totalValue = 0;

    holdings.forEach(holding => {
      const priceUpdate = priceUpdates.find(p => p.symbol === holding.symbol);
      const currentPrice = priceUpdate?.currentPrice || holding.currentPrice;
      
      totalCost += holding.shares * holding.avgPrice;
      totalValue += holding.shares * currentPrice;
    });

    const amount = totalValue - totalCost;
    const percent = totalCost > 0 ? (amount / totalCost) * 100 : 0;

    return { amount, percent };
  }, [holdings, priceUpdates]);

  // Get available API providers
  const getAvailableProviders = useCallback((): string[] => {
    return stockDataService.getAvailableProviders();
  }, []);

  return {
    priceUpdates: getAllPrices(),
    getCurrentPrice,
    getPortfolioValue,
    getTotalGainLoss,
    refreshPrices,
    isLoading,
    error,
    lastUpdated,
    getAvailableProviders
  };
} 