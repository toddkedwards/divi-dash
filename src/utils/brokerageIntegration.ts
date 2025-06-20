import { encrypt, decrypt } from './encryption';

export interface BrokerageAccount {
  id: string;
  brokerage: BrokerageProvider;
  accountNumber: string;
  accountName: string;
  accountType: 'individual' | 'joint' | 'ira' | '401k' | 'roth_ira';
  totalValue: number;
  availableCash: number;
  isActive: boolean;
  lastSyncAt: Date;
  createdAt: Date;
}

export interface Position {
  id: string;
  accountId: string;
  symbol: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  symbol: string;
  type: 'buy' | 'sell' | 'dividend' | 'interest' | 'transfer' | 'fee';
  quantity: number;
  price: number;
  amount: number;
  fees: number;
  date: Date;
  description: string;
  brokerageTransactionId: string;
}

export type BrokerageProvider = 
  | 'robinhood' 
  | 'fidelity' 
  | 'schwab' 
  | 'tdameritrade'
  | 'etrade'
  | 'interactivebrokers'
  | 'webull'
  | 'alpaca';

export interface BrokerageConfig {
  name: string;
  displayName: string;
  authType: 'oauth2' | 'api_key' | 'screen_scraping';
  authUrl?: string;
  tokenUrl?: string;
  apiBaseUrl?: string;
  scopes?: string[];
  clientId?: string;
  isEnabled: boolean;
  features: {
    positions: boolean;
    transactions: boolean;
    realTimeQuotes: boolean;
    placeOrders: boolean;
  };
}

// Brokerage configurations
export const BROKERAGE_CONFIGS: Record<BrokerageProvider, BrokerageConfig> = {
  robinhood: {
    name: 'robinhood',
    displayName: 'Robinhood',
    authType: 'oauth2',
    authUrl: 'https://api.robinhood.com/oauth/authorize/',
    tokenUrl: 'https://api.robinhood.com/oauth/token/',
    apiBaseUrl: 'https://api.robinhood.com',
    scopes: ['read'],
    isEnabled: true,
    features: {
      positions: true,
      transactions: true,
      realTimeQuotes: true,
      placeOrders: false
    }
  },
  fidelity: {
    name: 'fidelity',
    displayName: 'Fidelity',
    authType: 'oauth2',
    authUrl: 'https://api.fidelity.com/oauth/authorize',
    tokenUrl: 'https://api.fidelity.com/oauth/token',
    apiBaseUrl: 'https://api.fidelity.com/v1',
    scopes: ['accounts', 'positions', 'transactions'],
    isEnabled: true,
    features: {
      positions: true,
      transactions: true,
      realTimeQuotes: true,
      placeOrders: false
    }
  },
  schwab: {
    name: 'schwab',
    displayName: 'Charles Schwab',
    authType: 'oauth2',
    authUrl: 'https://api.schwabapi.com/oauth/authorize',
    tokenUrl: 'https://api.schwabapi.com/oauth/token',
    apiBaseUrl: 'https://api.schwabapi.com/v1',
    scopes: ['AccountsAndTrading'],
    isEnabled: true,
    features: {
      positions: true,
      transactions: true,
      realTimeQuotes: true,
      placeOrders: false
    }
  },
  tdameritrade: {
    name: 'tdameritrade',
    displayName: 'TD Ameritrade',
    authType: 'oauth2',
    authUrl: 'https://auth.tdameritrade.com/auth',
    tokenUrl: 'https://api.tdameritrade.com/v1/oauth2/token',
    apiBaseUrl: 'https://api.tdameritrade.com/v1',
    scopes: ['read'],
    isEnabled: true,
    features: {
      positions: true,
      transactions: true,
      realTimeQuotes: true,
      placeOrders: false
    }
  },
  etrade: {
    name: 'etrade',
    displayName: 'E*TRADE',
    authType: 'oauth2',
    authUrl: 'https://api.etrade.com/oauth/authorize',
    tokenUrl: 'https://api.etrade.com/oauth/access_token',
    apiBaseUrl: 'https://api.etrade.com/v1',
    isEnabled: true,
    features: {
      positions: true,
      transactions: true,
      realTimeQuotes: false,
      placeOrders: false
    }
  },
  interactivebrokers: {
    name: 'interactivebrokers',
    displayName: 'Interactive Brokers',
    authType: 'api_key',
    apiBaseUrl: 'https://api.ibkr.com/v1',
    isEnabled: true,
    features: {
      positions: true,
      transactions: true,
      realTimeQuotes: true,
      placeOrders: false
    }
  },
  webull: {
    name: 'webull',
    displayName: 'Webull',
    authType: 'oauth2',
    authUrl: 'https://api.webull.com/oauth/authorize',
    tokenUrl: 'https://api.webull.com/oauth/token',
    apiBaseUrl: 'https://api.webull.com/v1',
    isEnabled: true,
    features: {
      positions: true,
      transactions: true,
      realTimeQuotes: true,
      placeOrders: false
    }
  },
  alpaca: {
    name: 'alpaca',
    displayName: 'Alpaca',
    authType: 'api_key',
    apiBaseUrl: 'https://paper-api.alpaca.markets/v2',
    isEnabled: true,
    features: {
      positions: true,
      transactions: true,
      realTimeQuotes: true,
      placeOrders: true
    }
  }
};

