// Simple webhook utility for sending name and email to Make.com

const WEBHOOK_URL = 'https://hook.eu2.make.com/ghdk1p8eqseejtkt2fynaoe0d2vj6v1l';
const INITIATED_CHECKOUT_WEBHOOK_URL = 'https://hook.eu2.make.com/ax6yp1vji6pig8mdl4nh1562pnooye99';

interface ChallengeSignupData {
  firstName: string;
  lastName: string;
  email: string;
}

interface InitiatedCheckoutData {
  sessionId: string;
  checkoutUrl: string;
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
      event_type: 'checkout_initiated',
      timestamp: new Date().toISOString(),

      // Checkout session info
      session_id: data.sessionId,
      checkout_url: data.checkoutUrl,

      // Customer info
      customer: {
        first_name: data.customer.firstName,
        last_name: data.customer.lastName,
        full_name: `${data.customer.firstName} ${data.customer.lastName}`,
        email: data.customer.email,
        phone: data.customer.phone || '',
      },

      // Location & Currency
      location: {
        country_code: data.location.countryCode || 'Unknown',
        currency: data.location.currency,
      },

      // Cart details
      cart: {
        items: data.cart.items.map(item => ({
          product_name: item.productName,
          product_id: item.productId,
          metadata: item.metadata || item.productId,
          quantity: item.quantity,
          price: item.price,
          currency: item.currency,
        })),
        total_amount: data.cart.totalAmount,
        currency: data.cart.currency,
        item_count: data.cart.items.length,
      },

      // Tracking data (optional)
      tracking: data.tracking ? {
        session_id: data.tracking.sessionId,
        event_id: data.tracking.eventId,
        utm_source: data.tracking.utmSource || '',
        utm_medium: data.tracking.utmMedium || '',
        utm_campaign: data.tracking.utmCampaign || '',
        fbclid: data.tracking.fbclid || '',
      } : undefined,
    };

    console.log('📤 ABANDONED CART: Full payload being sent:', JSON.stringify(payload, null, 2));

    const response = await fetch(INITIATED_CHECKOUT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📤 ABANDONED CART: Webhook response status:', response.status);
    console.log('📤 ABANDONED CART: Webhook response OK:', response.ok);

    if (response.ok) {
      const responseText = await response.text();
      console.log('✅ ABANDONED CART: Initiated checkout sent successfully to Make.com');
      console.log('✅ ABANDONED CART: Response body:', responseText);
    } else {
      console.error('❌ ABANDONED CART: Webhook responded with error:', response.status);
      const responseText = await response.text();
      console.error('❌ ABANDONED CART: Error response:', responseText);
    }
  } catch (error) {
    console.error('❌ ABANDONED CART: Failed to send initiated checkout to webhook:', error);
    console.error('❌ ABANDONED CART: Error details:', error instanceof Error ? error.message : String(error));
    console.error('❌ ABANDONED CART: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    // Don't throw - allow checkout to continue even if webhook fails
  }
}
