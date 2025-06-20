import { getDividendScreener, getDividendMetrics } from './dividendCom';
import { getStockQuote, getStockProfile } from './finnhub';

export interface ScreenerCriteria {
  // Basic Filters
  minPrice?: number;
  maxPrice?: number;
  minMarketCap?: number;
  maxMarketCap?: number;
  
  // Dividend Filters
  minYield?: number;
  maxYield?: number;
  minDividendGrowth?: number;
  minPayoutRatio?: number;
  maxPayoutRatio?: number;
  minYearsOfGrowth?: number;
  
  // Financial Filters
  minPE?: number;
  maxPE?: number;
  minROE?: number;
  maxROE?: number;
  minDebtToEquity?: number;
  maxDebtToEquity?: number;
  
  // Performance Filters
  min52WeekPerformance?: number;
  max52WeekPerformance?: number;
  minVolume?: number;
  
  // Sector/Industry
  sectors?: string[];
  industries?: string[];
  
  // Special Categories
  isDividendAristocrat?: boolean;
  isDividendKing?: boolean;
  isREIT?: boolean;
  isUtility?: boolean;
}

export interface ScreenerResult {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  marketCap: number;
  
  // Dividend Data
  dividendYield: number;
  dividendGrowth: number;
  payoutRatio: number;
  yearsOfGrowth: number;
  sustainabilityScore: number;
  
  // Financial Metrics
  pe: number;
  roe: number;
  debtToEquity: number;
  
  // Performance
  performance52Week: number;
  volume: number;
  
  // Ratings
  overallScore: number;
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  
  // Special Categories
  isDividendAristocrat: boolean;
  isDividendKing: boolean;
  isREIT: boolean;
}

export interface PresetScreen {
  id: string;
  name: string;
  description: string;
  criteria: ScreenerCriteria;
  category: 'dividend' | 'growth' | 'value' | 'income' | 'aristocrats';
}

// Preset screening strategies
export const PRESET_SCREENS: PresetScreen[] = [
  {
    id: 'high-yield-dividend',
    name: 'High Yield Dividend Stocks',
    description: 'Stocks with dividend yields above 4% and sustainable payouts',
    category: 'dividend',
    criteria: {
      minYield: 4,
      maxPayoutRatio: 80,
      minYearsOfGrowth: 3,
      minMarketCap: 1000000000 // $1B
    }
  },
  {
    id: 'dividend-aristocrats',
    name: 'Dividend Aristocrats',
    description: 'S&P 500 companies with 25+ years of consecutive dividend increases',
    category: 'aristocrats',
    criteria: {
      isDividendAristocrat: true,
      minYearsOfGrowth: 25,
      minMarketCap: 5000000000 // $5B
    }
  },
  {
    id: 'dividend-kings',
    name: 'Dividend Kings',
    description: 'Companies with 50+ years of consecutive dividend increases',
    category: 'aristocrats',
    criteria: {
      isDividendKing: true,
      minYearsOfGrowth: 50
    }
  },
  {
    id: 'growing-dividends',
    name: 'Growing Dividend Stocks',
    description: 'Companies with strong dividend growth and reasonable valuations',
    category: 'growth',
    criteria: {
      minDividendGrowth: 5,
      minYield: 2,
      maxPE: 25,
      minROE: 10,
      minYearsOfGrowth: 5
    }
  },
  {
    id: 'value-dividends',
    name: 'Value Dividend Stocks',
    description: 'Undervalued stocks with attractive dividend yields',
    category: 'value',
    criteria: {
      minYield: 3,
      maxPE: 15,
      maxDebtToEquity: 0.5,
      minROE: 8
    }
  },
  {
    id: 'reit-income',
    name: 'High Income REITs',
    description: 'Real Estate Investment Trusts with high dividend yields',
    category: 'income',
    criteria: {
      isREIT: true,
      minYield: 5,
      maxPayoutRatio: 90
    }
  },
  {
    id: 'utility-income',
    name: 'Utility Income Stocks',
    description: 'Stable utility companies with consistent dividends',
    category: 'income',
    criteria: {
      isUtility: true,
      minYield: 3,
      maxPayoutRatio: 75,
      minYearsOfGrowth: 10
    }
  }
];

