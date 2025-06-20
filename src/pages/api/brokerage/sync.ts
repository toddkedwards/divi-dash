import { NextApiRequest, NextApiResponse } from 'next';
import { realBrokerageService } from '@/utils/realBrokerageIntegration';
import { decrypt } from '@/utils/encryption';

interface StoredTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, brokerage, accountId } = req.body;

    if (!userId || !brokerage) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get encrypted access token from your database
    // This is where you'd query your actual database
    const encryptedTokens = await getUserTokens(userId, brokerage);
    
    if (!encryptedTokens) {
      return res.status(404).json({ error: 'No tokens found for this account' });
    }

    // Decrypt access token
    const accessToken = decrypt(encryptedTokens.accessToken);

    // Check if token is expired and refresh if needed
    if (encryptedTokens.expiresAt && new Date() > encryptedTokens.expiresAt) {
      if (encryptedTokens.refreshToken) {
        try {
          const newTokens = await realBrokerageService.refreshToken(
            brokerage, 
            decrypt(encryptedTokens.refreshToken)
          );
          
          // Update tokens in database
          await updateUserTokens(userId, brokerage, newTokens);
          
          // Use new access token
          const refreshedAccessToken = newTokens.accessToken;
          
          // Perform sync with refreshed token
          const syncResult = await realBrokerageService.syncAccount(
            brokerage, 
            refreshedAccessToken, 
            accountId
          );

          res.status(200).json({
            success: true,
            result: syncResult,
            tokenRefreshed: true
          });
          
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          return res.status(401).json({ 
            error: 'Token refresh failed', 
            requiresReauth: true 
          });
        }
      } else {
        return res.status(401).json({ 
          error: 'Access token expired and no refresh token available', 
          requiresReauth: true 
        });
      }
    } else {
      // Token is still valid, proceed with sync
      const syncResult = await realBrokerageService.syncAccount(
        brokerage, 
        accessToken, 
        accountId
      );

      res.status(200).json({
        success: true,
        result: syncResult,
        tokenRefreshed: false
      });
    }

  } catch (error) {
    console.error('Sync API error:', error);
    
    if (error instanceof Error) {
      // Handle specific API errors
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        return res.status(401).json({ 
          error: 'Authentication failed', 
          requiresReauth: true 
        });
      }
      
      if (error.message.includes('429')) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded', 
          retryAfter: 300 
        });
      }
    }

    res.status(500).json({ 
      error: 'Sync failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

// Mock database functions - replace with your actual database calls
async function getUserTokens(userId: string, brokerage: string): Promise<StoredTokens | null> {
  // This would query your database for encrypted tokens
  // For demo purposes, return null to simulate no tokens
  console.log(`Getting tokens for user ${userId}, brokerage ${brokerage}`);
  return null;
}

async function updateUserTokens(userId: string, brokerage: string, tokens: any) {
  // This would update tokens in your database
  console.log(`Updating tokens for user ${userId}, brokerage ${brokerage}`, {
    hasAccessToken: !!tokens.accessToken,
    hasRefreshToken: !!tokens.refreshToken,
    expiresAt: tokens.expiresAt
  });
  return true;
} 