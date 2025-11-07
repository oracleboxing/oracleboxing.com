// Cookie-based tracking utilities for event deduplication and attribution

export interface TrackingData {
  // Session Identity
  session_id?: string;
  event_id?: string;
  landing_time?: string; // ISO string
  ip?: string; // Truncated for GDPR (last octet removed)
  user_agent?: string;

  // User Data (only after consent + form submission)
  first_name?: string;
  last_name?: string;
  email?: string; // Lowercase

  // Attribution - First Touch (never overwritten)
  first_referrer?: string;
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_utm_content?: string;
  first_utm_term?: string;
  first_referrer_time?: string; // ISO string

  // Attribution - Last Touch (updated on change)
  last_referrer?: string;
  last_utm_source?: string;
  last_utm_medium?: string;
  last_utm_campaign?: string;
  last_utm_content?: string;
  last_utm_term?: string;
  last_referrer_time?: string; // ISO string

  // Facebook Attribution
  fbclid?: string;

  // Location / Currency
  country_code?: string;
  currency?: string;

  // Event Deduplication
  page_view_fired?: boolean;
  last_page_view_sent?: number;
  initiate_checkout_fired?: boolean;
  purchase_fired?: boolean;
  purchase_time?: string; // ISO string

  // Metadata
  button_location?: string;
  consent_given?: boolean;
  cookie_version?: number; // Schema version
}

/**
 * Set a cookie with the given name and value
 */
