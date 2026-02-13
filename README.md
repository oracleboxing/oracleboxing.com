# Oracle Boxing

E-commerce platform for Oracle Boxing digital products, courses, memberships, and coaching.

**Live**: [oracleboxing.com](https://oracleboxing.com) | **Hosted on**: Vercel

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15 |
| Language | TypeScript (strict) | 5 |
| Styling | Tailwind CSS | v4 |
| UI Components | Radix UI + shadcn/ui | — |
| Animations | Framer Motion | 12 |
| Payments | Stripe | 20 |
| Database | Supabase | 2.89 |
| Email | SendGrid | 8 |
| Auth | NextAuth | 4 |
| Workflows | Vercel WDK | beta |
| E2E Tests | Playwright | 1.51 |
| Deployment | Vercel | — |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev          # Starts on http://localhost:3000 (Turbopack)
```

### Environment Variables

Create `.env.local` with the following:

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client | Stripe.js |
| `STRIPE_SECRET_KEY` | Server | Stripe API |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Client | Facebook Pixel |
| `FB_ACCESS_TOKEN` | Server | Facebook Conversions API |
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Supabase browser client |
| `SUPABASE_SERVICE_KEY` | Server | Supabase admin operations |
| `NEXTAUTH_SECRET` | Server | NextAuth JWT signing |
| `NEXTAUTH_URL` | Server | NextAuth callback URL |
| `SENDGRID_API_KEY` | Server | Transactional email |
| `NEXT_PUBLIC_BASE_URL` | Client | Base URL for frontend links |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Client | Google Ads conversion tracking |
| `NEXT_PUBLIC_MAKE_NOTIFICATION_WEBHOOK` | Client | Make.com notification webhook |
| `NEXT_PUBLIC_MAKE_CONTACT_WEBHOOK` | Client | Make.com contact form webhook |
| `NEXT_PUBLIC_MAKE_FEEDBACK_WEBHOOK` | Client | Make.com feedback form webhook |
| `NEXT_PUBLIC_MAKE_TESTIMONIAL_WEBHOOK` | Client | Make.com testimonial webhook |
| `NEXT_PUBLIC_MAKE_UNLOCK_COURSE_WEBHOOK` | Client | Make.com course unlock webhook |
| `NEXT_PUBLIC_MAKE_CHALLENGE_SIGNUP_WEBHOOK` | Client | Make.com challenge signup webhook |
| `NEXT_PUBLIC_MAKE_INITIATED_CHECKOUT_WEBHOOK` | Client | Make.com checkout initiation webhook |
| `SLACK_BOT_TOKEN` | Server | Slack notifications |
| `SLACK_OPS_CHANNEL_ID` | Server | Slack ops channel ID |
| `OPS_DASHBOARD_BASE_URL` | Server | Workflow proxy target |
| `INTERNAL_API_TOKEN` | Server | Internal API auth token |
| `MAKE_CLAIM_ACCESS_WEBHOOK_URL` | Server | Make.com course claim webhook |
| `MAKE_PROGRESS_TRACKER_WEBHOOK_URL` | Server | Make.com progress tracker webhook |
| `MAKE_NOTIFICATION_WEBHOOK_URL` | Server | Make.com server-side notifications |
| `PAYMENT_INTENT_TOKEN_REQUIRED` | Server | Feature flag for intent token security |
| `PAYMENT_INTENT_PROOF_SECRET` | Server | Payment intent proof HMAC secret |

---

## Project Structure

```
oracleboxing.com/
├── app/                    # Next.js App Router
│   ├── (pages)/            # Public pages (homepage, shop, membership, blog, etc.)
│   ├── checkout-v2/        # Two-step checkout flow
│   ├── coaching-checkout/  # Coaching product checkout
│   ├── success/            # Post-purchase success page
│   ├── admin/              # Admin pages (auth-protected)
│   ├── quiz/               # Diagnostic quiz funnel
│   ├── onboarding/         # Multi-step onboarding
│   ├── blog/               # SEO blog articles
│   └── api/                # API routes (see below)
├── components/             # 110+ React components
│   ├── ui/                 # shadcn/ui base components
│   ├── checkout-v2/        # Checkout form + Stripe elements
│   ├── challenge/          # Challenge illustrations
│   └── quiz/               # Quiz components
├── content/                # Course page copy (markdown)
├── contexts/               # React context providers
│   ├── CartContext.tsx      # Shopping cart (localStorage)
│   └── CurrencyContext.tsx  # Currency detection
├── lib/                    # Utility modules
│   ├── products.ts         # Product catalog & Stripe IDs
│   ├── currency.ts         # Multi-currency pricing
│   ├── tracking-cookies.ts # Attribution cookie system
│   ├── fbpixel.ts          # Facebook Pixel client
│   ├── purchase-tracking.ts# Purchase event tracking
│   ├── webhook-tracking.ts # Supabase event logging
│   ├── workflow-logger.ts  # WDK workflow logging
│   ├── gtag.ts             # Google Ads / GTM integration
│   ├── stripe/             # Stripe client & checkout logic
│   ├── supabase.ts         # Supabase client init
│   └── security/           # Request validation, intent tokens
├── public/                 # Fonts, images, favicons
└── tests/                  # Playwright e2e tests
```

---

## App Routes

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage (hero, testimonials, pricing, FAQ) |
| `/shop` | Product catalog |
| `/membership` | Membership details |
| `/checkout-v2` | Two-step checkout flow |
| `/coaching-checkout` | Coaching product checkout |
| `/success` | Post-purchase confirmation |
| `/blog/*` | SEO articles (6 posts) |
| `/quiz/take` | Diagnostic quiz |
| `/quiz/results-diagnostic` | Quiz results |
| `/progress-tracker` | Member progress dashboard |
| `/unlock-course` | Course access page |
| `/onboarding` | Multi-step onboarding |
| `/contact` | Contact form |
| `/feedback` | Feedback form |
| `/testimonial` | Testimonial submission |
| `/closed` | Enrollment closed / waitlist signup |
| `/why-online` | Why train online (marketing) |
| `/sms` | SMS integration |
| `/youtube-banner` | YouTube banner / CTR page |
| `/temp-unlock-course` | Temporary course unlock |
| `/terms`, `/privacy`, `/refund` | Legal pages |

### Admin Pages (NextAuth protected)

| Route | Description |
|-------|-------------|
| `/admin/coaching-checkout` | Create coaching sessions |
| `/admin/community-checkout` | Create community sessions |
| `/auth/signin` | Admin sign-in |

### API Routes

**Checkout & Payments**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/checkout/session` | POST | Create Stripe checkout session (legacy) |
| `/api/checkout-v2/session` | POST | Create PaymentIntent |
| `/api/checkout-v2/update` | POST | Update amount on add-on change |
| `/api/checkout-v2/update-address` | POST | Update shipping address |
| `/api/checkout-v2/recover` | GET | Recover abandoned checkout |
| `/api/payment-intent` | POST | Create payment intent (legacy) |
| `/api/coaching-checkout/*` | POST | Coaching subscriptions & split payments |
| `/api/upsell/charge` | POST | Process post-purchase upsell |
| `/api/upsell/coaching` | POST | Coaching-specific upsell |

**Tracking & Analytics**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/facebook-pageview` | POST | Facebook Pixel page view (CAPI) |
| `/api/facebook-addtocart` | POST | Facebook add-to-cart event |
| `/api/facebook-initiate-checkout` | POST | Facebook checkout init event |
| `/api/facebook-purchase` | POST | Facebook purchase event (CAPI) |

**Quiz**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/quiz/save-result` | POST | Save quiz answers |
| `/api/quiz/get-result` | GET | Retrieve quiz results |
| `/api/quiz/capture-email` | POST | Capture email from quiz |
| `/api/quiz/join-waitlist` | POST | Join waitlist |

**Workflows (WDK)**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/workflows/abandoned-cart/trigger` | POST | Start abandoned cart recovery |
| `/api/workflows/split-payment/trigger` | GET | Start split payment flow |
| `/api/workflows/split-payment/approve` | POST | Approve split payment |

**Other**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/detect-location` | GET | CloudFlare IP geolocation |
| `/api/claim-access` | POST | Claim course access |
| `/api/session` | GET | Session info |
| `/api/proxy-image` | GET | Image proxy / optimization |
| `/api/admin/create-coaching-session` | POST | Create coaching session (protected) |
| `/api/admin/create-community-session` | POST | Create community session (protected) |

---

## Core Systems

### Checkout Funnel

The checkout flow (`/checkout-v2`) is a two-step process:

1. **Step 1** — Customer enters name, email, phone (creates PaymentIntent)
2. **Step 2** — Stripe payment with optional order bumps (BFFP, Tracksuit, Vault)

The primary funnel is built around the **21-Day Challenge** ($147 entry), with order bumps displayed alongside payment. Add-on selection triggers a debounced PaymentIntent update (300ms).

Abandoned cart recovery auto-fills customer info via URL params (`?fn=&ln=&email=&phone=`).

### Product Catalog

All products live in `lib/products.ts` with Stripe Price IDs, metadata codes, and pricing info.

**Product types**: `course`, `bundle`, `membership`, `coaching`, `merch`

**Metadata codes** (short identifiers used in Stripe metadata and webhooks):

| Code | Product | Public |
|------|---------|--------|
| `obm` | Oracle Boxing Bundle | Yes |
| `bffp` | Boxing from First Principles | Yes |
| `brdmp` | Boxing Roadmap | Yes |
| `mem_monthly` | Monthly Membership | Yes |
| `mema` | Annual Membership | Yes |
| `memq` | Quarterly Membership | Legacy |
| `mem6` | 6-Month Membership | Legacy |
| `21dc_entry` | 21-Day Challenge | Internal |
| `6wc` | 6-Week Challenge | Legacy |
| `grades23` | Grades 2 & 3 Curriculum | Internal |
| `rcv` | Recordings Vault Access | Internal |
| `vault2025` | 2025 Call Recording Vault | Internal |
| `ltbffp` | Lifetime Boxing Masterclass | Internal |
| `ltbrdmp` | Lifetime Boxing Roadmap | Internal |
| `ltall_297` | Lifetime All Courses (Monthly) | Internal |
| `ltall_197` | Lifetime All Courses (6M/Annual) | Internal |
| `6wm` | 6-Week Membership Pass | Internal |
| `coach1` | 1-on-1 Coaching | Internal |
| `coach_archive` | Coaching Recordings Archive | Internal |
| `bfc` | Black Friday Challenge | Internal |
| `bfc_vip` | Black Friday Challenge VIP | Internal |
| `tracksuit` | Oracle Boxing Tracksuit | Internal |

### Multi-Currency Pricing

Supports **6 currencies**: USD, GBP, EUR, AUD, CAD, AED.

**Detection flow**:
1. Vercel header `x-vercel-ip-country` (production)
2. `ipapi.co` fallback (localhost)
3. Default: USD

Each product maps currency → Stripe Price ID in `lib/currency.ts`. Some products (memberships) are USD-only.

### Cart System

`contexts/CartContext.tsx` — localStorage-persisted cart with:

- Max quantity of 1 per product (no stacking)
- **Auto-swap logic**: adding a higher membership tier removes the lower tier
- Physical item detection (for shipping address collection)
- Variant support for merchandise (size/color)

### Tracking & Attribution

`lib/tracking-cookies.ts` — Cookie-based attribution system (`ob_track` cookie, 30-day expiry):

- **First-touch attribution**: UTM params captured on initial landing, never overwritten
- **Last-touch attribution**: Updated on each new session
- **Facebook identifiers**: `fbclid`, `_fbc`, `_fbp`
- **Session tracking**: `session_id` (UUID), `event_id` (16-digit random)
- All cookie data is packed into Stripe checkout metadata with `cookie_` prefix

Falls back to `sessionStorage` if cookies are blocked.

### Facebook Pixel

Dual tracking for maximum attribution coverage:

- **Client-side** (`lib/fbpixel.ts`): PageView, AddToCart, InitiateCheckout, Purchase
- **Server-side** (`/api/facebook-*`): Facebook Conversions API (CAPI)
- **Deduplication**: Shared `eventID` prevents double-counting between client and server

### Google Ads

`lib/gtag.ts` + `components/GoogleAdsTag.tsx` — Google Ads conversion tracking:

- **GTM container** loaded via `GoogleAdsTag` component
- **Conversion events**: sign-up/lead (checkout step 1) + purchase
- **Enhanced conversions**: hashed user data (`email`, `phone`, `name`, `address`)
- **E-commerce events**: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`

### Stripe Integration

`lib/stripe/checkout.ts` — Handles checkout session creation with:

- Full metadata packing (customer info, attribution, Facebook IDs, product descriptions)
- Multi-item discount (10% off for 2+ items)
- Payment method support: cards, PayPal, redirect-based methods
- Split payment support for coaching products

### Supabase

`lib/supabase.ts` — Two clients (browser with anon key, server with service role key).

**Tables**:

| Table | Purpose |
|-------|---------|
| `page_views` | Visitor analytics |
| `initiate_checkout` | Funnel tracking |
| `purchases` | Conversion tracking |
| `workflow_activity_log` | WDK workflow execution logs |
| `coaching_split_payments` | Split payment state |

### WDK Workflows

Vercel Workflow DevKit integration for durable long-running processes:

- **Abandoned Cart** — Triggers on checkout initiation, sleeps 1h30m, then sends recovery link with pre-filled customer data. Includes phone cooldown tracking to prevent spam.
- **Split Payment** — Durable coaching payment flow using `createHook()` for human approval of the second payment.

Both log to `workflow_activity_log` in Supabase and send Slack notifications on failure.

### Middleware

`middleware.ts` handles:

- **Domain redirect**: `shop.oracleboxing.com` → `oracleboxing.com` (301)
- **Admin auth**: `/admin/*` and `/api/admin/*` routes require NextAuth JWT with `@oracleboxing.com` email domain

---

## Tracking Pipeline

```
User arrives (UTM params captured)
       │
       ▼
  [tracking-cookies.ts] → ob_track cookie (first-touch + last-touch)
       │
       ▼
  [CurrencyContext] → detect location & currency
       │
       ▼
  User enters info on /checkout-v2 (Step 1)
       │
       ├──▶ POST /api/checkout-v2/session → Stripe PaymentIntent created
       ├──▶ [fbpixel.ts] → client-side InitiateCheckout event
       ├──▶ [webhook-tracking.ts] → Supabase initiate_checkout + Facebook CAPI
       └──▶ [WDK] → abandoned-cart workflow starts (1h30m sleep)
       │
       ▼
  User pays (Step 2)
       │
       ├──▶ Stripe checkout.session.completed webhook
       ├──▶ Make.com → course delivery automation
       └──▶ Redirect to /success
       │
       ▼
  Success page
       │
       ├──▶ [fbpixel.ts] → client-side Purchase event
       ├──▶ [purchase-tracking.ts] → Supabase purchases + Facebook CAPI
       └──▶ [WDK] → abandoned-cart workflow cancelled
```

---

## Scripts

```bash
npm run dev              # Development server (Turbopack, port 3000)
npm run build            # Production build
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm run check            # lint + typecheck combined
npm run test:e2e         # Playwright end-to-end tests
npm run test:e2e:public  # Public route tests only
npm run test:e2e:headed  # Tests in headed browser mode
npm run secrets:scan     # Pre-commit secret scanning
```

---

## Deployment

```bash
vercel --prod
```

Deployed to Vercel with custom domain `oracleboxing.com`.

**UTM short-link redirects** (in `next.config.mjs`):

| Short Link | Destination |
|------------|-------------|
| `/yt-bio` | `/?utm_source=youtube&utm_medium=bio` |
| `/yt-desc` | `/?utm_source=youtube&utm_medium=desc` |
| `/ig-bio` | `/?utm_source=ig&utm_medium=bio` |
| `/tt-bio` | `/?utm_source=tiktok&utm_medium=bio` |
| `/customer-portal` | Stripe hosted customer login |

**Cron job** (in `vercel.json`):

| Schedule | Endpoint | Purpose |
|----------|----------|---------|
| `0 9 * * *` (daily 9 AM UTC) | `/api/workflows/split-payment/trigger` | Process pending split payments |

---

## Documentation

Detailed guides live alongside the codebase:

| File | Purpose |
|------|---------|
| `CHECKOUT_ROUTING_GUIDE.md` | Funnel routing logic (which products → which checkout flow) |
| `BLOG_GUIDE.md` | Blog publishing workflow |
| `COLOR_PALETTE.md` | Design system colors |
| `FACEBOOK_PURCHASE_TRACKING.md` | FB Pixel + Conversions API implementation |
| `METADATA_TRACKING_SUMMARY.md` | Stripe metadata structure reference |
| `product_upsell_matrix.md` | Cross-sell / upsell logic |
| `UTM_TRACKING_IMPLEMENTATION.md` | UTM tracking details |
| `QUICK_START.md` | Quick start guide |
| `docs/split-payments-table.sql` | Split payments Supabase schema |

---

## Related Projects

| Project | Path | Purpose |
|---------|------|---------|
| **oracle-boxing-ops** | `oracle-boxing-ops/dashboard` | Internal CEO dashboard + AI agent system |
| **clawd** | `clawd/` | AI-powered ops automation (50+ integrations) |
