# Oracle Boxing Checkout Flow & Routing Guide

**Last Updated:** 2025-10-23

This document explains exactly how each product purchase flows through the checkout system, which order bumps appear, and which Stripe product/price IDs are used.

---

## Quick Reference: Checkout Routes by Product

| Product Type | Entry Point | Route | Order Bumps Shown | Goes to Stripe |
|-------------|-------------|-------|-------------------|----------------|
| **6-Week Challenge** | `/6wc` | `/checkout` → `/checkout/order-bumps` | Recordings Vault ($97) + Lifetime BFFP ($147) | ✅ After bumps |
| **Individual Course** (BFFP, Roadmap, Vault) | Course page | `/checkout` → `/checkout/order-bumps` | 6-Week Membership ($47) | ✅ After bumps |
| **Bundle** (Oracle Boxing Method) | `/courses/bundle` | `/checkout` → **Direct to Stripe** | None (has everything) | ✅ Immediately |
| **Membership** (1mo, 6mo, 12mo) | `/membership` | `/checkout` → **Direct to Stripe** | None (live coaching is main value) | ✅ Immediately |

---

## Complete Product & Price ID Reference

### Public Products (Displayed on Website)

#### Courses

**Oracle Boxing Bundle (Bundle)**
- **Product ID:** `bundle`
- **Stripe Product ID:** `prod_THsui65fQm9N6o`
- **Stripe Price ID:** `price_1SLLSAQNEdHwdojXPF01j36I`
- **Price:** $397 (originally $541)
- **Metadata:** `obm`
- **Checkout Flow:** Direct to Stripe (no order bumps)

**Boxing Masterclass (BFFP)**
- **Product ID:** `bffp`
- **Stripe Product ID:** `prod_THsl9Np6lVlAPp`
- **Stripe Price ID:** `price_1SLLMGQNEdHwdojXcJB9yqAt`
- **Price:** $197
- **Metadata:** `bffp`
- **Checkout Flow:** Order bumps → 6-Week Membership ($47)

**The Boxing Roadmap**
- **Product ID:** `roadmap`
- **Stripe Product ID:** `prod_THsnVY468QZZqW`
- **Stripe Price ID:** `price_1SLLNdQNEdHwdojXYN9j0mFy`
- **Price:** $97
- **Metadata:** `roadmap`
- **Checkout Flow:** Order bumps → 6-Week Membership ($47)

**Boxing Clinic Replays**
- **Product ID:** `vault`
- **Stripe Product ID:** `prod_THso4C0K2pcDZe`
- **Stripe Price ID:** `price_1SLLQNQNEdHwdojXR5ubxHB4`
- **Price:** $247
- **Metadata:** `vault`
- **Checkout Flow:** Order bumps → 6-Week Membership ($47)

#### Memberships

**1-Month Membership**
- **Product ID:** `membership-monthly`
- **Stripe Product ID:** `prod_THsviAkmOBiKx4`
- **Stripe Price ID:** `price_1SLJ9jQNEdHwdojXeX6HtBU3`
- **Price:** $97/month
- **Metadata:** `mem1`
- **Checkout Flow:** Direct to Stripe (no order bumps)

**6-Month Membership**
- **Product ID:** `membership-6month`
- **Stripe Product ID:** `prod_THsvZzR1JtRjP3`
- **Stripe Price ID:** `price_1SLJAbQNEdHwdojXKRYqUHrq`
- **Price:** $490 (6 months)
- **Metadata:** `mem6`
- **Checkout Flow:** Direct to Stripe (no order bumps)

**Annual Membership**
- **Product ID:** `membership-annual`
- **Stripe Product ID:** `prod_THswUdSaFbkRHi`
- **Stripe Price ID:** `price_1SLJAsQNEdHwdojXdxfHMDyv`
- **Price:** $970/year
- **Metadata:** `mem12`
- **Checkout Flow:** Direct to Stripe (no order bumps)

---

### Internal Products (Checkout Only - Not Displayed Publicly)

#### 6-Week Challenge & Add-Ons

