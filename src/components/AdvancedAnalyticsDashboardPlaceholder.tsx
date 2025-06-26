'use client';

import React from 'react';

interface AdvancedAnalyticsDashboardProps {
  portfolioId: string;
  holdings: any[];
  className?: string;
}

export default function AdvancedAnalyticsDashboard({ 
  portfolioId, 
  holdings, 
  className = '' 
}: AdvancedAnalyticsDashboardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Analytics</h3>
      <p className="text-gray-600 mb-4">
        Advanced analytics dashboard temporarily disabled during build optimization.
      </p>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">
          Portfolio: {portfolioId} | Holdings: {holdings.length}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Full analytics will be restored after build fixes are complete.
        </p>
      </div>
    </div>
  );
} 