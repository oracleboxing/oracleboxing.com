// Webhook tracking utility for page views and purchases
// Sends page view data to Make.com webhook and Facebook Pixel (browser-side)
// Sends purchase data to Make.com webhook and Facebook Conversions API (server-side)

const WEBHOOK_URL = 'https://hook.eu2.make.com/rmssfwgpgrbkihnly4ocxd2cf6kmfbo3';
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1474540100541059';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || 'EAA2BabZBcKN4BP7zdm7EBpGJr6oFZCUWcei4YztbHRJXEyb2Ccy062KsatEjbzZAE65tEPZCKSntvC5dWJaT7CZCRdX0ldbpi6J5KadNwnLZACXdzZAhUIw8bYYZBFaE6bIht7qZCyOLcGezNKGxS1FBHqItE8et5dBoMsYYrUHZC5Lb6dSPWtbgWZA1dvH3Wgbw01i6wZDZD';
const FB_CONVERSIONS_API_URL = `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events`;

export interface PageViewData {
  eventType: string;
  eventId: string;
  sessionId: string;
  date: string;
  page: string;
  referrer: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  country: string | null;
  // Full cookie data (empty if no consent)
  cookieData?: any;
}

export interface PurchaseData {
  eventType: string;
  eventId: string;
  date: string;
  sessionId: string;
  value: number;
  currency: string;
  products: string[];
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  country: string | null;
}

export interface InitiateCheckoutData {
  eventType: string;
  eventId: string;
  sessionId: string;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  value: number;  // Value in the currency specified in the 'currency' field
  valueUSD: number;  // Kept for backwards compatibility (same as 'value')
  products: string[];
  page: string;
  country: string | null;
  initialReferrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  // URL parameters
  funnel?: string | null;
  course?: string | null;
  currency?: string | null;  // The currency for the 'value' field (e.g., 'USD', 'GBP', 'EUR')
  source?: string | null;
  // Full cookie data (empty if no consent)
  cookieData?: any;
}

/**
 * Generate a unique event ID for deduplication
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create a session ID for the user
 * Stored in localStorage and persists across page views
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    // Check if session_id already exists in localStorage
    let sessionId = localStorage.getItem('session_id');

    if (!sessionId) {
      // Generate a new session ID: timestamp + random string
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('session_id', sessionId);
    }

    return sessionId;
  } catch {
    // Fallback if localStorage is not available
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Get UTM parameters from cookies (set by UTMTracker component)
 */
function getUTMParameters(): {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
} {
  if (typeof document === 'undefined') {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
    };
  }

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {} as Record<string, string>);

  return {
    utmSource: cookies['utm_source'] || null,
    utmMedium: cookies['utm_medium'] || null,
    utmCampaign: cookies['utm_campaign'] || null,
    utmContent: cookies['utm_content'] || null,
  };
}

/**
 * Get user's country using Cloudflare's CF-IPCountry header or geolocation API
 */
async function getUserCountry(): Promise<string | null> {
  try {
    // Use our server-side API route to avoid CORS issues
    const response = await fetch('/api/detect-location', {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      return data.country_code || null;
    }
  } catch (error) {
    console.warn('Failed to fetch country:', error);
  }

  return null;
}

/**
 * Get Facebook Click ID (fbclid) from cookies
 */
function getFbclid(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {} as Record<string, string>);

  return cookies['fbclid'] || null;
}

/**
 * Get Facebook Browser ID (_fbp) from cookies
 * Set by Facebook Pixel automatically
 */
function getFbp(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {} as Record<string, string>);

  return cookies['_fbp'] || null;
}

/**
 * Get Facebook Click (_fbc) from cookies
 * Created from fbclid parameter
 */
function getFbc(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {} as Record<string, string>);

  return cookies['_fbc'] || null;
}


/**
 * Get client IP address (browser user agent as fallback)
 */
function getClientUserAgent(): string {
  if (typeof navigator === 'undefined') {
    return '';
  }
  return navigator.userAgent;
}

/**
 * Hash a string using SHA-256 for Facebook Conversions API
 */
async function hashSHA256(text: string): Promise<string> {
  // Normalize: lowercase and trim
  const normalized = text.toLowerCase().trim();

  // Convert string to array buffer
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);

  // Hash with SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}


/**
 * Get tracking cookie data (returns empty object if no consent/cookie)
 */
function getTrackingCookie(): any {
  if (typeof document === 'undefined') return {};

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const obTrackCookie = cookies['ob_track'];
  if (!obTrackCookie) return {};

  try {
    return JSON.parse(decodeURIComponent(obTrackCookie));
  } catch {
    return {};
  }
}

/**
 * Send page view data to webhook and Facebook Pixel
 * Fires immediately, includes cookie data (empty if no consent)
 */
