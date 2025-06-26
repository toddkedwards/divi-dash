'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import RevenueAnalytics from '@/components/RevenueAnalytics';
import CustomerSuccessDashboard from '@/components/CustomerSuccessDashboard';
import MarketingAnalytics from '@/components/MarketingAnalytics';

type DashboardView = 'overview' | 'revenue' | 'customers' | 'marketing';

export default function BusinessDevelopmentPage() {
  const [activeView, setActiveView] = useState<DashboardView>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'revenue':
        return <RevenueAnalytics />;
      case 'customers':
        return <CustomerSuccessDashboard />;
      case 'marketing':
        return <MarketingAnalytics />;
      default:
        return (
          <div className="space-y-6">
            {/* Executive Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Executive Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">.7K</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                  <p className="text-xs text-green-600">+34.2% MoM</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">12.8K</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-xs text-blue-600">+23.5% MoM</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">34.2%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Paid Conversion</p>
                  <p className="text-xs text-purple-600">+5.3% MoM</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">89.3%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</p>
                  <p className="text-xs text-orange-600">+2.1% MoM</p>
                </div>
              </div>
            </Card>

            {/* Key Initiatives */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Strategic Initiatives
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Q1 2024: Premium Push</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Launch enterprise features to increase premium subscriptions by 50%
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">75% Complete</p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Q2 2024: Mobile App</h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    Native mobile app to capture mobile-first users and increase engagement
                  </p>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <p className="text-xs text-green-600 mt-1">45% Complete</p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Q3 2024: API Platform</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                    Public API for third-party integrations and B2B partnerships
                  </p>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">15% Complete</p>
                </div>
              </div>
            </Card>

            {/* Market Opportunities */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Market Opportunities
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">International Expansion</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">European and Asian markets showing high demand</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">High Priority</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Institutional Partnerships</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Financial advisors and wealth management firms</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Medium Priority</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Educational Content Platform</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Premium courses and investment education</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Research Phase</span>
                </div>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Development</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Strategic insights and growth analytics for Divi Dash
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => window.print()}>
            Export Report
          </Button>
          <Button>
            Schedule Review
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as DashboardView)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
