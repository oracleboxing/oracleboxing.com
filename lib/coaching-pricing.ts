// ===================================================================
// COACHING PRICING LOGIC UTILITIES
// ===================================================================
// Internal tool for creating custom 1-on-1 coaching checkout sessions
// with flexible pricing, discounts, and payment plans

export type CoachingTier = 'tier_1' | 'tier_2'
export type CustomerDiscount = 'none' | 'challenge_winner'
export type PaymentPlan = 'full' | 'split_2' | 'monthly'
export type Coach = 'Toni' | 'Charlie'

// Coach-specific pricing structure
export const TIER_PRICES_BY_COACH: Record<Coach, Record<CoachingTier, number>> = {
  Toni: { tier_1: 1200, tier_2: 1800 },
  Charlie: { tier_1: 1000, tier_2: 1500 },
}

// Backward-compatible default (Toni's prices)
export const TIER_PRICES = TIER_PRICES_BY_COACH.Toni

// Customer discount amounts
export const CUSTOMER_DISCOUNTS = {
  none: 0,
  challenge_winner: 147,
} as const

// Coach-specific split pay rates - (base price * 0.9) / 2 for 6-month commitment
export const SPLIT_PAY_RATES_BY_COACH: Record<Coach, Record<CoachingTier, number>> = {
  Toni: { tier_1: 540, tier_2: 810 },   // ($1200 * 0.9) / 2, ($1800 * 0.9) / 2
  Charlie: { tier_1: 450, tier_2: 675 }, // ($1000 * 0.9) / 2, ($1500 * 0.9) / 2
}

// Backward-compatible default
export const SPLIT_PAY_RATES = SPLIT_PAY_RATES_BY_COACH.Toni

// Coach-specific monthly subscription rates (3 month commitment)
export const MONTHLY_RATES_BY_COACH: Record<Coach, Record<CoachingTier, number>> = {
  Toni: { tier_1: 400, tier_2: 600 },
  Charlie: { tier_1: 333, tier_2: 500 },
}

// Backward-compatible default
export const MONTHLY_RATES = MONTHLY_RATES_BY_COACH.Toni

// 6-month commitment discount percentage
export const SIX_MONTH_DISCOUNT_PERCENTAGE = 0.10 // 10%

// Stripe product IDs for 1-on-1 coaching (LIVE)
export const COACHING_PRODUCT_TIER_1 = 'prod_TmMdSWue5DSIMP' // Tier 1 Monthly
export const COACHING_PRODUCT_TIER_2 = 'prod_TmMdpVbncoqN1F' // Tier 2 Monthly

// Stripe price IDs for monthly coaching subscriptions (LIVE)
// Toni's prices
export const COACHING_PRICE_TIER_1_MONTHLY = 'price_1SonyzKPvH4Ddlg1BN0tsim4' // Toni $400/month
export const COACHING_PRICE_TIER_2_MONTHLY = 'price_1Sonz0KPvH4Ddlg1bNZJbS3l' // Toni $600/month

// Charlie's prices
export const COACHING_PRICE_CHARLIE_TIER_1_MONTHLY = 'price_1SwLraKPvH4Ddlg1OnBMVSAC' // Charlie $333/month
export const COACHING_PRICE_CHARLIE_TIER_2_MONTHLY = 'price_1SwLraKPvH4Ddlg1r5SzuFPi' // Charlie $500/month

// Coach-specific monthly price ID lookup
export const MONTHLY_PRICE_IDS_BY_COACH: Record<Coach, Record<CoachingTier, string>> = {
  Toni: {
    tier_1: COACHING_PRICE_TIER_1_MONTHLY,
    tier_2: COACHING_PRICE_TIER_2_MONTHLY,
  },
  Charlie: {
    tier_1: COACHING_PRICE_CHARLIE_TIER_1_MONTHLY,
    tier_2: COACHING_PRICE_CHARLIE_TIER_2_MONTHLY,
  },
}

// Legacy product IDs (kept for backward compatibility)
export const COACHING_PRODUCT_1MONTH = COACHING_PRODUCT_TIER_1
export const COACHING_PRODUCT_3MONTH = 'prod_TKZE6NZZFeK8SM'
export const COACHING_PRICE_1MONTH = 'price_1SNu6dKPvH4Ddlg1UbAOpoo4'

