# Real Brokerage API Setup Guide

This guide will help you set up real brokerage API integrations for production use with Divi Dash.

## Overview

Divi Dash supports the following brokerage APIs:
- **Charles Schwab** - OAuth 2.0 authentication
- **TD Ameritrade** - OAuth 2.0 authentication  
- **Alpaca** - API Key authentication
- **Interactive Brokers** - OAuth 1.0a authentication

## Prerequisites

1. Active developer accounts with your chosen brokerages
2. Registered applications in their developer portals
3. SSL certificate for production (required for OAuth callbacks)
4. Domain whitelist configuration

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Charles Schwab API
SCHWAB_CLIENT_ID=your_schwab_client_id
SCHWAB_CLIENT_SECRET=your_schwab_client_secret
SCHWAB_REDIRECT_URI=https://yourdomain.com/api/auth/brokerage/callback?brokerage=schwab

# TD Ameritrade API
TD_AMERITRADE_CLIENT_ID=your_td_client_id@AMER.OAUTHAP
TD_AMERITRADE_REDIRECT_URI=https://yourdomain.com/api/auth/brokerage/callback?brokerage=tdameritrade

# Alpaca API
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_SECRET_KEY=your_alpaca_secret_key
ALPACA_SANDBOX=true  # Set to false for live trading

# Interactive Brokers API
INTERACTIVE_BROKERS_CLIENT_ID=your_ib_client_id
INTERACTIVE_BROKERS_CLIENT_SECRET=your_ib_client_secret

# Application URLs
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Brokerage-Specific Setup

### Charles Schwab

