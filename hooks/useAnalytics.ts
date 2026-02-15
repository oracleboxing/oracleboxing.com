'use client'

import { track } from '@vercel/analytics'
import { getExperimentCookie } from '@/lib/tracking-cookies'

/** Get experiment assignments formatted for Vercel Analytics (flat key-value pairs) */
function getExperimentProps(): Record<string, string> {
  const assignments = getExperimentCookie()
  const props: Record<string, string> = {}
  for (const [testId, variant] of Object.entries(assignments)) {
    props[`exp_${testId}`] = variant
  }
  return props
}

// AddToCart event - fires when user clicks to go to checkout
interface AddToCartEventData {
  product_id: string // '21dc-entry' | '6wc' | 'bffp' | 'tracksuit' | etc.
  product_name: string // 'Entry Package' | '6-Week Challenge' | etc.
  value: number
  currency: string
  button_location: string // 'pricing-entry' | 'pricing-premium' | 'pricing-vip' | 'hero' | 'offer-stack'
  funnel: string // '21dc' | '6wc' | 'course' | 'membership'
}

// InitiateCheckout event - fires when user proceeds to Stripe payment
interface InitiateCheckoutEventData {
  value: number
  currency: string
  products: string[] // All product IDs in cart
  product_names: string[] // Human-readable product names
  order_bumps: string[] // Order bump product IDs selected
  order_bump_names: string[] // Human-readable order bump names
  funnel: string // '21dc' | '6wc' | 'course' | 'bundle' | 'membership'
  has_order_bumps: boolean
  total_items: number
}

// Legacy checkout event data (for backward compatibility)
interface CheckoutEventData {
  value: number
  currency: string
  item_name: string
  button_text: string
  button_location: 'header' | 'hero' | 'proof' | 'course' | 'coaching' | 'community' | 'offer' | 'refund' | 'consequence' | 'story'
}

interface PurchaseEventData {
  value: number
  currency: string
  transaction_id: string
  products?: string[]
  product_names?: string[] // Human-readable product names
  product_count?: number
  funnel_type?: '6wc' | 'course' | 'bundle' | 'membership' | '21dc'
  has_order_bumps?: boolean
  order_bumps?: string[]
  order_bump_names?: string[] // Human-readable order bump names
  item_name?: string // Keep for backward compatibility
}

interface ButtonClickData {
  button_location: string // 'homepage-hero' | 'course-card' | 'pricing-card' | 'faq-section' | 'sidebar' | 'header' | 'upsell-page'
  button_type: string // 'primary-cta' | 'secondary-cta' | 'buy-now' | 'learn-more' | 'social' | 'contact'
  product_id?: string // 'bffp' | '6wc' | 'bundle' | 'mem6', etc.
  product_name?: string
  value?: number
  currency?: string
  destination?: string
}

interface UpsellInteractionData {
  action: 'accept' | 'decline'
  product_id: string
  product_name: string
  value: number
  currency: string
  original_purchase?: string[]
  original_value?: number
}

interface SocialClickData {
  platform: 'instagram' | 'youtube' | 'twitter' | 'tiktok'
  location: 'header' | 'sidebar' | 'footer'
  destination: string
}

interface StoryClickData {
  link_location: string
  destination_page: string
}

interface FAQEventData {
  question_text: string
  question_index: number
  page?: string
}

interface WaitlistSignupData {
  email: string
  first_name: string
  last_name: string
  source?: string
}

