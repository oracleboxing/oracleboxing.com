'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import nextDynamic from 'next/dynamic'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getTrackingParams, getCookie } from '@/lib/tracking-cookies'
import { CheckoutForm } from '@/components/checkout-v2/CheckoutForm'
import { trackInitiateCheckout } from '@/lib/webhook-tracking'
import { getProductPrice } from '@/lib/currency'
import { getProductById } from '@/lib/products'
import { useAnalytics } from '@/hooks/useAnalytics'
import { Loader2 } from 'lucide-react'
import { CheckoutFormSkeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

// Dynamic import for StripeCheckout - only loaded after customer info is collected
const StripeCheckout = nextDynamic(
  () => import('@/components/checkout-v2/StripeCheckout').then(mod => ({ default: mod.StripeCheckout })),
  {
    loading: () => (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#37322F]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading payment options...</span>
        </div>
      </div>
    ),
    ssr: false
  }
)

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
      <div className="min-h-screen bg-white">
        <CheckoutFormSkeleton />
      </div>
    }>
      <CheckoutV2Content />
    </Suspense>
  )
}

// Storage key for checkout session persistence
const CHECKOUT_SESSION_KEY = 'ob_checkout_session'

interface StoredCheckoutSession {
  customerInfo: CustomerInfo
  clientSecret: string
  paymentIntentId: string
  selectedAddOns: string[]
  timestamp: number
}

