import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { Currency, getStripePriceId } from '@/lib/currency'
import { getProductById } from '@/lib/products'
import { extractFacebookParams } from '@/lib/fb-param-builder'
import Stripe from 'stripe'

// Helper function to flatten cookie data into individual Stripe metadata fields
function prepareCookieDataForStripe(cookieData: any, existingKeyCount: number = 0): Record<string, string> {
  if (!cookieData) return {};

  const flattenedCookieData: Record<string, string> = {};
  const MAX_METADATA_KEYS = 500;
  const MAX_VALUE_LENGTH = 500;
  const RESERVED_KEYS = 50;
  const availableKeys = MAX_METADATA_KEYS - existingKeyCount - RESERVED_KEYS;

  const priorityFields = [
    'session_id', 'event_id', 'landing_time',
    'first_utm_source', 'first_utm_medium', 'first_utm_campaign', 'first_utm_content', 'first_utm_term',
    'last_utm_source', 'last_utm_medium', 'last_utm_campaign', 'last_utm_content', 'last_utm_term',
    'first_referrer', 'first_referrer_time', 'last_referrer', 'last_referrer_time',
    '_fbc', '_fbp', 'country_code', 'currency', 'consent_given',
  ];

  let keysAdded = 0;
  for (const key of priorityFields) {
    if (keysAdded >= availableKeys) break;
    if (cookieData[key] !== null && cookieData[key] !== undefined) {
      let value = String(cookieData[key]);
      if (value.length > MAX_VALUE_LENGTH) {
        value = value.substring(0, MAX_VALUE_LENGTH);
      }
      flattenedCookieData[`cookie_${key}`] = value;
      keysAdded++;
    }
  }

  for (const [key, value] of Object.entries(cookieData)) {
    if (keysAdded >= availableKeys) break;
    if (priorityFields.includes(key)) continue;
    if (value !== null && value !== undefined) {
      let stringValue = String(value);
      if (stringValue.length > MAX_VALUE_LENGTH) {
        stringValue = stringValue.substring(0, MAX_VALUE_LENGTH);
      }
      flattenedCookieData[`cookie_${key}`] = stringValue;
      keysAdded++;
    }
  }

  return flattenedCookieData;
}

export async function POST(req: NextRequest) {
  try {
    // Extract Facebook parameters
    const fbParams = extractFacebookParams(req)

    const body = await req.json()

    const {
      customerInfo,
      currency = 'USD',
      trackingParams,
      cookieData,
      addOns = [], // Array of add-on IDs: ['bffp', 'tracksuit', 'vault-2025']
    }: {
      customerInfo: {
        firstName: string
        lastName: string
        email: string
        phone?: string
      }
      currency?: Currency
      trackingParams?: {
        referrer: string
        first_utm_source?: string
        first_utm_medium?: string
        first_utm_campaign?: string
        first_utm_term?: string
        first_utm_content?: string
        first_referrer_time?: string
        last_utm_source?: string
        last_utm_medium?: string
        last_utm_campaign?: string
        last_utm_term?: string
        last_utm_content?: string
        last_referrer_time?: string
        fbclid?: string
        session_id?: string
        event_id?: string
      }
      cookieData?: any
      addOns?: string[]
    } = body

    // Validate customer info
    if (!customerInfo?.firstName || !customerInfo?.lastName || !customerInfo?.email) {
      return NextResponse.json(
        { error: 'Customer first name, last name, and email are required' },
        { status: 400 }
      )
    }

    // Get products from server-side (correct env vars)
    const mainProduct = getProductById('21dc-entry')

    if (!mainProduct) {
      return NextResponse.json(
        { error: '21DC product not found' },
        { status: 500 }
      )
    }

    // Get currency-aware price ID for main product
    const mainPriceId = getStripePriceId(mainProduct, currency)

    // Create customer in Stripe
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

    console.log('Created Stripe Customer:', customer.id)

    // Build line items - main product first
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: mainPriceId,
        quantity: 1,
      },
    ]

    // Add selected add-ons to line items
    const addOnMetadata: string[] = []

    for (const addOnId of addOns) {
      const addOnProduct = getProductById(addOnId)
      if (addOnProduct) {
        const addOnPriceId = getStripePriceId(addOnProduct, currency)
        line_items.push({
          price: addOnPriceId,
          quantity: 1,
        })
        addOnMetadata.push(addOnProduct.metadata || addOnId)
      }
    }

    // Build metadata
    const baseMetadata: Record<string, string> = {
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_email: customerInfo.email,
      customer_phone: phone,
      funnel_type: '21dc',
      type: '21dc',
      entry_product: '21dc_entry',
      add_ons_included: addOnMetadata.join(','),
      product_name: mainProduct.title,
      product_id: mainProduct.id,
      session_id: trackingParams?.session_id || '',
      event_id: trackingParams?.event_id || '',
      fbclid: trackingParams?.fbclid || fbParams?.fbclid || '',
      // First-touch attribution
      first_utm_source: trackingParams?.first_utm_source || '',
      first_utm_medium: trackingParams?.first_utm_medium || '',
      first_utm_campaign: trackingParams?.first_utm_campaign || '',
      first_utm_content: trackingParams?.first_utm_content || '',
      first_utm_term: trackingParams?.first_utm_term || '',
      first_referrer: trackingParams?.referrer || '',
      first_referrer_time: trackingParams?.first_referrer_time || '',
      // Last-touch attribution
      last_utm_source: trackingParams?.last_utm_source || '',
      last_utm_medium: trackingParams?.last_utm_medium || '',
      last_utm_campaign: trackingParams?.last_utm_campaign || '',
      last_utm_content: trackingParams?.last_utm_content || '',
      last_utm_term: trackingParams?.last_utm_term || '',
      last_referrer_time: trackingParams?.last_referrer_time || '',
      // Facebook Conversions API
      fb_fbc: fbParams?.fbc || '',
      fb_fbp: fbParams?.fbp || '',
      fb_client_ip: fbParams?.client_ip_address || '',
      fb_user_agent: fbParams?.client_user_agent || '',
    }

    const baseKeyCount = Object.keys(baseMetadata).length
    const cookieMetadata = prepareCookieDataForStripe(cookieData, baseKeyCount)

    // Calculate total amount from line items
    let totalAmount = 0
    const lineItemDescriptions: string[] = []

    // Fetch prices from Stripe to get amounts
    for (const lineItem of line_items) {
      const price = await stripe.prices.retrieve(lineItem.price as string)
      if (price.unit_amount) {
        totalAmount += price.unit_amount * (lineItem.quantity || 1)
      }
      // Get product name for description
      if (typeof price.product === 'string') {
        const product = await stripe.products.retrieve(price.product)
        lineItemDescriptions.push(product.name)
      }
    }

    // Create PaymentIntent directly (works with stripe.elements())
    // Tax is inclusive (already included in the price shown to customer)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: currency.toLowerCase(),
      customer: customer.id,
      setup_future_usage: 'off_session',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...baseMetadata,
        ...cookieMetadata,
        line_items: JSON.stringify(line_items.map(li => li.price)),
        product_descriptions: lineItemDescriptions.join(', '),
        tax_inclusive: 'true', // Flag that price includes tax
      },
    })

    console.log('Created PaymentIntent:', paymentIntent.id, 'Amount:', totalAmount, currency)

    // Return client_secret for Payment Element
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
    })
  } catch (error: any) {
    console.error('Checkout-v2 session creation failed:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