**6-Week Challenge (6WC)**
- **Product ID:** `6wc`
- **Stripe Product ID:** `prod_THsjMmL2L24iTz`
- **Stripe Price ID:** `price_1SLLGdQNEdHwdojXuQpghdfH`
- **Price:** $197
- **Metadata:** `6wc`
- **Checkout Flow:** Order bumps → Recordings Vault + Lifetime BFFP

**Recordings Vault (6WC Add-On)**
- **Product ID:** `vault-addon`
- **Stripe Product ID:** `prod_THskXGzaqYl7pC`
- **Stripe Price ID:** `price_1SLLIKQNEdHwdojXkxUeIDwA`
- **Price:** $97
- **Metadata:** `rcv`
- **Shown As:** Order bump for 6WC

**Lifetime Access to BFFP (6WC Add-On)**
- **Product ID:** `lifetime-bffp`
- **Stripe Product ID:** `prod_THsksL4WXJrgK8`
- **Stripe Price ID:** `price_1SLLJlQNEdHwdojXKgVggogM`
- **Price:** $147
- **Metadata:** `ltbffp`
- **Shown As:** Order bump for 6WC

#### Course Add-Ons

**6-Week Membership (Course Add-On)**
- **Product ID:** `6wm`
- **Stripe Product ID:** `prod_THsxk7TlcV3d5R`
- **Stripe Price ID:** `price_1SLLTqQNEdHwdojXsQKz5qSZ`
- **Price:** $47
- **Metadata:** `6wm`
- **Shown As:** Order bump for individual courses (BFFP, Roadmap, Vault)

**Lifetime All-Access (Tier 1)**
- **Product ID:** `lifetime-all`
- **Stripe Product ID:** `prod_THsm8iLiU0Hl8i`
- **Stripe Price ID:** `price_1SLLKWQNEdHwdojX3Kpf4mQi`
- **Price:** $297
- **Metadata:** `ltall1`
- **Usage:** Future upsell/downsell

**Lifetime All-Access (Tier 2)**
- **Product ID:** `lifetime-all-2`
- **Stripe Product ID:** `prod_THsmpLQRV8TGGj`
- **Stripe Price ID:** `price_1SLLKzQNEdHwdojXGl1AXjvV`
- **Price:** $397
- **Metadata:** `ltall2`
- **Usage:** Future upsell/downsell

#### Coaching Products

**1-on-1 Coaching (Multi-Currency)**
- **Product ID:** `1on1-coaching`
- **Stripe Product ID:** `prod_THuQf0h3DatQUL`
- **Default Price ID (USD):** `price_1SLLX4QNEdHwdojXfZImwLss`
- **Multi-Currency Price ID:** `price_1SLLY7QNEdHwdojXVriclpjV`
- **Price:** $997
- **Metadata:** `coach1`
- **Usage:** Post-purchase upsell (see upsell matrix below)

**1-on-1 Vault Coaching**
- **Product ID:** `1on1-vault`
- **Stripe Product ID:** `prod_THuRMDf9GcwCqp`
- **Stripe Price ID:** `price_1SLLZUQNEdHwdojXlvZCw1YG`
- **Price:** $1,497
- **Metadata:** `coachv`
- **Usage:** Premium post-purchase upsell

---

## Checkout Flow Logic

### Entry Points & Routing

All products route through `/checkout` page which handles the funnel detection:

```typescript
// /checkout/page.tsx

// Case 1: Empty cart (6WC direct from /6wc page)
if (items.length === 0) {
  router.push('/checkout/order-bumps?funnel=6wc')
}

// Case 2: 6WC in cart
if (mainProduct.id === '6wc' || funnelType === '6wc') {
  router.push('/checkout/order-bumps?funnel=6wc')
}

// Case 3: Individual Course (BFFP, Roadmap, Vault)
if (['bffp', 'roadmap', 'vault'].includes(mainProduct.id)) {
  router.push('/checkout/order-bumps?funnel=course&course=PRODUCT_ID')
}

// Case 4: Bundle or Membership → Direct to Stripe
fetch('/api/checkout/session', { items, customerInfo })
  .then(data => window.location.href = data.url)
```

