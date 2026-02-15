import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { getProductById } from '@/lib/products'
import { Currency } from '@/lib/currency'
import { getTrackingParams, getCookie } from '@/lib/tracking-cookies'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, customerInfo, currency = 'USD' as Currency } = body

    // Validate required fields
    if (!productId || !customerInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the membership product
    const product = getProductById(productId)
    if (!product || product.type !== 'membership') {
      return NextResponse.json(
        { error: 'Invalid membership product' },
        { status: 400 }
      )
    }

    // Get tracking parameters
    const trackingParams = getTrackingParams()
    const cookieData = getCookie('ob_track')

    // Get Facebook parameters from cookie
    const fbParams = {
      fbc: cookieData?._fbc,
      fbp: cookieData?._fbp,
      client_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      client_user_agent: req.headers.get('user-agent') || undefined,
    }

    // Create Stripe Checkout Session for subscription
    const session = await createCheckoutSession({
      items: [
        {
          product: product,
          quantity: 1,
          metadata: {},
        },
      ],
      hasPhysicalItems: false,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://oracleboxing.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://oracleboxing.com'}/membership`,
      customerInfo: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
      },
      currency,
      trackingParams: {
        referrer: trackingParams.first_referrer || 'direct',
        first_utm_source: trackingParams.first_utm_source,
        first_utm_medium: trackingParams.first_utm_medium,
        first_utm_campaign: trackingParams.first_utm_campaign,
        first_utm_term: trackingParams.first_utm_term,
        first_utm_content: trackingParams.first_utm_content,
        first_referrer_time: cookieData?.first_referrer_time,
        last_utm_source: trackingParams.last_utm_source,
        last_utm_medium: trackingParams.last_utm_medium,
        last_utm_campaign: trackingParams.last_utm_campaign,
        last_utm_term: trackingParams.last_utm_term,
        last_utm_content: trackingParams.last_utm_content,
        last_referrer_time: cookieData?.last_referrer_time,
        session_id: cookieData?.session_id,
        event_id: cookieData?.event_id,
        fbclid: cookieData?._fbc,
      },
      cookieData,
      fbParams,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Membership checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
