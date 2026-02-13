# UTM Tracking Implementation Guide

## Overview

Complete UTM parameter tracking and attribution system for Oracle Boxing Shop. This implementation captures UTM parameters, stores them in cookies, and passes them through the entire checkout flow to Stripe metadata.

## Implementation Summary

### Components Implemented

1. **UTMTracker Component** (`/components/UTMTracker.tsx`)
   - Client-side component that captures UTM parameters on page load
   - Runs once on initial mount
   - Stores parameters in cookies via tracking-cookies.ts utility

2. **Enhanced Tracking Cookies** (`/lib/tracking-cookies.ts`)
   - `captureUTMParameters()` - Captures UTM params from URL and stores in cookies
   - `getUTMParameters()` - Retrieves UTM params from cookies
   - `getTrackingParams()` - Gets complete tracking data for API calls
   - Stores: utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid

3. **Root Layout Integration** (`/app/layout.tsx`)
   - UTMTracker component added at top level
   - Runs on every page load to capture initial UTM parameters

4. **Checkout Pages Updated**
   - `/app/checkout/page.tsx` - Uses `getTrackingParams()` from cookies
   - `/app/checkout/order-bumps/page.tsx` - Uses `getTrackingParams()` from cookies

5. **Stripe Metadata Integration** (`/lib/stripe/checkout.ts`)
   - All tracking parameters passed to Stripe metadata
   - Stored in: checkout session metadata, payment_intent_data metadata, subscription_data metadata
   - Includes: referrer, UTM params, fbclid, session_id, event_id

## Data Flow

```
1. User visits site with UTM parameters
   Example: https://shop.oracleboxing.com/?utm_source=facebook&utm_campaign=winter2024

2. UTMTracker component captures parameters
   - Reads URL search params
   - Stores in ob_track cookie (30-day expiry)
   - Cookie structure: {
       session_id: "sess_1234567890_abc123",
       event_id: "0123456789012345",
       utm_source: "facebook",
       utm_campaign: "winter2024",
       utm_medium: undefined,
       utm_content: undefined,
       utm_term: undefined,
       fbclid: undefined,
       landing_time: 1234567890000
     }

3. User navigates to checkout
   - Checkout page calls getTrackingParams()
   - Retrieves stored UTM data from cookies
   - No need to pass via URL parameters

4. User submits checkout
   - Tracking params sent to /api/checkout/session
   - API passes trackingParams to createCheckoutSession()

5. Stripe session created with metadata
   - All UTM params stored in Stripe metadata
   - Available in: session, payment_intent, subscription objects
   - Accessible via webhooks and Stripe dashboard
```

## Cookie Structure

**Cookie Name:** `ob_track`
**Expiry:** 30 days
**Format:** JSON

```typescript
{
  // Session tracking
  session_id: string          // Unique session identifier
  event_id: string            // Single event ID for entire session
  landing_time: number        // Timestamp of first visit

  // Attribution
  utm_source?: string         // Traffic source (e.g., "facebook")
  utm_medium?: string         // Marketing medium (e.g., "cpc")
  utm_campaign?: string       // Campaign name (e.g., "winter2024")
  utm_content?: string        // Ad content identifier
  utm_term?: string           // Search keywords
  fbclid?: string             // Facebook Click ID

  // Event deduplication
  page_view_fired?: boolean
  last_page_view_sent?: number
  initiate_checkout_fired?: boolean
  purchase_fired?: boolean
  purchase_time?: number
}
```

## Stripe Metadata Fields

All tracking parameters are stored in Stripe metadata for:
- Checkout Sessions
- Payment Intents
- Subscriptions

**Metadata Fields:**
```typescript
{
  // Customer info
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone: string

  // Funnel tracking
  funnel_type: string         // "6wc" | "course" | "membership" | "bundle"
  type: string               // "course" | "membership" | "6wc"
  entry_product: string      // Product metadata code (e.g., "bffp", "obm")
  add_ons_included: string   // Comma-separated addon product codes

  // Product details
  product_name: string
  product_id: string
  cart_items: string         // JSON stringified cart summary

  // Attribution & Tracking
  referrer: string           // Document referrer or "direct"
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_content: string
  fbclid: string            // Facebook Click ID
  session_id: string        // Session identifier
  event_id: string          // Event identifier

  // Cross-sell tracking
  recommended_products: string
}
```

## Testing Instructions

### 1. Test UTM Parameter Capture

**Test URL:**
```
http://localhost:3002/?utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign&utm_content=test_content&utm_term=test_term
```

**Expected Results:**
1. Open browser DevTools → Application → Cookies
2. Look for `ob_track` cookie
3. Should contain all UTM parameters
4. Console should show: `📊 UTM parameters captured: {...}`

### 2. Test Cookie Persistence

