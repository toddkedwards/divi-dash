'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Shield, 
  Target, 
  Award,
  AlertTriangle,
  ChevronRight,
  Star,
  Crown,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Percent,
  Calendar,
  Clock,
  Filter,
  RefreshCw,
  Eye,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Download,
  Settings,
  Info
} from 'lucide-react';
import RecommendationsService, {
  StockRecommendation,
  DividendPrediction,
  PortfolioOptimization,
  MarketSentiment,
  AIInsight,
  PersonalizationProfile
} from '../utils/recommendationsService';

interface AIRecommendationsProps {
  portfolioSymbols?: string[];
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  investmentGoals?: string[];
  className?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  portfolioSymbols = ['AAPL', 'MSFT', 'GOOGL'],
  riskTolerance = 'moderate',
  investmentGoals = ['dividend_income', 'long_term_growth'],
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([]);
  const [aristocrats, setAristocrats] = useState<DividendAristocrat[]>([]);
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<PortfolioAnalysis | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState<StockRecommendation | null>(null);
  const [aristocratFilter, setAristocratFilter] = useState<'all' | 'kings' | 'aristocrats'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [dividendPredictions, setDividendPredictions] = useState<DividendPrediction[]>([]);
  const [optimizations, setOptimizations] = useState<PortfolioOptimization[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState(0);

  const [recommendationsService] = useState(() => RecommendationsService.getInstance());

  useEffect(() => {
    loadData();
    initializeProfile();
  }, [portfolioSymbols, riskTolerance]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recsData, aristocratsData, divsData, optsData, insightsData, sentiment] = await Promise.all([
        recommendationsService.getPersonalizedRecommendations(
          portfolioSymbols,
          riskTolerance,
          investmentGoals,
          12
        ),
        recommendationsService.getDividendAristocrats(aristocratFilter),
        recommendationsService.generateDividendPredictions(portfolioSymbols.map(s => s)),
        recommendationsService.generatePortfolioOptimizations(portfolioSymbols.map(s => ({ symbol: s }) as any)),
        recommendationsService.generateAIInsights(portfolioSymbols.map(s => ({ symbol: s }) as any)),
        recommendationsService.getMarketSentiment()
      ]);

      setRecommendations(recsData);
      setAristocrats(aristocratsData);
      setDividendPredictions(divsData);
      setOptimizations(optsData);
      setAIInsights(insightsData);
      setMarketSentiment(sentiment);
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
    } finally {
      setLoading(false);
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

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const tabs = [
    { id: 'recommendations', label: 'AI Recommendations', icon: Brain },
    { id: 'aristocrats', label: 'Dividend Elite', icon: Crown },
    { id: 'insights', label: 'Market Intelligence', icon: Lightbulb },
    { id: 'portfolio', label: 'Portfolio Analysis', icon: PieChart }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500 bg-green-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'high': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'buy': return 'text-green-600 bg-green-100';
      case 'hold': return 'text-blue-600 bg-blue-100';
      case 'sell': return 'text-red-600 bg-red-100';
      case 'watch': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dividend_growth': return 'text-blue-600 bg-blue-100';
      case 'high_yield': return 'text-green-600 bg-green-100';
      case 'value': return 'text-orange-600 bg-orange-100';
      case 'quality': return 'text-purple-600 bg-purple-100';
      case 'defensive': return 'text-gray-600 bg-gray-100';
      default: return 'text-indigo-600 bg-indigo-100';
    }
  };

