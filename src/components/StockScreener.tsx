'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, TrendingUp, Award, Building2, Zap, RefreshCw, Download, Info } from 'lucide-react';
import { stockScreener, ScreenerCriteria, ScreenerResult, PRESET_SCREENS, PresetScreen } from '@/utils/stockScreener';
import LoadingSpinner from './LoadingSpinner';
import { formatCurrency, formatPercent } from '@/utils/formatters';

interface StockScreenerProps {
  onStockSelect?: (stock: ScreenerResult) => void;
}

const StockScreener: React.FC<StockScreenerProps> = ({ onStockSelect }) => {
  const [results, setResults] = useState<ScreenerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<string>('high-yield-dividend');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Custom criteria state
  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    minYield: 2,
    maxPayoutRatio: 80,
    minMarketCap: 1000000000
  });

  // Sector filter options
  const sectors = [
    'Technology', 'Healthcare', 'Financials', 'Energy', 'Utilities',
    'Consumer Discretionary', 'Consumer Staples', 'Industrials',
    'Materials', 'Real Estate', 'Communication Services'
  ];

  useEffect(() => {
    if (activeTab === 'presets' && selectedPreset) {
      handlePresetScreen();
    }
  }, [selectedPreset, activeTab]);

  const handlePresetScreen = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await stockScreener.getPresetScreen(selectedPreset);
      setResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to screen stocks');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomScreen = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await stockScreener.screenStocks(criteria);
      setResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to screen stocks');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy': return 'text-green-600 bg-green-50';
      case 'Buy': return 'text-green-500 bg-green-50';
      case 'Hold': return 'text-yellow-600 bg-yellow-50';
      case 'Sell': return 'text-red-500 bg-red-50';
      case 'Strong Sell': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-green-500';
    if (score >= 45) return 'text-yellow-600';
    if (score >= 30) return 'text-red-500';
    return 'text-red-600';
  };

  const exportResults = () => {
    if (results.length === 0) return;
    
    const csvContent = [
      'Symbol,Name,Price,Market Cap,Dividend Yield,Dividend Growth,P/E,ROE,Score,Recommendation',
      ...results.map(stock => [
        stock.symbol,
        `"${stock.name}"`,
        stock.price,
        stock.marketCap,
        stock.dividendYield,
        stock.dividendGrowth,
        stock.pe,
        stock.roe,
        stock.overallScore,
        stock.recommendation
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-screen-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Search className="h-6 w-6" />
            Stock Screener
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Find dividend stocks that match your investment criteria
          </p>
        </div>
        
        <div className="flex gap-2">
          {results.length > 0 && (
            <button
              onClick={exportResults}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
          <button
            onClick={() => stockScreener.clearCache()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Cache
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'presets', label: 'Preset Screens', icon: Filter },
            { id: 'custom', label: 'Custom Screen', icon: Search }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'presets' | 'custom')}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Preset Screens Tab */}
      {activeTab === 'presets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_SCREENS.map(preset => (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPreset === preset.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedPreset(preset.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    {preset.category === 'aristocrats' && <Award className="h-5 w-5 text-white" />}
                    {preset.category === 'dividend' && <TrendingUp className="h-5 w-5 text-white" />}
                    {preset.category === 'growth' && <Zap className="h-5 w-5 text-white" />}
                    {preset.category === 'value' && <Building2 className="h-5 w-5 text-white" />}
                    {preset.category === 'income' && <TrendingUp className="h-5 w-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {preset.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {preset.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={handlePresetScreen}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
            {loading ? 'Screening...' : 'Run Screen'}
          </button>
        </div>
      )}

      {/* Custom Screen Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {/* Basic Filters */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  value={criteria.minPrice || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, minPrice: parseFloat(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  value={criteria.maxPrice || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, maxPrice: parseFloat(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="No limit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Market Cap ($B)
                </label>
                <input
                  type="number"
                  value={criteria.minMarketCap ? criteria.minMarketCap / 1000000000 : ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, minMarketCap: parseFloat(e.target.value) * 1000000000 || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Dividend Filters */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Dividend Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Dividend Yield (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={criteria.minYield || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, minYield: parseFloat(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Dividend Yield (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={criteria.maxYield || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, maxYield: parseFloat(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="No limit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Dividend Growth (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={criteria.minDividendGrowth || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, minDividendGrowth: parseFloat(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Filter className="h-4 w-4" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </button>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Advanced Filters
                </h3>
                
                {/* Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max P/E Ratio
                    </label>
                    <input
                      type="number"
                      value={criteria.maxPE || ''}
                      onChange={(e) => setCriteria(prev => ({ ...prev, maxPE: parseFloat(e.target.value) || undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Min ROE (%)
                    </label>
                    <input
                      type="number"
                      value={criteria.minROE || ''}
                      onChange={(e) => setCriteria(prev => ({ ...prev, minROE: parseFloat(e.target.value) || undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Debt/Equity
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={criteria.maxDebtToEquity || ''}
                      onChange={(e) => setCriteria(prev => ({ ...prev, maxDebtToEquity: parseFloat(e.target.value) || undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.5"
                    />
                  </div>
                </div>

                {/* Special Categories */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Special Categories</h4>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { key: 'isDividendAristocrat', label: 'Dividend Aristocrats' },
                      { key: 'isDividendKing', label: 'Dividend Kings' },
                      { key: 'isREIT', label: 'REITs' },
                      { key: 'isUtility', label: 'Utilities' }
                    ].map(category => (
                      <label key={category.key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(criteria as any)[category.key] || false}
                          onChange={(e) => setCriteria(prev => ({ ...prev, [category.key]: e.target.checked || undefined }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleCustomScreen}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
            {loading ? 'Screening...' : 'Run Custom Screen'}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Screening Results ({results.length} stocks)
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price / Market Cap
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Dividend
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Metrics
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Recommendation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((stock) => (
                    <tr
                      key={stock.symbol}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => onStockSelect?.(stock)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {stock.symbol}
                            </span>
                            {stock.isDividendAristocrat && (
                              <Award className="h-4 w-4 text-yellow-500" />
                            )}
                            {stock.isDividendKing && (
                              <Award className="h-4 w-4 text-purple-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                            {stock.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {stock.sector}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(stock.price)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            ${(stock.marketCap / 1000000000).toFixed(1)}B
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {formatPercent(stock.dividendYield)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Growth: {formatPercent(stock.dividendGrowth)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {stock.yearsOfGrowth} years
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div>PE: {stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A'}</div>
                          <div>ROE: {formatPercent(stock.roe)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-semibold ${getScoreColor(stock.overallScore)}`}>
                          {stock.overallScore.toFixed(0)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRecommendationColor(stock.recommendation)}`}>
                          {stock.recommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && !error && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No stocks found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your screening criteria to find more results.
          </p>
        </div>
      )}
    </div>
  );
};

export default StockScreener; 