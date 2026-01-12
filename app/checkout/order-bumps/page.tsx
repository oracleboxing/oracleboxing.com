'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Loader2, X, ShieldCheck, Star } from 'lucide-react'
import { toast } from 'sonner'

import { get6WCAddOns, getCourseOrderBump, get21DCOrderBumps, getProductById } from '@/lib/products'
import { Product } from '@/lib/types'
import { getTrackingParams, getCookie } from '@/lib/tracking-cookies'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice, formatProductDescription, Currency } from '@/lib/currency'
import { trackInitiateCheckout } from '@/lib/webhook-tracking'
import { useAnalytics } from '@/hooks/useAnalytics'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

// Module type for BFFP course
interface CourseModule {
  name: string
  subtitle: string
  description: string
  bullets: string[]
  image: string
}

// Product-specific expanded content
const PRODUCT_DETAILS: Record<string, {
  headline: string
  description: string
  features: string[]
  images?: string[]
  modules?: CourseModule[]
}> = {
  'bffp': {
    headline: 'Boxing from First Principles',
    description: 'Boxing from First Principles teaches boxing from the ground up so you understand how boxing really works, not just what to copy. This course is designed to fix bad habits, build real fundamentals, and help you become a smarter, more efficient boxer.',
    features: [],
    images: [],
    modules: [
      {
        name: 'Sentience',
        subtitle: 'Mind',
        description: 'Sentience teaches you how to stay calm, focused, and aware so you can box without panicking or overthinking.',
        bullets: [
          'Learn how to stay relaxed under pressure',
          'Control emotions during hard moments',
          'See openings faster and react naturally',
          'Enter a calm, focused flow state',
        ],
        image: 'https://sb.oracleboxing.com/Website/sentience.webp',
      },
      {
        name: 'Anatomy',
        subtitle: 'Body',
        description: 'Anatomy shows you how your body really creates power using the brain, nerves, and connective tissue.',
        bullets: [
          'Understand how power moves through your body',
          'Learn why fascia matters more than muscle',
          'Improve speed without forcing strength',
          'Move with less effort and less strain',
        ],
        image: 'https://sb.oracleboxing.com/Website/anatomy.webp',
      },
      {
        name: 'FORMIS',
        subtitle: 'Movement',
        description: 'FORMIS teaches you how to stand, move, punch, and defend with balance so nothing falls apart.',
        bullets: [
          'Build strong stance and posture',
          'Move smoothly in and out of range',
          'Stay balanced while attacking and defending',
          'Flow naturally between actions',
        ],
        image: 'https://sb.oracleboxing.com/Website/formis.webp',
      },
      {
        name: 'Gambit',
        subtitle: 'Tactics',
        description: 'Gambit teaches you how to outthink your opponent and control the fight.',
        bullets: [
          'Learn how to control distance and angles',
          'Spot patterns in your opponent\'s habits',
          'Use feints and traps to create openings',
          'Make smarter decisions in the ring',
        ],
        image: 'https://sb.oracleboxing.com/Website/gambit.webp',
      },
      {
        name: 'Engine',
        subtitle: 'Conditioning',
        description: 'Engine teaches you how to stay strong, calm, and sharp even when you are tired.',
        bullets: [
          'Improve breathing and recovery',
          'Learn how energy systems really work',
          'Stay relaxed late in rounds',
          'Perform better under fatigue',
        ],
        image: 'https://sb.oracleboxing.com/Website/engine.webp',
      },
    ],
  },
  'tracksuit': {
    headline: 'Train in style',
    description: 'The official Oracle Boxing tracksuit. Premium quality, made in Britain from 100% cotton. Designed for comfort during training and everyday wear.',
    features: [],
    images: [
      'https://sb.oracleboxing.com/tracksuit/ob_black_4.webp',
      'https://sb.oracleboxing.com/tracksuit/ob_black_1.webp',
      'https://sb.oracleboxing.com/tracksuit/ob_forest_1.webp',
      'https://sb.oracleboxing.com/tracksuit/ob_grey_2.webp',
      'https://sb.oracleboxing.com/tracksuit/ob_hazel_1.webp',
      'https://sb.oracleboxing.com/tracksuit/ob_steel_1.webp',
    ]
  },
  'bundle': {
    headline: 'Get everything in one package',
    description: 'The Oracle Boxing Bundle includes all our courses at a significant discount. Perfect for serious students who want the complete system.',
    features: [
      'Boxing from First Principles ($247 value)',
      'Boxing Roadmap ($147 value)',
      'Recordings Vault ($97 value)',
      'Save over $90 compared to buying separately',
    ],
  },
  'recordings-vault': {
    headline: 'Learn from real coaching sessions',
    description: 'Access our complete archive of coaching call recordings. Watch real students get feedback and corrections you can apply to your own training.',
    features: [
      '220+ hours of coaching call recordings',
      'New sessions added monthly',
      'See real technique corrections in action',
      'Lifetime access to the growing library',
    ],
  },
  'lifetime-bffp': {
    headline: 'Keep learning forever',
    description: 'Secure lifetime access to Boxing from First Principles, even after your challenge ends. Continue your education at your own pace.',
    features: [
      'Permanent access to all 26 lessons',
      'All future course updates included',
      'Review any concept whenever you need',
      'No subscription required',
    ],
  },
  'vault-2025': {
    headline: '2025 Call Recording Vault',
    description: 'The complete archive of Oracle Boxing coaching sessions from 2025. Access 200+ group calls and 420+ one-to-one sessions covering every aspect of boxing technique, tactics, and mental preparation.',
    features: [],
    images: [
      'https://sb.oracleboxing.com/Website/2025_call_recording.webp',
    ],
    modules: [
      {
        name: 'Footwork & Mobility',
        subtitle: '100+ Sessions',
        description: 'Master the foundation of all boxing movement. Footwork generates power, creates angles, and keeps you safe.',
        bullets: [
          'Weight distribution and balance drills',
          'Directional footwork sequences',
          'Boxing in the shell and circling',
          'Stability and reactive positioning',
        ],
        image: 'PLACEHOLDER_FOOTWORK',
      },
      {
        name: 'Kinetic Chain & Power',
        subtitle: '80+ Sessions',
        description: 'Learn how your body really generates punching power through the kinetic chain—legs, hips, trunk, and arms working as one.',
        bullets: [
          'Rotation and weight transfer mechanics',
          'Kinetic linkage drills',
          'Hip and trunk engagement',
          'Power without forcing strength',
        ],
        image: 'PLACEHOLDER_KINETIC',
      },
      {
        name: 'Defence & Counters',
        subtitle: '90+ Sessions',
        description: 'Develop reflexive defence and sharp counter-punching. Learn to make opponents pay for every punch they throw.',
        bullets: [
          'Slip-bag drills and head movement',
          'Parrying and catch-and-shoot',
          'Counter-punching timing',
          'Layered defence systems',
        ],
        image: 'PLACEHOLDER_DEFENCE',
      },
      {
        name: 'Flow & Combinations',
        subtitle: '120+ Sessions',
        description: 'Build fluid combinations that flow naturally. Connect punches without losing balance or rhythm.',
        bullets: [
          'Combo buildup progressions',
          'Tempo and rhythm training',
          'Smooth transitions between punches',
          'Relaxation under pressure',
        ],
        image: 'PLACEHOLDER_FLOW',
      },
      {
        name: 'Sparring & Mental Skills',
        subtitle: '80+ Sessions',
        description: 'Prepare for real boxing with sparring analysis, fight preparation, and mental conditioning.',
        bullets: [
          'Sparring footage breakdowns',
          'Ring craft and strategy',
          'Flow state and visualisation',
          'Bad habit identification and fixes',
        ],
        image: 'PLACEHOLDER_SPARRING',
      },
    ],
  },
}

function OrderBumpsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currency } = useCurrency()
  const { trackInitiateCheckoutEnriched } = useAnalytics()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [funnelType, setFunnelType] = useState<'6wc' | 'course' | '21dc'>('6wc')
  const [orderBumps, setOrderBumps] = useState<Product[]>([])
  const [selectedBumps, setSelectedBumps] = useState<string[]>([])
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [moduleIndex, setModuleIndex] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
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
    const emailParam = searchParams.get('email')
    const nameParam = searchParams.get('name')
    const funnelParam = searchParams.get('funnel') as '6wc' | 'course' | '21dc' || '6wc'

    if (!emailParam || !nameParam) {
      router.push('/checkout')
      return
    }

    setEmail(emailParam)
    setName(nameParam)
    setFunnelType(funnelParam)

    const cookieTracking = getTrackingParams()

    setTrackingParams({
      referrer: cookieTracking.first_referrer || 'direct',
      first_utm_source: cookieTracking.first_utm_source,
      first_utm_medium: cookieTracking.first_utm_medium,
      first_utm_campaign: cookieTracking.first_utm_campaign,
      first_utm_term: cookieTracking.first_utm_term,
      first_utm_content: cookieTracking.first_utm_content,
      first_referrer_time: getCookie('ob_track')?.first_referrer_time,
      last_utm_source: cookieTracking.last_utm_source,
      last_utm_medium: cookieTracking.last_utm_medium,
      last_utm_campaign: cookieTracking.last_utm_campaign,
      last_utm_term: cookieTracking.last_utm_term,
      last_utm_content: cookieTracking.last_utm_content,
      last_referrer_time: getCookie('ob_track')?.last_referrer_time,
    })

    if (funnelParam === 'course') {
      setOrderBumps(getCourseOrderBump())
    } else if (funnelParam === '21dc') {
      setOrderBumps(get21DCOrderBumps())
    } else {
      setOrderBumps(get6WCAddOns())
    }
  }, [searchParams, router])

  const handleToggleBump = (productId: string) => {
    setSelectedBumps(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  // Mobile toggle with auto-scroll to next bump
  const handleMobileToggleBump = (productId: string) => {
    const wasSelected = selectedBumps.includes(productId)
    handleToggleBump(productId)

    // If adding (not removing) and there's a next item, scroll to it after a short delay
    if (!wasSelected && currentIndex < orderBumps.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
      }, 400)
    }
  }

  const handleNext = () => {
    if (currentIndex < orderBumps.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setExpandedProduct(null)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setExpandedProduct(null)
    }
  }

  const handleContinue = async () => {
    if (isLoading) return
    setIsLoading(true)

    const items = []
    const upgradedToBundle = funnelType === 'course' && selectedBumps.includes('bundle')

    if (funnelType === '6wc') {
      const sixWeekChallenge = getProductById('6wc')!
      items.push({
        product: sixWeekChallenge,
        quantity: 1,
        price_id: sixWeekChallenge.stripe_price_id,
      })
    } else if (funnelType === '21dc') {
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
      const bundle = getProductById('bundle')!
      items.push({
        product: bundle,
        quantity: 1,
        price_id: bundle.stripe_price_id,
      })
    } else {
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

    selectedBumps.forEach(productId => {
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

    let totalValue = 0
    const productIds: string[] = []

    items.forEach(item => {
      const price = getProductPrice(item.product.id, currency) || item.product.price
      totalValue += price * item.quantity
      productIds.push(item.product.id)
    })

    const currentPage = typeof window !== 'undefined' ? window.location.pathname : '/checkout/order-bumps'
    const initialReferrer = trackingParams.referrer || 'direct'
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

    const baseProductIds: string[] = []
    const baseProductNames: string[] = []
    const orderBumpIds: string[] = []
    const orderBumpNames: string[] = []

    items.forEach(item => {
      const isOrderBump = selectedBumps.includes(item.product.id) && orderBumps.some(ob => ob.id === item.product.id)
      if (isOrderBump) {
        orderBumpIds.push(item.product.id)
        orderBumpNames.push(item.product.title)
      } else {
        baseProductIds.push(item.product.id)
        baseProductNames.push(item.product.title)
      }
    })

    trackInitiateCheckoutEnriched({
      value: totalValue,
      currency: currencyParam || 'USD',
      products: baseProductIds,
      product_names: baseProductNames,
      order_bumps: orderBumpIds,
      order_bump_names: orderBumpNames,
      funnel: funnelParam || funnelType,
      has_order_bumps: orderBumpIds.length > 0,
      total_items: items.length,
    })

    try {
      const cookieData = getCookie('ob_track')

      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      window.location.href = data.url
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || "Couldn't start checkout, try again")
      setIsLoading(false)
    }
  }

  if (!email || !name) {
    return null
  }

  // Calculate total
  const calculateTotal = () => {
    let total = 0
    if (funnelType === '21dc') {
      const productParam = searchParams.get('product')
      const baseProduct = productParam ? getProductById(productParam) : null
      if (baseProduct) {
        total += getProductPrice(baseProduct.metadata, currency) || baseProduct.price
      }
    }
    selectedBumps.forEach(bumpId => {
      const bump = orderBumps.find(b => b.id === bumpId)
      if (bump) {
        total += getProductPrice(bump.metadata, currency) || bump.price
      }
    })
    return total
  }

  return (
    <>
      {/* Expanded Product Modal */}
      {expandedProduct && (() => {
        const product = orderBumps.find(p => p.id === expandedProduct)
        const details = PRODUCT_DETAILS[expandedProduct]
        if (!product || !details) return null
        const isSelected = selectedBumps.includes(expandedProduct)
        const images = details.images && details.images.length > 0 ? details.images : [product.image]
        const hasMultipleImages = images.length > 1

        return (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setExpandedProduct(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-[rgba(55,50,47,0.08)] px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-[#37322F]">{product.title}</h3>
                <button
                  onClick={() => setExpandedProduct(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(55,50,47,0.05)] transition-colors"
                >
                  <X className="w-5 h-5 text-[#605A57]" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Product Image Gallery - Only show if product has custom images (not modules-only products like BFFP) */}
                {details.images && details.images.length > 0 && (
                  <div className="relative rounded-2xl overflow-hidden mb-6 bg-[#F5F3F0]">
                    <img
                      src={images[modalImageIndex]}
                      alt={`${product.title} - Image ${modalImageIndex + 1}`}
                      className="w-full h-auto"
                    />

                    {/* Navigation Arrows */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setModalImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          <ArrowLeft className="w-5 h-5 text-[#37322F]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setModalImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          <ArrowRight className="w-5 h-5 text-[#37322F]" />
                        </button>
                      </>
                    )}

                    {/* Image Dots */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation()
                              setModalImageIndex(i)
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${
                              i === modalImageIndex ? 'bg-white w-6' : 'bg-white/60 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <p className="text-[#605A57] text-sm leading-relaxed mb-6">{details.description}</p>

                {/* Module Carousel for BFFP */}
                {details.modules && details.modules.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-[#37322F] mb-3">5 Modules Included:</h5>
                    <div className="relative px-5">
                      {/* Navigation Arrows - Outside the box */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setModuleIndex(prev => prev === 0 ? details.modules!.length - 1 : prev - 1)
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-[#F5F3F0] border border-[rgba(55,50,47,0.15)] rounded-full flex items-center justify-center shadow-sm transition-all"
                      >
                        <ArrowLeft className="w-4 h-4 text-[#37322F]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setModuleIndex(prev => prev === details.modules!.length - 1 ? 0 : prev + 1)
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-[#F5F3F0] border border-[rgba(55,50,47,0.15)] rounded-full flex items-center justify-center shadow-sm transition-all"
                      >
                        <ArrowRight className="w-4 h-4 text-[#37322F]" />
                      </button>

                      {/* Module Card */}
                      <div className="bg-[#F5F3F0] rounded-xl overflow-hidden">
                        <div className="p-4">
                          {/* Module Image */}
                          {details.modules[moduleIndex].image && !details.modules[moduleIndex].image.startsWith('PLACEHOLDER') && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
                              <img
                                src={details.modules[moduleIndex].image}
                                alt={details.modules[moduleIndex].name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Module Header */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base font-bold text-[#37322F]">
                              {details.modules[moduleIndex].name}
                            </span>
                            <span className="text-xs font-medium text-[#847971] uppercase tracking-wide">
                              — {details.modules[moduleIndex].subtitle}
                            </span>
                          </div>

                          {/* Module Description */}
                          <p className="text-sm text-[#605A57] mb-3">
                            {details.modules[moduleIndex].description}
                          </p>

                          {/* Module Bullets */}
                          <div className="space-y-1.5">
                            {details.modules[moduleIndex].bullets.map((bullet, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF8000] flex-shrink-0 mt-1.5" />
                                <span className="text-xs text-[#49423D]">{bullet}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Module Dots */}
                        <div className="flex justify-center gap-1.5 pb-3">
                          {details.modules.map((_, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation()
                                setModuleIndex(i)
                              }}
                              className={`h-1.5 rounded-full transition-all ${
                                i === moduleIndex ? 'bg-[#37322F] w-4' : 'bg-[#37322F]/30 hover:bg-[#37322F]/50 w-1.5'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features - only show if there are features */}
                {details.features.length > 0 && (
                  <div className="space-y-3 mb-8">
                    {details.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#37322F] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-sm text-[#49423D]">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[rgba(55,50,47,0.08)]">
                  <div>
                    <p className="text-2xl font-bold text-[#37322F]">
                      {formatPrice(getProductPrice(product.metadata, currency) || product.price, currency)}
                    </p>
                    <p className="text-xs text-[#847971]">One-time payment</p>
                  </div>
                  <button
                    onClick={() => {
                      handleToggleBump(expandedProduct)
                      setExpandedProduct(null)
                    }}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#37322F] text-white'
                        : 'bg-[#37322F] text-white hover:bg-[#49423D]'
                    }`}
                  >
                    {isSelected ? 'Remove from order' : 'Add to order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl md:max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="https://sb.oracleboxing.com/logo/long_dark.webp"
              alt="Oracle Boxing"
              className="h-4 mx-auto mb-6"
            />
            <h1 className="text-2xl font-semibold text-[#37322F]">
              Enhance your challenge
            </h1>
          </div>

          {/* Mobile Navigation */}
          {orderBumps.length > 1 && (
            <div className="md:hidden flex items-center justify-center gap-3 mb-6">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentIndex === 0
                    ? 'text-[#C4BFBB] cursor-not-allowed'
                    : 'text-[#49423D] hover:bg-[rgba(55,50,47,0.05)]'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1.5">
                {orderBumps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex ? 'bg-[#37322F] w-6' : 'bg-[#D9D5D0]'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={currentIndex === orderBumps.length - 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentIndex === orderBumps.length - 1
                    ? 'text-[#C4BFBB] cursor-not-allowed'
                    : 'text-[#49423D] hover:bg-[rgba(55,50,47,0.05)]'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Product Cards */}
          <div className="mb-8">
            {/* Mobile: Single card carousel */}
            <div className="md:hidden">
              {orderBumps[currentIndex] && (
                <ProductCard
                  product={orderBumps[currentIndex]}
                  isSelected={selectedBumps.includes(orderBumps[currentIndex].id)}
                  onToggle={() => handleMobileToggleBump(orderBumps[currentIndex].id)}
                  onLearnMore={() => {
                    setModalImageIndex(0)
                    setModuleIndex(0)
                    setExpandedProduct(orderBumps[currentIndex].id)
                  }}
                  currency={currency}
                />
              )}
            </div>

            {/* Desktop: Grid - 3 columns */}
            <div className={`hidden md:grid gap-6 ${
              orderBumps.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              orderBumps.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
              {orderBumps.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedBumps.includes(product.id)}
                  onToggle={() => handleToggleBump(product.id)}
                  onLearnMore={() => {
                    setModalImageIndex(0)
                    setModuleIndex(0)
                    setExpandedProduct(product.id)
                  }}
                  currency={currency}
                />
              ))}
            </div>
          </div>

          {/* Order Summary & Continue Button - Constrained Width */}
          <div className="max-w-lg mx-auto">
            {/* Order Summary */}
            <div className="bg-transparent p-6 mb-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-[#37322F] uppercase tracking-wide">Your Order</h3>
                <span className="text-xs text-[#847971]">{(funnelType === '21dc' ? 1 : 0) + selectedBumps.length} item{((funnelType === '21dc' ? 1 : 0) + selectedBumps.length) !== 1 ? 's' : ''}</span>
              </div>

              {/* Items */}
              <div className="space-y-4 mb-5 transition-all duration-300">
                {/* Base Product */}
                {funnelType === '21dc' && (() => {
                  const productParam = searchParams.get('product')
                  const baseProduct = productParam ? getProductById(productParam) : null
                  if (baseProduct) {
                    return (
                      <div className="bg-gradient-to-br from-[#4A4540] to-[#37322F] rounded-xl p-4 text-white relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="relative flex items-center gap-4">
                          <div className="w-20 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                            <img
                              src={baseProduct.image}
                              alt={baseProduct.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{baseProduct.title}</p>
                            <p className="text-xs text-white/60">Challenge Entry</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-sm font-semibold text-white">
                              {formatPrice(getProductPrice(baseProduct.metadata, currency) || baseProduct.price, currency)}
                            </span>
                            <p className="text-xs text-white/60">one time</p>
                          </div>
                        </div>
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
                    <div key={bumpId} className="flex items-center gap-4 transition-all duration-300">
                      <div className="w-20 h-12 rounded-lg overflow-hidden bg-[#F5F3F0] flex-shrink-0">
                        <img
                          src={bump.image}
                          alt={bump.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#37322F] truncate">{bump.title}</p>
                        <p className="text-xs text-[#847971]">Add-on</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-semibold text-[#37322F]">
                          {formatPrice(getProductPrice(bump.metadata, currency) || bump.price, currency)}
                        </span>
                        <p className="text-xs text-[#847971]">one time</p>
                      </div>
                    </div>
                  )
                })}

                {/* Empty state */}
                {selectedBumps.length === 0 && funnelType !== '21dc' && (
                  <div className="text-center py-4">
                    <p className="text-sm text-[#847971]">Select an add-on above</p>
                  </div>
                )}
              </div>

              {/* Total */}
              {(selectedBumps.length > 0 || funnelType === '21dc') && (
                <div className="border-t border-[rgba(55,50,47,0.1)] pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[#605A57]">Total due today</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#37322F]">
                        {formatPrice(calculateTotal(), currency)}
                      </span>
                      <p className="text-xs text-[#847971] mt-0.5">One-time payment</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className={`w-full py-4 px-6 font-semibold text-base rounded-full transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-[#847971] cursor-not-allowed'
                  : 'bg-[#37322F] hover:bg-[#49423D] cursor-pointer'
              } text-white shadow-lg shadow-[rgba(55,50,47,0.15)]`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust Elements */}
            <div className="mt-6 space-y-4">
              {/* Terms link */}
              <p className="text-center text-[#847971] text-xs">
                By clicking the pay button you agree to our{' '}
                <a href="/terms" className="underline hover:text-[#605A57]">Terms & services</a>.
              </p>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 text-[#605A57] text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Your information is encrypted and secure</span>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 text-[#605A57] text-sm">
                <span>Rated 4.9/5 by members</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                  ))}
                </div>
              </div>

              {/* Powered by Stripe */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-[#847971] text-sm">Powered by</span>
                <svg className="h-6" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M59.64 14.28C59.64 10.05 57.56 6.73 53.75 6.73C49.93 6.73 47.49 10.05 47.49 14.24C47.49 19.18 50.34 21.71 54.39 21.71C56.38 21.71 57.87 21.23 59.02 20.56V17.37C57.87 17.97 56.54 18.33 54.87 18.33C53.24 18.33 51.8 17.78 51.62 15.81H59.6C59.6 15.58 59.64 14.68 59.64 14.28ZM51.54 12.89C51.54 10.99 52.66 10.15 53.74 10.15C54.79 10.15 55.85 10.99 55.85 12.89H51.54Z" fill="#635BFF"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M41.13 6.73C39.47 6.73 38.39 7.5 37.79 8.02L37.57 7.01H33.75V24.94L38.01 24.06L38.02 20.49C38.64 20.93 39.54 21.71 41.11 21.71C44.27 21.71 47.13 19.28 47.13 14.09C47.12 9.31 44.21 6.73 41.13 6.73ZM40.11 18.12C39.04 18.12 38.39 17.75 37.96 17.3L37.94 11.22C38.41 10.72 39.08 10.36 40.11 10.36C41.77 10.36 42.92 12.14 42.92 14.23C42.92 16.36 41.79 18.12 40.11 18.12Z" fill="#635BFF"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M28.24 5.57L32.52 4.68V1.29L28.24 2.17V5.57Z" fill="#635BFF"/>
                  <path d="M32.52 7.01H28.24V21.44H32.52V7.01Z" fill="#635BFF"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M23.75 8.17L23.49 7.01H19.75V21.44H24.01V11.59C25.01 10.32 26.68 10.53 27.17 10.7V7.01C26.66 6.82 24.75 6.48 23.75 8.17Z" fill="#635BFF"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.17 2.85L11.01 3.71L10.99 17.54C10.99 19.92 12.77 21.72 15.16 21.72C16.47 21.72 17.42 21.48 17.95 21.19V17.85C17.44 18.05 15.15 18.69 15.15 16.31V10.56H17.95V7.01H15.15L15.17 2.85Z" fill="#635BFF"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.28 11.22C4.28 10.55 4.82 10.29 5.7 10.29C6.97 10.29 8.56 10.68 9.83 11.38V7.41C8.44 6.86 7.07 6.64 5.7 6.64C2.28 6.64 0 8.45 0 11.41C0 16.03 6.35 15.26 6.35 17.24C6.35 18.03 5.68 18.29 4.74 18.29C3.35 18.29 1.59 17.71 0.19 16.91V20.94C1.74 21.61 3.31 21.89 4.74 21.89C8.24 21.89 10.67 20.14 10.67 17.13C10.66 12.15 4.28 13.08 4.28 11.22Z" fill="#635BFF"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Product Card Component
function ProductCard({
  product,
  isSelected,
  onToggle,
  onLearnMore,
  currency,
}: {
  product: Product
  isSelected: boolean
  onToggle: () => void
  onLearnMore: () => void
  currency: Currency
}) {
  const details = PRODUCT_DETAILS[product.id]

  // Get short benefits list
  const shortBenefits = details?.features.slice(0, 3) || [
    `Access to ${product.title}`,
    'Lifetime access included',
    'Start immediately',
  ]

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
        isSelected
          ? 'border-[#37322F] shadow-lg'
          : 'border-transparent shadow-md hover:shadow-lg'
      }`}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-[#F5F3F0] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300'
          }}
        />
        {isSelected && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-[#37322F] rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Price */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#37322F] mb-1">{product.title}</h3>
            <p className="text-xs text-[#847971]">{product.shortDescription || 'One-time purchase'}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-[#37322F]">
              {formatPrice(getProductPrice(product.metadata, currency) || product.price, currency)}
            </p>
          </div>
        </div>

        {/* Quick Benefits */}
        <div className="space-y-2 mb-5">
          {shortBenefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#37322F] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <span className="text-xs text-[#605A57]">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onToggle}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
              isSelected
                ? 'bg-[#37322F] text-white'
                : 'bg-[#F5F3F0] text-[#37322F] hover:bg-[#E8E4DF]'
            }`}
          >
            {isSelected ? 'Added' : 'Add'}
          </button>
          <button
            onClick={onLearnMore}
            className="py-2.5 px-4 rounded-full text-sm font-medium text-[#605A57] hover:text-[#37322F] hover:bg-[#F5F3F0] transition-all"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderBumpsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#847971]" />
      </div>
    }>
      <OrderBumpsContent />
    </Suspense>
  )
}
