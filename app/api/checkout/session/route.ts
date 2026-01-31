import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { CartItem } from '@/lib/types'
import { Currency } from '@/lib/currency'
import { sendInitiatedCheckout } from '@/lib/simple-webhook'
import { getProductById } from '@/lib/products'
import { extractFacebookParams } from '@/lib/fb-param-builder'

export async function POST(req: NextRequest) {
  try {
    // Extract Facebook parameters using Parameter Builder
    const fbParams = extractFacebookParams(req)

    const body = await req.json()

    const { items, customerInfo, currency, trackingParams, cookieData, pageUrl }: {
      items: CartItem[],
      customerInfo?: any,
      currency?: Currency,
      trackingParams?: {
        referrer: string
        // First Touch Attribution
        first_utm_source?: string
        first_utm_medium?: string
        first_utm_campaign?: string
        first_utm_term?: string
        first_utm_content?: string
        first_referrer_time?: string
        // Last Touch Attribution
        last_utm_source?: string
        last_utm_medium?: string
        last_utm_campaign?: string
        last_utm_term?: string
        last_utm_content?: string
        last_referrer_time?: string
        // Additional tracking
        fbclid?: string
        session_id?: string
        event_id?: string
      },
      cookieData?: any,
      pageUrl?: string
    } = body

    // Validate cart
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // CRITICAL FIX: Re-fetch products server-side to get correct env var values
    // Client-side process.env is undefined, so we need to lookup products here
    const serverSideItems = items.map(item => {
      const serverProduct = getProductById(item.product.id);
      if (!serverProduct) {
        return item;
      }
      // Replace client product with server product (has correct env vars)
      return {
        ...item,
        product: serverProduct,
        // Update price_id to use server-side value if it was set
        price_id: item.price_id || serverProduct.stripe_price_id,
      };
    });

    // Detect physical items
    const hasPhysicalItems = serverSideItems.some(item => item.product.type === 'merch')

    // Determine success URL based on whether cart contains merchandise
    const successUrl = hasPhysicalItems
      ? 'https://oracleboxing.com/success/merch?session_id={CHECKOUT_SESSION_ID}'
      : 'https://oracleboxing.com/success/{CHECKOUT_SESSION_ID}'

    // Create checkout session with server-side products (correct env vars)
    const session = await createCheckoutSession({
      items: serverSideItems,
      hasPhysicalItems,
      successUrl,
      cancelUrl: 'https://oracleboxing.com/',
      customerInfo,
      currency: currency || 'USD',
      trackingParams,
      cookieData,
      fbParams, // Facebook Conversions API parameters
    })

    if (!session.url) {
      throw new Error('Stripe session created but URL is missing')
    }

    // Send initiated checkout webhook to Make.com for abandoned cart automation
    // This runs asynchronously and won't block the checkout flow
    // Skip for merchandise orders (type: 'merch')
    const isMerchandiseOrder = serverSideItems.every(item => item.product.type === 'merch');

    if (customerInfo?.email && !isMerchandiseOrder) {
      // Calculate total amount from cart items (use server-side items)
      const totalAmount = serverSideItems.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      // Split full name into first and last name (same logic as checkout.ts)
      const nameParts = customerInfo.firstName?.trim().split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

      // Send webhook with all data (fire-and-forget, returns immediately)
      sendInitiatedCheckout({
        sessionId: session.id,
        checkoutUrl: session.url || pageUrl || 'https://oracleboxing.com',
        pageUrl: pageUrl,
        customer: {
          firstName,
          lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
        location: {
          countryCode: cookieData?.country_code || 'US',
          currency: currency || 'USD',
        },
        cart: {
          items: serverSideItems.map(item => ({
            productName: item.product.title,
            productId: item.product.id,
            productMetadata: item.product.metadata, // Generic product type (e.g., "tracksuit", "hoodie")
            variantMetadata: item.metadata, // Variant-specific details (color, size, SKU, cohort)
            quantity: item.quantity,
            price: item.product.price,
            currency: currency || 'USD',
          })),
          totalAmount,
          currency: currency || 'USD',
        },
        tracking: trackingParams ? {
          sessionId: trackingParams.session_id,
          eventId: trackingParams.event_id,
          // Last touch attribution
          utmSource: trackingParams.last_utm_source,
          utmMedium: trackingParams.last_utm_medium,
          utmCampaign: trackingParams.last_utm_campaign,
          utmContent: trackingParams.last_utm_content,
          utmTerm: trackingParams.last_utm_term,
          // FIXED: First touch attribution (CRITICAL for abandoned cart emails)
          firstUtmSource: trackingParams.first_utm_source,
          firstUtmMedium: trackingParams.first_utm_medium,
          firstUtmCampaign: trackingParams.first_utm_campaign,
          firstUtmContent: trackingParams.first_utm_content,
          firstUtmTerm: trackingParams.first_utm_term,
          firstReferrer: trackingParams.referrer, // First referrer
          firstReferrerTime: trackingParams.first_referrer_time,
          // Facebook
          fbclid: trackingParams.fbclid,
        } : undefined,
        cookieData: cookieData, // ALL cookie tracking data
        facebookParams: fbParams, // Facebook Parameter Builder data
      });
    }

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Route /api/checkout/session failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
