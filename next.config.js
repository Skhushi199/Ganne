/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hofnyntythrxuoygsewl.supabase.co',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
