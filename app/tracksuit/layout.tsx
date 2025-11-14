import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Heavyweight Tracksuit',
  description: 'Heavyweight 100% cotton tracksuit built as armour for boxers. Includes hoodie and joggers. Available in 4 colors. Pre-order now, ships before Christmas. Buy 2+ items and save 10%.',
  keywords: 'boxing tracksuit, oracle boxing apparel, heavyweight tracksuit, boxing gear, boxing clothing, premium tracksuit',
  openGraph: {
    title: 'Oracle Boxing Tracksuit | Premium Heavyweight Set',
    description: 'Heavyweight 100% cotton tracksuit built as armour. Hoodie + Joggers. Buy 2+ and save 10%.',
    url: 'https://oracleboxing.com/tracksuit',
    type: 'website',
    images: [
      {
        url: 'https://media.oracleboxing.com/tracksuit/hoodie_brown_front.webp',
        width: 1200,
        height: 1200,
        alt: 'Oracle Boxing Premium Heavyweight Tracksuit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oracle Boxing Tracksuit | Premium Heavyweight Set',
    description: 'Heavyweight 100% cotton tracksuit built as armour. Hoodie + Joggers. Buy 2+ and save 10%.',
    images: ['https://media.oracleboxing.com/tracksuit/hoodie_brown_front.webp'],
  },
}

export default function TracksuitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
