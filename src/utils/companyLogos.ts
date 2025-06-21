export interface CompanyInfo {
  name: string;
  logo: string;
  color: string;
}

export const companyInfo: Record<string, CompanyInfo> = {
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
  T: {
    name: "AT&T Inc.",
    logo: "https://logo.clearbit.com/att.com",
    color: "#00A8E0"
  }
}; 