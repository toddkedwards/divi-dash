import React, { useState, useEffect, useMemo } from 'react';
import { newsService, NewsArticle, SentimentScore, MarketSentiment } from '../utils/newsService';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ExternalLink, 
  Filter, 
  RefreshCw,
  Newspaper,
  AlertCircle,
  BarChart3,
  Calendar,
  Target,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  Brain,
  Activity,
  Zap,
  MessageCircle,
  Award,
  TrendingUp as TrendIcon,
  DollarSign
} from 'lucide-react';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

interface NewsSectionProps {
  selectedSymbols?: string[];
  showDividendOnly?: boolean;
  className?: string;
  enhancedMode?: boolean; // New prop for Phase 2 features
}

const SENTIMENT_COLORS = {
  positive: 'text-green-600 bg-green-50 border-green-200',
  negative: 'text-red-600 bg-red-50 border-red-200',
  neutral: 'text-gray-600 bg-gray-50 border-gray-200'
};

const SENTIMENT_ICONS = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: BarChart3
};

const CATEGORY_COLORS = {
  dividends: 'bg-blue-100 text-blue-800',
  earnings: 'bg-green-100 text-green-800',
  acquisitions: 'bg-purple-100 text-purple-800',
  partnerships: 'bg-yellow-100 text-yellow-800',
  leadership: 'bg-orange-100 text-orange-800',
  products: 'bg-indigo-100 text-indigo-800',
  regulatory: 'bg-red-100 text-red-800',
  market: 'bg-gray-100 text-gray-800',
  general: 'bg-gray-100 text-gray-800'
};

const RISK_COLORS = {
  low: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  critical: 'text-red-600 bg-red-50 border-red-200'
};

const IMPACT_COLORS = {
  bullish: 'text-green-600',
  bearish: 'text-red-600',
  neutral: 'text-gray-600'
};