### Order Bumps Page Logic

The `/checkout/order-bumps` page detects funnel type from URL parameters:

```typescript
// /checkout/order-bumps/page.tsx

const funnelParam = searchParams.get('funnel') // '6wc' or 'course'

if (funnelParam === 'course') {
  // Show 6-Week Membership add-on
  setOrderBumps(getMembershipAddOns())
} else {
  // Show Recordings Vault + Lifetime BFFP
  setOrderBumps(get6WCAddOns())
}
```

---

## Cart Context & Price ID Handling

The `CartContext` automatically selects the correct price ID when adding items:

```typescript
// /contexts/CartContext.tsx

const addItem = (product: Product, variant?: MerchVariant) => {
  // Determine price_id
  const price_id = variant ? variant.stripe_price_id : product.stripe_price_id

  // Auto-swap membership tiers
  if (product.type === 'membership') {
    if (product.id === 'membership-annual') {
      // Remove lower tiers
      updatedItems = updatedItems.filter(
        item => item.product.id !== 'membership-monthly' &&
                item.product.id !== 'membership-6month'
      )
    }
  }

  return [...updatedItems, { product, quantity: 1, variant, price_id }]
}
```

---

## Stripe Checkout Session Creation

The `/api/checkout/session` endpoint creates Stripe sessions with correct price IDs:

```typescript
// /api/checkout/session/route.ts

items.forEach((item: CartItem) => {
  console.log(`🔍 DEBUG Item:`, {
    product: item.product.title,
    price_id: item.price_id, // Uses price_id from cart item
    type: item.product.type,
  })
})

const session = await createCheckoutSession({
  items, // Contains correct price_id for each item
  hasPhysicalItems,
  successUrl: `${baseUrl}/success/{CHECKOUT_SESSION_ID}`,
  cancelUrl: `${baseUrl}/`,
  customerInfo,
})
```

---

## Cross-Sell & Upsell Logic

### In-Checkout Cross-Sell (Stripe Adjustable Quantity)

Implemented in `/lib/stripe/checkout.ts`:

```typescript
// If cart contains individual course, recommend Bundle
const hasIndividualCourse = items.some(item =>
  ['bffp', 'roadmap', 'vault'].includes(item.product.id)
)

if (hasIndividualCourse) {
  recommendedProducts.push('price_1SLLSAQNEdHwdojXPF01j36I') // Bundle

  sessionParams.custom_text = {
    submit: {
      message: 'Save $144 by upgrading to the complete system - or remove it to continue'
    }
  }
}
```

### Post-Purchase Upsell Matrix

**Defined in `/lib/stripe/checkout.ts` (lines 208-275)**:

| Purchase | Upsell | Price ID | Downsell |
|----------|--------|----------|----------|
| **6-Week Challenge** | None | N/A | N/A |
| **Memberships** | 1-on-1 Coaching | `price_1SLLX4QNEdHwdojXfZImwLss` (USD only) | None |
| **Courses** (BFFP, Roadmap, Vault) | 1-on-1 Coaching | `price_1SLLY7QNEdHwdojXVriclpjV` (multi-currency) | 6-Week Membership (`price_1SLLTqQNEdHwdojXsQKz5qSZ`) |
| **Bundle** | 1-on-1 Coaching | `price_1SLLY7QNEdHwdojXVriclpjV` (multi-currency) | None |

---

## Metadata Tracking

Every Stripe checkout session includes comprehensive metadata:

```typescript
metadata: {
  // Customer info
  customer_first_name: string,
  customer_last_name: string,
  customer_phone: string,

  // Funnel tracking
  funnel_type: '6wc' | 'course' | 'membership' | 'bundle',
  entry_product: string, // metadata field (e.g., 'bffp', 'obm')
  add_ons_included: string, // comma-separated metadata IDs

  // Cross-sell tracking
  recommended_products: string, // comma-separated price IDs

  // Cart summary
  cart_items: string, // JSON stringified cart
}
```

---

## Testing Checklist

### Test Each Funnel Type

