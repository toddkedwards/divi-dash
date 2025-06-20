'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3, Info, Plus, Star } from 'lucide-react';
import StockScreener from '@/components/StockScreener';
import { ScreenerResult, DIVIDEND_ARISTOCRATS, DIVIDEND_KINGS } from '@/utils/stockScreener';
import { formatCurrency, formatPercent } from '@/utils/formatters';

const StockScreenerPage = () => {
  const [selectedStock, setSelectedStock] = useState<ScreenerResult | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist(prev => [...prev, symbol]);
      // In a real app, this would sync with the backend
      localStorage.setItem('screener-watchlist', JSON.stringify([...watchlist, symbol]));
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
    localStorage.setItem('screener-watchlist', JSON.stringify(watchlist.filter(s => s !== symbol)));
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('screener-watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Advanced Stock Screener
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Discover dividend stocks with our AI-powered screening tools
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Dividend Aristocrats
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {DIVIDEND_ARISTOCRATS.length}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Dividend Kings
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {DIVIDEND_KINGS.length}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Screener Watchlist
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {watchlist.length}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Premium Features
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                7
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Screener */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <StockScreener onStockSelect={setSelectedStock} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Stock Details */}
            {selectedStock && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {selectedStock.symbol}
                                             {selectedStock.isDividendAristocrat && (
                         <Award className="h-4 w-4 text-yellow-500" />
                       )}
                       {selectedStock.isDividendKing && (
                         <Award className="h-4 w-4 text-purple-500" />
                       )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {selectedStock.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (watchlist.includes(selectedStock.symbol)) {
                        removeFromWatchlist(selectedStock.symbol);
                      } else {
                        addToWatchlist(selectedStock.symbol);
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      watchlist.includes(selectedStock.symbol)
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${watchlist.includes(selectedStock.symbol) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Price & Market Cap */}
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(selectedStock.price)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                       Market Cap: ${(selectedStock.marketCap / 1000000000).toFixed(1)}B
                    </div>
                  </div>

                  {/* Dividend Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Dividend Yield</div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatPercent(selectedStock.dividendYield)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Growth Rate</div>
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {formatPercent(selectedStock.dividendGrowth)}
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">P/E Ratio</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedStock.pe > 0 ? selectedStock.pe.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">ROE</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPercent(selectedStock.roe)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Payout Ratio</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPercent(selectedStock.payoutRatio)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Years of Growth</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedStock.yearsOfGrowth}
                      </span>
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Overall Score</span>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {selectedStock.overallScore.toFixed(0)}/100
                        </div>
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedStock.recommendation === 'Strong Buy' ? 'text-green-600 bg-green-50' :
                          selectedStock.recommendation === 'Buy' ? 'text-green-500 bg-green-50' :
                          selectedStock.recommendation === 'Hold' ? 'text-yellow-600 bg-yellow-50' :
                          selectedStock.recommendation === 'Sell' ? 'text-red-500 bg-red-50' :
                          'text-red-600 bg-red-50'
                        }`}>
                          {selectedStock.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Dividend Aristocrats Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Dividend Aristocrats
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                S&P 500 companies with 25+ years of consecutive dividend increases
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {DIVIDEND_ARISTOCRATS.slice(0, 10).map(symbol => (
                  <div
                    key={symbol}
                    className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{symbol}</span>
                    <button
                      onClick={() => addToWatchlist(symbol)}
                      disabled={watchlist.includes(symbol)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Showing 10 of {DIVIDEND_ARISTOCRATS.length} aristocrats
              </div>
            </div>

            {/* Screening Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Screening Tips
                </h3>
              </div>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>• Start with preset screens for proven strategies</li>
                <li>• Focus on dividend yield sustainability (payout ratio &lt; 80%)</li>
                <li>• Look for consistent dividend growth over 5+ years</li>
                <li>• Consider valuation metrics like P/E ratio</li>
                <li>• Aristocrats and Kings offer proven track records</li>
              </ul>
            </div>

            {/* Watchlist */}
            {watchlist.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Watchlist ({watchlist.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {watchlist.map(symbol => (
                    <div
                      key={symbol}
                      className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">{symbol}</span>
                      <button
                        onClick={() => removeFromWatchlist(symbol)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockScreenerPage; 