import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors
let _stripe: Stripe | null = null

function getStripeSecretKey(): string {
  const mode = process.env.NEXT_PUBLIC_SITE_MODE || 'challenge'
  if (mode === 'test' && process.env.STRIPE_TEST_SECRET_KEY) {
    return process.env.STRIPE_TEST_SECRET_KEY
  }
  if (mode !== 'test' && process.env.STRIPE_LIVE_SECRET_KEY) {
    return process.env.STRIPE_LIVE_SECRET_KEY
  }
  // Fallback to default key
  return process.env.STRIPE_SECRET_KEY || ''
}

export const getStripe = (): Stripe => {
  if (!_stripe) {
    const stripeSecretKey = getStripeSecretKey()
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
    }
    _stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  }
  return _stripe
}

// For backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe]
  }
})
