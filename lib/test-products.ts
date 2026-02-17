/**
 * Test Stripe Product and Price IDs
 *
 * These are for the test Stripe account (pk_test_ / sk_test_ keys).
 * Automatically enabled when NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY starts with pk_test_
 *
 * Created: 2026-01-10
 *
 * To switch between test and live modes:
 * - Test mode: Use pk_test_ and sk_test_ keys in .env.local
 * - Live mode: Use pk_live_ and sk_live_ keys in .env.local
 */

export interface TestPriceIds {
  usd: string
  gbp: string
  eur: string
  aud: string
  cad: string
}

export interface TestProduct {
  productId: string
  priceIds: TestPriceIds
}

// Test Product IDs from Stripe Test Mode
export const TEST_PRODUCTS: Record<string, TestProduct> = {
  // 21-Day Challenge Entry
  '21dc-entry': {
    productId: 'prod_TlX3IV13wvaJB3',
    priceIds: {
      usd: 'price_1SnzzkQNEdHwdojXwHX8kQtX',
      gbp: 'price_1SnzzkQNEdHwdojXf1NP3z5v',
      eur: 'price_1SnzzlQNEdHwdojXgPnYvJvs',
      aud: 'price_1SnzzlQNEdHwdojXbioAyYdk',
      cad: 'price_1SnzzlQNEdHwdojXTpy5KM28',
    },
  },
  // Boxing from First Principles
  'bffp': {
    productId: 'prod_TlX3ocBJIIM3I7',
    priceIds: {
      usd: 'price_1SnzzmQNEdHwdojXAAuVtlW8',
      gbp: 'price_1SnzzmQNEdHwdojXf4EDkhgQ',
      eur: 'price_1SnzzmQNEdHwdojXuimq9tSJ',
      aud: 'price_1SnzzmQNEdHwdojXhJPeYE7W',
      cad: 'price_1SnzznQNEdHwdojXKXXUMEf0',
    },
  },
  // Oracle Boxing Tracksuit
  'tracksuit': {
    productId: 'prod_TlX32CV2uwUatQ',
    priceIds: {
      usd: 'price_1SnzznQNEdHwdojXt5ZTA6tS',
      gbp: 'price_1SnzzoQNEdHwdojXhFP1cv3E',
      eur: 'price_1SnzzoQNEdHwdojXHuXgVv4e',
      aud: 'price_1SnzzoQNEdHwdojXxxgVh43w',
      cad: 'price_1SnzzoQNEdHwdojXrMCKESHK',
    },
  },
  // 2025 Call Recording Vault (both ID formats supported)
  'vault-2025': {
    productId: 'prod_TlX3RIqoe4SRGd',
    priceIds: {
      usd: 'price_1SnzzpQNEdHwdojXNV6GBvbg',
      gbp: 'price_1SnzzpQNEdHwdojX6yEIaXBR',
      eur: 'price_1SnzzpQNEdHwdojXLW0Iyj34',
      aud: 'price_1SnzzqQNEdHwdojXC0bZiJqw',
      cad: 'price_1SnzzqQNEdHwdojXuX9bNkYR',
    },
  },
}

// Product ID aliases (for different naming conventions in code)
const PRODUCT_ALIASES: Record<string, string> = {
  'vault2025': 'vault-2025',
}

export type TestProductId = keyof typeof TEST_PRODUCTS

/**
 * Check if we're in test mode based on the Stripe key
 */
export function isTestMode(): boolean {
  const siteMode = process.env.NEXT_PUBLIC_SITE_MODE || 'challenge'
  if (siteMode === 'test') return true
  if (siteMode === 'challenge' || siteMode === 'membership') return false
  // Fallback: check publishable key
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
  return stripeKey.startsWith('pk_test_')
}

/**
 * Get test price ID for a product and currency
 * Returns null if product not found in test products (will fall back to live)
 */
export function getTestPriceId(productId: string, currency: string): string | null {
  const normalizedCurrency = currency.toLowerCase() as keyof TestPriceIds

  // Check for aliases
  const resolvedId = PRODUCT_ALIASES[productId] || productId
  const product = TEST_PRODUCTS[resolvedId]

  if (!product) {
    return null
  }

  // Return currency-specific price or fall back to USD
  return product.priceIds[normalizedCurrency] || product.priceIds.usd
}