// Legacy product ID (for compatibility)
export const COACHING_PRODUCT_ID = COACHING_PRODUCT_3MONTH

// ===================================================================
// PRICING CALCULATION FUNCTIONS
// ===================================================================

interface PricingCalculation {
  basePrice: number
  customerDiscount: number
  subtotal: number
  sixMonthDiscount: number
  finalPrice: number
  monthlyAmount?: number // For split_2 or monthly plans
}

/**
 * Calculate final pricing based on selections
 * @param coach - defaults to 'Toni' for backward compatibility
 */
export function calculateCoachingPrice(
  tier: CoachingTier,
  customerDiscount: CustomerDiscount,
  sixMonthCommitment: boolean,
  paymentPlan: PaymentPlan,
  coach: Coach = 'Toni'
): PricingCalculation {
  // Get coach-specific tier price
  const tierPrice = TIER_PRICES_BY_COACH[coach][tier]

  // Base price for selected tier
  // For 6-month commitment, base price is 2x the tier price (paying for 2 months upfront)
  const basePrice = sixMonthCommitment ? tierPrice * 2 : tierPrice

  // Apply customer discount
  const discountAmount = CUSTOMER_DISCOUNTS[customerDiscount]
  const subtotal = basePrice - discountAmount

  // Calculate 6-month discount if applicable (10% of subtotal)
  const sixMonthDiscount = sixMonthCommitment
    ? Math.round(subtotal * SIX_MONTH_DISCOUNT_PERCENTAGE)
    : 0

  // Final price after all discounts
  const finalPrice = subtotal - sixMonthDiscount

  // Calculate monthly amount for payment plans
  let monthlyAmount: number | undefined = undefined

  if (paymentPlan === 'split_2') {
    // Split by 2: If 6-month commitment, divide finalPrice by 2
    // Otherwise divide subtotal (after customer discount) by 2
    monthlyAmount = sixMonthCommitment
      ? Math.round(finalPrice / 2)
      : Math.round(subtotal / 2)
  } else if (paymentPlan === 'monthly') {
    // Monthly: Use coach-specific monthly rate
    monthlyAmount = MONTHLY_RATES_BY_COACH[coach][tier]
  }

  return {
    basePrice,
    customerDiscount: discountAmount,
    subtotal,
    sixMonthDiscount,
    finalPrice,
    monthlyAmount,
  }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString()}`
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: CoachingTier): string {
  return `Tier ${tier.split('_')[1]}`
}

/**
 * Get customer discount display name
 */
export function getCustomerDiscountDisplayName(discount: CustomerDiscount): string {
  switch (discount) {
    case 'none':
      return 'No Discount'
    case 'challenge_winner':
      return 'Challenge Winner'
  }
}

/**
 * Get payment plan display name
 */
export function getPaymentPlanDisplayName(plan: PaymentPlan): string {
  switch (plan) {
    case 'full':
      return 'Pay in Full'
    case 'split_2':
      return 'Split by 2'
    case 'monthly':
      return 'Monthly'
  }
}

/**
 * Create metadata object for Stripe session
 */
export function createCoachingMetadata(
  tier: CoachingTier,
  customerDiscount: CustomerDiscount,
  sixMonthCommitment: boolean,
  paymentPlan: PaymentPlan,
  coach: Coach,
  calculation: PricingCalculation
) {
  return {
    // Product identification
    product_id: COACHING_PRODUCT_ID,
    product_name: '1-on-1 Coaching',
    type: 'coaching',
    funnel_type: 'internal_coaching_tool',
    created_by: 'internal_coaching_tool',

    // Pricing details
    tier,
    base_price: calculation.basePrice.toString(),
    customer_discount_type: customerDiscount,
    customer_discount_amount: calculation.customerDiscount.toString(),
    six_month_commitment: sixMonthCommitment.toString(),
    six_month_discount_amount: calculation.sixMonthDiscount.toString(),
    final_price: calculation.finalPrice.toString(),

    // Payment plan
    payment_plan: paymentPlan,
    monthly_amount: calculation.monthlyAmount?.toString() || '',

    // Coach assignment
    coach,
  }
}
