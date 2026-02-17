'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { trackPurchase } from '@/lib/webhook-tracking'
import Link from 'next/link'

function MembershipSuccessContent() {
  const searchParams = useSearchParams()
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    const subscriptionId = searchParams.get('subscription')

    // Fire purchase tracking
    trackPurchase(
      subscriptionId || '',
      97, // approximate - could be monthly or annual
      'USD',
      ['membership'],
      {}
    )

    // Fire Google Ads conversion
    try {
      import('@/lib/gtag').then(({ gtagPurchaseConversion }) => {
        gtagPurchaseConversion({
          value: 97,
          currency: 'USD',
          transaction_id: subscriptionId || '',
        })
      }).catch(() => {})
    } catch {}

    // Fire Facebook Pixel Purchase
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: 97,
        currency: 'USD',
        content_ids: ['membership'],
        content_type: 'product',
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* Checkmark */}
        <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-[#37322F] mb-4">
          Thanks for joining Oracle Boxing!
        </h1>

        <p className="text-[#49423D]/80 text-lg mb-6">
          Check your email for your invite to join the Skool community.
        </p>

        <p className="text-[#49423D]/60 text-sm mb-10">
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
