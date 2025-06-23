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
  minConsecutiveGrowth?: number;
  
  // Financial Filters
  minPE?: number;
  maxPE?: number;
  minROE?: number;
  maxROE?: number;
  minDebtToEquity?: number;
  maxDebtToEquity?: number;
  minCurrentRatio?: number;
  maxCurrentRatio?: number;
  minQuickRatio?: number;
  minProfitMargin?: number;
  minOperatingMargin?: number;
  
  // Valuation Filters
  maxPriceToBook?: number;
  minPriceToBook?: number;
  maxPriceToSales?: number;
  minPriceToSales?: number;
  
  // Performance Filters
  min52WeekPerformance?: number;
  max52WeekPerformance?: number;
  minVolume?: number;
  minRevenue?: number;
  minRevenueGrowth?: number;
  minEpsGrowth?: number;
  
  // Technical Filters
  minBeta?: number;
  maxBeta?: number;
  minRSI?: number;
  maxRSI?: number;
  isAbove50DayMA?: boolean;
  isAbove200DayMA?: boolean;
  
  // Quality Filters
  minCreditRating?: string; // 'AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC'
  minDividendSafetyScore?: number;
  minFinancialStrengthScore?: number;
  
  // ESG Filters
  minESGScore?: number;
  maxESGScore?: number;
  includeESGLeaders?: boolean;
  
  // Sector/Industry
  sectors?: string[];
  industries?: string[];
  excludeSectors?: string[];
  
  // Geographic Filters
  regions?: string[];
  countries?: string[];
  exchanges?: string[];
  
  // Special Categories
  isDividendAristocrat?: boolean;
  isDividendKing?: boolean;
  isREIT?: boolean;
  isUtility?: boolean;
  isDividendContender?: boolean; // 10-24 years of growth
  isDividendChampion?: boolean; // 25+ years of growth
  isESGLeader?: boolean;
  
  // Advanced Filters
  hasEarningsGrowth?: boolean;
  hasRevenueGrowth?: boolean;
  hasPositiveFCF?: boolean; // Free Cash Flow
  hasDividendCoverage?: boolean; // FCF covers dividends
  isUndervalued?: boolean; // Based on multiple metrics
}

export interface ScreenerResult {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  marketCap: number;
  exchange: string;
  country: string;
  
  // Dividend Data
  dividendYield: number;
  dividendGrowth: number;
  dividendGrowth5Y: number;
  dividendGrowth10Y: number;
  payoutRatio: number;
  fcfPayoutRatio: number; // Free Cash Flow payout ratio
  yearsOfGrowth: number;
  consecutiveGrowthYears: number;
  sustainabilityScore: number;
  dividendSafetyScore: number;
  
  // Financial Metrics
  pe: number;
  peg: number; // Price/Earnings to Growth
  priceToBook: number;
  priceToSales: number;
  priceToFCF: number;
  roe: number;
  roa: number; // Return on Assets
  roic: number; // Return on Invested Capital
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  interestCoverage: number;
  
  // Profitability
  grossMargin: number;
  operatingMargin: number;
  profitMargin: number;
  fcfMargin: number;
  
  // Growth Metrics
  revenueGrowth: number;
  revenueGrowth5Y: number;
  epsGrowth: number;
  epsGrowth5Y: number;
  fcfGrowth: number;
  
  // Performance
  performance52Week: number;
  performance1Month: number;
  performance3Month: number;
  performance6Month: number;
  performance1Year: number;
  performance3Year: number;
  performance5Year: number;
  volume: number;
  avgVolume: number;
  
  // Technical Indicators
  beta: number;
  rsi: number;
  ma50: number;
  ma200: number;
  priceVsMa50: number; // Price relative to 50-day MA
  priceVsMa200: number; // Price relative to 200-day MA
  
  // Credit & Quality
  creditRating: string;
  financialStrengthScore: number;
  profitabilityRank: number;
  
  // ESG
  esgScore: number;
  environmentScore: number;
  socialScore: number;
  governanceScore: number;
  
  // Valuation Metrics
  intrinsicValue: number;
  fairValue: number;
  upside: number; // Potential upside based on fair value
  
  // Ratings & Scores
  overallScore: number;
  dividendScore: number;
  financialScore: number;
  valuationScore: number;
  qualityScore: number;
  momentumScore: number;
  
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  analystRating: number; // 1-5 scale
  priceTarget: number;
  analystCount: number;
  
  // Special Categories
  isDividendAristocrat: boolean;
  isDividendKing: boolean;
  isDividendContender: boolean;
  isDividendChampion: boolean;
  isREIT: boolean;
  isESGLeader: boolean;
  
  // Risk Metrics
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinRatio: number;
  
  // Last Updated
  lastUpdated: string;
  dataQuality: 'High' | 'Medium' | 'Low';
}

export interface PresetScreen {
  id: string;
  name: string;
  description: string;
  criteria: ScreenerCriteria;
  category: 'dividend' | 'growth' | 'value' | 'income' | 'aristocrats' | 'quality' | 'esg' | 'international';
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  expectedResults: number;
}

