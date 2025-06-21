/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@divly/core', '@divly/data-models'],
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
    ]
  }
};

module.exports = withBundleAnalyzer(nextConfig);
