/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@divly/core', '@divly/data-models'],
  
  // Mobile and PWA optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
    scrollRestoration: true,
  },
  
  // Performance optimizations
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for mobile optimization
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // PWA headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Mobile optimization headers
          {
            key: 'Vary',
            value: 'User-Agent',
          },
          // Cache headers for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        source: '/icon-:size*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  images: {
    domains: [
      'logo.clearbit.com',
      'finnhub.io',
      'static.finnhub.io',
      'assets.finnhub.io'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'finnhub.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.finnhub.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.finnhub.io',
        port: '',
        pathname: '/**',
      }
    ],
    // Allow SVG images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Mobile image optimizations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  
  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Mobile-specific bundle optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Redirect configuration for mobile URLs
  async redirects() {
    return [
      // Mobile app store redirects (for future native app)
      {
        source: '/ios',
        destination: 'https://apps.apple.com/app/divi-dash/id123456789',
        permanent: false,
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: '(.*iPhone.*|.*iPad.*)',
          },
        ],
      },
      {
        source: '/android',
        destination: 'https://play.google.com/store/apps/details?id=com.divi.dash',
        permanent: false,
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: '.*Android.*',
          },
        ],
      },
    ];
  },
  
  // Bundle analyzer (enable when needed)
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      bundlePagesExternals: false,
    },
  }),
};

module.exports = withBundleAnalyzer(nextConfig);
