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

    // Prevent double-clicks
    if (isLoading) return

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
      //    - 6WC → Order bumps (Recordings Vault + Lifetime BFFP)
      //    - BFC (bfc, bfc-vip) → BFC Upgrade page (Standard → VIP upgrade)
      //    - Course (BFFP, Roadmap, Vault) → Order bumps (6-Week Membership)
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

      // 6WC → Order bumps
      if (productParam === '6wc') {
        console.log('→ Routing to 6WC order-bumps')
        const orderBumpsUrl = new URL('/checkout/order-bumps', window.location.origin)
        orderBumpsUrl.searchParams.set('email', email)
        orderBumpsUrl.searchParams.set('name', fullName)
        orderBumpsUrl.searchParams.set('funnel', '6wc')
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
        } else if (productParam === '6wc') {
          funnelType = '6wc'
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleContactSubmit}>
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="https://media.oracleboxing.com/Website/optimized/logos/long_black-large.webp"
              alt="Oracle Boxing"
              className="h-4"
            />
          </div>

          {/* Heading */}
          <p className="text-center text-gray-900 text-sm font-medium mb-8">
            Just a few details to get started
          </p>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              className="w-full px-5 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all"
              placeholder="your@email.com"
              required
              style={{ cursor: 'text' }}
            />
          </div>

          {/* Full Name Input */}
          <div className="mb-6">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              value={customerInfo.firstName}
              onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
              className="w-full px-5 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all"
              placeholder="John Doe"
              required
              style={{ cursor: 'text' }}
            />
          </div>

          {/* Next Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 font-bold text-base rounded-full shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#000000] hover:bg-[#1a1a1a] cursor-pointer'
            } text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Next'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
