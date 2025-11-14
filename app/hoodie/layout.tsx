import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Heavyweight Hoodie',
  description: 'Heavyweight 100% cotton hoodie built as armour for boxers. Available in Forest, Hazel, Steel, and Black. Pre-order now, ships before Christmas. Buy 2+ items and save 10%.',
  keywords: 'boxing hoodie, oracle boxing apparel, heavyweight hoodie, boxing gear, boxing clothing, premium hoodie',
  openGraph: {
    title: 'Oracle Boxing Hoodie | Premium Heavyweight Cotton',
    description: 'Heavyweight 100% cotton hoodie built as armour for boxers. Buy 2+ and save 10%.',
    url: 'https://oracleboxing.com/hoodie',
    type: 'website',
    images: [
      {
        url: 'https://media.oracleboxing.com/tracksuit/hoodie_brown_front.webp',
        width: 1200,
        height: 1200,
        alt: 'Oracle Boxing Premium Heavyweight Hoodie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oracle Boxing Hoodie | Premium Heavyweight Cotton',
    description: 'Heavyweight 100% cotton hoodie built as armour for boxers. Buy 2+ and save 10%.',
    images: ['https://media.oracleboxing.com/tracksuit/hoodie_brown_front.webp'],
  },
}

export default function HoodieLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
