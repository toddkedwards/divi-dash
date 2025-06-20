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
  Check,
  Zap,
  Globe
  } from 'lucide-react';

interface APICredential {
  name: string;
  envVar: string;
  description: string;
  value?: string;
  isSecret?: boolean;
}

interface BrokerageConfig {
  name: string;
  displayName: string;
  credentials: APICredential[];
  status: 'configured' | 'partial' | 'missing';
  testResult?: 'success' | 'failed' | 'testing';
  docsUrl?: string;
  devPortalUrl?: string;
}

interface RealAPIManagerProps {
  userId: string;
}

const RealAPIManager: React.FC<RealAPIManagerProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'webhooks'>('overview');
  const [showSecrets, setShowSecrets] = useState(false);
  const [testingBrokerage, setTestingBrokerage] = useState<string | null>(null);
  const [brokerageConfigs, setBrokerageConfigs] = useState<BrokerageConfig[]>([]);

  // Initialize brokerage configurations
  useEffect(() => {
    const configs: BrokerageConfig[] = [
      {
        name: 'schwab',
        displayName: 'Charles Schwab',
        credentials: [
          {
            name: 'Client ID',
            envVar: 'SCHWAB_CLIENT_ID',
            description: 'Your Schwab API client ID from developer portal',
            value: process.env.NEXT_PUBLIC_SCHWAB_CLIENT_ID || '',
            isSecret: false
          },
          {
            name: 'Client Secret',
            envVar: 'SCHWAB_CLIENT_SECRET',
            description: 'Your Schwab API client secret (keep private)',
            value: '••••••••',
            isSecret: true
          },
          {
            name: 'Redirect URI',
            envVar: 'SCHWAB_REDIRECT_URI',
            description: 'OAuth callback URL registered with Schwab',
            value: `${window?.location?.origin}/api/auth/brokerage/callback?brokerage=schwab`,
            isSecret: false
          }
        ],
        status: 'missing',
        docsUrl: 'https://developer.schwab.com/products/trader-api--individual',
        devPortalUrl: 'https://developer.schwab.com/'
      },
      {
        name: 'tdameritrade',
        displayName: 'TD Ameritrade',
        credentials: [
          {
            name: 'Client ID',
            envVar: 'TD_AMERITRADE_CLIENT_ID',
            description: 'Your TD Ameritrade API client ID',
            value: process.env.NEXT_PUBLIC_TD_AMERITRADE_CLIENT_ID || '',
            isSecret: false
          },
          {
            name: 'Redirect URI',
            envVar: 'TD_AMERITRADE_REDIRECT_URI',
            description: 'OAuth callback URL registered with TD Ameritrade',
            value: `${window?.location?.origin}/api/auth/brokerage/callback?brokerage=tdameritrade`,
            isSecret: false
          }
        ],
        status: 'missing',
        docsUrl: 'https://developer.tdameritrade.com/apis',
        devPortalUrl: 'https://developer.tdameritrade.com/'
      },
      {
        name: 'alpaca',
        displayName: 'Alpaca',
        credentials: [
          {
            name: 'API Key ID',
            envVar: 'ALPACA_API_KEY',
            description: 'Your Alpaca API key ID',
            value: process.env.NEXT_PUBLIC_ALPACA_API_KEY || '',
            isSecret: false
          },
          {
            name: 'Secret Key',
            envVar: 'ALPACA_SECRET_KEY',
            description: 'Your Alpaca secret key (keep private)',
            value: '••••••••',
            isSecret: true
          },
          {
            name: 'Environment',
            envVar: 'ALPACA_SANDBOX',
            description: 'Set to "true" for paper trading',
            value: process.env.NEXT_PUBLIC_ALPACA_SANDBOX || 'true',
            isSecret: false
          }
        ],
        status: 'missing',
        docsUrl: 'https://alpaca.markets/docs/api-references/trading-api/',
        devPortalUrl: 'https://app.alpaca.markets/'
      },
      {
        name: 'interactivebrokers',
        displayName: 'Interactive Brokers',
        credentials: [
          {
            name: 'Client ID',
            envVar: 'INTERACTIVE_BROKERS_CLIENT_ID',
            description: 'Your IB API client ID',
            value: process.env.NEXT_PUBLIC_INTERACTIVE_BROKERS_CLIENT_ID || '',
            isSecret: false
          },
          {
            name: 'Client Secret',
            envVar: 'INTERACTIVE_BROKERS_CLIENT_SECRET',
            description: 'Your IB API client secret (keep private)',
            value: '••••••••',
            isSecret: true
          }
        ],
        status: 'missing',
        docsUrl: 'https://interactivebrokers.github.io/cpwebapi/',
        devPortalUrl: 'https://www.interactivebrokers.com/en/trading/ib-api.php'
      }
    ];

    // Determine status for each brokerage
    configs.forEach(config => {
      const hasAllCredentials = config.credentials.every(cred => 
        cred.value && cred.value !== '' && cred.value !== '••••••••'
      );
      const hasSomeCredentials = config.credentials.some(cred => 
        cred.value && cred.value !== '' && cred.value !== '••••••••'
      );

      if (hasAllCredentials) {
        config.status = 'configured';
      } else if (hasSomeCredentials) {
        config.status = 'partial';
      } else {
        config.status = 'missing';
      }
    });

    setBrokerageConfigs(configs);
  }, []);

  const handleTestConnection = async (brokerage: string) => {
    setTestingBrokerage(brokerage);
    
    try {
      const response = await fetch('/api/brokerage/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ brokerage })
      });

      const result = await response.json();
      
      setBrokerageConfigs(prev => prev.map(config => 
        config.name === brokerage 
          ? { ...config, testResult: result.success ? 'success' : 'failed' }
          : config
      ));
    } catch (error) {
      console.error('Connection test failed:', error);
      setBrokerageConfigs(prev => prev.map(config => 
        config.name === brokerage 
          ? { ...config, testResult: 'failed' }
          : config
      ));
    } finally {
      setTestingBrokerage(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: BrokerageConfig['status']) => {
    switch (status) {
      case 'configured':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'missing':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getTestResultIcon = (result?: BrokerageConfig['testResult']) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Configured</p>
              <p className="text-2xl font-bold">
                {brokerageConfigs.filter(b => b.status === 'configured').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Partial</p>
              <p className="text-2xl font-bold">
                {brokerageConfigs.filter(b => b.status === 'partial').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Missing</p>
              <p className="text-2xl font-bold">
                {brokerageConfigs.filter(b => b.status === 'missing').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Brokerage API Status
        </h3>
        
        <div className="space-y-4">
          {brokerageConfigs.map((config) => (
            <div key={config.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(config.status)}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {config.displayName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {config.status === 'configured' ? 'Ready to use' :
                     config.status === 'partial' ? 'Partially configured' :
                     'Not configured'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getTestResultIcon(config.testResult)}
                
                <button
                  onClick={() => handleTestConnection(config.name)}
                  disabled={config.status !== 'configured' || testingBrokerage === config.name}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {testingBrokerage === config.name ? 'Testing...' : 'Test'}
                </button>
                
                <a
                  href={config.devPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCredentials = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              Security Notice
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              These credentials are used to connect to real brokerage APIs. Never share your secret keys or tokens. 
              Store them securely in environment variables.
            </p>
          </div>
        </div>
      </div>

      {brokerageConfigs.map((config) => (
        <div key={config.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(config.status)}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {config.displayName}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <a
                href={config.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href={config.devPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {config.credentials.map((credential) => (
              <div key={credential.envVar} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {credential.name}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {credential.description}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type={credential.isSecret && !showSecrets ? 'password' : 'text'}
                      value={credential.value}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <code className="text-xs text-gray-500 dark:text-gray-400">
                        {credential.envVar}
                      </code>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(credential.value || '')}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowSecrets(!showSecrets)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showSecrets ? 'Hide' : 'Show'} Secrets</span>
        </button>
      </div>
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Webhook Endpoints
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              OAuth Callback
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Used for OAuth authentication flow
            </p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm">
                {window?.location?.origin}/api/auth/brokerage/callback
              </code>
              <button
                onClick={() => copyToClipboard(`${window?.location?.origin}/api/auth/brokerage/callback`)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Sync Webhook
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              For real-time data synchronization
            </p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm">
                {window?.location?.origin}/api/brokerage/sync
              </code>
              <button
                onClick={() => copyToClipboard(`${window?.location?.origin}/api/brokerage/sync`)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900 dark:text-yellow-100">
              Setup Instructions
            </h3>
            <ol className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1 list-decimal list-inside">
              <li>Register these webhook URLs in your brokerage developer portal</li>
              <li>Ensure your domain is whitelisted for OAuth callbacks</li>
              <li>Test the endpoints after configuration</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Real API Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure and test real brokerage API integrations for production use
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <Settings className="w-4 h-4" /> },
            { id: 'credentials', label: 'API Credentials', icon: <Zap className="w-4 h-4" /> },
            { id: 'webhooks', label: 'Webhooks', icon: <Globe className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'credentials' && renderCredentials()}
      {activeTab === 'webhooks' && renderWebhooks()}
    </div>
  );
};

export default RealAPIManager; 