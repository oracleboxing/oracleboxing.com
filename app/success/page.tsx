import { Suspense } from 'react'
import { SuccessContent } from '@/components/SuccessContent'

export const metadata = {
  title: 'Purchase Successful',
  description: 'Your order has been confirmed',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string | string[]; payment_intent?: string | string[]; subscription?: string | string[]; redirect_status?: string }>
}) {
  const { session_id, payment_intent, subscription } = await searchParams

  // Handle case where params might be arrays (e.g., from PayPal redirects)
  const sessionIdStr = Array.isArray(session_id) ? session_id[0] : session_id
  const paymentIntentStr = Array.isArray(payment_intent) ? payment_intent[0] : payment_intent
  const subscriptionStr = Array.isArray(subscription) ? subscription[0] : subscription

  // Support Checkout Session IDs, PaymentIntent IDs, and Subscription IDs
  const identifier = sessionIdStr || paymentIntentStr || subscriptionStr

  if (!identifier) {
    return (
      <div className="min-h-screen bg-white flex overflow-x-hidden">
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center">
              <h1 className="text-sub font-bold text-[#37322F]">Invalid session</h1>
              <p className="text-[rgba(73,66,61,0.90)] mt-2">Please check your confirmation email for the correct link.</p>
            </div>
          </div>
        </main>
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
      </div>
    )
  }

  // Determine if this is a PaymentIntent, Subscription, or Checkout Session
  const isPaymentIntent = identifier.startsWith('pi_')
  const isSubscription = identifier.startsWith('sub_')

  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
      <main className="flex-1 min-w-0 flex flex-col">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-[rgba(73,66,61,0.90)]">Loading...</div>
          </div>
        }>
          <SuccessContent sessionId={identifier} isPaymentIntent={isPaymentIntent} isSubscription={isSubscription} />
        </Suspense>
      </main>
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
    </div>
  )
}
