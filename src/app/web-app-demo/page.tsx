"use client";

import React from 'react';
import { Sparkles, Monitor, Keyboard, Download, Share2, Zap } from 'lucide-react';
import AdvancedWebAPIs from '@/components/AdvancedWebAPIs';

export default function WebAppDemoPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-emerald-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Divly Web App Polish
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Experience the next generation of web application features. Divly combines modern web APIs, 
          desktop optimizations, and progressive enhancement for the ultimate portfolio management experience.
        </p>
      </div>

      {/* Phase 3 Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Desktop Experience */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Desktop Experience
            </h3>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Drag-and-drop functionality</li>
            <li>• Right-click context menus</li>
            <li>• Multi-window support</li>
            <li>• Desktop keyboard shortcuts</li>
            <li>• Hover states and tooltips</li>
          </ul>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Optimized for desktop users with pointer devices and large screens
            </p>
          </div>
        </div>

        {/* Keyboard Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Keyboard className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Alt+D</kbd> Dashboard</li>
            <li>• <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Alt+P</kbd> Positions</li>
            <li>• <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl+K</kbd> Search</li>
            <li>• <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">?</kbd> Show shortcuts</li>
            <li>• <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">F11</kbd> Fullscreen</li>
          </ul>
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-400">
              Press ? to see all available shortcuts
            </p>
          </div>
        </div>

        {/* Advanced Web APIs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-6 w-6 text-emerald-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Modern Web APIs
            </h3>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Screen Wake Lock API</li>
            <li>• Web Share API</li>
            <li>• File System Access API</li>
            <li>• Web Payments API</li>
            <li>• Page Visibility API</li>
          </ul>
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Graceful fallbacks for unsupported browsers
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Web APIs Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Interactive Web API Demo
          </h2>
        </div>
        <AdvancedWebAPIs />
      </div>

      {/* Performance Features */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-emerald-200 dark:border-emerald-800">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Download className="h-6 w-6 text-emerald-600" />
          Performance Optimizations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-2">90+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lighthouse Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">&lt;1.5s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">First Contentful Paint</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">&lt;250KB</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bundle Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">&lt;0.1</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Layout Shift</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Optimization Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div>• Code splitting and lazy loading</div>
            <div>• Advanced caching strategies</div>
            <div>• Image optimization</div>
            <div>• Bundle size optimization</div>
            <div>• Core Web Vitals monitoring</div>
            <div>• Intersection Observer</div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Ready for Production
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Divly now includes all Phase 3 web app polish features. The application is optimized 
          for desktop users, includes comprehensive keyboard navigation, and leverages modern web APIs 
          for the best possible user experience.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            Deploy to Production
          </button>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
