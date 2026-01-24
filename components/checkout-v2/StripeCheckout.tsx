'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js'
import { Currency, formatPrice, getProductPrice } from '@/lib/currency'
import { Loader2, ChevronLeft, ChevronRight, Check, ShieldCheck, Star, X } from 'lucide-react'
import { CAMPAIGN_ACTIVE } from '@/lib/campaign'
import CheckoutTimer, { clearCheckoutTimer } from '@/components/CheckoutTimer'

// Storage key for checkout session persistence (must match page.tsx)
const CHECKOUT_SESSION_KEY = 'ob_checkout_session'

// Clear checkout session from storage (call on success)
function clearCheckoutSession() {
  try {
    sessionStorage.removeItem(CHECKOUT_SESSION_KEY)
    console.log('🗑️ Checkout session cleared from storage')
  } catch (e) {
    console.warn('Failed to clear checkout session:', e)
  }
}

// Initialize Stripe outside component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Module type for course products
interface CourseModule {
  name: string
  subtitle: string
  description: string
  bullets: string[]
  image: string
}

// Product details for Learn More modal
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

interface AddOn {
  id: string
  title: string
  description: string
  metadata: string
}

const ADD_ONS: AddOn[] = [
  {
    id: 'bffp',
    title: 'Boxing from First Principles',
    description: '26 lessons across 5 modules teaching boxing fundamentals',
    metadata: 'bffp',
  },
  {
    id: 'tracksuit',
    title: 'Oracle Boxing Tracksuit',
    description: 'Premium tracksuit. Made in Britain. 100% cotton.',
    metadata: 'tracksuit',
  },
  {
    id: 'vault-2025',
    title: '2025 Call Recording Vault',
    description: '620+ coaching call recordings from 2025',
    metadata: 'vault2025',
  },
]

interface StripeCheckoutProps {
  clientSecret: string
  paymentIntentId: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
  }
  currency: Currency
  selectedAddOns: string[]
  onAddOnsChange: (addOns: string[]) => void
  isUpdatingAmount: boolean
  onBack: () => void
}

