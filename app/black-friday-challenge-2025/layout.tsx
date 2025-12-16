import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Black Friday Challenge | Oracle Boxing',
  description: '6-week boxing training program with full money-back guarantee when you finish. Learn proper technique, master fundamentals, and transform your boxing. Starts December 2nd.',
  keywords: 'black friday challenge, boxing challenge, boxing training program, money back guarantee, oracle boxing, learn boxing online, boxing fundamentals, 6 week challenge',
  alternates: {
    canonical: '/6wc',
  },
  openGraph: {
    title: 'Black Friday Challenge | Oracle Boxing',
    description: '6-week boxing training program with full money-back guarantee when you finish. Starts December 2nd.',
    url: 'https://oracleboxing.com/6wc',
    siteName: 'Oracle Boxing',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://sb.oracleboxing.com/Website/skool_art.webp',
        width: 1200,
        height: 630,
        alt: 'Black Friday Challenge - Train with Oracle Boxing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Black Friday Challenge | Oracle Boxing',
    description: '6-week boxing training program with full money-back guarantee when you finish. Starts December 2nd.',
    images: ['https://sb.oracleboxing.com/Website/skool_art.webp'],
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
