'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  DollarSign,
  BarChart3,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Filter,
  Settings,
  Lightbulb,
  Zap,
  Info,
  ExternalLink,
  Download,
  Users,
  Calendar,
  Bookmark
} from 'lucide-react';
import RecommendationsService, {
  StockRecommendation,
  DividendPrediction,
  PortfolioOptimization,
  MarketSentiment,
  AIInsight,
  PersonalizationProfile
} from '../../utils/recommendationsService';

export default function AIRecommendationsPage() {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'dividends' | 'optimization' | 'insights'>('recommendations');
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([]);
  const [dividendPredictions, setDividendPredictions] = useState<DividendPrediction[]>([]);
  const [optimizations, setOptimizations] = useState<PortfolioOptimization[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'hold' | 'sell'>('all');
  const [confidenceFilter, setConfidenceFilter] = useState(0);
  
  const [recommendationsService] = useState(() => RecommendationsService.getInstance());

  // Mock portfolio data for demo
  const mockPortfolio = [
    { symbol: 'AAPL', shares: 50, currentPrice: 175.43, marketValue: 8771.50, sector: 'Technology' },
    { symbol: 'MSFT', shares: 30, currentPrice: 380.23, marketValue: 11406.90, sector: 'Technology' },
    { symbol: 'JNJ', shares: 75, currentPrice: 160.12, marketValue: 12009.00, sector: 'Healthcare' },
    { symbol: 'KO', shares: 100, currentPrice: 58.47, marketValue: 5847.00, sector: 'Consumer Staples' },
    { symbol: 'NVDA', shares: 20, currentPrice: 875.30, marketValue: 17506.00, sector: 'Technology' }
  ];

  useEffect(() => {
    loadData();
    initializeProfile();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [recs, divs, opts, insightsData, sentiment] = await Promise.all([
        recommendationsService.generateStockRecommendations(mockPortfolio, 12),
        recommendationsService.generateDividendPredictions(mockPortfolio.map(h => h.symbol)),
        recommendationsService.generatePortfolioOptimizations(mockPortfolio),
        recommendationsService.generateAIInsights(mockPortfolio),
        recommendationsService.getMarketSentiment()
      ]);

      setRecommendations(recs);
      setDividendPredictions(divs);
      setOptimizations(opts);
      setInsights(insightsData);
      setMarketSentiment(sentiment);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeProfile = () => {
    let userProfile = recommendationsService.getPersonalizationProfile();
    if (!userProfile) {
      userProfile = recommendationsService.generateDemoProfile();
      recommendationsService.setPersonalizationProfile(userProfile);
    }
    setProfile(userProfile);
  };

  const getRecommendationIcon = (type: StockRecommendation['recommendationType']) => {
    switch (type) {
      case 'strong_buy': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'buy': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'hold': return <Target className="w-5 h-5 text-blue-500" />;
      case 'sell': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'strong_sell': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRecommendationColor = (type: StockRecommendation['recommendationType']) => {
    switch (type) {
      case 'strong_buy': return 'bg-green-100 text-green-800 border-green-200';
      case 'buy': return 'bg-green-50 text-green-700 border-green-100';
      case 'hold': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'sell': return 'bg-red-50 text-red-700 border-red-100';
      case 'strong_sell': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSentimentColor = (sentiment: MarketSentiment['overall']) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
      case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getFilteredRecommendations = () => {
    let filtered = recommendations;

    if (filterType !== 'all') {
      filtered = filtered.filter(rec => {
        if (filterType === 'buy') return ['buy', 'strong_buy'].includes(rec.recommendationType);
        if (filterType === 'sell') return ['sell', 'strong_sell'].includes(rec.recommendationType);
        return rec.recommendationType === filterType;
      });
    }

    if (confidenceFilter > 0) {
      filtered = filtered.filter(rec => rec.confidenceScore >= confidenceFilter);
    }

    return filtered;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">AI is analyzing market data and generating recommendations...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Recommendations</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Advanced machine learning insights for your investment portfolio
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {profile && (
                  <div className="text-sm text-gray-600 dark:text-gray-300 text-right">
                    <p>Risk Tolerance: <span className="font-medium capitalize">{profile.riskTolerance}</span></p>
                    <p>Portfolio: {formatCurrency(profile.portfolioSize)}</p>
                  </div>
                )}
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            {/* Market Sentiment Banner */}
            {marketSentiment && (
              <div className={`mt-6 p-4 rounded-lg border ${getSentimentColor(marketSentiment.overall)} dark:bg-gray-900 dark:border-gray-700`}> 
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5" />
                    <div>
                      <span className="font-semibold">Market Sentiment: {marketSentiment.overall.toUpperCase()}</span>
                      <span className="ml-2">({marketSentiment.score > 0 ? '+' : ''}{marketSentiment.score.toFixed(1)})</span>
                      <div className="text-sm mt-1">
                        {marketSentiment.keyFactors.slice(0, 2).map((factor, i) => (
                          <span key={i} className="mr-4">• {factor}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Confidence: {marketSentiment.confidence.toFixed(0)}%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Trend: {marketSentiment.trends.shortTerm} (short), {marketSentiment.trends.longTerm} (long)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'recommendations', label: 'Stock Recommendations', icon: Star, count: recommendations.length },
              { id: 'dividends', label: 'Dividend Predictions', icon: DollarSign, count: dividendPredictions.length },
              { id: 'optimization', label: 'Portfolio Optimization', icon: BarChart3, count: optimizations.length },
              { id: 'insights', label: 'AI Insights', icon: Lightbulb, count: insights.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 rounded-t-lg
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-500 dark:text-green-400 dark:border-green-400 bg-gray-100 dark:bg-gray-900'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-400 bg-transparent'}
                `}
                style={{ minWidth: 160 }}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <span>{tab.label}</span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Recommendations</option>
                    <option value="buy">Buy Signals Only</option>
                    <option value="hold">Hold Positions</option>
                    <option value="sell">Sell Signals Only</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Minimum Confidence:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidenceFilter}
                    onChange={(e) => setConfidenceFilter(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-8">{confidenceFilter}%</span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {getFilteredRecommendations().length} of {recommendations.length} recommendations
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredRecommendations().map((rec) => (
                <div
                  key={rec.symbol}
                  className={`bg-white dark:bg-gray-800 border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedRecommendation === rec.symbol
                      ? 'border-green-600 dark:border-green-400 ring-2 ring-green-200 dark:ring-green-900/30'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedRecommendation(
                    selectedRecommendation === rec.symbol ? null : rec.symbol
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getRecommendationIcon(rec.recommendationType)}
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{rec.symbol}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{rec.companyName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{rec.sector}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRecommendationColor(rec.recommendationType)}`}>{rec.recommendationType.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current Price</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(rec.currentPrice)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Target Price</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(rec.targetPrice)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Potential Return</p>
                      <p className={`font-semibold ${rec.potentialReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{rec.potentialReturn >= 0 ? '+' : ''}{formatPercentage(rec.potentialReturn)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Dividend Yield</p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">{formatPercentage(rec.dividendYield)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(rec.riskLevel)}`}>{rec.riskLevel.toUpperCase()} RISK</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(rec.confidenceScore)}`}>{rec.confidenceScore.toFixed(0)}% Confidence</span>
                  </div>
                  {selectedRecommendation === rec.symbol && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Reasoning</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            {rec.reasoning.slice(0, 3).map((reason, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Catalysts</h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                              {rec.catalysts.slice(0, 2).map((catalyst, i) => (
                                <li key={i} className="flex items-start space-x-1">
                                  <span className="text-blue-500 dark:text-blue-400">•</span>
                                  <span>{catalyst}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Risks</h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                              {rec.risks.slice(0, 2).map((risk, i) => (
                                <li key={i} className="flex items-start space-x-1">
                                  <span className="text-red-500 dark:text-red-400">•</span>
                                  <span>{risk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Timeline: {rec.timeHorizon}</span>
                            <span>Score: {rec.score.toFixed(1)}/100</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors" title="Like">
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Dislike">
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="View Details">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" title="Add to Watchlist">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {getFilteredRecommendations().length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Star className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No recommendations match your filters</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your filters to see more AI-powered stock recommendations.</p>
                <button 
                  onClick={() => {
                    setFilterType('all');
                    setConfidenceFilter(0);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dividends' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI-Powered Dividend Growth Predictions</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our machine learning models analyze earnings, cash flow, and historical patterns to predict future dividend payments.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dividendPredictions.map((pred) => (
                  <div key={pred.symbol} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-all bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{pred.symbol}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(pred.confidence)}`}>{pred.confidence.toFixed(0)}% confidence</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Current Quarterly</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(pred.currentDividend)}</p>
                      </div>
                      <div className="text-center bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-300 font-medium">Predicted Annual</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(pred.predictedDividend.nextYear)}</p>
                      </div>
                      <div className="text-center bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                        <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Growth Rate</p>
                        <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{formatPercentage(pred.growthRate.predicted)}</p>
                      </div>
                      <div className="text-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Sustainability</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{pred.sustainability.score.toFixed(0)}/100</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Sustainability Factors</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {pred.sustainability.factors.map((factor, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Payout Ratio:</span>
                            <span className="ml-2 font-medium">{formatPercentage(pred.payoutRatio)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Cash Flow Coverage:</span>
                            <span className="ml-2 font-medium">{pred.cashFlowCoverage.toFixed(1)}x</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Portfolio Optimization Opportunities</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                AI-powered analysis of your portfolio structure with actionable recommendations to improve returns and reduce risk.
              </p>
              <div className="space-y-6">
                {optimizations.map((opt) => (
                  <div key={opt.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-all bg-white dark:bg-gray-900">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{opt.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{opt.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(opt.confidenceScore)}`}>{opt.confidenceScore}% confidence</span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">Priority: {opt.priority}/10</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/10 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">Return Improvement</p>
                        </div>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-200">+{formatPercentage(opt.expectedImpact.returnImprovement)}</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Risk Reduction</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">-{formatPercentage(opt.expectedImpact.riskReduction)}</p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/10 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Income Increase</p>
                        </div>
                        <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">+{formatPercentage(opt.expectedImpact.incomeIncrease)}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-4">Recommended Actions</h5>
                      <div className="space-y-3">
                        {opt.actions.map((action, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                action.action === 'buy' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                                action.action === 'sell' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                                'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                              }`}>
                                {action.action.toUpperCase()}
                              </span>
                              <div>
                                <span className="font-semibold text-gray-900 dark:text-white">{action.symbol}</span>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{action.reasoning}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(action.amount)}</span>
                              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{action.urgency} urgency</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Implementation:</span> {opt.implementation.difficulty} difficulty • {opt.implementation.timeRequired} • Cost: {formatCurrency(opt.implementation.cost)}
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>View Implementation Plan</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI-Generated Market Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Real-time analysis of market trends, portfolio alerts, and educational content powered by advanced AI models.
              </p>
              <div className="space-y-6">
                {insights.map((insight) => (
                  <div key={insight.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-all bg-white dark:bg-gray-900">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          insight.type === 'market_trend' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          insight.type === 'portfolio_alert' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          insight.type === 'opportunity' ? 'bg-green-100 dark:bg-green-900/30' :
                          insight.type === 'risk_warning' ? 'bg-red-100 dark:bg-red-900/30' :
                          'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          {insight.type === 'market_trend' && <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                          {insight.type === 'portfolio_alert' && <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
                          {insight.type === 'opportunity' && <Target className="w-5 h-5 text-green-600 dark:text-green-400" />}
                          {insight.type === 'risk_warning' && <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />}
                          {insight.type === 'educational' && <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{insight.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{insight.summary}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>{insight.confidence}% confidence</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          insight.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                          insight.impact === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                        }`}>
                          {insight.impact} impact
                        </span>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-200 mb-4">
                      <p>{insight.content}</p>
                    </div>
                    {insight.relatedSymbols.length > 0 && (
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Related stocks:</span>
                        {insight.relatedSymbols.slice(0, 6).map((symbol) => (
                          <span key={symbol} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded text-sm font-medium">
                            {symbol}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{insight.createdAt.toLocaleDateString()}</span>
                        </div>
                        {insight.actionable && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                            Actionable
                          </span>
                        )}
                        <div className="flex items-center space-x-1">
                          {insight.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Share insight">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" title="Save for later">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 