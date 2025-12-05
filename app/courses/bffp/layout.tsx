import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boxing Masterclass',
  description: 'Master the science of boxing through 26 comprehensive lessons covering mind, body, movement, tactics, and conditioning. The deepest truths of the sweet science, boiled down to their simplest form.',
  keywords: 'boxing masterclass, boxing theory, boxing technique, boxing training, boxing fundamentals, oracle boxing',
  alternates: {
    canonical: '/courses/bffp',
  },
  openGraph: {
    title: 'Boxing Masterclass',
    description: 'Master the science of boxing through 26 comprehensive lessons covering mind, body, movement, tactics, and conditioning.',
    url: 'https://oracleboxing.com/courses/bffp',
    siteName: 'Oracle Boxing',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://media.oracleboxing.com/Website/optimized/products/bffp_tn5-large.webp',
        width: 1200,
        height: 630,
        alt: 'Boxing Masterclass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boxing Masterclass',
    description: 'Master the science of boxing through 26 comprehensive lessons covering mind, body, movement, tactics, and conditioning.',
    images: ['https://media.oracleboxing.com/Website/optimized/products/bffp_tn5-large.webp'],
    creator: '@oracleboxing',
  },
}

export default function BFFPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
