import Stripe from 'stripe'

// Cache per key to avoid re-creating on every call, but pick the right key each time
let _stripe: Stripe | null = null
let _cachedKey: string = ''

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
  const key = getStripeSecretKey()
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
  }
  // Recreate if key changed (e.g. env var updated between invocations)
  if (!_stripe || key !== _cachedKey) {
    _cachedKey = key
    _stripe = new Stripe(key, {
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
