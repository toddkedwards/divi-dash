// Phase 3: Advanced Analytics Service
// Comprehensive portfolio analytics, benchmarking, and predictive insights

export interface AdvancedPortfolioMetrics {
  performance: PerformanceMetrics;
  risk: RiskMetrics;
  dividend: DividendMetrics;
  quality: QualityMetrics;
  efficiency: EfficiencyMetrics;
  attribution: AttributionAnalysis;
  predictions: PredictiveMetrics;
  benchmarks: BenchmarkComparison;
}

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  totalReturnYTD: number;
  totalReturn1Year: number;
  totalReturn3Year: number;
  totalReturn5Year: number;
  totalReturnSinceInception: number;
  dividendReturn: number;
  capitalAppreciation: number;
  compoundAnnualGrowthRate: number;
  realReturn: number; // inflation-adjusted
  riskAdjustedReturn: number;
  bestYear: { year: number; return: number };
  worstYear: { year: number; return: number };
  winRate: number; // percentage of positive return periods
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
}

export interface RiskMetrics {
  beta: number;
  alpha: number;
  sharpeRatio: number;
  sortinoRatio: number;
  treynorRatio: number;
  informationRatio: number;
  trackingError: number;
  volatility: number;
  volatilityAnnualized: number;
  maxDrawdown: number;
  maxDrawdownDuration: number; // days
  valueAtRisk: ValueAtRisk;
  conditionalVaR: number;
  upCaptureRatio: number;
  downCaptureRatio: number;
  correlationToMarket: number;
  systematicRisk: number;
  unsystematicRisk: number;
  riskContribution: RiskContribution[];
}

export interface ValueAtRisk {
  var95: number; // 95% confidence VaR
  var99: number; // 99% confidence VaR
  timeHorizon: number; // days
  methodology: 'historical' | 'parametric' | 'monte_carlo';
}

export interface RiskContribution {
  symbol: string;
  contribution: number;
  marginalContribution: number;
  componentContribution: number;
}

export interface DividendMetrics {
  currentYield: number;
  yieldOnCost: number;
  yieldGrowthRate: number;
  yieldGrowth1Year: number;
  yieldGrowth3Year: number;
  yieldGrowth5Year: number;
  payoutRatio: number;
  dividendCoverageRatio: number;
  dividendSustainabilityScore: number;
  totalDividendIncome: number;
  monthlyDividendIncome: number;
  quarterlyDividendIncome: number;
  annualDividendIncome: number;
  projectedAnnualIncome: number;
  dividendGrowthStreak: DividendGrowthStreak[];
  dividendConsistency: number;
  reinvestmentRate: number;
  compoundedDividendGrowth: number;
}

export interface DividendGrowthStreak {
  symbol: string;
  consecutiveYears: number;
  averageGrowthRate: number;
  category: 'king' | 'aristocrat' | 'achiever' | 'contender';
}

export interface QualityMetrics {
  overallQualityScore: number;
  profitabilityScore: number;
  growthScore: number;
  financialStrengthScore: number;
  valuationScore: number;
  dividendQualityScore: number;
  managementEfficiencyScore: number;
  competitivePositionScore: number;
  qualityTrend: 'improving' | 'stable' | 'declining';
  qualityDistribution: QualityDistribution;
  lowQualityHoldings: QualityHolding[];
  highQualityHoldings: QualityHolding[];
}

export interface QualityDistribution {
  excellent: number; // 90-100
  good: number; // 70-89
  average: number; // 50-69
  poor: number; // 30-49
  veryPoor: number; // 0-29
}

export interface QualityHolding {
  symbol: string;
  score: number;
  category: string;
  issues?: string[];
  strengths?: string[];
}

export interface EfficiencyMetrics {
  portfolioTurnover: number;
  tradingCosts: number;
  taxEfficiency: number;
  expenseRatio: number; // for ETFs/funds
  cashDragEffect: number;
  rebalancingEfficiency: number;
  implementationShortfall: number;
  opportunityCost: number;
  timeWeightedReturn: number;
  dollarWeightedReturn: number;
  costOfCapital: number;
}

export interface AttributionAnalysis {
  sectorAttribution: SectorAttribution[];
  securitySelection: number;
  assetAllocation: number;
  interactionEffect: number;
  totalAttribution: number;
  topContributors: AttributionContributor[];
  topDetractors: AttributionContributor[];
  attributionByPeriod: AttributionByPeriod[];
}

