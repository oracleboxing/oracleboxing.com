// Simple webhook utility for sending name and email to Make.com

const WEBHOOK_URL = 'https://hook.eu2.make.com/ghdk1p8eqseejtkt2fynaoe0d2vj6v1l';
const INITIATED_CHECKOUT_WEBHOOK_URL = 'https://hook.eu2.make.com/rmssfwgpgrbkihnly4ocxd2cf6kmfbo3';

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
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
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
 * Send initiated checkout data to Make.com webhook for abandoned cart automation
 * Includes customer info, cart details, checkout URL, and tracking data
 */
export async function sendInitiatedCheckout(data: InitiatedCheckoutData): Promise<void> {
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
        quantity: item.quantity,
        price: item.price,
        currency: item.currency,
      })),
      total_amount: data.cart.totalAmount,
      cart_currency: data.cart.currency,
      item_count: data.cart.items.length,

      // Tracking data (optional)
      tracking_session_id: data.tracking?.sessionId || '',
      tracking_event_id: data.tracking?.eventId || '',
      utm_source: data.tracking?.utmSource || '',
      utm_medium: data.tracking?.utmMedium || '',
      utm_campaign: data.tracking?.utmCampaign || '',
      fbclid: data.tracking?.fbclid || '',

      // Facebook Parameters (from Parameter Builder)
      fb_fbc: data.facebookParams?.fbc || '',
      fb_fbp: data.facebookParams?.fbp || '',
      fb_client_ip: data.facebookParams?.client_ip_address || '',
      fb_user_agent: data.facebookParams?.client_user_agent || '',
      fb_fbclid: data.facebookParams?.fbclid || '',

      // Complete Cookie Tracking Data (ALL the fucking data!)
      cookie_data: data.cookieData || {},
    };

    console.log('📤 ABANDONED CART: Full payload being sent:', JSON.stringify(payload, null, 2));

    console.log('📤 ABANDONED CART: Starting fetch to Make.com...');

    // Add timeout to prevent hanging - increased to 30 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
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
      console.log('📤 ABANDONED CART: Webhook response headers:', JSON.stringify([...response.headers.entries()]));

      if (response.ok) {
        const responseText = await response.text();
        console.log('✅ ABANDONED CART: Initiated checkout sent successfully to Make.com');
        console.log('✅ ABANDONED CART: Response body:', responseText);
      } else {
        console.error('❌ ABANDONED CART: Webhook responded with error:', response.status);
        const responseText = await response.text();
        console.error('❌ ABANDONED CART: Error response:', responseText);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('❌ ABANDONED CART: Webhook request timed out after 30 seconds');
        console.error('❌ ABANDONED CART: This usually means Make.com scenario is turned OFF or not responding');
      } else {
        console.error('❌ ABANDONED CART: Fetch error:', fetchError);
        console.error('❌ ABANDONED CART: Fetch error details:', fetchError instanceof Error ? fetchError.message : String(fetchError));
      }
    }
  } catch (error) {
    console.error('❌ ABANDONED CART: Failed to send initiated checkout to webhook:', error);
    console.error('❌ ABANDONED CART: Error details:', error instanceof Error ? error.message : String(error));
    console.error('❌ ABANDONED CART: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    // Don't throw - allow checkout to continue even if webhook fails
  }
}
