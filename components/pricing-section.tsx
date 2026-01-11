"use client"

import Link from "next/link"
import { useCurrency } from "@/contexts/CurrencyContext"
import { getProductPrice, formatPrice } from "@/lib/currency"
import { useAnalytics } from "@/hooks/useAnalytics"
import { generateEventId } from "@/lib/tracking-cookies"

// Temporary flag to disable enrollment
const ENROLLMENT_CLOSED = true

export default function PricingSection() {
  const { currency, isLoading } = useCurrency()
  const { trackAddToCart } = useAnalytics()

  // Handle AddToCart tracking when user clicks to go to checkout
  const handleCheckoutClick = (productId: string, productName: string, buttonLocation: string) => {
    const price = getProductPrice('21dc_entry', currency) || 147
    const eventId = generateEventId()

    // Track AddToCart in Vercel Analytics
    trackAddToCart({
      product_id: productId,
      product_name: productName,
      value: price,
      currency: currency,
      button_location: buttonLocation,
      funnel: '21dc',
    })

    // Track AddToCart in Facebook Pixel (browser-side)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        value: price,
        currency: currency,
        button_location: buttonLocation,
      }, {
        eventID: eventId
      })
      console.log('📱 Facebook Pixel AddToCart event sent:', { productId, eventId })
    }

    // Send to Facebook Conversions API (server-side)
    let cookieData = {}
    let fbclid = null

    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {} as Record<string, string>)

      const obTrackCookie = cookies['ob_track']
      if (obTrackCookie) {
        try {
          cookieData = JSON.parse(decodeURIComponent(obTrackCookie))
        } catch (e) {
          console.warn('Failed to parse tracking cookie:', e)
        }
      }
      fbclid = cookies['fbclid'] || null
    }

    fetch('/api/facebook-addtocart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        content_ids: [productId],
        content_name: productName,
        value: price,
        currency: currency,
        button_location: buttonLocation,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        cookie_data: cookieData,
        fbclid: fbclid,
      }),
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send AddToCart to Facebook CAPI:', error)
    })

    console.log('🛒 AddToCart tracked:', { productId, productName, price, currency, buttonLocation })
  }
  return (
    <div id="pricing" className="w-full relative overflow-hidden flex flex-col justify-center items-center scroll-mt-8 border-b border-[rgba(55,50,47,0.12)]">
      {/* Diagonal stripes background - CSS gradient instead of DOM elements */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 15px,
            rgba(3,7,18,0.08) 15px,
            rgba(3,7,18,0.08) 16px
          )`
        }}
      />

      {/* Content with solid background */}
      <div className="mx-0 sm:mx-4 md:mx-8 lg:mx-12 my-0 self-stretch relative bg-white sm:border border-[rgba(55,50,47,0.12)] py-12 sm:py-16 md:py-24 flex flex-col justify-center items-center gap-8 sm:gap-10 md:gap-12 z-10">
        {/* Header */}
        <div className="w-full max-w-[500px] text-center px-4 flex flex-col gap-2">
          <p className="text-[#37322F] text-xl sm:text-2xl md:text-3xl font-normal font-serif">
            Earn Your Place.
          </p>
          <p className="text-[#FF8000] text-base sm:text-lg font-medium font-sans">
            Win Your Money Back
          </p>
        </div>

        {/* Pricing Card - Full Width */}
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-full max-w-[800px] bg-[#37322F] rounded-2xl overflow-hidden shadow-xl">
            {/* Card Content */}
            <div className="px-5 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 flex flex-col gap-6 sm:gap-8">
              {/* Thumbnail */}
              <div className="flex justify-center">
                <img
                  src="https://sb.oracleboxing.com/Website/skool_art2.webp"
                  alt="21-Day Challenge"
                  className="w-full max-w-[320px] sm:max-w-[400px] rounded-xl shadow-lg"
                />
              </div>

              {/* Header */}
              <div className="flex flex-col gap-2 text-center">
                <div className="text-[#FBFAF9] text-2xl sm:text-3xl md:text-4xl font-semibold font-sans">
                  21-Day Challenge
                </div>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1 text-center">
                <div className="flex items-baseline justify-center gap-2">
                  <span className={`text-[#F0EFEE] text-5xl sm:text-6xl md:text-7xl font-medium font-serif ${ENROLLMENT_CLOSED ? 'blur-md select-none' : ''}`}>
                    {isLoading ? '...' : formatPrice(getProductPrice('21dc_entry', currency) || 147, currency)}
                  </span>
                </div>
                <div className="text-[#847971] text-sm font-medium font-sans">
                  one-time payment
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col items-center gap-3">
                {ENROLLMENT_CLOSED ? (
                  <div className="w-full max-w-[400px] px-8 py-4 sm:py-5 bg-[#6B6560] rounded-lg flex flex-col justify-center items-center cursor-not-allowed opacity-60">
                    <span className="text-[#A39E9A] text-base sm:text-lg font-semibold font-sans">
                      Join the Challenge
                    </span>
                    <span className="text-[#847971] text-xs font-medium font-sans">
                      Temporarily Closed
                    </span>
                  </div>
                ) : (
                  <Link
                    href="/checkout-v2"
                    onClick={() => handleCheckoutClick('21dc-entry', '21-Day Challenge - Entry', 'pricing-card')}
                    className="w-full max-w-[400px] px-8 py-4 sm:py-5 bg-[#FBFAF9] hover:bg-white transition-colors rounded-lg flex justify-center items-center shadow-[0px_2px_4px_rgba(55,50,47,0.12)]"
                  >
                    <span className="text-[#37322F] text-base sm:text-lg font-semibold font-sans">
                      Join the Challenge
                    </span>
                  </Link>
                )}
              </div>

              {/* Payment Icons */}
              <div className="flex justify-center items-center gap-3 sm:gap-4">
                <img
                  loading="lazy"
                  alt="Visa & Mastercard"
                  src="https://sb.oracleboxing.com/Website/payment1.svg"
                  className="h-6 sm:h-7"
                />
                <img
                  loading="lazy"
                  alt="Apple Pay & Google Pay"
                  src="https://sb.oracleboxing.com/Website/payment2.svg"
                  className="h-6 sm:h-7"
                />
                <img
                  loading="lazy"
                  alt="PayPal"
                  src="https://sb.oracleboxing.com/Website/paypal2.svg"
                  className="h-5 sm:h-6"
                />
                <img
                  loading="lazy"
                  src="https://sb.oracleboxing.com/Website/klarna.svg"
                  alt="Klarna"
                  className="h-5 sm:h-6"
                />
              </div>

              {/* Features - Two columns on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[rgba(255,255,255,0.1)]">
                {[
                  "11 Live Classes Per Week",
                  "Private Community Access",
                  "Boxing Roadmap Course",
                  "1-on-1 Graduation Call",
                  "Win Your Money Back Guarantee",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="#FF8000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[#F0EFEE] text-base font-medium font-sans">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