// Dividend Aristocrats list (S&P 500 companies with 25+ years of increases)
export const DIVIDEND_ARISTOCRATS = [
  'MMM', 'ABT', 'ABBV', 'ADP', 'AFL', 'APD', 'AMCR', 'ABC', 'ATO', 'ADM',
  'BDX', 'BF.B', 'BRO', 'CHD', 'CAH', 'CAT', 'CVX', 'CL', 'KO', 'CL',
  'CINF', 'ECL', 'EMR', 'ESS', 'XOM', 'FRT', 'GWW', 'ITW', 'JNJ', 'KMB',
  'LOW', 'MCD', 'MDT', 'MKC', 'NEE', 'NUE', 'PEP', 'PFE', 'PG', 'O',
  'SHW', 'SPGI', 'SYY', 'TGT', 'TXN', 'UL', 'VFC', 'WAL', 'WMT', 'WST'
];

// Dividend Kings list (50+ years of increases)
export const DIVIDEND_KINGS = [
  'KO', 'JNJ', 'PG', 'MMM', 'PEP', 'CVX', 'XOM', 'WMT', 'TXN', 'LOW',
  'MCD', 'ABT', 'CL', 'KMB', 'SYY', 'GWW', 'EMR', 'CAT', 'ITW', 'NUE'
];

class StockScreenerService {
  private cache = new Map<string, { data: ScreenerResult[]; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async screenStocks(criteria: ScreenerCriteria): Promise<ScreenerResult[]> {
    const cacheKey = JSON.stringify(criteria);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Get initial results from dividend screener
      const dividendResults = await getDividendScreener({
        minYield: criteria.minYield,
        maxYield: criteria.maxYield,
        minGrowth: criteria.minDividendGrowth,
        minPayoutRatio: criteria.minPayoutRatio,
        maxPayoutRatio: criteria.maxPayoutRatio,
        sectors: criteria.sectors
      });

      // Enhance with additional data and apply filters
      const enhancedResults: ScreenerResult[] = [];

      for (const stock of dividendResults) {
        try {
          // Get current price and company data
          const [quote, profile] = await Promise.all([
            getStockQuote(stock.symbol),
            getStockProfile(stock.symbol)
          ]);

          // Apply filters
          if (!this.passesFilters(stock, quote, profile, criteria)) {
            continue;
          }

          // Calculate additional metrics
          const result: ScreenerResult = {
            symbol: stock.symbol,
            name: profile.name || stock.symbol,
            sector: profile.finnhubIndustry || 'Unknown',
            industry: profile.finnhubIndustry || 'Unknown',
            price: quote.c || 0,
            marketCap: profile.marketCapitalization || 0,
            
            dividendYield: stock.currentYield,
            dividendGrowth: stock.dividendGrowth,
            payoutRatio: stock.payoutRatio,
            yearsOfGrowth: stock.yearsOfGrowth,
            sustainabilityScore: stock.sustainabilityScore,
            
            pe: quote.c && profile.eps ? quote.c / profile.eps : 0,
            roe: profile.roe || 0,
            debtToEquity: profile.totalDebt && profile.totalEquity ? 
              profile.totalDebt / profile.totalEquity : 0,
            
            performance52Week: quote.c && quote.w52h && quote.w52l ? 
              ((quote.c - quote.w52l) / (quote.w52h - quote.w52l)) * 100 : 0,
            volume: quote.v || 0,
            
            overallScore: this.calculateOverallScore(stock, quote, profile),
            recommendation: this.getRecommendation(stock, quote, profile),
            
            isDividendAristocrat: DIVIDEND_ARISTOCRATS.includes(stock.symbol),
            isDividendKing: DIVIDEND_KINGS.includes(stock.symbol),
            isREIT: profile.finnhubIndustry?.toLowerCase().includes('reit') || false
          };

          enhancedResults.push(result);
        } catch (error) {
          console.warn(`Failed to enhance data for ${stock.symbol}:`, error);
          // Continue with next stock
        }
      }

      // Sort by overall score
      enhancedResults.sort((a, b) => b.overallScore - a.overallScore);

      // Cache results
      this.cache.set(cacheKey, {
        data: enhancedResults,
        timestamp: Date.now()
      });

      return enhancedResults;
    } catch (error) {
      console.error('Stock screening failed:', error);
      throw new Error('Failed to screen stocks. Please try again.');
    }
  }

