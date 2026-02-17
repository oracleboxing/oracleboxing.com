// Tracking utility for page views, checkouts, and purchases
// Stores tracking data in Supabase and sends to Facebook Pixel/CAPI

import { supabase } from './supabase';
import { getExperimentCookie } from './tracking-cookies';

// Test checkout credentials - bypasses all tracking and automations
const TEST_CHECKOUT_INFO = {
  email: 'jt@gmail.com',
  phone: '+12222222222',
  firstName: 'J',
  lastName: 'T',
};

/**
 * Check if the checkout info is a test checkout that should bypass tracking
 */
export function isTestCheckout(email: string, phone?: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPhone = phone?.replace(/\s/g, '') || '';

  return (
    normalizedEmail === TEST_CHECKOUT_INFO.email.toLowerCase() ||
    normalizedPhone === TEST_CHECKOUT_INFO.phone
  );
}

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1474540100541059';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || '';
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
  name: string | null;
  email: string | null;
  phone: string | null;
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
  phone: string | null;
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

export interface WaitlistData {
  eventType: string;
  eventId: string;
  sessionId: string;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
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

  // UTM params are stored inside the ob_track cookie as JSON, not as separate cookies
  const cookieData = getTrackingCookie();

  // Prefer first-touch attribution, fall back to last-touch
  return {
    utmSource: cookieData.first_utm_source || cookieData.last_utm_source || null,
    utmMedium: cookieData.first_utm_medium || cookieData.last_utm_medium || null,
    utmCampaign: cookieData.first_utm_campaign || cookieData.last_utm_campaign || null,
    utmContent: cookieData.first_utm_content || cookieData.last_utm_content || null,
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

    // Get A/B experiment assignments
    const experiments = getExperimentCookie()
    const hasExperiments = Object.keys(experiments).length > 0

    // Send to Supabase (non-blocking)
    supabase
      .from('page_views')
      .insert({
        date: data.date,
        session_id: data.sessionId,
        event_id: data.eventId,
        page: data.page,
        referrer: data.referrer,
        country: data.country,
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        utm_campaign: data.utmCampaign,
        utm_content: data.utmContent,
        experiments: hasExperiments ? experiments : null,
      })
      .then(({ error }: { error: any }) => {
        if (error) {
          console.error('Failed to save page view to Supabase:', error);
        } else {
          console.log('✅ Page view saved to Supabase');
        }
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
  products: string[],
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  },
  utmFallback?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  }
): Promise<void> {
  // Check if this is a test checkout - bypass all tracking
  if (customerInfo?.email && isTestCheckout(customerInfo.email, customerInfo.phone)) {
    console.log('🧪 Test purchase detected - bypassing all tracking');
    return;
  }

  try {
    // Get cookie data for first-touch attribution
    const cookieData = getTrackingCookie();
    const utm = getUTMParameters();
    const country = await getUserCountry();
    const eventId = cookieData.event_id || generateEventId();
    const eventTime = Date.now();
    const fbclid = getFbclid();

    const data: PurchaseData = {
      eventType: 'purchase',
      eventId,
      date: new Date(eventTime).toISOString(),
      sessionId: cookieData.session_id || sessionId,
      name: customerInfo?.name || null,
      email: customerInfo?.email || null,
      phone: customerInfo?.phone || null,
      value,
      currency,
      products,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      utmContent: utm.utmContent,
      country,
    };

    // Get A/B experiment assignments
    const purchaseExperiments = getExperimentCookie()
    const hasPurchaseExperiments = Object.keys(purchaseExperiments).length > 0

    // Send to Supabase (non-blocking)
    // Use first-touch attribution from cookie (most valuable for ads attribution)
    // Fall back to last-touch if first-touch not available
    supabase
      .from('purchases')
      .insert({
        date: data.date,
        session_id: data.sessionId,
        event_id: data.eventId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        amount: data.value,
        product: data.products.join(', '),
        country: data.country,
        referrer: cookieData.first_referrer || null,
        // Use first-touch attribution (what ad brought them), fallback to last-touch, then Stripe metadata
        utm_source: cookieData.first_utm_source || data.utmSource || utmFallback?.utm_source || null,
        utm_medium: cookieData.first_utm_medium || data.utmMedium || utmFallback?.utm_medium || null,
        utm_campaign: cookieData.first_utm_campaign || data.utmCampaign || utmFallback?.utm_campaign || null,
        utm_content: cookieData.first_utm_content || data.utmContent || utmFallback?.utm_content || null,
        experiments: hasPurchaseExperiments ? purchaseExperiments : null,
      })
      .then(({ error }: { error: any }) => {
        if (error) {
          console.error('Failed to save purchase to Supabase:', error);
        } else {
          console.log('✅ Purchase saved to Supabase');
        }
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
  },
  phone?: string,
  paymentIntentId?: string
): Promise<void> {
  // Check if this is a test checkout - bypass all tracking
  if (isTestCheckout(email, phone)) {
    console.log('🧪 Test checkout detected - bypassing all tracking and automations');
    return;
  }

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
      phone: phone || null,
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

    // Get A/B experiment assignments
    const checkoutExperiments = getExperimentCookie();
    const hasCheckoutExperiments = Object.keys(checkoutExperiments).length > 0;

    // Send to Supabase (non-blocking)
    // Use first-touch attribution from cookie (most valuable for ads attribution)
    // Fall back to last-touch if first-touch not available
    const insertData = {
      date: data.date,
      session_id: data.sessionId,
      event_id: data.eventId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      amount: data.value,
      product: data.products.join(', '),
      funnel: data.funnel,
      source: data.source,
      country: data.country,
      referrer: cookieData.first_referrer || data.initialReferrer,
      // Use first-touch attribution (what ad brought them), fallback to last-touch
      utm_source: cookieData.first_utm_source || data.utmSource,
      utm_medium: cookieData.first_utm_medium || data.utmMedium,
      utm_campaign: cookieData.first_utm_campaign || data.utmCampaign,
      utm_content: cookieData.first_utm_content || data.utmContent,
      payment_intent_id: paymentIntentId || null,
      experiments: hasCheckoutExperiments ? checkoutExperiments : null,
    };

    console.log('📦 Supabase insert data:', insertData);

    supabase
      .from('initiate_checkouts')
      .insert(insertData)
      .then(({ error, status, statusText }: { error: any, status: any, statusText: any }) => {
        if (error) {
          console.error('❌ Failed to save initiate checkout to Supabase:', {
            error,
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            status,
            statusText
          });
        } else {
          console.log('✅ Initiate checkout saved to Supabase');
        }
      });

    // Build recovery URL for abandoned cart emails
    const recoveryParams = new URLSearchParams({
      fn: data.firstName,
      ln: data.lastName,
      email: data.email,
      phone: data.phone || '',
    })
    const recoveryUrl = `https://oracleboxing.com/checkout-v2?${recoveryParams.toString()}`

    // Process checkout notification internally (non-blocking)
    fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'checkout',
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        recovery_url: recoveryUrl,
      }),
      keepalive: true,
    }).then(response => {
      if (response.ok) {
        console.log('✅ Checkout notification processed');
      } else {
        console.error('❌ Checkout notification failed:', response.status);
      }
    }).catch(error => {
      console.error('❌ Failed to process checkout notification:', error);
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

    // Send to Facebook Conversions API via server-side API route
    // This ensures the FB_ACCESS_TOKEN stays server-side and we get proper client IP
    try {
      const fbclid = getFbclid();
      const fbp = getFbp();
      const fbc = getFbc();

      console.log('📤 Sending InitiateCheckout to server API with event_id:', eventId);

      fetch('/api/facebook-initiate-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          email: email,
          value: value,
          currency: urlParams?.currency || 'USD',
          products: products,
          page_url: `https://oracleboxing.com${page}`,
          cookie_data: cookieData,
          fbclid: fbclid,
          fbp: fbp,
          fbc: fbc,
        }),
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

/**
 * Track waitlist signup
 * Stores signup data in Supabase waitlist table
 */
export async function trackWaitlistSignup(
  firstName: string,
  lastName: string,
  email: string,
  phone?: string
): Promise<void> {
  try {
    const cookieData = getTrackingCookie();
    const utm = getUTMParameters();

    // Get country with error handling
    let country: string | null = null;
    try {
      country = await getUserCountry();
    } catch (error) {
      console.warn('Failed to get country for waitlist signup:', error);
    }

    const eventId = cookieData.event_id || generateEventId();
    const sessionId = cookieData.session_id || getOrCreateSessionId();

    const data: WaitlistData = {
      eventType: 'waitlist_signup',
      eventId,
      sessionId,
      date: new Date().toISOString(),
      firstName,
      lastName,
      email,
      phone: phone || null,
      country,
      referrer: cookieData.initial_referrer || document?.referrer || null,
      utmSource: cookieData.first_utm_source || utm.utmSource,
      utmMedium: cookieData.first_utm_medium || utm.utmMedium,
      utmCampaign: cookieData.first_utm_campaign || utm.utmCampaign,
      utmContent: cookieData.first_utm_content || utm.utmContent,
    };

    console.log('📝 Waitlist signup data:', data);

    // Send to Supabase
    const experiments = getExperimentCookie()
    const hasExperiments = Object.keys(experiments).length > 0

    const insertData = {
      date: data.date,
      session_id: data.sessionId,
      event_id: data.eventId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      referrer: data.referrer,
      utm_source: data.utmSource,
      utm_medium: data.utmMedium,
      utm_campaign: data.utmCampaign,
      utm_content: data.utmContent,
      experiments: hasExperiments ? experiments : null,
    };

    supabase
      .from('waitlist')
      .insert(insertData)
      .then(({ error }: { error: any }) => {
        if (error) {
          console.error('❌ Failed to save waitlist signup to Supabase:', error);
        } else {
          console.log('✅ Waitlist signup saved to Supabase');
        }
      });

    // Send Lead event to Facebook Pixel (browser-side)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Waitlist Signup',
        content_category: '21-Day Challenge Waitlist',
      }, {
        eventID: eventId
      });
      console.log('📱 Facebook Pixel Lead event sent for waitlist signup');
    }

    // Send Lead event to Facebook Conversions API (server-side)
    try {
      const eventTime = Date.now();
      const fbclid = getFbclid();
      const hashedEmail = await hashSHA256(email);

      const eventData = {
        event_name: 'Lead',
        event_time: Math.floor(eventTime / 1000),
        event_id: eventId,
        event_source_url: 'https://oracleboxing.com/closed',
        action_source: 'website',
        user_data: {
          em: [hashedEmail],
          fn: [await hashSHA256(firstName)],
          ln: [await hashSHA256(lastName)],
          client_user_agent: getClientUserAgent(),
          ...(fbclid && { fbc: `fb.1.${eventTime}.${fbclid}` }),
        },
        custom_data: {
          content_name: 'Waitlist Signup',
          content_category: '21-Day Challenge Waitlist',
        },
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
            console.error('❌ Facebook Conversions API Lead error:', errorData);
          });
        } else {
          response.json().then(result => {
            console.log('✅ Facebook Conversions API Lead success:', result);
          });
        }
      }).catch((error) => {
        console.error('❌ Failed to send Lead to Facebook Conversions API:', error);
      });
    } catch (error) {
      console.error('Error sending Lead to Facebook Conversions API:', error);
    }

    console.log('Waitlist signup tracked:', data);
  } catch (error) {
    console.error('Error tracking waitlist signup:', error);
  }
}

