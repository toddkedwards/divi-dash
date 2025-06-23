import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, addMonths, startOfMonth } from 'date-fns';
import { Holding } from '@/data/holdings';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

interface MonthlyIncomeChartProps {
  holdings: Holding[];
  className?: string;
}

export default function MonthlyIncomeChart({ holdings, className = '' }: MonthlyIncomeChartProps) {
  const [yearOffset, setYearOffset] = useState(0);

  // Calculate monthly income data for the next 12 months
  const calculateMonthlyIncome = () => {
    const data = [];
    const startDate = addMonths(startOfMonth(new Date()), yearOffset * 12);

    for (let i = 0; i < 12; i++) {
      const date = addMonths(startDate, i);
      const month = format(date, 'MMM');
      const year = format(date, 'yyyy');
      
      // Calculate estimated income for this month
      let monthlyIncome = 0;
      holdings.forEach(holding => {
        if (!holding.dividendYield || !holding.shares || !holding.currentPrice) return;
        
        const annualDividend = (holding.currentPrice * holding.shares * (holding.dividendYield / 100));
        
        // Distribute annual dividend based on payout frequency
        switch (holding.payoutFrequency) {
          case 'monthly':
            monthlyIncome += annualDividend / 12;
            break;
          case 'quarterly':
            if (i % 3 === 0) monthlyIncome += annualDividend / 4;
            break;
          case 'semi-annual':
            if (i % 6 === 0) monthlyIncome += annualDividend / 2;
            break;
          case 'annual':
            if (i === 0) monthlyIncome += annualDividend;
            break;
          default:
            if (i % 3 === 0) monthlyIncome += annualDividend / 4; // Default to quarterly
        }
      });

      data.push({
        month: `${month}`,
        income: monthlyIncome,
        year,
        declared: false, // Could be updated with real data
      });
    }
    return data;
  };

  const data = calculateMonthlyIncome();
  const totalAnnualIncome = data.reduce((sum, month) => sum + month.income, 0);
  const monthlyAverage = totalAnnualIncome / 12;
  const currentYear = format(addMonths(new Date(), yearOffset * 12), 'yyyy');

  return (
    <div className={`rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
            Monthly Dividend Income
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${monthlyAverage.toFixed(0)}
            </span>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">Monthly Average</span>
            </div>
          </div>
        </div>
        
        {/* Year Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setYearOffset(yearOffset - 1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Previous Year"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[60px] text-center">
            {currentYear}
          </span>
          <button
            onClick={() => setYearOffset(yearOffset + 1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Next Year"
          >
            <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Annual Total
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            ${totalAnnualIncome.toFixed(0)}
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Quarterly Avg
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            ${(totalAnnualIncome / 4).toFixed(0)}
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Weekly Avg
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            ${(totalAnnualIncome / 52).toFixed(0)}
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Daily Avg
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            ${(totalAnnualIncome / 365).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: 'currentColor', 
                fontSize: 12,
                fontWeight: 500
              }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: 'currentColor', 
                fontSize: 12,
                fontWeight: 500
              }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {data.month} {data.year}
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                        ${data.income.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {data.declared ? 'Declared' : 'Estimated'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="income"
              fill="url(#incomeGradient)"
              radius={[6, 6, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 