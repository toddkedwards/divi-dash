'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3, Info, Plus, Star, Search, Filter, ChevronRight, Target, Users, Zap, AlertTriangle, X, ExternalLink } from 'lucide-react';
import StockScreener from '@/components/StockScreener';
import { ScreenerResult, DIVIDEND_ARISTOCRATS, DIVIDEND_KINGS } from '@/utils/stockScreener';
import { formatCurrency, formatPercent } from '@/utils/formatters';

const StockScreenerPage = () => {
  const [selectedStock, setSelectedStock] = useState<ScreenerResult | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [savedScreens, setSavedScreens] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const saved = localStorage.getItem('screener-watchlist');
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load watchlist from localStorage:', error);
      setWatchlist([]);
    }
  }, []);

  // Mock data for demonstration
  const totalStocksInUniverse = 3500;
  const marketCapTotal = 45.2; // Trillion

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2">
                Stock Screener
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Discover dividend stocks with advanced filtering and analysis
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Last updated: {new Date().toLocaleDateString()} • {totalStocksInUniverse.toLocaleString()} stocks tracked
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-xl">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Coverage</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">${marketCapTotal}T</div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 hover:border-green-300 dark:hover:border-green-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Aristocrats
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {DIVIDEND_ARISTOCRATS.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                25+ years growth
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 hover:border-green-300 dark:hover:border-green-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Kings
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {DIVIDEND_KINGS.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                50+ years growth
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 hover:border-green-300 dark:hover:border-green-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Watchlist
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {watchlist.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Tracked stocks
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 hover:border-green-300 dark:hover:border-green-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  High Yield
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                247
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                5%+ dividend yield
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 hover:border-green-300 dark:hover:border-green-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Growth
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                156
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                10%+ annual growth
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 hover:border-green-300 dark:hover:border-green-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Value
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                89
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                P/E under 15
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Quality Dividends</h3>
                  <p className="text-green-100 text-sm">Aristocrats & Kings</p>
                </div>
              </div>
              <p className="text-green-100 text-sm mb-4">
                Discover stocks with proven track records of consistent dividend growth
              </p>
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                Explore Now <ChevronRight className="inline h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">High Yield Hunt</h3>
                  <p className="text-blue-100 text-sm">5%+ dividend yields</p>
                </div>
              </div>
              <p className="text-blue-100 text-sm mb-4">
                Find stocks offering attractive dividend yields with sustainable payouts
              </p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Start Screening <ChevronRight className="inline h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Growth Leaders</h3>
                  <p className="text-purple-100 text-sm">Fast-growing dividends</p>
                </div>
              </div>
              <p className="text-purple-100 text-sm mb-4">
                Identify companies rapidly increasing their dividend payments
              </p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                Find Growth <ChevronRight className="inline h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Screener - Takes up 3 columns */}
          <div className="xl:col-span-3">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
              <StockScreener 
                onStockSelect={setSelectedStock}
                onError={setError}
              />
            </div>
          </div>

          {/* Enhanced Sidebar - Takes up 1 column */}
          <div className="space-y-6">
            {/* Selected Stock Details */}
            {selectedStock && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedStock.symbol} - {selectedStock.name}
                  </h3>
                  <button
                    onClick={() => setSelectedStock(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Dividend Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Yield:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPercent(selectedStock.dividendYield)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Growth (5Y):</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPercent(selectedStock.dividendGrowth5Y)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Payout Ratio:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPercent(selectedStock.payoutRatio)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Valuation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">P/E Ratio:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedStock.pe.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Price/Book:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedStock.priceToBook.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Market Cap:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(selectedStock.marketCap)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Quality Score</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Overall:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedStock.overallScore.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Dividend Safety:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedStock.dividendSafetyScore.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Financial Strength:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedStock.financialStrengthScore.toFixed(1)}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => addToWatchlist(selectedStock.symbol)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Watchlist
                  </button>
                  <button
                    onClick={() => window.open(`https://finance.yahoo.com/quote/${selectedStock.symbol}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Yahoo Finance
                  </button>
                </div>
              </motion.div>
            )}

            {/* Quick Screens */}
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Quick Screens
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Dividend Aristocrats', count: DIVIDEND_ARISTOCRATS.length, color: 'yellow' },
                  { name: 'High Yield (5%+)', count: 247, color: 'green' },
                  { name: 'Fast Growers (10%+)', count: 156, color: 'blue' },
                  { name: 'Value Picks (PE < 15)', count: 89, color: 'purple' },
                ].map((screen, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-700 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-600 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${screen.color}-500`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {screen.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                      {screen.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dividend Aristocrats Preview */}
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Top Aristocrats
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                25+ years of consecutive dividend increases
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {DIVIDEND_ARISTOCRATS.slice(0, 8).map(symbol => (
                  <div
                    key={symbol}
                    className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{symbol}</span>
                    </div>
                    <button
                      onClick={() => addToWatchlist(symbol)}
                      disabled={watchlist.includes(symbol)}
                      className={`p-1 rounded transition-colors ${
                        watchlist.includes(symbol)
                          ? 'text-green-500 cursor-not-allowed'
                          : 'text-gray-400 hover:text-green-500'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-3 text-center">
                Showing 8 of {DIVIDEND_ARISTOCRATS.length} aristocrats
              </div>
            </div>

            {/* Watchlist */}
            {watchlist.length > 0 && (
              <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Your Watchlist
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                    {watchlist.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {watchlist.map(symbol => (
                    <div
                      key={symbol}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 text-green-500 fill-current" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{symbol}</span>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(symbol)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Screening Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-blue-900 dark:text-blue-100">
                  Pro Tips
                </h3>
              </div>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>• Focus on sustainable payout ratios (&lt; 80%)</li>
                <li>• Look for 5+ years of consistent growth</li>
                <li>• Consider valuation alongside yield</li>
                <li>• Aristocrats offer proven reliability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockScreenerPage; 