// Enhanced preset screening strategies
export const PRESET_SCREENS: PresetScreen[] = [
  {
    id: 'dividend-aristocrats',
    name: 'Dividend Aristocrats',
    description: 'S&P 500 companies with 25+ years of consecutive dividend increases',
    category: 'aristocrats',
    tags: ['quality', 'long-term', 'stable'],
    difficulty: 'Beginner',
    expectedResults: 65,
    criteria: {
      isDividendAristocrat: true,
      minYearsOfGrowth: 25,
      minMarketCap: 5000000000, // $5B
      minCurrentRatio: 1.0
    }
  },
  {
    id: 'dividend-kings',
    name: 'Dividend Kings',
    description: 'Elite companies with 50+ years of consecutive dividend increases',
    category: 'aristocrats',
    tags: ['elite', 'ultra-stable', 'legacy'],
    difficulty: 'Beginner',
    expectedResults: 45,
    criteria: {
      isDividendKing: true,
      minYearsOfGrowth: 50,
      minMarketCap: 1000000000 // $1B
    }
  },
  {
    id: 'high-yield-quality',
    name: 'High Yield Quality Dividends',
    description: 'High-yielding stocks with sustainable payouts and strong financials',
    category: 'income',
    tags: ['high-yield', 'sustainable', 'income'],
    difficulty: 'Intermediate',
    expectedResults: 75,
    criteria: {
      minYield: 4,
      maxPayoutRatio: 75,
      minYearsOfGrowth: 5,
      minMarketCap: 2000000000, // $2B
      minCurrentRatio: 1.2,
      minFinancialStrengthScore: 60
    }
  },
  {
    id: 'dividend-growth-champions',
    name: 'Dividend Growth Champions',
    description: 'Companies with exceptional dividend growth and strong fundamentals',
    category: 'growth',
    tags: ['growth', 'fundamental', 'long-term'],
    difficulty: 'Intermediate',
    expectedResults: 50,
    criteria: {
      minDividendGrowth: 8,
      minYield: 1.5,
      maxPE: 25,
      minROE: 12,
      minYearsOfGrowth: 10,
      hasRevenueGrowth: true,
      hasEarningsGrowth: true
    }
  },
  {
    id: 'undervalued-dividends',
    name: 'Undervalued Dividend Stocks',
    description: 'Value dividend stocks trading below fair value with strong yields',
    category: 'value',
    tags: ['value', 'undervalued', 'opportunity'],
    difficulty: 'Advanced',
    expectedResults: 40,
    criteria: {
      minYield: 3,
      maxPE: 15,
      maxPriceToBook: 2.5,
      minROE: 10,
      maxDebtToEquity: 0.6,
      isUndervalued: true,
      minFinancialStrengthScore: 50
    }
  },
  {
    id: 'reit-income-powerhouses',
    name: 'REIT Income Powerhouses',
    description: 'High-quality REITs with excellent dividend yields and FFO growth',
    category: 'income',
    tags: ['reit', 'real-estate', 'monthly-income'],
    difficulty: 'Intermediate',
    expectedResults: 30,
    criteria: {
      isREIT: true,
      minYield: 4.5,
      maxPayoutRatio: 85,
      minMarketCap: 1000000000, // $1B
      hasPositiveFCF: true
    }
  },
  {
    id: 'international-dividends',
    name: 'International Dividend Stocks',
    description: 'High-quality dividend stocks from developed international markets',
    category: 'international',
    tags: ['international', 'diversification', 'global'],
    difficulty: 'Advanced',
    expectedResults: 60,
    criteria: {
      minYield: 2.5,
      minMarketCap: 5000000000, // $5B
      excludeSectors: ['Financials'], // Often regulated differently internationally
      minFinancialStrengthScore: 70,
      countries: ['Canada', 'United Kingdom', 'Germany', 'Switzerland', 'Australia', 'Japan']
    }
  },
  {
    id: 'esg-dividend-leaders',
    name: 'ESG Dividend Leaders',
    description: 'Sustainable companies with strong ESG scores and growing dividends',
    category: 'esg',
    tags: ['esg', 'sustainable', 'responsible'],
    difficulty: 'Intermediate',
    expectedResults: 35,
    criteria: {
      minYield: 2,
      minESGScore: 75,
      isESGLeader: true,
      minYearsOfGrowth: 5,
      minMarketCap: 3000000000, // $3B
      hasRevenueGrowth: true
    }
  },
  {
    id: 'monthly-dividend-income',
    name: 'Monthly Dividend Income',
    description: 'Stocks and funds that pay dividends monthly for steady income',
    category: 'income',
    tags: ['monthly', 'steady-income', 'cash-flow'],
    difficulty: 'Beginner',
    expectedResults: 25,
    criteria: {
      minYield: 5,
      // This would need special logic to identify monthly payers
      maxPayoutRatio: 90,
      minMarketCap: 500000000 // $500M
    }
  },
  {
    id: 'tech-dividend-growers',
    name: 'Technology Dividend Growers',
    description: 'Technology companies with growing dividends and innovation focus',
    category: 'growth',
    tags: ['technology', 'innovation', 'growth'],
    difficulty: 'Advanced',
    expectedResults: 20,
    criteria: {
      sectors: ['Technology', 'Communication Services'],
      minDividendGrowth: 10,
      minYield: 1,
      maxPE: 30,
      minROE: 15,
      hasEarningsGrowth: true,
      minRevenueGrowth: 5
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
          const pe = quote.c && profile.eps ? quote.c / profile.eps : 0;
          const debtToEquity = profile.totalDebt && profile.totalEquity ? 
            profile.totalDebt / profile.totalEquity : 0;
          const performance52Week = quote.c && quote.w52h && quote.w52l ? 
            ((quote.c - quote.w52l) / (quote.w52h - quote.w52l)) * 100 : 0;
          
          const result: ScreenerResult = {
            symbol: stock.symbol,
            name: profile.name || stock.symbol,
            sector: profile.finnhubIndustry || 'Unknown',
            industry: profile.finnhubIndustry || 'Unknown',
            price: quote.c || 0,
            marketCap: profile.marketCapitalization || 0,
            exchange: profile.exchange || 'NASDAQ',
            country: profile.country || 'US',
            
            // Dividend Data
            dividendYield: stock.currentYield || 0,
            dividendGrowth: stock.dividendGrowth || 0,
            dividendGrowth5Y: stock.dividendGrowth || 0, // Would need historical data
            dividendGrowth10Y: stock.dividendGrowth || 0, // Would need historical data
            payoutRatio: stock.payoutRatio || 0,
            fcfPayoutRatio: stock.payoutRatio || 0, // Simplified for now
            yearsOfGrowth: stock.yearsOfGrowth || 0,
            consecutiveGrowthYears: stock.yearsOfGrowth || 0,
            sustainabilityScore: stock.sustainabilityScore || 0,
            dividendSafetyScore: stock.sustainabilityScore || 0,
            
            // Financial Metrics
            pe,
            peg: pe && stock.dividendGrowth ? pe / stock.dividendGrowth : 0,
            priceToBook: profile.priceToBookRatio || 0,
            priceToSales: profile.priceToSalesRatio || 0,
            priceToFCF: 0, // Would need FCF data
            roe: profile.roe || 0,
            roa: profile.roa || 0,
            roic: profile.roic || 0,
            debtToEquity,
            currentRatio: profile.currentRatio || 0,
            quickRatio: profile.quickRatio || 0,
            interestCoverage: 0, // Would need interest expense data
            
            // Profitability
            grossMargin: 0, // Would need income statement data
            operatingMargin: 0,
            profitMargin: 0,
            fcfMargin: 0,
            
            // Growth Metrics
            revenueGrowth: 0, // Would need historical revenue data
            revenueGrowth5Y: 0,
            epsGrowth: 0,
            epsGrowth5Y: 0,
            fcfGrowth: 0,
            
            // Performance
            performance52Week,
            performance1Month: 0, // Would need historical price data
            performance3Month: 0,
            performance6Month: 0,
            performance1Year: performance52Week,
            performance3Year: 0,
            performance5Year: 0,
            volume: quote.v || 0,
            avgVolume: quote.v || 0, // Simplified
            
            // Technical Indicators
            beta: profile.beta || 1,
            rsi: 50, // Would need technical analysis
            ma50: quote.c || 0, // Simplified
            ma200: quote.c || 0, // Simplified
            priceVsMa50: 0,
            priceVsMa200: 0,
            
            // Credit & Quality
            creditRating: 'BBB', // Default rating
            financialStrengthScore: stock.sustainabilityScore || 50,
            profitabilityRank: 50,
            
            // ESG
            esgScore: 0, // Would need ESG data provider
            environmentScore: 0,
            socialScore: 0,
            governanceScore: 0,
            
            // Valuation Metrics
            intrinsicValue: quote.c || 0, // Simplified
            fairValue: quote.c || 0, // Simplified
            upside: 0,
            
            // Ratings & Scores
            overallScore: this.calculateOverallScore(stock, quote, profile),
            dividendScore: stock.sustainabilityScore || 50,
            financialScore: 50,
            valuationScore: 50,
            qualityScore: 50,
            momentumScore: 50,
            
            recommendation: this.getRecommendation(stock, quote, profile),
            analystRating: 3, // Default neutral rating
            priceTarget: quote.c || 0,
            analystCount: 0,
            
            // Special Categories
            isDividendAristocrat: DIVIDEND_ARISTOCRATS.includes(stock.symbol),
            isDividendKing: DIVIDEND_KINGS.includes(stock.symbol),
            isDividendContender: (stock.yearsOfGrowth || 0) >= 10 && (stock.yearsOfGrowth || 0) < 25,
            isDividendChampion: (stock.yearsOfGrowth || 0) >= 25,
            isREIT: profile.finnhubIndustry?.toLowerCase().includes('reit') || false,
            isESGLeader: false, // Would need ESG data
            
            // Risk Metrics
            volatility: 0, // Would need historical volatility calculation
            maxDrawdown: 0,
            sharpeRatio: 0,
            sortinRatio: 0,
            
            // Last Updated
            lastUpdated: new Date().toISOString(),
            dataQuality: 'Medium' as const
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