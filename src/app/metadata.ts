import { Metadata, Viewport } from 'next';

// Enhanced metadata for PWA and SEO
export const metadata: Metadata = {
  title: {
    default: 'Divi Dash - Professional Dividend Portfolio Tracker',
    template: '%s | Divi Dash'
  },
  description: 'Track your dividend portfolio with advanced analytics, real-time insights, and AI-powered recommendations. The professional platform for dividend investors.',
  keywords: ['dividend tracker', 'portfolio management', 'dividend investing', 'stock analysis', 'financial planning', 'PWA', 'web app'],
  authors: [{ name: 'Divi Dash Team' }],
  creator: 'Divi Dash',
  publisher: 'Divi Dash',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://divi-dash.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Divi Dash - Professional Dividend Portfolio Tracker',
    description: 'Track your dividend portfolio with advanced analytics and AI-powered insights',
    url: 'https://divi-dash.com',
    siteName: 'Divi Dash',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Divi Dash Portfolio Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Divi Dash - Professional Dividend Portfolio Tracker',
    description: 'Track your dividend portfolio with advanced analytics and AI-powered insights',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Divi Dash',
    startupImage: [
      '/icon-192x192.png',
    ],
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'apple-mobile-web-app-capable': ['yes'],
      'mobile-web-app-capable': ['yes'],
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}; 