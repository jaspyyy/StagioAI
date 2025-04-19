/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn.simpleicons.org', 
      'localhost', 
      'paddle-billing.vercel.app',
      // Allow any ngrok domain for development
      'ngrok-free.app',
      'ngrok.io'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ngrok-free.app',
      },
      {
        protocol: 'https',
        hostname: '*.ngrok.io',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
      {
        source: '/_next/static/media/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  experimental: {
    trustHostHeader: true,
  },
};

export default nextConfig;
