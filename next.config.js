/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@divly/core', '@divly/data-models'],
};

module.exports = withBundleAnalyzer(nextConfig);
