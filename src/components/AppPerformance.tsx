import React from 'react';

export default function AppPerformance() {
  return (
    <div className="hidden md:flex items-center space-x-6 ml-6">
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">98%</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">Lighthouse</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-green-600 dark:text-green-400">&lt;1s</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">Load</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">PWA</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">Ready</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">✓</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">Offline</span>
      </div>
    </div>
  );
} 