export interface SectorAttribution {
  sector: string;
  portfolioWeight: number;
  benchmarkWeight: number;
  portfolioReturn: number;
  benchmarkReturn: number;
  allocationEffect: number;
  selectionEffect: number;
  totalEffect: number;
}

export interface AttributionContributor {
  symbol: string;
  contribution: number;
  weight: number;
  return: number;
  reason: string;
}

export interface AttributionByPeriod {
  period: string;
  securitySelection: number;
  assetAllocation: number;
  total: number;
}

export interface PredictiveMetrics {
  expectedReturn: ExpectedReturn;
  riskForecast: RiskForecast;
  dividendForecast: DividendForecast;
  scenarios: ScenarioAnalysis;
  optimizationSuggestions: OptimizationSuggestion[];
  confidenceIntervals: ConfidenceInterval[];
}

export interface ExpectedReturn {
  oneMonth: number;
  threeMonth: number;
  sixMonth: number;
  oneYear: number;
  confidence: number;
  methodology: string;
  assumptions: string[];
}

export interface RiskForecast {
  expectedVolatility: number;
  downsideRisk: number;
  stressTestResults: StressTestResult[];
  riskBudgetUtilization: number;
}

export interface StressTestResult {
  scenario: string;
  expectedLoss: number;
  probability: number;
  duration: number;
}

export interface DividendForecast {
  nextQuarterIncome: number;
  nextYearIncome: number;
  growthProjection: number;
  riskOfCuts: number;
  sustainabilityScore: number;
}

export interface ScenarioAnalysis {
  bullMarket: ScenarioResult;
  bearMarket: ScenarioResult;
  recession: ScenarioResult;
  inflation: ScenarioResult;
  interestRateRise: ScenarioResult;
  geopoliticalCrisis: ScenarioResult;
}

export interface ScenarioResult {
  portfolioReturn: number;
  dividendImpact: number;
  worstHolding: string;
  bestHolding: string;
  probability: number;
}

export interface OptimizationSuggestion {
  type: 'rebalance' | 'add_position' | 'reduce_position' | 'sector_rotation';
  priority: 'high' | 'medium' | 'low';
  description: string;
  expectedImprovement: number;
  riskImpact: number;
  implementation: OptimizationImplementation;
}

export interface OptimizationImplementation {
  actions: OptimizationAction[];
  estimatedCost: number;
  timeframe: string;
  prerequisites?: string[];
}

export interface OptimizationAction {
  action: 'buy' | 'sell' | 'hold';
  symbol: string;
  amount: number;
  percentage: number;
  reason: string;
}

