'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { getProductById } from '@/lib/products'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Currency, getProductPrice } from '@/lib/currency'
import { getTrackingParams, getCookie } from '@/lib/tracking-cookies'
import { trackInitiateCheckout } from '@/lib/webhook-tracking'

export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  const router = useRouter()
  const { currency, isLoading: currencyLoading } = useCurrency()
  const [isLoading, setIsLoading] = useState(false)
  const [productParam, setProductParam] = useState<string | null>(null)
  const [sourceParam, setSourceParam] = useState<string | null>(null)
  const [trackingParams, setTrackingParams] = useState<{
    referrer: string
    first_utm_source?: string
    first_utm_medium?: string
    first_utm_campaign?: string
    first_utm_term?: string
    first_utm_content?: string
    first_referrer_time?: string
    last_utm_source?: string
    last_utm_medium?: string
    last_utm_campaign?: string
    last_utm_term?: string
    last_utm_content?: string
    last_referrer_time?: string
  }>({
    referrer: ''
  })

  // Customer info form state
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    email: '',
  })

  // Detect product parameter from URL and capture tracking params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const product = params.get('product')
      const source = params.get('source')

      setProductParam(product)
      setSourceParam(source)

      // Get tracking params from cookies (already captured by UTMTracker)
      const cookieTracking = getTrackingParams()

      setTrackingParams({
        referrer: cookieTracking.first_referrer || 'direct',
        // First Touch Attribution
        first_utm_source: cookieTracking.first_utm_source,
        first_utm_medium: cookieTracking.first_utm_medium,
        first_utm_campaign: cookieTracking.first_utm_campaign,
        first_utm_term: cookieTracking.first_utm_term,
        first_utm_content: cookieTracking.first_utm_content,
        first_referrer_time: getCookie('ob_track')?.first_referrer_time,
        // Last Touch Attribution
        last_utm_source: cookieTracking.last_utm_source,
        last_utm_medium: cookieTracking.last_utm_medium,
        last_utm_campaign: cookieTracking.last_utm_campaign,
        last_utm_term: cookieTracking.last_utm_term,
        last_utm_content: cookieTracking.last_utm_content,
        last_referrer_time: getCookie('ob_track')?.last_referrer_time,
      })

      console.log('🏷️ Checkout page loaded')
      console.log('🏷️ Product:', product, '| Source:', source)
      console.log('📊 Tracking params from cookies:', cookieTracking)

      // Redirect if no product specified
      if (!product) {
        console.log('⚠️ No product parameter - redirecting to home')
        router.push('/')
      }
    }
  }, [router])

  // Handle contact form submission and checkout
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const fullName = customerInfo.firstName.trim()
    const email = customerInfo.email.trim()

    if (!fullName || !email) {
      toast.error('Please fill in all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Proceed to checkout
    setIsLoading(true)

    try {
      // ROUTING LOGIC - 100% URL-DRIVEN
      // ===================================================================
      // All products must have ?product=X parameter in URL
      //
      // Routing rules:
      //    - 21DC (21dc-entry) → Order bumps (BFFP + Tracksuit)
      //    - BFC (bfc, bfc-vip) → BFC Upgrade page (Standard → VIP upgrade)
      //    - Course (BFFP, Roadmap) → Order bumps
      //    - Membership (monthly, 6month, annual) → Direct to Stripe
      //    - Bundle → Direct to Stripe
      // ===================================================================

      if (!productParam) {
        toast.error('No product specified')
        setIsLoading(false)
        return
      }

      console.log('🏷️ Processing checkout for:', productParam)

      // Don't track InitiateCheckout here - it will be tracked on:
      // 1. Order bumps page (for 6wc and courses)
      // 2. When creating Stripe session (for bundle/membership direct-to-Stripe)

      // BFC-VIP → Direct to Stripe (user already chose VIP, skip upgrade page)
      if (productParam === 'bfc-vip') {
        console.log('→ Routing BFC-VIP direct to Stripe')

        const product = getProductById('bfc-vip')
        if (!product) {
          throw new Error('BFC-VIP product not found')
        }

        // Track InitiateCheckout for VIP direct purchase
        const priceInUserCurrency = getProductPrice('bfc_vip', currency) || product.price || 397

        trackInitiateCheckout(
          fullName,
          email,
          priceInUserCurrency,
          ['bfc-vip'],
          '/checkout',
          trackingParams.referrer || 'direct',
          {
            funnel: 'bfc',
            currency: currency,
            source: sourceParam || 'direct-vip-checkout',
          }
        )

        // Get full cookie data
        const cookieData = getCookie('ob_track')

        // Create checkout session for VIP
        const response = await fetch('/api/checkout/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{
              product: product,
              quantity: 1,
              price_id: product.stripe_price_id,
            }],
            currency: currency,
            customerInfo: {
              firstName: fullName,
              lastName: fullName,
              email: email,
              phone: '',
              address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'US',
              },
            },
            trackingParams: trackingParams,
            cookieData: cookieData,
            pageUrl: window.location.href,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session')
        }

        if (!data.url) {
          throw new Error('No checkout URL returned')
        }

        // Redirect to Stripe
        window.location.href = data.url
        return
      }

      // BFC (Standard) → BFC Upgrade page (show option to upgrade to VIP)
      if (productParam === 'bfc') {
        console.log('→ Routing to BFC upgrade page')
        const upgradeUrl = new URL('/checkout/bfc-upgrade', window.location.origin)
        upgradeUrl.searchParams.set('email', email)
        upgradeUrl.searchParams.set('name', fullName)
        upgradeUrl.searchParams.set('currency', currency)
        if (sourceParam) upgradeUrl.searchParams.set('source', sourceParam)

        // Pass tracking params
        upgradeUrl.searchParams.set('referrer', trackingParams.referrer)
        // First Touch
        if (trackingParams.first_utm_source) upgradeUrl.searchParams.set('first_utm_source', trackingParams.first_utm_source)
        if (trackingParams.first_utm_medium) upgradeUrl.searchParams.set('first_utm_medium', trackingParams.first_utm_medium)
        if (trackingParams.first_utm_campaign) upgradeUrl.searchParams.set('first_utm_campaign', trackingParams.first_utm_campaign)
        if (trackingParams.first_utm_term) upgradeUrl.searchParams.set('first_utm_term', trackingParams.first_utm_term)
        if (trackingParams.first_utm_content) upgradeUrl.searchParams.set('first_utm_content', trackingParams.first_utm_content)
        if (trackingParams.first_referrer_time) upgradeUrl.searchParams.set('first_referrer_time', trackingParams.first_referrer_time)
        // Last Touch
        if (trackingParams.last_utm_source) upgradeUrl.searchParams.set('last_utm_source', trackingParams.last_utm_source)
        if (trackingParams.last_utm_medium) upgradeUrl.searchParams.set('last_utm_medium', trackingParams.last_utm_medium)
        if (trackingParams.last_utm_campaign) upgradeUrl.searchParams.set('last_utm_campaign', trackingParams.last_utm_campaign)
        if (trackingParams.last_utm_term) upgradeUrl.searchParams.set('last_utm_term', trackingParams.last_utm_term)
        if (trackingParams.last_utm_content) upgradeUrl.searchParams.set('last_utm_content', trackingParams.last_utm_content)
        if (trackingParams.last_referrer_time) upgradeUrl.searchParams.set('last_referrer_time', trackingParams.last_referrer_time)

        router.push(upgradeUrl.pathname + upgradeUrl.search)
        return
      }

      // Individual Course → Order bumps
      if (['bffp', 'roadmap'].includes(productParam)) {
        console.log('→ Routing to course order-bumps')
        const orderBumpsUrl = new URL('/checkout/order-bumps', window.location.origin)
        orderBumpsUrl.searchParams.set('email', email)
        orderBumpsUrl.searchParams.set('name', fullName)
        orderBumpsUrl.searchParams.set('funnel', 'course')
        orderBumpsUrl.searchParams.set('course', productParam)
        orderBumpsUrl.searchParams.set('currency', currency)
        if (sourceParam) orderBumpsUrl.searchParams.set('source', sourceParam)

        // Pass tracking params
        orderBumpsUrl.searchParams.set('referrer', trackingParams.referrer)
        // First Touch
        if (trackingParams.first_utm_source) orderBumpsUrl.searchParams.set('first_utm_source', trackingParams.first_utm_source)
        if (trackingParams.first_utm_medium) orderBumpsUrl.searchParams.set('first_utm_medium', trackingParams.first_utm_medium)
        if (trackingParams.first_utm_campaign) orderBumpsUrl.searchParams.set('first_utm_campaign', trackingParams.first_utm_campaign)
        if (trackingParams.first_utm_term) orderBumpsUrl.searchParams.set('first_utm_term', trackingParams.first_utm_term)
        if (trackingParams.first_utm_content) orderBumpsUrl.searchParams.set('first_utm_content', trackingParams.first_utm_content)
        if (trackingParams.first_referrer_time) orderBumpsUrl.searchParams.set('first_referrer_time', trackingParams.first_referrer_time)
        // Last Touch
        if (trackingParams.last_utm_source) orderBumpsUrl.searchParams.set('last_utm_source', trackingParams.last_utm_source)
        if (trackingParams.last_utm_medium) orderBumpsUrl.searchParams.set('last_utm_medium', trackingParams.last_utm_medium)
        if (trackingParams.last_utm_campaign) orderBumpsUrl.searchParams.set('last_utm_campaign', trackingParams.last_utm_campaign)
        if (trackingParams.last_utm_term) orderBumpsUrl.searchParams.set('last_utm_term', trackingParams.last_utm_term)
        if (trackingParams.last_utm_content) orderBumpsUrl.searchParams.set('last_utm_content', trackingParams.last_utm_content)
        if (trackingParams.last_referrer_time) orderBumpsUrl.searchParams.set('last_referrer_time', trackingParams.last_referrer_time)

        router.push(orderBumpsUrl.pathname + orderBumpsUrl.search)
        return
      }

      // 21-Day Challenge products → Order bumps (BFFP + Tracksuit)
      if (productParam === '21dc-entry') {
        console.log('→ Routing 21-Day Challenge to order-bumps')
        const orderBumpsUrl = new URL('/checkout/order-bumps', window.location.origin)
        orderBumpsUrl.searchParams.set('email', email)
        orderBumpsUrl.searchParams.set('name', fullName)
        orderBumpsUrl.searchParams.set('funnel', '21dc')
        orderBumpsUrl.searchParams.set('product', productParam)
        orderBumpsUrl.searchParams.set('currency', currency)
        if (sourceParam) orderBumpsUrl.searchParams.set('source', sourceParam)

        // Pass tracking params
        orderBumpsUrl.searchParams.set('referrer', trackingParams.referrer)
        // First Touch
        if (trackingParams.first_utm_source) orderBumpsUrl.searchParams.set('first_utm_source', trackingParams.first_utm_source)
        if (trackingParams.first_utm_medium) orderBumpsUrl.searchParams.set('first_utm_medium', trackingParams.first_utm_medium)
        if (trackingParams.first_utm_campaign) orderBumpsUrl.searchParams.set('first_utm_campaign', trackingParams.first_utm_campaign)
        if (trackingParams.first_utm_term) orderBumpsUrl.searchParams.set('first_utm_term', trackingParams.first_utm_term)
        if (trackingParams.first_utm_content) orderBumpsUrl.searchParams.set('first_utm_content', trackingParams.first_utm_content)
        if (trackingParams.first_referrer_time) orderBumpsUrl.searchParams.set('first_referrer_time', trackingParams.first_referrer_time)
        // Last Touch
        if (trackingParams.last_utm_source) orderBumpsUrl.searchParams.set('last_utm_source', trackingParams.last_utm_source)
        if (trackingParams.last_utm_medium) orderBumpsUrl.searchParams.set('last_utm_medium', trackingParams.last_utm_medium)
        if (trackingParams.last_utm_campaign) orderBumpsUrl.searchParams.set('last_utm_campaign', trackingParams.last_utm_campaign)
        if (trackingParams.last_utm_term) orderBumpsUrl.searchParams.set('last_utm_term', trackingParams.last_utm_term)
        if (trackingParams.last_utm_content) orderBumpsUrl.searchParams.set('last_utm_content', trackingParams.last_utm_content)
        if (trackingParams.last_referrer_time) orderBumpsUrl.searchParams.set('last_referrer_time', trackingParams.last_referrer_time)

        router.push(orderBumpsUrl.pathname + orderBumpsUrl.search)
        return
      }

      // Bundle or Membership → Direct to Stripe
      if (['bundle', 'membership-monthly', 'membership-6month', 'membership-annual'].includes(productParam)) {
        console.log('→ Routing direct to Stripe')

        // Get product from products.ts
        const product = getProductById(productParam)
        if (!product) {
          throw new Error(`Product not found: ${productParam}`)
        }

        // Track InitiateCheckout for direct-to-Stripe products (no order bumps)
        // Calculate price in user's actual currency for accurate tracking
        const priceInUserCurrency = product.type === 'membership'
          ? product.price  // Memberships are USD-only
          : (getProductPrice(productParam, currency) || product.price || 0)

        const currentPage = typeof window !== 'undefined' ? window.location.pathname : '/checkout'
        const initialReferrer = trackingParams.referrer || 'direct'

        // Intelligent funnel detection based on product type and ID
        let funnelType = 'direct'
        if (product.type === 'membership') {
          funnelType = 'membership'
        } else if (['bfc', 'bfc-vip'].includes(productParam)) {
          funnelType = 'bfc'
        } else if (productParam === 'bundle') {
          funnelType = 'bundle'
        } else if (['bffp', 'roadmap', 'vault'].includes(productParam)) {
          funnelType = 'course'
        }

        trackInitiateCheckout(
          fullName,
          email,
          priceInUserCurrency,
          [productParam],
          currentPage,
          initialReferrer,
          {
            funnel: funnelType,
            course: (['bffp', 'roadmap', 'vault'].includes(productParam)) ? productParam : null,
            currency: currency,
            source: sourceParam || 'direct-checkout',
          }
        )

        // Get full cookie data
        const cookieData = getCookie('ob_track')

        // Create checkout session with single product
        const response = await fetch('/api/checkout/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{
              product: product,
              quantity: 1,
              price_id: product.stripe_price_id,
            }],
            currency: currency,
            customerInfo: {
              firstName: fullName,
              lastName: fullName,
              email: email,
              phone: '',
              address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'US',
              },
            },
            trackingParams: trackingParams,
            cookieData: cookieData,
            pageUrl: window.location.href,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session')
        }

        if (!data.url) {
          throw new Error('No checkout URL returned')
        }

        // Redirect to Stripe
        window.location.href = data.url
        return
      }

      // Unknown product
      toast.error(`Unknown product: ${productParam}`)
      setIsLoading(false)
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || "Couldn't start checkout, try again")
      setIsLoading(false)
    }
  }

  // Allow rendering even if cart is empty (for 6WC direct flow)
  // if (items.length === 0) {
  //   return null
  // }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated flowing ribbons background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ribbon ribbon-1" />
        <div className="ribbon ribbon-2" />
        <div className="ribbon ribbon-3" />
        <div className="ribbon ribbon-4" />
        <div className="ribbon ribbon-5" />
        <div className="ribbon ribbon-6" />
      </div>

      {/* Back link */}
      <a href="/" className="absolute top-4 left-4 text-white/70 text-sm font-medium hover:text-white transition-colors z-10">
        ← Back
      </a>

      {/* Card */}
      <div className="w-full max-w-md lg:max-w-3xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 lg:p-12 relative z-10">
        <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto">
          {/* Logo */}
          <div className="flex justify-start mb-8">
            <img
              src="https://sb.oracleboxing.com/logo/icon_dark.webp"
              alt="Oracle Boxing"
              className="w-10 h-auto"
            />
          </div>

          {/* Heading */}
          <h1 className="text-left text-3xl md:text-4xl font-normal leading-tight mb-6 font-serif">
            <span className="text-[#37322F]">Earn</span><br />
            <span className="text-[#9CABA8]">Your Place.</span>
          </h1>

          {/* Description */}
          <p className="text-left text-[#605A57] text-sm md:text-base font-normal leading-relaxed mb-10">
            Join the 21-Day Challenge and prove you have what it takes. Show up, put in the work, and earn your place in Oracle Boxing.
          </p>

          {/* Full Name Input */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-[#49423D] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              value={customerInfo.firstName}
              onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
              className="w-full px-5 py-3 bg-white border border-[rgba(55,50,47,0.20)] rounded-full focus:ring-2 focus:ring-[#37322F] focus:border-transparent transition-all"
              placeholder="John Doe"
              required
              style={{ cursor: 'text' }}
            />
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-[#49423D] mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              className="w-full px-5 py-3 bg-white border border-[rgba(55,50,47,0.20)] rounded-full focus:ring-2 focus:ring-[#37322F] focus:border-transparent transition-all"
              placeholder="your@email.com"
              required
              style={{ cursor: 'text' }}
            />
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 px-6 rounded-full font-medium text-base shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] transition-all duration-200 flex items-center justify-center ${
              isLoading
                ? 'bg-[#847971] cursor-not-allowed'
                : 'bg-[#37322F] hover:bg-[#37322f]/90 cursor-pointer'
            } text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <span className="font-medium">Continue</span>
                <span className="text-white/40 mx-3">|</span>
                <span className="w-5 h-5 overflow-hidden relative">
                  <span className="arrow-container flex items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0"
                    >
                      <path
                        d="M4 10H16M16 10L11 5M16 10L11 15"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 ml-1"
                    >
                      <path
                        d="M4 10H16M16 10L11 5M16 10L11 15"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </>
            )}
          </button>

          {/* Email consent */}
          <p className="text-left text-[#847971] text-xs mt-4 whitespace-nowrap">
            I agree to be contacted by email with updates and offers.
          </p>
        </form>
      </div>

      <style jsx>{`
        .ribbon {
          position: absolute;
          width: 200%;
          height: 150px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,252,245,0.15) 20%,
            rgba(255,252,245,0.3) 50%,
            rgba(255,252,245,0.15) 80%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(20px);
          box-shadow: 0 0 60px 30px rgba(255, 252, 245, 0.15);
        }
        /* Hide heavy animations on mobile to prevent Safari crashes */
        @media (max-width: 768px) {
          .ribbon {
            display: none;
          }
        }
        .ribbon-1 {
          top: 5%;
          left: -50%;
          transform: rotate(-15deg);
          animation: drift1 12s ease-in-out infinite;
        }
        .ribbon-2 {
          top: 25%;
          left: -30%;
          height: 200px;
          transform: rotate(10deg);
          animation: drift2 15s ease-in-out infinite;
          animation-delay: -3s;
        }
        .ribbon-3 {
          top: 50%;
          left: -40%;
          height: 180px;
          transform: rotate(-8deg);
          animation: drift3 11s ease-in-out infinite;
          animation-delay: -5s;
        }
        .ribbon-4 {
          top: 70%;
          left: -60%;
          height: 160px;
          transform: rotate(20deg);
          animation: drift1 14s ease-in-out infinite;
          animation-delay: -8s;
        }
        .ribbon-5 {
          top: 85%;
          left: -20%;
          height: 140px;
          transform: rotate(-12deg);
          animation: drift2 12s ease-in-out infinite;
          animation-delay: -4s;
        }
        .ribbon-6 {
          top: 40%;
          left: -50%;
          height: 220px;
          transform: rotate(5deg);
          animation: drift3 16s ease-in-out infinite;
          animation-delay: -10s;
        }
        @keyframes drift1 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-15deg);
            opacity: 0.8;
          }
          50% {
            transform: translateX(60vw) translateY(30px) rotate(-10deg);
            opacity: 1;
          }
        }
        @keyframes drift2 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(10deg);
            opacity: 0.75;
          }
          50% {
            transform: translateX(50vw) translateY(-40px) rotate(15deg);
            opacity: 1;
          }
        }
        @keyframes drift3 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-8deg);
            opacity: 0.7;
          }
          50% {
            transform: translateX(55vw) translateY(20px) rotate(-5deg);
            opacity: 0.95;
          }
        }
        .arrow-container {
          transition: transform 0.3s ease;
        }
        button:hover .arrow-container {
          animation: scrollArrow 0.3s ease forwards;
        }
        @keyframes scrollArrow {
          0% {
            transform: translateX(-24px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
