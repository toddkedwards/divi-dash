export interface CompanyInfo {
  name: string;
  logo: string;
  color: string;
}

export const companyInfo: Record<string, CompanyInfo> = {
  // Technology Giants
  AAPL: {
    name: "Apple Inc.",
    logo: "https://logo.clearbit.com/apple.com",
    color: "#000000"
  },
  MSFT: {
    name: "Microsoft Corporation",
    logo: "https://logo.clearbit.com/microsoft.com",
    color: "#00A4EF"
  },
  GOOGL: {
    name: "Alphabet Inc.",
    logo: "https://logo.clearbit.com/abc.xyz",
    color: "#4285F4"
  },
  GOOG: {
    name: "Alphabet Inc.",
    logo: "https://logo.clearbit.com/abc.xyz",
    color: "#4285F4"
  },
  AMZN: {
    name: "Amazon.com Inc.",
    logo: "https://logo.clearbit.com/amazon.com",
    color: "#FF9900"
  },
  META: {
    name: "Meta Platforms Inc.",
    logo: "https://logo.clearbit.com/meta.com",
    color: "#1877F2"
  },
  TSLA: {
    name: "Tesla Inc.",
    logo: "https://logo.clearbit.com/tesla.com",
    color: "#CC0000"
  },
  NVDA: {
    name: "NVIDIA Corporation",
    logo: "https://logo.clearbit.com/nvidia.com",
    color: "#76B900"
  },
  NFLX: {
    name: "Netflix Inc.",
    logo: "https://logo.clearbit.com/netflix.com",
    color: "#E50914"
  },
  CRM: {
    name: "Salesforce Inc.",
    logo: "https://logo.clearbit.com/salesforce.com",
    color: "#00A1E0"
  },
  ORCL: {
    name: "Oracle Corporation",
    logo: "https://logo.clearbit.com/oracle.com",
    color: "#F80000"
  },
  ADBE: {
    name: "Adobe Inc.",
    logo: "https://logo.clearbit.com/adobe.com",
    color: "#FF0000"
  },
  
  // Financial Services
  JPM: {
    name: "JPMorgan Chase & Co.",
    logo: "https://logo.clearbit.com/jpmorganchase.com",
    color: "#0066B2"
  },
  BAC: {
    name: "Bank of America Corp.",
    logo: "https://logo.clearbit.com/bankofamerica.com",
    color: "#E31837"
  },
  WFC: {
    name: "Wells Fargo & Company",
    logo: "https://logo.clearbit.com/wellsfargo.com",
    color: "#D71921"
  },
  GS: {
    name: "Goldman Sachs Group Inc.",
    logo: "https://logo.clearbit.com/goldmansachs.com",
    color: "#0066CC"
  },
  MS: {
    name: "Morgan Stanley",
    logo: "https://logo.clearbit.com/morganstanley.com",
    color: "#00529B"
  },
  V: {
    name: "Visa Inc.",
    logo: "https://logo.clearbit.com/visa.com",
    color: "#1A1F71"
  },
  MA: {
    name: "Mastercard Inc.",
    logo: "https://logo.clearbit.com/mastercard.com",
    color: "#EB001B"
  },
  
  // Healthcare & Pharmaceuticals
  JNJ: {
    name: "Johnson & Johnson",
    logo: "https://logo.clearbit.com/jnj.com",
    color: "#CC0000"
  },
  PFE: {
    name: "Pfizer Inc.",
    logo: "https://logo.clearbit.com/pfizer.com",
    color: "#0093D0"
  },
  UNH: {
    name: "UnitedHealth Group Inc.",
    logo: "https://logo.clearbit.com/unitedhealthgroup.com",
    color: "#002677"
  },
  ABBV: {
    name: "AbbVie Inc.",
    logo: "https://logo.clearbit.com/abbvie.com",
    color: "#071D49"
  },
  
  // Consumer Goods & Retail
  PG: {
    name: "Procter & Gamble Co.",
    logo: "https://logo.clearbit.com/pg.com",
    color: "#003DA5"
  },
  KO: {
    name: "Coca-Cola Company",
    logo: "https://logo.clearbit.com/coca-cola.com",
    color: "#F40009"
  },
  PEP: {
    name: "PepsiCo Inc.",
    logo: "https://logo.clearbit.com/pepsico.com",
    color: "#004B93"
  },
  WMT: {
    name: "Walmart Inc.",
    logo: "https://logo.clearbit.com/walmart.com",
    color: "#004C91"
  },
  HD: {
    name: "Home Depot Inc.",
    logo: "https://logo.clearbit.com/homedepot.com",
    color: "#F96302"
  },
  MCD: {
    name: "McDonald's Corporation",
    logo: "https://logo.clearbit.com/mcdonalds.com",
    color: "#FFC72C"
  },
  COST: {
    name: "Costco Wholesale Corporation",
    logo: "https://logo.clearbit.com/costco.com",
    color: "#00447C"
  },
  
  // Telecommunications
  T: {
    name: "AT&T Inc.",
    logo: "https://logo.clearbit.com/att.com",
    color: "#00A8E0"
  },
  VZ: {
    name: "Verizon Communications Inc.",
    logo: "https://logo.clearbit.com/verizon.com",
    color: "#CD040B"
  },
  
  // Energy & Utilities
  XOM: {
    name: "Exxon Mobil Corporation",
    logo: "https://logo.clearbit.com/exxonmobil.com",
    color: "#FF1D25"
  },
  CVX: {
    name: "Chevron Corporation",
    logo: "https://logo.clearbit.com/chevron.com",
    color: "#1F5AA6"
  },
  
  // Industrial & Manufacturing
  BA: {
    name: "Boeing Company",
    logo: "https://logo.clearbit.com/boeing.com",
    color: "#0039A6"
  },
  CAT: {
    name: "Caterpillar Inc.",
    logo: "https://logo.clearbit.com/caterpillar.com",
    color: "#FFCD11"
  },
  MMM: {
    name: "3M Company",
    logo: "https://logo.clearbit.com/3m.com",
    color: "#FF0000"
  },
  
  // Popular ETFs
  SPY: {
    name: "SPDR S&P 500 ETF Trust",
    logo: "https://logo.clearbit.com/spdrs.com",
    color: "#0066CC"
  },
  QQQ: {
    name: "Invesco QQQ Trust",
    logo: "https://logo.clearbit.com/invesco.com",
    color: "#0066CC"
  },
  IWM: {
    name: "iShares Russell 2000 ETF",
    logo: "https://logo.clearbit.com/ishares.com",
    color: "#00A651"
  },
  VTI: {
    name: "Vanguard Total Stock Market ETF",
    logo: "https://logo.clearbit.com/vanguard.com",
    color: "#CC092F"
  },
  VOO: {
    name: "Vanguard S&P 500 ETF",
    logo: "https://logo.clearbit.com/vanguard.com",
    color: "#CC092F"
  },
  VEA: {
    name: "Vanguard FTSE Developed Markets ETF",
    logo: "https://logo.clearbit.com/vanguard.com",
    color: "#CC092F"
  },
  VWO: {
    name: "Vanguard FTSE Emerging Markets ETF",
    logo: "https://logo.clearbit.com/vanguard.com",
    color: "#CC092F"
  },
  
  // Dividend Aristocrats & Popular Dividend Stocks
  SCHD: {
    name: "Schwab US Dividend Equity ETF",
    logo: "https://logo.clearbit.com/schwab.com",
    color: "#00A3E0"
  },
  SCHG: {
    name: "Schwab US Large-Cap Growth ETF",
    logo: "https://logo.clearbit.com/schwab.com",
    color: "#00A3E0"
  },
  O: {
    name: "Realty Income Corporation",
    logo: "https://logo.clearbit.com/realtyincome.com",
    color: "#0066CC"
  },
  MAIN: {
    name: "Main Street Capital Corporation",
    logo: "https://logo.clearbit.com/mainstcapital.com",
    color: "#0066CC"
  },
  
  // Popular Restaurant Stocks
  TXRH: {
    name: "Texas Roadhouse Inc.",
    logo: "https://logo.clearbit.com/texasroadhouse.com",
    color: "#8B0000"
  },
  SBUX: {
    name: "Starbucks Corporation",
    logo: "https://logo.clearbit.com/starbucks.com",
    color: "#00704A"
  },
  CMG: {
    name: "Chipotle Mexican Grill Inc.",
    logo: "https://logo.clearbit.com/chipotle.com",
    color: "#A81612"
  }
}; 