# Facebook Purchase Event Tracking Guide

Complete guide to Facebook Conversions API Purchase event tracking from success page.

## Overview

When a customer completes a purchase and lands on the success page, comprehensive Purchase events are automatically sent to Facebook with:
- ✅ Full order details (amount, products, quantities)
- ✅ Hashed customer data (email, phone)
- ✅ Complete cookie tracking data (attribution, session, location)
- ✅ Event deduplication with browser-side events
- ✅ Test event code for monitoring

## Event Flow

### Main Purchase Flow
```
1. Customer completes checkout on Stripe
2. Customer redirected to success page (/success/[session_id])
3. Success page component (SuccessContent.tsx):
   - Fetches session data from /api/session endpoint
   - Retrieves expanded session with line items from Stripe
   - Parses cookie data from browser
   - Sends browser-side Facebook Pixel Purchase event
   - Sends server-side Facebook CAPI Purchase event
   - Uses same event_id for deduplication
```

### Upsell Purchase Flow
```
1. Customer accepts upsell (off-session charge)
2. Stripe sends payment_intent.succeeded webhook
3. Server-side webhook handler:
   - Detects upsell via metadata.source = "upsell"
   - Parses cookie data from payment intent metadata
   - Builds upsell Facebook event
   - Sends to Facebook Conversions API
```

## Facebook Event Structure

### Main Purchase Event

```javascript
{
  event_name: "Purchase",
  event_time: 1736936445, // Unix timestamp
  event_id: "1736936445123-abc123def", // For deduplication
  event_source_url: "https://shop.oracleboxing.com/success",
  action_source: "website",

  user_data: {
    client_ip_address: "203.0.113.42",
    client_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    em: ["7d4c7c93a..."], // Hashed email (SHA-256)
    ph: ["8f3a2b94d..."], // Hashed phone (SHA-256)
    fbc: "fb.1.1736936445123.IwAR1234567890" // Facebook Click ID
  },

  custom_data: {
    // Order information
    value: 197.00,
    currency: "USD",
    content_ids: ["prod_6WC", "prod_RecordingsVault"],
    content_type: "product",
    num_items: 2,
    contents: [
      {
        id: "prod_6WC",
        quantity: 1,
        item_price: 197.00
      },
      {
        id: "prod_RecordingsVault",
        quantity: 1,
        item_price: 67.00
      }
    ],

    // Cookie tracking data (if user accepted cookies)
    session_id: "session_1736936445123_abc123",
    event_id: "1736936445123-abc123def",

    // First-touch attribution
    first_utm_source: "facebook",
    first_utm_medium: "cpc",
    first_utm_campaign: "summer-promo",
    first_utm_content: "ad-variant-a",
    first_referrer: "https://facebook.com",
    first_page: "/",
    first_touch_timestamp: "1736936445123",

    // Last-touch attribution
    last_utm_source: "email",
    last_utm_medium: "newsletter",
    last_utm_campaign: "weekly-update",
    last_utm_content: "cta-button",
    last_referrer: "https://email-client.com",
    last_touch_timestamp: "1736937845123",

    // Location data
    location: "{\"city\":\"New York\",\"country\":\"US\",\"region\":\"NY\",...}",

    // Consent
    consent: "true",
    consent_timestamp: "1736936445123"
  }
}
```

### Upsell Purchase Event

```javascript
{
  event_name: "Purchase",
  event_time: 1736936545,
  event_id: "server_upsell_pi_1AbC2dEfGhI3jKlM", // Unique for upsell
  event_source_url: "https://shop.oracleboxing.com/success",
  action_source: "website",

  user_data: {
    client_ip_address: "203.0.113.42",
    client_user_agent: "Mozilla/5.0...",
    em: ["7d4c7c93a..."], // Hashed email
    fbc: "fb.1.1736936545000.IwAR1234567890"
  },

  custom_data: {
    // Upsell order information
    value: 97.00,
    currency: "USD",
    content_ids: ["prod_MembershipMonthly"],
    content_type: "product",
    num_items: 1,
    contents: [
      {
        id: "prod_MembershipMonthly",
        quantity: 1,
        item_price: 97.00
      }
    ],

    // Same cookie tracking data as main purchase
    session_id: "session_1736936445123_abc123",
    first_utm_source: "facebook",
    // ... all attribution and location data
  }
}
```

## Key Features

### 1. Event Deduplication

**Problem**: Browser-side and server-side events can cause duplicate counting.

**Solution**: Use the same `event_id` for both browser and server events.