export function setCookie(name: string, value: any, days: number = 30): void {
  if (typeof window === 'undefined') return;
  
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
  
  document.cookie = `${name}=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): any {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    if (!cookieValue) return null;
    
    try {
      return JSON.parse(decodeURIComponent(cookieValue));
    } catch {
      return decodeURIComponent(cookieValue);
    }
  }
  
  return null;
}

/**
 * Generate a unique event ID (random string of numbers)
 */
export function generateEventId(): string {
  // Generate a random string of 16 digits
  const part1 = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  const part2 = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return part1 + part2;
}

/**
 * Generate a unique session ID (UUIDv4-like)
 */
export function generateSessionId(): string {
  return 'sess_' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Truncate IP address for GDPR compliance (removes last octet)
 */
export function truncateIP(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  // IPv6 truncation - remove last segment
  const ipv6Parts = ip.split(':');
  if (ipv6Parts.length > 1) {
    return ipv6Parts.slice(0, -1).join(':') + ':0';
  }
  return ip;
}

/**
 * Check if user has given consent for tracking cookies
 */
export function hasTrackingConsent(): boolean {
  if (typeof window === 'undefined') return false;

  const consentCookie = getCookie('ob_consent');
  return consentCookie === 'accepted' || consentCookie === true;
}

/**
 * Get or initialize tracking data
 * ALWAYS returns UTM/attribution data (it's from user's URL)
 * Session/event IDs only initialized after consent
 */
export function getOrInitTrackingData(): TrackingData {
  // Check for existing tracking data
  let trackingData = getCookie('ob_track') || {};

  // If no consent, return existing data (may contain UTM params) but don't initialize new session
  if (!hasTrackingConsent()) {
    return trackingData;
  }

  // Initialize session and event ID if new (after consent)
  if (!trackingData.session_id) {
    trackingData.session_id = generateSessionId();
    trackingData.landing_time = new Date().toISOString();
    trackingData.cookie_version = 1;
    trackingData.consent_given = true;
    trackingData.user_agent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  }

  // Generate event ID if not exists (single ID for entire session)
  if (!trackingData.event_id) {
    trackingData.event_id = generateEventId();
  }

  // Fix old landing_time format (number to ISO string)
  if (trackingData.landing_time && typeof trackingData.landing_time === 'number') {
    trackingData.landing_time = new Date(trackingData.landing_time).toISOString();
  }

  // Ensure cookie_version exists (migration)
  if (!trackingData.cookie_version) {
    trackingData.cookie_version = 1;
  }

  // Ensure consent_given exists
  if (trackingData.consent_given === undefined) {
    trackingData.consent_given = true;
  }

  // Ensure user_agent exists
  if (!trackingData.user_agent && typeof navigator !== 'undefined') {
    trackingData.user_agent = navigator.userAgent;
  }

  // Initialize empty attribution fields if they don't exist
  if (!trackingData.first_referrer) {
    trackingData.first_referrer = 'direct';
    trackingData.first_referrer_time = trackingData.landing_time;
  }
  if (!trackingData.last_referrer) {
    trackingData.last_referrer = 'direct';
    trackingData.last_referrer_time = trackingData.landing_time;
  }

  // Initialize empty UTM fields with null/undefined if not set
  if (trackingData.first_utm_source === undefined) {
    trackingData.first_utm_source = undefined;
    trackingData.first_utm_medium = undefined;
    trackingData.first_utm_campaign = undefined;
    trackingData.first_utm_content = undefined;
    trackingData.first_utm_term = undefined;
  }
  if (trackingData.last_utm_source === undefined) {
    trackingData.last_utm_source = undefined;
    trackingData.last_utm_medium = undefined;
    trackingData.last_utm_campaign = undefined;
    trackingData.last_utm_content = undefined;
    trackingData.last_utm_term = undefined;
  }

  // Fetch and set country/currency if not already set
  if (!trackingData.country_code || !trackingData.currency) {
    fetchAndSetLocation(trackingData);
  }

  // Save initialized data
  setCookie('ob_track', trackingData, 30);

  return trackingData;
}

/**
 * Fetch location and set country/currency in tracking data
 */
async function fetchAndSetLocation(trackingData: TrackingData): Promise<void> {
  try {
    const response = await fetch('/api/detect-location', {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.country_code) {
        trackingData.country_code = data.country_code;

        // Map country to currency
        const currencyMap: Record<string, string> = {
          US: 'USD', GB: 'GBP', UK: 'GBP', DE: 'EUR', FR: 'EUR', IT: 'EUR',
          ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR', IE: 'EUR', PT: 'EUR',
          FI: 'EUR', GR: 'EUR', AU: 'AUD', CA: 'CAD', AE: 'AED',
        };

        trackingData.currency = currencyMap[data.country_code] || 'USD';

        // Save updated data
        setCookie('ob_track', trackingData, 30);
      }
    }
  } catch (error) {
    console.warn('Failed to fetch location:', error);
    // Default to USD if fetch fails
    trackingData.country_code = trackingData.country_code || 'US';
    trackingData.currency = trackingData.currency || 'USD';
    setCookie('ob_track', trackingData, 30);
  }
}

/**
 * Update tracking data in cookie (only if consent given)
 */
export function updateTrackingData(updates: Partial<TrackingData>): void {
  if (!hasTrackingConsent()) {
    console.warn('Cannot update tracking data: No consent given');
    return;
  }

  const currentData = getOrInitTrackingData();
  const updatedData = { ...currentData, ...updates };
  setCookie('ob_track', updatedData, 30);
}

/**
 * Clear specific tracking fields (useful after purchase)
 */
export function clearTrackingFields(fields: string[]): void {
  const trackingData = getOrInitTrackingData();
  
  fields.forEach(field => {
    delete trackingData[field as keyof TrackingData];
  });
  
  setCookie('ob_track', trackingData, 30);
}

/**
 * Check if a purchase event is a duplicate (within 60 seconds)
 */
export function isDuplicatePurchase(): boolean {
  const trackingData = getOrInitTrackingData();

  if (trackingData.purchase_fired && trackingData.purchase_time) {
    const purchaseTimestamp = new Date(trackingData.purchase_time).getTime();
    const timeSincePurchase = Date.now() - purchaseTimestamp;
    return timeSincePurchase < 60000; // 60 seconds
  }

  return false;
}

/**
 * Capture UTM parameters and referrer attribution
 * ALWAYS saves UTM params immediately (they're from the URL, not generated tracking)
 * Session/event IDs still require consent
 * Returns captured data
 */
export function captureUTMParameters(): Partial<TrackingData> | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const now = new Date().toISOString();

  // Extract current UTM and referrer (always do this)
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmContent = urlParams.get('utm_content');
  const utmTerm = urlParams.get('utm_term');
  const fbclid = urlParams.get('fbclid');

  // IMPORTANT: Always get existing data even without consent
  // We need to check if UTM params are already saved
  let existingData = getCookie('ob_track') || {};

  const updates: Partial<TrackingData> = {};

  // Check if this is truly a new session by comparing timestamps
  // If last_referrer_time is the same as landing_time, this is the first capture
  const isFirstCapture = existingData.last_referrer_time === existingData.landing_time;

  // Also consider it a new session if significant time has passed (e.g., 30 minutes)
  let isNewSession = isFirstCapture;
  if (existingData.last_referrer_time) {
    const timeSinceLastUpdate = Date.now() - new Date(existingData.last_referrer_time).getTime();
    const thirtyMinutesInMs = 30 * 60 * 1000;
    if (timeSinceLastUpdate > thirtyMinutesInMs) {
      isNewSession = true;
    }
  }

  // --- FIRST TOUCH ATTRIBUTION (never overwrite if already set) ---
  if (document.referrer && !existingData.first_referrer) {
    const referrer = document.referrer;
    const currentDomain = window.location.hostname;
    try {
      const referrerDomain = new URL(referrer).hostname;
      if (referrerDomain !== currentDomain) {
        updates.first_referrer = referrer;
        updates.first_referrer_time = now;
        console.log('📊 First referrer captured:', referrer);
      }
    } catch (e) {
      console.warn('Invalid referrer URL:', referrer);
    }
  }

  // Capture first UTM parameters (only if not already set)
  if (utmSource && !existingData.first_utm_source) {
    updates.first_utm_source = utmSource;
    updates.first_utm_medium = utmMedium || undefined;
    updates.first_utm_campaign = utmCampaign || undefined;
    updates.first_utm_content = utmContent || undefined;
    updates.first_utm_term = utmTerm || undefined;
    console.log('📊 First touch UTM captured:', { utmSource, utmMedium, utmCampaign });
  }

  // --- LAST TOUCH ATTRIBUTION (update only from external marketing sources) ---
  // Blocklist: Don't update last touch from checkout/payment providers
  const blockedDomains = [
    'checkout.stripe.com',
    'stripe.com',
    'paypal.com',
    'pay.google.com',
    'appleid.apple.com'
  ];

  // Track whether we should update last_referrer_time
  let shouldUpdateTime = isNewSession; // Always update on new session

  if (document.referrer) {
    const referrer = document.referrer;
    const currentDomain = window.location.hostname;
    try {
      const referrerDomain = new URL(referrer).hostname;
      const isBlockedDomain = blockedDomains.some(blocked => referrerDomain.includes(blocked));

      // Update if: external domain + not blocked
      if (referrerDomain !== currentDomain && !isBlockedDomain) {
        // Update last_referrer if it's different OR if current value is 'direct'
        if (referrer !== existingData.last_referrer || existingData.last_referrer === 'direct') {
          updates.last_referrer = referrer;
          shouldUpdateTime = true;
          console.log('📊 Last referrer updated:', referrer);
        }
      } else if (isBlockedDomain) {
        console.log('📊 Referrer blocked (checkout/payment domain):', referrerDomain);
      }
    } catch (e) {
      console.warn('Invalid referrer URL:', referrer);
    }
  }

  // Update last UTM parameters if they've changed
  if (utmSource && utmSource !== existingData.last_utm_source) {
    updates.last_utm_source = utmSource;
    updates.last_utm_medium = utmMedium || undefined;
    updates.last_utm_campaign = utmCampaign || undefined;
    updates.last_utm_content = utmContent || undefined;
    updates.last_utm_term = utmTerm || undefined;
    shouldUpdateTime = true; // UTM changed, update time
    console.log('📊 Last touch UTM updated:', { utmSource, utmMedium, utmCampaign });
  }

  // Update last_referrer_time if:
  // - New session, OR
  // - Referrer changed, OR
  // - UTM parameters changed
  if (shouldUpdateTime) {
    updates.last_referrer_time = now;
    console.log('📊 Last referrer time updated:', now,
                isNewSession ? '(new session)' :
                updates.last_referrer ? '(referrer changed)' :
                updates.last_utm_source ? '(UTM changed)' : '');
  }

  // Facebook Click ID (always update if present)
  if (fbclid) {
    updates.fbclid = fbclid;
  }

  // CRITICAL: Save UTM/referrer updates IMMEDIATELY (even without consent)
  // UTM params are from the URL the user clicked, not generated tracking data
  // This ensures we don't lose attribution when they navigate before accepting cookies
  if (Object.keys(updates).length > 0) {
    console.log('📊 Saving attribution updates to cookies:', updates);

    // Merge updates with existing data and save directly
    const updatedData = { ...existingData, ...updates };
    setCookie('ob_track', updatedData, 30);

    console.log('✅ Attribution saved successfully (consent not required for UTM params)');
  }

  return updates;
}

/**
 * Get all UTM parameters from cookies (first and last touch)
 */
export function getUTMParameters(): {
  // First Touch
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_utm_content?: string;
  first_utm_term?: string;
  // Last Touch
  last_utm_source?: string;
  last_utm_medium?: string;
  last_utm_campaign?: string;
  last_utm_content?: string;
  last_utm_term?: string;
  // Facebook
  fbclid?: string;
} {
  const trackingData = getOrInitTrackingData();

  return {
    first_utm_source: trackingData.first_utm_source,
    first_utm_medium: trackingData.first_utm_medium,
    first_utm_campaign: trackingData.first_utm_campaign,
    first_utm_content: trackingData.first_utm_content,
    first_utm_term: trackingData.first_utm_term,
    last_utm_source: trackingData.last_utm_source,
    last_utm_medium: trackingData.last_utm_medium,
    last_utm_campaign: trackingData.last_utm_campaign,
    last_utm_content: trackingData.last_utm_content,
    last_utm_term: trackingData.last_utm_term,
    fbclid: trackingData.fbclid,
  };
}

/**
 * Get tracking parameters for checkout/API calls
 * Returns both first touch and last touch attribution
 */
export function getTrackingParams(): {
  // Session
  session_id?: string;
  event_id?: string;
  // First Touch Attribution
  first_referrer?: string;
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_utm_term?: string;
  first_utm_content?: string;
  // Last Touch Attribution
  last_referrer?: string;
  last_utm_source?: string;
  last_utm_medium?: string;
  last_utm_campaign?: string;
  last_utm_term?: string;
  last_utm_content?: string;
  // Facebook
  fbclid?: string;
  // Location
  country_code?: string;
  currency?: string;
} {
  const trackingData = getOrInitTrackingData();

  return {
    session_id: trackingData.session_id,
    event_id: trackingData.event_id,
    first_referrer: trackingData.first_referrer || 'direct',
    first_utm_source: trackingData.first_utm_source,
    first_utm_medium: trackingData.first_utm_medium,
    first_utm_campaign: trackingData.first_utm_campaign,
    first_utm_term: trackingData.first_utm_term,
    first_utm_content: trackingData.first_utm_content,
    last_referrer: trackingData.last_referrer,
    last_utm_source: trackingData.last_utm_source,
    last_utm_medium: trackingData.last_utm_medium,
    last_utm_campaign: trackingData.last_utm_campaign,
    last_utm_term: trackingData.last_utm_term,
    last_utm_content: trackingData.last_utm_content,
    fbclid: trackingData.fbclid,
    country_code: trackingData.country_code,
    currency: trackingData.currency,
  };
}