export type ProductType = 'course' | 'membership' | 'merch'

export interface MerchVariant {
  size: string
  color: string
  stripe_price_id: string
  stripe_product_id: string
  sku: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  type: ProductType
  stripe_price_id: string
  stripe_product_id: string
  image: string
  recurring?: boolean
  interval?: 'month' | 'year' | '6 months' | '3 months'
  variants?: MerchVariant[]
  // Metadata for tracking and funnel logic
  metadata?: string // Short identifier (e.g., 'bffp', '6wc', 'obm')
  // Multi-currency price IDs (optional - for products with multiple currencies)
  price_ids?: {
    usd?: string
    gbp?: string
    eur?: string
    aud?: string
    cad?: string
    aed?: string
    [key: string]: string | undefined // Allow additional keys for special cases
  }
  // Multi-currency prices (optional - for display purposes)
  prices?: {
    usd?: number
    gbp?: number
    eur?: number
    aud?: number
    cad?: number
    aed?: number
  }
  // Course-specific metadata
  shortDescription?: string
  perfectFor?: string
  moduleCount?: number
  lessonCount?: number
  workoutCount?: number
  resourceCount?: number
  hours?: number
  weeks?: number
  hasStructuredProgression?: boolean
  workoutPlans?: number
  updatedMonthly?: boolean
  lessonCountPrefix?: string
  // Membership-specific metadata
  hasLiveCoaching?: boolean
  hasCommunity?: boolean
  hasVideoFeedback?: boolean
  coursesIncluded?: string[]
  // Physical product metadata
  requiresShipping?: boolean
  shippingRates?: {
    uk?: { id: string; price: number; deliveryDays: string }
    europe?: { id: string; price: number; deliveryDays: string }
    us_canada?: { id: string; price: number; deliveryDays: string }
    rest_of_world?: { id: string; price: number; deliveryDays: string }
  }
}

export interface CartItem {
  product: Product
  quantity: number
  variant?: MerchVariant
  price_id: string
  metadata?: Record<string, string> // Additional metadata for tracksuit (size, color, etc.)
}

export interface Cart {
  items: CartItem[]
  hasPhysicalItems: boolean
  total: number
}
