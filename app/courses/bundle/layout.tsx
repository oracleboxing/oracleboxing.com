import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boxing Bundle',
  description: 'Get the complete Oracle Boxing system: Boxing Masterclass, Boxing Roadmap, and Coaching Call Replays. 225+ lessons, 220+ coaching calls, lifetime access. Save $144 on the complete bundle.',
  keywords: 'boxing bundle, complete boxing course, boxing masterclass bundle, boxing training package, oracle boxing bundle',
  alternates: {
    canonical: '/courses/bundle',
  },
  openGraph: {
    title: 'Boxing Bundle',
    description: 'Get the complete Oracle Boxing system: 225+ lessons, 220+ coaching calls, lifetime access. Save $144 on the complete bundle.',
    url: 'https://oracleboxing.com/courses/bundle',
    siteName: 'Oracle Boxing',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://sb.oracleboxing.com/Website/optimized/products/obm_tn-large.webp',
        width: 1200,
        height: 630,
        alt: 'Boxing Bundle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boxing Bundle',
    description: 'Get the complete Oracle Boxing system: 225+ lessons, 220+ coaching calls, lifetime access. Save $144.',
    images: ['https://sb.oracleboxing.com/Website/optimized/products/obm_tn-large.webp'],
    creator: '@oracleboxing',
  },
}

export default function BundleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
