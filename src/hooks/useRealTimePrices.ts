import { useState, useEffect, useCallback } from 'react';
import { getStockQuote } from '../lib/finnhub';
import { getStockProfile } from '../utils/finnhub';

interface PriceUpdate {
  symbol: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  dividendYield: number;
  lastUpdate: number;
  error?: string;
  previousPrice?: number;
}

interface PriceUpdateState {
  [key: string]: PriceUpdate;
}

export function useRealTimePrices(holdings: any[], interval = 30000) {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdateState>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const updatePrices = useCallback(async () => {
    if (!holdings.length) return;
    setIsUpdating(true);
    setError(null);
    
    try {
      const updates = await Promise.all(
        holdings.map(async (holding) => {
          try {
            const [quote, profile] = await Promise.all([
              getStockQuote(holding.symbol),
              getStockProfile(holding.symbol)
            ]);

            const previousPrice = priceUpdates[holding.symbol]?.currentPrice;
            const currentPrice = quote.c;
            
            return {
              symbol: holding.symbol,
              currentPrice,
              dailyChange: quote.d,
              dailyChangePercent: quote.dp,
              dividendYield: profile?.dividendYield ?? 0,
              lastUpdate: Date.now(),
              previousPrice,
              error: undefined
            };
          } catch (error) {
            console.error(`Error fetching price/profile for ${holding.symbol}:`, error);
            return {
              symbol: holding.symbol,
              currentPrice: priceUpdates[holding.symbol]?.currentPrice ?? 0,
              dailyChange: 0,
              dailyChangePercent: 0,
              dividendYield: 0,
              lastUpdate: Date.now(),
              error: `Failed to update ${holding.symbol}`
            };
          }
        })
      );

      const updatesMap = updates.reduce((acc, update) => ({
        ...acc,
        [update.symbol]: update
      }), {});

      setPriceUpdates(updatesMap);
      setRetryCount(0); // Reset retry count on successful update
    } catch (error) {
      console.error('Error updating prices:', error);
      setError('Failed to update prices');
      
      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(updatePrices, 5000); // Retry after 5 seconds
      }
    } finally {
      setIsUpdating(false);
    }
  }, [holdings, priceUpdates, retryCount]);

  useEffect(() => {
    // Initial update
    updatePrices();

    // Set up interval for updates
    const intervalId = setInterval(updatePrices, interval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [updatePrices, interval]);

  return {
    priceUpdates,
    isUpdating,
    error,
    updatePrices,
    retryCount
  };
} 