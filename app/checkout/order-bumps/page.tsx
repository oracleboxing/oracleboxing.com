'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react'
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

        {/* Heading with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-center text-gray-900 text-sm font-medium flex-1">
            {funnelType === 'course' ? 'Upgrade to the complete bundle' : 'Add to your order'}
          </h2>
          {!showAll && (
            <div className="flex items-center gap-2">
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
        </div>

        {/* Order Bumps */}
        <div className="space-y-4 mb-6 relative">
          {visibleBumps.map((product, index) => {
            const isExpanded = expandedBump === product.id
            const isSelected = selectedBumps.includes(product.id)

            return (
              <div
                key={product.id}
                className={`bg-white border-2 rounded-2xl p-6 transition-all duration-300 ease-in-out transform ${
                  isSelected ? 'border-[#000000] shadow-lg' : 'border-gray-200'
                } ${!showAll ? 'animate-fadeIn' : ''}`}
                style={{
                  animation: !showAll ? 'fadeIn 0.3s ease-in-out' : 'none'
                }}
              >
                {/* Product Header */}
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0 w-16 h-16">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/64'
                      }}
                    />
                  </div>

                  {/* Title, Subtitle, and Add Button */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
                      </div>
                      {/* Price */}
                      <p className="text-xl font-bold text-gray-900 flex-shrink-0">
                        {funnelType === 'course' && product.id === 'bundle' ? (
                          // Calculate additional cost for bundle upgrade
                          (() => {
                            const courseParam = searchParams.get('course')
                            if (courseParam) {
                              const course = getProductById(courseParam)
                              if (course) {
                                const bundlePrice = getProductPrice(product.metadata, currency) || product.price
                                const coursePrice = getProductPrice(course.metadata, currency) || course.price
                                const additionalCost = bundlePrice - coursePrice
                                return `+${formatPrice(additionalCost, currency)}`
                              }
                            }
                            const bundlePrice = getProductPrice(product.metadata, currency) || product.price
                            return formatPrice(bundlePrice, currency)
                          })()
                        ) : (
                          formatPrice(getProductPrice(product.metadata, currency) || product.price, currency)
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-600 flex-1">{product.shortDescription}</p>
                      {/* Chevron */}
                      <button
                        onClick={() => setExpandedBump(isExpanded ? null : product.id)}
                        className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
                        aria-label={isExpanded ? 'Hide details' : 'Show details'}
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Add/Upgrade Button - Below subtitle */}
                    <button
                      onClick={() => handleToggleBump(product.id)}
                      className={`mt-3 py-2 px-6 font-bold text-sm rounded-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#000000] text-white hover:bg-[#1a1a1a]'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      {funnelType === 'course'
                        ? (isSelected ? '✓ Upgraded' : 'Upgrade')
                        : (isSelected ? '✓ Added' : '+ Add')
                      }
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    className="mt-4 text-sm text-gray-700 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: formatDescription(formatProductDescription(product.id, product.description, currency))
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        {!showAll && orderBumps.length > 1 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            View all
          </button>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3 px-6 bg-[#000000] text-white font-bold text-base rounded-full shadow-lg hover:bg-[#1a1a1a] transition-all duration-200"
          style={{ cursor: 'pointer' }}
        >
          Continue to Payment
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
