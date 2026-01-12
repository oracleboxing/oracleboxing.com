'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getTrackingParams, getCookie } from '@/lib/tracking-cookies'
import { CheckoutForm } from '@/components/checkout-v2/CheckoutForm'
import { StripeCheckout } from '@/components/checkout-v2/StripeCheckout'
import { trackInitiateCheckout } from '@/lib/webhook-tracking'
import { getProductPrice } from '@/lib/currency'

export const dynamic = 'force-dynamic'

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface TrackingParams {
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
  fbclid?: string
  session_id?: string
  event_id?: string
}

// Wrapper component with Suspense boundary for useSearchParams
export default function CheckoutV2Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-[#37322F]">Loading...</div>
      </div>
    }>
      <CheckoutV2Content />
    </Suspense>
  )
}

function CheckoutV2Content() {
  const searchParams = useSearchParams()
  const { currency, isLoading: currencyLoading } = useCurrency()
  const [step, setStep] = useState<'info' | 'payment'>('info')
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isUpdatingAmount, setIsUpdatingAmount] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trackingParams, setTrackingParams] = useState<TrackingParams>({
    referrer: ''
  })
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false)
  const autoSubmitRef = useRef(false)
  const redirectCheckedRef = useRef(false)

  // Debounce timer ref for add-on changes
  const addOnDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Handle PayPal/redirect-based payment returns at the page level
  // This handles the case where a user returns from PayPal with success/fail status
  useEffect(() => {
    if (redirectCheckedRef.current) return
    redirectCheckedRef.current = true

    const redirectStatus = searchParams.get('redirect_status')
    const returnedPaymentIntent = searchParams.get('payment_intent')
    const returnedClientSecret = searchParams.get('payment_intent_client_secret')

    if (redirectStatus && returnedPaymentIntent) {
      console.log('🔄 Payment redirect detected at page level:', { redirectStatus, returnedPaymentIntent })

      if (redirectStatus === 'succeeded' || redirectStatus === 'processing') {
        // Payment succeeded - redirect to success page immediately
        window.location.href = `${window.location.origin}/success?payment_intent=${returnedPaymentIntent}`
      } else if (redirectStatus === 'failed' && returnedClientSecret) {
        // Payment failed - recover the PaymentIntent and show the payment form so user can retry
        // We need to fetch the PaymentIntent details to recover customer info
        recoverFailedPayment(returnedPaymentIntent, returnedClientSecret)
      }
    }
  }, [searchParams])

  // Recover a failed payment so user can retry
  const recoverFailedPayment = async (piId: string, secret: string) => {
    try {
      // Fetch PaymentIntent details from Stripe via our API
      const response = await fetch(`/api/checkout-v2/recover?payment_intent=${piId}`)
      const data = await response.json()

      if (response.ok && data.customerInfo) {
        // Recover the session state
        setCustomerInfo(data.customerInfo)
        setPaymentIntentId(piId)
        setClientSecret(secret)
        setSelectedAddOns(data.addOns || [])
        setError('Payment failed. Please try again with a different payment method.')
        setStep('payment')
      } else {
        // If we can't recover, just show a general error
        setError('Payment failed. Please enter your details to try again.')
      }
    } catch (err) {
      console.error('Failed to recover payment:', err)
      setError('Payment failed. Please enter your details to try again.')
    }
  }

  // Capture tracking params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookieTracking = getTrackingParams()
      const cookie = getCookie('ob_track')

      setTrackingParams({
        referrer: cookieTracking.first_referrer || 'direct',
        first_utm_source: cookieTracking.first_utm_source,
        first_utm_medium: cookieTracking.first_utm_medium,
        first_utm_campaign: cookieTracking.first_utm_campaign,
        first_utm_term: cookieTracking.first_utm_term,
        first_utm_content: cookieTracking.first_utm_content,
        first_referrer_time: cookie?.first_referrer_time,
        last_utm_source: cookieTracking.last_utm_source,
        last_utm_medium: cookieTracking.last_utm_medium,
        last_utm_campaign: cookieTracking.last_utm_campaign,
        last_utm_term: cookieTracking.last_utm_term,
        last_utm_content: cookieTracking.last_utm_content,
        last_referrer_time: cookie?.last_referrer_time,
        session_id: cookie?.session_id,
        event_id: cookie?.event_id,
        fbclid: cookie?._fbc,
      })
    }
  }, [])

  // Check for URL params and auto-submit to skip to step 2 (for abandoned cart recovery)
  // URL format: /checkout-v2?fn=John&ln=Smith&email=john@example.com&phone=+447123456789
  useEffect(() => {
    // Only run once, when currency is loaded and we haven't already auto-submitted
    if (currencyLoading || autoSubmitRef.current) return

    const fn = searchParams.get('fn')
    const ln = searchParams.get('ln')
    const email = searchParams.get('email')
    const phone = searchParams.get('phone')

    // If we have all required params, auto-submit
    if (fn && ln && email && phone) {
      autoSubmitRef.current = true
      setIsAutoSubmitting(true)

      const info: CustomerInfo = {
        firstName: fn,
        lastName: ln,
        email: email,
        phone: phone,
      }

      // Auto-submit after a brief delay to ensure everything is initialized
      setTimeout(() => {
        handleInfoSubmit(info)
        setIsAutoSubmitting(false)
      }, 100)
    }
  }, [currencyLoading, searchParams])

  // Create initial session
  const createSession = useCallback(async (info: CustomerInfo) => {
    const cookieData = getCookie('ob_track')

    const response = await fetch('/api/checkout-v2/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerInfo: info,
        currency,
        trackingParams,
        cookieData,
        addOns: [], // Always start with no add-ons
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session')
    }

    if (!data.clientSecret || !data.paymentIntentId) {
      throw new Error('No client secret returned')
    }

    return { clientSecret: data.clientSecret, paymentIntentId: data.paymentIntentId }
  }, [currency, trackingParams])

  // Handle Step 1 submission - create initial Stripe session (no add-ons)
  const handleInfoSubmit = async (info: CustomerInfo) => {
    setCustomerInfo(info)
    setIsCreatingSession(true)
    setError(null)

    try {
      // Create Stripe session first to get paymentIntentId
      const { clientSecret: secret, paymentIntentId: piId } = await createSession(info)
      setClientSecret(secret)
      setPaymentIntentId(piId)

      // Track InitiateCheckout to Supabase and Facebook (non-blocking)
      // Now includes paymentIntentId for abandoned cart tracking
      const fullName = `${info.firstName} ${info.lastName}`.trim()
      const priceInUserCurrency = getProductPrice('21dc_entry', currency) || 147

      trackInitiateCheckout(
        fullName,
        info.email,
        priceInUserCurrency,
        ['21dc-entry'],
        '/checkout-v2',
        trackingParams.referrer || 'direct',
        {
          funnel: '21dc',
          currency: currency,
          source: 'checkout-v2',
        },
        info.phone,
        piId // Pass paymentIntentId for abandoned cart cron job
      )

      setStep('payment')
    } catch (err: any) {
      console.error('Session creation error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsCreatingSession(false)
    }
  }

  // Handle add-on changes on Step 2 - update PaymentIntent amount (no new session)
  const handleAddOnsChange = useCallback((newAddOns: string[]) => {
    setSelectedAddOns(newAddOns)

    // Debounce the amount update
    if (addOnDebounceRef.current) {
      clearTimeout(addOnDebounceRef.current)
    }

    addOnDebounceRef.current = setTimeout(async () => {
      if (!paymentIntentId) return

      setIsUpdatingAmount(true)
      try {
        const response = await fetch('/api/checkout-v2/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId,
            currency,
            addOns: newAddOns,
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          console.error('Failed to update amount:', data.error)
        }
      } catch (err: any) {
        console.error('Amount update error:', err)
      } finally {
        setIsUpdatingAmount(false)
      }
    }, 300) // 300ms debounce
  }, [paymentIntentId, currency])

  // Show loading while currency is being detected or auto-submitting from URL params
  if (currencyLoading || isAutoSubmitting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-[#37322F]">Loading...</div>
      </div>
    )
  }

  return (
    <>
      {step === 'info' && (
        <CheckoutForm
          onSubmit={handleInfoSubmit}
          isLoading={isCreatingSession}
          error={error}
          currency={currency}
        />
      )}

      {step === 'payment' && clientSecret && paymentIntentId && customerInfo && (
        <StripeCheckout
          clientSecret={clientSecret}
          paymentIntentId={paymentIntentId}
          customerInfo={customerInfo}
          currency={currency}
          selectedAddOns={selectedAddOns}
          onAddOnsChange={handleAddOnsChange}
          isUpdatingAmount={isUpdatingAmount}
          onBack={() => setStep('info')}
        />
      )}
    </>
  )
}
