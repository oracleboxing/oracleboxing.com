import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '',
    description: '',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: '',
    description: '',
    images: [],
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
