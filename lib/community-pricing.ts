/**
 * Community Pricing Configuration
 *
 * This file defines all community membership pricing, discount codes,
 * and calculation logic for the admin community checkout tool.
 */

// Community Product ID
export const COMMUNITY_PRODUCT_ID = 'prod_TKqg25PDS8om6s'

// Community Membership Tiers (based on commitment length)
export type CommunityTier = 'monthly' | '3_month' | '6_month' | 'annual' | '24_month'

// Discount Types
export type CommunityDiscount = 'none' | 'challenge_winner' | 'first_4_months'

// Stripe Price IDs for each tier
export const COMMUNITY_PRICE_IDS: Record<CommunityTier, string> = {
  monthly: 'price_1SOAysKPvH4Ddlg1yHxTrpzD',      // $97/mo
  '3_month': 'price_1SOAysKPvH4Ddlg1JTdPV3rt',    // $297/3mo
  '6_month': 'price_1SOAysKPvH4Ddlg1DLECvdXA',    // $497/6mo
  annual: 'price_1SOAysKPvH4Ddlg188dzDecq',       // $897/year
  '24_month': 'price_1SOAysKPvH4Ddlg188dzDecq',   // $1,597/24mo (TODO: verify this price ID)
}

// Base prices for each tier (in dollars)
export const TIER_PRICES: Record<CommunityTier, number> = {
  monthly: 97,
  '3_month': 297,
  '6_month': 497,
  annual: 897,
  '24_month': 1597,
}

// Stripe Promotion Code IDs
export const PROMO_CODE_IDS = {
  challenge_winner: 'promo_1SQBjEKPvH4Ddlg10pBvi4ZL',   // $147 off (for 6mo, annual, 24mo)
  first_4_months: 'promo_1S1kraKPvH4Ddlg1namrGeoW',     // $49.25 off for 4 months (monthly only)
}

// Discount amounts (in dollars)
export const DISCOUNT_AMOUNTS = {
  challenge_winner: 147,      // One-time $147 off
  first_4_months: 49.25,      // $49.25 off per month for 4 months
}

// Tier display names
export const TIER_DISPLAY_NAMES: Record<CommunityTier, string> = {
  monthly: 'Monthly Membership',
  '3_month': '3-Month Membership',
  '6_month': '6-Month Membership',
  annual: 'Annual Membership',
  '24_month': '24-Month Membership',
}

// Discount eligibility matrix
export const DISCOUNT_ELIGIBILITY: Record<CommunityTier, CommunityDiscount[]> = {
  monthly: ['first_4_months'],                          // First 4 months discount
  '3_month': ['challenge_winner'],                      // Challenge winner (not advised)
  '6_month': ['challenge_winner'],                      // Challenge winner
  annual: ['challenge_winner'],                         // Challenge winner
  '24_month': ['challenge_winner'],                     // Challenge winner
}

// Check if discount is eligible for tier
export function isDiscountEligible(tier: CommunityTier, discount: CommunityDiscount): boolean {
  if (discount === 'none') return true
  return DISCOUNT_ELIGIBILITY[tier].includes(discount)
}

// Check if discount application is advised
export function isDiscountAdvised(tier: CommunityTier, discount: CommunityDiscount): boolean {
  // Challenge winner discount on 3-month is not advised
  if (tier === '3_month' && discount === 'challenge_winner') {
    return false
  }
  return true
}

// Pricing calculation result
export interface CommunityPriceCalculation {
  tier: CommunityTier
  basePrice: number
  discountType: CommunityDiscount
  discountAmount: number
  finalPrice: number
  priceId: string
  promoCodeId?: string
  monthlyEquivalent: number  // For comparison purposes
  totalMonths: number
}

// Calculate community pricing
export function calculateCommunityPrice(
  tier: CommunityTier,
  discount: CommunityDiscount = 'none'
): CommunityPriceCalculation {
  const basePrice = TIER_PRICES[tier]
  const priceId = COMMUNITY_PRICE_IDS[tier]

  let discountAmount = 0
  let promoCodeId: string | undefined = undefined

  // Apply discount if eligible
  if (discount !== 'none' && isDiscountEligible(tier, discount)) {
    if (discount === 'challenge_winner') {
      discountAmount = DISCOUNT_AMOUNTS.challenge_winner
      promoCodeId = PROMO_CODE_IDS.challenge_winner
    } else if (discount === 'first_4_months') {
      // For monthly, discount is per month for 4 months, but we show total discount
      discountAmount = DISCOUNT_AMOUNTS.first_4_months * 4
      promoCodeId = PROMO_CODE_IDS.first_4_months
    }
  }

  const finalPrice = Math.max(0, basePrice - discountAmount)

  // Calculate total months and monthly equivalent
  const totalMonths = getTierMonths(tier)
  const monthlyEquivalent = finalPrice / totalMonths

  return {
    tier,
    basePrice,
    discountType: discount,
    discountAmount,
    finalPrice,
    priceId,
    promoCodeId,
    monthlyEquivalent,
    totalMonths,
  }
}

// Get number of months for a tier
function getTierMonths(tier: CommunityTier): number {
  switch (tier) {
    case 'monthly': return 1
    case '3_month': return 3
    case '6_month': return 6
    case 'annual': return 12
    case '24_month': return 24
  }
}

// Format price for display
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Get tier display name
export function getTierDisplayName(tier: CommunityTier): string {
  return TIER_DISPLAY_NAMES[tier]
}

// Get discount display name
export function getDiscountDisplayName(discount: CommunityDiscount): string {
  switch (discount) {
    case 'none':
      return 'No Discount'
    case 'challenge_winner':
      return `Challenge Winner (-${formatPrice(DISCOUNT_AMOUNTS.challenge_winner)})`
    case 'first_4_months':
      return `First 4 Months (-${formatPrice(DISCOUNT_AMOUNTS.first_4_months)}/mo × 4)`
  }
}

// Create metadata for Stripe session
export function createCommunityMetadata(
  tier: CommunityTier,
  discount: CommunityDiscount,
  calculation: CommunityPriceCalculation
): Record<string, string> {
  return {
    product_type: 'community',
    tier: tier,
    base_price: calculation.basePrice.toString(),
    discount_type: discount,
    discount_amount: calculation.discountAmount.toString(),
    final_price: calculation.finalPrice.toString(),
    monthly_equivalent: calculation.monthlyEquivalent.toFixed(2),
    total_months: calculation.totalMonths.toString(),
  }
}