export function StripeCheckout({
  clientSecret,
  paymentIntentId,
  customerInfo,
  currency,
  selectedAddOns,
  onAddOnsChange,
  isUpdatingAmount,
  onBack,
}: StripeCheckoutProps) {
  const searchParams = useSearchParams()
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [elements, setElements] = useState<StripeElements | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const paymentElementRef = useRef<HTMLDivElement>(null)
  const addressElementRef = useRef<HTMLDivElement>(null)
  const hasInitializedRef = useRef(false)

  // Modal state for Learn More
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [moduleIndex, setModuleIndex] = useState(0)

  // Check for redirect status from PayPal/other redirect-based payment methods
  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status')
    const returnedPaymentIntent = searchParams.get('payment_intent')

    if (redirectStatus && returnedPaymentIntent) {
      console.log('🔄 Payment redirect detected:', { redirectStatus, returnedPaymentIntent })

      if (redirectStatus === 'succeeded') {
        // Payment succeeded - clear session and redirect to success page
        clearCheckoutSession()
        clearCheckoutTimer()
        window.location.href = `${window.location.origin}/success?payment_intent=${returnedPaymentIntent}`
      } else if (redirectStatus === 'failed') {
        // Payment failed - show error message, allow retry
        setError('Payment failed. Please try again with a different payment method.')
      } else if (redirectStatus === 'processing') {
        // Payment is still processing - clear session and redirect to success
        clearCheckoutSession()
        clearCheckoutTimer()
        window.location.href = `${window.location.origin}/success?payment_intent=${returnedPaymentIntent}`
      }
      // For 'requires_payment_method' or other statuses, user can retry
    }
  }, [searchParams])

  // Product prices for display
  const mainPrice = getProductPrice('21dc_entry', currency) || 147

  const toggleAddOn = (id: string) => {
    const newAddOns = selectedAddOns.includes(id)
      ? selectedAddOns.filter(x => x !== id)
      : [...selectedAddOns, id]
    onAddOnsChange(newAddOns)
  }

  // Calculate total
  const calculateTotal = () => {
    let total = mainPrice
    for (const addOn of ADD_ONS) {
      if (selectedAddOns.includes(addOn.id)) {
        const price = getProductPrice(addOn.metadata, currency) || 0
        total += price
      }
    }
    return total
  }

  // Initialize Stripe Elements - only once when component mounts
  useEffect(() => {
    // Only initialize once
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    const initStripe = async () => {
      try {
        const stripeInstance = await stripePromise
        if (!stripeInstance) {
          throw new Error('Stripe failed to load')
        }

        setStripe(stripeInstance)

        // Create Elements instance with the client secret
        const elementsInstance = stripeInstance.elements({
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#37322F',
              colorBackground: '#ffffff',
              colorText: '#37322F',
              colorDanger: '#df1b41',
              fontFamily: 'Satoshi, system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
            rules: {
              '.Tab': {
                border: '1px solid #E0E6EB',
                boxShadow: 'none',
              },
              '.Tab--selected': {
                border: '1px solid #37322F',
                boxShadow: 'none',
              },
              '.Input': {
                border: '1px solid rgba(55,50,47,0.20)',
                boxShadow: 'none',
              },
              '.Input:focus': {
                border: '1px solid #37322F',
                boxShadow: '0 0 0 1px #37322F',
              },
            },
          },
        })

        setElements(elementsInstance)

        // Create and mount the payment element with billing address collection
        const paymentElement = elementsInstance.create('payment', {
          layout: 'tabs',
        })

        // Create and mount the address element for billing address
        const addressElement = elementsInstance.create('address', {
          mode: 'billing',
          fields: {
            phone: 'never', // We already have phone from step 1
          },
          defaultValues: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
          },
        })

        if (paymentElementRef.current) {
          paymentElement.mount(paymentElementRef.current)
        }

        if (addressElementRef.current) {
          addressElement.mount(addressElementRef.current)
        }

        setIsLoading(false)
      } catch (err: any) {
        console.error('Stripe init error:', err)
        setError(err.message || 'Failed to initialize payment')
        setIsLoading(false)
      }
    }

    initStripe()
  }, [clientSecret])

  // Handle payment confirmation
  const handleConfirm = async () => {
    if (!stripe || !elements) return

    setIsConfirming(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Payment validation failed')
        setIsConfirming(false)
        return
      }

      // Get the billing address from the Address Element
      const addressElement = elements.getElement('address')
      if (addressElement) {
        const { complete, value } = await addressElement.getValue()
        if (complete && value?.address) {
          // Update PaymentIntent metadata with billing address
          try {
            await fetch('/api/checkout-v2/update-address', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentIntentId,
                billingAddress: {
                  city: value.address.city || '',
                  country: value.address.country || '',
                  line1: value.address.line1 || '',
                  line2: value.address.line2 || '',
                  postal_code: value.address.postal_code || '',
                  state: value.address.state || '',
                },
              }),
            })
          } catch (err) {
            // Non-blocking - continue with payment even if address update fails
            console.error('Failed to update billing address:', err)
          }
        }
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout-v2?payment_intent=${paymentIntentId}`,
        },
        redirect: 'if_required', // Only redirect if necessary (for redirect-based payments)
      })

      console.log('🔄 confirmPayment result:', { error: confirmError, status: paymentIntent?.status })

      if (confirmError) {
        // Payment failed with an error
        setError(confirmError.message || 'Payment failed. Please try again.')
        setIsConfirming(false)
        return
      }

      if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          // Payment succeeded without redirect (card payments)
          clearCheckoutSession() // Clear the checkout session
          clearCheckoutTimer() // Clear the reservation timer
          window.location.href = `${window.location.origin}/success?payment_intent=${paymentIntentId}`
          return
        }

        if (paymentIntent.status === 'processing') {
          // Payment is processing (bank transfers, etc.) - redirect to success
          clearCheckoutSession() // Clear the checkout session
          clearCheckoutTimer() // Clear the reservation timer
          window.location.href = `${window.location.origin}/success?payment_intent=${paymentIntentId}`
          return
        }

        if (paymentIntent.status === 'requires_action') {
          // 3D Secure or other authentication required - Stripe handles this automatically
          console.log('⏳ Payment requires additional action (3D Secure)')
          return
        }

        if (paymentIntent.status === 'requires_payment_method') {
          // Card was declined or payment method failed
          setError('Your card was declined. Please try a different payment method.')
          setIsConfirming(false)
          return
        }

        // Any other status - show generic error
        console.log('⚠️ Unexpected payment status:', paymentIntent.status)
        setError('Payment could not be completed. Please try again.')
        setIsConfirming(false)
        return
      }

      // For redirect-based payments (PayPal), Stripe will redirect to return_url
      // The redirect_status will be checked when user returns
    } catch (err: any) {
      console.error('Confirmation error:', err)
      setError(err.message || 'Payment failed')
      setIsConfirming(false)
    }
  }

  // Handle opening learn more modal
  const handleLearnMore = (e: React.MouseEvent, addOnId: string) => {
    e.stopPropagation()
    setExpandedProduct(addOnId)
    setModalImageIndex(0)
    setModuleIndex(0)
  }

  // Reusable Add-ons Section Component
  const AddOnsSection = () => (
    <div className="mb-8">
      <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
        Optional Add-ons /
      </p>
      <div className="space-y-3">
        {ADD_ONS.map((addOn) => {
          const isSelected = selectedAddOns.includes(addOn.id)
          const price = getProductPrice(addOn.metadata, currency) || 0
          return (
            <button
              key={addOn.id}
              type="button"
              onClick={() => toggleAddOn(addOn.id)}
              disabled={isConfirming}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ease-out text-left relative overflow-hidden ${
                isSelected
                  ? 'bg-[#37322F] border-[#37322F]'
                  : 'bg-white border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.25)]'
              } ${isConfirming ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Animated ribbon background - always rendered, fades in/out */}
              <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-300 ${
                isSelected ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="addon-ribbon addon-ribbon-1" />
                <div className="addon-ribbon addon-ribbon-2" />
                <div className="addon-ribbon addon-ribbon-3" />
                <div className="addon-ribbon addon-ribbon-4" />
              </div>

              {/* Top row: Title + Price/Checkbox */}
              <div className="flex items-center justify-between gap-4 relative z-10">
                <h3 className={`text-sm font-semibold transition-colors duration-300 ${
                  isSelected ? 'text-white' : 'text-[#37322F]'
                }`}>{addOn.title}</h3>

                {/* Price + Checkbox */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm font-semibold transition-colors duration-300 ${
                    isSelected ? 'text-white' : 'text-[#37322F]'
                  }`}>
                    {formatPrice(price, currency)}
                  </span>
                  <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-white'
                      : 'border-2 border-[rgba(55,50,47,0.25)]'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-[#37322F]" strokeWidth={3} />}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-1 relative z-10">
                <p className={`text-xs transition-colors duration-300 ${
                  isSelected ? 'text-white/70' : 'text-[#605A57]'
                }`}>{addOn.description}</p>
              </div>

              {/* Learn more - bottom left */}
              <div className="mt-2 relative z-10">
                <span
                  onClick={(e) => handleLearnMore(e, addOn.id)}
                  className={`text-xs underline cursor-pointer transition-colors duration-300 ${
                    isSelected ? 'text-white/60 hover:text-white/80' : 'text-[#847971] hover:text-[#605A57]'
                  }`}
                >
                  Learn more
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  // Reusable Order Summary Component
  const OrderSummary = ({ showHeader = true }: { showHeader?: boolean }) => (
    <div>
      {showHeader && (
        <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
          Your order /
        </p>
      )}

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#605A57]">21-Day Challenge</span>
          <span className="text-[#37322F] font-medium">{formatPrice(mainPrice, currency)}</span>
        </div>

        {/* Selected Add-ons */}
        {selectedAddOns.map(addOnId => {
          const addOn = ADD_ONS.find(a => a.id === addOnId)
          if (!addOn) return null
          const price = getProductPrice(addOn.metadata, currency) || 0
          return (
            <div key={addOnId} className="flex justify-between text-sm">
              <span className="text-[#605A57]">{addOn.title}</span>
              <span className="text-[#37322F] font-medium">{formatPrice(price, currency)}</span>
            </div>
          )
        })}
      </div>

      <div className="border-t border-[rgba(55,50,47,0.08)] mt-4 pt-4">
        <div className="flex justify-between">
          <span className="text-[#37322F] font-medium">Due today</span>
          <span className="text-[#37322F] font-bold text-lg">{formatPrice(calculateTotal(), currency)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-[rgba(55,50,47,0.08)] bg-white/80 backdrop-blur-sm flex-shrink-0 z-50">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#605A57] hover:text-[#37322F] transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <img
            src="https://sb.oracleboxing.com/logo/icon_dark.webp"
            alt="Oracle Boxing"
            className="w-8 h-auto"
          />
        </div>

        {/* Campaign Timer - spot reservation countdown */}
        {CAMPAIGN_ACTIVE && (
          <div className="px-4 pb-4">
            <CheckoutTimer duration={45} />
          </div>
        )}
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 xl:px-12 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 h-full">
            {/* Left Column - Payment (scrollable, hidden scrollbar) */}
            <div className="order-2 lg:order-1 overflow-y-auto overflow-x-hidden py-8 lg:py-12 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Mobile: Order summary header */}
            <p className="lg:hidden text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
              Order summary /
            </p>

            {/* Mobile: Product Card at top */}
            <div className="lg:hidden mb-6">
              <div className="bg-[#37322F] rounded-2xl p-6 text-white relative overflow-hidden">
                {/* Animated flowing ribbons background */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="ribbon ribbon-1" />
                  <div className="ribbon ribbon-2" />
                  <div className="ribbon ribbon-3" />
                </div>

                <div className="relative">
                  <h3 className="text-lg font-medium mb-1">Oracle Boxing</h3>
                  <p className="text-white/70 text-sm mb-6">21-Day Challenge</p>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold">{formatPrice(mainPrice, currency)}</span>
                      <p className="text-white/60 text-xs mt-1">one time</p>
                    </div>
                    <p className="text-white/60 text-xs">Win your money back if you complete it.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Add-ons */}
            <div className="lg:hidden">
              <AddOnsSection />
            </div>

            {/* Pay With Section */}
            <div className="mb-8">
              <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                Pay with /
              </p>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-[#37322F]" />
                  <span className="ml-3 text-[#605A57]">Loading payment options...</span>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Stripe Payment Element */}
              <div ref={paymentElementRef} className="mb-6" />
            </div>

            {/* Billing Address Section */}
            <div className="mb-8 relative z-20">
              <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                Billing address /
              </p>
              <div ref={addressElementRef} className="address-element-container" />
            </div>

            {/* Desktop: Add-ons below payment element */}
            <div className="hidden lg:block">
              <AddOnsSection />
            </div>

            {/* Mobile: Order summary above button - no border/card */}
            <div className="lg:hidden mb-6">
              <OrderSummary showHeader={false} />
            </div>

            {/* Pay Button */}
            <button
              onClick={handleConfirm}
              disabled={isLoading || isConfirming || isUpdatingAmount || !stripe || !elements}
              className={`w-full h-14 px-6 rounded-lg font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading || isConfirming || isUpdatingAmount || !stripe || !elements
                  ? 'bg-[#847971] cursor-not-allowed'
                  : 'bg-[#37322F] hover:bg-[#37322f]/90 cursor-pointer'
              } text-white`}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay'
              )}
            </button>

            {/* Trust Elements - smaller on mobile */}
            <div className="mt-4 lg:mt-6 space-y-2 lg:space-y-4">
              {/* Terms link */}
              <p className="text-center text-[#847971] text-[10px] lg:text-xs">
                By clicking the pay button you agree to our{' '}
                <a href="/terms" className="underline hover:text-[#605A57]">Terms & services</a>.
              </p>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-1.5 lg:gap-2 text-[#605A57] text-[10px] lg:text-sm">
                <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Your information is encrypted and secure</span>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1.5 lg:gap-2 text-[#605A57] text-[10px] lg:text-sm">
                <span>Rated 4.9/5 by members</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 lg:w-4 lg:h-4 fill-[#F5A623] text-[#F5A623]" />
                  ))}
                </div>
              </div>

              {/* Powered by Stripe */}
              <div className="flex items-center justify-center gap-1.5 lg:gap-2">
                <span className="text-[#847971] text-[10px] lg:text-sm">Powered by</span>
                <svg className="h-4 lg:h-6" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          {/* Right Column - Order Summary (fixed on desktop) */}
          <div className="order-1 lg:order-2 hidden lg:block py-8 lg:py-12">
            <div className="flex flex-col h-full">
              <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                Order summary /
              </p>

              {/* Product Card with animated ribbon background */}
              <div className="bg-[#37322F] rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
                {/* Animated flowing ribbons background */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="ribbon ribbon-1" />
                  <div className="ribbon ribbon-2" />
                  <div className="ribbon ribbon-3" />
                </div>

                <div className="relative">
                  <h3 className="text-lg font-medium mb-1">Oracle Boxing</h3>
                  <p className="text-white/70 text-sm mb-6">21-Day Challenge</p>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold">{formatPrice(mainPrice, currency)}</span>
                      <p className="text-white/60 text-xs mt-1">one time</p>
                    </div>
                    <p className="text-white/60 text-xs">Win your money back if you complete it.</p>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <h4 className="font-medium text-[#37322F] mb-2">21-Day Challenge</h4>
                <p className="text-sm text-[#605A57] leading-relaxed mb-4">
                  Prove you have what it takes. Show up twice a week, submit one video, and earn your place in Oracle Boxing. Win your money back if you complete the challenge.
                </p>

                {/* Deliverables */}
                <div className="space-y-2">
                  {[
                    "11 Live Classes Per Week",
                    "Private Community Access",
                    "Grade 1 Course",
                    "1-on-1 Graduation Call",
                    "Win Your Money Back Guarantee",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="#FF8000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm text-[#605A57]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacer to push order summary to bottom */}
              <div className="flex-1" />

              {/* Pricing Breakdown - at bottom */}
              <div className="border-t border-[rgba(55,50,47,0.08)] pt-6 transition-all duration-300">
                <OrderSummary showHeader={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>

      {/* Learn More Modal */}
      {expandedProduct && PRODUCT_DETAILS[expandedProduct] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setExpandedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(55,50,47,0.08)] flex-shrink-0">
              <h2 className="text-lg font-semibold text-[#37322F]">
                {PRODUCT_DETAILS[expandedProduct].headline}
              </h2>
              <button
                onClick={() => setExpandedProduct(null)}
                className="p-1 hover:bg-[rgba(55,50,47,0.08)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#605A57]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-4 space-y-4">
              {/* Image Gallery (only for products without modules, like tracksuit) */}
              {PRODUCT_DETAILS[expandedProduct].images && PRODUCT_DETAILS[expandedProduct].images!.length > 0 && !PRODUCT_DETAILS[expandedProduct].modules && (
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#F5F3F0]">
                    <img
                      src={PRODUCT_DETAILS[expandedProduct].images![modalImageIndex]}
                      alt={PRODUCT_DETAILS[expandedProduct].headline}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {PRODUCT_DETAILS[expandedProduct].images!.length > 1 && (
                    <>
                      {/* Navigation arrows */}
                      <button
                        onClick={() => setModalImageIndex(prev =>
                          prev === 0 ? PRODUCT_DETAILS[expandedProduct].images!.length - 1 : prev - 1
                        )}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#37322F]" />
                      </button>
                      <button
                        onClick={() => setModalImageIndex(prev =>
                          prev === PRODUCT_DETAILS[expandedProduct].images!.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-[#37322F]" />
                      </button>
                      {/* Dot indicators */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {PRODUCT_DETAILS[expandedProduct].images!.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setModalImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === modalImageIndex ? 'bg-[#37322F]' : 'bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-[#605A57] leading-relaxed">
                {PRODUCT_DETAILS[expandedProduct].description}
              </p>

              {/* Module Carousel (for courses) */}
              {PRODUCT_DETAILS[expandedProduct].modules && PRODUCT_DETAILS[expandedProduct].modules!.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-3">
                    {PRODUCT_DETAILS[expandedProduct].modules!.length} Modules Included
                  </p>
                  <div className="relative">
                    {(() => {
                      const currentModule = PRODUCT_DETAILS[expandedProduct].modules![moduleIndex]
                      const hasImage = currentModule.image && !currentModule.image.startsWith('PLACEHOLDER')
                      return (
                        <div className="bg-[#F5F3F0] rounded-xl p-4">
                          {hasImage && (
                            <div className="aspect-video rounded-lg overflow-hidden mb-3">
                              <img
                                src={currentModule.image}
                                alt={currentModule.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex items-baseline gap-2 mb-2">
                            <h4 className="font-semibold text-[#37322F]">{currentModule.name}</h4>
                            <span className="text-xs text-[#847971]">— {currentModule.subtitle}</span>
                          </div>
                          <p className="text-sm text-[#605A57] mb-3">{currentModule.description}</p>
                          <ul className="space-y-1.5">
                            {currentModule.bullets.map((bullet, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-[#605A57]">
                                <Check className="w-3 h-3 text-[#FF8000] flex-shrink-0 mt-0.5" />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })()}
                    {PRODUCT_DETAILS[expandedProduct].modules!.length > 1 && (
                      <>
                        {/* Module navigation arrows */}
                        <button
                          onClick={() => setModuleIndex(prev =>
                            prev === 0 ? PRODUCT_DETAILS[expandedProduct].modules!.length - 1 : prev - 1
                          )}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-[#37322F]" />
                        </button>
                        <button
                          onClick={() => setModuleIndex(prev =>
                            prev === PRODUCT_DETAILS[expandedProduct].modules!.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-[#37322F]" />
                        </button>
                        {/* Module dot indicators */}
                        <div className="flex justify-center gap-1.5 mt-3">
                          {PRODUCT_DETAILS[expandedProduct].modules!.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setModuleIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === moduleIndex ? 'bg-[#37322F]' : 'bg-[rgba(55,50,47,0.2)]'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Features list (if applicable) */}
              {PRODUCT_DETAILS[expandedProduct].features && PRODUCT_DETAILS[expandedProduct].features.length > 0 && (
                <ul className="space-y-2">
                  {PRODUCT_DETAILS[expandedProduct].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#605A57]">
                      <Check className="w-4 h-4 text-[#FF8000] flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Modal Footer with Price */}
            <div className="p-4 border-t border-[rgba(55,50,47,0.08)] flex-shrink-0">
              {(() => {
                const addOn = ADD_ONS.find(a => a.id === expandedProduct)
                const price = addOn ? getProductPrice(addOn.metadata, currency) || 0 : 0
                const isSelected = selectedAddOns.includes(expandedProduct)
                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#37322F]">{formatPrice(price, currency)}</span>
                      <span className="text-xs text-[#847971] ml-2">one-time payment</span>
                    </div>
                    <button
                      onClick={() => {
                        toggleAddOn(expandedProduct)
                        setExpandedProduct(null)
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-[rgba(55,50,47,0.08)] text-[#37322F] hover:bg-[rgba(55,50,47,0.12)]'
                          : 'bg-[#37322F] text-white hover:bg-[#37322f]/90'
                      }`}
                    >
                      {isSelected ? 'Remove from order' : 'Add to order'}
                    </button>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Ensure Google Maps autocomplete dropdown appears above other elements */
        .pac-container {
          z-index: 10000 !important;
          background-color: white !important;
        }
        .address-element-container {
          position: relative;
          z-index: 20;
        }
        .ribbon {
          position: absolute;
          width: 200%;
          height: 80px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,252,245,0.15) 20%,
            rgba(255,252,245,0.3) 50%,
            rgba(255,252,245,0.15) 80%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(20px);
          box-shadow: 0 0 40px 20px rgba(255, 252, 245, 0.15);
        }
        /* Hide heavy animations on mobile to prevent Safari crashes */
        @media (max-width: 768px) {
          .ribbon {
            display: none;
          }
        }
        .ribbon-1 {
          top: 10%;
          left: -50%;
          transform: rotate(-15deg);
          animation: drift1 8s ease-in-out infinite;
        }
        .ribbon-2 {
          top: 40%;
          left: -30%;
          height: 100px;
          transform: rotate(10deg);
          animation: drift2 10s ease-in-out infinite;
          animation-delay: -2s;
        }
        .ribbon-3 {
          top: 70%;
          left: -40%;
          height: 60px;
          transform: rotate(-8deg);
          animation: drift3 7s ease-in-out infinite;
          animation-delay: -4s;
        }
        @keyframes drift1 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-15deg);
            opacity: 0.8;
          }
          50% {
            transform: translateX(80%) translateY(10px) rotate(-10deg);
            opacity: 1;
          }
        }
        @keyframes drift2 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(10deg);
            opacity: 0.75;
          }
          50% {
            transform: translateX(70%) translateY(-15px) rotate(15deg);
            opacity: 1;
          }
        }
        @keyframes drift3 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-8deg);
            opacity: 0.7;
          }
          50% {
            transform: translateX(75%) translateY(8px) rotate(-5deg);
            opacity: 0.95;
          }
        }
        /* Add-on specific ribbons - more concentrated and visible in smaller containers */
        .addon-ribbon {
          position: absolute;
          width: 120%;
          height: 50px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,252,245,0.2) 15%,
            rgba(255,252,245,0.5) 50%,
            rgba(255,252,245,0.2) 85%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(12px);
          box-shadow:
            0 0 30px 15px rgba(255, 252, 245, 0.3),
            0 0 50px 25px rgba(255, 252, 245, 0.15);
        }
        .addon-ribbon-1 {
          top: -20%;
          left: -10%;
          transform: rotate(-8deg);
          animation: addonDrift1 6s ease-in-out infinite;
        }
        .addon-ribbon-2 {
          top: 30%;
          left: 0%;
          height: 60px;
          transform: rotate(5deg);
          animation: addonDrift2 8s ease-in-out infinite;
          animation-delay: -1.5s;
        }
        .addon-ribbon-3 {
          top: 70%;
          left: -5%;
          height: 45px;
          transform: rotate(-5deg);
          animation: addonDrift3 7s ease-in-out infinite;
          animation-delay: -3s;
        }
        .addon-ribbon-4 {
          top: 50%;
          left: 20%;
          height: 40px;
          width: 100%;
          transform: rotate(10deg);
          animation: addonDrift4 9s ease-in-out infinite;
          animation-delay: -4s;
        }
        @keyframes addonDrift1 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-8deg);
            opacity: 0.9;
          }
          50% {
            transform: translateX(60%) translateY(5px) rotate(-3deg);
            opacity: 1;
          }
        }
        @keyframes addonDrift2 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(5deg);
            opacity: 0.85;
          }
          50% {
            transform: translateX(50%) translateY(-8px) rotate(10deg);
            opacity: 1;
          }
        }
        @keyframes addonDrift3 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-5deg);
            opacity: 0.8;
          }
          50% {
            transform: translateX(55%) translateY(5px) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes addonDrift4 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(10deg);
            opacity: 0.75;
          }
          50% {
            transform: translateX(40%) translateY(-5px) rotate(15deg);
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  )
}