  const RecommendationCard: React.FC<{ rec: StockRecommendation }> = ({ rec }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedRecommendation(rec)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{rec.symbol}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(rec.recommendationType)}`}>
              {rec.recommendationType.toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(rec.category.primary)}`}>
              {rec.category.primary.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{rec.companyName}</p>
          <p className="text-xs text-gray-500">{rec.category.sector} • {rec.category.industry}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-green-600" />
            <span className="text-lg font-bold text-purple-600">{rec.aiScore}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>{Math.round(rec.confidence * 100)}% confidence</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-gray-600">Current Price</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">${rec.currentPrice.toFixed(2)}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-600">Dividend Yield</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">{rec.dividendMetrics.currentYield.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(rec.riskLevel)}`}>
            {rec.riskLevel.toUpperCase()} RISK
          </span>
          <span className="text-xs text-gray-500">{rec.timeHorizon} term</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {rec.upside && (
            <span className="text-green-600 font-medium flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              +{rec.upside}%
            </span>
          )}
          {rec.downside && (
            <span className="text-red-600 font-medium flex items-center gap-1">
              <ArrowDown className="h-3 w-3" />
              {rec.downside}%
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Reasons:</h4>
        <ul className="space-y-1">
          {rec.reasoning.slice(0, 2).map((reason, index) => (
            <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {rec.dividendMetrics.aristocratStatus !== 'none' && (
            <div className="flex items-center gap-1">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-600">
                {rec.dividendMetrics.aristocratStatus}
              </span>
            </div>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </motion.div>
  );

  const AristocratCard: React.FC<{ aristocrat: DividendAristocrat }> = ({ aristocrat }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{aristocrat.symbol}</h3>
            <div className="flex items-center gap-1">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                aristocrat.status === 'king' 
                  ? 'text-yellow-600 bg-yellow-100' 
                  : 'text-blue-600 bg-blue-100'
              }`}>
                {aristocrat.status.toUpperCase()}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(aristocrat.riskRating)}`}>
              {aristocrat.riskRating.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{aristocrat.companyName}</p>
          <p className="text-xs text-gray-500">{aristocrat.sector}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-green-600" />
            <span className="text-lg font-bold text-purple-600">{aristocrat.qualityRating}</span>
          </div>
          <span className="text-xs text-gray-500">Quality Score</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-blue-600">{aristocrat.yearsOfGrowth}</div>
          <div className="text-xs text-blue-600 font-medium">Years Growth</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-green-600">{aristocrat.currentYield.toFixed(1)}%</div>
          <div className="text-xs text-green-600 font-medium">Current Yield</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-purple-600">{aristocrat.avgGrowthRate.toFixed(1)}%</div>
          <div className="text-xs text-purple-600 font-medium">Avg Growth</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Market Cap:</span>
          <span className="font-semibold text-gray-900">
            ${(aristocrat.marketCap / 1000000000).toFixed(0)}B
          </span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-gray-600">Last Increase:</span>
          <span className="font-semibold text-gray-900">
            {new Date(aristocrat.lastIncrease).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const RecommendationModal: React.FC = () => {
    if (!selectedRecommendation) return null;

    const rec = selectedRecommendation;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setSelectedRecommendation(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{rec.symbol}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(rec.recommendationType)}`}>
                    {rec.recommendationType.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(rec.category.primary)}`}>
                    {rec.category.primary.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg text-gray-600 mb-1">{rec.companyName}</h3>
                <p className="text-gray-500">{rec.category.sector} • {rec.category.industry}</p>
              </div>
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">AI Analysis</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{rec.aiScore}</div>
                      <div className="text-sm text-purple-600">AI Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{Math.round(rec.confidence * 100)}%</div>
                      <div className="text-sm text-purple-600">Confidence</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Price & Performance</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">${rec.currentPrice.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Current Price</div>
                    </div>
                    {rec.targetPrice && (
                      <div>
                        <div className="text-lg font-semibold text-gray-900">${rec.targetPrice.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Target Price</div>
                      </div>
                    )}
                    {rec.upside && (
                      <div>
                        <div className="text-lg font-semibold text-green-600">+{rec.upside}%</div>
                        <div className="text-sm text-gray-600">Upside Potential</div>
                      </div>
                    )}
                    {rec.downside && (
                      <div>
                        <div className="text-lg font-semibold text-red-600">{rec.downside}%</div>
                        <div className="text-sm text-gray-600">Downside Risk</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Dividend Metrics</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-lg font-semibold text-green-600">{rec.dividendMetrics.currentYield.toFixed(1)}%</div>
                      <div className="text-sm text-green-600">Current Yield</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">{rec.dividendMetrics.dividendGrowthRate.toFixed(1)}%</div>
                      <div className="text-sm text-green-600">Growth Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">{rec.dividendMetrics.yearsOfGrowth}</div>
                      <div className="text-sm text-green-600">Years Growth</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">{rec.dividendMetrics.payoutRatio.toFixed(0)}%</div>
                      <div className="text-sm text-green-600">Payout Ratio</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Risk Assessment</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-lg font-semibold text-blue-600">{rec.riskMetrics.beta.toFixed(2)}</div>
                      <div className="text-sm text-blue-600">Beta</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-blue-600">{rec.riskMetrics.sharpeRatio.toFixed(2)}</div>
                      <div className="text-sm text-blue-600">Sharpe Ratio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Investment Reasoning</h4>
              <div className="space-y-2">
                {rec.reasoning.map((reason, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 rounded-xl p-4">
                <h5 className="font-semibold text-yellow-900 mb-2">Quality Score</h5>
                <div className="text-2xl font-bold text-yellow-600">{rec.qualityScore.overall.toFixed(0)}/100</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <h5 className="font-semibold text-indigo-900 mb-2">Risk Level</h5>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(rec.riskLevel)}`}>
                  {rec.riskLevel.toUpperCase()}
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h5 className="font-semibold text-purple-900 mb-2">Time Horizon</h5>
                <div className="text-lg font-semibold text-purple-600 capitalize">{rec.timeHorizon} Term</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`bg-gray-50 rounded-2xl ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-600" />
              AI-Powered Investment Intelligence
            </h2>
            <p className="text-gray-600 mt-2">
              Personalized recommendations powered by advanced AI analysis
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-16 bg-gray-200 rounded"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <RecommendationCard key={rec.id} rec={rec} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'aristocrats' && (
            <motion.div
              key="aristocrats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Dividend Elite Companies</h3>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={aristocratFilter}
                    onChange={(e) => setAristocratFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All Elite</option>
                    <option value="kings">Dividend Kings (50+ years)</option>
                    <option value="aristocrats">Dividend Aristocrats (25+ years)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aristocrats.map((aristocrat) => (
                  <AristocratCard key={aristocrat.symbol} aristocrat={aristocrat} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900">Market Intelligence Dashboard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="h-6 w-6 text-blue-500" />
                    <h4 className="text-lg font-semibold text-gray-900">Market Sentiment</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">Bullish</div>
                    <div className="text-sm text-gray-600">AI-powered sentiment analysis</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                    <h4 className="text-lg font-semibold text-gray-900">Top Sector</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">Technology</div>
                    <div className="text-sm text-gray-600">Strongest performance trend</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                    <h4 className="text-lg font-semibold text-gray-900">Risk Alerts</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">2</div>
                    <div className="text-sm text-gray-600">Active risk signals</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Market Predictions</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-gray-900">3-Month Outlook</h5>
                    <p className="text-gray-600 text-sm">
                      Dividend-focused strategies will outperform growth due to rate environment
                    </p>
                    <div className="text-xs text-blue-600 mt-1">72% confidence</div>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-gray-900">6-Month Outlook</h5>
                    <p className="text-gray-600 text-sm">
                      Healthcare sector will see renewed interest due to demographic trends
                    </p>
                    <div className="text-xs text-green-600 mt-1">68% confidence</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900">Portfolio Analysis & Optimization</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Sector Allocation</h4>
                  <div className="space-y-3">
                    {[
                      { sector: 'Technology', current: 35, target: 25, color: 'blue' },
                      { sector: 'Healthcare', current: 15, target: 20, color: 'green' },
                      { sector: 'Financials', current: 20, target: 20, color: 'purple' },
                      { sector: 'Consumer Staples', current: 10, target: 15, color: 'orange' }
                    ].map((item) => (
                      <div key={item.sector} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{item.sector}</span>
                          <span className="text-sm text-gray-600">{item.current}% / {item.target}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-${item.color}-500`}
                            style={{ width: `${item.current}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Optimization Recommendations</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700">High Priority</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Add healthcare exposure to reduce tech concentration
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Impact: Reduced portfolio volatility
                      </p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-700">Medium Priority</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Increase utility allocation for defensive positioning
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Impact: Enhanced dividend stability
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Moderate</div>
                  <div className="text-sm text-gray-600">Risk Profile</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">70%</div>
                  <div className="text-sm text-gray-600">Dividend Focus</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">80%</div>
                  <div className="text-sm text-gray-600">Quality Focus</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedRecommendation && <RecommendationModal />}
      </AnimatePresence>
    </div>
  );
};

export default AIRecommendations;