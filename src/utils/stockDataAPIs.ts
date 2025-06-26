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
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
      );
      const data = await response.json();

      if (data.chart?.result?.[0]) {
        const result = data.chart.result[0];
        const meta = result.meta;
        const indicators = result.indicators.quote[0];
        
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        return {
          symbol: symbol.toUpperCase(),
          currentPrice,
          change,
          changePercent,
          previousClose,
          open: indicators.open[0] || currentPrice,
          high: indicators.high[0] || currentPrice,
          low: indicators.low[0] || currentPrice,
          volume: indicators.volume[0] || 0,
          marketCap: meta.marketCap,
          peRatio: meta.trailingPE,
          dividendYield: meta.trailingAnnualDividendYield,
          lastUpdated: new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Yahoo Finance API error:', error);
      return null;
    }
  }

  async getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const symbolsParam = symbols.join(',');
      const response = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}`
      );
      const data = await response.json();

      if (data.quoteResponse?.result) {
        return data.quoteResponse.result.map((quote: any) => ({
          symbol: quote.symbol,
          currentPrice: quote.regularMarketPrice,
          change: quote.regularMarketPrice - quote.regularMarketPreviousClose,
          changePercent: quote.regularMarketChangePercent,
          previousClose: quote.regularMarketPreviousClose,
          open: quote.regularMarketOpen,
          high: quote.regularMarketDayHigh,
          low: quote.regularMarketDayLow,
          volume: quote.regularMarketVolume,
          marketCap: quote.marketCap,
          peRatio: quote.trailingPE,
          dividendYield: quote.trailingAnnualDividendYield,
          lastUpdated: new Date()
        }));
      }
      return [];
    } catch (error) {
      console.error('Yahoo Finance batch API error:', error);
      return [];
    }
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
            console.log(`Got quote for ${symbol} from ${provider.name}`);
            return quote;
          }
        } catch (error) {
          console.warn(`Provider ${provider.name} failed for ${symbol}:`, error);
          continue;
        }
      }
    }
    console.error(`All providers failed for ${symbol}`);
    return null;
  }

  async getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
    // Try batch operations first, then fallback to individual calls
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        try {
          const quotes = await provider.getBatchQuotes(symbols);
          if (quotes.length > 0) {
            console.log(`Got ${quotes.length} quotes from ${provider.name}`);
            return quotes;
          }
        } catch (error) {
          console.warn(`Provider ${provider.name} batch failed:`, error);
          continue;
        }
      }
    }

    // Fallback to individual calls
    const quotes: StockQuote[] = [];
    for (const symbol of symbols) {
      const quote = await this.getQuote(symbol);
      if (quote) quotes.push(quote);
    }
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