export interface ConfidenceInterval {
  metric: string;
  value: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface BenchmarkComparison {
  benchmarks: BenchmarkData[];
  relativePerfomance: RelativePerformance;
  trackingMetrics: TrackingMetrics;
  outperformancePeriods: OutperformancePeriod[];
}

export interface BenchmarkData {
  name: string;
  symbol: string;
  description: string;
  return1M: number;
  return3M: number;
  return6M: number;
  return1Y: number;
  return3Y: number;
  return5Y: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  dividendYield: number;
}

export interface RelativePerformance {
  excess1M: number;
  excess3M: number;
  excess6M: number;
  excess1Y: number;
  excess3Y: number;
  excess5Y: number;
  battingAverage: number; // percentage of periods outperformed
  averageExcess: number;
}

export interface TrackingMetrics {
  trackingError: number;
  informationRatio: number;
  correlation: number;
  beta: number;
  rSquared: number;
}

export interface OutperformancePeriod {
  period: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  excess: number;
  significance: 'high' | 'medium' | 'low';
}

export interface AdvancedScreener {
  dividendCriteria: DividendScreenCriteria;
  qualityCriteria: QualityScreenCriteria;
  valuationCriteria: ValuationScreenCriteria;
  growthCriteria: GrowthScreenCriteria;
  technicalCriteria: TechnicalScreenCriteria;
}

export interface DividendScreenCriteria {
  minYield?: number;
  maxYield?: number;
  minGrowthRate?: number;
  maxPayoutRatio?: number;
  minConsecutiveYears?: number;
  mustBeAristocrat?: boolean;
  mustBeKing?: boolean;
  excludeSuspended?: boolean;
}

export interface QualityScreenCriteria {
  minQualityScore?: number;
  minProfitabilityScore?: number;
  minFinancialStrength?: number;
  excludeLowQuality?: boolean;
  mustHaveRating?: boolean;
}

export interface ValuationScreenCriteria {
  maxPE?: number;
  maxPB?: number;
  maxEV_EBITDA?: number;
  minFreeCashFlowYield?: number;
  excludeOvervalued?: boolean;
}

export interface GrowthScreenCriteria {
  minRevenueGrowth?: number;
  minEarningsGrowth?: number;
  minDividendGrowth?: number;
  excludeNegativeGrowth?: boolean;
}

export interface TechnicalScreenCriteria {
  minRSI?: number;
  maxRSI?: number;
  priceVsMA50?: 'above' | 'below' | 'any';
  priceVsMA200?: 'above' | 'below' | 'any';
  minVolume?: number;
  trendDirection?: 'up' | 'down' | 'sideways' | 'any';
}

export interface ScreenerResult {
  symbol: string;
  name: string;
  score: number;
  matches: ScreenMatch[];
  warnings: string[];
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
}

export interface ScreenMatch {
  criteria: string;
  value: any;
  threshold: any;
  met: boolean;
}

export interface DiversificationMetrics {
  sectorConcentration: number;
  geographicDiversification: number;
  marketCapDiversification: number;
  correlationScore: number;
}

export interface SectorAllocation {
  sector: string;
  allocation: number;
  performance: number;
  riskScore: number;
  companies: string[];
}

export interface PortfolioInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'rebalance' | 'dividend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendation?: string;
  priority: number;
}

export interface AdvancedAnalytics {
  riskMetrics: RiskMetrics;
  diversificationMetrics: DiversificationMetrics;
  performanceMetrics: PerformanceMetrics;
  sectorAllocations: SectorAllocation[];
  insights: PortfolioInsight[];
  lastUpdated: Date;
}

class AdvancedAnalyticsService {
  private static instance: AdvancedAnalyticsService;
  private cache = new Map<string, AdvancedAnalytics>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  static getInstance(): AdvancedAnalyticsService {
    if (!AdvancedAnalyticsService.instance) {
      AdvancedAnalyticsService.instance = new AdvancedAnalyticsService();
    }
    return AdvancedAnalyticsService.instance;
  }

