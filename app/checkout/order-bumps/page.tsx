'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { get6WCAddOns, getCourseOrderBump, getProductById } from '@/lib/products'
import { Product } from '@/lib/types'
import { getTrackingParams, getCookie } from '@/lib/tracking-cookies'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice, formatProductDescription } from '@/lib/currency'
import { trackInitiateCheckout } from '@/lib/webhook-tracking'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

// Helper function to convert markdown bold to HTML
function formatDescription(text: string) {
  // Convert **text** to <strong>text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

function OrderBumpsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currency } = useCurrency()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [funnelType, setFunnelType] = useState<'6wc' | 'course'>('6wc')
  const [orderBumps, setOrderBumps] = useState<Product[]>([])
  // Don't pre-select any order bumps (start with empty array)
  const [selectedBumps, setSelectedBumps] = useState<string[]>([])
  const [expandedBump, setExpandedBump] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
    referrer: 'direct'
  })

  useEffect(() => {
    // Get customer info from URL params
    const emailParam = searchParams.get('email')
    const nameParam = searchParams.get('name')
    const funnelParam = searchParams.get('funnel') as '6wc' | 'course' || '6wc'

    if (!emailParam || !nameParam) {
      // Redirect back to checkout if no customer info
      router.push('/checkout')
      return
    }

    setEmail(emailParam)
    setName(nameParam)
    setFunnelType(funnelParam)

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

    console.log('📊 Order bumps - Tracking params from cookies:', cookieTracking)

    // Load appropriate add-ons based on funnel type
    if (funnelParam === 'course') {
      // Course funnel: Show Oracle Boxing Bundle upgrade
      setOrderBumps(getCourseOrderBump())
    } else {
      // 6WC funnel: Show Recordings Vault + Lifetime Masterclass
      setOrderBumps(get6WCAddOns())
    }
  }, [searchParams, router])

  const handleToggleBump = (productId: string) => {
    setSelectedBumps(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        // When adding an item, automatically move to next if not showing all
        if (!showAll && currentIndex < orderBumps.length - 1) {
          setTimeout(() => {
            setCurrentIndex(currentIndex + 1)
            setExpandedBump(null)
          }, 300)
        }
        return [...prev, productId]
      }
    })
  }

  const handleNext = () => {
    if (currentIndex < orderBumps.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setExpandedBump(null)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setExpandedBump(null)
    }
  }

  const handleContinue = async () => {
    // Prevent double-clicks
    if (isLoading) return
    setIsLoading(true)

    // Build the items array for checkout
    const items = []

    // Check if user upgraded to bundle
    const upgradedToBundle = funnelType === 'course' && selectedBumps.includes('bundle')

    // Add the base product based on funnel type and upgrade status
    if (funnelType === '6wc') {
      // 6WC funnel: Add 6-Week Challenge product
      const sixWeekChallenge = getProductById('6wc')!
      items.push({
        product: sixWeekChallenge,
        quantity: 1,
        price_id: sixWeekChallenge.stripe_price_id,
      })
    } else if (upgradedToBundle) {
      // Course funnel + upgraded: Add ONLY the bundle (replace the course)
      const bundle = getProductById('bundle')!
      items.push({
        product: bundle,
        quantity: 1,
        price_id: bundle.stripe_price_id,
      })
    } else {
      // Course funnel + no upgrade: Add the original course
      const courseParam = searchParams.get('course')
      if (courseParam) {
        const course = getProductById(courseParam)
        if (course) {
          items.push({
            product: course,
            quantity: 1,
            price_id: course.stripe_price_id,
          })
        }
      }
    }

    // Add selected order bumps (EXCLUDING the bundle if already added above)
    selectedBumps.forEach(productId => {
      // Skip bundle if we already added it as the main product
      if (upgradedToBundle && productId === 'bundle') return

      const product = orderBumps.find(p => p.id === productId)
      if (product) {
        items.push({
          product: product,
          quantity: 1,
          price_id: product.stripe_price_id,
        })
      }
    })

    // Calculate total value in user's currency for accurate tracking
    let totalValue = 0
    const productIds: string[] = []

    items.forEach(item => {
      const price = getProductPrice(item.product.id, currency) || item.product.price
      console.log(`📦 Product: ${item.product.id} = ${price} ${currency}`)
      totalValue += price * item.quantity
      productIds.push(item.product.id)
    })

    console.log(`💵 Total Value: ${totalValue} ${currency}`)

    // Track initiate checkout event with all products
    const currentPage = typeof window !== 'undefined' ? window.location.pathname : '/checkout/order-bumps'
    const initialReferrer = trackingParams.referrer || 'direct'

    // Get URL parameters for tracking with intelligent fallbacks
    const funnelParam = searchParams.get('funnel') || funnelType
    const courseParam = searchParams.get('course')
    const currencyParam = searchParams.get('currency') || currency
    const sourceParam = searchParams.get('source') || 'order-bumps'

    trackInitiateCheckout(
      name,
      email,
      totalValue,
      productIds,
      currentPage,
      initialReferrer,
      {
        funnel: funnelParam,
        course: courseParam,
        currency: currencyParam,
        source: sourceParam,
      }
    )

    try {
      // Get full cookie data
      const cookieData = getCookie('ob_track')

      // Use the checkout API to create a session with all items
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          customerInfo: {
            firstName: name,
            lastName: name,
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

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || "Couldn't start checkout, try again")
      setIsLoading(false)
    }
  }

  const currentProduct = orderBumps[currentIndex]
  const visibleBumps = showAll ? orderBumps : [currentProduct]

  if (!email || !name) {
    return null
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://media.oracleboxing.com/Website/optimized/logos/long_black-large.webp"
            alt="Oracle Boxing"
            className="h-4"
          />
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-center text-gray-900 text-sm font-medium">
            {funnelType === 'course' ? 'Upgrade to the complete bundle' : 'Add to your order?'}
          </h2>
        </div>

        {/* Mobile Navigation - Only shown on mobile when multiple items */}
        {orderBumps.length > 1 && (
          <div className="md:hidden flex items-center justify-center gap-2 mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                currentIndex === 0
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
              }`}
              aria-label="Previous product"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {currentIndex + 1} / {orderBumps.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === orderBumps.length - 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                currentIndex === orderBumps.length - 1
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
              }`}
              aria-label="Next product"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Order Bumps - Grid on desktop, Carousel on mobile */}
        <div className="mb-6">
          {/* Mobile: Carousel (single item) */}
          <div className="md:hidden">
            {orderBumps[currentIndex] && (() => {
              const product = orderBumps[currentIndex]
              const isSelected = selectedBumps.includes(product.id)

              // Parse benefits from description or use a default set
              const benefits = product.description
                ? product.description.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•')).map(line => line.replace(/^[-•]\s*/, '').trim())
                : [
                    `Access to all ${product.title} content`,
                    'Lifetime updates and new additions',
                    'Watch anytime on any device',
                    '30-day money-back guarantee'
                  ]

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-black shadow-2xl' : 'shadow-sm hover:shadow-lg'
                  }`}
                  style={{
                    animation: 'fadeIn 0.3s ease-in-out'
                  }}
                >
                  <div className="grid gap-0">
                    {/* Product image */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full max-w-[280px] rounded-xl shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400'
                        }}
                      />
                    </div>

                    {/* Product info, benefits, and CTA */}
                    <div className="p-6 flex flex-col justify-center">
                      <div className="mb-5">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                        <p className="text-sm text-gray-600">{product.shortDescription}</p>
                      </div>
                      <div className="space-y-2 mb-6">
                        {benefits.slice(0, 3).map((benefit: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={2.5} />
                            <span className="text-xs text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {funnelType === 'course' && product.id === 'bundle' ? (
                            // Show total value crossed out + additional cost
                            (() => {
                              const courseParam = searchParams.get('course')
                              const bffpPrice = getProductPrice('bffp', currency) || 297
                              const brdmpPrice = getProductPrice('brdmp', currency) || 147
                              const rcvPrice = getProductPrice('rcv', currency) || 67
                              const totalValue = bffpPrice + brdmpPrice + rcvPrice
                              const bundlePrice = getProductPrice(product.metadata, currency) || product.price

                              let additionalCost = bundlePrice
                              if (courseParam) {
                                const course = getProductById(courseParam)
                                if (course) {
                                  const coursePrice = getProductPrice(course.metadata, currency) || course.price
                                  additionalCost = bundlePrice - coursePrice
                                }
                              }

                              return (
                                <div className="flex items-center gap-3">
                                  <p className="text-lg font-bold text-gray-500 line-through">
                                    {formatPrice(totalValue, currency)}
                                  </p>
                                  <p className="text-2xl font-bold text-gray-900">
                                    {formatPrice(additionalCost, currency)}
                                  </p>
                                </div>
                              )
                            })()
                          ) : (
                            <p className="text-2xl font-bold text-gray-900">
                              {formatPrice(getProductPrice(product.metadata, currency) || product.price, currency)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleToggleBump(product.id)}
                          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'bg-gray-900 text-white hover:bg-black'
                          }`}
                        >
                          {isSelected ? (product.id === 'bundle' ? '✓ Upgraded' : '✓ Added') : (product.id === 'bundle' ? 'Upgrade' : 'Add to order')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Desktop: Grid (all items) */}
          <div className={`hidden md:grid gap-4 ${
            orderBumps.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
            orderBumps.length === 2 ? 'md:grid-cols-2' :
            'md:grid-cols-3'
          }`}>
            {orderBumps.map((product) => {
              const isSelected = selectedBumps.includes(product.id)

              // Parse benefits from description or use a default set
              const benefits = product.description
                ? product.description.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•')).map(line => line.replace(/^[-•]\s*/, '').trim())
                : [
                    `Access to all ${product.title} content`,
                    'Lifetime updates and new additions',
                    'Watch anytime on any device',
                    '30-day money-back guarantee'
                  ]

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-black shadow-2xl' : 'shadow-sm hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    {/* Product image */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full max-w-[200px] rounded-xl shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400'
                        }}
                      />
                    </div>

                    {/* Product info, benefits, and CTA */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{product.title}</h3>
                          <p className="text-sm text-gray-600">{product.shortDescription}</p>
                        </div>
                        <div className="space-y-2 mb-6">
                          {benefits.slice(0, 3).map((benefit: string, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                              <span className="text-xs text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="mb-3">
                          {funnelType === 'course' && product.id === 'bundle' ? (
                            // Show total value crossed out + additional cost
                            (() => {
                              const courseParam = searchParams.get('course')
                              const bffpPrice = getProductPrice('bffp', currency) || 297
                              const brdmpPrice = getProductPrice('brdmp', currency) || 147
                              const rcvPrice = getProductPrice('rcv', currency) || 67
                              const totalValue = bffpPrice + brdmpPrice + rcvPrice
                              const bundlePrice = getProductPrice(product.metadata, currency) || product.price

                              let additionalCost = bundlePrice
                              if (courseParam) {
                                const course = getProductById(courseParam)
                                if (course) {
                                  const coursePrice = getProductPrice(course.metadata, currency) || course.price
                                  additionalCost = bundlePrice - coursePrice
                                }
                              }

                              return (
                                <div className="flex items-center gap-2">
                                  <p className="text-base font-bold text-gray-500 line-through">
                                    {formatPrice(totalValue, currency)}
                                  </p>
                                  <p className="text-xl font-bold text-gray-900">
                                    {formatPrice(additionalCost, currency)}
                                  </p>
                                </div>
                              )
                            })()
                          ) : (
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(getProductPrice(product.metadata, currency) || product.price, currency)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleToggleBump(product.id)}
                          className={`w-full px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'bg-gray-900 text-white hover:bg-black'
                          }`}
                        >
                          {isSelected ? (product.id === 'bundle' ? '✓ Upgraded' : '✓ Added') : (product.id === 'bundle' ? 'Upgrade' : 'Add to order')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
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
            'Continue to Payment'
          )}
        </button>
        </div>
      </div>
    </>
  )
}

export default function OrderBumpsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <OrderBumpsContent />
    </Suspense>
  )
}
