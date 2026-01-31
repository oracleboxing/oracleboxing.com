// Simple webhook utility for sending name and email to Make.com

const WEBHOOK_URL = process.env.NEXT_PUBLIC_MAKE_CHALLENGE_SIGNUP_WEBHOOK!;
const INITIATED_CHECKOUT_WEBHOOK_URL = process.env.NEXT_PUBLIC_MAKE_INITIATED_CHECKOUT_WEBHOOK!;

interface ChallengeSignupData {
  firstName: string;
  lastName: string;
  email: string;
}

interface InitiatedCheckoutData {
  sessionId: string;
  checkoutUrl: string;
  pageUrl?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  location: {
    countryCode?: string;
    currency: string;
  };
  cart: {
    items: Array<{
      productName: string;
      productId: string;
      metadata?: string;
      productMetadata?: string; // Generic product type (e.g., "tracksuit", "hoodie")
      variantMetadata?: any; // Variant-specific details (color, size, SKU, cohort)
      quantity: number;
      price: number;
      currency: string;
    }>;
    totalAmount: number;
    currency: string;
  };
  tracking?: {
    sessionId?: string;
    eventId?: string;
    // Last touch attribution
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    // First touch attribution (FIXED: Added missing fields)
    firstUtmSource?: string;
    firstUtmMedium?: string;
    firstUtmCampaign?: string;
    firstUtmContent?: string;
    firstUtmTerm?: string;
    firstReferrer?: string;
    firstReferrerTime?: string;
    // Other tracking
    fbclid?: string;
  };
  cookieData?: any; // Full cookie tracking data
  facebookParams?: { // Facebook parameters from Parameter Builder
    fbc?: string;
    fbp?: string;
    client_ip_address?: string;
    client_user_agent?: string;
    fbclid?: string;
  };
}

/**
 * Send challenge signup data (name + email) to Make.com webhook
 */
export async function sendChallengeSignup(data: ChallengeSignupData): Promise<void> {
  try {
    console.log('📤 Sending challenge signup to webhook:', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    });

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        fullName: `${data.firstName} ${data.lastName}`,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      console.log('✅ Challenge signup sent successfully');
    } else {
      console.error('❌ Webhook responded with error:', response.status);
    }
  } catch (error) {
    console.error('❌ Failed to send challenge signup to webhook:', error);
    // Don't throw - allow page to continue even if webhook fails
  }
}

/**
 * Flatten cookie data into top-level fields with cookie_ prefix
 * Makes it easier for Make.com to access individual fields
 */
function flattenCookieData(cookieData: any): Record<string, any> {
  if (!cookieData || typeof cookieData !== 'object') {
    return {};
  }

  const flattened: Record<string, any> = {};

  for (const [key, value] of Object.entries(cookieData)) {
    if (value !== null && value !== undefined) {
      // Prefix with cookie_ for clarity
      flattened[`cookie_${key}`] = value;
    }
  }

  return flattened;
}

/**
 * Send initiated checkout data to Make.com webhook for abandoned cart automation
 * Includes customer info, cart details, checkout URL, and tracking data
 * FIXED: Includes retry logic, flattened cookie data, and complete attribution
 */
