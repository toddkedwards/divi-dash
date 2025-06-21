# Real Data Integration Setup Guide

## 🚀 Quick Setup for Real Data Integration

### Step 1: Create Environment File

Copy `env.example` to `.env.local` and fill in the following keys:

```bash
cp env.example .env.local
```

### Step 2: Get Free API Keys

#### 📈 **Finnhub API (FREE - Required for Stock Data)**
1. Go to [finnhub.io/register](https://finnhub.io/register)
2. Sign up for free account (60 API calls/minute)
3. Get your API key from dashboard
4. Add to `.env.local`: `NEXT_PUBLIC_FINNHUB_API_KEY=your_key_here`

#### 📊 **Alpha Vantage API (FREE - Optional)**
1. Go to [alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Get free API key (5 calls/minute, 500/day)
3. Add to `.env.local`: `ALPHA_VANTAGE_API_KEY=your_key_here`

### Step 3: Firebase Setup (Required for Authentication)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or use existing
3. Enable Authentication with Email/Password
4. Enable Firestore Database
5. Get config from Project Settings > General > Your apps
6. Fill in Firebase variables in `.env.local`

### Step 4: Stripe Setup (For Pro Subscriptions)

#### Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create account
2. Go to [Stripe Dashboard](https://dashboard.stripe.com/)

#### Get API Keys
1. Go to Developers > API keys
2. Copy **Publishable key** and **Secret key**
3. Add to `.env.local`:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

#### Create Product and Price
1. Go to Products in Stripe Dashboard
2. Create new product: "Divly Pro Subscription"
3. Add recurring price (e.g., $9.99/month)
4. Copy the Price ID (starts with `price_`)
5. Add to `.env.local`: `STRIPE_PRO_PRICE_ID=price_...`

#### Setup Webhook
1. Go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
4. Copy webhook secret
5. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

### Step 5: Generate Security Keys

```bash
# Generate 32-character encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add these to `.env.local`:
```
ENCRYPTION_KEY=your_32_char_key_here
JWT_SECRET=your_64_char_key_here
```

### Step 6: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Test features:
   - ✅ Stock price updates should work
   - ✅ Company logos should load
   - ✅ Pro upgrade button should work
   - ✅ Authentication should work

## 🔧 Current Integration Status

### ✅ **Already Working:**
- Stripe payment processing (complete implementation)
- Finnhub API for stock prices and company data
- Alpha Vantage API for additional company info
- Company logos via Clearbit
- Real-time price updates
- Brokerage API infrastructure (OAuth ready)

### 🚀 **Ready to Enable:**
- Real stock price data (just need Finnhub API key)
- Pro subscription payments (just need Stripe setup)
- User authentication and data persistence
- Advanced portfolio analytics

## 💡 **Free Tier Limits:**

- **Finnhub Free**: 60 calls/minute, perfect for development
- **Alpha Vantage Free**: 5 calls/minute, 500/day
- **Stripe**: No monthly fees, just transaction fees
- **Firebase**: Generous free tier for authentication and database

## 🆘 **Need Help?**

If you get stuck:
1. Check the browser console for API errors
2. Verify API keys are correct in `.env.local`
3. Make sure to restart the dev server after adding keys
4. Check API rate limits if getting 429 errors

## 🎯 **Next Steps After Setup:**

1. **Test real stock data** - Add positions and see live prices
2. **Set up brokerage connections** - Connect to Schwab, TD Ameritrade, etc.
3. **Deploy to production** - Use Vercel with environment variables
4. **Add advanced features** - Dividend tracking, portfolio analytics 