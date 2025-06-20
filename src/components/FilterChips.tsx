import React, { useState, useEffect, memo } from 'react';
import { Holding } from '@/data/holdings';

interface FilterChipsProps {
  holdings: Holding[];
  onFilterChange: (filters: FilterState) => void;
  filters?: FilterState;
}

interface FilterState {
  sectors: string[];
  dividendYield: 'all' | 'high' | 'medium' | 'low';
  marketValue: 'all' | 'large' | 'medium' | 'small';
  performance: 'all' | 'gainers' | 'losers';
  priceChange: 'all' | 'up' | 'down';
}

const FilterChips = ({ holdings, onFilterChange, filters: controlledFilters }: FilterChipsProps) => {
  const [internalFilters, setInternalFilters] = useState<FilterState>({
    sectors: [],
    dividendYield: 'all',
    marketValue: 'all',
    performance: 'all',
    priceChange: 'all'
  });
  const filters = controlledFilters ?? internalFilters;

  // Get unique sectors from holdings
  const sectors = Array.from(new Set(holdings.map(h => h.sector).filter(Boolean)));

  useEffect(() => {
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const toggleSector = (sector: string) => {
    const update = {
      ...filters,
      sectors: filters.sectors.includes(sector)
        ? filters.sectors.filter(s => s !== sector)
        : [...filters.sectors, sector]
    };
    controlledFilters ? onFilterChange(update) : setInternalFilters(update);
  };

  const setFilter = (key: keyof FilterState, value: any) => {
    const update = { ...filters, [key]: value };
    controlledFilters ? onFilterChange(update) : setInternalFilters(update);
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      sectors: [],
      dividendYield: 'all',
      marketValue: 'all',
      performance: 'all',
      priceChange: 'all'
    };
    controlledFilters ? onFilterChange(cleared) : setInternalFilters(cleared);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== 'all'
  );

  return (
    <div className="space-y-4">
      {/* Sector Filters */}
      <div className="flex flex-wrap gap-2">
        {sectors.map(sector => (
          <button
            key={sector}
            onClick={() => toggleSector(sector)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${filters.sectors.includes(sector)
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Dividend Yield Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dividend Yield:</span>
          <div className="flex gap-1">
            {(['all', 'high', 'medium', 'low'] as const).map(value => (
              <button
                key={value}
                onClick={() => setFilter('dividendYield', value)}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors
                  ${filters.dividendYield === value
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Market Value Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Value:</span>
          <div className="flex gap-1">
            {(['all', 'large', 'medium', 'small'] as const).map(value => (
              <button
                key={value}
                onClick={() => setFilter('marketValue', value)}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors
                  ${filters.marketValue === value
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Performance:</span>
          <div className="flex gap-1">
            {(['all', 'gainers', 'losers'] as const).map(value => (
              <button
                key={value}
                onClick={() => setFilter('performance', value)}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors
                  ${filters.performance === value
                    ? value === 'gainers'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : value === 'losers'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Price Change Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Change:</span>
          <div className="flex gap-1">
            {(['all', 'up', 'down'] as const).map(value => (
              <button
                key={value}
                onClick={() => setFilter('priceChange', value)}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors
                  ${filters.priceChange === value
                    ? value === 'up'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : value === 'down'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(FilterChips); 