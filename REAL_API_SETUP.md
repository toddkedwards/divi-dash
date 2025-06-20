# Real Brokerage API Integration Setup Guide

This guide will help you set up real API integrations with major brokerages to enable live portfolio synchronization in Divi Dash.

## 🚀 Quick Start

1. **Copy Environment File**
   ```bash
   cp env.example .env.local
   ```

2. **Choose Your Brokerages**
   - Start with one brokerage for testing
   - We recommend **Alpaca** for beginners (offers paper trading)

3. **Get API Credentials**
   - Sign up for developer accounts
   - Create applications
   - Get your API keys

4. **Configure Environment Variables**
   - Add your credentials to `.env.local`
   - Restart your development server

5. **Test Connections**
   - Go to Integration & Automation → Real API Setup
   - Test each connection

## 🏦 Supported Brokerages

### ⭐ Recommended for Testing

#### **Alpaca** (Best for Beginners)
- **Features**: Paper trading, real-time data, commission-free
- **Developer Portal**: https://app.alpaca.markets/
- **Setup Difficulty**: Easy
- **Paper Trading**: ✅ Yes

**Setup Steps:**
1. Sign up at https://app.alpaca.markets/
2. Go to "Paper Trading" → "API Keys"
3. Generate new API key pair
4. Add to `.env.local`:
   ```
   ALPACA_CLIENT_ID=your_key_id
   ALPACA_CLIENT_SECRET=your_secret_key
   ```

#### **TD Ameritrade** (Full Features)
- **Features**: Full brokerage functionality, extensive API
- **Developer Portal**: https://developer.tdameritrade.com/
- **Setup Difficulty**: Medium
- **Paper Trading**: ❌ No

**Setup Steps:**
1. Create TD Ameritrade account
2. Apply for API access at developer portal
3. Create new app with these settings:
   - **Redirect URI**: `http://localhost:3010/api/auth/brokerage/callback`
   - **App Type**: Web App
4. Add credentials to `.env.local`

### 🔧 Production Ready

#### **Charles Schwab**
- **Features**: Professional-grade API, institutional access
- **Developer Portal**: https://developer.schwab.com/
- **Setup Difficulty**: Hard
- **Requirements**: Schwab account, approval process

#### **Fidelity**
- **Features**: Comprehensive trading API
- **Developer Portal**: https://developer.fidelity.com/
- **Setup Difficulty**: Hard
- **Requirements**: Fidelity account, business verification

#### **E*TRADE**
- **Features**: Retail and institutional APIs
- **Developer Portal**: https://developer.etrade.com/
- **Setup Difficulty**: Medium
- **Requirements**: E*TRADE account

#### **Interactive Brokers**
- **Features**: Global markets, advanced trading
- **Developer Portal**: https://www.interactivebrokers.com/en/index.php?f=5041
- **Setup Difficulty**: Very Hard
- **Requirements**: IB Gateway/TWS software

#### **Webull**
- **Features**: Commission-free trading
- **Developer Portal**: https://developer.webull.com/
- **Setup Difficulty**: Medium
- **Note**: Limited API access for retail developers

#### **Robinhood**
- **Features**: Mobile-first trading
- **Developer Portal**: Limited public API
- **Setup Difficulty**: Very Hard
- **Note**: Very limited access for third-party developers

## 🔒 Security Best Practices

### Environment Variables
```bash
# Generate a secure encryption key (32+ characters)
ENCRYPTION_KEY=abcd1234efgh5678ijkl9012mnop3456

# Use strong NextAuth secret
NEXTAUTH_SECRET=your_very_secure_nextauth_secret_here
```

### API Key Management
- **Never commit credentials to Git**
- Use different keys for development vs production
- Rotate keys regularly (every 90 days)
- Monitor API usage and rate limits
- Enable IP restrictions when available

### Token Storage
- All access tokens are encrypted before storage
- Refresh tokens are handled automatically
- Tokens expire and are refreshed automatically
- Failed authentications trigger re-auth flows