export async function trackPageView(page: string, referrer: string): Promise<void> {
  try {
    // Get all cookie data (will be empty object if no consent)
    const cookieData = getTrackingCookie();

    // Use cookie data if available, otherwise generate new IDs
    const eventId = cookieData.event_id || generateEventId();
    const sessionId = cookieData.session_id || getOrCreateSessionId();
    const eventTime = Date.now();

    const country = await getUserCountry();

    // Extract UTM from cookie (use last_utm as current)
    const utmSource = cookieData.last_utm_source || null;
    const utmMedium = cookieData.last_utm_medium || null;
    const utmCampaign = cookieData.last_utm_campaign || null;
    const utmContent = cookieData.last_utm_content || null;

    const data: PageViewData = {
      eventType: 'page_view',
      eventId,
      sessionId,
      date: new Date(eventTime).toISOString(),
      page,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      country,
      cookieData, // Include full cookie data
    };

    // Send to webhook (non-blocking)
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true, // Ensure request completes even if page unloads
    }).catch((error) => {
      console.error('Failed to send page view to webhook:', error);
    });

    // Check if this is the initial page load (event_id already generated in layout.tsx)
    const isInitialPageLoad = typeof window !== 'undefined' &&
                               (window as any)._fbPageViewEventId &&
                               !(window as any)._fbPageViewUsed;

    let pageViewEventId: string;

    if (isInitialPageLoad) {
      // Use the event_id from the initial page load in layout.tsx
      pageViewEventId = (window as any)._fbPageViewEventId;
      (window as any)._fbPageViewUsed = true; // Mark as used to avoid reusing
      console.log('🔄 Using initial page load event_id:', pageViewEventId);
    } else {
      // Generate a fresh event_id for route changes
      pageViewEventId = generateEventId();
      console.log('🔑 Generated new event_id for route change:', pageViewEventId);

      // Fire browser-side Facebook Pixel PageView with event_id (only for route changes)
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView', {}, { eventID: pageViewEventId });
        console.log('📱 Browser PageView fired with event_id:', pageViewEventId);
      }
    }

    // Send to Facebook Conversions API (server-side) via API route
    // Use the same event_id for deduplication
    const fbclid = getFbclid();
    const fbp = getFbp();
    const fbc = getFbc();

    // Send entire cookie data object (not stringified)
    const pageViewCookieData = typeof sessionId === 'object' ? sessionId : { session_id: sessionId };

    console.log('📤 Sending to server API with event_id:', pageViewEventId);
    console.log('📊 Facebook cookies for PageView:', { fbp, fbc, fbclid });

    fetch('/api/facebook-pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_id: pageViewEventId,
        cookie_data: pageViewCookieData,
        page_url: `https://oracleboxing.com${page}`,
        fbclid: fbclid,
        fbp: fbp, // Facebook Browser ID
        fbc: fbc, // Facebook Click ID
      }),
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send PageView to Facebook CAPI:', error);
    });

    console.log('Page view tracked:', data);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Send purchase/conversion data to webhook and Facebook Conversions API
 */
export async function trackPurchase(
  sessionId: string,
  value: number,
  currency: string,
  products: string[]
): Promise<void> {
  try {
    const utm = getUTMParameters();
    const country = await getUserCountry();
    const eventId = generateEventId();
    const eventTime = Date.now();
    const fbclid = getFbclid();

    const data: PurchaseData = {
      eventType: 'purchase',
      eventId,
      date: new Date(eventTime).toISOString(),
      sessionId,
      value,
      currency,
      products,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      utmContent: utm.utmContent,
      country,
    };

    // Send to webhook (non-blocking)
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send purchase to webhook:', error);
    });

    // Send to Facebook Conversions API
    try {
      const eventData = {
        event_name: 'Purchase',
        event_time: Math.floor(eventTime / 1000),
        event_id: eventId,
        event_source_url: `https://oracleboxing.com/success`,
        action_source: 'website',
        user_data: {
          client_user_agent: getClientUserAgent(),
          ...(fbclid && { fbc: `fb.1.${eventTime}.${fbclid}` }),
        },
        custom_data: {
          value,
          currency,
          content_ids: products,
          content_type: 'product',
          num_items: products.length,
        },
      };

      const payload = {
        data: [eventData],
        access_token: FB_ACCESS_TOKEN,
      };

      const response = await fetch(FB_CONVERSIONS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Facebook Conversions API Purchase error:', errorData);
      } else {
        const result = await response.json();
        console.log('Facebook Conversions API Purchase success:', result);
      }
    } catch (error) {
      console.error('Failed to send purchase to Facebook Conversions API:', error);
    }

    console.log('Purchase tracked:', data);
  } catch (error) {
    console.error('Error tracking purchase:', error);
  }
}

/**
 * Send initiate checkout data to webhook
 * Tracks when a user fills in their name/email and proceeds to the next checkout step
 */
