import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boxing Roadmap',
  description: 'Follow a clear 5-phase system with 75 structured lessons that takes you from your first stance to sparring-ready. Every move, every drill, in the right order.',
  keywords: 'boxing roadmap, boxing training program, boxing phases, boxing drills, learn boxing, oracle boxing',
  alternates: {
    canonical: '/courses/roadmap',
  },
  openGraph: {
    title: 'Boxing Roadmap',
    description: 'Follow a clear 5-phase system with 75 structured lessons that takes you from your first stance to sparring-ready.',
    url: 'https://oracleboxing.com/courses/roadmap',
    siteName: 'Oracle Boxing',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://media.oracleboxing.com/Website/optimized/products/tbrtn5hq-large.webp',
        width: 1200,
        height: 630,
        alt: 'Boxing Roadmap',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boxing Roadmap',
    description: 'Follow a clear 5-phase system with 75 structured lessons that takes you from your first stance to sparring-ready.',
    images: ['https://media.oracleboxing.com/Website/optimized/products/tbrtn5hq-large.webp'],
    creator: '@oracleboxing',
  },
}

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
