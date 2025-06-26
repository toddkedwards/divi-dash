'use client';

import React from 'react';

interface AIRecommendationsProps {
  portfolioSymbols?: string[];
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  investmentGoals?: string[];
  className?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  portfolioSymbols = ['AAPL', 'MSFT', 'GOOGL'],
  riskTolerance = 'moderate',
  investmentGoals = ['dividend_income', 'long_term_growth'],
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">AI Recommendations</h3>
      <p className="text-gray-600 mb-4">
        AI recommendations system temporarily disabled during build optimization.
      </p>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">
          Portfolio: {portfolioSymbols.join(', ')} | Risk: {riskTolerance}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Goals: {investmentGoals.join(', ')}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Full AI recommendations will be restored after build fixes are complete.
        </p>
      </div>
    </div>
  );
};

export default AIRecommendations;
