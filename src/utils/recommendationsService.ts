import { newsService, NewsArticle, SentimentScore } from './newsService';

// Core recommendation interfaces
export interface StockRecommendation {
  id: string;
  symbol: string;
  companyName: string;
  recommendationType: 'buy' | 'hold' | 'sell' | 'strong_buy' | 'strong_sell';
  confidenceScore: number; // 0-100
  targetPrice: number;
  currentPrice: number;
  potentialReturn: number;
  riskLevel: 'low' | 'moderate' | 'high';
  sector: string;
  marketCap: number;
  dividendYield: number;
  peRatio: number;
  reasoning: string[];
  catalysts: string[];
  risks: string[];
  timeHorizon: '1-3 months' | '3-6 months' | '6-12 months' | '1-2 years';
  score: number; // Overall recommendation score
  lastUpdated: Date;
}

export interface DividendPrediction {
  symbol: string;
  currentDividend: number;
  predictedDividend: {
    nextQuarter: number;
    nextYear: number;
    threeYear: number;
  };
  growthRate: {
    historical: number;
    predicted: number;
  };
  sustainability: {
    score: number; // 0-100
    factors: string[];
    risks: string[];
  };
  payoutRatio: number;
  cashFlowCoverage: number;
  confidence: number;
  lastUpdated: Date;
}

export interface PortfolioOptimization {
  id: string;
  type: 'rebalancing' | 'diversification' | 'tax_optimization' | 'risk_reduction' | 'income_enhancement';
  title: string;
  description: string;
  currentAllocation: { [sector: string]: number };
  recommendedAllocation: { [sector: string]: number };
  actions: OptimizationAction[];
  expectedImpact: {
    returnImprovement: number;
    riskReduction: number;
    incomeIncrease: number;
    taxSavings?: number;
  };
  implementation: {
    difficulty: 'easy' | 'moderate' | 'complex';
    timeRequired: string;
    cost: number;
    steps: string[];
  };
  confidenceScore: number;
  priority: number;
  validUntil: Date;
}

export interface OptimizationAction {
  action: 'buy' | 'sell' | 'rebalance';
  symbol: string;
  quantity: number;
  amount: number;
  reasoning: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface MarketSentiment {
  symbol?: string;
  sector?: string;
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number; // -100 to +100
  confidence: number;
  sources: {
    news: number;
    social: number;
    analyst: number;
    technical: number;
  };
  trends: {
    shortTerm: 'up' | 'down' | 'sideways';
    mediumTerm: 'up' | 'down' | 'sideways';
    longTerm: 'up' | 'down' | 'sideways';
  };
  keyFactors: string[];
  lastUpdated: Date;
}

export interface PersonalizationProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentGoals: ('income' | 'growth' | 'preservation' | 'speculation')[];
  timeHorizon: 'short' | 'medium' | 'long';
  preferredSectors: string[];
  avoidedSectors: string[];
  dividendFocus: boolean;
  esgPreference: boolean;
  portfolioSize: number;
  age: number;
  experience: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    maxPositionSize: number;
    minDividendYield: number;
    maxPeRatio: number;
    preferredMarketCap: ('small' | 'mid' | 'large')[];
  };
}