export interface SyncResult {
  success: boolean;
  accountsUpdated: number;
  positionsUpdated: number;
  transactionsAdded: number;
  errors: string[];
  lastSyncAt: Date;
}

class BrokerageIntegrationService {
  private cache = new Map<string, any>();
  private syncInProgress = new Set<string>();

  /**
   * Get OAuth authorization URL for a brokerage
   */
  getAuthUrl(brokerage: BrokerageProvider, redirectUri: string, state: string): string {
    const config = BROKERAGE_CONFIGS[brokerage];
    
    if (!config.authUrl) {
      throw new Error(`${config.displayName} does not support OAuth authentication`);
    }

    const params = new URLSearchParams({
      client_id: config.clientId || process.env[`${brokerage.toUpperCase()}_CLIENT_ID`] || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: config.scopes?.join(' ') || '',
      state
    });

    return `${config.authUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    brokerage: BrokerageProvider, 
    code: string, 
    redirectUri: string
  ): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }> {
    const config = BROKERAGE_CONFIGS[brokerage];
    
    if (!config.tokenUrl) {
      throw new Error(`${config.displayName} does not support OAuth token exchange`);
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env[`${brokerage.toUpperCase()}_CLIENT_ID`]}:${process.env[`${brokerage.toUpperCase()}_CLIENT_SECRET`]}`
        ).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code for token: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    };
  }

  /**
   * Sync all accounts for a user
   */
  async syncUserAccounts(userId: string): Promise<SyncResult> {
    // Get user's connected accounts from database
    const connectedAccounts = await this.getUserConnectedAccounts(userId);
    
    const result: SyncResult = {
      success: true,
      accountsUpdated: 0,
      positionsUpdated: 0,
      transactionsAdded: 0,
      errors: [],
      lastSyncAt: new Date()
    };

    for (const account of connectedAccounts) {
      if (this.syncInProgress.has(account.id)) {
        continue; // Skip if sync already in progress
      }

      try {
        this.syncInProgress.add(account.id);
        const accountResult = await this.syncAccount(account);
        
        result.accountsUpdated += accountResult.accountsUpdated;
        result.positionsUpdated += accountResult.positionsUpdated;
        result.transactionsAdded += accountResult.transactionsAdded;
        result.errors.push(...accountResult.errors);
        
      } catch (error) {
        result.errors.push(`Account ${account.accountNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        result.success = false;
      } finally {
        this.syncInProgress.delete(account.id);
      }
    }

    return result;
  }

  /**
   * Sync individual account
   */
  private async syncAccount(account: BrokerageAccount): Promise<SyncResult> {
    const adapter = this.getBrokerageAdapter(account.brokerage);
    const result: SyncResult = {
      success: true,
      accountsUpdated: 0,
      positionsUpdated: 0,
      transactionsAdded: 0,
      errors: [],
      lastSyncAt: new Date()
    };

    try {
      // Sync account info
      const accountInfo = await adapter.getAccountInfo(account.id);
      await this.updateAccountInfo(account.id, accountInfo);
      result.accountsUpdated = 1;

      // Sync positions
      const positions = await adapter.getPositions(account.id);
      const positionsUpdated = await this.updatePositions(account.id, positions);
      result.positionsUpdated = positionsUpdated;

      // Sync recent transactions
      const transactions = await adapter.getTransactions(account.id, account.lastSyncAt);
      const transactionsAdded = await this.addTransactions(account.id, transactions);
      result.transactionsAdded = transactionsAdded;

      // Update last sync time
      await this.updateAccountLastSync(account.id, result.lastSyncAt);

    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    return result;
  }

  /**
   * Get brokerage adapter for API calls
   */
  private getBrokerageAdapter(brokerage: BrokerageProvider) {
    switch (brokerage) {
      case 'robinhood':
        return new RobinhoodAdapter();
      case 'fidelity':
        return new FidelityAdapter();
      case 'schwab':
        return new SchwabAdapter();
      case 'tdameritrade':
        return new TDAmeritradeAdapter();
      case 'alpaca':
        return new AlpacaAdapter();
      default:
        throw new Error(`Unsupported brokerage: ${brokerage}`);
    }
  }

  /**
   * Get user's connected accounts (placeholder - would query database)
   */
  private async getUserConnectedAccounts(userId: string): Promise<BrokerageAccount[]> {
    // This would query your database for user's connected accounts
    // For demo purposes, return sample data
    return [
      {
        id: '1',
        brokerage: 'robinhood',
        accountNumber: '****1234',
        accountName: 'Individual Taxable',
        accountType: 'individual',
        totalValue: 25000,
        availableCash: 2500,
        isActive: true,
        lastSyncAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        brokerage: 'fidelity',
        accountNumber: '****5678',
        accountName: 'Roth IRA',
        accountType: 'roth_ira',
        totalValue: 15000,
        availableCash: 1000,
        isActive: true,
        lastSyncAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        createdAt: new Date('2024-02-01')
      }
    ];
  }

  /**
   * Update account information
   */
  private async updateAccountInfo(accountId: string, accountInfo: Partial<BrokerageAccount>) {
    // Update account in database
    console.log(`Updating account ${accountId}:`, accountInfo);
  }

  /**
   * Update positions for account
   */
  private async updatePositions(accountId: string, positions: Position[]): Promise<number> {
    // Update positions in database
    console.log(`Updating ${positions.length} positions for account ${accountId}`);
    return positions.length;
  }

  /**
   * Add new transactions
   */
  private async addTransactions(accountId: string, transactions: Transaction[]): Promise<number> {
    // Add transactions to database
    console.log(`Adding ${transactions.length} transactions for account ${accountId}`);
    return transactions.length;
  }

  /**
   * Update account last sync time
   */
  private async updateAccountLastSync(accountId: string, lastSyncAt: Date) {
    // Update last sync time in database
    console.log(`Updated last sync time for account ${accountId}: ${lastSyncAt}`);
  }

  /**
   * Test connection to brokerage
   */
  async testConnection(brokerage: BrokerageProvider, accessToken: string): Promise<boolean> {
    try {
      const adapter = this.getBrokerageAdapter(brokerage);
      await adapter.testConnection(accessToken);
      return true;
    } catch (error) {
      console.error(`Connection test failed for ${brokerage}:`, error);
      return false;
    }
  }

  /**
   * Get available brokerages
   */
  getAvailableBrokerages(): BrokerageConfig[] {
    return Object.values(BROKERAGE_CONFIGS).filter(config => config.isEnabled);
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(brokerage: BrokerageProvider, refreshToken: string): Promise<string> {
    const config = BROKERAGE_CONFIGS[brokerage];
    
    if (!config.tokenUrl) {
      throw new Error(`${config.displayName} does not support token refresh`);
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env[`${brokerage.toUpperCase()}_CLIENT_ID`]}:${process.env[`${brokerage.toUpperCase()}_CLIENT_SECRET`]}`
        ).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Generate sample portfolio data for demo
   */
  generateSamplePortfolioData(brokerage: BrokerageProvider): { positions: Position[], transactions: Transaction[] } {
    const accountId = '1';
    const baseDate = new Date();
    
    const positions: Position[] = [
      {
        id: '1',
        accountId,
        symbol: 'AAPL',
        quantity: 10,
        averageCost: 150.00,
        currentPrice: 175.00,
        marketValue: 1750.00,
        unrealizedGain: 250.00,
        unrealizedGainPercent: 16.67,
        dayChange: 5.00,
        dayChangePercent: 2.94,
        updatedAt: baseDate
      },
      {
        id: '2',
        accountId,
        symbol: 'MSFT',
        quantity: 5,
        averageCost: 300.00,
        currentPrice: 350.00,
        marketValue: 1750.00,
        unrealizedGain: 250.00,
        unrealizedGainPercent: 16.67,
        dayChange: -2.50,
        dayChangePercent: -0.71,
        updatedAt: baseDate
      },
      {
        id: '3',
        accountId,
        symbol: 'KO',
        quantity: 25,
        averageCost: 55.00,
        currentPrice: 58.00,
        marketValue: 1450.00,
        unrealizedGain: 75.00,
        unrealizedGainPercent: 5.45,
        dayChange: 0.50,
        dayChangePercent: 0.87,
        updatedAt: baseDate
      }
    ];

    const transactions: Transaction[] = [
      {
        id: '1',
        accountId,
        symbol: 'AAPL',
        type: 'buy',
        quantity: 10,
        price: 150.00,
        amount: 1500.00,
        fees: 0.00,
        date: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        description: 'Bought 10 shares of AAPL',
        brokerageTransactionId: 'RH123456'
      },
      {
        id: '2',
        accountId,
        symbol: 'AAPL',
        type: 'dividend',
        quantity: 10,
        price: 0.24,
        amount: 2.40,
        fees: 0.00,
        date: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        description: 'Dividend payment from AAPL',
        brokerageTransactionId: 'RH123457'
      },
      {
        id: '3',
        accountId,
        symbol: 'KO',
        type: 'buy',
        quantity: 25,
        price: 55.00,
        amount: 1375.00,
        fees: 0.00,
        date: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000),
        description: 'Bought 25 shares of KO',
        brokerageTransactionId: 'RH123458'
      }
    ];

    return { positions, transactions };
  }
}

// Base adapter interface
interface BrokerageAdapter {
  getAccountInfo(accountId: string): Promise<Partial<BrokerageAccount>>;
  getPositions(accountId: string): Promise<Position[]>;
  getTransactions(accountId: string, since: Date): Promise<Transaction[]>;
  testConnection(accessToken: string): Promise<void>;
}

// Robinhood adapter implementation
class RobinhoodAdapter implements BrokerageAdapter {
  async getAccountInfo(accountId: string): Promise<Partial<BrokerageAccount>> {
    // Implementation would make API calls to Robinhood
    return {
      totalValue: 50000,
      availableCash: 5000
    };
  }

  async getPositions(accountId: string): Promise<Position[]> {
    // Implementation would fetch positions from Robinhood API
    // For demo, return sample data
    return brokerageIntegration.generateSamplePortfolioData('robinhood').positions;
  }

  async getTransactions(accountId: string, since: Date): Promise<Transaction[]> {
    // Implementation would fetch transactions from Robinhood API
    // For demo, return sample data
    return brokerageIntegration.generateSamplePortfolioData('robinhood').transactions;
  }

  async testConnection(accessToken: string): Promise<void> {
    // Test API connection
    // In a real implementation, this would make an API call
    console.log('Testing Robinhood connection...');
  }
}

// Fidelity adapter implementation
class FidelityAdapter implements BrokerageAdapter {
  async getAccountInfo(accountId: string): Promise<Partial<BrokerageAccount>> {
    return { totalValue: 75000, availableCash: 7500 };
  }

  async getPositions(accountId: string): Promise<Position[]> {
    return [];
  }

  async getTransactions(accountId: string, since: Date): Promise<Transaction[]> {
    return [];
  }

  async testConnection(accessToken: string): Promise<void> {
    console.log('Testing Fidelity connection...');
  }
}

// Schwab adapter implementation
class SchwabAdapter implements BrokerageAdapter {
  async getAccountInfo(accountId: string): Promise<Partial<BrokerageAccount>> {
    return { totalValue: 100000, availableCash: 10000 };
  }

  async getPositions(accountId: string): Promise<Position[]> {
    return [];
  }

  async getTransactions(accountId: string, since: Date): Promise<Transaction[]> {
    return [];
  }

  async testConnection(accessToken: string): Promise<void> {
    console.log('Testing Schwab connection...');
  }
}

// TD Ameritrade adapter implementation
class TDAmeritradeAdapter implements BrokerageAdapter {
  async getAccountInfo(accountId: string): Promise<Partial<BrokerageAccount>> {
    return { totalValue: 60000, availableCash: 6000 };
  }

  async getPositions(accountId: string): Promise<Position[]> {
    return [];
  }

  async getTransactions(accountId: string, since: Date): Promise<Transaction[]> {
    return [];
  }

  async testConnection(accessToken: string): Promise<void> {
    console.log('Testing TD Ameritrade connection...');
  }
}

// Alpaca adapter implementation
class AlpacaAdapter implements BrokerageAdapter {
  async getAccountInfo(accountId: string): Promise<Partial<BrokerageAccount>> {
    return { totalValue: 25000, availableCash: 2500 };
  }

  async getPositions(accountId: string): Promise<Position[]> {
    return [];
  }

  async getTransactions(accountId: string, since: Date): Promise<Transaction[]> {
    return [];
  }

  async testConnection(accessToken: string): Promise<void> {
    console.log('Testing Alpaca connection...');
  }
}

export const brokerageIntegration = new BrokerageIntegrationService(); 