import { Product, ProductType } from './types'

// ===================================================================
// PUBLIC PRODUCTS (Displayed on website)
// ===================================================================

export const products: Product[] = [
  {
    id: 'bundle',
    title: 'Oracle Boxing Bundle',
    price: 397,
    type: 'course',
    metadata: 'obm',
    stripe_product_id: 'prod_TKqgHrxaUX30MC',
    stripe_price_id: 'price_1SOAyuKPvH4Ddlg1nRnvrgrF',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/obm_tn-large.webp',
    shortDescription: 'Every Course, Every Call, Every System, All in One Bundle.',
    perfectFor: 'Serious boxers who want to master everything, fast',
    moduleCount: 5,
    lessonCount: 225,
    lessonCountPrefix: '+',
    workoutCount: 100,
    description: `**Oracle Boxing Bundle**
**Every Course, Every Call, Every System, All in One Bundle.**

- Boxing Masterclass ($297)
- Boxing Roadmap ($147)
- Boxing Recordings ($97)

Complete access to the entire Oracle Boxing system — theory, technique, and tactics.`,
  },
  {
    id: 'bffp',
    title: 'Boxing Masterclass',
    price: 297,
    type: 'course',
    metadata: 'bffp',
    stripe_product_id: 'prod_TKqgg2tjyp9j4f',
    stripe_price_id: 'price_1SOAzDKPvH4Ddlg1skHdr4H0',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/bffp_tn5-large.webp',
    shortDescription: 'The Science of Boxing, Made Simple.',
    perfectFor: 'Beginners who crave a deep understanding',
    moduleCount: 5,
    lessonCount: 26,
    hours: 13,
    description: `**SENTIENCE — The Mind of the Fighter**
Learn how to think, feel, and perform like a boxer. Shift your paradigm for success, build mental clarity, and access flow on command.

**ANATOMY — The Wiring of Performance**
Understand how your body truly works beneath the surface. Study the nervous system, fascia, and energy transfer through the body.

**FORMIS — The Language of Movement**
Master the mechanics of boxing. Develop shape, stance, striking, defence, distance control, and the flow of movement.

**GAMBIT — The Science of Tactics**
Learn to think like a strategist in the ring. Understand pattern recognition, positioning, deception, and guard manipulation.

**ENGINE — The Physiology of Fighting**
Build the engine that powers it all. Train breathing, conditioning, nervous system strength, and recovery.

**MENTORSHIP — The Final Principle**
Develop discipline, leadership, and long-term mastery mindset.`,
  },
  {
    id: 'roadmap',
    title: 'Boxing Roadmap',
    price: 147,
    type: 'course',
    metadata: 'brdmp',
    stripe_product_id: 'prod_TKgxoODHTfkQEF',
    stripe_price_id: 'price_1SO1Z7KPvH4Ddlg1vrWUxFWX',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/tbrtn5hq-large.webp',
    shortDescription: 'Your Full 5-Month Boxing Curriculum: Technique, Drills, and Workouts.',
    perfectFor: 'Beginners who want structure from first punch to sparring',
    weeks: 20,
    workoutCount: 100,
    description: `Complete 5-phase boxing training system from fundamentals to mastery.

**Phase I** — Fundamentals & Form
**Phase II** — Defence, Range & Sparring Basics
**Phase III** — Dynamic Footwork & Balance
**Phase IV** — Defensive Mastery & Feints
**Phase V** — Precision & Application

Master every aspect of boxing technique through structured progression.`,
  },

  // MEMBERSHIPS
  {
    id: 'membership-monthly',
    title: 'Oracle Membership (Quarterly)',
    price: 297,
    type: 'membership',
    metadata: 'memq',
    recurring: true,
    interval: '3 months',
    stripe_product_id: 'prod_TKqg25PDS8om6s',
    stripe_price_id: 'price_1SOAysKPvH4Ddlg1JTdPV3rt',
    price_ids: {
      multicurrency: 'price_1SOAysKPvH4Ddlg1JTdPV3rt',
    },
    image: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp',
    description: `**Quarterly access to live coaching, community, and all courses**

✓ Weekly live coaching calls with Oliver & Toni
✓ Access to all courses (BFFP, Roadmap, Vault)
✓ Private community with expert feedback
✓ Monthly technique breakdowns and Q&A
✓ Switch to monthly billing at $97/month after purchase

Transform your boxing with ongoing expert guidance.`,
    shortDescription: 'Full Quarterly Access to Coaching & Community',
    perfectFor: 'Boxers who want ongoing coaching and support',
  },
  {
    id: 'membership-6month',
    title: 'Oracle Membership (6-Month)',
    price: 497,
    type: 'membership',
    metadata: 'mem6',
    recurring: true,
    interval: '6 months',
    stripe_product_id: 'prod_TKqg25PDS8om6s',
    stripe_price_id: 'price_1SOAysKPvH4Ddlg1DLECvdXA',
    price_ids: {
      multicurrency: 'price_1SOAysKPvH4Ddlg1DLECvdXA',
    },
    image: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp',
    description: `**6 months of access — save vs quarterly**

✓ Everything in Quarterly Membership
✓ Save $98 vs quarterly ($497 vs $595)
✓ Commit to mastery with 6 months of expert guidance
✓ Perfect for serious skill development

Best for dedicated students ready to transform their boxing.`,
    shortDescription: 'Save With 6-Month Commitment',
    perfectFor: 'Dedicated boxers ready for serious transformation',
  },
  {
    id: 'membership-annual',
    title: 'Oracle Membership (Annual)',
    price: 897,
    type: 'membership',
    metadata: 'mema',
    recurring: true,
    interval: 'year',
    stripe_product_id: 'prod_TKqg25PDS8om6s',
    stripe_price_id: 'price_1SOAysKPvH4Ddlg1fS1D1kFv',
    price_ids: {
      multicurrency: 'price_1SOAysKPvH4Ddlg1fS1D1kFv',
    },
    image: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp',
    description: `**Annual membership — best value**

✓ Everything in Quarterly Membership
✓ Save $291 vs quarterly ($897 vs $1,188)
✓ Full year of expert coaching and community
✓ Maximum commitment to mastery

Best value for serious boxers committed to long-term excellence.`,
    shortDescription: 'Best Value With Annual Commitment',
    perfectFor: 'Serious boxers committed to long-term excellence',
  },

]

