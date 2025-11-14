import { stripe } from './client'
import { CartItem } from '@/lib/types'
import { Currency, getStripePriceId } from '@/lib/currency'
import Stripe from 'stripe'

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

interface CreateCheckoutSessionParams {
  items: CartItem[]
  hasPhysicalItems: boolean
  successUrl: string
  cancelUrl: string
  customerInfo?: CustomerInfo
  currency?: Currency
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
  }
  cookieData?: any
  fbParams?: {
    fbc?: string
    fbp?: string
    client_ip_address?: string
    client_user_agent?: string
    fbclid?: string
  }
}

// Helper function to flatten cookie data into individual Stripe metadata fields
// Each cookie field becomes a separate metadata field with "cookie_" prefix
function prepareCookieDataForStripe(cookieData: any): Record<string, string> {
  if (!cookieData) return {};

  const flattenedCookieData: Record<string, string> = {};

  // Flatten all cookie data fields with "cookie_" prefix
  for (const [key, value] of Object.entries(cookieData)) {
    if (value !== null && value !== undefined) {
      // Convert value to string and prefix with "cookie_"
      flattenedCookieData[`cookie_${key}`] = String(value);
    }
  }

  return flattenedCookieData;
}

export async function createCheckoutSession({
  items,
  hasPhysicalItems,
  successUrl,
  cancelUrl,
  customerInfo,
  currency = 'USD',
  trackingParams,
  cookieData,
  fbParams,
}: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  // Calculate total items to determine if discount applies (10% off for 2+ items)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const hasMultiItemDiscount = totalItems >= 2
  const discountMultiplier = hasMultiItemDiscount ? 0.9 : 1.0 // 10% off if 2+ items

  // Convert cart items to Stripe line items, using correct price ID for currency
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => {
    // Build description with size and color for merchandise items
    let description: string | undefined = undefined
    let colorSpecificImage: string | undefined = undefined

    if (item.product.type === 'merch' && item.metadata) {
      const parts: string[] = []

      // Add color
      const color = item.metadata.tracksuit_color || item.metadata.hoodie_color
      if (color) parts.push(`Color: ${color}`)

      // Add sizes
      if (item.metadata.hoodie_size && item.metadata.joggers_size) {
        parts.push(`Hoodie: ${item.metadata.hoodie_size}`)
        parts.push(`Joggers: ${item.metadata.joggers_size}`)
      } else if (item.metadata.hoodie_size) {
        parts.push(`Size: ${item.metadata.hoodie_size}`)
      }

      // Add multi-item discount notice if applicable
      if (hasMultiItemDiscount) {
        parts.push('10% multi-item discount applied')
      }

      // Add shipping address if available
      if (customerInfo?.address) {
        parts.push('---')
        parts.push(`Ship to: ${customerInfo.firstName}`)
        parts.push(`${customerInfo.address.line1}${customerInfo.address.line2 ? ', ' + customerInfo.address.line2 : ''}`)
        parts.push(`${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.postal_code}`)
        parts.push(`${customerInfo.address.country}`)
      }

      if (parts.length > 0) {
        description = parts.join(' | ')
      }

      // Generate color-specific image URL
      if (color) {
        const colorMap: Record<string, string> = {
          Forest: 'green',
          Hazel: 'brown',
          Steel: 'blue',
          Black: 'black',
        }
        const colorCode = colorMap[color] || 'brown'
        const productType = item.product.id === 'tracksuit' ? 'hoodie' : 'hoodie'
        colorSpecificImage = `https://media.oracleboxing.com/tracksuit/${productType}_${colorCode}_front.webp`
      }
    }

    // For merchandise with size/color, use price_data to add description and color-specific image
    // Apply discount to merchandise items if 2+ items in cart
    if (description) {
      const discountedPrice = Math.round(item.product.price * discountMultiplier * 100)

      return {
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: discountedPrice,
          product_data: {
            name: item.product.title,
            description: description,
            images: colorSpecificImage ? [colorSpecificImage] : (item.product.image ? [item.product.image] : undefined),
          },
        },
        quantity: item.quantity,
      };
    }

    // For non-merchandise, use the price ID
    const priceId = getStripePriceId(item.product, currency);
    return {
      price: priceId,
      quantity: item.quantity,
    };
  })

  // Determine if this is a subscription or one-time payment
  const hasSubscription = items.some(item => item.product.recurring)
  const mode: Stripe.Checkout.SessionCreateParams.Mode = hasSubscription ? 'subscription' : 'payment'

  // Create or find customer if customer info provided
  let customerId: string | undefined = undefined

  if (customerInfo) {
    // Split full name into first and last name
    const nameParts = customerInfo.firstName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '' // Use first name as fallback if no last name

    // Prepare customer data
    const customerData: Stripe.CustomerCreateParams = {
      email: customerInfo.email,
      name: customerInfo.firstName.trim(),
      phone: customerInfo.phone || undefined,
      metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    }

    // Add shipping and billing address if provided
    if (customerInfo.address) {
      const addressData = {
        line1: customerInfo.address.line1,
        line2: customerInfo.address.line2 || undefined,
        city: customerInfo.address.city,
        state: customerInfo.address.state,
        postal_code: customerInfo.address.postal_code,
        country: customerInfo.address.country,
      }

      // Set shipping address
      customerData.shipping = {
        name: customerInfo.firstName.trim(),
        phone: customerInfo.phone || undefined,
        address: addressData,
      }

      // Set billing address (same as shipping)
      customerData.address = addressData
    }

    // Create a Stripe Customer for off-session charges (upsells)
    const customer = await stripe.customers.create(customerData)

    customerId = customer.id
    console.log('✅ Created Stripe Customer:', customerId, 'with shipping address:', !!customerData.shipping)
  }

  // ===================================================================
  // CROSS-SELL LOGIC: Disabled - handled in order-bumps page
  // ===================================================================
  // Bundle upgrades are now handled in the order-bumps page before checkout
  // This prevents duplicate bundle items and gives users clearer upgrade flow
  const recommendedProducts: string[] = []

  // Base session params
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode,
    line_items,
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    customer: customerId, // Attach customer to session
    customer_creation: customerId ? undefined : 'always', // Create customer if not provided
  }

  // Enable automatic tax if configured in Stripe
  // Note: Requires origin address setup at https://dashboard.stripe.com/settings/tax
  if (process.env.STRIPE_AUTO_TAX_ENABLED === 'true') {
    sessionParams.automatic_tax = {
      enabled: true,
    }
  }

  // ===================================================================
  // METADATA: Store customer info, funnel tracking, and recommended products
  // ===================================================================
  const mainProduct = items[0]?.product
  const addOns = items.slice(1).map(i => i.product.metadata || i.product.id).join(',')

  // Determine funnel type based on main product
  let funnelType = 'course' // Default
  let successPath = '/success/course'

  if (mainProduct?.id === '6wc' || mainProduct?.metadata === '6wc') {
    funnelType = '6wc'
    successPath = '/success/6wc'
  } else if (mainProduct?.id === 'bundle') {
    funnelType = 'bundle'
    successPath = '/success/course' // Bundle uses course success
  } else if (mainProduct?.type === 'membership') {
    funnelType = 'membership'
    successPath = '/success/membership'
  }

  // Hardcode the success URL to avoid any environment variable issues
  sessionParams.success_url = `https://oracleboxing.com${successPath}?session_id={CHECKOUT_SESSION_ID}`
  sessionParams.cancel_url = 'https://oracleboxing.com/'

  console.log('🔍 DEBUG: Success path:', successPath)
  console.log('🔍 DEBUG: Final success_url:', sessionParams.success_url)
  console.log('🔍 DEBUG: Cancel URL:', sessionParams.cancel_url)

  // Determine the purchase type based on main product
  let purchaseType = 'course' // Default
  if (mainProduct?.type === 'merch') {
    purchaseType = 'merch'
  } else if (mainProduct?.id === '6wc') {
    purchaseType = '6wc'
  } else if (mainProduct?.type === 'membership') {
    purchaseType = 'membership'
  } else if (mainProduct?.type === 'course') {
    purchaseType = 'course'
  }

  // Split full name for metadata
  const nameParts = customerInfo?.firstName?.trim().split(' ') || []
  const metadataFirstName = nameParts[0] || ''
  const metadataLastName = nameParts.slice(1).join(' ') || nameParts[0] || ''

  // Collect merchandise metadata (tracksuit or hoodie)
  const merchItem = items.find(item => item.product.type === 'merch')
  const merchMetadata = merchItem?.metadata || {}

  sessionParams.metadata = {
    // Customer info
    customer_first_name: metadataFirstName,
    customer_last_name: metadataLastName,
    customer_phone: customerInfo?.phone || '',
    customer_email: customerInfo?.email || '',

    // Shipping address
    shipping_line1: customerInfo?.address?.line1 || '',
    shipping_line2: customerInfo?.address?.line2 || '',
    shipping_city: customerInfo?.address?.city || '',
    shipping_state: customerInfo?.address?.state || '',
    shipping_postal_code: customerInfo?.address?.postal_code || '',
    shipping_country: customerInfo?.address?.country || '',

    // Funnel tracking
    funnel_type: funnelType,
    type: purchaseType, // Add type metadata: course, membership, 6wc, merch
    entry_product: mainProduct?.metadata || mainProduct?.id || '',
    add_ons_included: addOns,

    // Cross-sell tracking
    recommended_products: recommendedProducts.join(','),

    // Cart summary
    cart_items: JSON.stringify(items.map(i => ({
      id: i.product.id,
      metadata: i.product.metadata,
      quantity: i.quantity,
      price: i.product.price,
    }))),

    // Merchandise-specific metadata (size, color, SKU, cohort)
    ...merchMetadata,

    // Tracking params (referrer and UTM)
    referrer: trackingParams?.referrer || 'direct',

    // First Touch Attribution
    first_utm_source: trackingParams?.first_utm_source || '',
    first_utm_medium: trackingParams?.first_utm_medium || '',
    first_utm_campaign: trackingParams?.first_utm_campaign || '',
    first_utm_term: trackingParams?.first_utm_term || '',
    first_utm_content: trackingParams?.first_utm_content || '',
    first_referrer_time: trackingParams?.first_referrer_time || '',

    // Last Touch Attribution
    last_utm_source: trackingParams?.last_utm_source || '',
    last_utm_medium: trackingParams?.last_utm_medium || '',
    last_utm_campaign: trackingParams?.last_utm_campaign || '',
    last_utm_term: trackingParams?.last_utm_term || '',
    last_utm_content: trackingParams?.last_utm_content || '',
    last_referrer_time: trackingParams?.last_referrer_time || '',

    // Additional tracking
    fbclid: trackingParams?.fbclid || fbParams?.fbclid || '',
    session_id: trackingParams?.session_id || '',
    event_id: trackingParams?.event_id || '',

    // Facebook Conversions API parameters (from Parameter Builder)
    fb_fbc: fbParams?.fbc || '',
    fb_fbp: fbParams?.fbp || '',
    fb_client_ip: fbParams?.client_ip_address || '',
    fb_user_agent: fbParams?.client_user_agent || '',

    // Cookie tracking data - each field as separate metadata
    ...prepareCookieDataForStripe(cookieData),
  }

  // Add cross-sell recommendations using Stripe's adjustable quantity feature
  if (recommendedProducts.length > 0 && mode === 'payment') {
    // Add each recommended product as an adjustable quantity line item
    const crossSellLineItems = recommendedProducts.map(priceId => ({
      price: priceId,
      adjustable_quantity: {
        enabled: true,
        minimum: 0,
        maximum: 2,
      },
      quantity: 1, // Start at 1, customer can adjust (remove or keep)
    }))

    // Append cross-sell items to existing line items
    sessionParams.line_items = [...line_items, ...crossSellLineItems]

    // Add custom text to explain the optional bundle upgrade
    sessionParams.custom_text = {
      submit: {
        message: 'Save $144 by upgrading to the complete system - or remove it to continue with your current selection'
      }
    }
  }

  // Add shipping for physical items (only in payment mode)
  if (hasPhysicalItems && mode === 'payment') {
    // Define country groups for shipping zones
    const ukCountries = ['GB']
    const europeCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'CH', 'NO', 'IS']
    const usCanadaCountries = ['US', 'CA']
    const allAllowedCountries = [...ukCountries, ...europeCountries, ...usCanadaCountries, 'AU', 'NZ', 'JP', 'SG', 'AE', 'ZA', 'MX', 'BR', 'AR', 'IN', 'KR', 'TH', 'MY', 'PH', 'ID', 'VN']

    // Get shipping rates from the merchandise product
    const merchProduct = items.find(item => item.product.type === 'merch')?.product
    const shippingRates = merchProduct?.shippingRates

    // If customer info provided with address, auto-select shipping rate
    if (customerInfo?.address?.country && shippingRates) {
      const country = customerInfo.address.country

      // Determine which shipping rate to use based on country
      let selectedShippingRate: string | undefined
      if (ukCountries.includes(country)) {
        selectedShippingRate = shippingRates.uk?.id
      } else if (europeCountries.includes(country)) {
        selectedShippingRate = shippingRates.europe?.id
      } else if (usCanadaCountries.includes(country)) {
        selectedShippingRate = shippingRates.us_canada?.id
      } else {
        selectedShippingRate = shippingRates.rest_of_world?.id
      }

      // Apply the selected shipping rate automatically
      if (selectedShippingRate) {
        sessionParams.shipping_options = [{ shipping_rate: selectedShippingRate }]
        console.log('✅ Auto-selected shipping rate for country:', country, 'Rate ID:', selectedShippingRate)
      }
    } else {
      // No customer address provided, allow customer to select country and show all options
      sessionParams.shipping_address_collection = {
        allowed_countries: allAllowedCountries as any,
      }

      if (shippingRates) {
        // Show all shipping options (Stripe will filter based on country)
        const options = []
        if (shippingRates.uk?.id) options.push({ shipping_rate: shippingRates.uk.id })
        if (shippingRates.europe?.id) options.push({ shipping_rate: shippingRates.europe.id })
        if (shippingRates.us_canada?.id) options.push({ shipping_rate: shippingRates.us_canada.id })
        if (shippingRates.rest_of_world?.id) options.push({ shipping_rate: shippingRates.rest_of_world.id })

        if (options.length > 0) {
          sessionParams.shipping_options = options
        }
      }
    }
  }

  // Add payment intent data for off-session charges (upsells)
  if (mode === 'payment') {
    sessionParams.payment_intent_data = {
      setup_future_usage: 'off_session', // Save payment method for future charges
      metadata: {
        // Copy all metadata to payment intent for charge.succeeded webhook
        customer_first_name: metadataFirstName,
        customer_last_name: metadataLastName,
        customer_email: customerInfo?.email || '',
        customer_phone: customerInfo?.phone || '',

        // Funnel tracking
        funnel_type: funnelType,
        type: purchaseType,
        entry_product: mainProduct?.metadata || mainProduct?.id || '',
        add_ons_included: addOns,

        // Product details
        product_name: mainProduct?.title || '',
        product_id: mainProduct?.id || '',

        // Cart summary
        cart_items: JSON.stringify(items.map(i => ({ id: i.product.id, qty: i.quantity }))),

        // Tracking params (referrer and UTM)
        referrer: trackingParams?.referrer || 'direct',

        // First Touch Attribution
        first_utm_source: trackingParams?.first_utm_source || '',
        first_utm_medium: trackingParams?.first_utm_medium || '',
        first_utm_campaign: trackingParams?.first_utm_campaign || '',
        first_utm_term: trackingParams?.first_utm_term || '',
        first_utm_content: trackingParams?.first_utm_content || '',
        first_referrer_time: trackingParams?.first_referrer_time || '',

        // Last Touch Attribution
        last_utm_source: trackingParams?.last_utm_source || '',
        last_utm_medium: trackingParams?.last_utm_medium || '',
        last_utm_campaign: trackingParams?.last_utm_campaign || '',
        last_utm_term: trackingParams?.last_utm_term || '',
        last_utm_content: trackingParams?.last_utm_content || '',
        last_referrer_time: trackingParams?.last_referrer_time || '',

        // Additional tracking
        fbclid: trackingParams?.fbclid || '',
        session_id: trackingParams?.session_id || '',
        event_id: trackingParams?.event_id || '',

        // Cookie tracking data - each field as separate metadata
        ...prepareCookieDataForStripe(cookieData),
      },
    }
  }

  // Add subscription data for membership purchases
  if (mode === 'subscription') {
    sessionParams.payment_method_collection = 'always' // Ensure payment method is saved
    sessionParams.subscription_data = {
      metadata: {
        // Copy all metadata to subscription for invoice.payment_succeeded webhook
        customer_first_name: metadataFirstName,
        customer_last_name: metadataLastName,
        customer_email: customerInfo?.email || '',
        customer_phone: customerInfo?.phone || '',

        // Funnel tracking
        funnel_type: funnelType,
        type: purchaseType,
        entry_product: mainProduct?.metadata || mainProduct?.id || '',
        add_ons_included: addOns,

        // Product details
        product_name: mainProduct?.title || '',
        product_id: mainProduct?.id || '',

        // Cart summary
        cart_items: JSON.stringify(items.map(i => ({ id: i.product.id, qty: i.quantity }))),

        // Tracking params (referrer and UTM)
        referrer: trackingParams?.referrer || 'direct',

        // First Touch Attribution
        first_utm_source: trackingParams?.first_utm_source || '',
        first_utm_medium: trackingParams?.first_utm_medium || '',
        first_utm_campaign: trackingParams?.first_utm_campaign || '',
        first_utm_term: trackingParams?.first_utm_term || '',
        first_utm_content: trackingParams?.first_utm_content || '',
        first_referrer_time: trackingParams?.first_referrer_time || '',

        // Last Touch Attribution
        last_utm_source: trackingParams?.last_utm_source || '',
        last_utm_medium: trackingParams?.last_utm_medium || '',
        last_utm_campaign: trackingParams?.last_utm_campaign || '',
        last_utm_term: trackingParams?.last_utm_term || '',
        last_utm_content: trackingParams?.last_utm_content || '',
        last_referrer_time: trackingParams?.last_referrer_time || '',

        // Additional tracking
        fbclid: trackingParams?.fbclid || '',
        session_id: trackingParams?.session_id || '',
        event_id: trackingParams?.event_id || '',

        // Cookie tracking data - each field as separate metadata
        ...prepareCookieDataForStripe(cookieData),
      },
    }
  }

  // Create session
  console.log('🔍 DEBUG: Creating Stripe session with params:', {
    mode: sessionParams.mode,
    success_url: sessionParams.success_url,
    cancel_url: sessionParams.cancel_url,
    line_items_count: sessionParams.line_items?.length,
  })

  try {
    const session = await stripe.checkout.sessions.create(sessionParams)
    console.log('✅ Stripe session created successfully:', session.id)
    return session
  } catch (stripeError: any) {
    console.error('❌ Stripe API Error:', {
      message: stripeError.message,
      type: stripeError.type,
      code: stripeError.code,
      param: stripeError.param,
    })
    throw stripeError
  }
}

