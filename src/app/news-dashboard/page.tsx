"use client";

import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import NewsSection from '../../components/NewsSection';
import Card from '../../components/Card';
import { 
  Newspaper, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  AlertTriangle,
  Clock,
  Filter,
  Bell,
  Settings,
  Brain,
  Shield,
  Activity,
  Zap,
  Search
} from 'lucide-react';

export default function NewsDashboardPage() {
  const { holdings } = usePortfolio();
  const [showDividendOnly, setShowDividendOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              News Intelligence
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Stay informed with market news and dividend updates
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowDividendOnly(!showDividendOnly)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                showDividendOnly 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Dividend News Only
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for stocks, keywords, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {holdings.length} holdings tracked
              </span>
            </div>
          </div>
        </Card>

        {/* Portfolio Summary */}
        {holdings.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Portfolio Holdings
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {holdings.slice(0, 6).map((holding) => (
                <div key={holding.symbol} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-white">{holding.symbol}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {holding.shares} shares
                  </div>
                  <div className="text-xs text-green-600">
                    {holding.dividendYield.toFixed(1)}% yield
                  </div>
                </div>
              ))}
              {holdings.length > 6 && (
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    +{holdings.length - 6} more
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* News Feed */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {showDividendOnly ? 'Dividend News' : 'Market News'}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Updated in real-time</span>
            </div>
          </div>
          
          {holdings.length > 0 ? (
            <NewsSection 
              showDividendOnly={showDividendOnly}
              selectedSymbols={holdings.map(h => h.symbol)}
              className="w-full"
              enhancedMode={false}
            />
          ) : (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                No Holdings Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add some stocks to your portfolio to see personalized news.
              </p>
              <a
                href="/positions"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Holdings
              </a>
            </div>
          )}
        </Card>

        {/* Quick Tips */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 Quick Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                Dividend News
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                Toggle "Dividend News Only" to focus on dividend-related updates
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="font-medium text-green-700 dark:text-green-300 mb-1">
                Portfolio Tracking
              </div>
              <div className="text-green-600 dark:text-green-400">
                News is automatically filtered based on your portfolio holdings
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="font-medium text-purple-700 dark:text-purple-300 mb-1">
                Search & Filter
              </div>
              <div className="text-purple-600 dark:text-purple-400">
                Use the search bar to find specific stocks or topics
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 