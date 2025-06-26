'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, TrendingUp, Award, Building2, Zap, RefreshCw, Download, 
  Info, ChevronDown, Star, ArrowUpDown, Settings, Globe, Leaf, BarChart3,
  DollarSign, Target, Sliders, X, Plus, Minus
} from 'lucide-react';
import { stockScreener, ScreenerCriteria, ScreenerResult, PRESET_SCREENS, PresetScreen } from '@/utils/stockScreener';
import LoadingSpinner from './LoadingSpinner';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { companyInfo } from '@/utils/companyLogos';

interface StockScreenerProps {
  onStockSelect?: (stock: ScreenerResult) => void;
}

const StockScreener: React.FC<StockScreenerProps> = ({ onStockSelect }) => {
  const [results, setResults] = useState<ScreenerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<string>('dividend-aristocrats');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState<'overallScore' | 'dividendYield' | 'dividendGrowth' | 'price' | 'marketCap'>('overallScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Custom criteria state with enhanced filters
  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    minYield: 2,
    maxPayoutRatio: 80,
    minMarketCap: 1000000000
  });

  // Enhanced filter state management
  const [filters, setFilters] = useState({
    basic: {
      minPrice: '',
      maxPrice: '',
      minMarketCap: '1',
      maxMarketCap: '',
      sectors: [] as string[],
      excludeSectors: [] as string[]
    },
    dividend: {
      minYield: '2',
      maxYield: '',
      minDividendGrowth: '',
      minPayoutRatio: '',
      maxPayoutRatio: '80',
      minYearsOfGrowth: '',
      minConsecutiveGrowth: ''
    },
    financial: {
      minPE: '',
      maxPE: '',
      minROE: '',
      maxROE: '',
      minCurrentRatio: '',
      maxDebtToEquity: '',
      minProfitMargin: '',
      minOperatingMargin: ''
    },
    valuation: {
      maxPriceToBook: '',
      minPriceToBook: '',
      maxPriceToSales: '',
      minPriceToSales: ''
    },
    quality: {
      minFinancialStrengthScore: '',
      minDividendSafetyScore: '',
      minESGScore: ''
    },
    special: {
      isDividendAristocrat: false,
      isDividendKing: false,
      isDividendContender: false,
      isREIT: false,
      isESGLeader: false,
      hasEarningsGrowth: false,
      hasRevenueGrowth: false,
      hasPositiveFCF: false,
      isUndervalued: false
    }
  });

  // Sector options
  const sectors = [
    'Technology', 'Healthcare', 'Financials', 'Energy', 'Utilities',
    'Consumer Discretionary', 'Consumer Staples', 'Industrials',
    'Materials', 'Real Estate', 'Communication Services'
  ];

  // Category options for presets
  const categories = [
    { id: 'all', name: 'All Screens', icon: Filter },
    { id: 'aristocrats', name: 'Aristocrats & Kings', icon: Award },
    { id: 'dividend', name: 'Dividend Focus', icon: DollarSign },
    { id: 'growth', name: 'Growth Stories', icon: TrendingUp },
    { id: 'value', name: 'Value Plays', icon: Target },
    { id: 'income', name: 'Income Generators', icon: BarChart3 },
    { id: 'quality', name: 'Quality Picks', icon: Star },
    { id: 'esg', name: 'ESG Leaders', icon: Leaf },
    { id: 'international', name: 'International', icon: Globe }
  ];

  const filteredPresets = selectedCategory === 'all' 
    ? PRESET_SCREENS 
    : PRESET_SCREENS.filter(preset => preset.category === selectedCategory);

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

  const buildCriteriaFromFilters = (): ScreenerCriteria => {
    const criteria: ScreenerCriteria = {};
    
    // Basic filters
    if (filters.basic.minPrice) criteria.minPrice = parseFloat(filters.basic.minPrice);
    if (filters.basic.maxPrice) criteria.maxPrice = parseFloat(filters.basic.maxPrice);
    if (filters.basic.minMarketCap) criteria.minMarketCap = parseFloat(filters.basic.minMarketCap) * 1000000000;
    if (filters.basic.maxMarketCap) criteria.maxMarketCap = parseFloat(filters.basic.maxMarketCap) * 1000000000;
    if (filters.basic.sectors.length > 0) criteria.sectors = filters.basic.sectors;
    if (filters.basic.excludeSectors.length > 0) criteria.excludeSectors = filters.basic.excludeSectors;
    
    // Dividend filters
    if (filters.dividend.minYield) criteria.minYield = parseFloat(filters.dividend.minYield);
    if (filters.dividend.maxYield) criteria.maxYield = parseFloat(filters.dividend.maxYield);
    if (filters.dividend.minDividendGrowth) criteria.minDividendGrowth = parseFloat(filters.dividend.minDividendGrowth);
    if (filters.dividend.minPayoutRatio) criteria.minPayoutRatio = parseFloat(filters.dividend.minPayoutRatio);
    if (filters.dividend.maxPayoutRatio) criteria.maxPayoutRatio = parseFloat(filters.dividend.maxPayoutRatio);
    if (filters.dividend.minYearsOfGrowth) criteria.minYearsOfGrowth = parseInt(filters.dividend.minYearsOfGrowth);
    if (filters.dividend.minConsecutiveGrowth) criteria.minConsecutiveGrowth = parseInt(filters.dividend.minConsecutiveGrowth);
    
    // Financial filters
    if (filters.financial.minPE) criteria.minPE = parseFloat(filters.financial.minPE);
    if (filters.financial.maxPE) criteria.maxPE = parseFloat(filters.financial.maxPE);
    if (filters.financial.minROE) criteria.minROE = parseFloat(filters.financial.minROE);
    if (filters.financial.maxROE) criteria.maxROE = parseFloat(filters.financial.maxROE);
    if (filters.financial.minCurrentRatio) criteria.minCurrentRatio = parseFloat(filters.financial.minCurrentRatio);
    if (filters.financial.maxDebtToEquity) criteria.maxDebtToEquity = parseFloat(filters.financial.maxDebtToEquity);
    if (filters.financial.minProfitMargin) criteria.minProfitMargin = parseFloat(filters.financial.minProfitMargin);
    if (filters.financial.minOperatingMargin) criteria.minOperatingMargin = parseFloat(filters.financial.minOperatingMargin);
    
    // Valuation filters
    if (filters.valuation.maxPriceToBook) criteria.maxPriceToBook = parseFloat(filters.valuation.maxPriceToBook);
    if (filters.valuation.minPriceToBook) criteria.minPriceToBook = parseFloat(filters.valuation.minPriceToBook);
    if (filters.valuation.maxPriceToSales) criteria.maxPriceToSales = parseFloat(filters.valuation.maxPriceToSales);
    if (filters.valuation.minPriceToSales) criteria.minPriceToSales = parseFloat(filters.valuation.minPriceToSales);
    
    // Quality filters
    if (filters.quality.minFinancialStrengthScore) criteria.minFinancialStrengthScore = parseFloat(filters.quality.minFinancialStrengthScore);
    if (filters.quality.minDividendSafetyScore) criteria.minDividendSafetyScore = parseFloat(filters.quality.minDividendSafetyScore);
    if (filters.quality.minESGScore) criteria.minESGScore = parseFloat(filters.quality.minESGScore);
    
    // Special filters
    Object.entries(filters.special).forEach(([key, value]) => {
      if (value === true) {
        (criteria as any)[key] = true;
      }
    });
    
    return criteria;
  };

  const handleCustomScreen = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const builtCriteria = buildCriteriaFromFilters();
      const results = await stockScreener.screenStocks(builtCriteria);
      setResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to screen stocks');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      basic: {
        minPrice: '',
        maxPrice: '',
        minMarketCap: '1',
        maxMarketCap: '',
        sectors: [],
        excludeSectors: []
      },
      dividend: {
        minYield: '2',
        maxYield: '',
        minDividendGrowth: '',
        minPayoutRatio: '',
        maxPayoutRatio: '80',
        minYearsOfGrowth: '',
        minConsecutiveGrowth: ''
      },
      financial: {
        minPE: '',
        maxPE: '',
        minROE: '',
        maxROE: '',
        minCurrentRatio: '',
        maxDebtToEquity: '',
        minProfitMargin: '',
        minOperatingMargin: ''
      },
      valuation: {
        maxPriceToBook: '',
        minPriceToBook: '',
        maxPriceToSales: '',
        minPriceToSales: ''
      },
      quality: {
        minFinancialStrengthScore: '',
        minDividendSafetyScore: '',
        minESGScore: ''
      },
      special: {
        isDividendAristocrat: false,
        isDividendKing: false,
        isDividendContender: false,
        isREIT: false,
        isESGLeader: false,
        hasEarningsGrowth: false,
        hasRevenueGrowth: false,
        hasPositiveFCF: false,
        isUndervalued: false
      }
    });
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy': return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/20';
      case 'Buy': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/10';
      case 'Hold': return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/20';
      case 'Sell': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/10';
      case 'Strong Sell': return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 65) return 'text-green-500 dark:text-green-500';
    if (score >= 45) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 30) return 'text-red-500 dark:text-red-500';
    return 'text-red-600 dark:text-red-400';
  };

  const sortResults = (results: ScreenerResult[]) => {
    return [...results].sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (sortBy) {
        case 'dividendYield':
          aVal = a.dividendYield;
          bVal = b.dividendYield;
          break;
        case 'dividendGrowth':
          aVal = a.dividendGrowth;
          bVal = b.dividendGrowth;
          break;
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'marketCap':
          aVal = a.marketCap;
          bVal = b.marketCap;
          break;
        default:
          aVal = a.overallScore;
          bVal = b.overallScore;
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  };

  const handleSort = (column: 'overallScore' | 'dividendYield' | 'dividendGrowth' | 'price' | 'marketCap') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
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

  const sortedResults = sortResults(results);

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
            <Search className="h-6 w-6 text-green-600" />
            Stock Screener
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Filter and discover dividend stocks using advanced criteria
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {results.length > 0 && (
            <button
              onClick={exportResults}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          )}
          <button
            onClick={() => stockScreener.clearCache()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Cache
          </button>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'presets', label: 'Preset Screens', icon: Filter },
              { id: 'custom', label: 'Custom Screen', icon: Search }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'presets' | 'custom')}
                className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 rounded-t-lg
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-500 dark:text-green-400 dark:border-green-400 bg-gray-100 dark:bg-gray-900'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-400 bg-transparent'}
                `}
                style={{ minWidth: 160 }}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Preset Screens Tab */}
      {activeTab === 'presets' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                  {category.id !== 'all' && (
                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                      {PRESET_SCREENS.filter(p => p.category === category.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPresets.map(preset => (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                className={`p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                  selectedPreset === preset.id
                    ? 'border-green-600 bg-green-50 dark:bg-purple-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-zinc-800'
                }`}
                onClick={() => setSelectedPreset(preset.id)}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    selectedPreset === preset.id 
                      ? 'bg-green-600' 
                      : 'bg-gradient-to-r from-purple-500 to-purple-600'
                  }`}>
                    {preset.category === 'aristocrats' && <Award className="h-5 w-5 text-white" />}
                    {preset.category === 'dividend' && <DollarSign className="h-5 w-5 text-white" />}
                    {preset.category === 'growth' && <Zap className="h-5 w-5 text-white" />}
                    {preset.category === 'value' && <Target className="h-5 w-5 text-white" />}
                    {preset.category === 'income' && <BarChart3 className="h-5 w-5 text-white" />}
                    {preset.category === 'quality' && <Star className="h-5 w-5 text-white" />}
                    {preset.category === 'esg' && <Leaf className="h-5 w-5 text-white" />}
                    {preset.category === 'international' && <Globe className="h-5 w-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        {preset.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        preset.difficulty === 'Beginner' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : preset.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {preset.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                      {preset.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {preset.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        ~{preset.expectedResults} results
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-8">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No screens found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try selecting a different category or switch to custom screening.
              </p>
            </div>
          )}

          <button
            onClick={handlePresetScreen}
            disabled={loading || !selectedPreset}
            className="w-full lg:w-auto px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Search className="h-5 w-5" />}
            {loading ? 'Screening...' : `Run ${selectedPreset ? PRESET_SCREENS.find(p => p.id === selectedPreset)?.name || 'Screen' : 'Screen'}`}
          </button>
        </div>
      )}

      {/* Custom Screen Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {/* Filter Categories */}
          <div className="space-y-4">
            {/* Basic Filters */}
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Basic Filters
                </h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Price ($)
                  </label>
                  <input
                    type="number"
                    value={filters.basic.minPrice}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      basic: { ...prev.basic, minPrice: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    value={filters.basic.maxPrice}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      basic: { ...prev.basic, maxPrice: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="∞"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Market Cap ($B)
                  </label>
                  <input
                    type="number"
                    value={filters.basic.minMarketCap}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      basic: { ...prev.basic, minMarketCap: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Market Cap ($B)
                  </label>
                  <input
                    type="number"
                    value={filters.basic.maxMarketCap}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      basic: { ...prev.basic, maxMarketCap: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="∞"
                  />
                </div>
              </div>
            </div>

            {/* Dividend Filters */}
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Dividend Criteria
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Yield (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={filters.dividend.minYield}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dividend: { ...prev.dividend, minYield: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="2.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Yield (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={filters.dividend.maxYield}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dividend: { ...prev.dividend, maxYield: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="∞"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Growth (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={filters.dividend.minDividendGrowth}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dividend: { ...prev.dividend, minDividendGrowth: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Payout (%)
                  </label>
                  <input
                    type="number"
                    value={filters.dividend.maxPayoutRatio}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dividend: { ...prev.dividend, maxPayoutRatio: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="80"
                  />
                </div>
              </div>
            </div>

            {/* Special Categories */}
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-yellow-500" />
                Special Categories
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries({
                  'isDividendAristocrat': { label: 'Dividend Aristocrats', description: '25+ years growth' },
                  'isDividendKing': { label: 'Dividend Kings', description: '50+ years growth' },
                  'isDividendContender': { label: 'Dividend Contenders', description: '10-24 years growth' },
                  'isREIT': { label: 'REITs', description: 'Real Estate Investment Trusts' },
                  'isESGLeader': { label: 'ESG Leaders', description: 'Sustainable companies' },
                  'hasEarningsGrowth': { label: 'Earnings Growth', description: 'Positive EPS growth' },
                  'hasRevenueGrowth': { label: 'Revenue Growth', description: 'Growing top line' },
                  'hasPositiveFCF': { label: 'Positive FCF', description: 'Free cash flow positive' },
                  'isUndervalued': { label: 'Undervalued', description: 'Below fair value' }
                }).map(([key, { label, description }]) => (
                  <label key={key} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={(filters.special as any)[key]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        special: { ...prev.special, [key]: e.target.checked }
                      }))}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Advanced Filters - Collapsible */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Financial Metrics */}
                  <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Financial Metrics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Min P/E Ratio
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={filters.financial.minPE}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            financial: { ...prev.financial, minPE: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max P/E Ratio
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={filters.financial.maxPE}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            financial: { ...prev.financial, maxPE: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="∞"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Min ROE (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={filters.financial.minROE}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            financial: { ...prev.financial, minROE: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max Debt/Equity
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={filters.financial.maxDebtToEquity}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            financial: { ...prev.financial, maxDebtToEquity: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="∞"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Valuation Filters */}
                  <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-red-500" />
                      Valuation Metrics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max P/B Ratio
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={filters.valuation.maxPriceToBook}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            valuation: { ...prev.valuation, maxPriceToBook: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="∞"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max P/S Ratio
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={filters.valuation.maxPriceToSales}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            valuation: { ...prev.valuation, maxPriceToSales: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="∞"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Min Quality Score
                        </label>
                        <input
                          type="number"
                          value={filters.quality.minFinancialStrengthScore}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            quality: { ...prev.quality, minFinancialStrengthScore: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Min ESG Score
                        </label>
                        <input
                          type="number"
                          value={filters.quality.minESGScore}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            quality: { ...prev.quality, minESGScore: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCustomScreen}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Search className="h-5 w-5" />}
              {loading ? 'Screening...' : 'Run Custom Screen'}
            </button>
            
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-600 flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <X className="h-5 w-5" />
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Enhanced Results */}
      {sortedResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Screening Results ({sortedResults.length} stocks)
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as 'overallScore' | 'dividendYield' | 'dividendGrowth' | 'price' | 'marketCap')}
                className="px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                <option value="overallScore">Overall Score</option>
                <option value="dividendYield">Dividend Yield</option>
                <option value="dividendGrowth">Growth Rate</option>
                <option value="price">Stock Price</option>
                <option value="marketCap">Market Cap</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <ArrowUpDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-zinc-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Price / Market Cap
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Dividend
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Metrics
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                  {sortedResults.map((stock) => {
                    const company = companyInfo[stock.symbol];
                    return (
                      <tr
                        key={stock.symbol}
                        className="hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                        onClick={() => onStockSelect?.(stock)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {company?.logo ? (
                              <img 
                                src={company.logo} 
                                alt={`${stock.symbol} logo`}
                                className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-zinc-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-700 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                  {stock.symbol.slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                  {stock.symbol}
                                </span>
                                {stock.isDividendAristocrat && (
                                  <Award className="h-4 w-4 text-yellow-500" />
                                )}
                                {stock.isDividendKing && (
                                  <Award className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {company?.name || stock.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-500">
                                {stock.sector}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                              {formatCurrency(stock.price)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              ${(stock.marketCap / 1000000000).toFixed(1)}B
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-bold text-green-600 dark:text-green-400">
                              {formatPercent(stock.dividendYield)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Growth: {formatPercent(stock.dividendGrowth)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              {stock.yearsOfGrowth} years
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">PE:</span>
                              <span className="font-medium">{stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">ROE:</span>
                              <span className="font-medium">{formatPercent(stock.roe)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-bold ${getScoreColor(stock.overallScore)}`}>
                              {stock.overallScore.toFixed(0)}
                            </div>
                            <div className="w-12 bg-gray-200 dark:bg-zinc-600 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${stock.overallScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRecommendationColor(stock.recommendation)}`}>
                            {stock.recommendation}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add to watchlist logic would go here
                              }}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStockSelect?.(stock);
                              }}
                              className="px-3 py-1 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {!loading && sortedResults.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="bg-gray-100 dark:bg-zinc-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            No stocks found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your screening criteria or use one of our preset screens to discover dividend opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default StockScreener; 