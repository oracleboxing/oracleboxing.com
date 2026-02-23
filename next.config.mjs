/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sb.oracleboxing.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
    // Optimize image loading
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-slot'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // UTM Tracking Short Links
      {
        source: '/yt-bio',
        destination: '/?utm_source=youtube&utm_medium=bio',
        permanent: false,
      },
      {
        source: '/yt-desc',
        destination: '/?utm_source=youtube&utm_medium=desc',
        permanent: false,
      },
      {
        source: '/ig-bio',
        destination: '/?utm_source=ig&utm_medium=bio',
        permanent: false,
      },
      {
        source: '/tt-bio',
        destination: '/?utm_source=tiktok&utm_medium=bio',
        permanent: false,
      },
      // Customer Portal - Stripe hosted login
      {
        source: '/customer-portal',
        destination: 'https://checkout.oracleboxing.com/p/login/dR69Bm6Pg7Csavm288',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
