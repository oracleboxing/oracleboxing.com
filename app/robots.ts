import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/success/', '/membership-success/', '/admin/', '/api/', '/checkout/', '/checkout-v2/', '/onboarding/', '/closed/'],
      },
    ],
    sitemap: 'https://oracleboxing.com/sitemap.xml',
  }
}
