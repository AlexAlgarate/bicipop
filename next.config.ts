import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
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
};

export default nextConfig;
