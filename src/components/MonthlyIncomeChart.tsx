import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, addMonths, startOfMonth } from 'date-fns';
import { Holding } from '@/data/holdings';

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
  const dailyAverage = totalAnnualIncome / 365;

  return (
    <div className={`p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${totalAnnualIncome.toFixed(2)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Annual Income</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setYearOffset(yearOffset - 1)}
            className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {format(addMonths(new Date(), (yearOffset - 1) * 12), 'yyyy')}
          </button>
          <button
            onClick={() => setYearOffset(0)}
            className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            One year ahead
          </button>
          <button
            onClick={() => setYearOffset(yearOffset + 1)}
            className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {format(addMonths(new Date(), (yearOffset + 1) * 12), 'yyyy')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ${monthlyAverage.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Daily</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ${dailyAverage.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Yet to receive</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ${(totalAnnualIncome - data[0].income).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Yield</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {(holdings.reduce((sum, h) => sum + (h.dividendYield || 0), 0) / holdings.length).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142.1, 70.6%, 45.3%)" className="dark:stop-color-[hsl(142.1,_70.6%,_45.3%)]" />
                <stop offset="100%" stopColor="hsl(142.1, 76.2%, 36.3%)" className="dark:stop-color-[hsl(142.1,_76.2%,_36.3%)]" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              className="text-gray-500 dark:text-gray-400"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              className="text-gray-500 dark:text-gray-400"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 animate-in fade-in zoom-in duration-200">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {data.month} {data.year}
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        ${data.income.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
              fill="url(#colorIncome)"
              radius={[4, 4, 0, 0]}
              className="animate-in fade-in slide-in-from-bottom duration-500"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 