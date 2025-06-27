"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';
import { Holding } from '@/data/holdings';
import { Calendar, Download, Filter, RefreshCw, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';

interface Payout {
  symbol: string;
  amount: number;
  date: Date;
  type: 'ex-date' | 'payment-date';
  shares: number;
  totalAmount: number;
  yield: number;
}

export default function DividendCalendarPage() {
  const { holdings } = usePortfolio();
  const { priceUpdates, refreshPrices, isLoading } = useRealTimePrices(holdings);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showExDates, setShowExDates] = useState(true);
  const [showPaymentDates, setShowPaymentDates] = useState(true);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'paid'>('all');

  // Calculate upcoming dividends based on frequency and historical data
  const calculateUpcomingDividends = useCallback(() => {
    setIsCalculating(true);
    const payouts: Payout[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    holdings.forEach((holding) => {
      if (!holding.dividendYield || holding.dividendYield === 0) return;

      const priceUpdate = priceUpdates.find(p => p.symbol === holding.symbol);
      const currentPrice = priceUpdate?.currentPrice || holding.currentPrice;
      const dividendPerShare = (currentPrice * holding.dividendYield) / 100;

      // Generate payouts for the next 12 months based on frequency
      for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
        const targetMonth = (currentMonth + monthOffset) % 12;
        const targetYear = currentYear + Math.floor((currentMonth + monthOffset) / 12);

        let shouldPay = false;

        switch (holding.payoutFrequency) {
          case 'monthly':
            shouldPay = true;
            break;
          case 'quarterly':
            // Typical quarterly months: Jan, Apr, Jul, Oct
            shouldPay = [0, 3, 6, 9].includes(targetMonth);
            break;
          case 'semi-annual':
            // Typical semi-annual months: Jan, Jul
            shouldPay = [0, 6].includes(targetMonth);
            break;
          case 'annual':
            // Typical annual month: Jan
            shouldPay = targetMonth === 0;
            break;
        }

        if (shouldPay) {
          // Estimate payment date (typically 1-2 weeks after ex-date)
          const exDate = new Date(targetYear, targetMonth, 15); // Mid-month ex-date
          const paymentDate = new Date(targetYear, targetMonth, 28); // End of month payment

          // Only add if it's in the future
          if (exDate > today) {
            payouts.push({
              symbol: holding.symbol,
              amount: dividendPerShare,
              date: exDate,
              type: 'ex-date',
              shares: holding.shares,
              totalAmount: dividendPerShare * holding.shares,
              yield: holding.dividendYield
            });

            payouts.push({
              symbol: holding.symbol,
              amount: dividendPerShare,
              date: paymentDate,
              type: 'payment-date',
              shares: holding.shares,
              totalAmount: dividendPerShare * holding.shares,
              yield: holding.dividendYield
            });
          }
        }
      }
    });

    // Sort by date
    payouts.sort((a, b) => a.date.getTime() - b.date.getTime());
    setPayouts(payouts);
    setIsCalculating(false);
  }, [holdings, priceUpdates]);

  useEffect(() => {
    calculateUpcomingDividends();
  }, [calculateUpcomingDividends]);

  // Filter payouts by selected month/year and type
  const filteredPayouts = payouts.filter(payout => {
    const payoutMonth = payout.date.getMonth();
    const payoutYear = payout.date.getFullYear();
    
    const monthMatch = selectedMonth === payoutMonth && selectedYear === payoutYear;
    const typeMatch = (showExDates && payout.type === 'ex-date') || 
                     (showPaymentDates && payout.type === 'payment-date');
    
    return monthMatch && typeMatch;
  });

  // Calculate monthly totals
  const monthlyTotal = filteredPayouts
    .filter(p => p.type === 'payment-date')
    .reduce((sum, payout) => sum + payout.totalAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

  // Mock dividend events data
  const dividendEvents = [
    {
      id: '1',
      symbol: 'AAPL',
      company: 'Apple Inc.',
      amount: 0.24,
      exDate: '2024-01-15',
      payDate: '2024-02-15',
      shares: 50,
      totalAmount: 12.00,
      status: 'upcoming',
      type: 'quarterly'
    },
    {
      id: '2',
      symbol: 'MSFT',
      company: 'Microsoft Corporation',
      amount: 0.75,
      exDate: '2024-01-20',
      payDate: '2024-02-20',
      shares: 30,
      totalAmount: 22.50,
      status: 'upcoming',
      type: 'quarterly'
    },
    {
      id: '3',
      symbol: 'JNJ',
      company: 'Johnson & Johnson',
      amount: 1.19,
      exDate: '2024-01-25',
      payDate: '2024-02-25',
      shares: 75,
      totalAmount: 89.25,
      status: 'upcoming',
      type: 'quarterly'
    },
    {
      id: '4',
      symbol: 'KO',
      company: 'The Coca-Cola Company',
      amount: 0.46,
      exDate: '2024-01-30',
      payDate: '2024-02-28',
      shares: 100,
      totalAmount: 46.00,
      status: 'upcoming',
      type: 'quarterly'
    },
    {
      id: '5',
      symbol: 'VZ',
      company: 'Verizon Communications',
      amount: 0.665,
      exDate: '2024-02-05',
      payDate: '2024-03-05',
      shares: 60,
      totalAmount: 39.90,
      status: 'upcoming',
      type: 'quarterly'
    },
    {
      id: '6',
      symbol: 'T',
      company: 'AT&T Inc.',
      amount: 0.2775,
      exDate: '2024-02-10',
      payDate: '2024-03-10',
      shares: 80,
      totalAmount: 22.20,
      status: 'upcoming',
      type: 'quarterly'
    },
    {
      id: '7',
      symbol: 'PG',
      company: 'Procter & Gamble',
      amount: 0.9407,
      exDate: '2024-02-15',
      payDate: '2024-03-15',
      shares: 40,
      totalAmount: 37.63,
      status: 'upcoming',
      type: 'quarterly'
    },
    {
      id: '8',
      symbol: 'JPM',
      company: 'JPMorgan Chase & Co.',
      amount: 1.05,
      exDate: '2024-02-20',
      payDate: '2024-03-20',
      shares: 25,
      totalAmount: 26.25,
      status: 'upcoming',
      type: 'quarterly'
    }
  ];

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dividendEvents.filter(event => {
      const eventDate = new Date(event.exDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dividend Calendar</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track upcoming dividend payments and ex-dates
            </p>
          </div>
          <button
            onClick={() => {
              refreshPrices();
              calculateUpcomingDividends();
            }}
            disabled={isLoading || isCalculating}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading || isCalculating ? 'animate-spin' : ''}`} />
            {isLoading || isCalculating ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showExDates}
                    onChange={(e) => setShowExDates(e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Ex-Dates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPaymentDates}
                    onChange={(e) => setShowPaymentDates(e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Payment Dates</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(monthlyTotal)}
                </p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Count</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredPayouts.filter(p => p.type === 'payment-date').length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Yield</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {holdings.length > 0 ? 
                    `${(holdings.reduce((sum, h) => sum + h.dividendYield, 0) / holdings.length).toFixed(2)}%` : 
                    '0%'
                  }
                </p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {months[selectedMonth]} {selectedYear}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredPayouts.length} events scheduled
            </p>
          </div>

          {filteredPayouts.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Dividend Events</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No dividend events scheduled for {months[selectedMonth]} {selectedYear}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-gray-50 dark:bg-gray-800 p-3 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{day}</span>
                  </div>
                ))}
                
                {/* Calendar Days */}
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === selectedMonth;
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayEvents = getEventsForDate(day);
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${
                        !isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-white'
                      } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                          {day.getDate()}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-1 rounded">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>
                      
                      {/* Event Indicators */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs p-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/50"
                            title={`${event.symbol}: $${event.amount} per share`}
                          >
                            <div className="font-medium">{event.symbol}</div>
                            <div className="text-xs">${event.amount}</div>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}