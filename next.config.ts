import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const useMockUpload = process.env.MOCK_SUPABASE_STORAGE === 'true';

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

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
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname:
          process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') ??
          'gqwarqgiibymlrxlklsh.supabase.co',
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
  async headers() {
    return [{ source: '/path', headers: securityHeaders }];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/sentry-tunnel',
});
