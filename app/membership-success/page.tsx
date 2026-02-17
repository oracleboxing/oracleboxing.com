'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { trackPurchase } from '@/lib/webhook-tracking'
import Link from 'next/link'

function MembershipSuccessContent() {
  const searchParams = useSearchParams()
  const tracked = useRef(false)
  const activated = useRef(false)
  const [activating, setActivating] = useState(true)

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent')

    // Activate membership and then fire tracking with real amount
    if (!activated.current && paymentIntentId) {
      activated.current = true
      fetch('/api/checkout-v2/activate-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('Membership activation:', data)
          setActivating(false)

          // Fire tracking with real amount from activation response
          if (!tracked.current) {
            tracked.current = true
            const amount = data.amount ? data.amount / 100 : 97
            const plan = data.plan || 'monthly'
            const productIds = data.productIds || ['membership']

            trackPurchase(paymentIntentId, amount, 'USD', productIds, {})

            try {
              import('@/lib/gtag').then(({ gtagPurchase }) => {
                gtagPurchase({
                  value: amount,
                  currency: 'USD',
                  transaction_id: paymentIntentId,
                  items: [{ item_id: `membership-${plan}`, item_name: `Oracle Membership (${plan})`, price: amount, quantity: 1 }],
                })
              }).catch(() => {})
            } catch {}

            if (typeof window !== 'undefined' && (window as any).fbq) {
              (window as any).fbq('track', 'Purchase', {
                value: amount,
                currency: 'USD',
                content_ids: productIds,
                content_type: 'product',
              })
            }
          }
        })
        .catch(err => {
          console.error('Membership activation error:', err)
          setActivating(false)
        })
    } else {
      setActivating(false)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#37322F] mb-4 whitespace-nowrap">
          Thanks for joining Oracle Boxing!
        </h1>

        <p className="text-[#49423D]/80 text-lg mb-6 whitespace-nowrap">
          Check your email for your invite to join the Skool community.
        </p>

        {activating && (
          <p className="text-[#49423D]/40 text-xs mb-4">Setting up your membership...</p>
        )}

        <p className="text-[#49423D]/60 text-sm mb-10 whitespace-nowrap">
          If you have any questions, reach out to{' '}
          <a href="mailto:team@oracleboxing.com" className="text-[#9CABA8] underline">
            team@oracleboxing.com
          </a>
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#37322F] text-white rounded-lg text-sm font-medium hover:bg-[#49423D] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function MembershipSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#49423D]/60">Loading...</p>
      </div>
    }>
      <MembershipSuccessContent />
    </Suspense>
  )
}
