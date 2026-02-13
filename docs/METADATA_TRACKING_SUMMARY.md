# Metadata Tracking Summary

All products (6WC, Memberships, 1-on-1 Coaching) now include rich metadata across Stripe objects.

## Metadata Structure (Standardized Across All Products)

### Customer Information
- `customer_first_name`: First name parsed from full name
- `customer_last_name`: Last name parsed from full name
- `customer_email`: Customer email address
- `customer_phone`: Customer phone number (if available)

### Funnel Tracking
- `funnel_type`: Type of funnel (6wc, membership, course, bundle, upsell)
- `type`: Purchase type (6wc, membership, course, coaching)
- `entry_product`: Product ID or metadata identifier
- `add_ons_included`: Comma-separated list of add-on products (for main checkout)

### Product Details
- `product_name`: Human-readable product name
- `product_id`: Stripe product ID
- `price_id`: Stripe price ID (for upsells)

### Upsell-Specific Tracking
- `source`: "upsell" for upsell purchases
- `original_session_id`: Reference to original purchase session
- `upsell_type`: Type of upsell (coaching, membership)
- `is_membership_upsell`: Boolean indicating if upsell is for membership buyers

### Cart Information
- `cart_items`: JSON string of cart items with IDs, quantities, and prices

### Tracking Parameters (UTM & Referrer)
- `referrer`: Referrer URL or "direct"
- `utm_source`: UTM source parameter
- `utm_medium`: UTM medium parameter
- `utm_campaign`: UTM campaign parameter
- `utm_term`: UTM term parameter
- `utm_content`: UTM content parameter
- `fbclid`: Facebook click ID
- `session_id`: Analytics session ID
- `event_id`: Analytics event ID

## Implementation Locations

### Main Checkout (`/lib/stripe/checkout.ts`)
**Metadata attached to:**
1. **Session metadata** (lines 167-200)
2. **Payment Intent metadata** (lines 257-290) - for one-time payments
3. **Subscription metadata** (lines 294-329) - for recurring memberships

### Coaching Upsell API (`/app/api/upsell/coaching/route.ts`)
**Metadata attached to:**
1. **Session metadata** (lines 47-74)
2. **Payment Intent metadata** (lines 76-107)

### Charge API (`/app/api/upsell/charge/route.ts`)
**Metadata attached to:**
1. **Subscription metadata** (lines 138-168) - for recurring products
2. **Payment Intent metadata** (lines 183-214) - for one-time payments

## Consistency Benefits

✅ **Complete customer attribution**: Every purchase includes customer details
✅ **Full funnel tracking**: Track customer journey from initial visit to purchase
✅ **UTM preservation**: All marketing attribution data preserved across upsells
✅ **Cross-sell analysis**: Original purchase linked to upsell purchases
✅ **Revenue attribution**: Connect revenue to specific campaigns and sources
✅ **Customer segmentation**: Rich data for segmentation and personalization

## Webhook Processing

When processing webhooks, the following metadata is available on:
- `checkout.session.completed` → session.metadata
- `charge.succeeded` → charge.metadata OR payment_intent.metadata
- `invoice.payment_succeeded` → subscription.metadata
- `payment_intent.succeeded` → payment_intent.metadata

All webhook handlers should extract metadata from the appropriate object based on event type.
