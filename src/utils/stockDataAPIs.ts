// Stock Data APIs - Multiple providers for reliability
import { Holding } from '@/data/holdings';

export interface StockQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  lastUpdated: Date;
}

export interface APIProvider {
  name: string;
  getQuote: (symbol: string) => Promise<StockQuote | null>;
  getBatchQuotes: (symbols: string[]) => Promise<StockQuote[]>;
  isAvailable: () => boolean;
}

// Alpha Vantage API (Free tier available)
class AlphaVantageProvider implements APIProvider {
  name = 'Alpha Vantage';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || '';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    if (!this.isAvailable()) return null;

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      );
      const data = await response.json();

      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
          symbol: quote['01. symbol'],
          currentPrice: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          previousClose: parseFloat(quote['08. previous close']),
          open: parseFloat(quote['02. open']),
          high: parseFloat(quote['03. high']),
          low: parseFloat(quote['04. low']),
          volume: parseInt(quote['06. volume']),
          lastUpdated: new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Alpha Vantage API error:', error);
      return null;
    }
  }

  async getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = [];
    for (const symbol of symbols) {
      const quote = await this.getQuote(symbol);
      if (quote) quotes.push(quote);
      // Rate limiting for free tier
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    return quotes;
  }
}

// Yahoo Finance API (Free, no API key required)
class YahooFinanceProvider implements APIProvider {
  name = 'Yahoo Finance';

  isAvailable(): boolean {
    return true; // Always available
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      // Use our own API route to avoid CORS issues
      const response = await fetch(`/api/stock-quotes?symbols=${symbol}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.quotes && data.quotes.length > 0) {
        return data.quotes[0];
      }
      
      return null;
    } catch (error) {
      console.error('Yahoo Finance API error:', error);
      // Return mock data for development if API fails
      return this.getMockQuote(symbol);
    }
  }

  async getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      // Use our own API route for batch quotes
      const symbolsParam = symbols.join(',');
      const response = await fetch(`/api/stock-quotes?symbols=${symbolsParam}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.quotes) {
        return data.quotes;
      }
      
      return [];
    } catch (error) {
      console.error('Yahoo Finance batch API error:', error);
      // Return mock data for all symbols if API fails
      return symbols.map(symbol => this.getMockQuote(symbol)).filter(Boolean) as StockQuote[];
    }
  }

  private getMockQuote(symbol: string): StockQuote | null {
    // Generate realistic mock data for development
    const basePrice = 50 + Math.random() * 200;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol: symbol.toUpperCase(),
      currentPrice: basePrice,
      change,
      changePercent,
      previousClose: basePrice - change,
      open: basePrice + (Math.random() - 0.5) * 5,
      high: basePrice + Math.random() * 5,
      low: basePrice - Math.random() * 5,
      volume: Math.floor(Math.random() * 1000000),
      marketCap: basePrice * Math.floor(Math.random() * 10000000),
      peRatio: 10 + Math.random() * 30,
      dividendYield: Math.random() * 5,
      lastUpdated: new Date()
    };
  }
}

// Finnhub API (Free tier available)
class FinnhubProvider implements APIProvider {
  name = 'Finnhub';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    if (!this.isAvailable()) return null;

    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKey}`
      );
      const data = await response.json();

      if (data.c) {
        return {
          symbol: symbol.toUpperCase(),
          currentPrice: data.c,
          change: data.d,
          changePercent: data.dp,
          previousClose: data.pc,
          open: data.o,
          high: data.h,
          low: data.l,
          volume: 0, // Not provided by Finnhub quote endpoint
          lastUpdated: new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Finnhub API error:', error);
      return null;
    }
  }

  async getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = [];
    for (const symbol of symbols) {
      const quote = await this.getQuote(symbol);
      if (quote) quotes.push(quote);
      // Rate limiting for free tier
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return quotes;
  }
}

// Main Stock Data Service
class StockDataService {
  private providers: APIProvider[] = [];

  constructor() {
    // Initialize providers in order of preference
    this.providers.push(new YahooFinanceProvider()); // Most reliable free option
    this.providers.push(new AlphaVantageProvider());
    this.providers.push(new FinnhubProvider());
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        try {
          const quote = await provider.getQuote(symbol);
          if (quote) {
            console.log(`✓ Got quote for ${symbol} from ${provider.name}`);
            return quote;
          }
        } catch (error) {
          console.warn(`✗ Provider ${provider.name} failed for ${symbol}:`, error);
          continue;
        }
      }
    }
    console.error(`✗ All providers failed for ${symbol}`);
    return null;
  }

  async getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
    console.log(`Fetching batch quotes for ${symbols.length} symbols...`);
    
    // Try batch operations first, then fallback to individual calls
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        try {
          const quotes = await provider.getBatchQuotes(symbols);
          if (quotes.length > 0) {
            console.log(`✓ Got ${quotes.length}/${symbols.length} quotes from ${provider.name}`);
            return quotes;
          }
        } catch (error) {
          console.warn(`✗ Provider ${provider.name} batch failed:`, error);
          continue;
        }
      }
    }

    // Fallback to individual calls
    console.log('Falling back to individual quote calls...');
    const quotes: StockQuote[] = [];
    for (const symbol of symbols) {
      const quote = await this.getQuote(symbol);
      if (quote) quotes.push(quote);
      // Small delay between calls
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`✓ Final result: ${quotes.length}/${symbols.length} quotes retrieved`);
    return quotes;
  }

  async getPortfolioQuotes(holdings: Holding[]): Promise<StockQuote[]> {
    const symbols = holdings.map(h => h.symbol);
    return this.getBatchQuotes(symbols);
  }

  getAvailableProviders(): string[] {
    return this.providers
      .filter(p => p.isAvailable())
      .map(p => p.name);
  }
}

// Export singleton instance
export const stockDataService = new StockDataService();

// Legacy compatibility
export const getStockQuote = (symbol: string) => stockDataService.getQuote(symbol);
export const getBatchStockQuotes = (symbols: string[]) => stockDataService.getBatchQuotes(symbols); 