// ===================================================================
// INTERNAL PRODUCTS (Not displayed publicly - used for checkout logic)
// ===================================================================

const internalProducts: Product[] = [
  {
    id: '6wc',
    title: '6-Week Challenge',
    price: 197,
    type: 'course',
    metadata: '6wc',
    stripe_product_id: 'prod_TKqgLcTbkwLMlK',
    stripe_price_id: 'price_1SOAyqKPvH4Ddlg1jWX78mP7',
    image: 'https://sb.oracleboxing.com/Website/6wc_tn.png',
    description: `**6-Week Refundable Challenge — Learn Boxing Fundamentals Fast**

Complete the challenge, get your money back. Simple as that.

**What you get:**
• Full access to Boxing Masterclass course
• Weekly live coaching calls with Oliver & Toni
• Private community access and feedback
• Structured accountability system
• 100% refund when you complete all requirements

**Requirements:**
• Attend 2 live calls per week (or watch replays)
• Submit 1 training video per week
• Complete all course modules
• Attend mid-point and graduation check-ins

Perfect for beginners or boxers who want rapid improvement with accountability.`,
    shortDescription: 'Fast-Start Entry Offer for Rapid Progress and Accountability',
    perfectFor: 'Beginners who want structure and accountability',
    weeks: 6,
    lessonCount: 26,
  },
  {
    id: 'recordings-vault',
    title: 'Recordings Vault Access',
    price: 67,
    type: 'course',
    metadata: 'rcv',
    stripe_product_id: 'prod_TKqg9nRbK27CDg',
    stripe_price_id: 'price_1SaVe2KPvH4Ddlg1zttkauwt',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp',
    description: `Get lifetime access to every coaching call and 1-on-1 call recording. Never worry about missing a session, rewatch, review, and learn at your own pace. Normally $197, yours today for just $67.`,
    shortDescription: 'Lifetime access to all coaching call recordings',
    perfectFor: 'Visual learners who study best through examples',
    lessonCount: 220,
    lessonCountPrefix: '+',
    updatedMonthly: true,
  },
  {
    id: 'lifetime-bffp',
    title: 'Lifetime Access to Boxing Masterclass',
    price: 147,
    type: 'course',
    metadata: 'ltbffp',
    stripe_product_id: 'prod_TKqgCP3kcRQ7Rw',
    stripe_price_id: 'price_1SOAyiKPvH4Ddlg1EuokXH49',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/bffp_tn5-large.webp',
    description: `Keep the entire Boxing Masterclass course forever. Review any lesson, any time — even after your Challenge ends. Normally $297, add lifetime access today for just $147.`,
    shortDescription: 'Keep Boxing Masterclass forever',
    perfectFor: '6-Week Challenge participants who want to keep learning',
    moduleCount: 5,
    lessonCount: 26,
  },
  {
    id: 'lifetime-roadmap',
    title: 'Lifetime Access to Boxing Roadmap',
    price: 97,
    type: 'course',
    metadata: 'ltbrdmp',
    stripe_product_id: 'prod_TKgxoODHTfkQEF',
    stripe_price_id: 'price_1SaVcCKPvH4Ddlg1cT1jmuMS',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/tbrtn5hq-large.webp',
    description: `Get lifetime access to the complete Boxing Roadmap training system. Master all 5 phases from fundamentals to sparring-ready technique. Normally $147, add lifetime access today for just $97.`,
    shortDescription: 'Keep Boxing Roadmap forever',
    perfectFor: '6-Week Challenge participants who want structured training',
    weeks: 20,
    workoutCount: 100,
    lessonCount: 176,
  },
  {
    id: 'lifetime-all-monthly',
    title: 'Lifetime Access (All Courses) — Monthly Member',
    price: 297,
    type: 'course',
    metadata: 'ltall_297',
    stripe_product_id: 'prod_THtXlTjbNn8FXP',
    stripe_price_id: 'price_1SLLWbQNEdHwdojXAmcEYocG',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/obm_tn-large.webp',
    description: `**Own All Courses Forever — Even If You Cancel Membership**

Get permanent access to BFFP, Roadmap, and Boxing Clinic, independent of your membership.

**Perfect for:**
• Monthly members who want ownership
• Members planning to cancel but want to keep the content
• Anyone who wants the safety of permanent access

**What you get:**
• Lifetime access to Boxing Masterclass
• Lifetime access to Boxing Roadmap
• Lifetime access to Boxing Clinic Replays
• All future course updates included

**Note:** This is a one-time purchase for monthly members. If you cancel your membership, you keep full access to all courses.`,
    shortDescription: 'Permanent Course Access for Monthly Members',
    perfectFor: 'Monthly members who want permanent ownership',
  },
  {
    id: 'lifetime-all-committed',
    title: 'Lifetime Access (All Courses) — 6M/Annual Member',
    price: 197,
    type: 'course',
    metadata: 'ltall_197',
    stripe_product_id: 'prod_THtXlTjbNn8FXP',
    stripe_price_id: 'price_1SLLW7QNEdHwdojX86z2xJW4',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/obm_tn-large.webp',
    description: `**Own All Courses Forever — Discounted for Committed Members**

As a 6-month or annual member, get permanent access to all courses at a special rate.

**Perfect for:**
• 6-month or annual members who want ownership
• Members planning to eventually leave but want to keep content
• Anyone who values the security of lifetime access

**What you get:**
• Lifetime access to Boxing Masterclass
• Lifetime access to Boxing Roadmap
• Lifetime access to Boxing Clinic Replays
• All future course updates included

**Special pricing:** $100 discount for committed members ($197 vs $297 for monthly).`,
    shortDescription: 'Discounted Permanent Course Access for Committed Members',
    perfectFor: '6-month/annual members who want permanent ownership',
  },
  {
    id: '6wm',
    title: '6-Week Membership',
    price: 97,
    type: 'membership',
    metadata: '6wm',
    recurring: false,
    stripe_product_id: 'prod_THvKZVW9MTpheP',
    stripe_price_id: 'price_1SLLTqQNEdHwdojXsQKz5qSZ',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp',
    description: `**Temporary Full Access to Live Coaching & Community for 6 Weeks**

Experience the full membership benefits for 6 weeks without commitment.

**Perfect for:**
• Bundle purchasers who want a taste of live coaching
• Course owners who want to try the community
• Anyone curious about the full membership experience

**What's included:**
• 6 weeks of live coaching calls with Oliver & Toni
• Full community access on Skool
• Video feedback on your training clips
• Access to all recorded sessions during your 6 weeks

**Note:** This is a one-time 6-week access pass, not a recurring subscription.`,
    shortDescription: 'Temporary Full Membership Access for 6 Weeks',
    perfectFor: 'Bundle purchasers who want live coaching experience',
  },
  {
    id: '1on1-coaching',
    title: '1-Month 1-on-1 Coaching',
    price: 397,
    type: 'course',
    metadata: 'coach1',
    stripe_product_id: 'prod_THuQf0h3DatQUL',
    stripe_price_id: 'price_1SLLX4QNEdHwdojXfZImwLss', // USD only (default for membership upsells)
    price_ids: {
      usd_membership_upsell: 'price_1SLLX4QNEdHwdojXfZImwLss',
      multicurrency: 'price_1SLLY7QNEdHwdojXVriclpjV',
    },
    image: 'https://sb.oracleboxing.com/Website/1on1_coaching.png',
    description: `**Personalized 4-Week Coaching Program with Weekly Zoom Calls**

Direct 1-on-1 access to Oliver or Toni for personalized technical coaching.

**What's included:**
• 4 weekly private Zoom calls (30-45 min each)
• Unlimited video feedback throughout the month
• Personalized training plan tailored to your goals
• Direct WhatsApp/Telegram support
• All session recordings for future reference

**Perfect for:**
• Fighters preparing for competition
• Boxers with specific technical challenges
• Anyone wanting accelerated progress
• Coaches looking to level up their own understanding

**Note:** Limited availability. Coaches will reach out within 48 hours of purchase to schedule.`,
    shortDescription: 'Personalized 4-Week Coaching with Weekly Calls',
    perfectFor: 'Serious fighters who want personalized attention',
  },
  {
    id: '1on1-vault',
    title: '1-on-1 Coaching Recordings Vault',
    price: 67,
    type: 'course',
    metadata: 'coach_archive',
    stripe_product_id: 'prod_THtSgSl2rHdu8X',
    stripe_price_id: 'price_1SLJtyQNEdHwdojXpNn9LvDH',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp',
    description: `**Complete Archive of 1-on-1 Coaching Sessions**

Access to selected 1-on-1 coaching call recordings for study and learning.

**What's included:**
• 50+ archived 1-on-1 coaching sessions
• Real technical corrections and personalized feedback examples
• Advanced technique breakdowns
• Problem-solving approaches for common issues

**Perfect for:**
• Self-taught boxers wanting to study real coaching
• Coaches looking to improve their teaching methods
• Visual learners who benefit from seeing corrections applied

**Note:** This is a study resource, not active coaching. For personalized coaching, see 1-Month 1-on-1 Coaching.`,
    shortDescription: 'Study Archive of Past 1-on-1 Sessions',
    perfectFor: 'Learners who study best through observation',
  },
  {
    id: 'bfc',
    title: 'Black Friday Challenge',
    price: 97,
    type: 'course',
    metadata: 'bfc',
    stripe_product_id: 'prod_TNwT73GrjCaz3r',
    stripe_price_id: 'price_1SRAaaKPvH4Ddlg1uX0nwIuj',
    price_ids: {
      multicurrency: 'price_1SRAaaKPvH4Ddlg1uX0nwIuj',
    },
    image: 'https://sb.oracleboxing.com/Website/6wc_tn.png',
    description: `**Black Friday Challenge — 6 Weeks for $97**

Complete the challenge, get your money back. Simple as that.

**What you get:**
• 6-Week program with live coaching
• Full access to Boxing Masterclass course
• Weekly live coaching calls with Oliver & Toni
• Private community access and feedback
• Structured accountability system
• 100% refund when you complete all requirements

**Requirements:**
• Attend 2 live calls per week (or watch replays)
• Submit 1 training video per week
• Complete all course modules
• Attend mid-point and graduation check-ins

Perfect for beginners or boxers who want rapid improvement with accountability.`,
    shortDescription: 'Black Friday Entry — 6 Weeks for $97',
    perfectFor: 'Beginners who want structure and accountability',
    weeks: 6,
    lessonCount: 26,
  },
  {
    id: 'bfc-vip',
    title: 'Black Friday Challenge VIP',
    price: 497,
    type: 'course',
    metadata: 'bfc_vip',
    stripe_product_id: 'prod_TNwYt9qDOIofyA',
    stripe_price_id: 'price_1SUj2tKPvH4Ddlg13pfNOJ3P',
    price_ids: {
      multicurrency: 'price_1SUj2tKPvH4Ddlg13pfNOJ3P',
    },
    image: 'https://sb.oracleboxing.com/Website/6wc_tn.png',
    description: `**Black Friday Challenge VIP — $397**

Everything in the Challenge plus lifetime access and VIP perks.

**What you get:**
• Everything in the Black Friday Challenge
• Lifetime Access to All Course Content
• Priority Onboarding Call (Instant Access)
• Exclusive Early Access to Oracle Boxing Apparel (Releasing Before Christmas)
• Keep everything forever

**Note:** VIP members get permanent ownership of all course materials and priority support.`,
    shortDescription: 'VIP Package with Lifetime Access',
    perfectFor: 'Serious boxers who want lifetime ownership',
    weeks: 6,
    lessonCount: 26,
  },
  {
    id: 'tracksuit',
    title: 'Oracle Boxing Tracksuit',
    price: 161, // USD base price (20% discount applied)
    prices: {
      usd: 161,
      gbp: 128,
      eur: 150,
      cad: 219,
      aud: 241,
      aed: 590,
    },
    type: 'course',
    metadata: 'tracksuit',
    stripe_product_id: 'prod_TXkoI5vRqO7auz', // Test product ID
    stripe_price_id: 'price_1SafJLQNEdHwdojXTHKyas20', // Test price ID ($161)
    price_ids: {
      usd: 'price_1SafJLQNEdHwdojXTHKyas20',
    },
    image: 'https://sb.oracleboxing.com/Website/tracksuit_preview.png',
    description: `**Premium Oracle Boxing Tracksuit**

Represent the Oracle Boxing community with our exclusive tracksuit.

**Features:**
• 100% cotton for maximum comfort and durability
• Made in Britain with premium craftsmanship
• Official Oracle Boxing branding
• Perfect for training or casual wear
• Limited availability

**Sizing:**
We'll contact you after purchase to confirm your size and shipping details.`,
    shortDescription: 'Official Oracle Boxing Tracksuit - 20% Off Success Page Only',
    perfectFor: 'Community members who want to represent',
  },
]

