import { encrypt, decrypt } from './encryption';
import { BrokerageAccount, Position, Transaction, BrokerageProvider, SyncResult } from './brokerageIntegration';

interface RealAPICredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  sandbox?: boolean;
}

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scope: string[];
}

// Real API configurations for production brokerages
export const REAL_API_CONFIGS: Record<BrokerageProvider, RealAPICredentials & { enabled: boolean }> = {
  robinhood: {
    clientId: process.env.ROBINHOOD_CLIENT_ID || '',
    clientSecret: process.env.ROBINHOOD_CLIENT_SECRET || '',
    redirectUri: process.env.ROBINHOOD_REDIRECT_URI || '',
    enabled: !!(process.env.ROBINHOOD_CLIENT_ID && process.env.ROBINHOOD_CLIENT_SECRET),
    sandbox: process.env.NODE_ENV !== 'production'
  },
  fidelity: {
    clientId: process.env.FIDELITY_CLIENT_ID || '',
    clientSecret: process.env.FIDELITY_CLIENT_SECRET || '',
    redirectUri: process.env.FIDELITY_REDIRECT_URI || '',
    enabled: !!(process.env.FIDELITY_CLIENT_ID && process.env.FIDELITY_CLIENT_SECRET),
    sandbox: process.env.NODE_ENV !== 'production'
  },
  schwab: {
    clientId: process.env.SCHWAB_CLIENT_ID || '',
    clientSecret: process.env.SCHWAB_CLIENT_SECRET || '',
    redirectUri: process.env.SCHWAB_REDIRECT_URI || '',
    enabled: !!(process.env.SCHWAB_CLIENT_ID && process.env.SCHWAB_CLIENT_SECRET),
    sandbox: process.env.NODE_ENV !== 'production'
  },
  tdameritrade: {
    clientId: process.env.TD_AMERITRADE_CLIENT_ID || '',
    clientSecret: process.env.TD_AMERITRADE_CLIENT_SECRET || '',
    redirectUri: process.env.TD_AMERITRADE_REDIRECT_URI || '',
    enabled: !!(process.env.TD_AMERITRADE_CLIENT_ID && process.env.TD_AMERITRADE_CLIENT_SECRET),
    sandbox: process.env.NODE_ENV !== 'production'
  },
  etrade: {
    clientId: process.env.ETRADE_CLIENT_ID || '',
    clientSecret: process.env.ETRADE_CLIENT_SECRET || '',
    redirectUri: process.env.ETRADE_REDIRECT_URI || '',
    enabled: !!(process.env.ETRADE_CLIENT_ID && process.env.ETRADE_CLIENT_SECRET),
    sandbox: process.env.NODE_ENV !== 'production'
  },
  interactivebrokers: {
    clientId: process.env.IB_CLIENT_ID || '',
    clientSecret: process.env.IB_CLIENT_SECRET || '',
    redirectUri: process.env.IB_REDIRECT_URI || '',
    enabled: !!(process.env.IB_CLIENT_ID && process.env.IB_CLIENT_SECRET),
    sandbox: process.env.NODE_ENV !== 'production'
  },
  webull: {
    clientId: process.env.WEBULL_CLIENT_ID || '',
    clientSecret: process.env.WEBULL_CLIENT_SECRET || '',
    redirectUri: process.env.WEBULL_REDIRECT_URI || '',
    enabled: !!(process.env.WEBULL_CLIENT_ID && process.env.WEBULL_CLIENT_SECRET),
    sandbox: process.env.NODE_ENV !== 'production'
  },
  alpaca: {
    clientId: process.env.ALPACA_CLIENT_ID || '',
    clientSecret: process.env.ALPACA_CLIENT_SECRET || '',
    redirectUri: process.env.ALPACA_REDIRECT_URI || '',
    enabled: !!(process.env.ALPACA_CLIENT_ID && process.env.ALPACA_CLIENT_SECRET),
    sandbox: process.env.NODE_ENV !== 'production'
  }
};

// Real API implementation for each brokerage
class RealBrokerageService {
  private cache = new Map<string, { data: any; expiresAt: Date }>();