  private passesFilters(
    stock: any,
    quote: any,
    profile: any,
    criteria: ScreenerCriteria
  ): boolean {
    // Price filters
    if (criteria.minPrice && quote.c < criteria.minPrice) return false;
    if (criteria.maxPrice && quote.c > criteria.maxPrice) return false;
    
    // Market cap filters
    if (criteria.minMarketCap && profile.marketCapitalization < criteria.minMarketCap) return false;
    if (criteria.maxMarketCap && profile.marketCapitalization > criteria.maxMarketCap) return false;
    
    // PE filter
    const pe = quote.c && profile.eps ? quote.c / profile.eps : 0;
    if (criteria.minPE && pe < criteria.minPE) return false;
    if (criteria.maxPE && pe > criteria.maxPE) return false;
    
    // ROE filter
    if (criteria.minROE && (profile.roe || 0) < criteria.minROE) return false;
    if (criteria.maxROE && (profile.roe || 0) > criteria.maxROE) return false;
    
    // Debt to equity filter
    const debtToEquity = profile.totalDebt && profile.totalEquity ? 
      profile.totalDebt / profile.totalEquity : 0;
    if (criteria.minDebtToEquity && debtToEquity < criteria.minDebtToEquity) return false;
    if (criteria.maxDebtToEquity && debtToEquity > criteria.maxDebtToEquity) return false;
    
    // Volume filter
    if (criteria.minVolume && (quote.v || 0) < criteria.minVolume) return false;
    
    // Special category filters
    if (criteria.isDividendAristocrat && !DIVIDEND_ARISTOCRATS.includes(stock.symbol)) return false;
    if (criteria.isDividendKing && !DIVIDEND_KINGS.includes(stock.symbol)) return false;
    if (criteria.isREIT && !profile.finnhubIndustry?.toLowerCase().includes('reit')) return false;
    if (criteria.isUtility && !profile.finnhubIndustry?.toLowerCase().includes('utility')) return false;
    
    return true;
  }

  private calculateOverallScore(stock: any, quote: any, profile: any): number {
    let score = 50; // Base score
    
    // Dividend yield score (0-20 points)
    if (stock.currentYield >= 4) score += 20;
    else if (stock.currentYield >= 2) score += 10;
    else if (stock.currentYield >= 1) score += 5;
    
    // Dividend growth score (0-15 points)
    if (stock.dividendGrowth >= 10) score += 15;
    else if (stock.dividendGrowth >= 5) score += 10;
    else if (stock.dividendGrowth >= 0) score += 5;
    
    // Sustainability score (0-15 points)
    score += (stock.sustainabilityScore || 0) * 0.15;
    
    // Years of growth score (0-10 points)
    if (stock.yearsOfGrowth >= 25) score += 10;
    else if (stock.yearsOfGrowth >= 10) score += 7;
    else if (stock.yearsOfGrowth >= 5) score += 5;
    
    // PE ratio score (0-10 points)
    const pe = quote.c && profile.eps ? quote.c / profile.eps : 0;
    if (pe > 0 && pe <= 15) score += 10;
    else if (pe > 15 && pe <= 25) score += 5;
    
    // ROE score (0-10 points)
    const roe = profile.roe || 0;
    if (roe >= 15) score += 10;
    else if (roe >= 10) score += 7;
    else if (roe >= 5) score += 3;
    
    // Special categories bonus
    if (DIVIDEND_ARISTOCRATS.includes(stock.symbol)) score += 5;
    if (DIVIDEND_KINGS.includes(stock.symbol)) score += 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private getRecommendation(stock: any, quote: any, profile: any): 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell' {
    const score = this.calculateOverallScore(stock, quote, profile);
    
    if (score >= 80) return 'Strong Buy';
    if (score >= 65) return 'Buy';
    if (score >= 45) return 'Hold';
    if (score >= 30) return 'Sell';
    return 'Strong Sell';
  }

  async getPresetScreen(presetId: string): Promise<ScreenerResult[]> {
    const preset = PRESET_SCREENS.find(p => p.id === presetId);
    if (!preset) {
      throw new Error('Preset screen not found');
    }
    
    return this.screenStocks(preset.criteria);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const stockScreener = new StockScreenerService(); 