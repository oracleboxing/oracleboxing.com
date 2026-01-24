'use client'

import { useState, useEffect } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { formatPrice, getProductPrice } from '@/lib/currency'
import { CAMPAIGN_ACTIVE, getCurrentSpots, CAMPAIGN_CONFIG } from '@/lib/campaign'
import { ENROLLMENT_CLOSED, getCheckoutUrl } from '@/lib/enrollment'
import { trackAddToCart } from '@/lib/webhook-tracking'

export default function StickyMobileCTA() {
  const { currency } = useCurrency()
  const price = getProductPrice('21dc_entry', currency) || 147
  const spots = getCurrentSpots()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past hero (approximately 500px)
      const scrollY = window.scrollY
      setIsVisible(scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't show if enrollment is closed or campaign is inactive
  if (ENROLLMENT_CLOSED || !CAMPAIGN_ACTIVE) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Gradient fade at top */}
      <div className="h-4 bg-gradient-to-t from-white to-transparent" />

      {/* CTA Bar */}
      <div className="bg-white border-t border-[rgba(55,50,47,0.12)] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-3">
          {/* Price and spots info */}
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-[#37322F]" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
              {formatPrice(price, currency)}
            </span>
            <span className="text-xs text-[#49423D]/70">
              {spots}/{CAMPAIGN_CONFIG.totalSpots} spots left
            </span>
          </div>

          {/* CTA Button */}
          <a
            href={getCheckoutUrl()}
            onClick={() => trackAddToCart('21dc-entry', '21-Day Challenge', price, currency, 'sticky-mobile')}
            className="flex-shrink-0 bg-[#37322F] text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#37322f]/90 transition-colors"
          >
            Join Now
          </a>
        </div>
      </div>
    </div>
  )
}