1. **Developer Account Setup:**
   - Visit [Schwab Developer Portal](https://developer.schwab.com/)
   - Create a developer account
   - Register a new application

2. **Application Configuration:**
   - Application Type: Web Application
   - Redirect URI: `https://yourdomain.com/api/auth/brokerage/callback?brokerage=schwab`
   - Scopes: `read` (minimum required)

3. **API Credentials:**
   - Client ID: Found in your app settings
   - Client Secret: Generated after app creation
   - Keep credentials secure and never commit to version control

4. **Rate Limits:**
   - 120 requests per minute
   - Implement appropriate caching and throttling

### TD Ameritrade

1. **Developer Account Setup:**
   - Visit [TD Ameritrade Developer](https://developer.tdameritrade.com/)
   - Create a developer account
   - Register a new application

2. **Application Configuration:**
   - Application Type: Web App
   - Redirect URI: `https://yourdomain.com/api/auth/brokerage/callback?brokerage=tdameritrade`
   - Callback URL: Must be HTTPS in production

3. **Important Notes:**
   - Client ID must include `@AMER.OAUTHAP` suffix
   - No client secret required for OAuth flow
   - TD Ameritrade is transitioning to Charles Schwab

4. **Rate Limits:**
   - 120 requests per minute per user
   - Additional limits based on endpoint

### Alpaca

1. **Account Setup:**
   - Visit [Alpaca Markets](https://alpaca.markets/)
   - Create a trading account
   - Generate API keys in the dashboard

2. **API Configuration:**
   - Paper Trading: Use paper trading environment for testing
   - Live Trading: Enable live trading in production
   - API Version: v2 (current)

3. **API Keys:**
   - API Key ID: Your public identifier
   - Secret Key: Private key (keep secure)
   - Base URL: Different for paper vs live trading

4. **Rate Limits:**
   - 200 requests per minute
   - Streaming data available for real-time updates

### Interactive Brokers

1. **Setup Requirements:**
   - IB Pro account or higher
   - TWS (Trader Workstation) or IB Gateway
   - Port configuration for API access

2. **API Configuration:**
   - Enable API access in TWS/Gateway
   - Configure trusted IP addresses
   - Set API port (default 7497 for TWS, 4001 for Gateway)

3. **OAuth Setup:**
   - Register application in IB Developer Portal
   - Configure OAuth redirect URIs
   - Implement OAuth 1.0a flow

## Security Best Practices

### Credential Storage
- Never store credentials in code or version control
- Use environment variables or secure secret management
- Rotate API keys regularly
- Monitor for suspicious activity

### Token Management
- Implement automatic token refresh
- Store tokens encrypted in database
- Set appropriate expiration times
- Handle token revocation gracefully

### Network Security
- Use HTTPS for all API communications
- Implement request signing where required
- Validate SSL certificates
- Use IP whitelisting when available

## Testing Your Setup

### 1. Environment Validation
```bash
# Run the development server
npm run dev

# Check the Real API Manager
# Navigate to: http://localhost:3010/integration-automation
# Go to the "Real API Manager" section
```

### 2. Connection Testing
1. Open the Real API Manager
2. Go to the "Overview" tab
3. Click "Test" for each configured brokerage
4. Verify green status indicators

### 3. OAuth Flow Testing
1. Navigate to Integration & Automation
2. Click "Connect Account" for OAuth-based brokerages
3. Complete the authorization flow
4. Verify successful connection

### 4. API Response Testing
```bash
# Test Schwab connection
curl -X POST http://localhost:3010/api/brokerage/sync \
  -H "Content-Type: application/json" \
  -d '{"brokerage": "schwab"}'

# Test Alpaca connection
curl -X POST http://localhost:3010/api/brokerage/sync \
  -H "Content-Type: application/json" \
  -d '{"brokerage": "alpaca"}'
```

## Common Issues and Solutions

### OAuth Redirect Errors
**Problem:** Invalid redirect URI error
**Solution:** 
- Ensure redirect URI exactly matches registration
- Use HTTPS in production
- Include query parameters if specified

### Token Expiration
**Problem:** 401 Unauthorized errors
**Solution:**
- Implement automatic token refresh
- Check token expiration before API calls
- Handle refresh token rotation

### Rate Limiting
**Problem:** 429 Too Many Requests
**Solution:**
- Implement exponential backoff
- Cache API responses appropriately
- Distribute requests across time

### CORS Issues
**Problem:** Cross-origin request blocked
**Solution:**
- Configure API endpoint whitelist
- Use server-side API calls only
- Avoid client-side credential exposure

## Production Deployment

### 1. Environment Setup
- Configure production environment variables
- Set up SSL certificates
- Configure domain DNS

### 2. Security Checklist
- [ ] All credentials stored securely
- [ ] HTTPS enabled for all endpoints
- [ ] Rate limiting implemented
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Monitoring set up

### 3. Compliance Considerations
- Review brokerage terms of service
- Implement data privacy controls
- Consider financial regulations
- Set up audit logging

## Monitoring and Maintenance

### Health Checks
- Monitor API connection status
- Track success/failure rates
- Set up alerting for failures
- Regular token refresh monitoring

### Performance Monitoring
- API response times
- Rate limit utilization
- Error rates by endpoint
- User connection patterns

### Regular Maintenance
- Update API client libraries
- Rotate credentials periodically
- Review and update scopes
- Test backup procedures

## Support and Resources

### Documentation
- [Schwab API Documentation](https://developer.schwab.com/products/trader-api--individual)
- [TD Ameritrade API Documentation](https://developer.tdameritrade.com/apis)
- [Alpaca API Documentation](https://alpaca.markets/docs/api-references/trading-api/)
- [Interactive Brokers API Documentation](https://interactivebrokers.github.io/cpwebapi/)

### Developer Communities
- Schwab Developer Forums
- TD Ameritrade Developer Community
- Alpaca Community Slack
- Interactive Brokers API Forum

### Getting Help
1. Check the documentation for your specific brokerage
2. Review error logs in the application
3. Test with sandbox/paper trading environments first
4. Contact brokerage API support for credential issues

## Legal and Compliance

### Terms of Service
- Each brokerage has specific terms for API usage
- Review usage limits and restrictions
- Understand data sharing policies
- Comply with financial regulations

### Data Privacy
- Handle user financial data securely
- Implement appropriate access controls
- Consider GDPR and CCPA requirements
- Document data retention policies

---

**Note:** This setup requires careful attention to security and compliance. Always test thoroughly in sandbox environments before deploying to production with real financial data. 