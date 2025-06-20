import { NextApiRequest, NextApiResponse } from 'next';
import { brokerageIntegration } from '@/utils/brokerageIntegration';
import { encrypt } from '@/utils/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state, error: oauthError } = req.query;

    // Handle OAuth errors
    if (oauthError) {
      console.error('OAuth error:', oauthError);
      return res.redirect('/integration-automation?error=oauth_failed');
    }

    if (!code || !state) {
      return res.redirect('/integration-automation?error=missing_params');
    }

    // Decode state to get user info and brokerage
    const stateData = JSON.parse(Buffer.from(state as string, 'base64').toString());
    const { userId, brokerage } = stateData;

    console.log(`Processing OAuth callback for ${brokerage} user ${userId}`);

    // Exchange authorization code for access token
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3010'}/api/auth/brokerage/callback`;
    
    try {
      const tokenResponse = await brokerageIntegration.exchangeCodeForToken(
        brokerage,
        code as string,
        redirectUri
      );

      // Encrypt and store tokens securely
      const encryptedAccessToken = encrypt(tokenResponse.accessToken);
      const encryptedRefreshToken = tokenResponse.refreshToken ? encrypt(tokenResponse.refreshToken) : null;

      // Test the connection
      const connectionTest = await brokerageIntegration.testConnection(brokerage, tokenResponse.accessToken);
      
      if (!connectionTest) {
        throw new Error('Connection test failed');
      }

      // Store account information in your database
      // This is where you'd save to your actual database
      console.log('Successfully connected account:', {
        userId,
        brokerage,
        hasAccessToken: !!tokenResponse.accessToken,
        hasRefreshToken: !!tokenResponse.refreshToken,
        expiresIn: tokenResponse.expiresIn
      });

      // In a real app, you would:
      // 1. Save encrypted tokens to database
      // 2. Create account record
      // 3. Initialize first sync
      
      // For demo, we'll simulate success
      await simulateAccountCreation(userId, brokerage, {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresIn: tokenResponse.expiresIn
      });

      // Redirect to success page
      res.redirect('/integration-automation?success=account_connected&provider=' + brokerage);

    } catch (tokenError) {
      console.error('Token exchange failed:', tokenError);
      res.redirect('/integration-automation?error=token_exchange_failed');
    }

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect('/integration-automation?error=unknown');
  }
}

async function simulateAccountCreation(userId: string, brokerage: string, tokens: any) {
  // Simulate database operations
  console.log('Creating account record:', {
    userId,
    brokerage,
    createdAt: new Date(),
    isActive: true
  });

  // Simulate initial sync
  console.log('Initiating first sync for new account...');
  
  // In a real implementation, you would:
  // 1. Insert account record into database
  // 2. Store encrypted tokens
  // 3. Queue initial sync job
  // 4. Send welcome notification
  
  return true;
} 