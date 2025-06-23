"use client";
import { ReactNode } from 'react';
import React, { memo } from 'react';

interface DividendCardProps {
  title: string;
  value: string | number;
  meta?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

const DividendCard = ({ title, value, meta, trend, subtitle }: DividendCardProps) => {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        {trend && (
          <div className={`w-2 h-2 rounded-full ${
            trend === 'up' ? 'bg-green-500' : 
            trend === 'down' ? 'bg-red-500' : 
            'bg-gray-400'
          }`} />
        )}
      </div>

      {/* Main Value */}
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {value}
        </div>
        {subtitle && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </div>
        )}
      </div>

      {/* Meta Information */}
      {meta && (
        <div className="flex items-center gap-2">
          {meta}
        </div>
      )}
    </div>
  );
};

export default memo(DividendCard); 