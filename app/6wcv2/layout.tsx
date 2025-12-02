import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '6-Week Challenge V2 (Review) | Oracle Boxing',
  description: 'Commit $197, train for 6 weeks, complete the requirements, and get a full refund. Full Boxing Masterclass access, lifetime Boxing Roadmap, live coaching calls, and personalized feedback.',
  keywords: '6 week challenge, boxing challenge, boxing training program, money back guarantee, oracle boxing challenge',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '6-Week Challenge V2 (Review) | Oracle Boxing',
    description: 'Commit $197, train for 6 weeks, complete the requirements, and get a full refund. Limited spots available.',
    url: 'https://oracleboxing.com/6wcv2',
    siteName: 'Oracle Boxing',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://media.oracleboxing.com/Website/skool_art.webp',
        width: 1200,
        height: 630,
        alt: '6-Week Challenge - Train with Oracle Boxing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '6-Week Challenge V2 (Review) | Oracle Boxing',
    description: 'Commit $197, train for 6 weeks, complete the requirements, and get a full refund.',
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
