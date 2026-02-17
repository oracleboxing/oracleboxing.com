/**
 * Site mode configuration.
 * 
 * MODE env var controls what the website sells:
 * - "challenge" = 21-Day Challenge only (live Stripe keys)
 * - "membership" = Membership only (live Stripe keys)  
 * - "test" = Both products visible (test Stripe keys)
 */

export type SiteMode = 'challenge' | 'membership' | 'test'

export function getSiteMode(): SiteMode {
  const mode = process.env.NEXT_PUBLIC_SITE_MODE || 'challenge'
  if (mode === 'membership' || mode === 'test') return mode
  return 'challenge'
}

// Client-side helper (reads NEXT_PUBLIC_ env var)
export function getClientSiteMode(): SiteMode {
  if (typeof window !== 'undefined') {
    // @ts-ignore - injected by Next.js
    const mode = process.env.NEXT_PUBLIC_SITE_MODE || 'challenge'
    if (mode === 'membership' || mode === 'test') return mode
  }
  return 'challenge'
}

// Section visibility
export function showChallengeDetails(mode: SiteMode): boolean {
  return mode === 'challenge' || mode === 'test'
}

export function showCoursePreview(mode: SiteMode): boolean {
  return mode === 'membership' || mode === 'test'
}

export function showChallengePricing(mode: SiteMode): boolean {
  return mode === 'challenge' || mode === 'test'
}

export function showMembershipPricing(mode: SiteMode): boolean {
  return mode === 'membership' || mode === 'test'
}

// CTA config
export function getHeroButtonText(mode: SiteMode): string {
  if (mode === 'membership') return 'Buy a Membership'
  return 'Start your 21-Day Challenge'
}

export function getHeroButtonLink(mode: SiteMode): string {
  if (mode === 'membership') return '/checkout-v2?product=membership&plan=monthly'
  return '/checkout-v2?product=21dc'
}

export function getHeaderButtonText(mode: SiteMode): string {
  return 'Join Now'
}

export function getHeaderButtonLink(mode: SiteMode): string {
  if (mode === 'membership') return '/checkout-v2?product=membership&plan=monthly'
  return '/checkout-v2?product=21dc'
}

// Stripe key selection
export function getStripeKeys(): { publishableKey: string; secretKey: string } {
  const mode = getSiteMode()
  
  if (mode === 'test') {
    return {
      publishableKey: process.env.STRIPE_TEST_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '',
    }
  }
  
  return {
    publishableKey: process.env.STRIPE_LIVE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '',
  }
}
