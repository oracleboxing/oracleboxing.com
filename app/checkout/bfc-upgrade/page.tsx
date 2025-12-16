'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Crown } from 'lucide-react'
import { toast } from 'sonner'

import { getProductById } from '@/lib/products'
import { getTrackingParams, getCookie } from '@/lib/tracking-cookies'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice } from '@/lib/currency'
import { trackInitiateCheckout } from '@/lib/webhook-tracking'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

// Helper function to convert markdown bold to HTML
function formatDescription(text: string) {
  // Convert **text** to <strong>text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

function BFCUpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currency } = useCurrency()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isVIPSelected, setIsVIPSelected] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
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

    if (!emailParam || !nameParam) {
      // Redirect back to checkout if no customer info
      router.push('/checkout')
      return
    }

    setEmail(emailParam)
    setName(nameParam)

    // Get tracking params from cookies
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

    console.log('📊 BFC Upgrade - Tracking params from cookies:', cookieTracking)
  }, [searchParams, router])

  const handleContinue = async () => {
    setIsProcessing(true)

    try {
      const items = []

      // Add the appropriate product
      const productId = isVIPSelected ? 'bfc-vip' : 'bfc'
      const product = getProductById(productId)

      if (!product) {
        throw new Error(`Product not found: ${productId}`)
      }

      items.push({
        product: product,
        quantity: 1,
        price_id: product.stripe_price_id,
      })

      // Calculate total value in user's currency for accurate tracking
      const totalValue = getProductPrice(product.metadata, currency) || product.price
      const productIds = [product.id]

      console.log(`📦 Product: ${product.id} = ${totalValue} ${currency}`)

      // Track initiate checkout event
      const currentPage = typeof window !== 'undefined' ? window.location.pathname : '/checkout/bfc-upgrade'
      const initialReferrer = trackingParams.referrer || 'direct'
      const currencyParam = searchParams.get('currency') || currency
      const sourceParam = searchParams.get('source') || 'bfc-upgrade'

      trackInitiateCheckout(
        name,
        email,
        totalValue,
        productIds,
        currentPage,
        initialReferrer,
        {
          funnel: 'bfc',
          currency: currencyParam,
          source: isVIPSelected ? 'bfc-vip-upgrade' : 'bfc-standard',
        }
      )

      // Get full cookie data
      const cookieData = getCookie('ob_track')

      // Create checkout session
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
      setIsProcessing(false)
    }
  }

  const bfcPrice = getProductPrice('bfc', currency) || 97
  const vipPrice = getProductPrice('bfc_vip', currency) || 497
  const upgradePrice = vipPrice - bfcPrice

  const vipProduct = getProductById('bfc-vip')

  if (!email || !name || !vipProduct) {
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
              src="https://sb.oracleboxing.com/Website/optimized/logos/long_black-large.webp"
              alt="Oracle Boxing"
              className="h-4"
            />
          </div>

          {/* Heading */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-center text-gray-900 text-sm font-medium flex-1">
              Upgrade to VIP & keep everything forever
            </h2>
          </div>

          {/* VIP Upgrade Card */}
          <div className="space-y-4 mb-6">
            <div
              className={`bg-white border-2 rounded-2xl p-6 transition-all duration-300 ease-in-out transform ${
                isVIPSelected ? 'border-[#000000] shadow-lg' : 'border-gray-200'
              }`}
              style={{
                animation: 'fadeIn 0.3s ease-in-out'
              }}
            >
              {/* Product Header */}
              <div className="flex items-start gap-4">
                {/* Image */}
                <div className="flex-shrink-0 w-16 h-16">
                  <img
                    src="https://sb.oracleboxing.com/Website/optimized/products/obm_tn-large.webp"
                    alt="VIP Challenge"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Title, Subtitle, and Upgrade Button */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">VIP Challenge</h3>
                    </div>
                    {/* Price */}
                    <p className="text-xl font-bold text-gray-900 flex-shrink-0">
                      +{formatPrice(upgradePrice, currency)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-600 flex-1">
                      Lifetime access to all courses + VIP perks
                    </p>
                    {/* Chevron */}
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
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
                </div>
              </div>

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {/* Black Friday Deal Badge */}
                  <div className="flex justify-center mb-6">
                    <div className="inline-block bg-black text-white px-6 py-2 rounded-full">
                      <span className="font-black text-xs uppercase tracking-wide">Black Friday Deal Only</span>
                    </div>
                  </div>

                  {/* Total Value */}
                  <div className="text-center mb-6">
                    <p className="text-sm uppercase tracking-wide text-black mb-1">Total Value</p>
                    <p className="text-3xl font-black text-black">{formatPrice(97 + 147 + 297 + 97 + 164, currency)}</p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-black rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <p className="font-bold text-black">Everything in the Challenge</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-black rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <p className="font-bold text-black">Boxing Masterclass - Lifetime Access (normally {formatPrice(297, currency)})</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-black rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <p className="font-bold text-black">Boxing Roadmap - Lifetime Access (normally {formatPrice(147, currency)})</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-black rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <p className="font-bold text-black">Full Recordings Vault - Every Coaching Call (normally {formatPrice(97, currency)})</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                        <Crown className="w-3 h-3 text-black" />
                      </div>
                      <p className="font-bold text-black">Free Oracle Boxing Tracksuit (normally {formatPrice(164, currency)})</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-black rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <p className="font-bold text-black">Priority Onboarding Call</p>
                    </div>
                  </div>

                  {/* Upgrade Button */}
                  <button
                    onClick={() => setIsVIPSelected(!isVIPSelected)}
                    className={`w-full mt-6 py-3 px-6 font-bold text-base rounded-lg transition-all duration-200 ${
                      isVIPSelected
                        ? 'bg-[#000000] text-white hover:bg-[#1a1a1a]'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    {isVIPSelected ? '✓ Upgraded to VIP' : 'Upgrade to VIP'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={isProcessing}
            className="w-full py-3 px-6 bg-[#000000] text-white font-bold text-base rounded-full shadow-lg hover:bg-[#1a1a1a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ cursor: 'pointer' }}
          >
            {isProcessing ? 'Processing...' : (isVIPSelected ? `Continue with VIP (${formatPrice(vipPrice, currency)})` : `Continue with Standard (${formatPrice(bfcPrice, currency)})`)}
          </button>
        </div>
      </div>
    </>
  )
}

export default function BFCUpgradePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <BFCUpgradeContent />
    </Suspense>
  )
}