export default function NewsSection({ 
  selectedSymbols = [], 
  showDividendOnly = false,
  className = "",
  enhancedMode = false
}: NewsSectionProps) {
  const { holdings } = usePortfolio();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    category: string;
    sentiment: string;
    timeRange: string;
    riskLevel?: string;
    impactLevel?: string;
  }>({
    category: 'all',
    sentiment: 'all',
    timeRange: '24h',
    riskLevel: 'all',
    impactLevel: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDividendAlerts, setShowDividendAlerts] = useState(false);
  const [dividendAlerts, setDividendAlerts] = useState<NewsArticle[]>([]);

  // Get symbols from holdings if not provided
  const symbols = useMemo(() => {
    if (selectedSymbols.length > 0) return selectedSymbols;
    return holdings.map(h => h.symbol).slice(0, 10); // Limit to avoid API rate limits
  }, [selectedSymbols, holdings]);

  const loadNews = async () => {
    try {
      setError(null);
      
      if (enhancedMode) {
        // Load enhanced news with Phase 2 features
        const [newsData, sentimentData, alertsData] = await Promise.all([
          showDividendOnly 
            ? newsService.getDividendNews(symbols, 20)
            : Promise.all(symbols.map(symbol => newsService.getEnhancedNews(symbol, 3))).then(results => results.flat()),
          newsService.getMarketSentiment(symbols),
          newsService.getDividendSafetyAlerts(symbols)
        ]);

        setNews(newsData);
        setMarketSentiment(sentimentData);
        setDividendAlerts(alertsData);
      } else {
        // Standard loading
        const [newsData, sentimentData] = await Promise.all([
          showDividendOnly 
            ? newsService.getDividendNews(symbols, 20)
            : Promise.all(symbols.map(symbol => newsService.getNews(symbol, 3))).then(results => results.flat()),
          newsService.getMarketSentiment(symbols)
        ]);

        setNews(newsData);
        setMarketSentiment(sentimentData);
      }
    } catch (err) {
      console.error('Error loading news:', err);
      setError('Failed to load news. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNews();
  };

  useEffect(() => {
    if (symbols.length > 0) {
      loadNews();
    } else {
      setLoading(false);
    }
  }, [symbols, showDividendOnly, enhancedMode]);

  // Enhanced filter functionality for Phase 2
  const filteredNews = useMemo(() => {
    let filtered = [...news];

    // Category filter
    if (filter.category !== 'all') {
      filtered = filtered.filter(article => 
        article.category?.primary === filter.category
      );
    }

    // Sentiment filter
    if (filter.sentiment !== 'all') {
      filtered = filtered.filter(article => 
        article.sentiment?.label === filter.sentiment
      );
    }

    // Risk level filter (Phase 2)
    if (enhancedMode && filter.riskLevel !== 'all') {
      filtered = filtered.filter(article => 
        article.dividendSafetyAlert?.riskLevel === filter.riskLevel
      );
    }

    // Impact level filter (Phase 2)
    if (enhancedMode && filter.impactLevel !== 'all') {
      filtered = filtered.filter(article => {
        const impactScore = article.impactScore || 0;
        switch (filter.impactLevel) {
          case 'high': return impactScore > 0.7;
          case 'medium': return impactScore > 0.4 && impactScore <= 0.7;
          case 'low': return impactScore <= 0.4;
          default: return true;
        }
      });
    }

    // Time range filter
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    if (filter.timeRange !== 'all') {
      const range = timeRanges[filter.timeRange as keyof typeof timeRanges];
      if (range) {
        filtered = filtered.filter(article => 
          now - article.datetime < range
        );
      }
    }

    return enhancedMode 
      ? filtered.sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0))
      : filtered.sort((a, b) => b.datetime - a.datetime);
  }, [news, filter, enhancedMode]);

  const getSentimentIcon = (sentiment: SentimentScore) => {
    const Icon = SENTIMENT_ICONS[sentiment.label];
    return <Icon className="w-4 h-4" />;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const renderEnhancedSentiment = (article: NewsArticle) => {
    if (!enhancedMode || !article.sentiment) return null;

    return (
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            AI Sentiment Analysis
          </span>
          <Brain className="w-4 h-4 text-green-600" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
            <span className="ml-2 font-medium">
              {((article.sentiment.aiConfidence || 0) * 100).toFixed(0)}%
            </span>
          </div>
          
          {article.sentiment.emotionScore && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Fear/Greed:</span>
              <span className="ml-2 font-medium">
                {(article.sentiment.emotionScore.fear * 100).toFixed(0)}/
                {(article.sentiment.emotionScore.greed * 100).toFixed(0)}
              </span>
            </div>
          )}
        </div>

        {article.sentiment.keyPhrases && article.sentiment.keyPhrases.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Key phrases:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {article.sentiment.keyPhrases.slice(0, 3).map((phrase, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDividendSafetyAlert = (article: NewsArticle) => {
    if (!enhancedMode || !article.dividendSafetyAlert) return null;

    const alert = article.dividendSafetyAlert;
    const colorClass = RISK_COLORS[alert.riskLevel];

    return (
      <div className={`mt-3 p-3 border rounded-lg ${colorClass}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <span className="font-medium text-sm">Dividend Safety Alert</span>
          </div>
          <span className="text-xs font-medium uppercase">
            {alert.riskLevel}
          </span>
        </div>
        
        <p className="text-sm mb-2">{alert.reasoning}</p>
        
        <div className="flex justify-between text-xs">
          <span>Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
          {alert.timeFrame && (
            <span>Timeline: {alert.timeFrame}</span>
          )}
        </div>
      </div>
    );
  };

  const renderMarketImpact = (article: NewsArticle) => {
    if (!enhancedMode || !article.marketImpact) return null;

    const impact = article.marketImpact;
    const impactColor = IMPACT_COLORS[impact.priceImpact];

    return (
      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium text-sm">Market Impact</span>
          </div>
          <span className={`text-xs font-medium ${impactColor}`}>
            {impact.priceImpact}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Volatility:</span>
            <span className="ml-2 font-medium">
              {(impact.expectedVolatility * 100).toFixed(0)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Horizon:</span>
            <span className="ml-2 font-medium">{impact.timeHorizon}</span>
          </div>
        </div>

        {impact.sectorImpact.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Affected sectors:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {impact.sectorImpact.map((sector, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {sector}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSocialSentiment = (article: NewsArticle) => {
    if (!enhancedMode || !article.socialSentiment) return null;

    const social = article.socialSentiment;

    return (
      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
            <span className="font-medium text-sm">Social Sentiment</span>
          </div>
          <div className="flex items-center">
            <TrendIcon className="w-3 h-3 mr-1 text-green-500" />
            <span className="text-xs font-medium">{social.trendingScore}/100</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          {social.platforms.reddit && (
            <div className="text-center p-2 bg-orange-100 rounded">
              <div className="font-medium">Reddit</div>
              <div>{social.platforms.reddit.mentions}</div>
            </div>
          )}
          {social.platforms.twitter && (
            <div className="text-center p-2 bg-blue-100 rounded">
              <div className="font-medium">Twitter</div>
              <div>{social.platforms.twitter.mentions}</div>
            </div>
          )}
          {social.platforms.stocktwits && (
            <div className="text-center p-2 bg-green-100 rounded">
              <div className="font-medium">StockTwits</div>
              <div>{social.platforms.stocktwits.mentions}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64 text-red-500">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Enhanced Market Sentiment Overview for Phase 2 */}
      {marketSentiment && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {enhancedMode ? 'Advanced Market Intelligence' : 'Market Sentiment'}
            </h3>
            {enhancedMode && (
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-green-600" />
                <span className="text-sm text-purple-600 font-medium">AI-Powered</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {getSentimentIcon(marketSentiment.overall)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall</p>
              <p className="font-semibold">
                {(marketSentiment.overall.score * 100).toFixed(0)}%
              </p>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dividend</p>
              <p className="font-semibold">
                {(marketSentiment.dividendSentiment.score * 100).toFixed(0)}%
              </p>
            </div>

            {enhancedMode && marketSentiment.marketFear !== undefined && (
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fear Index</p>
                <p className="font-semibold">{marketSentiment.marketFear}/100</p>
              </div>
            )}

            {enhancedMode && marketSentiment.newsFlow && (
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">News Flow</p>
                <p className="font-semibold">{marketSentiment.newsFlow.volume}</p>
              </div>
            )}
          </div>

          {marketSentiment.trendingTopics.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Trending Topics:</p>
              <div className="flex flex-wrap gap-2">
                {marketSentiment.trendingTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Dividend Safety Alerts Dashboard for Phase 2 */}
      {enhancedMode && dividendAlerts.length > 0 && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Dividend Safety Alerts
            </h3>
            <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
              {dividendAlerts.length} active
            </span>
          </div>

          <div className="space-y-3">
            {dividendAlerts.slice(0, 3).map((alert, index) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <Shield className={`w-4 h-4 mr-3 ${
                    alert.dividendSafetyAlert?.riskLevel === 'critical' ? 'text-red-500' :
                    alert.dividendSafetyAlert?.riskLevel === 'high' ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{alert.symbol}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {alert.dividendSafetyAlert?.reasoning}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  RISK_COLORS[alert.dividendSafetyAlert?.riskLevel || 'low']
                }`}>
                  {alert.dividendSafetyAlert?.riskLevel}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Enhanced Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            {enhancedMode ? 'Intelligence Filters' : 'News Filters'}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Eye className={`w-4 h-4 mr-1 ${showFilters ? 'hidden' : 'block'}`} />
              <EyeOff className={`w-4 h-4 mr-1 ${showFilters ? 'block' : 'hidden'}`} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={filter.category}
                  onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="all">All Categories</option>
                  <option value="dividends">Dividends</option>
                  <option value="earnings">Earnings</option>
                  <option value="acquisitions">Acquisitions</option>
                  <option value="market">Market</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sentiment</label>
                <select
                  value={filter.sentiment}
                  onChange={(e) => setFilter(prev => ({ ...prev, sentiment: e.target.value }))}
                  className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="all">All Sentiment</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              {enhancedMode && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Risk Level</label>
                    <select
                      value={filter.riskLevel}
                      onChange={(e) => setFilter(prev => ({ ...prev, riskLevel: e.target.value }))}
                      className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="all">All Risk</option>
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                      <option value="critical">Critical Risk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Impact Level</label>
                    <select
                      value={filter.impactLevel}
                      onChange={(e) => setFilter(prev => ({ ...prev, impactLevel: e.target.value }))}
                      className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="all">All Impact</option>
                      <option value="high">High Impact</option>
                      <option value="medium">Medium Impact</option>
                      <option value="low">Low Impact</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Time Range</label>
                <select
                  value={filter.timeRange}
                  onChange={(e) => setFilter(prev => ({ ...prev, timeRange: e.target.value }))}
                  className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Enhanced News Articles */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {enhancedMode ? 'Intelligence Feed' : 'News Articles'}
          </h3>
          <span className="text-sm text-gray-500">
            {filteredNews.length} articles
          </span>
        </div>

        <div className="space-y-4">
          {filteredNews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No news articles found matching your criteria.</p>
            </div>
          ) : (
            filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                        {article.headline}
                      </h4>
                      {enhancedMode && article.impactScore && (
                        <div className="flex items-center">
                          <Award className="w-3 h-3 mr-1 text-yellow-500" />
                          <span className="text-xs text-yellow-600 font-medium">
                            {(article.impactScore * 100).toFixed(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {article.summary && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(article.datetime)}
                        </span>
                        <span>{article.source}</span>
                        {article.symbol && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {article.symbol}
                          </span>
                        )}
                      </div>
                      
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Read More
                      </a>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {article.sentiment && (
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs border ${
                          SENTIMENT_COLORS[article.sentiment.label]
                        }`}>
                          {getSentimentIcon(article.sentiment)}
                          <span className="ml-1">{article.sentiment.label}</span>
                          <span className="ml-1">({(article.sentiment.confidence * 100).toFixed(0)}%)</span>
                        </span>
                      )}

                      {article.category && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          CATEGORY_COLORS[article.category.primary as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.general
                        }`}>
                          {article.category.primary}
                        </span>
                      )}

                      {article.isDividendRelated && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                          Dividend
                        </span>
                      )}
                    </div>

                    {/* Phase 2 Enhanced Features */}
                    {enhancedMode && (
                      <>
                        {renderEnhancedSentiment(article)}
                        {renderDividendSafetyAlert(article)}
                        {renderMarketImpact(article)}
                        {renderSocialSentiment(article)}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
} 