  /**
   * Schwab API Implementation
   */
  async schwabGetAccounts(accessToken: string): Promise<BrokerageAccount[]> {
    const baseUrl = REAL_API_CONFIGS.schwab.sandbox 
      ? 'https://api.schwabapi.com/trader/v1' 
      : 'https://api.schwabapi.com/trader/v1';

    const response = await fetch(`${baseUrl}/accounts`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Schwab API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.map((account: any) => ({
      id: account.securitiesAccount.accountNumber,
      brokerage: 'schwab' as BrokerageProvider,
      accountNumber: `****${account.securitiesAccount.accountNumber.slice(-4)}`,
      accountName: account.securitiesAccount.type,
      accountType: this.mapSchwabAccountType(account.securitiesAccount.type),
      totalValue: account.securitiesAccount.currentBalances.liquidationValue || 0,
      availableCash: account.securitiesAccount.currentBalances.availableFunds || 0,
      isActive: true,
      lastSyncAt: new Date(),
      createdAt: new Date()
    }));
  }

  async schwabGetPositions(accessToken: string, accountId: string): Promise<Position[]> {
    const baseUrl = REAL_API_CONFIGS.schwab.sandbox 
      ? 'https://api.schwabapi.com/trader/v1' 
      : 'https://api.schwabapi.com/trader/v1';

    const response = await fetch(`${baseUrl}/accounts/${accountId}/positions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Schwab positions API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.securitiesAccount.positions.map((position: any) => ({
      id: `${accountId}-${position.instrument.symbol}`,
      accountId,
      symbol: position.instrument.symbol,
      quantity: position.longQuantity || position.shortQuantity || 0,
      averageCost: position.averagePrice || 0,
      currentPrice: position.marketValue / (position.longQuantity || 1),
      marketValue: position.marketValue || 0,
      unrealizedGain: (position.marketValue || 0) - (position.averagePrice || 0) * (position.longQuantity || 0),
      unrealizedGainPercent: position.averagePrice 
        ? ((position.marketValue / (position.longQuantity || 1)) - position.averagePrice) / position.averagePrice * 100
        : 0,
      dayChange: position.currentDayProfitLoss || 0,
      dayChangePercent: position.currentDayProfitLossPercentage || 0,
      updatedAt: new Date()
    }));
  }

  /**
   * TD Ameritrade API Implementation
   */
  async tdAmeritradeGetAccounts(accessToken: string): Promise<BrokerageAccount[]> {
    const baseUrl = 'https://api.tdameritrade.com/v1';

    const response = await fetch(`${baseUrl}/accounts`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`TD Ameritrade API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((account: any) => ({
      id: account.securitiesAccount.accountId,
      brokerage: 'tdameritrade' as BrokerageProvider,
      accountNumber: `****${account.securitiesAccount.accountId.slice(-4)}`,
      accountName: account.securitiesAccount.type,
      accountType: this.mapTDAccountType(account.securitiesAccount.type),
      totalValue: account.securitiesAccount.currentBalances.liquidationValue || 0,
      availableCash: account.securitiesAccount.currentBalances.availableFunds || 0,
      isActive: true,
      lastSyncAt: new Date(),
      createdAt: new Date()
    }));
  }

  /**
   * Alpaca API Implementation (Paper Trading for Testing)
   */
  async alpacaGetAccount(accessToken: string): Promise<BrokerageAccount> {
    const baseUrl = REAL_API_CONFIGS.alpaca.sandbox 
      ? 'https://paper-api.alpaca.markets/v2' 
      : 'https://api.alpaca.markets/v2';

    const response = await fetch(`${baseUrl}/account`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.status}`);
    }

    const account = await response.json();
    
    return {
      id: account.id,
      brokerage: 'alpaca',
      accountNumber: `****${account.account_number.slice(-4)}`,
      accountName: 'Paper Trading Account',
      accountType: 'individual',
      totalValue: parseFloat(account.equity || '0'),
      availableCash: parseFloat(account.cash || '0'),
      isActive: account.trading_blocked === false,
      lastSyncAt: new Date(),
      createdAt: new Date(account.created_at)
    };
  }

  async alpacaGetPositions(accessToken: string): Promise<Position[]> {
    const baseUrl = REAL_API_CONFIGS.alpaca.sandbox 
      ? 'https://paper-api.alpaca.markets/v2' 
      : 'https://api.alpaca.markets/v2';

    const response = await fetch(`${baseUrl}/positions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Alpaca positions API error: ${response.status}`);
    }

    const positions = await response.json();
    
    return positions.map((position: any) => ({
      id: `alpaca-${position.symbol}`,
      accountId: 'alpaca-account',
      symbol: position.symbol,
      quantity: parseFloat(position.qty),
      averageCost: parseFloat(position.avg_entry_price),
      currentPrice: parseFloat(position.market_value) / parseFloat(position.qty),
      marketValue: parseFloat(position.market_value),
      unrealizedGain: parseFloat(position.unrealized_pl),
      unrealizedGainPercent: parseFloat(position.unrealized_plpc) * 100,
      dayChange: parseFloat(position.unrealized_intraday_pl || '0'),
      dayChangePercent: parseFloat(position.unrealized_intraday_plpc || '0') * 100,
      updatedAt: new Date()
    }));
  }

  /**
   * Interactive Brokers API Implementation
   */
  async ibGetAccounts(accessToken: string): Promise<BrokerageAccount[]> {
    // IB uses a different authentication model (requires local gateway)
    // This is a simplified example - real implementation would use IB Gateway/TWS
    const baseUrl = 'https://localhost:5000/v1/api'; // IB Gateway URL

    try {
      const response = await fetch(`${baseUrl}/portfolio/accounts`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`IB API error: ${response.status}`);
      }

      const accounts = await response.json();
      
      return accounts.map((accountId: string) => ({
        id: accountId,
        brokerage: 'interactivebrokers' as BrokerageProvider,
        accountNumber: `****${accountId.slice(-4)}`,
        accountName: 'IB Account',
        accountType: 'individual',
        totalValue: 0, // Would need separate API call
        availableCash: 0, // Would need separate API call
        isActive: true,
        lastSyncAt: new Date(),
        createdAt: new Date()
      }));
    } catch (error) {
      console.error('IB API connection failed:', error);
      // Return demo data if IB Gateway not available
      return [];
    }
  }

  /**
   * Utility methods for account type mapping
   */
  private mapSchwabAccountType(type: string): BrokerageAccount['accountType'] {
    const typeMap: Record<string, BrokerageAccount['accountType']> = {
      'CASH': 'individual',
      'MARGIN': 'individual',
      'IRA': 'ira',
      'ROTH_IRA': 'roth_ira',
      'SIMPLE_IRA': 'ira',
      'SEP_IRA': 'ira'
    };
    return typeMap[type] || 'individual';
  }

  private mapTDAccountType(type: string): BrokerageAccount['accountType'] {
    const typeMap: Record<string, BrokerageAccount['accountType']> = {
      'CASH': 'individual',
      'MARGIN': 'individual',
      'IRA': 'ira',
      'ROTH': 'roth_ira'
    };
    return typeMap[type] || 'individual';
  }

  /**
   * Generic sync method that calls appropriate broker API
   */
  async syncAccount(brokerage: BrokerageProvider, accessToken: string, accountId?: string): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      accountsUpdated: 0,
      positionsUpdated: 0,
      transactionsAdded: 0,
      errors: [],
      lastSyncAt: new Date()
    };

    try {
      switch (brokerage) {
        case 'schwab':
          const schwabAccounts = await this.schwabGetAccounts(accessToken);
          result.accountsUpdated = schwabAccounts.length;
          
          for (const account of schwabAccounts) {
            const positions = await this.schwabGetPositions(accessToken, account.id);
            result.positionsUpdated += positions.length;
          }
          break;

        case 'tdameritrade':
          const tdAccounts = await this.tdAmeritradeGetAccounts(accessToken);
          result.accountsUpdated = tdAccounts.length;
          break;

        case 'alpaca':
          const alpacaAccount = await this.alpacaGetAccount(accessToken);
          const alpacaPositions = await this.alpacaGetPositions(accessToken);
          result.accountsUpdated = 1;
          result.positionsUpdated = alpacaPositions.length;
          break;

        case 'interactivebrokers':
          const ibAccounts = await this.ibGetAccounts(accessToken);
          result.accountsUpdated = ibAccounts.length;
          break;

        default:
          throw new Error(`Sync not implemented for ${brokerage}`);
      }

      result.success = true;
      console.log(`Successfully synced ${brokerage}:`, result);

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown sync error');
      console.error(`Sync failed for ${brokerage}:`, error);
    }

    return result;
  }

  /**
   * Refresh expired access token
   */
  async refreshToken(brokerage: BrokerageProvider, refreshToken: string): Promise<TokenData> {
    const config = REAL_API_CONFIGS[brokerage];
    
    if (!config.enabled) {
      throw new Error(`${brokerage} API not configured`);
    }

    const baseUrl = this.getTokenUrl(brokerage);
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + (data.expires_in * 1000)),
      scope: data.scope ? data.scope.split(' ') : []
    };
  }

  private getTokenUrl(brokerage: BrokerageProvider): string {
    const urls: Record<BrokerageProvider, string> = {
      schwab: 'https://api.schwabapi.com/oauth/token',
      tdameritrade: 'https://api.tdameritrade.com/v1/oauth2/token',
      alpaca: 'https://api.alpaca.markets/oauth/token',
      robinhood: 'https://api.robinhood.com/oauth/token/',
      fidelity: 'https://api.fidelity.com/oauth/token',
      etrade: 'https://api.etrade.com/oauth/access_token',
      interactivebrokers: '', // IB uses different auth
      webull: 'https://api.webull.com/oauth/token'
    };
    return urls[brokerage];
  }

  /**
   * Check if API credentials are configured for a brokerage
   */
  isConfigured(brokerage: BrokerageProvider): boolean {
    return REAL_API_CONFIGS[brokerage].enabled;
  }

  /**
   * Get list of enabled brokerages
   */
  getEnabledBrokerages(): BrokerageProvider[] {
    return Object.entries(REAL_API_CONFIGS)
      .filter(([_, config]) => config.enabled)
      .map(([brokerage]) => brokerage as BrokerageProvider);
  }

  /**
   * Test API connection
   */
  async testConnection(brokerage: BrokerageProvider, accessToken: string): Promise<boolean> {
    try {
      switch (brokerage) {
        case 'schwab':
          await this.schwabGetAccounts(accessToken);
          return true;
        case 'tdameritrade':
          await this.tdAmeritradeGetAccounts(accessToken);
          return true;
        case 'alpaca':
          await this.alpacaGetAccount(accessToken);
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error(`Connection test failed for ${brokerage}:`, error);
      return false;
    }
  }
}

export const realBrokerageService = new RealBrokerageService(); 