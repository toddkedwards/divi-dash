"use client";

import React from 'react';

interface PortfolioCompositionChartProps {
  viewType?: 'holdings' | 'sector' | 'country' | 'marketCap';
  holdings?: any[];
  totalValue?: number;
  className?: string;
}

export default function PortfolioCompositionChart({ 
  viewType = 'holdings', 
  holdings = [],
  totalValue = 0,
  className = ''
}: PortfolioCompositionChartProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Portfolio Composition
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          View: {viewType}
        </div>
      </div>
      
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>Portfolio composition chart will be displayed here</p>
          <p className="text-sm mt-1">
            Holdings: {holdings.length} | Total Value: ${totalValue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