## 🛠️ Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy example file
cp env.example .env.local

# Edit with your credentials
nano .env.local
```

### 3. Test Individual APIs

#### Test Alpaca Connection
```bash
# Set up Alpaca credentials in .env.local
ALPACA_CLIENT_ID=your_alpaca_key
ALPACA_CLIENT_SECRET=your_alpaca_secret

# Restart server
npm run dev

# Test in UI: Integration & Automation → Real API Setup
```

#### Test TD Ameritrade
```bash
# Add TD Ameritrade credentials
TD_AMERITRADE_CLIENT_ID=your_td_client_id
TD_AMERITRADE_CLIENT_SECRET=your_td_client_secret

# Test OAuth flow in browser
```

### 4. Monitor API Calls
- Check browser console for API responses
- Monitor rate limits in developer dashboards
- Use sandbox/paper trading environments first

## 📊 API Implementation Status

| Brokerage | OAuth2 | API Keys | Positions | Transactions | Paper Trading |
|-----------|--------|----------|-----------|--------------|---------------|
| Alpaca | ✅ | ✅ | ✅ | ✅ | ✅ |
| TD Ameritrade | ✅ | ❌ | ✅ | ✅ | ❌ |
| Schwab | ✅ | ❌ | ✅ | 🚧 | ❌ |
| Fidelity | ✅ | ❌ | 🚧 | 🚧 | ❌ |
| E*TRADE | ✅ | ❌ | 🚧 | 🚧 | ❌ |
| Interactive Brokers | ❌ | ✅ | 🚧 | 🚧 | ✅ |
| Webull | 🚧 | 🚧 | 🚧 | 🚧 | ❌ |
| Robinhood | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ Fully implemented
- 🚧 In development
- ❌ Not available/implemented

## 🔧 Troubleshooting

### Common Issues

#### "API credentials not configured"
- Check `.env.local` file exists
- Verify variable names match exactly
- Restart development server after changes

#### "OAuth redirect failed"
- Verify redirect URI in brokerage app settings
- Check for typos in callback URL
- Ensure development server is running on correct port

#### "Rate limit exceeded"
- Most APIs have rate limits (e.g., 120 requests/minute)
- Implement exponential backoff
- Use caching to reduce API calls

#### "Connection test failed"
- Check API credentials are correct
- Verify network connectivity
- Check brokerage API status pages

### Debug Mode
```bash
# Enable detailed logging
DEBUG=1 npm run dev

# Check API responses in browser console
# Monitor network tab for failed requests
```

### API Status Pages
- **Alpaca**: https://status.alpaca.markets/
- **TD Ameritrade**: https://developer.tdameritrade.com/content/api-status
- **Schwab**: https://developer.schwab.com/products/trader-api
- **Interactive Brokers**: https://www.interactivebrokers.com/en/index.php?f=2020

## 📝 Implementation Notes

### Data Synchronization
- **Real-time**: WebSocket connections (Alpaca, IB)
- **Polling**: REST API calls every 5-60 minutes
- **Webhooks**: Receive push notifications (when available)

### Error Handling
- Automatic token refresh
- Exponential backoff for rate limits
- Graceful fallback to cached data
- User notifications for critical errors

### Performance Optimizations
- Response caching (5-minute default)
- Batch API requests when possible
- Lazy loading of position details
- Background sync jobs

## 🚀 Next Steps

1. **Start with Alpaca** for testing and development
2. **Add TD Ameritrade** for full brokerage features
3. **Implement production database** for token storage
4. **Set up monitoring** for API health and usage
5. **Deploy to production** with proper security measures

## 📞 Support

- **GitHub Issues**: Report bugs and feature requests
- **Discord**: Join our developer community
- **Documentation**: Check API-specific documentation
- **Email**: support@dividash.com

---

**⚠️ Important**: Always test with paper trading or sandbox environments before using real money. API integrations involve financial data and should be implemented with proper security measures. 