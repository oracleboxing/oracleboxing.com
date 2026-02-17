import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { getProductById } from '@/lib/products'
import { getStripePriceId } from '@/lib/currency'
import { extractFacebookParams } from '@/lib/fb-param-builder'
import { notifyOps } from '@/lib/slack-notify'
import { createWorkflowLogger } from '@/lib/workflow-logger'

export async function POST(req: NextRequest) {
  const logger = createWorkflowLogger({ workflowName: 'membership-checkout-session', workflowType: 'checkout', notifySlack: true })
  try {
    const fbParams = extractFacebookParams(req)
    const body = await req.json()

    const {
      customerInfo,
      plan = 'monthly',
      addOns = [],
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
      addOns?: string[]
      trackingParams?: Record<string, string>
      cookieData?: any
    } = body

    try { await logger.started('Membership checkout session requested', { email: customerInfo?.email, plan, addOns }) } catch {}

    if (!customerInfo?.firstName || !customerInfo?.lastName || !customerInfo?.email) {
      return NextResponse.json({ error: 'Customer first name, last name, and email are required' }, { status: 400 })
    }

    // Get membership product
    const productId = plan === 'annual' ? 'membership-annual' : 'membership-monthly'
    const membershipProduct = getProductById(productId)
    if (!membershipProduct) {
      return NextResponse.json({ error: 'Membership product not found' }, { status: 500 })
    }

    const firstName = customerInfo.firstName.trim()
    const lastName = customerInfo.lastName.trim()
    const fullName = `${firstName} ${lastName}`.trim()
    const phone = customerInfo.phone?.trim() || ''

    // Create Stripe customer
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

    console.log('Created Stripe Customer:', customer.id)
    try { await logger.step('stripe-customer-created', 'Stripe customer created', { customerId: customer.id }) } catch {}

    // Build line items - membership subscription price
    const lineItems: any[] = [
      {
        price: membershipProduct.stripe_price_id,
        quantity: 1,
      },
    ]

    // Add one-time add-ons
    const addOnMetadata: string[] = []
    for (const addOnId of addOns) {
      const addOnProduct = getProductById(addOnId)
      if (addOnProduct) {
        // Use USD price for add-ons (membership is USD only)
        const addOnPriceId = getStripePriceId(addOnProduct, 'USD')
        lineItems.push({
          price: addOnPriceId,
          quantity: 1,
        })
        addOnMetadata.push(addOnProduct.metadata || addOnId)
      }
    }

    // Build metadata
    const metadata: Record<string, string> = {
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_email: customerInfo.email,
      customer_phone: phone,
      funnel_type: 'membership',
      type: 'membership',
      entry_product: productId,
      plan: plan,
      add_ons_included: addOnMetadata.join(','),
      product_name: membershipProduct.title,
      product_id: membershipProduct.id,
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

    // Add cookie data
    if (cookieData?._fbc) metadata['cookie__fbc'] = String(cookieData._fbc)
    if (cookieData?._fbp) metadata['cookie__fbp'] = String(cookieData._fbp)

    // Determine base URL
    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || 'https://oracleboxing.com'

    // Create Stripe Checkout Session with mode: 'subscription'
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: lineItems,
      success_url: `${origin}/membership-success?subscription={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout-v2?product=membership&plan=${plan}`,
      metadata,
      subscription_data: {
        metadata,
      },
      allow_promotion_codes: true,
    })

    console.log('Created Checkout Session:', session.id)
    try { await logger.completed(`Membership checkout session created for ${customerInfo.email}`, { sessionId: session.id, plan, email: customerInfo.email }) } catch {}

    const addOnNames = addOnMetadata.length > 0 ? ` + ${addOnMetadata.join(', ')}` : ''
    notifyOps(`💳 Membership checkout created - ${customerInfo.email} for ${membershipProduct.title}${addOnNames}`)

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error: any) {
    console.error('Membership checkout session failed:', error)
    try { await logger.failed(error.message, { stack: error.stack }) } catch {}
    notifyOps(`❌ Membership checkout failed - ${error.message}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
