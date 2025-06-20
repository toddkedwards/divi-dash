import { encrypt, decrypt } from './encryption';

// Types for real brokerage integrations
export interface BrokerageCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiKey?: string;
  sandbox?: boolean;
}

export interface BrokerageToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  scope?: string;
}

export interface BrokerageAccount {
  accountId: string;
  accountType: string;
  accountName: string;
  totalValue: number;
  cashBalance: number;
  positions: BrokeragePosition[];
}

export interface BrokeragePosition {
  symbol: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
}

export interface BrokerageTransaction {
  id: string;
  date: string;
  type: string;
  symbol: string;
  quantity: number;
  price: number;
  amount: number;
  description: string;
}

// Real API implementations for different brokerages
export class RealBrokerageIntegration {
  private static instance: RealBrokerageIntegration;
  private tokens: Map<string, BrokerageToken> = new Map();

  static getInstance(): RealBrokerageIntegration {
    if (!RealBrokerageIntegration.instance) {
      RealBrokerageIntegration.instance = new RealBrokerageIntegration();
    }
    return RealBrokerageIntegration.instance;
  }

  // Get available brokerages based on environment variables
  getAvailableBrokerages(): string[] {
    const brokerages = [];
    if (process.env.SCHWAB_CLIENT_ID) brokerages.push('schwab');
    if (process.env.TD_AMERITRADE_CLIENT_ID) brokerages.push('tdameritrade');
    if (process.env.ALPACA_API_KEY) brokerages.push('alpaca');
    if (process.env.INTERACTIVE_BROKERS_CLIENT_ID) brokerages.push('interactivebrokers');
    return brokerages;
  }

  // Charles Schwab API Integration
  async connectSchwab(credentials: BrokerageCredentials): Promise<string> {
    const authUrl = `https://api.schwabapi.com/oauth/authorize?` +
      `client_id=${credentials.clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(credentials.redirectUri)}&` +
      `scope=read`;
    
    return authUrl;
  }