export async function sendInitiatedCheckout(data: InitiatedCheckoutData): Promise<void> {
  // FIXED: Use setTimeout instead of setImmediate (better browser/edge compatibility)
  setTimeout(async () => {
    try {
      console.log('📤 ABANDONED CART: Preparing to send initiated checkout to webhook');
      console.log('📤 ABANDONED CART: Webhook URL:', INITIATED_CHECKOUT_WEBHOOK_URL);
      console.log('📤 ABANDONED CART: Customer Email:', data.customer.email);
      console.log('📤 ABANDONED CART: Customer First Name:', data.customer.firstName);
      console.log('📤 ABANDONED CART: Customer Last Name:', data.customer.lastName);
      console.log('📤 ABANDONED CART: Checkout URL:', data.checkoutUrl);
      console.log('📤 ABANDONED CART: Session ID:', data.sessionId);
      console.log('📤 ABANDONED CART: Cart Items:', data.cart.items.length);
      console.log('📤 ABANDONED CART: Total Amount:', data.cart.totalAmount);

      // FIXED: Flatten cookie data for easier Make.com access
      const flattenedCookies = flattenCookieData(data.cookieData);

      const payload = {
        // Customer name (required by Make.com)
        name: `${data.customer.firstName} ${data.customer.lastName}`.trim(),
        first_name: data.customer.firstName,
        last_name: data.customer.lastName,
        email: data.customer.email,

        // Checkout URL (or page URL as fallback)
        checkout_url: data.checkoutUrl,
        page_url: data.pageUrl || data.checkoutUrl,

        event_type: 'checkout_initiated',
        timestamp: new Date().toISOString(),
        session_id: data.sessionId,
        phone: data.customer.phone || '',

        // Location & Currency
        country_code: data.location.countryCode || 'Unknown',
        currency: data.location.currency,

        // Cart details
        cart_items: data.cart.items.map(item => ({
          product_name: item.productName,
          product_id: item.productId,
          metadata: item.metadata || item.productId,
          product_metadata: item.productMetadata, // Generic product type
          variant_metadata: item.variantMetadata, // Variant-specific details
          quantity: item.quantity,
          price: item.price,
          currency: item.currency,
        })),
        total_amount: data.cart.totalAmount,
        cart_currency: data.cart.currency,
        item_count: data.cart.items.length,

        // Tracking data - Session IDs
        tracking_session_id: data.tracking?.sessionId || '',
        tracking_event_id: data.tracking?.eventId || '',

        // FIXED: Last touch attribution (what brought them to checkout)
        last_utm_source: data.tracking?.utmSource || '',
        last_utm_medium: data.tracking?.utmMedium || '',
        last_utm_campaign: data.tracking?.utmCampaign || '',
        last_utm_content: data.tracking?.utmContent || '',
        last_utm_term: data.tracking?.utmTerm || '',

        // FIXED: First touch attribution (original source - CRITICAL for attribution)
        first_utm_source: data.tracking?.firstUtmSource || '',
        first_utm_medium: data.tracking?.firstUtmMedium || '',
        first_utm_campaign: data.tracking?.firstUtmCampaign || '',
        first_utm_content: data.tracking?.firstUtmContent || '',
        first_utm_term: data.tracking?.firstUtmTerm || '',
        first_referrer: data.tracking?.firstReferrer || '',
        first_referrer_time: data.tracking?.firstReferrerTime || '',

        // Facebook tracking
        fbclid: data.tracking?.fbclid || '',

        // Facebook Parameters (from Parameter Builder)
        fb_fbc: data.facebookParams?.fbc || '',
        fb_fbp: data.facebookParams?.fbp || '',
        fb_client_ip: data.facebookParams?.client_ip_address || '',
        fb_user_agent: data.facebookParams?.client_user_agent || '',
        fb_fbclid: data.facebookParams?.fbclid || '',

        // FIXED: Flattened cookie data (easier for Make.com to access)
        ...flattenedCookies,

        // Keep original nested format for backwards compatibility
        cookie_data: data.cookieData || {},
      };

      console.log('📤 ABANDONED CART: Full payload being sent:', JSON.stringify(payload, null, 2));

      console.log('📤 ABANDONED CART: Starting fetch to Make.com...');

      // FIXED: Add retry logic for webhook failures
      const maxRetries = 3;
      const retryDelays = [1000, 5000, 15000]; // 1s, 5s, 15s
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        attempt++;
        console.log(`📤 ABANDONED CART: Attempt ${attempt}/${maxRetries}`);

        try {
          // Allow 30 seconds per attempt (reduced from 100s for faster retries)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          const response = await fetch(INITIATED_CHECKOUT_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          console.log('📤 ABANDONED CART: Fetch completed!');
          console.log('📤 ABANDONED CART: Webhook response status:', response.status);
          console.log('📤 ABANDONED CART: Webhook response OK:', response.ok);

          if (response.ok) {
            const responseText = await response.text();
            console.log('✅ ABANDONED CART: Initiated checkout sent successfully to Make.com');
            console.log('✅ ABANDONED CART: Response body:', responseText);
            success = true;
          } else {
            console.error(`❌ ABANDONED CART: Webhook responded with error on attempt ${attempt}:`, response.status);
            const responseText = await response.text();
            console.error('❌ ABANDONED CART: Error response:', responseText);

            // Retry on 5xx errors (server issues), don't retry on 4xx (client errors)
            if (response.status >= 500 && attempt < maxRetries) {
              console.log(`⏳ ABANDONED CART: Retrying in ${retryDelays[attempt - 1]}ms...`);
              await new Promise(resolve => setTimeout(resolve, retryDelays[attempt - 1]));
            } else {
              break; // Don't retry on 4xx errors
            }
          }
        } catch (fetchError) {
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            console.error(`❌ ABANDONED CART: Webhook request timed out on attempt ${attempt}`);
            if (attempt < maxRetries) {
              console.log(`⏳ ABANDONED CART: Retrying in ${retryDelays[attempt - 1]}ms...`);
              await new Promise(resolve => setTimeout(resolve, retryDelays[attempt - 1]));
            }
          } else {
            console.error(`❌ ABANDONED CART: Fetch error on attempt ${attempt}:`, fetchError);
            console.error('❌ ABANDONED CART: Fetch error details:', fetchError instanceof Error ? fetchError.message : String(fetchError));

            if (attempt < maxRetries) {
              console.log(`⏳ ABANDONED CART: Retrying in ${retryDelays[attempt - 1]}ms...`);
              await new Promise(resolve => setTimeout(resolve, retryDelays[attempt - 1]));
            }
          }
        }
      }

      // FIXED: Store failed webhook data to localStorage as fallback
      if (!success) {
        console.error('❌ ABANDONED CART: All retry attempts failed. Storing to localStorage fallback.');
        try {
          const failedWebhooks = JSON.parse(localStorage.getItem('failed_abandoned_cart_webhooks') || '[]');
          failedWebhooks.push({
            timestamp: new Date().toISOString(),
            payload,
            attempts: attempt,
          });
          // Keep last 10 failed webhooks
          if (failedWebhooks.length > 10) {
            failedWebhooks.shift();
          }
          localStorage.setItem('failed_abandoned_cart_webhooks', JSON.stringify(failedWebhooks));
          console.log('💾 ABANDONED CART: Failed webhook stored to localStorage');
        } catch (storageError) {
          console.error('❌ ABANDONED CART: Failed to store to localStorage:', storageError);
        }

        console.error('⚠️ ABANDONED CART: Please verify Make.com scenario is active');
      }
    } catch (error) {
      console.error('❌ ABANDONED CART: Failed to send initiated checkout to webhook:', error);
      console.error('❌ ABANDONED CART: Error details:', error instanceof Error ? error.message : String(error));
      console.error('❌ ABANDONED CART: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
  }, 0); // Execute asynchronously without blocking

  // Return immediately - don't wait for webhook
  console.log('✅ ABANDONED CART: Webhook queued for background processing');
}