export const useAnalytics = () => {
  // NEW: Track AddToCart - fires when user clicks to go to checkout page
  const trackAddToCart = (data: AddToCartEventData) => {
    console.log('Vercel Analytics: AddToCart event', data);

    try {
      track('add_to_cart', {
        product_id: data.product_id,
        product_name: data.product_name,
        value: data.value,
        currency: data.currency,
        button_location: data.button_location,
        funnel: data.funnel,
        ...getExperimentProps(),
      });
      console.log('Vercel Analytics add_to_cart event sent');
    } catch (error) {
      console.error('Failed to send Vercel Analytics add_to_cart event:', error);
    }
  };

  // NEW: Track InitiateCheckout with rich data - fires when proceeding to Stripe
  const trackInitiateCheckoutEnriched = (data: InitiateCheckoutEventData) => {
    console.log('Vercel Analytics: InitiateCheckout (enriched) event', data);

    try {
      track('initiate_checkout', {
        value: data.value,
        currency: data.currency,
        products: data.products.join(','),
        product_names: data.product_names.join(','),
        order_bumps: data.order_bumps.join(','),
        order_bump_names: data.order_bump_names.join(','),
        funnel: data.funnel,
        has_order_bumps: data.has_order_bumps,
        total_items: data.total_items,
        ...getExperimentProps(),
      });
      console.log('Vercel Analytics initiate_checkout event sent');
    } catch (error) {
      console.error('Failed to send Vercel Analytics initiate_checkout event:', error);
    }
  };

  // Legacy: Track InitiateCheckout (kept for backward compatibility)
  const trackInitiateCheckout = (data: CheckoutEventData) => {
    // Track in Vercel Analytics
    track('initiate_checkout', { ...data, ...getExperimentProps() })
  }

  const trackPurchase = (data: PurchaseEventData) => {
    console.log('useAnalytics trackPurchase called with data:', data);

    try {
      // Track in Vercel Analytics
      // Note: Vercel Analytics has type restrictions, so we serialize arrays to strings
      // and filter out undefined values
      console.log('Sending to Vercel Analytics...');

      const vercelData: Record<string, string | number | boolean> = {
        value: data.value,
        currency: data.currency,
        transaction_id: data.transaction_id,
      };

      if (data.products) vercelData.products = data.products.join(',');
      if (data.product_count !== undefined) vercelData.product_count = data.product_count;
      if (data.funnel_type) vercelData.funnel_type = data.funnel_type;
      if (data.has_order_bumps !== undefined) vercelData.has_order_bumps = data.has_order_bumps;
      if (data.order_bumps) vercelData.order_bumps = data.order_bumps.join(',');

      track('purchase', { ...vercelData, ...getExperimentProps() });
      console.log('Vercel Analytics purchase event sent');
    } catch (error) {
      console.error('Failed to send Vercel Analytics purchase event:', error);
    }

  }

  const trackButtonClick = (data: ButtonClickData) => {
    console.log('Button click tracked:', data);

    try {
      // Track in Vercel Analytics
      track('button_click', { ...data, ...getExperimentProps() });
    } catch (error) {
      console.error('Failed to track button click:', error);
    }
  }

  const trackUpsellInteraction = (data: UpsellInteractionData) => {
    const eventName = data.action === 'accept' ? 'upsell_accept' : 'upsell_decline';
    console.log(`Upsell ${data.action} tracked:`, data);

    try {
      // Track in Vercel Analytics
      // Note: Vercel Analytics has type restrictions, so we serialize arrays to strings
      // and filter out undefined values
      const vercelData: Record<string, string | number> = {
        action: data.action,
        product_id: data.product_id,
        product_name: data.product_name,
        value: data.value,
        currency: data.currency,
      };

      if (data.original_purchase) vercelData.original_purchase = data.original_purchase.join(',');
      if (data.original_value !== undefined) vercelData.original_value = data.original_value;

      track(eventName, { ...vercelData, ...getExperimentProps() });
    } catch (error) {
      console.error(`Failed to track upsell ${data.action}:`, error);
    }
  }

  const trackSocialClick = (data: SocialClickData) => {
    console.log('Social click tracked:', data);

    try {
      // Track in Vercel Analytics
      track('social_click', { ...data, ...getExperimentProps() });
    } catch (error) {
      console.error('Failed to track social click:', error);
    }
  }

  const trackStoryClick = (data: StoryClickData) => {
    // Track in Vercel Analytics
    track('story_click', { ...data, ...getExperimentProps() })
  }

  const trackFAQExpand = (data: FAQEventData) => {
    // Track in Vercel Analytics
    track('faq_expand', { ...data, ...getExperimentProps() })
  }

  const trackPageView = (page: string) => {
    // Track in Vercel Analytics
    track('page_view', { page, ...getExperimentProps() })
  }

  const trackWaitlistSignup = (data: WaitlistSignupData) => {
    console.log('Vercel Analytics: Waitlist signup event', data);

    try {
      track('waitlist_signup', {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        source: data.source || 'closed_page',
        ...getExperimentProps(),
      });
      console.log('Vercel Analytics waitlist_signup event sent');
    } catch (error) {
      console.error('Failed to send Vercel Analytics waitlist_signup event:', error);
    }
  }

  return {
    trackAddToCart,
    trackInitiateCheckout,
    trackInitiateCheckoutEnriched,
    trackPurchase,
    trackButtonClick,
    trackUpsellInteraction,
    trackSocialClick,
    trackStoryClick,
    trackFAQExpand,
    trackPageView,
    trackWaitlistSignup,
  }
}