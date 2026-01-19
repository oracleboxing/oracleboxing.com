import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop | Oracle Boxing',
  description: 'Courses and gear to level up your boxing training',
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
