import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { getProductById } from '@/lib/products'
import { extractFacebookParams } from '@/lib/fb-param-builder'
import { createWorkflowLogger } from '@/lib/workflow-logger'

function prepareCookieDataForStripe(cookieData: any, existingKeyCount: number = 0): Record<string, string> {
  if (!cookieData) return {}
  const result: Record<string, string> = {}
  const available = 50 - existingKeyCount - 5
  let added = 0
  for (const key of ['_fbc', '_fbp']) {
    if (added >= available) break
    if (cookieData[key] != null) {
      result[`cookie_${key}`] = String(cookieData[key]).substring(0, 500)
      added++
    }
  }
  return result
}

export async function POST(req: NextRequest) {
  const logger = createWorkflowLogger({ workflowName: 'membership-stripe-session', workflowType: 'checkout', notifySlack: false })
  try {
    const fbParams = extractFacebookParams(req)
    const body = await req.json()

    const {
      customerInfo,
      plan = 'monthly',
      trackingParams,
      cookieData,
    }: {
      customerInfo: {
        firstName: string
        lastName: string
        email: string
        phone?: string
      }
      plan?: 'monthly' | 'annual'
      trackingParams?: Record<string, string>
      cookieData?: any
    } = body

    try { await logger.started('Membership Stripe Session requested', { email: customerInfo?.email, plan }) } catch {}

    if (!customerInfo?.firstName || !customerInfo?.lastName || !customerInfo?.email) {
      return NextResponse.json({ error: 'Customer first name, last name, and email are required' }, { status: 400 })
    }

    const productId = plan === 'annual' ? 'membership-annual' : 'membership-monthly'
    const membershipProduct = getProductById(productId)
    if (!membershipProduct) {
      return NextResponse.json({ error: 'Membership product not found' }, { status: 500 })
    }

    const firstName = customerInfo.firstName.trim()
    const lastName = customerInfo.lastName.trim()
    const fullName = `${firstName} ${lastName}`.trim()
    const phone = customerInfo.phone?.trim() || ''

    const customer = await stripe.customers.create({
      email: customerInfo.email,
      name: fullName,
      phone: phone || undefined,
      metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      },
    })

    try { await logger.step('stripe-customer-created', 'Stripe customer created', { customerId: customer.id }) } catch {}

    const baseMetadata: Record<string, string> = {
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_email: customerInfo.email,
      customer_phone: phone,
      funnel_type: 'membership',
      type: 'membership',
      entry_product: productId,
      plan: plan,
      product_name: membershipProduct.title,
      product_id: membershipProduct.id,
      checkout_variant: 'stripe-session',
      session_id: trackingParams?.session_id || '',
      event_id: trackingParams?.event_id || '',
      fbclid: trackingParams?.fbclid || fbParams?.fbclid || '',
      first_utm_source: trackingParams?.first_utm_source || '',
      first_utm_medium: trackingParams?.first_utm_medium || '',
      first_utm_campaign: trackingParams?.first_utm_campaign || '',
      first_utm_content: trackingParams?.first_utm_content || '',
      first_utm_term: trackingParams?.first_utm_term || '',
      first_referrer: trackingParams?.referrer || '',
      first_referrer_time: trackingParams?.first_referrer_time || '',
      last_utm_source: trackingParams?.last_utm_source || '',
      last_utm_medium: trackingParams?.last_utm_medium || '',
      last_utm_campaign: trackingParams?.last_utm_campaign || '',
      last_utm_content: trackingParams?.last_utm_content || '',
      last_utm_term: trackingParams?.last_utm_term || '',
      last_referrer_time: trackingParams?.last_referrer_time || '',
      fb_fbc: fbParams?.fbc || '',
      fb_fbp: fbParams?.fbp || '',
      fb_client_ip: fbParams?.client_ip_address || '',
      fb_user_agent: fbParams?.client_user_agent || '',
    }

    const cookieMetadata = prepareCookieDataForStripe(cookieData, Object.keys(baseMetadata).length)
    const fullMetadata = { ...baseMetadata, ...cookieMetadata }

    const cancelUrl = `https://oracleboxing.com/checkout-v2?product=membership&plan=${plan}`

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [
        { price: membershipProduct.stripe_price_id, quantity: 1 },
      ],
      success_url: 'https://oracleboxing.com/membership-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
      metadata: fullMetadata,
      subscription_data: {
        metadata: fullMetadata,
      },
    })

    if (!session.url) {
      throw new Error('No URL returned from Stripe Checkout Session creation')
    }

    try { await logger.completed(`Membership Stripe Session created for ${customerInfo.email}`, {
      sessionId: session.id,
      plan,
      email: customerInfo.email,
    }) } catch {}

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: any) {
    console.error('Membership Stripe Session creation failed:', error)
    try { await logger.failed(error.message, { stack: error.stack }) } catch {}
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
