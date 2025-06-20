import React, { useState, useEffect, memo } from 'react';
import { Holding } from '@/data/holdings';

interface AdvancedFiltersProps {
  holdings: Holding[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  sector: string;
  dividendYieldRange: [number, number];
  marketValueRange: [number, number];
  gainLossRange: [number, number];
  priceRange: [number, number];
}

const AdvancedFilters = ({ holdings, onFilterChange }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    sector: '',
    dividendYieldRange: [0, 100],
    marketValueRange: [0, 1000000],
    gainLossRange: [-1000000, 1000000],
    priceRange: [0, 10000],
  });

  const [showFilters, setShowFilters] = useState(false);

  // Get unique sectors from holdings
  const sectors = Array.from(new Set(holdings.map(h => h.sector).filter(Boolean)));

  // Calculate min/max values for ranges
  const minDividendYield = 0;
  const maxDividendYield = Math.max(...holdings.map(h => h.dividendYield), 100);
  const minMarketValue = 0;
  const maxMarketValue = Math.max(...holdings.map(h => h.shares * h.currentPrice), 1000000);
  const minGainLoss = Math.min(...holdings.map(h => (h.shares * h.currentPrice) - h.costBasis), -1000000);
  const maxGainLoss = Math.max(...holdings.map(h => (h.shares * h.currentPrice) - h.costBasis), 1000000);
  const minPrice = 0;
  const maxPrice = Math.max(...holdings.map(h => h.currentPrice), 10000);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleRangeChange = (field: keyof FilterState, value: [number, number]) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSectorChange = (sector: string) => {
    setFilters(prev => ({ ...prev, sector }));
  };

  const resetFilters = () => {
    setFilters({
      sector: '',
      dividendYieldRange: [0, 100],
      marketValueRange: [0, 1000000],
      gainLossRange: [-1000000, 1000000],
      priceRange: [0, 10000],
    });
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <svg
          className={`w-5 h-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        Advanced Filters
      </button>

      {showFilters && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
          {/* Sector Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sector
            </label>
            <select
              value={filters.sector}
              onChange={(e) => handleSectorChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
            >
              <option value="">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Dividend Yield Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dividend Yield Range (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.dividendYieldRange[0]}
                onChange={(e) => handleRangeChange('dividendYieldRange', [Number(e.target.value), filters.dividendYieldRange[1]])}
                min={minDividendYield}
                max={maxDividendYield}
                className="w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={filters.dividendYieldRange[1]}
                onChange={(e) => handleRangeChange('dividendYieldRange', [filters.dividendYieldRange[0], Number(e.target.value)])}
                min={minDividendYield}
                max={maxDividendYield}
                className="w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Market Value Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Market Value Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.marketValueRange[0]}
                onChange={(e) => handleRangeChange('marketValueRange', [Number(e.target.value), filters.marketValueRange[1]])}
                min={minMarketValue}
                max={maxMarketValue}
                className="w-32 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={filters.marketValueRange[1]}
                onChange={(e) => handleRangeChange('marketValueRange', [filters.marketValueRange[0], Number(e.target.value)])}
                min={minMarketValue}
                max={maxMarketValue}
                className="w-32 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Gain/Loss Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gain/Loss Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.gainLossRange[0]}
                onChange={(e) => handleRangeChange('gainLossRange', [Number(e.target.value), filters.gainLossRange[1]])}
                min={minGainLoss}
                max={maxGainLoss}
                className="w-32 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={filters.gainLossRange[1]}
                onChange={(e) => handleRangeChange('gainLossRange', [filters.gainLossRange[0], Number(e.target.value)])}
                min={minGainLoss}
                max={maxGainLoss}
                className="w-32 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handleRangeChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                min={minPrice}
                max={maxPrice}
                className="w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handleRangeChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                min={minPrice}
                max={maxPrice}
                className="w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AdvancedFilters); 