- [ ] **6WC Funnel**
  - [ ] Visit `/6wc`, click "Join Now"
  - [ ] Enter email/name on `/checkout`
  - [ ] See Recordings Vault ($97) + Lifetime BFFP ($147) on order-bumps
  - [ ] Verify Stripe session uses `price_1SLLGdQNEdHwdojXuQpghdfH`

- [ ] **Course Funnel (BFFP)**
  - [ ] Visit `/courses/bffp`, click "ACCESS NOW"
  - [ ] Enter email/name on `/checkout`
  - [ ] See 6-Week Membership ($47) on order-bumps
  - [ ] Verify Stripe session uses `price_1SLLMGQNEdHwdojXcJB9yqAt`

- [ ] **Course Funnel (Roadmap)**
  - [ ] Visit `/courses/roadmap`, click "ACCESS NOW"
  - [ ] Verify same flow as BFFP
  - [ ] Verify Stripe session uses `price_1SLLNdQNEdHwdojXYN9j0mFy`

- [ ] **Course Funnel (Vault)**
  - [ ] Visit `/courses/vault`, click "ACCESS NOW"
  - [ ] Verify same flow as BFFP
  - [ ] Verify Stripe session uses `price_1SLLQNQNEdHwdojXR5ubxHB4`

- [ ] **Bundle Funnel**
  - [ ] Visit `/courses/bundle`, click "ACCESS NOW"
  - [ ] Enter email/name on `/checkout`
  - [ ] Should go DIRECTLY to Stripe (no order bumps)
  - [ ] Verify Stripe session uses `price_1SLLSAQNEdHwdojXPF01j36I`

- [ ] **Membership Funnel (1-Month)**
  - [ ] Visit `/membership`, select 1-Month, click "Join Now"
  - [ ] Enter email/name on `/checkout`
  - [ ] Should go DIRECTLY to Stripe (no order bumps)
  - [ ] Verify Stripe session uses `price_1SLJ9jQNEdHwdojXeX6HtBU3`

- [ ] **Membership Funnel (6-Month)**
  - [ ] Verify same flow
  - [ ] Verify Stripe session uses `price_1SLJAbQNEdHwdojXKRYqUHrq`

- [ ] **Membership Funnel (Annual)**
  - [ ] Verify same flow
  - [ ] Verify Stripe session uses `price_1SLJAsQNEdHwdojXdxfHMDyv`

---

## Key Files

| File | Purpose |
|------|---------|
| `/lib/products.ts` | Master product catalog with all Stripe IDs |
| `/lib/stripe/checkout.ts` | Stripe session creation with cross-sell logic |
| `/app/checkout/page.tsx` | Main checkout page with funnel routing |
| `/app/checkout/order-bumps/page.tsx` | Order bumps page with dynamic add-ons |
| `/contexts/CartContext.tsx` | Cart management with auto-swap logic |
| `/api/checkout/session/route.ts` | API endpoint for Stripe session creation |

---

## Common Issues & Troubleshooting

### Issue: "Price is not available because its product is not active"

**Cause:** Stripe product/price hasn't been created or activated in Stripe dashboard.

**Solution:**
1. Log into Stripe dashboard
2. Go to Products
3. Create products matching the IDs in this doc
4. Create prices matching the price IDs in this doc
5. Ensure products are set to "Active"

### Issue: Wrong order bumps showing

**Cause:** Funnel type not being passed correctly through URL params.

**Solution:** Check `/checkout/page.tsx` routing logic ensures `?funnel=6wc` or `?funnel=course` is appended.

### Issue: Cart shows wrong price

**Cause:** Product has multi-currency support but cart is using wrong currency.

**Solution:** Update product to use default `stripe_price_id` or implement currency detection.

---

## Next Steps

1. **Activate all Stripe products** in your Stripe dashboard
2. **Test each funnel** using the checklist above
3. **Implement post-purchase upsells** on the success page
4. **Add currency detection** for multi-currency courses (if needed)
5. **Set up webhook handling** for purchase completion events

---

**Questions?** Refer to `/lib/checkout-flow-reference.md` for detailed funnel architecture diagrams.
