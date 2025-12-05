import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '6-Week Challenge',
  description: '6-week boxing training program with full money-back guarantee when you finish. Learn proper technique, master fundamentals, and transform your boxing. Starts December 2nd.',
  keywords: 'black friday challenge, boxing challenge, boxing training program, money back guarantee, oracle boxing, learn boxing online, boxing fundamentals, 6 week challenge',
  alternates: {
    canonical: '/6wc',
  },
  openGraph: {
    title: '6-Week Challenge',
    description: '6-week boxing training program with full money-back guarantee when you finish. Starts December 2nd.',
    url: 'https://oracleboxing.com/6wc',
    siteName: 'Oracle Boxing',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://media.oracleboxing.com/Website/skool_art.webp',
        width: 1200,
        height: 630,
        alt: '6-Week Challenge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '6-Week Challenge',
    description: '6-week boxing training program with full money-back guarantee when you finish. Starts December 2nd.',
    images: ['https://media.oracleboxing.com/Website/skool_art.webp'],
    creator: '@oracleboxing',
  },
}

export default function SixWCLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
