export interface CompanyInfo {
  name: string;
  logo: string;
  color: string;
}

export const companyInfo: Record<string, CompanyInfo> = {
  AAPL: {
    name: "Apple Inc.",
    logo: "🍎",
    color: "#000000"
  },
  MSFT: {
    name: "Microsoft Corporation",
    logo: "🪟",
    color: "#00A4EF"
  },
  T: {
    name: "AT&T Inc.",
    logo: "📱",
    color: "#00A8E0"
  }
}; 