```javascript
// Browser-side (on success page)
fbq('track', 'Purchase', {...}, { eventID: '1736936445123-abc123def' });

// Server-side (webhook handler)
event_id: '1736936445123-abc123def' // Same ID from Stripe metadata
```

Facebook automatically deduplicates events with the same `event_id` within a 48-hour window.

### 2. Customer Data Hashing

All customer PII is hashed with SHA-256 before sending to Facebook:

```javascript
// Email hashing
"john.doe@example.com" → (lowercase, trim, SHA-256) → "7d4c7c93a5e4..."

// Phone hashing
"+1 (234) 567-8900" → (strip non-numeric, SHA-256) → "8f3a2b94d1c2..."
```

This enables Facebook to match conversions to users while protecting privacy.

### 3. Cookie Data Integration

When users accept cookies, all tracking data is automatically included:

**Attribution Data**:
- First-touch: Where the customer first came from
- Last-touch: Where they came from just before purchasing
- All UTM parameters preserved across the journey

**Location Data**:
- City, country, region, postal code
- Timezone, latitude/longitude
- Enables geo-based optimization

**Session Data**:
- Session ID for cross-device tracking
- Event ID for deduplication
- Timestamps for journey analysis

### 4. Test Event Code

All events include `test_event_code: "TEST85396"` for:
- ✅ Testing in Facebook Events Manager
- ✅ Verifying events before going live
- ✅ Debugging event data quality
- ✅ Checking deduplication

**View test events**: Facebook Events Manager → Test Events → Filter by "TEST85396"

## Configuration

### Environment Variables

Required in `.env` or hosting platform:

```bash
NEXT_PUBLIC_FB_PIXEL_ID=1474540100541059
FB_ACCESS_TOKEN=EAA2BabZBcKN4BP7zdm7E...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Facebook Setup

1. **Events Manager**: https://business.facebook.com/events_manager
2. **Navigate to**: Your Pixel → Settings → Conversions API
3. **Verify**:
   - Access token is valid
   - Test events are appearing
   - Deduplication is working (Event Match Quality score)

### Stripe Setup

1. **Webhooks**: https://dashboard.stripe.com/webhooks
2. **Add endpoint**: https://shop.oracleboxing.com/api/stripe-webhook
3. **Select events**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. **Copy webhook secret** to `STRIPE_WEBHOOK_SECRET`

## Data Flow Diagram

```
┌─────────────────┐
│   Customer      │
│  Completes      │
│  Purchase       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Stripe Sends   │
│  Webhook Event  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Webhook Handler                │
│  /api/stripe-webhook/route.ts  │
│                                 │
│  1. Verify signature            │
│  2. Retrieve expanded session   │
│  3. Parse cookie data           │
│  4. Build comprehensive event   │
└────┬──────────────────┬─────────┘
     │                  │
     ▼                  ▼
┌─────────────┐  ┌──────────────┐
│  Make.com   │  │  Facebook    │
│  Webhook    │  │  CAPI        │
│             │  │              │
│  Order data │  │  Purchase    │
│  + tracking │  │  event with  │
│             │  │  attribution │
└─────────────┘  └──────────────┘
```

## What Gets Sent to Facebook

### Standard Purchase Data
- ✅ Order value and currency
- ✅ Product IDs and quantities
- ✅ Product prices
- ✅ Number of items
- ✅ Content type

### Customer Matching Data
- ✅ Hashed email (SHA-256)
- ✅ Hashed phone (SHA-256)
- ✅ Client IP address
- ✅ User agent string
- ✅ Facebook Click ID (fbc)

### Attribution Data (when cookies accepted)
- ✅ Session ID and Event ID
- ✅ First-touch UTM parameters
- ✅ Last-touch UTM parameters
- ✅ First and last referrers
- ✅ First page visited
- ✅ Touch timestamps

### Location Data (when cookies accepted)
- ✅ City, country, region
- ✅ Postal code
- ✅ Timezone
- ✅ Coordinates (lat/long)

### Consent Data
- ✅ Cookie consent status
- ✅ Consent timestamp

## Benefits

### 1. Improved Ad Attribution
- Multi-touch attribution (first + last touch)
- Understand full customer journey
- Optimize campaigns based on true conversion path

### 2. Better Audience Targeting
- Enhanced customer matching with hashed PII
- Geo-targeting with location data
- Lookalike audiences based on actual purchasers

### 3. Higher Event Match Quality
Facebook's Event Match Quality score improves with:
- ✅ Customer information (email, phone)
- ✅ Browser data (IP, user agent)
- ✅ Facebook parameters (fbc)
- ✅ Event deduplication

### 4. CAPI Reliability
Server-side events aren't affected by:
- ❌ Ad blockers
- ❌ Browser privacy settings
- ❌ iOS 14.5+ tracking restrictions
- ❌ Cookie deletion

## Monitoring & Debugging

### Facebook Events Manager

**View all events**:
1. Go to Events Manager
2. Select your Pixel
3. View "Overview" tab for event counts
4. Click "Test Events" to see TEST85396 events

**Check Event Match Quality**:
1. Navigate to "Diagnostics" tab
2. Look for "Event Match Quality" score
3. Aim for 6.0+ (Good) or 8.0+ (Great)
4. Review suggestions to improve score

### Server Logs

Check webhook handler logs for:

```bash
✅ Success indicators:
"📊 Sending Purchase to Facebook CAPI"
"✅ Facebook CAPI Purchase success"
"✅ Facebook CAPI Upsell Purchase success"

