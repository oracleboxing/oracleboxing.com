import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.oracleboxing.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Short Link to Home
      {
        source: '/s',
        destination: '/',
        permanent: false,
      },

      // YouTube Bio Short Links
      {
        source: '/6wc-yt-bio',
        destination: '/6wc?utm_source=youtube&utm_medium=bio&utm_content=challenge',
        permanent: false,
      },
      {
        source: '/course-yt-bio',
        destination: '/courses/bundle?utm_source=youtube&utm_medium=bio&utm_content=course',
        permanent: false,
      },
      {
        source: '/membership-yt-bio',
        destination: '/membership?utm_source=youtube&utm_medium=bio&utm_content=membership',
        permanent: false,
      },

      // YouTube VSL (Main Video) Short Links
      {
        source: '/6wc-yt-main',
        destination: '/6wc?utm_source=youtube&utm_medium=vsl&utm_content=description',
        permanent: false,
      },

      // YouTube Description (Generic) Short Links
      {
        source: '/6wc-yt-desc',
        destination: '/6wc?utm_source=youtube&utm_medium=description&utm_content=challenge',
        permanent: false,
      },
      {
        source: '/course-yt-desc',
        destination: '/courses/bundle?utm_source=youtube&utm_medium=description&utm_content=course',
        permanent: false,
      },
      {
        source: '/membership-yt-desc',
        destination: '/membership?utm_source=youtube&utm_medium=description&utm_content=membership',
        permanent: false,
      },

      // YouTube Comment Short Links
      {
        source: '/6wc-yt-comment',
        destination: '/6wc?utm_source=youtube&utm_medium=comment&utm_content=challenge',
        permanent: false,
      },

      // Instagram Bio Short Links
      {
        source: '/6wc-ig-bio',
        destination: '/6wc?utm_source=instagram&utm_medium=bio&utm_content=challenge',
        permanent: false,
      },
      {
        source: '/course-ig-bio',
        destination: '/courses/bundle?utm_source=instagram&utm_medium=bio&utm_content=course',
        permanent: false,
      },
      {
        source: '/membership-ig-bio',
        destination: '/membership?utm_source=instagram&utm_medium=bio&utm_content=membership',
        permanent: false,
      },

      // Facebook Bio Short Links
      {
        source: '/6wc-fb-bio',
        destination: '/6wc?utm_source=facebook&utm_medium=bio&utm_content=challenge',
        permanent: false,
      },
      {
        source: '/course-fb-bio',
        destination: '/courses/bundle?utm_source=facebook&utm_medium=bio&utm_content=course',
        permanent: false,
      },
      {
        source: '/membership-fb-bio',
        destination: '/membership?utm_source=facebook&utm_medium=bio&utm_content=membership',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