export async function trackInitiateCheckout(
  fullName: string,
  email: string,
  value: number,  // Value in the currency specified in urlParams.currency
  products: string[],
  page: string,
  initialReferrer: string | null,
  urlParams?: {
    funnel?: string | null;
    course?: string | null;
    currency?: string | null;
    source?: string | null;
  }
): Promise<void> {
  try {
    // Get all cookie data (will be empty object if no consent)
    const cookieData = getTrackingCookie();

    const utm = getUTMParameters();

    // Get country with better error handling
    let country: string | null = null;
    try {
      country = await getUserCountry();
      console.log('🌍 Country detected:', country);
    } catch (error) {
      console.warn('Failed to get country, continuing without it:', error);
    }

    // Use session-level event_id from cookie, or generate new one as fallback
    // This ensures all InitiateCheckout events in the same session use the same event_id for deduplication
    const eventId = cookieData.event_id || generateEventId();
    const sessionId = getOrCreateSessionId();

    // Split full name into first and last name
    // Takes everything before the first space as first name, rest as last name
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const data: InitiateCheckoutData = {
      eventType: 'initiate_checkout',
      eventId,
      sessionId,
      date: new Date().toISOString(),
      firstName,
      lastName,
      email,
      value,  // Value in the user's currency
      valueUSD: value,  // Keep for backwards compatibility (will be deprecated)
      products,
      page,
      country,
      initialReferrer,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      utmContent: utm.utmContent,
      // URL parameters
      funnel: urlParams?.funnel || null,
      course: urlParams?.course || null,
      currency: urlParams?.currency || null,
      source: urlParams?.source || null,
      // Include full cookie data
      cookieData,
    };

    // Log the complete data being sent
    console.log('💰 Initiate Checkout - Complete Data Being Sent:', JSON.stringify(data, null, 2));

    // Send to webhook (non-blocking)
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true,
    }).then(response => {
      if (response.ok) {
        console.log('✅ Initiate checkout successfully sent to webhook');
      } else {
        console.error('❌ Webhook returned error status:', response.status);
      }
    }).catch((error) => {
      console.error('❌ Failed to send initiate checkout to webhook:', error);
    });

    // Send to Facebook Pixel (browser-side tracking) with event_id
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: value,
        currency: urlParams?.currency || 'USD',  // Use actual currency
        content_ids: products,
        content_type: 'product',
        num_items: products.length,
      }, {
        eventID: eventId
      });
      console.log('📱 Facebook Pixel InitiateCheckout event sent with event_id:', eventId);
    }

    // Send to Facebook Conversions API (server-side tracking)
    try {
      const eventTime = Date.now();
      const fbclid = getFbclid();

      // Hash email for Facebook Conversions API
      const hashedEmail = await hashSHA256(email);

      // Parse cookie data into separate fields for custom_data
      // Each field value must be ≤500 chars
      const customData: Record<string, any> = {
        value: value,
        currency: urlParams?.currency || 'USD',
        content_ids: products,
        content_type: 'product',
        num_items: products.length,
      };

      if (cookieData && typeof cookieData === 'object') {
        // Add individual cookie fields, ensuring each is ≤500 chars
        Object.keys(cookieData).forEach(key => {
          // Skip user_agent - it's already sent in user_data section
          if (key === 'user_agent') {
            return;
          }

          const value = cookieData[key];
          if (value !== null && value !== undefined) {
            const stringValue = String(value);
            customData[key] = stringValue.length > 500 ? stringValue.substring(0, 500) : stringValue;
          }
        });
      }

      const eventData = {
        event_name: 'InitiateCheckout',
        event_time: Math.floor(eventTime / 1000),
        event_id: eventId,
        event_source_url: `https://oracleboxing.com${page}`,
        action_source: 'website',
        user_data: {
          em: [hashedEmail], // Hashed email with SHA256
          client_user_agent: getClientUserAgent(),
          ...(fbclid && { fbc: `fb.1.${eventTime}.${fbclid}` }),
        },
        custom_data: customData,
      };

      const payload = {
        data: [eventData],
        access_token: FB_ACCESS_TOKEN,
      };

      fetch(FB_CONVERSIONS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).then(response => {
        if (!response.ok) {
          response.json().then(errorData => {
            console.error('❌ Facebook Conversions API InitiateCheckout error:', errorData);
          });
        } else {
          response.json().then(result => {
            console.log('✅ Facebook Conversions API InitiateCheckout success:', result);
          });
        }
      }).catch((error) => {
        console.error('❌ Failed to send InitiateCheckout to Facebook Conversions API:', error);
      });
    } catch (error) {
      console.error('Error sending InitiateCheckout to Facebook Conversions API:', error);
    }
  } catch (error) {
    console.error('Error tracking initiate checkout:', error);
  }
}
