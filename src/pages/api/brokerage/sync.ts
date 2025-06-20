import { NextApiRequest, NextApiResponse } from 'next';
import realBrokerageIntegration from '../../../utils/realBrokerageIntegration';

interface SyncRequest {
  brokerage: string;
  accountId?: string;
  forceRefresh?: boolean;
}

interface SyncResponse {
  success: boolean;
  message: string;
  data?: {
    accountsCount: number;
    positionsCount: number;
    lastSyncAt: string;
  };
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SyncResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { brokerage } = req.body;

  if (!brokerage) {
    return res.status(400).json({
      success: false,
      message: 'Brokerage parameter is required'
    });
  }

  try {
    // Check if we have a valid token
    const token = await realBrokerageIntegration.retrieveToken(brokerage);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No valid token found. Please reconnect your account.'
      });
    }

    // Test connection
    const connectionTest = await realBrokerageIntegration.testConnection(brokerage);
    if (!connectionTest) {
      return res.status(503).json({
        success: false,
        message: 'Connection test failed.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sync completed successfully'
    });

  } catch (error) {
    console.error(`Sync failed for ${brokerage}:`, error);
    
    return res.status(500).json({
      success: false,
      message: 'Sync failed'
    });
  }
}

// Store sync results (in a real implementation, this would go to a database)
async function storeSyncResults(brokerage: string, syncResult: any): Promise<void> {
  try {
    // Log the sync results
    console.log(`Storing sync results for ${brokerage}:`, syncResult);
    
    // In a real implementation, you would:
    // 1. Store in database with proper schema
    // 2. Update user's portfolio table
    // 3. Trigger background jobs for dividend calculations
    // 4. Update cache layers
    
    // For demo purposes, store in file system
    if (typeof window === 'undefined') {
      const fs = require('fs').promises;
      const path = require('path');
      
      const syncFile = path.join(process.cwd(), 'data', 'sync-results.json');
      
      try {
        await fs.mkdir(path.dirname(syncFile), { recursive: true });
        
        let syncHistory: Record<string, any> = {};
        try {
          const existingData = await fs.readFile(syncFile, 'utf8');
          syncHistory = JSON.parse(existingData);
        } catch {
          // File doesn't exist or is invalid, start fresh
        }
        
        // Store current sync result with timestamp
        if (!syncHistory[brokerage]) {
          syncHistory[brokerage] = [];
        }
        
        syncHistory[brokerage].push({
          ...syncResult,
          syncId: `${brokerage}-${Date.now()}`,
          timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 sync results per brokerage
        if (syncHistory[brokerage].length > 50) {
          syncHistory[brokerage] = syncHistory[brokerage].slice(-50);
        }
        
        await fs.writeFile(syncFile, JSON.stringify(syncHistory, null, 2));
        console.log(`Sync results stored for ${brokerage}`);
        
      } catch (fileError) {
        console.error('Failed to store sync results to file:', fileError);
      }
    }
  } catch (error) {
    console.error('Failed to store sync results:', error);
  }
}

// Utility function to get sync history
export async function getSyncHistory(brokerage?: string): Promise<any> {
  try {
    if (typeof window === 'undefined') {
      const fs = require('fs').promises;
      const path = require('path');
      
      const syncFile = path.join(process.cwd(), 'data', 'sync-results.json');
      
      try {
        const data = await fs.readFile(syncFile, 'utf8');
        const syncHistory = JSON.parse(data);
        
        if (brokerage) {
          return syncHistory[brokerage] || [];
        }
        
        return syncHistory;
      } catch {
        return brokerage ? [] : {};
      }
    }
    
    return brokerage ? [] : {};
  } catch (error) {
    console.error('Failed to get sync history:', error);
    return brokerage ? [] : {};
  }
} 