/**
 * Track AddToCart event when user clicks to go to checkout
 * Fires both Facebook Pixel (browser) and Conversions API (server)
 */
export function trackAddToCart(
  productId: string,
  productName: string,
  price: number,
  currency: string,
  buttonLocation: string
): void {
  try {
    const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Track AddToCart in Facebook Pixel (browser-side)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        value: price,
        currency: currency,
        button_location: buttonLocation,
      }, {
        eventID: eventId
      });
      console.log('📱 Facebook Pixel AddToCart event sent:', { productId, eventId, buttonLocation });
    }

    // Get cookie data for CAPI
    let cookieData = {};
    let fbclid = null;

    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const obTrackCookie = cookies['ob_track'];
      if (obTrackCookie) {
        try {
          cookieData = JSON.parse(decodeURIComponent(obTrackCookie));
        } catch (e) {
          console.warn('Failed to parse tracking cookie:', e);
        }
      }
      fbclid = cookies['fbclid'] || null;
    }

    // Send to Facebook Conversions API (server-side)
    fetch('/api/facebook-addtocart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        content_ids: [productId],
        content_name: productName,
        value: price,
        currency: currency,
        button_location: buttonLocation,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        cookie_data: cookieData,
        fbclid: fbclid,
      }),
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send AddToCart to Facebook CAPI:', error);
    });

    // Track AddToCart in Google Ads gtag
    try {
      import('@/lib/gtag').then(({ gtagAddToCart }) => {
        gtagAddToCart({
          item_id: productId,
          item_name: productName,
          price: price,
          currency: currency,
        })
      }).catch(() => {})
    } catch (e) {
      console.warn('Failed to send Google Ads add_to_cart:', e)
    }

    console.log('🛒 AddToCart tracked:', { productId, productName, price, currency, buttonLocation });
  } catch (error) {
    console.error('Error tracking AddToCart:', error);
  }
}
