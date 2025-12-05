import { Suspense } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SuccessContent } from '@/components/SuccessContent'

export const metadata = {
  title: 'Order Successful',
  description: 'Your order has been confirmed',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Invalid session</h1>
          <p className="text-gray-600 mt-2">Please check your confirmation email for the correct link.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
        <SuccessContent sessionId={session_id} />
      </Suspense>

      <Footer />
    </div>
  )
}
