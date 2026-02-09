/**
 * Google Ads gtag.js helper utilities
 * Wraps gtag() calls with safety checks and typing
 */

export const GA_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''

/**
 * Check if gtag is loaded and ready
 */
function isGtagReady(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/**
 * Send a gtag event
 */
export function gtagEvent(
  eventName: string,
  params: Record<string, any>
): void {
  if (!isGtagReady() || !GA_ADS_ID) {
    console.warn(`gtag not ready, skipping event: ${eventName}`)
    return
  }

  window.gtag('event', eventName, params)
  console.log(`📊 Google Ads event: ${eventName}`, params)
}

/**
 * Send a Google Ads conversion event
 */
export function gtagConversion(
  conversionLabel: string,
  params: {
    value: number
    currency: string
    transaction_id?: string
    items?: Array<{
      item_id: string
      item_name: string
      price: number
      quantity: number
    }>
  }
): void {
  if (!isGtagReady() || !GA_ADS_ID) {
    console.warn('gtag not ready, skipping conversion')
    return
  }

  window.gtag('event', 'conversion', {
    send_to: `${GA_ADS_ID}/${conversionLabel}`,
    value: params.value,
    currency: params.currency,
    transaction_id: params.transaction_id,
    items: params.items,
  })
  console.log(`📊 Google Ads conversion sent:`, { conversionLabel, ...params })
}

/**
 * Set user data for enhanced conversions
 * Data is automatically hashed by gtag.js
 */
export function gtagSetUserData(userData: {
  email?: string
  phone_number?: string
  first_name?: string
  last_name?: string
  street?: string
  city?: string
  region?: string
  postal_code?: string
  country?: string
}): void {
  if (!isGtagReady() || !GA_ADS_ID) return

  // Filter out undefined values
  const cleanData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  )

  if (Object.keys(cleanData).length === 0) return

  window.gtag('set', 'user_data', cleanData)
  console.log('📊 Google Ads user_data set for enhanced conversions')
}

/**
 * Track view_item event (product page view)
 */
export function gtagViewItem(params: {
  item_id: string
  item_name: string
  price: number
  currency: string
  item_category?: string
}): void {
  gtagEvent('view_item', {
    currency: params.currency,
    value: params.price,
    items: [{
      item_id: params.item_id,
      item_name: params.item_name,
      price: params.price,
      quantity: 1,
      item_category: params.item_category || 'Boxing Course',
    }],
  })
}

/**
 * Track add_to_cart event
 */
export function gtagAddToCart(params: {
  item_id: string
  item_name: string
  price: number
  currency: string
}): void {
  gtagEvent('add_to_cart', {
    currency: params.currency,
    value: params.price,
    items: [{
      item_id: params.item_id,
      item_name: params.item_name,
      price: params.price,
      quantity: 1,
      item_category: 'Boxing Course',
    }],
  })
}

/**
 * Track begin_checkout event
 */
export function gtagBeginCheckout(params: {
  value: number
  currency: string
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}): void {
  gtagEvent('begin_checkout', {
    currency: params.currency,
    value: params.value,
    items: params.items,
  })
}

/**
 * Google Ads conversion label for purchases
 */
const PURCHASE_CONVERSION_LABEL = '8856CNzq5PUbEI2KkL5B'

/**
 * Track purchase event + Google Ads conversion
 */
export function gtagPurchase(params: {
  transaction_id: string
  value: number
  currency: string
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}): void {
  // Standard purchase event (for GA4 / GTM)
  gtagEvent('purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency,
    items: params.items,
  })

  // Google Ads conversion event
  if (GA_ADS_ID && PURCHASE_CONVERSION_LABEL) {
    gtagConversion(PURCHASE_CONVERSION_LABEL, {
      value: params.value,
      currency: params.currency,
      transaction_id: params.transaction_id,
    })
  }
}
