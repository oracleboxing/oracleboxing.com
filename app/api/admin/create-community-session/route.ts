import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import {
  CommunityTier,
  CommunityDiscount,
  calculateCommunityPrice,
  createCommunityMetadata,
  getTierDisplayName,
  formatPrice,
  isDiscountEligible,
  COMMUNITY_PRODUCT_ID,
} from '@/lib/community-pricing'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  // Require admin authentication
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = await req.json()
    const {
      email,
      name,
      tier,
      discount,
      trackingParams,
    } = body as {
      email: string
      name: string
      tier: CommunityTier
      discount: CommunityDiscount
      trackingParams?: {
        referrer?: string
        utm_source?: string
        utm_medium?: string
        utm_campaign?: string
        utm_term?: string
        utm_content?: string
        fbclid?: string
        session_id?: string
        event_id?: string
      }
    }

    console.log('🎯 Creating community checkout session:', {
      tier,
      discount,
    })

    // Validate required fields
    if (!email || !name || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate discount eligibility
    if (discount && discount !== 'none' && !isDiscountEligible(tier, discount)) {
      return NextResponse.json(
        { error: `Discount "${discount}" is not eligible for tier "${tier}"` },
        { status: 400 }
      )
    }

    // Calculate pricing
    const calculation = calculateCommunityPrice(tier, discount || 'none')

    console.log('💰 Price calculation:', calculation)

    // Split name into first and last name for metadata
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''

    // Create base metadata (pricing details)
    const pricingMetadata = createCommunityMetadata(tier, discount || 'none', calculation)

    // Create rich metadata
    const fullMetadata = {
      // Customer info
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_email: email,
      customer_phone: '',

      // Pricing metadata from calculation
      ...pricingMetadata,

      // Override type
      type: 'win',

      // Tracking params (referrer and UTM)
      referrer: trackingParams?.referrer || 'internal_community_tool',
      utm_source: trackingParams?.utm_source || 'internal',
      utm_medium: trackingParams?.utm_medium || 'admin_tool',
      utm_campaign: trackingParams?.utm_campaign || 'community',
      utm_term: trackingParams?.utm_term || '',
      utm_content: trackingParams?.utm_content || '',
      fbclid: trackingParams?.fbclid || '',
      session_id: trackingParams?.session_id || '',
      event_id: trackingParams?.event_id || '',
    }

    // Get base URL for redirect
    const host = req.headers.get('host')
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const baseUrl = host ? `${protocol}://${host}` : 'https://oracleboxing.com'

    // Build product description with price breakdown
    const tierName = getTierDisplayName(tier)

    let description = `${tierName}\n\n`
    description += `Base Price: ${formatPrice(calculation.basePrice)}\n`

    if (calculation.discountAmount > 0) {
      const discountName = discount === 'challenge_winner'
        ? 'Challenge Winner Discount'
        : 'First 4 Months Discount'
      description += `${discountName}: -${formatPrice(calculation.discountAmount)}\n`
    }

    description += `\nTotal: ${formatPrice(calculation.finalPrice)}`
    description += `\nMonthly Equivalent: ${formatPrice(calculation.monthlyEquivalent)}/mo`

    // All community memberships are recurring subscriptions
    const mode = 'subscription'

    // Create Stripe checkout session
    const sessionParams: any = {
      mode,
      customer_email: email,
      line_items: [
        {
          price: calculation.priceId,
          quantity: 1,
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      success_url: `${baseUrl}/success/final?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/admin/community-checkout`,
      metadata: fullMetadata,
    }

    // Add discount/promo code if applicable
    if (calculation.promoCodeId) {
      sessionParams.discounts = [
        {
          promotion_code: calculation.promoCodeId,
        },
      ]
    }

    // Add subscription metadata (all community memberships are subscriptions)
    sessionParams.subscription_data = {
      metadata: fullMetadata,
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    console.log('✅ Community session created:', session.id)
    console.log('🔗 Checkout URL:', session.url)

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      calculation,
    })
  } catch (error: any) {
    console.error('Route /api/admin/create-community-session failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
