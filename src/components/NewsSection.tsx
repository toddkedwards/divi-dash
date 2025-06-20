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
  EyeOff
} from 'lucide-react';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

interface NewsSectionProps {
  selectedSymbols?: string[];
  showDividendOnly?: boolean;
  className?: string;
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

export default function NewsSection({ 
  selectedSymbols = [], 
  showDividendOnly = false,
  className = ""
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
  }>({
    category: 'all',
    sentiment: 'all',
    timeRange: '24h'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Get symbols from holdings if not provided
  const symbols = useMemo(() => {
    if (selectedSymbols.length > 0) return selectedSymbols;
    return holdings.map(h => h.symbol).slice(0, 10); // Limit to avoid API rate limits
  }, [selectedSymbols, holdings]);

  const loadNews = async () => {
    try {
      setError(null);
      
      const [newsData, sentimentData] = await Promise.all([
        showDividendOnly 
          ? newsService.getDividendNews(symbols, 20)
          : Promise.all(symbols.map(symbol => newsService.getNews(symbol, 3))).then(results => results.flat()),
        newsService.getMarketSentiment(symbols)
      ]);

      setNews(newsData);
      setMarketSentiment(sentimentData);
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
  }, [symbols, showDividendOnly]);

  // Filter news based on current filters
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

    return filtered.sort((a, b) => b.datetime - a.datetime);
  }, [news, filter]);

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
      {/* Market Sentiment Overview */}
      {marketSentiment && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Market Sentiment
            </h3>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Sentiment */}
            <div className={`p-4 rounded-lg border ${SENTIMENT_COLORS[marketSentiment.overall.label]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Market</span>
                {getSentimentIcon(marketSentiment.overall)}
              </div>
              <div className="text-2xl font-bold">
                {(marketSentiment.overall.score * 100).toFixed(0)}%
              </div>
              <div className="text-xs opacity-75">
                Confidence: {(marketSentiment.overall.confidence * 100).toFixed(0)}%
              </div>
            </div>

            {/* Dividend Sentiment */}
            <div className={`p-4 rounded-lg border ${SENTIMENT_COLORS[marketSentiment.dividendSentiment.label]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Dividend Focus</span>
                {getSentimentIcon(marketSentiment.dividendSentiment)}
              </div>
              <div className="text-2xl font-bold">
                {(marketSentiment.dividendSentiment.score * 100).toFixed(0)}%
              </div>
              <div className="text-xs opacity-75">
                Confidence: {(marketSentiment.dividendSentiment.confidence * 100).toFixed(0)}%
              </div>
            </div>

            {/* Trending Topics */}
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center mb-2">
                <Target className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Trending Topics</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {marketSentiment.trendingTopics.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-xs ${CATEGORY_COLORS[topic as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.general}`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* News Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Newspaper className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {showDividendOnly ? 'Dividend News' : 'Market News'}
            </h3>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {filteredNews.length}
            </span>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters ? <EyeOff className="w-4 h-4 ml-2" /> : <Eye className="w-4 h-4 ml-2" />}
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filter.category}
                    onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="all">All Categories</option>
                    <option value="dividends">Dividends</option>
                    <option value="earnings">Earnings</option>
                    <option value="acquisitions">Acquisitions</option>
                    <option value="leadership">Leadership</option>
                    <option value="market">Market</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Sentiment</label>
                  <select
                    value={filter.sentiment}
                    onChange={(e) => setFilter(prev => ({ ...prev, sentiment: e.target.value }))}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="all">All Sentiment</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time Range</label>
                  <select
                    value={filter.timeRange}
                    onChange={(e) => setFilter(prev => ({ ...prev, timeRange: e.target.value }))}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="all">All Time</option>
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* News Articles */}
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
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                      {article.headline}
                    </h4>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {/* Source */}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {article.source}
                      </span>
                      
                      {/* Time */}
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(article.datetime)}
                      </span>
                      
                      {/* Symbol */}
                      {article.symbol && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {article.symbol}
                        </span>
                      )}
                      
                      {/* Category */}
                      {article.category && (
                        <span className={`px-2 py-1 text-xs rounded ${
                          CATEGORY_COLORS[article.category.primary as keyof typeof CATEGORY_COLORS] || 
                          CATEGORY_COLORS.general
                        }`}>
                          {article.category.primary}
                        </span>
                      )}
                      
                      {/* Dividend badge */}
                      {article.isDividendRelated && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Dividend
                        </span>
                      )}
                    </div>
                    
                    {/* Summary */}
                    {article.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                        {article.summary}
                      </p>
                    )}
                  </div>
                  
                  {/* Sentiment Indicator */}
                  {article.sentiment && (
                    <div className={`ml-4 p-2 rounded-lg border ${SENTIMENT_COLORS[article.sentiment.label]}`}>
                      <div className="flex items-center">
                        {getSentimentIcon(article.sentiment)}
                        <span className="ml-1 text-xs font-medium">
                          {(article.sentiment.score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-xs mt-1 opacity-75">
                        {article.sentiment.confidence > 0.7 ? 'High' : 
                         article.sentiment.confidence > 0.4 ? 'Med' : 'Low'} conf.
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Relevance Score */}
                    {article.relevanceScore && article.relevanceScore > 0.7 && (
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        High Relevance
                      </span>
                    )}
                    
                    {/* Sentiment Reasoning */}
                    {article.sentiment?.reasoning && (
                      <span className="text-xs text-gray-500">
                        {article.sentiment.reasoning}
                      </span>
                    )}
                  </div>
                  
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Read More
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
} 