function CheckoutV2Content() {
  const searchParams = useSearchParams()
  const { currency, isLoading: currencyLoading } = useCurrency()
  const { trackInitiateCheckoutEnriched } = useAnalytics()

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
  const sessionRestoredRef = useRef(false)

  // New state for product type
  const [product, setProduct] = useState<'21dc' | 'membership'>('21dc');
  const [membershipPlan, setMembershipPlan] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const productParam = searchParams.get('product');
    const planParam = searchParams.get('plan');
    if (productParam === 'membership') {
      setProduct('membership');
      if (planParam === 'annual') {
        setMembershipPlan('annual');
      }
    }
  }, [searchParams]);

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

    if (returnedPaymentIntent) {
      // We have a payment_intent in URL - this is a redirect return
      if (redirectStatus === 'succeeded' || redirectStatus === 'processing') {
        // Payment succeeded - clear session and redirect to success page
        sessionStorage.removeItem(CHECKOUT_SESSION_KEY)
        window.location.href = `${window.location.origin}/success?payment_intent=${returnedPaymentIntent}`
      } else if (redirectStatus === 'failed' || !redirectStatus) {
        // Payment failed OR cancelled (no status) - recover and show retry
        recoverFailedPayment(returnedPaymentIntent, returnedClientSecret || null)
      }
    }
  }, [searchParams])

  // Restore checkout session from sessionStorage on page load/refresh
  // This allows users to refresh the page and stay on step 2
  useEffect(() => {
    if (sessionRestoredRef.current) return
    sessionRestoredRef.current = true

    // Don't restore if we're handling a redirect (payment return)
    const redirectStatus = searchParams.get('redirect_status')
    const returnedPaymentIntent = searchParams.get('payment_intent')
    if (returnedPaymentIntent || redirectStatus) return

    // Don't restore if this is a membership checkout (uses Stripe hosted checkout, not PaymentIntent)
    const productParam = searchParams.get('product')
    if (productParam === 'membership') return

    // Don't restore if we have URL params for auto-submit (abandoned cart recovery)
    const fn = searchParams.get('fn')
    const email = searchParams.get('email')
    if (fn && email) return

    try {
      const stored = sessionStorage.getItem(CHECKOUT_SESSION_KEY)
      if (!stored) return

      const session: StoredCheckoutSession = JSON.parse(stored)

      // Check if session is less than 45 minutes old (match checkout timer)
      const sessionAge = Date.now() - session.timestamp
      const maxAge = 45 * 60 * 1000 // 45 minutes in ms

      if (sessionAge > maxAge) {
        // Session expired, clear it
        sessionStorage.removeItem(CHECKOUT_SESSION_KEY)
        return
      }

      // Restore the session
      setCustomerInfo(session.customerInfo)
      setClientSecret(session.clientSecret)
      setPaymentIntentId(session.paymentIntentId)
      setSelectedAddOns(session.selectedAddOns)
      setStep('payment')
    } catch (err) {
      console.warn('Failed to restore checkout session:', err)
      sessionStorage.removeItem(CHECKOUT_SESSION_KEY)
    }
  }, [searchParams])

  // Save checkout session to sessionStorage when we have a valid payment session
  useEffect(() => {
    if (step === 'payment' && customerInfo && clientSecret && paymentIntentId) {
      const session: StoredCheckoutSession = {
        customerInfo,
        clientSecret,
        paymentIntentId,
        selectedAddOns,
        timestamp: Date.now(),
      }
      sessionStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(session))
    }
  }, [step, customerInfo, clientSecret, paymentIntentId, selectedAddOns])

  // Recover a failed payment so user can retry
  const recoverFailedPayment = async (piId: string, secret: string | null) => {
    try {
      // Fetch PaymentIntent details from Stripe via our API
      const response = await fetch(`/api/checkout-v2/recover?payment_intent=${piId}`)
      const data = await response.json()

      if (response.ok && data.customerInfo) {
        // Use the client secret from URL if available, otherwise from API
        const clientSecretToUse = secret || data.clientSecret

        if (!clientSecretToUse) {
          console.error('❌ No client secret available')
          setError('Payment failed. Please enter your details to try again.')
          return
        }

        // Recover the session state
        setCustomerInfo(data.customerInfo)
        setPaymentIntentId(piId)
        setClientSecret(clientSecretToUse)
        setSelectedAddOns(data.addOns || [])
        setError('Payment failed. Please try again with a different payment method.')
        setStep('payment')
      } else {
        // If we can't recover, just show a general error
        console.error('❌ Could not recover payment:', data.error)
        setError('Payment failed. Please enter your details to try again.')
      }
    } catch (err) {
      console.error('❌ Failed to recover payment:', err)
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

  // Create 21DC session
  const create21DCSession = useCallback(async (info: CustomerInfo) => {
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

  // Create Membership session (returns clientSecret like 21DC flow)
  const createMembershipSession = useCallback(async (info: CustomerInfo, plan: 'monthly' | 'annual', addOns: string[]) => {
    const cookieData = getCookie('ob_track');
    const response = await fetch('/api/checkout-v2/membership-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customerInfo: info,
            plan,
            addOns,
            trackingParams,
            cookieData,
        }),
    });
    const data = await response.json();
    if (!response.ok || !data.clientSecret || !data.paymentIntentId) {
        throw new Error(data.error || 'Failed to create membership session');
    }
    return { clientSecret: data.clientSecret, paymentIntentId: data.paymentIntentId };
  }, [trackingParams]);

  // Handle Step 1 submission
  const handleInfoSubmit = async (info: CustomerInfo) => {
    setCustomerInfo(info);
    setIsCreatingSession(true);
    setError(null);

    try {
      if (product === 'membership') {
        // Membership flow
        const membershipProductId = membershipPlan === 'annual' ? 'membership-annual' : 'membership-monthly';
        const productDetails = getProductById(membershipProductId);

        if (productDetails) {
            trackInitiateCheckout(
                `${info.firstName} ${info.lastName}`,
                info.email,
                productDetails.price,
                [productDetails.id],
                '/checkout-v2',
                trackingParams.referrer || 'direct',
                { funnel: 'membership', currency: 'USD', source: 'checkout-v2' },
                info.phone
            );
            trackInitiateCheckoutEnriched({
                value: productDetails.price,
                currency: 'USD',
                products: [productDetails.id],
                product_names: [productDetails.title],
                order_bumps: [],
                order_bump_names: [],
                funnel: 'membership',
                has_order_bumps: false,
                total_items: 1,
            });
            try {
                const { gtagBeginCheckout, gtagSetUserData } = await import('@/lib/gtag');
                gtagSetUserData({ email: info.email, phone_number: info.phone, first_name: info.firstName, last_name: info.lastName });
                gtagBeginCheckout({
                    value: productDetails.price,
                    currency: 'USD',
                    items: [{ item_id: productDetails.id, item_name: productDetails.title, price: productDetails.price, quantity: 1 }],
                });
            } catch (e) {
                console.warn('Failed to send Google Ads begin_checkout for membership:', e);
            }
        }
        
        const { clientSecret: secret, paymentIntentId: piId } = await createMembershipSession(info, membershipPlan, selectedAddOns);
        setClientSecret(secret);
        setPaymentIntentId(piId);
        setStep('payment');
      } else {
        // 21DC flow
        const { clientSecret: secret, paymentIntentId: piId } = await create21DCSession(info);
        setClientSecret(secret);
        setPaymentIntentId(piId);

        // Tracking for 21DC
        const fullName = `${info.firstName} ${info.lastName}`.trim();
        const priceInUserCurrency = getProductPrice('21dc-entry', currency) || 147;

        trackInitiateCheckout(
          fullName,
          info.email,
          priceInUserCurrency,
          ['21dc-entry'],
          '/checkout-v2',
          trackingParams.referrer || 'direct',
          { funnel: '21dc', currency: currency, source: 'checkout-v2' },
          info.phone,
          piId
        );
        trackInitiateCheckoutEnriched({
            value: priceInUserCurrency,
            currency: currency,
            products: ['21dc-entry'],
            product_names: ['21-Day Challenge'],
            order_bumps: [],
            order_bump_names: [],
            funnel: '21dc',
            has_order_bumps: false,
            total_items: 1,
        });
        
        try {
            const { gtagBeginCheckout, gtagSetUserData, gtagSignupConversion } = await import('@/lib/gtag');
            gtagSetUserData({ email: info.email, phone_number: info.phone, first_name: info.firstName, last_name: info.lastName });
            gtagBeginCheckout({
                value: priceInUserCurrency,
                currency: currency,
                items: [{ item_id: '21dc-entry', item_name: '21-Day Challenge', price: priceInUserCurrency, quantity: 1 }],
            });
            gtagSignupConversion({ value: priceInUserCurrency, currency: currency });
        } catch (e) {
            console.warn('Failed to send Google Ads begin_checkout:', e);
        }

        setStep('payment');
      }
    } catch (err: any) {
      console.error('Session creation error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsCreatingSession(false);
    }
  };

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
      <div className="min-h-screen bg-white">
        <CheckoutFormSkeleton />
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
          product={product}
          membershipPlan={membershipPlan}
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
          product={product}
          membershipPlan={membershipPlan}
        />
      )}
    </>
  )
}