  async exchangeSchwabToken(code: string, credentials: BrokerageCredentials): Promise<BrokerageToken> {
    try {
      const response = await fetch('https://api.schwabapi.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: credentials.redirectUri
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Schwab token exchange failed: ${data.error_description}`);
      }

      const token: BrokerageToken = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
        scope: data.scope
      };

      this.tokens.set('schwab', token);
      return token;
    } catch (error) {
      console.error('Schwab token exchange error:', error);
      throw error;
    }
  }

  async getSchwabAccounts(token: BrokerageToken): Promise<BrokerageAccount[]> {
    try {
      const response = await fetch('https://api.schwabapi.com/trader/v1/accounts', {
        headers: {
          'Authorization': `Bearer ${token.accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Schwab API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((account: any) => ({
        accountId: account.accountId,
        accountType: account.type,
        accountName: account.accountName || `${account.type} Account`,
        totalValue: account.currentBalances?.liquidationValue || 0,
        cashBalance: account.currentBalances?.cashBalance || 0,
        positions: account.positions?.map((pos: any) => ({
          symbol: pos.symbol,
          quantity: pos.longQuantity || 0,
          averageCost: pos.averagePrice || 0,
          currentPrice: pos.marketValue / (pos.longQuantity || 1),
          marketValue: pos.marketValue || 0,
          unrealizedPnL: (pos.marketValue || 0) - ((pos.averagePrice || 0) * (pos.longQuantity || 0))
        })) || []
      }));
    } catch (error) {
      console.error('Schwab accounts error:', error);
      throw error;
    }
  }

  // TD Ameritrade API Integration
  async connectTDAmeritrade(credentials: BrokerageCredentials): Promise<string> {
    const authUrl = `https://auth.tdameritrade.com/auth?` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(credentials.redirectUri)}&` +
      `client_id=${credentials.clientId}@AMER.OAUTHAP`;
    
    return authUrl;
  }

  async exchangeTDAmeritradeToken(code: string, credentials: BrokerageCredentials): Promise<BrokerageToken> {
    try {
      const response = await fetch('https://api.tdameritrade.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          access_type: 'offline',
          code,
          client_id: credentials.clientId,
          redirect_uri: credentials.redirectUri
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`TD Ameritrade token exchange failed: ${data.error}`);
      }

      const token: BrokerageToken = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000)
      };

      this.tokens.set('tdameritrade', token);
      return token;
    } catch (error) {
      console.error('TD Ameritrade token exchange error:', error);
      throw error;
    }
  }

  async getTDAmeritradeAccounts(token: BrokerageToken): Promise<BrokerageAccount[]> {
    try {
      const response = await fetch('https://api.tdameritrade.com/v1/accounts?fields=positions', {
        headers: {
          'Authorization': `Bearer ${token.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`TD Ameritrade API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((account: any) => ({
        accountId: account.securitiesAccount.accountId,
        accountType: account.securitiesAccount.type,
        accountName: `${account.securitiesAccount.type} Account`,
        totalValue: account.securitiesAccount.currentBalances?.liquidationValue || 0,
        cashBalance: account.securitiesAccount.currentBalances?.cashBalance || 0,
        positions: account.securitiesAccount.positions?.map((pos: any) => ({
          symbol: pos.instrument.symbol,
          quantity: pos.longQuantity || 0,
          averageCost: pos.averagePrice || 0,
          currentPrice: pos.marketValue / (pos.longQuantity || 1),
          marketValue: pos.marketValue || 0,
          unrealizedPnL: (pos.marketValue || 0) - ((pos.averagePrice || 0) * (pos.longQuantity || 0))
        })) || []
      }));
    } catch (error) {
      console.error('TD Ameritrade accounts error:', error);
      throw error;
    }
  }

  // Alpaca API Integration
  async connectAlpaca(credentials: BrokerageCredentials): Promise<boolean> {
    try {
      const baseUrl = credentials.sandbox ? 'https://paper-api.alpaca.markets' : 'https://api.alpaca.markets';
      const response = await fetch(`${baseUrl}/v2/account`, {
        headers: {
          'APCA-API-KEY-ID': credentials.clientId,
          'APCA-API-SECRET-KEY': credentials.clientSecret
        }
      });

      if (response.ok) {
        // Alpaca uses API keys, so we store them as a "token"
        const token: BrokerageToken = {
          accessToken: credentials.clientId,
          refreshToken: credentials.clientSecret,
          expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // API keys don't expire
        };
        this.tokens.set('alpaca', token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Alpaca connection error:', error);
      return false;
    }
  }

  async getAlpacaAccounts(token: BrokerageToken): Promise<BrokerageAccount[]> {
    try {
      const baseUrl = process.env.ALPACA_SANDBOX === 'true' ? 'https://paper-api.alpaca.markets' : 'https://api.alpaca.markets';
      
      const [accountResponse, positionsResponse] = await Promise.all([
        fetch(`${baseUrl}/v2/account`, {
          headers: {
            'APCA-API-KEY-ID': token.accessToken,
            'APCA-API-SECRET-KEY': token.refreshToken!
          }
        }),
        fetch(`${baseUrl}/v2/positions`, {
          headers: {
            'APCA-API-KEY-ID': token.accessToken,
            'APCA-API-SECRET-KEY': token.refreshToken!
          }
        })
      ]);

      const account = await accountResponse.json();
      const positions = await positionsResponse.json();

      return [{
        accountId: account.account_number,
        accountType: account.account_blocked ? 'Restricted' : 'Trading',
        accountName: 'Alpaca Trading Account',
        totalValue: parseFloat(account.portfolio_value || '0'),
        cashBalance: parseFloat(account.cash || '0'),
        positions: positions.map((pos: any) => ({
          symbol: pos.symbol,
          quantity: parseFloat(pos.qty),
          averageCost: parseFloat(pos.avg_entry_price || '0'),
          currentPrice: parseFloat(pos.market_value) / parseFloat(pos.qty),
          marketValue: parseFloat(pos.market_value || '0'),
          unrealizedPnL: parseFloat(pos.unrealized_pl || '0')
        }))
      }];
    } catch (error) {
      console.error('Alpaca accounts error:', error);
      throw error;
    }
  }

  // Interactive Brokers API Integration
  async connectInteractiveBrokers(credentials: BrokerageCredentials): Promise<string> {
    // IB uses a different OAuth flow
    const authUrl = `https://api.ibkr.com/oauth/live/request_token?` +
      `oauth_consumer_key=${credentials.clientId}&` +
      `oauth_signature_method=HMAC-SHA1&` +
      `oauth_callback=${encodeURIComponent(credentials.redirectUri)}`;
    
    return authUrl;
  }

  // Token refresh functionality
  async refreshToken(brokerage: string): Promise<BrokerageToken | null> {
    const token = this.tokens.get(brokerage);
    if (!token || !token.refreshToken) return null;

    try {
      switch (brokerage) {
        case 'schwab':
          return await this.refreshSchwabToken(token);
        case 'tdameritrade':
          return await this.refreshTDAmeritradeToken(token);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to refresh ${brokerage} token:`, error);
      return null;
    }
  }

  private async refreshSchwabToken(token: BrokerageToken): Promise<BrokerageToken> {
    const response = await fetch('https://api.schwabapi.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SCHWAB_CLIENT_ID}:${process.env.SCHWAB_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken!
      })
    });

    const data = await response.json();
    const newToken: BrokerageToken = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || token.refreshToken,
      expiresAt: Date.now() + (data.expires_in * 1000)
    };

    this.tokens.set('schwab', newToken);
    return newToken;
  }

  private async refreshTDAmeritradeToken(token: BrokerageToken): Promise<BrokerageToken> {
    const response = await fetch('https://api.tdameritrade.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken!,
        client_id: process.env.TD_AMERITRADE_CLIENT_ID!
      })
    });

    const data = await response.json();
    const newToken: BrokerageToken = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || token.refreshToken,
      expiresAt: Date.now() + (data.expires_in * 1000)
    };

    this.tokens.set('tdameritrade', newToken);
    return newToken;
  }

  // Test connection to a brokerage
  async testConnection(brokerage: string): Promise<boolean> {
    try {
      const token = this.tokens.get(brokerage);
      if (!token) return false;

      // Check if token is expired and refresh if needed
      if (token.expiresAt < Date.now()) {
        const refreshedToken = await this.refreshToken(brokerage);
        if (!refreshedToken) return false;
      }

      // Test API call based on brokerage
      switch (brokerage) {
        case 'schwab':
          const schwabAccounts = await this.getSchwabAccounts(token);
          return schwabAccounts.length >= 0;
        case 'tdameritrade':
          const tdAccounts = await this.getTDAmeritradeAccounts(token);
          return tdAccounts.length >= 0;
        case 'alpaca':
          const alpacaAccounts = await this.getAlpacaAccounts(token);
          return alpacaAccounts.length >= 0;
        default:
          return false;
      }
    } catch (error) {
      console.error(`Connection test failed for ${brokerage}:`, error);
      return false;
    }
  }

  // Store encrypted token
  async storeToken(brokerage: string, token: BrokerageToken): Promise<void> {
    try {
      const encryptedToken = await encrypt(JSON.stringify(token));
      // In a real implementation, you would store this in a secure database
      // For now, we'll keep it in memory and localStorage for demo
      this.tokens.set(brokerage, token);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`brokerage_token_${brokerage}`, encryptedToken);
      }
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }

  // Retrieve encrypted token
  async retrieveToken(brokerage: string): Promise<BrokerageToken | null> {
    try {
      // First check memory
      const memoryToken = this.tokens.get(brokerage);
      if (memoryToken) return memoryToken;

      // Then check localStorage
      if (typeof window !== 'undefined') {
        const encryptedToken = localStorage.getItem(`brokerage_token_${brokerage}`);
        if (encryptedToken) {
          const decryptedToken = await decrypt(encryptedToken);
          const token = JSON.parse(decryptedToken);
          this.tokens.set(brokerage, token);
          return token;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  // Get all connected accounts
  async getAllAccounts(): Promise<{ brokerage: string; accounts: BrokerageAccount[] }[]> {
    const results = [];
    
    for (const [brokerage, token] of this.tokens.entries()) {
      try {
        let accounts: BrokerageAccount[] = [];
        
        switch (brokerage) {
          case 'schwab':
            accounts = await this.getSchwabAccounts(token);
            break;
          case 'tdameritrade':
            accounts = await this.getTDAmeritradeAccounts(token);
            break;
          case 'alpaca':
            accounts = await this.getAlpacaAccounts(token);
            break;
        }
        
        results.push({ brokerage, accounts });
      } catch (error) {
        console.error(`Failed to get accounts for ${brokerage}:`, error);
      }
    }
    
    return results;
  }

  // Disconnect a brokerage
  async disconnect(brokerage: string): Promise<void> {
    this.tokens.delete(brokerage);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`brokerage_token_${brokerage}`);
    }
  }
}

// Create and export default instance
const realBrokerageIntegration = RealBrokerageIntegration.getInstance();
export default realBrokerageIntegration; 