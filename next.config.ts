import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const useMockUpload = process.env.MOCK_SUPABASE_STORAGE === 'true';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  poweredByHeader: false,
  turbopack: {
    resolveAlias: useMockUpload
      ? {
          '@/infrastructure/db/supabase/upload-image':
            './src/infrastructure/db/supabase/__mocks__/upload-image.ts',
        }
      : {},
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/sentry-tunnel',
});
