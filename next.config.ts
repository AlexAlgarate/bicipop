import type { NextConfig } from 'next';

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

export default nextConfig;