  async calculatePortfolioAnalytics(portfolioId: string, holdings: any[]): Promise<AdvancedAnalytics> {
    const cacheKey = `analytics_${portfolioId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.lastUpdated.getTime() < this.cacheExpiry) {
      return cached;
    }

    const analytics: AdvancedAnalytics = {
      riskMetrics: await this.calculateRiskMetrics(holdings),
      diversificationMetrics: await this.calculateDiversificationMetrics(holdings),
      performanceMetrics: await this.calculatePerformanceMetrics(holdings),
      sectorAllocations: await this.calculateSectorAllocations(holdings),
      insights: await this.generateInsights(holdings),
      lastUpdated: new Date()
    };

    this.cache.set(cacheKey, analytics);
    return analytics;
  }

  private async calculateRiskMetrics(holdings: any[]): Promise<RiskMetrics> {
    // Simulate risk calculations with realistic values
    const totalValue = holdings.reduce((sum, holding) => sum + (holding.shares * holding.currentPrice), 0);
    const weights = holdings.map(h => (h.shares * h.currentPrice) / totalValue);
    
    // Mock calculations - in production, use historical price data
    const volatilities = holdings.map(() => 0.15 + Math.random() * 0.25); // 15-40% volatility
    const portfolioVolatility = Math.sqrt(
      weights.reduce((sum, weight, i) => sum + Math.pow(weight * volatilities[i], 2), 0)
    );

    return {
      beta: 0.85 + Math.random() * 0.3, // 0.85 - 1.15
      alpha: 2.3,
      sharpeRatio: 0.8 + Math.random() * 0.7, // 0.8 - 1.5
      sortinoRatio: 1.45,
      treynorRatio: 0.158,
      informationRatio: 0.65,
      trackingError: 3.2,
      volatility: portfolioVolatility,
      volatilityAnnualized: 15.2,
      maxDrawdown: -(0.05 + Math.random() * 0.15), // -5% to -20%
      maxDrawdownDuration: 127,
      valueAtRisk: {
        var95: -(0.02 + Math.random() * 0.08), // -2% to -10%
        var99: -5.1,
        timeHorizon: 1,
        methodology: 'historical'
      },
      conditionalVaR: -5.1,
      upCaptureRatio: 1.05,
      downCaptureRatio: 0.87,
      correlationToMarket: 0.84,
      systematicRisk: 8.2,
      unsystematicRisk: 6.6,
      riskContribution: [
        {
          symbol: 'AAPL',
          contribution: 18.5,
          marginalContribution: 0.85,
          componentContribution: 2.8
        },
        {
          symbol: 'MSFT',
          contribution: 15.2,
          marginalContribution: 0.72,
          componentContribution: 2.3
        },
        {
          symbol: 'GOOGL',
          contribution: 12.8,
          marginalContribution: 0.68,
          componentContribution: 1.9
        }
      ]
    };
  }

  private async calculateDiversificationMetrics(holdings: any[]): Promise<DiversificationMetrics> {
    const sectorMap = new Map<string, number>();
    const totalValue = holdings.reduce((sum, holding) => sum + (holding.shares * holding.currentPrice), 0);

    holdings.forEach(holding => {
      const sector = this.getSectorForSymbol(holding.symbol);
      const value = holding.shares * holding.currentPrice;
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + value);
    });

    const sectorAllocations = Array.from(sectorMap.values()).map(value => value / totalValue);
    const herfindahlIndex = sectorAllocations.reduce((sum, allocation) => sum + Math.pow(allocation, 2), 0);

    return {
      sectorConcentration: 1 - herfindahlIndex, // Higher is more diversified
      geographicDiversification: 0.7 + Math.random() * 0.25, // Mock geographic diversity
      marketCapDiversification: 0.6 + Math.random() * 0.3, // Mock market cap diversity
      correlationScore: 0.3 + Math.random() * 0.4 // Average correlation between holdings
    };
  }

  private async calculatePerformanceMetrics(holdings: any[]): Promise<PerformanceMetrics> {
    // Mock performance calculations
    const totalReturn = -0.05 + Math.random() * 0.25; // -5% to +20%
    const totalReturnPercent = (totalReturn * 100);
    const annualizedReturn = totalReturn * (365 / 90); // Assuming 90-day period
    
    return {
      totalReturn,
      totalReturnPercent,
      annualizedReturn,
      totalReturnYTD: 8.2,
      totalReturn1Year: 18.5,
      totalReturn3Year: 9.7,
      totalReturn5Year: 11.2,
      totalReturnSinceInception: 15.5,
      dividendReturn: 3.2,
      capitalAppreciation: 15.3,
      compoundAnnualGrowthRate: 11.8,
      realReturn: 9.2, // inflation-adjusted
      riskAdjustedReturn: 0.84,
      bestYear: { year: 2023, return: 22.8 },
      worstYear: { year: 2022, return: -8.2 },
      winRate: 73.2,
      averageWin: 12.5,
      averageLoss: -5.8,
      profitFactor: 2.15
    };
  }

  private async calculateSectorAllocations(holdings: any[]): Promise<SectorAllocation[]> {
    const sectorMap = new Map<string, { allocation: number; companies: string[]; values: number[] }>();
    const totalValue = holdings.reduce((sum, holding) => sum + (holding.shares * holding.currentPrice), 0);

    holdings.forEach(holding => {
      const sector = this.getSectorForSymbol(holding.symbol);
      const value = holding.shares * holding.currentPrice;
      const allocation = value / totalValue;

      if (!sectorMap.has(sector)) {
        sectorMap.set(sector, { allocation: 0, companies: [], values: [] });
      }

      const sectorData = sectorMap.get(sector)!;
      sectorData.allocation += allocation;
      sectorData.companies.push(holding.symbol);
      sectorData.values.push(value);
    });

    return Array.from(sectorMap.entries()).map(([sector, data]) => ({
      sector,
      allocation: data.allocation,
      performance: -0.1 + Math.random() * 0.3, // Mock sector performance
      riskScore: 1 + Math.random() * 9, // 1-10 risk score
      companies: data.companies
    })).sort((a, b) => b.allocation - a.allocation);
  }

  private async generateInsights(holdings: any[]): Promise<PortfolioInsight[]> {
    const insights: PortfolioInsight[] = [];

    // Concentration risk insight
    const totalValue = holdings.reduce((sum, holding) => sum + (holding.shares * holding.currentPrice), 0);
    const topHolding = holdings.reduce((max, holding) => {
      const value = holding.shares * holding.currentPrice;
      return value > (max.shares * max.currentPrice) ? holding : max;
    });
    
    const topHoldingPercent = (topHolding.shares * topHolding.currentPrice) / totalValue;
    
    if (topHoldingPercent > 0.2) {
      insights.push({
        id: 'concentration-risk',
        type: 'risk',
        title: 'High Concentration Risk',
        description: `${topHolding.symbol} represents ${(topHoldingPercent * 100).toFixed(1)}% of your portfolio`,
        impact: 'high',
        actionable: true,
        recommendation: 'Consider reducing position size to below 15% of portfolio',
        priority: 9
      });
    }

    // Dividend opportunity insight
    const lowDividendHoldings = holdings.filter(h => (h.dividendYield || 0) < 0.02);
    if (lowDividendHoldings.length > holdings.length * 0.6) {
      insights.push({
        id: 'dividend-opportunity',
        type: 'opportunity',
        title: 'Low Dividend Yield Portfolio',
        description: `${lowDividendHoldings.length} holdings have dividend yields below 2%`,
        impact: 'medium',
        actionable: true,
        recommendation: 'Consider adding dividend-focused ETFs or blue-chip dividend stocks',
        priority: 6
      });
    }

    // Rebalancing insight
    insights.push({
      id: 'rebalancing-needed',
      type: 'rebalance',
      title: 'Portfolio Rebalancing Opportunity',
      description: 'Some sectors are overweight compared to target allocation',
      impact: 'medium',
      actionable: true,
      recommendation: 'Review sector allocations and consider rebalancing',
      priority: 5
    });

    // Growth opportunity insight
    insights.push({
      id: 'growth-opportunity',
      type: 'opportunity',
      title: 'Emerging Market Exposure',
      description: 'Portfolio has limited exposure to emerging markets',
      impact: 'low',
      actionable: true,
      recommendation: 'Consider adding emerging market ETF for diversification',
      priority: 3
    });

    return insights.sort((a, b) => b.priority - a.priority);
  }

  private getSectorForSymbol(symbol: string): string {
    const sectorMap: { [key: string]: string } = {
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology',
      'AMZN': 'Consumer Discretionary',
      'TSLA': 'Consumer Discretionary',
      'JNJ': 'Healthcare',
      'PFE': 'Healthcare',
      'JPM': 'Financials',
      'BAC': 'Financials',
      'XOM': 'Energy',
      'CVX': 'Energy',
      'KO': 'Consumer Staples',
      'PG': 'Consumer Staples',
      'DIS': 'Communication Services',
      'NFLX': 'Communication Services',
      'V': 'Financials',
      'MA': 'Financials',
      'NVDA': 'Technology',
      'AMD': 'Technology',
      'CRM': 'Technology'
    };

    return sectorMap[symbol] || 'Other';
  }

  // Risk assessment methods
  async assessPortfolioRisk(holdings: any[]): Promise<{
    riskLevel: 'low' | 'moderate' | 'high';
    riskFactors: string[];
    recommendations: string[];
  }> {
    const analytics = await this.calculatePortfolioAnalytics('temp', holdings);
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    let riskScore = 0;

    // Volatility risk
    if (analytics.riskMetrics.volatility > 0.25) {
      riskScore += 3;
      riskFactors.push('High portfolio volatility');
      recommendations.push('Consider adding stable, low-volatility stocks');
    }

    // Concentration risk
    if (analytics.diversificationMetrics.sectorConcentration < 0.6) {
      riskScore += 2;
      riskFactors.push('Poor sector diversification');
      recommendations.push('Diversify across more sectors');
    }

    // Beta risk
    if (analytics.riskMetrics.beta > 1.2) {
      riskScore += 2;
      riskFactors.push('High market sensitivity');
      recommendations.push('Add defensive stocks to reduce beta');
    }

    const riskLevel = riskScore >= 5 ? 'high' : riskScore >= 3 ? 'moderate' : 'low';

    return { riskLevel, riskFactors, recommendations };
  }
}

export default AdvancedAnalyticsService; 