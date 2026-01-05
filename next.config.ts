import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Root redirect is handled by middleware for i18n support
  // The middleware will redirect / to /{locale}/game
};

export default nextConfig;