export interface AIInsight {
  id: string;
  type: 'market_trend' | 'portfolio_alert' | 'opportunity' | 'risk_warning' | 'educational';
  title: string;
  summary: string;
  content: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  relatedSymbols: string[];
  tags: string[];
  sources: string[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface DividendMetrics {
  currentYield: number;
  dividendGrowthRate: number; // 5-year average
  payoutRatio: number;
  yearsOfGrowth: number;
  dividendSafety: 'excellent' | 'good' | 'fair' | 'poor' | 'risky';
  sustainabilityScore: number; // 0 to 100
  aristocratStatus: 'king' | 'aristocrat' | 'contender' | 'none';
  nextExDate?: string;
  quarterlyAmount?: number;
  annualAmount?: number;
}

export interface RiskMetrics {
  beta: number;
  volatility: number; // annualized
  maxDrawdown: number;
  sharpeRatio: number;
  creditRating?: string;
  debtToEquity: number;
  currentRatio: number;
  sectorRisk: 'low' | 'medium' | 'high';
  concentrationRisk: number;
}

export interface QualityScore {
  overall: number; // 0 to 100
  profitability: number;
  growth: number;
  financial_strength: number;
  valuation: number;
  management: number;
  competitive_position: number;
  dividend_quality: number;
}

export interface MarketMetrics {
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  psRatio: number;
  evEbitda: number;
  roe: number;
  roa: number;
  roic: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  revenueGrowth: number;
  earningsGrowth: number;
  bookValueGrowth: number;
}

export interface RecommendationCategory {
  primary: 'dividend_growth' | 'high_yield' | 'value' | 'quality' | 'momentum' | 'defensive';
  secondary?: string[];
  tags: string[];
  sector: string;
  industry: string;
}

export interface PortfolioAnalysis {
  currentAllocation: SectorAllocation[];
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  dividendFocus: number; // 0 to 1
  qualityFocus: number; // 0 to 1
  growthFocus: number; // 0 to 1
  overweightSectors: string[];
  underweightSectors: string[];
  concentrationRisks: string[];
  recommendations: PortfolioRecommendation[];
}

export interface SectorAllocation {
  sector: string;
  currentWeight: number;
  targetWeight: number;
  deviation: number;
}

export interface PortfolioRecommendation {
  type: 'add' | 'reduce' | 'rebalance' | 'diversify';
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  suggestedActions: string[];
}

export interface AIInsights {
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  sectorTrends: SectorTrend[];
  dividendTrends: DividendTrend[];
  riskAlerts: RiskAlert[];
  opportunities: Opportunity[];
  predictions: MarketPrediction[];
}

export interface SectorTrend {
  sector: string;
  trend: 'positive' | 'negative' | 'neutral';
  strength: number; // 0 to 1
  timeframe: string;
  reasoning: string;
}

export interface DividendTrend {
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  affectedSectors: string[];
  reasoning: string;
}

export interface RiskAlert {
  type: 'dividend_cut' | 'earnings_miss' | 'sector_rotation' | 'macro_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedStocks: string[];
  timeframe: string;
}

export interface Opportunity {
  type: 'undervalued' | 'growth' | 'yield' | 'turnaround' | 'special_situation';
  description: string;
  confidence: number;
  potentialReturn: number;
  symbols: string[];
}

export interface MarketPrediction {
  timeframe: '1_month' | '3_months' | '6_months' | '1_year';
  prediction: string;
  confidence: number;
  reasoning: string[];
}

// Dividend Aristocrats and Kings Database
export interface DividendAristocrat {
  symbol: string;
  companyName: string;
  sector: string;
  yearsOfGrowth: number;
  status: 'king' | 'aristocrat';
  currentYield: number;
  avgGrowthRate: number;
  marketCap: number;
  qualityRating: number;
  riskRating: 'low' | 'medium' | 'high';
  lastIncrease: string;
  nextExpectedIncrease: string;
}

class RecommendationsService {
  private static instance: RecommendationsService;
  private profile: PersonalizationProfile | null = null;
  private marketData = new Map<string, any>();
  private sentimentCache = new Map<string, MarketSentiment>();
  private recommendationsCache = new Map<string, StockRecommendation[]>();
  private lastUpdate = new Map<string, Date>();

  static getInstance(): RecommendationsService {
    if (!RecommendationsService.instance) {
      RecommendationsService.instance = new RecommendationsService();
    }
    return RecommendationsService.instance;
  }

  // Profile Management
  setPersonalizationProfile(profile: PersonalizationProfile): void {
    this.profile = profile;
    this.clearCache(); // Refresh recommendations with new profile
  }

  getPersonalizationProfile(): PersonalizationProfile | null {
    return this.profile;
  }

  // Stock Recommendations
  async generateStockRecommendations(
    portfolioHoldings: any[],
    limit: number = 10
  ): Promise<StockRecommendation[]> {
    const cacheKey = `recommendations_${portfolioHoldings.length}_${limit}`;
    const cached = this.recommendationsCache.get(cacheKey);
    const lastUpdated = this.lastUpdate.get(cacheKey);
    
    if (cached && lastUpdated && Date.now() - lastUpdated.getTime() < 30 * 60 * 1000) {
      return cached;
    }

    const recommendations = await this.analyzeAndRecommend(portfolioHoldings, limit);
    this.recommendationsCache.set(cacheKey, recommendations);
    this.lastUpdate.set(cacheKey, new Date());
    
    return recommendations;
  }

  private async analyzeAndRecommend(
    portfolioHoldings: any[],
    limit: number
  ): Promise<StockRecommendation[]> {
    // Analyze current portfolio
    const portfolioAnalysis = this.analyzePortfolio(portfolioHoldings);
    
    // Generate recommendations based on gaps and opportunities
    const recommendations: StockRecommendation[] = [];
    
    // Mock recommendation pool - in production would use real ML models
    const candidateStocks = [
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', sector: 'Diversified' },
      { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', sector: 'Diversified' },
      { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', sector: 'Diversified' },
      { symbol: 'REML', name: 'Real Estate Investment Trust', sector: 'Real Estate' },
      { symbol: 'O', name: 'Realty Income Corporation', sector: 'Real Estate' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials' },
      { symbol: 'V', name: 'Visa Inc.', sector: 'Financials' },
      { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
      { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
      { symbol: 'VZ', name: 'Verizon Communications', sector: 'Telecommunications' },
      { symbol: 'T', name: 'AT&T Inc.', sector: 'Telecommunications' },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy' },
      { symbol: 'NEE', name: 'NextEra Energy', sector: 'Utilities' },
      { symbol: 'SO', name: 'Southern Company', sector: 'Utilities' }
    ];

    // Filter candidates based on portfolio gaps and user preferences
    const filteredCandidates = candidateStocks.filter(stock => {
      // Don't recommend stocks already owned
      if (portfolioHoldings.some(h => h.symbol === stock.symbol)) return false;
      
      // Check sector preferences
      if (this.profile?.preferredSectors && this.profile.preferredSectors.length > 0) {
        return this.profile.preferredSectors.includes(stock.sector);
      }
      
      // Check avoided sectors
      if (this.profile?.avoidedSectors?.includes(stock.sector)) return false;
      
      return true;
    });

    // Generate recommendations for filtered candidates
    for (const stock of filteredCandidates.slice(0, limit)) {
      const recommendation = await this.generateSingleRecommendation(
        stock,
        portfolioAnalysis
      );
      recommendations.push(recommendation);
    }

    // Sort by score and confidence
    return recommendations
      .sort((a, b) => (b.score * b.confidenceScore) - (a.score * a.confidenceScore))
      .slice(0, limit);
  }

  private async generateSingleRecommendation(
    stock: any,
    portfolioAnalysis: any
  ): Promise<StockRecommendation> {
    // Mock recommendation generation - in production would use real ML models
    const currentPrice = 50 + Math.random() * 150; // $50-$200
    const targetPrice = currentPrice * (1 + (Math.random() * 0.4 - 0.1)); // ±40%
    const potentialReturn = (targetPrice - currentPrice) / currentPrice;
    
    const dividendYield = Math.random() * 0.08; // 0-8%
    const peRatio = 10 + Math.random() * 30; // 10-40 P/E
    
    // Calculate scores based on various factors
    const fundamentalScore = this.calculateFundamentalScore(stock, dividendYield, peRatio);
    const technicalScore = this.calculateTechnicalScore(stock);
    const sentimentScore = this.calculateSentimentScore(stock);
    const fitScore = this.calculatePortfolioFitScore(stock, portfolioAnalysis);
    
    const overallScore = (fundamentalScore + technicalScore + sentimentScore + fitScore) / 4;
    const confidenceScore = 60 + Math.random() * 35; // 60-95%
    
    const recommendationType = this.determineRecommendationType(overallScore, potentialReturn);
    const riskLevel = this.assessRiskLevel(stock, overallScore);
    
    return {
      id: `recommendation_${stock.symbol}_${Date.now()}`,
      symbol: stock.symbol,
      companyName: stock.name,
      recommendationType,
      confidenceScore,
      targetPrice,
      currentPrice,
      potentialReturn,
      riskLevel,
      sector: stock.sector,
      marketCap: 1000000000 + Math.random() * 500000000000, // $1B - $500B
      dividendYield,
      peRatio,
      reasoning: this.generateReasoning(stock, overallScore, portfolioAnalysis),
      catalysts: this.generateCatalysts(stock),
      risks: this.generateRisks(stock),
      timeHorizon: this.determineTimeHorizon(overallScore),
      score: overallScore,
      lastUpdated: new Date()
    };
  }

  private calculateFundamentalScore(stock: any, dividendYield: number, peRatio: number): number {
    let score = 50; // Base score
    
    // Dividend yield scoring
    if (this.profile?.dividendFocus) {
      score += Math.min(dividendYield * 1000, 30); // Up to 30 points for high yield
    }
    
    // P/E ratio scoring (lower is generally better)
    if (peRatio < 15) score += 15;
    else if (peRatio < 25) score += 10;
    else score -= 5;
    
    // Sector preferences
    if (this.profile?.preferredSectors?.includes(stock.sector)) {
      score += 20;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateTechnicalScore(stock: any): number {
    // Mock technical analysis score
    return 40 + Math.random() * 40; // 40-80
  }

  private calculateSentimentScore(stock: any): number {
    // Mock sentiment analysis score
    return 30 + Math.random() * 50; // 30-80
  }

  private calculatePortfolioFitScore(stock: any, portfolioAnalysis: any): number {
    let score = 50;
    
    // Diversification benefit
    const sectorConcentration = portfolioAnalysis.sectorWeights[stock.sector] || 0;
    if (sectorConcentration < 0.15) score += 20; // Good diversification
    else if (sectorConcentration > 0.4) score -= 15; // Over-concentration
    
    // Risk tolerance alignment
    if (this.profile?.riskTolerance === 'conservative' && stock.sector === 'Utilities') {
      score += 15;
    } else if (this.profile?.riskTolerance === 'aggressive' && stock.sector === 'Technology') {
      score += 15;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private determineRecommendationType(score: number, potentialReturn: number): StockRecommendation['recommendationType'] {
    if (score >= 80 && potentialReturn > 0.15) return 'strong_buy';
    if (score >= 65 && potentialReturn > 0.05) return 'buy';
    if (score >= 40) return 'hold';
    if (score < 30 || potentialReturn < -0.15) return 'strong_sell';
    return 'sell';
  }

  private assessRiskLevel(stock: any, score: number): 'low' | 'moderate' | 'high' {
    if (['Utilities', 'Consumer Staples'].includes(stock.sector) && score > 60) return 'low';
    if (['Technology', 'Biotechnology'].includes(stock.sector) || score < 40) return 'high';
    return 'moderate';
  }

  private generateReasoning(stock: any, score: number, portfolioAnalysis: any): string[] {
    const reasons = [];
    
    if (score > 70) {
      reasons.push('Strong fundamental metrics and attractive valuation');
      reasons.push('Positive analyst consensus and earnings momentum');
    }
    
    if (this.profile?.dividendFocus && stock.sector !== 'Technology') {
      reasons.push('Reliable dividend history with sustainable payout ratio');
    }
    
    const sectorWeight = portfolioAnalysis.sectorWeights[stock.sector] || 0;
    if (sectorWeight < 0.1) {
      reasons.push(`Provides diversification into underrepresented ${stock.sector} sector`);
    }
    
    if (['Utilities', 'Real Estate'].includes(stock.sector)) {
      reasons.push('Defensive characteristics suitable for current market environment');
    }
    
    return reasons.length > 0 ? reasons : ['Meets basic investment criteria for diversified portfolio'];
  }

  private generateCatalysts(stock: any): string[] {
    const catalysts = [
      'Upcoming earnings announcement expected to beat estimates',
      'Industry tailwinds and secular growth trends',
      'Management guidance revision potential',
      'Dividend increase announcement likelihood'
    ];
    
    return catalysts.slice(0, 2 + Math.floor(Math.random() * 2)); // 2-3 catalysts
  }

  private generateRisks(stock: any): string[] {
    const risks = [
      'Market volatility and economic uncertainty',
      'Sector-specific regulatory changes',
      'Interest rate sensitivity',
      'Competition from industry peers',
      'Execution risk on growth initiatives'
    ];
    
    return risks.slice(0, 2 + Math.floor(Math.random() * 2)); // 2-3 risks
  }

  private determineTimeHorizon(score: number): StockRecommendation['timeHorizon'] {
    if (score > 80) return '6-12 months';
    if (score > 60) return '3-6 months';
    return '1-3 months';
  }

  private analyzePortfolio(holdings: any[]): any {
    const sectorWeights: { [sector: string]: number } = {};
    const totalValue = holdings.reduce((sum, h) => sum + (h.marketValue || h.shares * h.currentPrice), 0);
    
    holdings.forEach(holding => {
      const sector = holding.sector || 'Other';
      const weight = (holding.marketValue || holding.shares * holding.currentPrice) / totalValue;
      sectorWeights[sector] = (sectorWeights[sector] || 0) + weight;
    });
    
    return { sectorWeights, totalValue, holdingCount: holdings.length };
  }

  // Dividend Predictions
  async generateDividendPredictions(symbols: string[]): Promise<DividendPrediction[]> {
    const predictions: DividendPrediction[] = [];
    
    for (const symbol of symbols) {
      const prediction = await this.generateDividendPrediction(symbol);
      predictions.push(prediction);
    }
    
    return predictions;
  }

  private async generateDividendPrediction(symbol: string): Promise<DividendPrediction> {
    // Mock dividend prediction - in production would use ML models
    const currentDividend = 0.5 + Math.random() * 2; // $0.50 - $2.50 quarterly
    const historicalGrowth = 0.03 + Math.random() * 0.12; // 3-15% historical growth
    const predictedGrowth = historicalGrowth * (0.8 + Math.random() * 0.4); // Slight variance
    
    const nextQuarter = currentDividend * (1 + predictedGrowth / 4);
    const nextYear = currentDividend * 4 * (1 + predictedGrowth);
    const threeYear = currentDividend * 4 * Math.pow(1 + predictedGrowth, 3);
    
    const payoutRatio = 0.3 + Math.random() * 0.5; // 30-80%
    const sustainabilityScore = payoutRatio < 0.6 ? 80 + Math.random() * 20 : 40 + Math.random() * 40;
    
    return {
      symbol,
      currentDividend,
      predictedDividend: {
        nextQuarter,
        nextYear,
        threeYear
      },
      growthRate: {
        historical: historicalGrowth,
        predicted: predictedGrowth
      },
      sustainability: {
        score: sustainabilityScore,
        factors: this.generateSustainabilityFactors(sustainabilityScore),
        risks: this.generateSustainabilityRisks(sustainabilityScore)
      },
      payoutRatio,
      cashFlowCoverage: 1.5 + Math.random() * 2, // 1.5x - 3.5x coverage
      confidence: 60 + Math.random() * 30, // 60-90%
      lastUpdated: new Date()
    };
  }

  private generateSustainabilityFactors(score: number): string[] {
    const factors = [];
    
    if (score > 70) {
      factors.push('Strong free cash flow generation');
      factors.push('Conservative payout ratio');
      factors.push('Consistent earnings growth');
    } else {
      factors.push('Moderate cash flow stability');
      factors.push('Management commitment to dividend');
    }
    
    return factors;
  }

  private generateSustainabilityRisks(score: number): string[] {
    const risks = [];
    
    if (score < 60) {
      risks.push('High payout ratio limits flexibility');
      risks.push('Cyclical earnings pressure');
    }
    
    risks.push('Economic downturn impact on cash flows');
    risks.push('Capital allocation competing priorities');
    
    return risks;
  }

  // Portfolio Optimization
  async generatePortfolioOptimizations(
    holdings: any[],
    goals: string[] = ['diversification', 'income']
  ): Promise<PortfolioOptimization[]> {
    const optimizations: PortfolioOptimization[] = [];
    
    // Analyze current portfolio
    const analysis = this.analyzePortfolio(holdings);
    
    // Generate different types of optimizations
    if (goals.includes('diversification')) {
      const diversificationOpt = await this.generateDiversificationOptimization(holdings, analysis);
      optimizations.push(diversificationOpt);
    }
    
    if (goals.includes('income')) {
      const incomeOpt = await this.generateIncomeOptimization(holdings, analysis);
      optimizations.push(incomeOpt);
    }
    
    if (goals.includes('risk_reduction')) {
      const riskOpt = await this.generateRiskReductionOptimization(holdings, analysis);
      optimizations.push(riskOpt);
    }
    
    return optimizations.sort((a, b) => b.priority - a.priority);
  }

  private async generateDiversificationOptimization(
    holdings: any[],
    analysis: any
  ): Promise<PortfolioOptimization> {
    // Identify over-concentrated sectors
    const overweightSectors = Object.entries(analysis.sectorWeights)
      .filter(([_, weight]) => (weight as number) > 0.3)
      .map(([sector]) => sector);
    
    const actions: OptimizationAction[] = [];
    
    // Generate rebalancing actions
    if (overweightSectors.length > 0) {
      const overweightSector = overweightSectors[0];
      const targetReduction = analysis.totalValue * 0.1; // Reduce by 10%
      
      actions.push({
        action: 'sell',
        symbol: holdings.find(h => h.sector === overweightSector)?.symbol || 'AAPL',
        quantity: 0,
        amount: targetReduction,
        reasoning: `Reduce overweight position in ${overweightSector} sector`,
        urgency: 'medium'
      });
      
      actions.push({
        action: 'buy',
        symbol: 'VYM', // Diversified dividend ETF
        quantity: 0,
        amount: targetReduction,
        reasoning: 'Add diversified dividend exposure',
        urgency: 'medium'
      });
    }
    
    return {
      id: `diversification_${Date.now()}`,
      type: 'diversification',
      title: 'Portfolio Diversification Enhancement',
      description: 'Improve sector diversification and reduce concentration risk',
      currentAllocation: analysis.sectorWeights,
      recommendedAllocation: this.generateRecommendedAllocation(analysis.sectorWeights),
      actions,
      expectedImpact: {
        returnImprovement: 0.005, // 0.5%
        riskReduction: 0.08, // 8%
        incomeIncrease: 0.002 // 0.2%
      },
      implementation: {
        difficulty: 'moderate',
        timeRequired: '1-2 weeks',
        cost: 50,
        steps: [
          'Review current sector allocations',
          'Identify overweight positions',
          'Execute partial sales of concentrated holdings',
          'Reinvest proceeds in diversified assets'
        ]
      },
      confidenceScore: 75,
      priority: 7,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };
  }

  private async generateIncomeOptimization(
    holdings: any[],
    analysis: any
  ): Promise<PortfolioOptimization> {
    const currentYield = holdings.reduce((sum, h) => {
      const weight = (h.marketValue || h.shares * h.currentPrice) / analysis.totalValue;
      return sum + (h.dividendYield || 0) * weight;
    }, 0);
    
    const actions: OptimizationAction[] = [
      {
        action: 'buy',
        symbol: 'SCHD',
        quantity: 0,
        amount: analysis.totalValue * 0.1,
        reasoning: 'Add high-quality dividend ETF for income enhancement',
        urgency: 'low'
      },
      {
        action: 'buy',
        symbol: 'REML',
        quantity: 0,
        amount: analysis.totalValue * 0.05,
        reasoning: 'Add REIT exposure for higher yield',
        urgency: 'low'
      }
    ];
    
    return {
      id: `income_${Date.now()}`,
      type: 'income_enhancement',
      title: 'Income Enhancement Strategy',
      description: 'Increase portfolio dividend yield while maintaining quality',
      currentAllocation: analysis.sectorWeights,
      recommendedAllocation: { ...analysis.sectorWeights, 'Real Estate': 0.1 },
      actions,
      expectedImpact: {
        returnImprovement: 0.003,
        riskReduction: -0.02,
        incomeIncrease: 0.015 // 1.5% yield increase
      },
      implementation: {
        difficulty: 'easy',
        timeRequired: '1 week',
        cost: 25,
        steps: [
          'Research high-quality dividend ETFs',
          'Allocate 10-15% to dividend-focused investments',
          'Monitor income generation and sustainability'
        ]
      },
      confidenceScore: 85,
      priority: 8,
      validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days
    };
  }

  private async generateRiskReductionOptimization(
    holdings: any[],
    analysis: any
  ): Promise<PortfolioOptimization> {
    return {
      id: `risk_reduction_${Date.now()}`,
      type: 'risk_reduction',
      title: 'Portfolio Risk Reduction',
      description: 'Lower overall portfolio volatility and drawdown risk',
      currentAllocation: analysis.sectorWeights,
      recommendedAllocation: this.generateLowRiskAllocation(analysis.sectorWeights),
      actions: [
        {
          action: 'buy',
          symbol: 'BND',
          quantity: 0,
          amount: analysis.totalValue * 0.15,
          reasoning: 'Add bond allocation for stability',
          urgency: 'medium'
        }
      ],
      expectedImpact: {
        returnImprovement: -0.01,
        riskReduction: 0.15,
        incomeIncrease: 0.005
      },
      implementation: {
        difficulty: 'easy',
        timeRequired: '3-5 days',
        cost: 15,
        steps: [
          'Add 15% bond allocation',
          'Reduce high-volatility positions',
          'Monitor risk metrics'
        ]
      },
      confidenceScore: 80,
      priority: 6,
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    };
  }

  private generateRecommendedAllocation(current: { [sector: string]: number }): { [sector: string]: number } {
    // Generate a more balanced allocation
    const recommended = { ...current };
    
    // Cap any sector at 25%
    Object.keys(recommended).forEach(sector => {
      if (recommended[sector] > 0.25) {
        recommended[sector] = 0.25;
      }
    });
    
    return recommended;
  }

  private generateLowRiskAllocation(current: { [sector: string]: number }): { [sector: string]: number } {
    return {
      ...current,
      'Utilities': Math.max(current['Utilities'] || 0, 0.15),
      'Consumer Staples': Math.max(current['Consumer Staples'] || 0, 0.15),
      'Bonds': 0.2
    };
  }

  // Market Sentiment Analysis
  async getMarketSentiment(symbol?: string, sector?: string): Promise<MarketSentiment> {
    const cacheKey = symbol || sector || 'overall';
    const cached = this.sentimentCache.get(cacheKey);
    
    if (cached && Date.now() - cached.lastUpdated.getTime() < 15 * 60 * 1000) {
      return cached;
    }
    
    const sentiment = await this.analyzeSentiment(symbol, sector);
    this.sentimentCache.set(cacheKey, sentiment);
    
    return sentiment;
  }

  private async analyzeSentiment(symbol?: string, sector?: string): Promise<MarketSentiment> {
    // Mock sentiment analysis - in production would use real NLP and data sources
    const score = -20 + Math.random() * 40; // -20 to +20
    const confidence = 60 + Math.random() * 30;
    
    const overall = score > 10 ? 'bullish' : score < -10 ? 'bearish' : 'neutral';
    
    return {
      symbol,
      sector,
      overall,
      score,
      confidence,
      sources: {
        news: -10 + Math.random() * 20,
        social: -15 + Math.random() * 30,
        analyst: -5 + Math.random() * 15,
        technical: -10 + Math.random() * 20
      },
      trends: {
        shortTerm: Math.random() > 0.5 ? 'up' : 'down',
        mediumTerm: Math.random() > 0.4 ? 'up' : 'down',
        longTerm: Math.random() > 0.6 ? 'up' : 'sideways'
      },
      keyFactors: this.generateSentimentFactors(overall),
      lastUpdated: new Date()
    };
  }

  private generateSentimentFactors(sentiment: MarketSentiment['overall']): string[] {
    const factors = {
      bullish: [
        'Strong earnings momentum across sectors',
        'Positive economic indicators',
        'Increased institutional buying',
        'Favorable regulatory environment'
      ],
      bearish: [
        'Economic uncertainty and inflation concerns',
        'Geopolitical tensions affecting markets',
        'Rising interest rates pressuring valuations',
        'Increased market volatility'
      ],
      neutral: [
        'Mixed economic signals',
        'Sector rotation activity',
        'Balanced institutional flows',
        'Moderate volatility levels'
      ]
    };
    
    return factors[sentiment].slice(0, 3);
  }

  // AI Insights Generation
  async generateAIInsights(portfolioData: any[]): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];
    
    // Market trend insights
    insights.push(await this.generateMarketTrendInsight());
    
    // Portfolio-specific insights
    insights.push(...await this.generatePortfolioInsights(portfolioData));
    
    // Educational insights
    insights.push(await this.generateEducationalInsight());
    
    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  private async generateMarketTrendInsight(): Promise<AIInsight> {
    return {
      id: `market_trend_${Date.now()}`,
      type: 'market_trend',
      title: 'Emerging Market Opportunities in Dividend Growth',
      summary: 'Several high-quality dividend aristocrats showing acceleration in growth rates',
      content: 'Our analysis indicates that companies with 10+ years of consecutive dividend increases are experiencing above-average earnings growth, creating opportunities for dividend-focused investors. Key sectors include utilities, consumer staples, and REITs.',
      confidence: 82,
      impact: 'medium',
      actionable: true,
      relatedSymbols: ['KO', 'PG', 'JNJ', 'O'],
      tags: ['dividend growth', 'aristocrats', 'utilities', 'consumer staples'],
      sources: ['earnings reports', 'dividend announcements', 'sector analysis'],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }

  private async generatePortfolioInsights(portfolioData: any[]): Promise<AIInsight[]> {
    return [
      {
        id: `portfolio_alert_${Date.now()}`,
        type: 'portfolio_alert',
        title: 'Technology Sector Concentration Above Optimal',
        summary: 'Your technology allocation exceeds recommended diversification guidelines',
        content: 'Current technology sector allocation represents 35% of your portfolio, above the recommended 25% maximum. Consider rebalancing to reduce concentration risk while maintaining growth exposure.',
        confidence: 88,
        impact: 'high',
        actionable: true,
        relatedSymbols: portfolioData.filter(h => h.sector === 'Technology').map(h => h.symbol),
        tags: ['diversification', 'risk management', 'rebalancing'],
        sources: ['portfolio analysis'],
        createdAt: new Date()
      }
    ];
  }

  private async generateEducationalInsight(): Promise<AIInsight> {
    return {
      id: `educational_${Date.now()}`,
      type: 'educational',
      title: 'Understanding Dividend Sustainability Metrics',
      summary: 'Key ratios to evaluate long-term dividend sustainability',
      content: 'Payout ratio, free cash flow coverage, and debt-to-equity ratios are crucial metrics for assessing dividend sustainability. Companies with payout ratios below 60% and strong cash flow coverage typically maintain more stable dividend payments through economic cycles.',
      confidence: 95,
      impact: 'low',
      actionable: false,
      relatedSymbols: [],
      tags: ['education', 'dividend analysis', 'fundamentals'],
      sources: ['financial education'],
      createdAt: new Date()
    };
  }

  // Utility methods
  private clearCache(): void {
    this.recommendationsCache.clear();
    this.sentimentCache.clear();
    this.lastUpdate.clear();
  }

  // Demo data generator
  generateDemoProfile(): PersonalizationProfile {
    return {
      riskTolerance: 'moderate',
      investmentGoals: ['income', 'growth'],
      timeHorizon: 'long',
      preferredSectors: ['Technology', 'Healthcare', 'Consumer Staples'],
      avoidedSectors: ['Energy'],
      dividendFocus: true,
      esgPreference: false,
      portfolioSize: 75000,
      age: 35,
      experience: 'intermediate',
      preferences: {
        maxPositionSize: 0.15,
        minDividendYield: 0.02,
        maxPeRatio: 25,
        preferredMarketCap: ['mid', 'large']
      }
    };
  }
}

export default RecommendationsService;