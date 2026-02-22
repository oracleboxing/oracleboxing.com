import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { getProductById } from '@/lib/products'
import { getStripePriceId } from '@/lib/currency'
import { extractFacebookParams } from '@/lib/fb-param-builder'
import { createWorkflowLogger } from '@/lib/workflow-logger'
import Stripe from 'stripe'

// Helper to flatten cookie data
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
  const logger = createWorkflowLogger({ workflowName: 'membership-checkout-session', workflowType: 'checkout', notifySlack: false })
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

    // Build metadata
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

    // Build add-on one-time items for the first invoice
    const addOnMetadata: string[] = []
    const addOnInvoiceItems: { price: string; quantity: number }[] = []

    for (const addOnId of addOns) {
      const addOnProduct = getProductById(addOnId)
      if (addOnProduct) {
        const addOnPriceId = getStripePriceId(addOnProduct, 'USD')
        addOnInvoiceItems.push({ price: addOnPriceId, quantity: 1 })
        addOnMetadata.push(addOnProduct.metadata || addOnId)
      }
    }

    baseMetadata.add_ons_included = addOnMetadata.join(',')

    // Calculate total: membership price + add-ons
    const membershipPrice = await stripe.prices.retrieve(membershipProduct.stripe_price_id)
    let totalAmount = membershipPrice.unit_amount || 0
    for (const item of addOnInvoiceItems) {
      const price = await stripe.prices.retrieve(item.price)
      if (price.unit_amount) totalAmount += price.unit_amount
    }

    // Create PaymentIntent only - NO subscription yet
    // The subscription will be created by the webhook after payment succeeds
    // using the saved payment method (setup_future_usage: 'off_session')
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      customer: customer.id,
      setup_future_usage: 'off_session',
      automatic_payment_methods: { enabled: true },
      metadata: {
        ...baseMetadata,
        ...cookieMetadata,
        // Webhook uses these to create the subscription after payment
        membership_price_id: membershipProduct.stripe_price_id,
        line_items: JSON.stringify([membershipProduct.stripe_price_id, ...addOnInvoiceItems.map(i => i.price)]),
        tax_inclusive: 'true',
      },
    })

    if (!paymentIntent.client_secret) {
      throw new Error('No client secret returned from PaymentIntent creation')
    }

    console.log('Created PaymentIntent:', paymentIntent.id, 'Amount:', totalAmount)
    try { await logger.completed(`Membership checkout created for ${customerInfo.email}`, {
      paymentIntentId: paymentIntent.id,
      plan,
      email: customerInfo.email,
      amount: totalAmount,
    }) } catch {}

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
    })
  } catch (error: any) {
    console.error('Membership checkout session failed:', error)
    try { await logger.failed(error.message, { stack: error.stack }) } catch {}
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