// Combine all products for internal lookups
const allProducts = [...products, ...internalProducts]

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

export function getProductById(id: string): Product | undefined {
  return allProducts.find(p => p.id === id)
}

export function getProductsByType(type: ProductType): Product[] {
  return products.filter(p => p.type === type)
}

export function getCourses(): Product[] {
  return products.filter(p => p.type === 'course')
}

export function getMemberships(): Product[] {
  return products.filter(p => p.type === 'membership')
}

// Get products by metadata tag
export function getProductByMetadata(metadata: string): Product | undefined {
  return allProducts.find(p => p.metadata === metadata)
}

// Get products for specific funnels
export function get6WCAddOns(): Product[] {
  return allProducts.filter(p => ['rcv', 'ltbffp', 'ltbrdmp'].includes(p.metadata || ''))
}

export function getMembershipAddOns(membershipTier: 'monthly' | '6month' | 'annual'): Product[] {
  if (membershipTier === 'monthly') {
    return allProducts.filter(p => p.metadata === 'ltall_297')
  }
  return allProducts.filter(p => p.metadata === 'ltall_197')
}

export function getCourseOrderBump(): Product[] {
  // Return the bundle for course order bumps
  return allProducts.filter(p => p.metadata === 'obm')
}

export function getCourseUpsells(): Product[] {
  return allProducts.filter(p => ['obm', 'coach1'].includes(p.metadata || ''))
}

export function getBundleUpsells(): Product[] {
  return allProducts.filter(p => ['6wm', 'coach1'].includes(p.metadata || ''))
}