**Steps:**
1. Visit site with UTM parameters
2. Navigate to different pages
3. Check console on checkout page
4. Should see: `📊 Tracking params from cookies: {...}`

**Expected Result:**
- UTM parameters persist across page navigation
- Same session_id and event_id throughout session

### 3. Test Stripe Metadata

**Steps:**
1. Visit site with UTM parameters
2. Add product to cart
3. Complete checkout flow
4. Check Stripe Dashboard

**Expected Result:**
- Go to Stripe Dashboard → Payments
- Find the test payment
- Click on payment → Metadata tab
- Should see all UTM fields populated

### 4. Test Facebook Click ID (fbclid)

**Test URL:**
```
http://localhost:3002/?fbclid=IwAR1234567890abcdef
```

**Expected Results:**
1. fbclid stored in cookie
2. fbclid passed to Stripe metadata
3. Available in webhook events

## Production URLs

**Production Site:**
```
https://shop.oracleboxing.com
```

**Example with UTM:**
```
https://shop.oracleboxing.com/?utm_source=facebook&utm_medium=paid&utm_campaign=winter2024&utm_content=carousel_ad&utm_term=boxing_course
```

## Webhook Integration

When processing Stripe webhooks, access tracking data from metadata:

```typescript
// Example webhook handler
const session = event.data.object; // Stripe checkout session

const trackingData = {
  utm_source: session.metadata.utm_source,
  utm_medium: session.metadata.utm_medium,
  utm_campaign: session.metadata.utm_campaign,
  utm_content: session.metadata.utm_content,
  utm_term: session.metadata.utm_term,
  fbclid: session.metadata.fbclid,
  session_id: session.metadata.session_id,
  event_id: session.metadata.event_id,
  referrer: session.metadata.referrer,
};

// Use tracking data for attribution reporting
console.log('Purchase attribution:', trackingData);
```

## Analytics Integration

### Facebook Pixel
If using Facebook Pixel, you can access the fbclid from cookies:

```typescript
import { getTrackingParams } from '@/lib/tracking-cookies';

const tracking = getTrackingParams();
if (tracking.fbclid) {
  // Send to Facebook Pixel with fbclid for better attribution
  fbq('track', 'Purchase', {
    value: orderTotal,
    currency: 'USD',
    external_id: tracking.fbclid,
  });
}
```

### Google Analytics
UTM parameters are automatically available in GA4 if you're using standard GA tracking.

## Troubleshooting

### UTM Parameters Not Captured

**Problem:** Cookie not created or UTM params empty

**Solutions:**
1. Check browser console for error messages
2. Verify UTMTracker component is rendering (check React DevTools)
3. Ensure cookies are enabled in browser
4. Check cookie in DevTools → Application → Cookies

### UTM Parameters Not in Stripe

**Problem:** Metadata fields empty in Stripe Dashboard

**Solutions:**
1. Verify tracking params logged in console during checkout
2. Check API request body includes trackingParams
3. Verify Stripe metadata fields in createCheckoutSession function
4. Check Stripe webhook logs for metadata

### Cookie Cleared Too Soon

**Problem:** UTM data lost before checkout

**Solutions:**
1. Cookie expiry is 30 days by default
2. Check browser privacy settings (some browsers block 3rd party cookies)
3. Verify cookie domain matches site domain
4. Consider using localStorage as backup (requires code modification)

## Future Enhancements

1. **Multi-touch Attribution**
   - Track first-touch and last-touch UTM parameters
   - Store attribution journey in cookie

2. **Server-Side Tracking**
   - Capture UTM parameters in API routes
   - Store in database for long-term analysis

3. **Attribution Dashboard**
   - Build admin dashboard to view UTM performance
   - Show conversion rates by source/medium/campaign

4. **A/B Testing Integration**
   - Store test variant in cookie
   - Pass to Stripe metadata for analysis

## Files Modified

- ✅ `/components/UTMTracker.tsx` (NEW)
- ✅ `/lib/tracking-cookies.ts` (ENHANCED)
- ✅ `/app/layout.tsx` (MODIFIED)
- ✅ `/app/checkout/page.tsx` (MODIFIED)
- ✅ `/app/checkout/order-bumps/page.tsx` (MODIFIED)
- ✅ `/lib/stripe/checkout.ts` (MODIFIED)

## Summary

The UTM tracking system is now fully implemented and integrated with:
- ✅ Client-side capture on page load
- ✅ Cookie-based storage (30-day persistence)
- ✅ Session and event ID tracking
- ✅ Facebook Click ID (fbclid) support
- ✅ Stripe metadata integration
- ✅ Checkout flow integration
- ✅ Order bumps integration
- ✅ All payment types (one-time and subscriptions)

All UTM parameters and attribution data will now be captured, stored, and passed through to Stripe for comprehensive attribution tracking and analysis.
