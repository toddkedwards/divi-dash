'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Settings,
  Key,
  Link,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { REAL_API_CONFIGS, realBrokerageService } from '@/utils/realBrokerageIntegration';
import { BrokerageProvider } from '@/utils/brokerageIntegration';
import LoadingSpinner from './LoadingSpinner';

interface APICredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  enabled: boolean;
  lastTested?: Date;
  status: 'untested' | 'connected' | 'failed';
}

interface RealAPIManagerProps {
  userId: string;
}

const RealAPIManager: React.FC<RealAPIManagerProps> = ({ userId }) => {
  const [credentials, setCredentials] = useState<Record<BrokerageProvider, APICredentials>>({} as any);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'credentials' | 'webhooks'>('overview');

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = () => {
    // Load current credentials from environment/config
    const loadedCredentials: Record<BrokerageProvider, APICredentials> = {} as any;
    
    Object.entries(REAL_API_CONFIGS).forEach(([brokerage, config]) => {
      loadedCredentials[brokerage as BrokerageProvider] = {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri,
        enabled: config.enabled,
        status: config.enabled ? 'untested' : 'failed'
      };
    });
    
    setCredentials(loadedCredentials);
  };

  const handleTestConnection = async (brokerage: BrokerageProvider) => {
    setTesting(prev => ({ ...prev, [brokerage]: true }));
    
    try {
      // For demo purposes, simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isConfigured = realBrokerageService.isConfigured(brokerage);
      
      setCredentials(prev => ({
        ...prev,
        [brokerage]: {
          ...prev[brokerage],
          status: isConfigured ? 'connected' : 'failed',
          lastTested: new Date()
        }
      }));
    } catch (error) {
      setCredentials(prev => ({
        ...prev,
        [brokerage]: {
          ...prev[brokerage],
          status: 'failed',
          lastTested: new Date()
        }
      }));
    } finally {
      setTesting(prev => ({ ...prev, [brokerage]: false }));
    }
  };

  const handleCopyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const enabledCount = Object.values(credentials).filter(c => c.enabled).length;
  const connectedCount = Object.values(credentials).filter(c => c.status === 'connected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Key className="h-6 w-6" />
            Real API Integration Manager
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Configure and manage live brokerage API connections
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Status:</span>
            <span className="ml-1 font-medium text-gray-900 dark:text-white">
              {connectedCount}/{enabledCount} Connected
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'credentials', label: 'API Credentials', icon: Key },
            { id: 'webhooks', label: 'Webhooks', icon: Link }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{enabledCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">APIs Configured</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{connectedCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Active Connections</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {Object.values(credentials).filter(c => c.status === 'untested').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Untested</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {Object.values(credentials).filter(c => c.status === 'failed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Failed</div>
            </div>
          </div>

          {/* Integration Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Integration Status Overview
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(credentials).map(([brokerage, creds]) => (
                <div key={brokerage} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {brokerage.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white capitalize">
                        {brokerage.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getStatusIcon(creds.status)}
                        <span className={getStatusColor(creds.status)}>
                          {creds.status === 'connected' && 'Connected'}
                          {creds.status === 'failed' && 'Failed'}
                          {creds.status === 'untested' && 'Not Tested'}
                        </span>
                        {creds.lastTested && (
                          <span className="text-gray-500 dark:text-gray-400">
                            • Last tested: {creds.lastTested.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestConnection(brokerage as BrokerageProvider)}
                      disabled={testing[brokerage] || !creds.enabled}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {testing[brokerage] ? <LoadingSpinner size="sm" /> : <RefreshCw className="h-3 w-3" />}
                      Test
                    </button>
                    <button
                      onClick={() => setEditing(brokerage)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Credentials Tab */}
      {selectedTab === 'credentials' && (
        <div className="space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Environment Variables Required
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Add these environment variables to your .env.local file to enable real API integrations.
                </p>
              </div>
            </div>
          </div>

          {Object.entries(credentials).map(([brokerage, creds]) => (
            <motion.div
              key={brokerage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {brokerage.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {brokerage.replace(/([A-Z])/g, ' $1').trim()} API
                    </h3>
                    {getStatusIcon(creds.status)}
                  </div>
                  <button
                    onClick={() => setShowSecrets(prev => ({ ...prev, [brokerage]: !prev[brokerage] }))}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {showSecrets[brokerage] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showSecrets[brokerage] ? 'Hide' : 'Show'} Secrets
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Environment Variables */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Client ID
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                        {brokerage.toUpperCase()}_CLIENT_ID={creds.clientId || ''}
                      </code>
                      <button
                        onClick={() => handleCopyToClipboard(
                          `${brokerage.toUpperCase()}_CLIENT_ID=${creds.clientId}`,
                          `${brokerage}-client-id`
                        )}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {copied === `${brokerage}-client-id` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Client Secret
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                        {brokerage.toUpperCase()}_CLIENT_SECRET={
                          showSecrets[brokerage] ? creds.clientSecret || '' : '••••••••••••••••'
                        }
                      </code>
                      <button
                        onClick={() => handleCopyToClipboard(
                          `${brokerage.toUpperCase()}_CLIENT_SECRET=${creds.clientSecret}`,
                          `${brokerage}-client-secret`
                        )}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {copied === `${brokerage}-client-secret` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Redirect URI
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                        {brokerage.toUpperCase()}_REDIRECT_URI={creds.redirectUri || 'http://localhost:3010/api/auth/brokerage/callback'}
                      </code>
                      <button
                        onClick={() => handleCopyToClipboard(
                          `${brokerage.toUpperCase()}_REDIRECT_URI=${creds.redirectUri}`,
                          `${brokerage}-redirect-uri`
                        )}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {copied === `${brokerage}-redirect-uri` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Setup Instructions</h4>
                  <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Create a developer account at {brokerage} developer portal</li>
                    <li>Register your application and get API credentials</li>
                    <li>Add the environment variables to your .env.local file</li>
                    <li>Restart your application</li>
                    <li>Test the connection using the button above</li>
                  </ol>
                  <div className="mt-3">
                    <a
                      href={`https://developer.${brokerage}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Visit Developer Portal
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Webhooks Tab */}
      {selectedTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Webhook Configuration
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Configure webhooks to receive real-time updates from brokerage APIs when account data changes.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Webhook Endpoint URL
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                    https://yourdomain.com/api/webhooks/brokerage
                  </code>
                  <button
                    onClick={() => handleCopyToClipboard(
                      'https://yourdomain.com/api/webhooks/brokerage',
                      'webhook-url'
                    )}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {copied === 'webhook-url' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Supported Webhook Events
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Account balance updates</li>
                  <li>• Position changes</li>
                  <li>• Transaction notifications</li>
                  <li>• Trade executions</li>
                  <li>• Dividend payments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealAPIManager; 