# Oracle Boxing Checkout Flow Reference

**Complete documentation for the Oracle Boxing checkout system, product matrix, and upsell logic.**

Last updated: 2025-10-23

---

## Table of Contents

1. [Product Catalog](#product-catalog)
2. [Funnel Architecture](#funnel-architecture)
3. [Add-On Logic](#add-on-logic)
4. [Upsell & Downsell Logic](#upsell--downsell-logic)
5. [Price ID Selection](#price-id-selection)
6. [Metadata Reference](#metadata-reference)
7. [Checkout Flow Diagrams](#checkout-flow-diagrams)
8. [Implementation Examples](#implementation-examples)

---

## Product Catalog

### Core Entry Products

| Product | ID | Metadata | Product ID | Price ID (USD) | Price |
|---------|-----|----------|------------|----------------|-------|
| **6-Week Challenge** | `6wc` | `6wc` | `prod_THsxtrkuzFgwk6` | `price_1SLLGdQNEdHwdojXuQpghdfH` | $197 |

### Core Courses

| Product | ID | Metadata | Product ID | Price ID (USD) | Price |
|---------|-----|----------|------------|----------------|-------|
| **Boxing Masterclass** | `bffp` | `bffp` | `prod_THsl9Np6lVlAPp` | `price_1SLLMGQNEdHwdojXcJB9yqAt` | $297 |
| **Boxing Roadmap** | `roadmap` | `brdmp` | `prod_THsnVY468QZZqW` | `price_1SLLNdQNEdHwdojXYN9j0mFy` | $147 |
| **Boxing Clinic Replays** | `vault` | `clnc` | `prod_THso4C0K2pcDZe` | `price_1SLLQNQNEdHwdojXR5ubxHB4` | $97 |
| **Oracle Boxing Bundle (Bundle)** | `bundle` | `obm` | `prod_THsui65fQm9N6o` | `price_1SLLSAQNEdHwdojXPF01j36I` | $397 |

### Add-On Products

| Product | ID | Metadata | Product ID | Price ID (USD) | Price |
|---------|-----|----------|------------|----------------|-------|
| **Recordings Vault** | `recordings-vault` | `rcv` | `prod_THtRqY17sSwQJJ` | `price_1SLLIKQNEdHwdojXkxUeIDwA` | $97 |
| **Lifetime Access to BFFP** | `lifetime-bffp` | `ltbffp` | `prod_THtTT54jtb1l9c` | `price_1SLLJlQNEdHwdojXKgVggogM` | $147 |
| **6-Week Membership** | `6wm` | `6wm` | `prod_THvKZVW9MTpheP` | `price_1SLLTqQNEdHwdojXsQKz5qSZ` | $97 |
| **Lifetime All (Monthly Member)** | `lifetime-all-monthly` | `ltall_297` | `prod_THtXlTjbNn8FXP` | `price_1SLLWbQNEdHwdojXAmcEYocG` | $297 |
| **Lifetime All (Committed Member)** | `lifetime-all-committed` | `ltall_197` | `prod_THtXlTjbNn8FXP` | `price_1SLLW7QNEdHwdojX86z2xJW4` | $197 |

### Memberships (USD Only)

| Product | ID | Metadata | Product ID | Price ID | Price |
|---------|-----|----------|------------|----------|-------|
| **Monthly Membership** | `membership-monthly` | `memm` | `prod_THsviAkmOBiKx4` | `price_1SLJ9jQNEdHwdojXeX6HtBU3` | $97/mo |
| **6-Month Membership** | `membership-6month` | `mem6` | `prod_THswn4xZOpBq9I` | `price_1SLJAFQNEdHwdojXB8mVV0go` | $497 |
| **Annual Membership** | `membership-annual` | `mema` | `prod_THswGwVGj2TmU8` | `price_1SLJAxQNEdHwdojXZzyfxEtf` | $897 |

### Premium Upsells

| Product | ID | Metadata | Product ID | Price ID (USD-Only) | Price ID (Multi) | Price |
|---------|-----|----------|------------|---------------------|------------------|-------|
| **1-on-1 Coaching** | `1on1-coaching` | `coach1` | `prod_THuQf0h3DatQUL` | `price_1SLLX4QNEdHwdojXfZImwLss` | `price_1SLLY7QNEdHwdojXVriclpjV` | $397 |
| **1-on-1 Vault** | `1on1-vault` | `coach_archive` | `prod_THtSgSl2rHdu8X` | `price_1SLJtyQNEdHwdojXpNn9LvDH` | — | $67 |

---

## Funnel Architecture

### Overview

The Oracle Boxing funnel is designed to maximize AOV (Average Order Value) and LTV (Lifetime Value) through strategic add-ons and upsells at different stages of the customer journey.

### Funnel Stages

```
1. Entry → 2. Add-Ons (Order Bumps) → 3. Checkout → 4. Success → 5. Upsells/Downsells
```

---

## Add-On Logic

**Add-ons are presented BEFORE checkout (order bump page).**

### 6-Week Challenge Funnel

**Entry Product:** 6-Week Challenge ($197)

**Add-Ons:**
1. **Recordings Vault** ($97)
   - Full archive of all coaching call replays
   - Updated weekly
   - Perfect for visual learners

2. **Lifetime Access to BFFP** ($147)
   - Keep permanent access after challenge ends
   - Access all future updates
   - Continue learning at your own pace

**Logic:**
- User enters email/name → redirected to order bumps page
- Shown both add-ons with "Add to Order" buttons
- Can add 0, 1, or both
- Proceeds to Stripe checkout with selected items

**Implementation:**
```typescript
// Get 6WC add-ons
import { get6WCAddOns } from '@/lib/products'
const addOns = get6WCAddOns() // Returns Recordings Vault + Lifetime BFFP
```

### Membership Funnel

**Entry Products:** Monthly ($97/mo), 6-Month ($497), Annual ($897)

**Add-Ons:**
- **Lifetime Access (All Courses)**
  - Monthly members: $297
  - 6-Month/Annual members: $197 (discounted)

**Logic:**
- Membership subscribers can purchase lifetime course access
- Tiered pricing based on membership commitment level
- Permanent access even if they cancel membership

**Implementation:**
```typescript
// Get membership add-ons based on tier
import { getMembershipAddOns } from '@/lib/products'
const addOns = getMembershipAddOns('monthly') // Returns ltall_297
const addOns = getMembershipAddOns('6month') // Returns ltall_197
const addOns = getMembershipAddOns('annual') // Returns ltall_197
```

### Course Funnel

**Entry Products:** BFFP ($297), Roadmap ($147), Clinic ($97)

**Cross-Sell:** Oracle Boxing Method Bundle ($397)

**Logic:**
- Individual course purchasers see bundle cross-sell
- Shows savings vs buying individually ($144 savings)
- Presented as "upgrade to full system"

**Implementation:**
```typescript
// Get course upsells
import { getCourseUpsells } from '@/lib/products'
const upsells = getCourseUpsells() // Returns OBM bundle + 1-on-1 Coaching
```

### Bundle Funnel

**Entry Product:** Oracle Boxing Method ($397)

**Add-On:** 6-Week Membership ($97)

**Logic:**
- Bundle purchasers can add temporary membership trial
- Experience live coaching without long-term commitment
- Gateway to full membership conversion

**Implementation:**
```typescript
// Get bundle upsells
import { getBundleUpsells } from '@/lib/products'
const upsells = getBundleUpsells() // Returns 6wm + coach1
```

---

## Upsell & Downsell Logic

**Upsells/downsells are presented AFTER successful checkout (post-purchase).**

### 6-Week Challenge

**Upsell:** None
**Downsell:** None

**Reason:** Maintain refund clarity. No post-purchase friction.

### Memberships

**Upsell:** 1-Month 1-on-1 Coaching ($397, USD-only price)
**Downsell:** None

**Logic:**
- After membership purchase, offer personalized coaching
- Use USD-only price ID: `price_1SLLX4QNEdHwdojXfZImwLss`
- Membership users are typically USD-based

**Trigger Conditions:**
```typescript
if (purchase.includes('membership-monthly') ||
    purchase.includes('membership-6month') ||
    purchase.includes('membership-annual')) {
  showUpsell('1on1-coaching', 'usd_membership_upsell')
}
```

### Courses (BFFP, Roadmap, Clinic)

**Upsell:** 1-Month 1-on-1 Coaching ($397, multi-currency)
**Downsell:** 6-Week Membership ($97)

**Logic:**
1. First, offer 1-on-1 coaching (multi-currency price)
2. If declined, offer 6-Week Membership as softer commitment
3. Use multi-currency price ID: `price_1SLLY7QNEdHwdojXVriclpjV`

**Trigger Conditions:**
```typescript
if (purchase.includes('bffp') ||
    purchase.includes('roadmap') ||
    purchase.includes('vault')) {
  // Show 1-on-1 coaching upsell first
  showUpsell('1on1-coaching', 'multicurrency')

  // If declined, show 6-week membership downsell
  onDecline(() => showDownsell('6wm'))
}
```

### Bundle (Oracle Boxing Method)

**Upsell:** 1-Month 1-on-1 Coaching ($397, multi-currency)
**Downsell:** None

**Logic:**
- Bundle purchasers are serious, offer premium coaching
- Use multi-currency price ID for global accessibility
- No downsell (bundle already includes everything)

**Trigger Conditions:**
```typescript
if (purchase.includes('bundle')) {
  showUpsell('1on1-coaching', 'multicurrency')
}
```

---

## Price ID Selection

### Multi-Currency Products

**Currencies Supported:** USD, GBP, EUR, AUD, CAD, AED

**Products with Multi-Currency:**
- All courses (6WC, BFFP, Roadmap, Clinic, Bundle)
- All add-ons (Recordings Vault, Lifetime BFFP, 6-Week Membership, 1-on-1 Vault)
- 1-on-1 Coaching (when used as course upsell)

**Price ID Structure:**
```typescript
// Example: BFFP multi-currency
{
  usd: 'price_1SLLMGQNEdHwdojXcJB9yqAt',
  gbp: 'price_...',
  eur: 'price_...',
  aud: 'price_...',
  cad: 'price_...',
  aed: 'price_...'
}
```

**Selection Logic:**
```typescript
function selectPriceId(product: Product, currency: string = 'usd'): string {
  // Check if multi-currency price IDs exist
  if (product.price_ids && product.price_ids[currency]) {
    return product.price_ids[currency]
  }

  // Fallback to default USD price ID
  return product.stripe_price_id
}
```

### USD-Only Products

**Products USD-Only:**
- All memberships (Monthly, 6-Month, Annual)
- Lifetime Access (All Courses) - Both tiers
- 1-on-1 Coaching (when used as membership upsell)

**Reason:** Memberships are recurring and simpler to manage in single currency.

### 1-on-1 Coaching Special Case

**Two Price IDs:**
1. **USD-Only:** `price_1SLLX4QNEdHwdojXfZImwLss`
   - Use for: Membership upsells
   - Reason: Membership users are typically USD

2. **Multi-Currency:** `price_1SLLY7QNEdHwdojXVriclpjV`
   - Use for: Course upsells
   - Reason: Global course customers need local currency

**Selection Logic:**
```typescript
function select1on1CoachingPriceId(context: 'membership' | 'course'): string {
  const product = getProductByMetadata('coach1')

  if (context === 'membership') {
    // Use USD-only for membership upsells
    return product.price_ids.usd_membership_upsell
  }

  // Use multi-currency for course upsells
  return product.price_ids.multicurrency
}
```

---

## Metadata Reference

**Metadata keys are used for quick product lookup and funnel logic.**

### Metadata Mapping

```typescript
// Core products
'6wc'         → 6-Week Challenge
'bffp'        → Boxing Masterclass
'brdmp'       → Boxing Roadmap
'clnc'        → Boxing Clinic Replays
'obm'         → Oracle Boxing Bundle (Bundle)

// Add-ons
'rcv'         → Recordings Vault
'ltbffp'      → Lifetime Access to BFFP
'6wm'         → 6-Week Membership
'ltall_297'   → Lifetime All (Monthly Member)
'ltall_197'   → Lifetime All (Committed Member)

// Memberships
'memm'        → Monthly Membership
'mem6'        → 6-Month Membership
'mema'        → Annual Membership

// Premium
'coach1'      → 1-Month 1-on-1 Coaching
'coach_archive' → 1-on-1 Coaching Recordings Vault
```

### Helper Functions

```typescript
// Get product by metadata
getProductByMetadata('bffp')      // Returns BFFP product
getProductByMetadata('coach1')    // Returns 1-on-1 Coaching

// Get add-ons by funnel
get6WCAddOns()                    // Returns rcv + ltbffp
getMembershipAddOns('monthly')    // Returns ltall_297
getMembershipAddOns('6month')     // Returns ltall_197
getCourseUpsells()                // Returns obm + coach1
getBundleUpsells()                // Returns 6wm + coach1
```

---

## Checkout Flow Diagrams

### 6-Week Challenge Flow

```
User visits /6wc
    ↓
Clicks "Start Challenge" CTA
    ↓
Redirected to /checkout
    ↓
Enters Email + Name
    ↓
Redirected to /checkout/order-bumps
    ↓
Sees:
  - Recordings Vault ($97) [Add]
  - Lifetime BFFP Access ($147) [Add]
    ↓
Selects desired add-ons (0, 1, or both)
    ↓
Clicks "Continue to Payment"
    ↓
API creates Stripe session with:
  - 6-Week Challenge ($197)
  - + Selected add-ons
    ↓
Redirected to Stripe Checkout
    ↓
Payment Success
    ↓
Redirected to /success
    ↓
No post-purchase upsells
```

### Course Purchase Flow (BFFP, Roadmap, or Clinic)

```
User adds course to cart
    ↓
Proceeds to /checkout
    ↓
Enters Email + Name
    ↓
Redirected to /checkout/order-bumps
    ↓
Sees cross-sell:
  - Oracle Boxing Method Bundle ($397)
    ↓
Optionally adds bundle
    ↓
API creates Stripe session
    ↓
Stripe Checkout
    ↓
Payment Success
    ↓
Redirected to /success
    ↓
[POST-PURCHASE UPSELL]
Shows: 1-Month 1-on-1 Coaching ($397, multi-currency)
    ↓
If ACCEPTED → Purchase 1-on-1 coaching
If DECLINED → Show 6-Week Membership downsell ($97)
    ↓
If ACCEPTED → Purchase 6-week membership
If DECLINED → End flow
```

### Membership Flow

```
User visits /membership
    ↓
Selects tier (Monthly, 6-Month, or Annual)
    ↓
Proceeds to /checkout
    ↓
Sees add-on:
  - Lifetime Access (All Courses)
    - Monthly: $297
    - 6M/Annual: $197
    ↓
Optionally adds lifetime access
    ↓
Stripe Checkout (recurring)
    ↓
Payment Success
    ↓
[POST-PURCHASE UPSELL]
Shows: 1-Month 1-on-1 Coaching ($397, USD-only)
    ↓
If ACCEPTED → Purchase coaching
If DECLINED → End flow
```

### Bundle Flow

```
User visits /courses/bundle
    ↓
Clicks "I Want Access" CTA
    ↓
Adds bundle to cart
    ↓
Proceeds to /checkout
    ↓
Sees add-on:
  - 6-Week Membership ($97)
    ↓
Optionally adds 6-week membership
    ↓
Stripe Checkout
    ↓
Payment Success
    ↓
[POST-PURCHASE UPSELL]
Shows: 1-Month 1-on-1 Coaching ($397, multi-currency)
    ↓
If ACCEPTED → Purchase coaching
If DECLINED → End flow
```

---

## Implementation Examples

### Example 1: Order Bumps Page for 6WC

```typescript
import { get6WCAddOns } from '@/lib/products'

export default function OrderBumpsPage() {
  const addOns = get6WCAddOns()
  // addOns = [Recordings Vault, Lifetime BFFP]

  return (
    <div>
      {addOns.map(product => (
        <OrderBumpCard
          key={product.id}
          product={product}
          onAdd={() => addToOrder(product)}
        />
      ))}
    </div>
  )
}
```

### Example 2: Post-Purchase Upsell for Course

```typescript
import { getProductByMetadata } from '@/lib/products'

async function showCourseUpsell(purchasedProduct: string) {
  // Get 1-on-1 coaching product
  const coaching = getProductByMetadata('coach1')

  // Use multi-currency price for course upsells
  const priceId = coaching.price_ids.multicurrency

  // Show upsell modal
  const accepted = await showUpsellModal({
    product: coaching,
    priceId: priceId,
  })

  if (!accepted) {
    // Show 6-week membership downsell
    const membership = getProductByMetadata('6wm')
    await showDownsellModal({
      product: membership,
      priceId: membership.stripe_price_id,
    })
  }
}
```

### Example 3: Membership Upsell

```typescript
import { getProductByMetadata } from '@/lib/products'

async function showMembershipUpsell() {
  const coaching = getProductByMetadata('coach1')

  // Use USD-only price for membership upsells
  const priceId = coaching.price_ids.usd_membership_upsell

  const accepted = await showUpsellModal({
    product: coaching,
    priceId: priceId,
  })

  // No downsell for memberships
}
```

### Example 4: Dynamic Pricing Based on Currency

```typescript
function selectPriceId(product: Product, userCurrency: string): string {
  // Check if product supports multi-currency
  if (product.price_ids && product.price_ids[userCurrency]) {
    return product.price_ids[userCurrency]
  }

  // Fallback to USD
  return product.stripe_price_id
}

// Usage
const bffp = getProductByMetadata('bffp')
const priceId = selectPriceId(bffp, 'gbp') // Returns GBP price ID
```

---

## Stripe Checkout Session Metadata

**Every checkout session should include metadata for tracking and analytics.**

### Standard Metadata Fields

```typescript
{
  // Customer info
  customer_first_name: string,
  customer_last_name: string,
  customer_email: string,

  // Funnel tracking
  funnel_type: '6wc' | 'course' | 'membership' | 'bundle',
  entry_product: string, // metadata key of main product
  add_ons_included: string, // comma-separated metadata keys

  // Attribution
  utm_source?: string,
  utm_medium?: string,
  utm_campaign?: string,

  // Cart info
  cart_items: string, // JSON stringified array
}
```

### Example Metadata Creation

```typescript
function createCheckoutMetadata(items: CartItem[], customerInfo: any) {
  const mainProduct = items[0].product
  const addOns = items.slice(1).map(i => i.product.metadata).join(',')

  return {
    customer_first_name: customerInfo.firstName,
    customer_last_name: customerInfo.lastName,
    customer_email: customerInfo.email,
    funnel_type: determineFunnelType(mainProduct),
    entry_product: mainProduct.metadata || mainProduct.id,
    add_ons_included: addOns,
    cart_items: JSON.stringify(items.map(i => ({
      id: i.product.id,
      metadata: i.product.metadata,
      quantity: i.quantity,
      price: i.product.price,
    }))),
  }
}
```

---

## Currency Detection & Selection

### Automatic Currency Detection

```typescript
async function detectUserCurrency(): Promise<string> {
  try {
    // Option 1: Use IP-based geolocation
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()

    // Map country to currency
    const currencyMap = {
      'GB': 'gbp',
      'US': 'usd',
      'AU': 'aud',
      'CA': 'cad',
      'AE': 'aed',
      // EU countries
      'DE': 'eur',
      'FR': 'eur',
      'IT': 'eur',
      'ES': 'eur',
      'NL': 'eur',
    }

    return currencyMap[data.country_code] || 'usd'
  } catch (error) {
    // Fallback to USD
    return 'usd'
  }
}
```

### Manual Currency Selection

```typescript
// Currency selector component
function CurrencySelector({ onSelect }: { onSelect: (currency: string) => void }) {
  const currencies = [
    { code: 'usd', label: 'USD ($)', flag: '🇺🇸' },
    { code: 'gbp', label: 'GBP (£)', flag: '🇬🇧' },
    { code: 'eur', label: 'EUR (€)', flag: '🇪🇺' },
    { code: 'aud', label: 'AUD (A$)', flag: '🇦🇺' },
    { code: 'cad', label: 'CAD (C$)', flag: '🇨🇦' },
    { code: 'aed', label: 'AED (د.إ)', flag: '🇦🇪' },
  ]

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      {currencies.map(c => (
        <option key={c.code} value={c.code}>
          {c.flag} {c.label}
        </option>
      ))}
    </select>
  )
}
```

---

## Analytics & Tracking

### Key Metrics to Track

1. **Funnel Conversion Rates**
   - Entry → Order Bumps
   - Order Bumps → Checkout
   - Checkout → Payment Success
   - Success → Upsell Accepted

2. **Add-On Attachment Rates**
   - % of 6WC customers adding Recordings Vault
   - % of 6WC customers adding Lifetime BFFP
   - % of members adding Lifetime Access

3. **Upsell Performance**
   - 1-on-1 Coaching acceptance rate by funnel
   - 6-Week Membership downsell acceptance rate
   - Average Order Value (AOV) by funnel

4. **Currency Distribution**
   - % of customers by currency
   - AOV by currency
   - Conversion rate by currency

### Tracking Implementation

```typescript
// Track order bump selection
function trackOrderBumpSelection(product: Product, selected: boolean) {
  analytics.track('Order Bump Selection', {
    product_id: product.id,
    product_metadata: product.metadata,
    product_name: product.title,
    product_price: product.price,
    selected: selected,
  })
}

// Track upsell shown
function trackUpsellShown(product: Product, context: string) {
  analytics.track('Upsell Shown', {
    product_id: product.id,
    product_metadata: product.metadata,
    context: context, // 'course' or 'membership'
    price_id: product.stripe_price_id,
  })
}

// Track upsell response
function trackUpsellResponse(product: Product, accepted: boolean) {
  analytics.track('Upsell Response', {
    product_id: product.id,
    product_metadata: product.metadata,
    accepted: accepted,
  })
}
```

---

## Troubleshooting

### Common Issues

**Issue: Wrong price ID being used**
- Check if product supports multi-currency
- Verify currency parameter matches available currencies
- Ensure fallback to USD price ID

**Issue: Add-ons not showing for specific funnel**
- Verify helper function is returning correct products
- Check metadata keys match expected values
- Ensure products exist in products array

**Issue: Upsell showing wrong price**
- Check context (membership vs course)
- Verify correct price_ids object key being used
- For 1-on-1 coaching, ensure using correct variant

**Issue: Metadata not being tracked**
- Verify metadata field exists on product
- Check createCheckoutSession includes metadata
- Ensure metadata is being passed to Stripe

---

## Future Enhancements

### Potential Additions

1. **Dynamic Pricing**
   - PPP (Purchasing Power Parity) adjustments
   - Seasonal discounts
   - Volume pricing for multiple courses

2. **Smart Upsells**
   - ML-based recommendation engine
   - Personalized upsells based on user behavior
   - A/B testing different upsell sequences

3. **Subscription Management**
   - Self-service upgrade/downgrade
   - Pause subscription feature
   - Loyalty discounts for long-term members

4. **Enhanced Analytics**
   - Cohort analysis
   - Lifetime value prediction
   - Churn risk scoring

---

**End of Checkout Flow Reference**

For questions or clarifications, contact: team@oracleboxing.com
