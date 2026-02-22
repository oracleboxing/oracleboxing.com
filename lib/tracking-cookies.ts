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
  _fbc?: string; // Facebook Click ID cookie
  _fbp?: string; // Facebook Browser ID cookie (set by pixel)
  _fbi?: string; // Facebook IPv6 cookie (set by param builder)

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
 * Returns boolean indicating success/failure
 */
export function setCookie(name: string, value: any, days: number = 30): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;

    document.cookie = `${name}=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    // Verify cookie was set by reading it back
    const savedValue = getCookie(name);
    return savedValue !== null;
  } catch (error) {
    console.error('Failed to set cookie:', error);
    return false;
  }
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
 * Atomically update tracking data with first-touch protection
 * CRITICAL: Never overwrites first-touch attribution data
 */
function atomicUpdateTrackingData(updates: Partial<TrackingData>): boolean {
  const existing = getCookie('ob_track') || {};

  // Merge updates with existing data
  const merged = { ...existing, ...updates };

  // CRITICAL: Preserve first-touch attribution if it exists
  // Never allow first-touch to be overwritten or deleted
  if (existing.first_referrer && existing.first_referrer !== 'direct') {
    merged.first_referrer = existing.first_referrer;
    merged.first_referrer_time = existing.first_referrer_time;
  }

  if (existing.first_utm_source) {
    merged.first_utm_source = existing.first_utm_source;
    merged.first_utm_medium = existing.first_utm_medium;
    merged.first_utm_campaign = existing.first_utm_campaign;
    merged.first_utm_content = existing.first_utm_content;
    merged.first_utm_term = existing.first_utm_term;
  }

  // Save with fallback to sessionStorage if cookie fails
  const cookieSuccess = setCookie('ob_track', merged, 30);

  if (!cookieSuccess) {
    console.warn('⚠️ Cookie save failed, using sessionStorage fallback');
    try {
      sessionStorage.setItem('ob_track_fallback', JSON.stringify(merged));
      return true;
    } catch (e) {
      console.error('❌ All storage methods failed:', e);
      return false;
    }
  }

  return true;
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
 * NOTE: Always returns true - we auto-consent for essential tracking
 * UTM/attribution data is from the user's URL, not generated tracking
 */
export function hasTrackingConsent(): boolean {
  return true;
}

/**
 * Get or initialize tracking data
 * ALWAYS returns UTM/attribution data (it's from user's URL)
 * Session/event IDs only initialized after consent
 * FIXED: Never overwrites first-touch attribution
 */
export function getOrInitTrackingData(): TrackingData {
  // Check for existing tracking data (including sessionStorage fallback)
  let trackingData = getCookie('ob_track');

  // Fallback to sessionStorage if cookie failed
  if (!trackingData && typeof window !== 'undefined') {
    try {
      const fallback = sessionStorage.getItem('ob_track_fallback');
      if (fallback) {
        trackingData = JSON.parse(fallback);
      }
    } catch (e) {
      console.warn('Failed to read sessionStorage fallback:', e);
    }
  }

  trackingData = trackingData || {};

  const updates: Partial<TrackingData> = {};
  const now = new Date().toISOString();

  // Initialize session and event ID if new (after consent)
  if (!trackingData.session_id) {
    updates.session_id = generateSessionId();
    updates.landing_time = now;
    updates.cookie_version = 1;
    updates.consent_given = true;
    updates.user_agent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  }

  // Generate event ID if not exists (single ID for entire session)
  if (!trackingData.event_id) {
    updates.event_id = generateEventId();
  }

  // Fix old landing_time format (number to ISO string)
  if (trackingData.landing_time && typeof trackingData.landing_time === 'number') {
    updates.landing_time = new Date(trackingData.landing_time).toISOString();
  }

  // Ensure cookie_version exists (migration)
  if (!trackingData.cookie_version) {
    updates.cookie_version = 1;
  }

  // Ensure consent_given exists
  if (trackingData.consent_given === undefined) {
    updates.consent_given = true;
  }

  // Ensure user_agent exists
  if (!trackingData.user_agent && typeof navigator !== 'undefined') {
    updates.user_agent = navigator.userAgent;
  }

  // CRITICAL FIX: Only set 'direct' as default on very first visit
  // Never overwrite existing first-touch attribution
  const isVeryFirstVisit = !trackingData.landing_time && !trackingData.first_referrer && !trackingData.first_utm_source;

  if (isVeryFirstVisit) {
    // This is the absolute first time we're seeing this user
    // Set 'direct' as placeholder - will be overwritten by captureUTMParameters if there's real attribution
    updates.first_referrer = 'direct';
    updates.first_referrer_time = updates.landing_time || now;
    updates.last_referrer = 'direct';
    updates.last_referrer_time = updates.landing_time || now;
  } else {
    // Returning visitor - preserve existing first-touch, only update last-touch if missing
    if (!trackingData.last_referrer) {
      updates.last_referrer = trackingData.first_referrer || 'direct';
      updates.last_referrer_time = trackingData.first_referrer_time || trackingData.landing_time || now;
    }
  }

  // Fetch and set country/currency if not already set
  if (!trackingData.country_code || !trackingData.currency) {
    fetchAndSetLocation(trackingData);
  }

  // Save initialized data using atomic update to protect first-touch
  if (Object.keys(updates).length > 0) {
    const merged = { ...trackingData, ...updates };
    atomicUpdateTrackingData(updates);
    return merged;
  }

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
 * Update tracking data in cookie
 * FIXED: Uses atomic update to protect first-touch attribution
 */
export function updateTrackingData(updates: Partial<TrackingData>): void {
  // Use atomic update to ensure first-touch is never overwritten
  atomicUpdateTrackingData(updates);
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
 * FIXED: Preserves partial UTM data, reduces session window, handles missing referrer
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
  let existingData = getCookie('ob_track');

  // Fallback to sessionStorage if cookie not available
  if (!existingData && typeof window !== 'undefined') {
    try {
      const fallback = sessionStorage.getItem('ob_track_fallback');
      if (fallback) {
        existingData = JSON.parse(fallback);
      }
    } catch (e) {
      // Ignore
    }
  }

  existingData = existingData || {};

  const updates: Partial<TrackingData> = {};

  // Check if this is truly a new session by comparing timestamps
  // If last_referrer_time is the same as landing_time, this is the first capture
  const isFirstCapture = existingData.last_referrer_time === existingData.landing_time;

  // FIXED: Reduced from 30 minutes to 15 minutes for better attribution tracking
  let isNewSession = isFirstCapture;
  if (existingData.last_referrer_time) {
    const timeSinceLastUpdate = Date.now() - new Date(existingData.last_referrer_time).getTime();
    const fifteenMinutesInMs = 15 * 60 * 1000; // FIXED: Was 30 minutes
    if (timeSinceLastUpdate > fifteenMinutesInMs) {
      isNewSession = true;
    }
  }

  // --- FIRST TOUCH ATTRIBUTION (never overwrite if already set) ---
  // Handle document.referrer
  if (document.referrer && !existingData.first_referrer) {
    const referrer = document.referrer;
    const currentDomain = window.location.hostname;
    try {
      const referrerDomain = new URL(referrer).hostname;
      if (referrerDomain !== currentDomain) {
        updates.first_referrer = referrer;
        updates.first_referrer_time = now;
      }
    } catch (e) {
      console.warn('Invalid referrer URL:', referrer);
    }
  }

  // Capture first UTM parameters (only if not already set)
  if (utmSource && !existingData.first_utm_source) {
    updates.first_utm_source = utmSource;
    // FIXED: Only update fields that are actually present in URL
    if (utmMedium !== null && utmMedium !== undefined) {
      updates.first_utm_medium = utmMedium;
    }
    if (utmCampaign !== null && utmCampaign !== undefined) {
      updates.first_utm_campaign = utmCampaign;
    }
    if (utmContent !== null && utmContent !== undefined) {
      updates.first_utm_content = utmContent;
    }
    if (utmTerm !== null && utmTerm !== undefined) {
      updates.first_utm_term = utmTerm;
    }

    // FIXED Bug #6: If UTM params exist but no referrer header (email/SMS/QR codes)
    // Set first_referrer to the utm_source to avoid 'direct' being set later
    if (!existingData.first_referrer && !updates.first_referrer) {
      updates.first_referrer = utmSource; // Use utm_source as referrer
      updates.first_referrer_time = now;
    }
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
        }
      }
    } catch (e) {
      console.warn('Invalid referrer URL:', referrer);
    }
  }

  // Update last UTM parameters if they've changed
  if (utmSource && utmSource !== existingData.last_utm_source) {
    updates.last_utm_source = utmSource;

    // FIXED Bug #4: Only update fields that are actually present in URL
    // Preserve existing values if not in current URL
    if (utmMedium !== null && utmMedium !== undefined) {
      updates.last_utm_medium = utmMedium;
    } else {
      // Keep existing value if not in URL
      updates.last_utm_medium = existingData.last_utm_medium;
    }

    if (utmCampaign !== null && utmCampaign !== undefined) {
      updates.last_utm_campaign = utmCampaign;
    } else {
      updates.last_utm_campaign = existingData.last_utm_campaign;
    }

    if (utmContent !== null && utmContent !== undefined) {
      updates.last_utm_content = utmContent;
    } else {
      updates.last_utm_content = existingData.last_utm_content;
    }

    if (utmTerm !== null && utmTerm !== undefined) {
      updates.last_utm_term = utmTerm;
    } else {
      updates.last_utm_term = existingData.last_utm_term;
    }

    shouldUpdateTime = true; // UTM changed, update time
  }

  // Update last_referrer_time if:
  // - New session, OR
  // - Referrer changed, OR
  // - UTM parameters changed
  if (shouldUpdateTime) {
    updates.last_referrer_time = now;
  }

  // Facebook Click ID (always update if present)
  if (fbclid) {
    updates.fbclid = fbclid;
  }

  // CRITICAL: Save UTM/referrer updates IMMEDIATELY (even without consent)
  // UTM params are from the URL the user clicked, not generated tracking data
  // This ensures we don't lose attribution when they navigate before accepting cookies
  if (Object.keys(updates).length > 0) {
    // FIXED Bug #5: Use atomic update with error handling and fallback
    const success = atomicUpdateTrackingData(updates);

    if (!success) {
      console.error('Failed to save attribution data - all storage methods failed');
    }
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

/**
 * Get or set Facebook _fbc cookie (Facebook Click ID)
 * Used for Facebook Conversions API attribution
 */
export function getFacebookFbc(): string | undefined {
  // Try to get from standard _fbc cookie first
  const fbcCookie = getCookie('_fbc');
  if (fbcCookie) return fbcCookie;

  // Try to get from ob_track cookie
  const trackingData = getCookie('ob_track');
  return trackingData?._fbc;
}

export function setFacebookFbc(fbc: string): void {
  // Set standard _fbc cookie
  setCookie('_fbc', fbc, 90); // 90 days as per Facebook spec

  // Also store in ob_track for consolidation
  const trackingData = getOrInitTrackingData();
  trackingData._fbc = fbc;
  setCookie('ob_track', trackingData, 30);
}

/**
 * Get or set Facebook _fbp cookie (Facebook Browser ID)
 * Typically set by Facebook Pixel, but we read it here
 */
export function getFacebookFbp(): string | undefined {
  // Try to get from standard _fbp cookie first
  const fbpCookie = getCookie('_fbp');
  if (fbpCookie) return fbpCookie;

  // Try to get from ob_track cookie
  const trackingData = getCookie('ob_track');
  return trackingData?._fbp;
}

export function setFacebookFbp(fbp: string): void {
  // Set standard _fbp cookie
  setCookie('_fbp', fbp, 90); // 90 days as per Facebook spec

  // Also store in ob_track for consolidation
  const trackingData = getOrInitTrackingData();
  trackingData._fbp = fbp;
  setCookie('ob_track', trackingData, 30);
}

/**
 * Get or set Facebook _fbi cookie (IPv6 address from param builder)
 * Used by Facebook Parameter Builder for client IP collection
 */
export function getFacebookFbi(): string | undefined {
  // Try to get from standard _fbi cookie first
  const fbiCookie = getCookie('_fbi');
  if (fbiCookie) return fbiCookie;

  // Try to get from ob_track cookie
  const trackingData = getCookie('ob_track');
  return trackingData?._fbi;
}

// --- A/B Experiment Cookie Helpers ---
// Cookie name: ob_ab, same 30-day TTL as ob_track
// Shape: { "hero-headline-feb": "control", "pricing-cta": "challenger" }

/**
 * Get experiment variant assignments from ob_ab cookie
 */
export function getExperimentCookie(): Record<string, string> {
  const data = getCookie('ob_ab');
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, string>;
  }
  return {};
}

/**
 * Set experiment variant assignments in ob_ab cookie
 */
export function setExperimentCookie(assignments: Record<string, string>): boolean {
  return setCookie('ob_ab', assignments, 30);
}

export function setFacebookFbi(fbi: string): void {
  // Set standard _fbi cookie
  setCookie('_fbi', fbi, 90); // 90 days as per Facebook spec

  // Also store in ob_track for consolidation
  const trackingData = getOrInitTrackingData();
  trackingData._fbi = fbi;
  setCookie('ob_track', trackingData, 30);
}

/**
 * Build _fbc cookie from fbclid parameter
 * Format: fb.{subdomainIndex}.{timestamp}.{fbclid}
 */
export function buildFbcFromFbclid(fbclid: string): string {
  const timestamp = Date.now();
  return `fb.1.${timestamp}.${fbclid}`;
}

/**
 * Sync Facebook cookies from URL parameters
 * Should be called when page loads with fbclid parameter
 */
export function syncFacebookCookies(): void {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');

  // If fbclid is present and we don't have _fbc cookie, create it
  if (fbclid && !getFacebookFbc()) {
    const fbc = buildFbcFromFbclid(fbclid);
    setFacebookFbc(fbc);
  }

  // Read _fbp cookie set by Facebook Pixel and sync to ob_track
  const fbp = getCookie('_fbp');
  if (fbp) {
    const trackingData = getOrInitTrackingData();
    if (!trackingData._fbp) {
      trackingData._fbp = fbp;
      setCookie('ob_track', trackingData, 30);
    }
  }
}