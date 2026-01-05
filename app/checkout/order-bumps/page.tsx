'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { get6WCAddOns, getCourseOrderBump, get21DCOrderBumps, getProductById } from '@/lib/products'
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
  const [funnelType, setFunnelType] = useState<'6wc' | 'course' | '21dc'>('6wc')
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
    const funnelParam = searchParams.get('funnel') as '6wc' | 'course' | '21dc' || '6wc'

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
    } else if (funnelParam === '21dc') {
      // 21-Day Challenge funnel: Show BFFP + Tracksuit
      setOrderBumps(get21DCOrderBumps())
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
    } else if (funnelType === '21dc') {
      // 21-Day Challenge funnel: Add the selected 21DC product
      const productParam = searchParams.get('product')
      if (productParam) {
        const product = getProductById(productParam)
        if (product) {
          items.push({
            product: product,
            quantity: 1,
            price_id: product.stripe_price_id,
          })
        }
      }
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
          currency: currency,
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
      <div className="min-h-screen bg-[#FFFCF5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img
            src="https://sb.oracleboxing.com/logo/long_dark.webp"
            alt="Oracle Boxing"
            className="h-4"
          />
        </div>

        {/* Subheadline */}
        <h2 className="text-center text-[#37322F] text-sm font-medium font-sans mb-6">
          Add to your challenge?
        </h2>

        {/* Mobile Navigation - Only shown on mobile when multiple items */}
        {orderBumps.length > 1 && (
          <div className="md:hidden flex items-center justify-center gap-2 mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                currentIndex === 0
                  ? 'bg-[#FFFCF5] text-[#847971] cursor-not-allowed'
                  : 'bg-white border border-[rgba(55,50,47,0.12)] hover:bg-[rgba(55,50,47,0.05)] text-[#49423D] hover:text-[#37322F]'
              }`}
              aria-label="Previous product"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-[#605A57] min-w-[60px] text-center font-sans">
              {currentIndex + 1} / {orderBumps.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === orderBumps.length - 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                currentIndex === orderBumps.length - 1
                  ? 'bg-[#FFFCF5] text-[#847971] cursor-not-allowed'
                  : 'bg-white border border-[rgba(55,50,47,0.12)] hover:bg-[rgba(55,50,47,0.05)] text-[#49423D] hover:text-[#37322F]'
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
                  className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                    isSelected ? 'border-[#37322F] shadow-lg' : 'border-[rgba(55,50,47,0.12)] hover:shadow-md'
                  }`}
                  style={{
                    animation: 'fadeIn 0.3s ease-in-out'
                  }}
                >
                  <div className="grid gap-0">
                    {/* Product image - full width */}
                    <div className="w-full">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400'
                        }}
                      />
                    </div>

                    {/* Product info, benefits, and CTA */}
                    <div className="p-6 flex flex-col justify-center">
                      <div className="mb-5">
                        <h3 className="text-xl font-semibold text-[#37322F] mb-2 font-sans">{product.title}</h3>
                      </div>
                      <div className="space-y-2 mb-6">
                        {benefits.map((benefit: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#37322F] flex-shrink-0" strokeWidth={2.5} />
                            <span className="text-xs text-[#49423D] font-sans">{benefit}</span>
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
                                  <p className="text-lg font-bold text-[#847971] line-through font-sans">
                                    {formatPrice(totalValue, currency)}
                                  </p>
                                  <p className="text-2xl font-bold text-[#37322F] font-sans">
                                    {formatPrice(additionalCost, currency)}
                                  </p>
                                </div>
                              )
                            })()
                          ) : (
                            <p className="text-2xl font-bold text-[#37322F] font-sans">
                              {formatPrice(getProductPrice(product.metadata, currency) || product.price, currency)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleToggleBump(product.id)}
                          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all font-sans border ${
                            isSelected
                              ? 'bg-[#37322F] text-white border-[#37322F]'
                              : 'bg-[#FFFCF5] text-[#37322F] border-[#37322F] hover:bg-[#37322F] hover:text-white'
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
                  className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                    isSelected ? 'border-[#37322F] shadow-lg' : 'border-[rgba(55,50,47,0.12)] hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    {/* Product image - full width */}
                    <div className="w-full">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400'
                        }}
                      />
                    </div>

                    {/* Product info, benefits, and CTA */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-[#37322F] mb-2 font-sans">{product.title}</h3>
                        </div>
                        <div className="space-y-2 mb-6">
                          {benefits.map((benefit: string, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-[#37322F] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                              <span className="text-xs text-[#49423D] font-sans">{benefit}</span>
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
                                  <p className="text-base font-bold text-[#847971] line-through font-sans">
                                    {formatPrice(totalValue, currency)}
                                  </p>
                                  <p className="text-xl font-bold text-[#37322F] font-sans">
                                    {formatPrice(additionalCost, currency)}
                                  </p>
                                </div>
                              )
                            })()
                          ) : (
                            <p className="text-xl font-bold text-[#37322F] font-sans">
                              {formatPrice(getProductPrice(product.metadata, currency) || product.price, currency)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleToggleBump(product.id)}
                          className={`w-full px-5 py-2.5 rounded-full text-sm font-medium transition-all font-sans border ${
                            isSelected
                              ? 'bg-[#37322F] text-white border-[#37322F]'
                              : 'bg-[#FFFCF5] text-[#37322F] border-[#37322F] hover:bg-[#37322F] hover:text-white'
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

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-[rgba(55,50,47,0.12)] p-4 mb-4">
          <h3 className="text-sm font-medium text-[#37322F] mb-3 font-sans">Order Summary</h3>
          <div className="space-y-2">
            {/* Base Product */}
            {funnelType === '21dc' && (() => {
              const productParam = searchParams.get('product')
              const baseProduct = productParam ? getProductById(productParam) : null
              if (baseProduct) {
                return (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#605A57] font-sans">{baseProduct.title}</span>
                    <span className="text-[#37322F] font-medium font-sans">
                      {formatPrice(getProductPrice(baseProduct.metadata, currency) || baseProduct.price, currency)}
                    </span>
                  </div>
                )
              }
              return null
            })()}

            {/* Selected Add-ons */}
            {selectedBumps.map(bumpId => {
              const bump = orderBumps.find(b => b.id === bumpId)
              if (!bump) return null
              return (
                <div key={bumpId} className="flex justify-between items-center text-sm">
                  <span className="text-[#605A57] font-sans">{bump.title}</span>
                  <span className="text-[#37322F] font-medium font-sans">
                    {formatPrice(getProductPrice(bump.metadata, currency) || bump.price, currency)}
                  </span>
                </div>
              )
            })}

            {/* Divider */}
            <div className="border-t border-[rgba(55,50,47,0.12)] my-2"></div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-[#37322F] font-medium font-sans">Total</span>
              <span className="text-lg font-bold text-[#37322F] font-sans">
                {(() => {
                  let total = 0
                  // Add base product price
                  if (funnelType === '21dc') {
                    const productParam = searchParams.get('product')
                    const baseProduct = productParam ? getProductById(productParam) : null
                    if (baseProduct) {
                      total += getProductPrice(baseProduct.metadata, currency) || baseProduct.price
                    }
                  }
                  // Add selected bumps
                  selectedBumps.forEach(bumpId => {
                    const bump = orderBumps.find(b => b.id === bumpId)
                    if (bump) {
                      total += getProductPrice(bump.metadata, currency) || bump.price
                    }
                  })
                  return formatPrice(total, currency)
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3 px-6 bg-[#37322F] text-[#FBFAF9] font-medium text-base rounded-full shadow-[0px_2px_4px_rgba(55,50,47,0.12)] hover:bg-[#49423D] transition-all duration-200 font-sans"
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#FFFCF5] text-[#605A57] font-sans">Loading...</div>}>
      <OrderBumpsContent />
    </Suspense>
  )
}