// ===================================================================
// POST-PURCHASE UPSELL LOGIC (To be implemented in success page)
// ===================================================================
/*
  After successful checkout, trigger upsells based on purchased products:

  1. 6-WEEK CHALLENGE → No upsells (maintain refund clarity)

  2. MEMBERSHIPS → Upsell: 1-Month 1-on-1 Coaching
     - Use USD-only price: price_1SLLX4QNEdHwdojXfZImwLss
     - Product ID: prod_THuQf0h3DatQUL
     - Reason: Members are typically USD-based

  3. COURSES (BFFP, Roadmap, Clinic) → Upsell: 1-Month 1-on-1 Coaching
     - Use multi-currency price: price_1SLLY7QNEdHwdojXVriclpjV
     - Product ID: prod_THuQf0h3DatQUL
     - Downsell if declined: 6-Week Membership (price_1SLLTqQNEdHwdojXsQKz5qSZ)

  4. BUNDLE → Upsell: 1-Month 1-on-1 Coaching
     - Use multi-currency price: price_1SLLY7QNEdHwdojXVriclpjV
     - Product ID: prod_THuQf0h3DatQUL
     - No downsell (bundle already comprehensive)

  Example implementation:

  ```typescript
  import { getProductByMetadata } from '@/lib/products'

  async function showPostPurchaseUpsell(purchasedItems: CartItem[]) {
    const mainProduct = purchasedItems[0].product
    const coaching = getProductByMetadata('coach1')

    // Determine which price ID to use
    let coachingPriceId: string
    let showDownsell = false

    if (mainProduct.type === 'membership') {
      // Use USD-only for membership upsells
      coachingPriceId = coaching.price_ids.usd_membership_upsell
    } else if (['bffp', 'roadmap', 'vault'].includes(mainProduct.id)) {
      // Use multi-currency for course upsells
      coachingPriceId = coaching.price_ids.multicurrency
      showDownsell = true // Show 6-week membership if declined
    } else if (mainProduct.id === 'bundle') {
      // Use multi-currency for bundle upsells
      coachingPriceId = coaching.price_ids.multicurrency
    } else {
      // 6WC or unknown - no upsell
      return
    }

    // Show upsell modal/page
    const accepted = await showUpsellModal({
      product: coaching,
      priceId: coachingPriceId,
    })

    // If declined and downsell applicable, show 6-week membership
    if (!accepted && showDownsell) {
      const sixWeekMembership = getProductByMetadata('6wm')
      await showDownsellModal({
        product: sixWeekMembership,
        priceId: sixWeekMembership.stripe_price_id,
      })
    }
  }
  ```
*/
