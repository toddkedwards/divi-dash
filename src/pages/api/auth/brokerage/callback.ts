import { NextApiRequest, NextApiResponse } from 'next';
import realBrokerageIntegration, { RealBrokerageIntegration, BrokerageCredentials, BrokerageToken } from '../../../../utils/realBrokerageIntegration';
import { encrypt } from '../../../../utils/encryption';

interface CallbackQuery {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
  brokerage?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state, error, error_description, brokerage } = req.query as CallbackQuery;

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth error for ${brokerage}:`, error, error_description);
    return res.redirect(`/integration-automation?error=${encodeURIComponent(error_description || error)}`);
  }

  // Validate required parameters
  if (!code || !brokerage) {
    return res.redirect('/integration-automation?error=Missing required parameters');
  }

  // Validate state parameter (CSRF protection)
  if (state) {
    // In a real implementation, you would validate the state parameter
    // against a stored value to prevent CSRF attacks
    console.log('State parameter received:', state);
  }

  try {
    const brokerageIntegration = realBrokerageIntegration;
    let token: BrokerageToken;

    // Get credentials based on brokerage
    const credentials = getBrokerageCredentials(brokerage);
    if (!credentials) {
      throw new Error(`No credentials configured for ${brokerage}`);
    }

    // Exchange authorization code for access token
    switch (brokerage) {
      case 'schwab':
        token = await brokerageIntegration.exchangeSchwabToken(code, credentials);
        break;
      case 'tdameritrade':
        token = await brokerageIntegration.exchangeTDAmeritradeToken(code, credentials);
        break;
      case 'alpaca':
        // Alpaca doesn't use OAuth, this shouldn't happen
        throw new Error('Alpaca uses API keys, not OAuth');
      default:
        throw new Error(`Unsupported brokerage: ${brokerage}`);
    }

    // Store the encrypted token
    await brokerageIntegration.storeToken(brokerage, token);

    // Test the connection
    const connectionTest = await brokerageIntegration.testConnection(brokerage);
    if (!connectionTest) {
      throw new Error('Connection test failed after token exchange');
    }

    // Store connection status in database (in a real implementation)
    await storeConnectionStatus(brokerage, {
      connected: true,
      connectedAt: new Date().toISOString(),
      lastSync: new Date().toISOString(),
      accountCount: 0 // Will be updated on first sync
    });

    // Redirect to success page
    res.redirect(`/integration-automation?success=true&brokerage=${brokerage}`);

  } catch (error) {
    console.error(`Token exchange failed for ${brokerage}:`, error);
    
    // Redirect to error page
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.redirect(`/integration-automation?error=${encodeURIComponent(errorMessage)}`);
  }
}

function getBrokerageCredentials(brokerage: string): BrokerageCredentials | null {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXTAUTH_URL 
    : 'http://localhost:3010';

  switch (brokerage) {
    case 'schwab':
      if (!process.env.SCHWAB_CLIENT_ID || !process.env.SCHWAB_CLIENT_SECRET) {
        return null;
      }
      return {
        clientId: process.env.SCHWAB_CLIENT_ID,
        clientSecret: process.env.SCHWAB_CLIENT_SECRET,
        redirectUri: `${baseUrl}/api/auth/brokerage/callback?brokerage=schwab`
      };

    case 'tdameritrade':
      if (!process.env.TD_AMERITRADE_CLIENT_ID) {
        return null;
      }
      return {
        clientId: process.env.TD_AMERITRADE_CLIENT_ID,
        clientSecret: '', // TD Ameritrade doesn't require client secret for OAuth
        redirectUri: `${baseUrl}/api/auth/brokerage/callback?brokerage=tdameritrade`
      };

    case 'alpaca':
      if (!process.env.ALPACA_API_KEY || !process.env.ALPACA_SECRET_KEY) {
        return null;
      }
      return {
        clientId: process.env.ALPACA_API_KEY,
        clientSecret: process.env.ALPACA_SECRET_KEY,
        redirectUri: '', // Not used for Alpaca
        sandbox: process.env.ALPACA_SANDBOX === 'true'
      };

    case 'interactivebrokers':
      if (!process.env.INTERACTIVE_BROKERS_CLIENT_ID || !process.env.INTERACTIVE_BROKERS_CLIENT_SECRET) {
        return null;
      }
      return {
        clientId: process.env.INTERACTIVE_BROKERS_CLIENT_ID,
        clientSecret: process.env.INTERACTIVE_BROKERS_CLIENT_SECRET,
        redirectUri: `${baseUrl}/api/auth/brokerage/callback?brokerage=interactivebrokers`
      };

    default:
      return null;
  }
}

// Store connection status (in a real implementation, this would go to a database)
async function storeConnectionStatus(brokerage: string, status: any): Promise<void> {
  try {
    // In a real implementation, you would store this in your database
    // For now, we'll just log it
    console.log(`Connection status for ${brokerage}:`, status);
    
    // You could also store it in a file or send it to a logging service
    if (typeof window === 'undefined') {
      // Server-side storage
      const fs = require('fs').promises;
      const path = require('path');
      
      const statusFile = path.join(process.cwd(), 'data', 'brokerage-connections.json');
      
      try {
        await fs.mkdir(path.dirname(statusFile), { recursive: true });
        
        let connections: Record<string, any> = {};
        try {
          const existingData = await fs.readFile(statusFile, 'utf8');
          connections = JSON.parse(existingData);
        } catch {
          // File doesn't exist or is invalid, start fresh
        }
        
        connections[brokerage] = status;
        await fs.writeFile(statusFile, JSON.stringify(connections, null, 2));
      } catch (fileError) {
        console.error('Failed to store connection status to file:', fileError);
      }
    }
  } catch (error) {
    console.error('Failed to store connection status:', error);
  }
}

// Helper function to generate state parameter for CSRF protection
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Helper function to validate state parameter
export function validateState(providedState: string, expectedState: string): boolean {
  return providedState === expectedState;
} 