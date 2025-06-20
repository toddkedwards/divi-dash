# Vercel Deployment Guide for Divi Dash

This guide will help you deploy Divi Dash to Vercel successfully.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Environment Variables**: Prepare your production environment variables

## Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `divi-dash` repository
4. Vercel will automatically detect it's a Next.js project

### 2. Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (keep default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

### 3. Set Environment Variables

In the Vercel dashboard, go to your project > Settings > Environment Variables.

Add these **REQUIRED** variables for basic functionality:

```bash
# Application URLs (UPDATE THESE!)
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# Node Environment
NODE_ENV=production

# Basic Firebase Config (at minimum for auth to work)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Encryption Key (generate a 32-character random string)
ENCRYPTION_KEY=your_32_character_encryption_key
```

**Optional but recommended** for full functionality:

```bash
# Financial APIs
FINNHUB_API_KEY=your_finnhub_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# Brokerage APIs
SCHWAB_CLIENT_ID=your_schwab_id
SCHWAB_CLIENT_SECRET=your_schwab_secret
SCHWAB_REDIRECT_URI=https://your-app-name.vercel.app/api/auth/brokerage/callback?brokerage=schwab

# Update all other redirect URIs to use your Vercel domain
TD_AMERITRADE_REDIRECT_URI=https://your-app-name.vercel.app/api/auth/brokerage/callback?brokerage=tdameritrade
```

### 4. Update Redirect URIs

**IMPORTANT**: Update all OAuth redirect URIs in your brokerage developer accounts:

- **Charles Schwab**: `https://your-app-name.vercel.app/api/auth/brokerage/callback?brokerage=schwab`
- **TD Ameritrade**: `https://your-app-name.vercel.app/api/auth/brokerage/callback?brokerage=tdameritrade`
- **Other brokerages**: Update accordingly

### 5. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete (should take 2-3 minutes)
3. Check the deployment logs for any errors

## Common Issues and Solutions

### Build Errors

**TypeScript Errors**:
```bash
# Run locally first to catch errors
npm run build
```

**Missing Dependencies**:
```bash
# Check package.json and install missing packages
npm install
```

**Environment Variable Issues**:
- Ensure all required variables are set in Vercel
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Server-side variables (like API keys) should NOT start with `NEXT_PUBLIC_`

### Runtime Errors

**500 Internal Server Error**:
1. Check Vercel function logs in the dashboard
2. Verify environment variables are correctly set
3. Check API route implementations

**API Route Issues**:
- API routes are automatically deployed as Vercel functions
- Check function timeout limits (default: 10s, max: 60s with Pro)
- Large operations may need optimization

**Firebase Connection Issues**:
1. Verify Firebase config variables
2. Check Firebase project settings
3. Ensure Vercel domain is added to Firebase authorized domains

### Performance Optimization

**Bundle Size**:
- Current build generates ~400KB total
- Consider code splitting for larger components
- Use dynamic imports for heavy libraries

**Cold Starts**:
- Vercel functions may have cold start delays
- Consider upgrading to Pro for better performance
- Implement proper loading states

## Monitoring and Maintenance

### Vercel Analytics
Enable Vercel Analytics for performance monitoring:
1. Go to project settings
2. Enable Analytics
3. Monitor Core Web Vitals

### Error Tracking
Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

### Environment Updates
When updating environment variables:
1. Update in Vercel dashboard
2. Redeploy (or auto-redeploy will trigger)
3. Test functionality

## Security Considerations

1. **API Keys**: Never expose server-side API keys
2. **CORS**: API routes include proper CORS headers
3. **Rate Limiting**: Implement rate limiting for production
4. **Firebase Rules**: Ensure proper Firestore security rules

## Custom Domain (Optional)

1. Go to project settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update environment variables to use custom domain

## Troubleshooting Checklist

- [ ] Build passes locally (`npm run build`)
- [ ] All required environment variables are set
- [ ] OAuth redirect URIs are updated for production domain
- [ ] Firebase project allows your Vercel domain
- [ ] API keys are valid and have proper permissions
- [ ] No hardcoded localhost URLs in code

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Test API endpoints individually
3. Verify environment variable formatting
4. Check browser console for client-side errors

Remember to update this guide as you add new features or change deployment requirements. 