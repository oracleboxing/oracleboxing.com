'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js'
import { Loader2, ShieldCheck, Star, Check } from 'lucide-react'

// Initialize Stripe outside component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CoachingCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-[#37322F]">Loading...</div>
      </div>
    }>
      <CoachingCheckoutContent />
    </Suspense>
  )
}

interface CoachingDetails {
  customerName: string
  customerEmail: string
  stripeCustomerId: string
  tier: string
  coach: string
  amount: number
  productName: string
  productDescription: string
  sixMonthCommitment: boolean
  customerDiscount: string
  discountAmount: number
  sixMonthDiscountAmount: number
  // Split payment info
  isSplitPayment: boolean
  paymentNumber: string
  totalPayments: string
  secondPaymentAmount: number
  secondPaymentDueDays: number
  // Subscription payment info
  isSubscriptionPayment: boolean
  monthlyAmount: number
}

function CoachingCheckoutContent() {
  const searchParams = useSearchParams()
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [elements, setElements] = useState<StripeElements | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coachingDetails, setCoachingDetails] = useState<CoachingDetails | null>(null)
  const paymentElementRef = useRef<HTMLDivElement>(null)
  const addressElementRef = useRef<HTMLDivElement>(null)
  const hasInitializedRef = useRef(false)

  const paymentIntentId = searchParams.get('pi')
  const setupIntentId = searchParams.get('setup')
  const isMonthlySetup = searchParams.get('monthly') === 'true'
  const clientSecret = searchParams.get('secret')

  // Determine which intent we're working with
  const intentId = paymentIntentId || setupIntentId

  // Fetch coaching details from PaymentIntent or SetupIntent
  useEffect(() => {
    const fetchDetails = async () => {
      if (!intentId) return

      try {
        // Use different endpoints for PaymentIntent vs SetupIntent
        const endpoint = setupIntentId
          ? `/api/coaching-checkout/details?setup=${setupIntentId}`
          : `/api/coaching-checkout/details?pi=${paymentIntentId}`

        const response = await fetch(endpoint)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch session details')
        }

        setCoachingDetails(data)
      } catch (err: any) {
        console.error('Failed to fetch coaching details:', err)
        setError('Unable to load checkout. Please contact support.')
      }
    }

    fetchDetails()
  }, [intentId, paymentIntentId, setupIntentId])

  // Initialize Stripe Elements - wait for coachingDetails to load first
  useEffect(() => {
    if (hasInitializedRef.current || !clientSecret || !coachingDetails) return
    hasInitializedRef.current = true

    const initStripe = async () => {
      try {
        const stripeInstance = await stripePromise
        if (!stripeInstance) {
          throw new Error('Stripe failed to load')
        }

        setStripe(stripeInstance)

        // Create Elements instance
        const elementsInstance = stripeInstance.elements({
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#37322F',
              colorBackground: '#ffffff',
              colorText: '#37322F',
              colorDanger: '#df1b41',
              fontFamily: 'system-ui, sans-serif',
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

        // Create payment element
        const paymentElement = elementsInstance.create('payment', {
          layout: 'tabs',
        })

        // Create address element
        const addressElement = elementsInstance.create('address', {
          mode: 'billing',
          fields: {
            phone: 'never',
          },
          defaultValues: {
            name: coachingDetails?.customerName || '',
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
  }, [clientSecret, coachingDetails])

  // Handle payment confirmation
  const handleConfirm = async () => {
    if (!stripe || !elements || !intentId) return

    setIsConfirming(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Payment validation failed')
        setIsConfirming(false)
        return
      }

      // Get billing address
      const addressElement = elements.getElement('address')
      if (addressElement) {
        const { complete, value } = await addressElement.getValue()
        if (complete && value?.address) {
          try {
            await fetch('/api/coaching-checkout/update-address', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentIntentId: paymentIntentId || undefined,
                setupIntentId: setupIntentId || undefined,
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
            console.error('Failed to update billing address:', err)
          }
        }
      }

      // Handle SetupIntent for monthly subscriptions
      if (setupIntentId && isMonthlySetup) {
        console.log('🔄 Confirming SetupIntent for monthly subscription...')

        const { error: confirmError, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/success?setup_intent=${setupIntentId}`,
          },
          redirect: 'if_required',
        })

        console.log('🔄 confirmSetup result:', { error: confirmError, status: setupIntent?.status })

        if (confirmError) {
          setError(confirmError.message || 'Card setup failed')
          setIsConfirming(false)
          return
        }

        if (setupIntent && setupIntent.status === 'succeeded') {
          // Card saved successfully - now create the subscription
          console.log('✅ SetupIntent succeeded, creating subscription...')
          try {
            const response = await fetch('/api/coaching-checkout/create-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                setupIntentId,
              }),
            })

            const data = await response.json()
            console.log('📦 create-subscription response:', data)

            if (!response.ok) {
              throw new Error(data.error || 'Failed to create subscription')
            }

            console.log('✅ Subscription created:', data.subscriptionId)

            // Redirect to success page
            const successUrl = `${window.location.origin}/success?subscription=${data.subscriptionId}`
            console.log('🔗 Redirecting to:', successUrl)
            window.location.href = successUrl
            return
          } catch (err: any) {
            console.error('Failed to create subscription:', err)
            setError(err.message || 'Failed to start subscription')
            setIsConfirming(false)
            return
          }
        }

        // Handle requires_action for SetupIntent
        if (setupIntent && setupIntent.status === 'requires_action') {
          console.log('⏳ SetupIntent requires additional action (3D Secure)')
          return
        }

        // Unexpected status
        console.error('Unexpected SetupIntent status:', setupIntent?.status)
        setError('Something went wrong setting up your payment method.')
        setIsConfirming(false)
        return
      }

      // Handle PaymentIntent (full payment or split payment)
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success?payment_intent=${paymentIntentId}`,
        },
        redirect: 'if_required',
      })

      console.log('🔄 confirmPayment result:', { error: confirmError, status: paymentIntent?.status })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        setIsConfirming(false)
        return
      }

      // Payment succeeded or is processing - redirect to success page
      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
        // If this is a split payment, save to Supabase for second payment scheduling
        if (coachingDetails?.isSplitPayment) {
          try {
            await fetch('/api/coaching-checkout/save-split-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerEmail: coachingDetails.customerEmail,
                customerName: coachingDetails.customerName,
                stripeCustomerId: coachingDetails.stripeCustomerId,
                firstPaymentIntentId: paymentIntentId,
                firstPaymentAmount: coachingDetails.amount,
                secondPaymentAmount: coachingDetails.secondPaymentAmount,
                tier: coachingDetails.tier,
                coach: coachingDetails.coach,
                sixMonthCommitment: coachingDetails.sixMonthCommitment,
              }),
            })
            console.log('✅ Split payment saved for second payment scheduling')
          } catch (err) {
            // Don't block redirect on save failure - log and continue
            console.error('Failed to save split payment:', err)
          }
        }

        window.location.href = `${window.location.origin}/success?payment_intent=${paymentIntentId}`
        return
      }

      // Handle requires_action (3D Secure) - Stripe should redirect automatically
      // but if we get here, log it and wait
      if (paymentIntent && paymentIntent.status === 'requires_action') {
        console.log('⏳ Payment requires additional action (3D Secure)')
        // Stripe should handle this via redirect, but just in case
        return
      }

      // Handle requires_payment_method - card was declined or invalid
      if (paymentIntent && paymentIntent.status === 'requires_payment_method') {
        setError('Payment failed. Please check your card details and try again.')
        setIsConfirming(false)
        return
      }

      // Unexpected status - log and show error
      console.error('Unexpected payment status:', paymentIntent?.status)
      setError('Something went wrong. Please try again.')
      setIsConfirming(false)
    } catch (err: any) {
      console.error('Confirmation error:', err)
      setError(err.message || 'Payment failed')
      setIsConfirming(false)
    }
  }

  // Format currency
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100)
  }

  // Show error if no payment intent or setup intent
  if (!intentId || !clientSecret) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-[#37322F] mb-2">Invalid Checkout Link</h1>
          <p className="text-[#605A57]">This checkout link is invalid or has expired. Please contact your coach for a new link.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-[rgba(55,50,47,0.08)] bg-white/80 backdrop-blur-sm flex-shrink-0 z-50">
        <div className="w-full px-4 py-4 flex items-center justify-center">
          <img
            src="https://sb.oracleboxing.com/logo/long_dark.webp"
            alt="Oracle Boxing"
            className="h-4 w-auto"
          />
        </div>
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
                {coachingDetails && (
                  <div className="gold-card rounded-2xl p-6 text-white relative overflow-hidden">
                    {/* Animated flowing ribbons background */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="ribbon-gold ribbon-gold-1" />
                      <div className="ribbon-gold ribbon-gold-2" />
                      <div className="ribbon-gold ribbon-gold-3" />
                    </div>

                    <div className="relative">
                      <h3 className="text-lg font-medium mb-1 text-[#1a1611]">1-on-1 Coaching</h3>
                      <p className="text-[#5c4a36] text-sm mb-6">{coachingDetails.tier} with {coachingDetails.coach}</p>

                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-3xl font-bold text-[#1a1611]">{formatPrice(coachingDetails.amount)}</span>
                          <p className="text-[#5c4a36] text-xs mt-1">
                            {coachingDetails.isSplitPayment
                              ? `payment 1 of ${coachingDetails.totalPayments}`
                              : coachingDetails.isSubscriptionPayment
                              ? 'per month'
                              : 'one time'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pay With Section */}
              <div className="mb-8">
                <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                  Pay with /
                </p>

                {isLoading && (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-[#37322F]" />
                    <span className="ml-3 text-[#605A57]">Loading payment options...</span>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div ref={paymentElementRef} className="mb-6" />
              </div>

              {/* Billing Address */}
              <div className="mb-8 relative z-20">
                <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                  Billing address /
                </p>
                <div ref={addressElementRef} className="address-element-container" />
              </div>

              {/* Mobile: Order summary above button */}
              <div className="lg:hidden mb-6">
                {coachingDetails && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#605A57]">
                          {coachingDetails.isSplitPayment
                            ? `1-on-1 Coaching (Payment 1 of ${coachingDetails.totalPayments})`
                            : '1-on-1 Coaching'
                          }
                        </span>
                        <span className="text-[#37322F] font-medium">{formatPrice(coachingDetails.amount)}</span>
                      </div>
                      {coachingDetails.isSplitPayment && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#847971]">Payment 2 (in {coachingDetails.secondPaymentDueDays} days)</span>
                          <span className="text-[#847971]">{formatPrice(coachingDetails.secondPaymentAmount)}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[rgba(55,50,47,0.08)] mt-4 pt-4">
                      <div className="flex justify-between">
                        <span className="text-[#37322F] font-medium">Due today</span>
                        <span className="text-[#37322F] font-bold text-lg">{formatPrice(coachingDetails.amount)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Pay Button */}
              <button
                onClick={handleConfirm}
                disabled={isLoading || isConfirming || !stripe || !elements}
                className={`w-full h-14 px-6 rounded-lg font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLoading || isConfirming || !stripe || !elements
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

              {/* Trust Elements */}
              <div className="mt-4 lg:mt-6 space-y-2 lg:space-y-4">
                <p className="text-center text-[#847971] text-[10px] lg:text-xs">
                  By clicking the pay button you agree to our{' '}
                  <a href="/terms" className="underline hover:text-[#605A57]">Terms & services</a>.
                </p>

                <div className="flex items-center justify-center gap-1.5 lg:gap-2 text-[#605A57] text-[10px] lg:text-sm">
                  <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Your information is encrypted and secure</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 lg:gap-2 text-[#605A57] text-[10px] lg:text-sm">
                  <span>Rated 4.9/5 by members</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 lg:w-4 lg:h-4 fill-[#F5A623] text-[#F5A623]" />
                    ))}
                  </div>
                </div>

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

                {coachingDetails && (
                  <>
                    {/* Product Card with animated ribbon background */}
                    <div className="gold-card rounded-2xl p-6 mb-6 relative overflow-hidden">
                      {/* Animated flowing ribbons background */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="ribbon-gold ribbon-gold-1" />
                        <div className="ribbon-gold ribbon-gold-2" />
                        <div className="ribbon-gold ribbon-gold-3" />
                      </div>

                      <div className="relative">
                        <h3 className="text-lg font-medium mb-1 text-[#1a1611]">1-on-1 Coaching</h3>
                        <p className="text-[#5c4a36] text-sm mb-6">{coachingDetails.tier} with {coachingDetails.coach}</p>

                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-3xl font-bold text-[#1a1611]">{formatPrice(coachingDetails.amount)}</span>
                            <p className="text-[#5c4a36] text-xs mt-1">
                              {coachingDetails.isSplitPayment
                                ? `payment 1 of ${coachingDetails.totalPayments}`
                                : coachingDetails.isSubscriptionPayment
                                ? 'per month'
                                : 'one time'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-6">
                      <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-2">Purchasing for /</p>
                      <p className="text-[#37322F] font-medium">{coachingDetails.customerName}</p>
                      <p className="text-[#605A57] text-sm">{coachingDetails.customerEmail}</p>
                    </div>

                    {/* What's Included */}
                    <div className="mb-6">
                      <h4 className="font-medium text-[#37322F] mb-3">What&apos;s included</h4>
                      <div className="space-y-2">
                        {[
                          "Personalized 1-on-1 coaching sessions",
                          "Custom training plan tailored to your goals",
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#FF8000] flex-shrink-0" />
                            <span className="text-sm text-[#605A57]">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Spacer to push order summary to bottom */}
                    <div className="flex-1" />

                    {/* Pricing Breakdown - at bottom */}
                    <div className="border-t border-[rgba(55,50,47,0.08)] pt-6 transition-all duration-300">
                      <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                        Your order /
                      </p>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#605A57]">
                            {coachingDetails.isSplitPayment
                              ? `1-on-1 Coaching (Payment 1 of ${coachingDetails.totalPayments})`
                              : coachingDetails.isSubscriptionPayment
                              ? `1-on-1 Coaching (${coachingDetails.tier}) - Monthly`
                              : `1-on-1 Coaching (${coachingDetails.tier})`
                            }
                          </span>
                          <span className="text-[#37322F] font-medium">
                            {formatPrice(coachingDetails.amount)}
                            {coachingDetails.isSubscriptionPayment && <span className="text-[#847971] font-normal">/mo</span>}
                          </span>
                        </div>
                        {coachingDetails.isSplitPayment && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[#847971]">Payment 2 (in {coachingDetails.secondPaymentDueDays} days)</span>
                            <span className="text-[#847971]">{formatPrice(coachingDetails.secondPaymentAmount)}</span>
                          </div>
                        )}
                        {coachingDetails.isSubscriptionPayment && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[#847971]">Recurring monthly (cancel anytime)</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-[rgba(55,50,47,0.08)] mt-4 pt-4">
                        <div className="flex justify-between">
                          <span className="text-[#37322F] font-medium">
                            {coachingDetails.isSubscriptionPayment ? 'First payment' : 'Due today'}
                          </span>
                          <span className="text-[#37322F] font-bold text-lg">{formatPrice(coachingDetails.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .address-element-container {
          position: relative;
          z-index: 20;
        }
        /* Metallic gold card */
        .gold-card {
          background: linear-gradient(
            135deg,
            #f5e6c8 0%,
            #e8d48b 15%,
            #fff8dc 35%,
            #e8d48b 50%,
            #d4c47a 65%,
            #fff8dc 80%,
            #e8d48b 100%
          );
          box-shadow:
            0 4px 20px rgba(212, 175, 55, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
        }
        /* Gold ribbons */
        .ribbon-gold {
          position: absolute;
          width: 200%;
          height: 80px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.25) 20%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0.25) 80%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(15px);
        }
        /* Hide heavy animations on mobile to prevent Safari crashes */
        @media (max-width: 768px) {
          .ribbon-gold {
            display: none;
          }
        }
        .ribbon-gold-1 {
          top: 10%;
          left: -50%;
          transform: rotate(-15deg);
          animation: driftGold1 8s ease-in-out infinite;
        }
        .ribbon-gold-2 {
          top: 40%;
          left: -30%;
          height: 100px;
          transform: rotate(10deg);
          animation: driftGold2 10s ease-in-out infinite;
          animation-delay: -2s;
        }
        .ribbon-gold-3 {
          top: 70%;
          left: -40%;
          height: 60px;
          transform: rotate(-8deg);
          animation: driftGold3 7s ease-in-out infinite;
          animation-delay: -4s;
        }
        @keyframes driftGold1 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-15deg);
            opacity: 0.6;
          }
          50% {
            transform: translateX(80%) translateY(10px) rotate(-10deg);
            opacity: 0.9;
          }
        }
        @keyframes driftGold2 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(10deg);
            opacity: 0.5;
          }
          50% {
            transform: translateX(70%) translateY(-15px) rotate(15deg);
            opacity: 0.85;
          }
        }
        @keyframes driftGold3 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-8deg);
            opacity: 0.55;
          }
          50% {
            transform: translateX(75%) translateY(8px) rotate(-5deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