❌ Error indicators:
"❌ Facebook CAPI Purchase error"
"Failed to send Purchase to Facebook CAPI"
"Failed to hash email for Facebook CAPI"
```

### Stripe Dashboard

**Webhook delivery logs**:
1. Go to Developers → Webhooks
2. Click on your webhook endpoint
3. View "Events" tab for delivery status
4. Click individual events to see request/response

### Common Issues

**❌ Events not appearing in Facebook**:
- Check FB_ACCESS_TOKEN is valid
- Verify NEXT_PUBLIC_FB_PIXEL_ID matches your Pixel
- Check webhook is receiving events in Stripe
- Review server logs for Facebook API errors

**❌ Low Event Match Quality**:
- Ensure email/phone are being hashed correctly
- Verify fbclid is being captured and sent
- Check client IP is being forwarded correctly
- Confirm user_agent is present

**❌ Duplicate events**:
- Verify same event_id is used browser + server
- Check deduplication is working in Facebook
- Review Event Match Quality for duplicates indicator

**❌ Cookie data missing**:
- Confirm user accepted cookies before checkout
- Verify ob_track cookie is set correctly
- Check cookie_data is in Stripe metadata
- Review JSON parsing in webhook handler

## Testing

### Test a Purchase

1. **Use Stripe test mode**:
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

2. **Complete a test checkout**:
   - Fill in customer details
   - Complete payment
   - Reach success page

3. **Verify in Facebook**:
   - Go to Events Manager → Test Events
   - Filter by "TEST85396"
   - Look for Purchase event
   - Check event details and match quality

4. **Check webhook logs**:
   - Review server logs for success messages
   - Verify cookie data was included
   - Check event_id was sent

### Test Event Deduplication

1. Complete a test purchase
2. Check browser console for event_id
3. Check server logs for same event_id
4. Wait 5 minutes
5. Facebook Events Manager should show:
   - 1 Purchase event (not 2)
   - "Matched with browser event" indicator

## Implementation Details

**Success Page Component**: `/opt/shop/components/SuccessContent.tsx`

**Purchase Event Handler**:
- Triggered on success page load
- Fetches session data from Stripe via `/api/session`
- Extracts cookie tracking data from browser
- Sends browser-side Facebook Pixel Purchase event with event_id
- Sends server-side Facebook CAPI Purchase event via `/api/facebook-purchase`
- Sends purchase data to Make.com webhook

**API Endpoint**: `/opt/shop/app/api/facebook-purchase/route.ts`

**CAPI Handler**:
- Receives Purchase event data from success page
- Hashes customer PII (email, phone) with SHA-256
- Builds comprehensive Facebook event with cookie data
- Sends to Facebook CAPI with TEST85396

**Session API**: `/opt/shop/app/api/session/route.ts`

**Session Data Retrieval**:
- Retrieves Stripe checkout session
- Expands line items with product details
- Returns full session data for Purchase tracking

**Security**:
- PII hashing (SHA-256)
- Secure token handling
- Browser-based execution on success page

**Error Handling**:
- Try-catch blocks prevent page failures
- Detailed error logging
- Non-blocking (doesn't prevent page display)

## Related Documentation

- [Make.com Webhook Payload Guide](./MAKE_WEBHOOK_PAYLOAD_GUIDE.md)
- [Metadata Tracking Summary](./METADATA_TRACKING_SUMMARY.md)
- [Facebook Conversions API Docs](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Event Deduplication Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)
