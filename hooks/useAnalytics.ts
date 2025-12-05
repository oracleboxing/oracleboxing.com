'use client'

import { track } from '@vercel/analytics'

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
  product_count?: number
  funnel_type?: '6wc' | 'course' | 'bundle' | 'membership'
  has_order_bumps?: boolean
  order_bumps?: string[]
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

export const useAnalytics = () => {
  const trackInitiateCheckout = (data: CheckoutEventData) => {
    // Track in Vercel Analytics
    track('initiate_checkout', { ...data })
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

      track('purchase', vercelData);
      console.log('Vercel Analytics purchase event sent');
    } catch (error) {
      console.error('Failed to send Vercel Analytics purchase event:', error);
    }

  }

  const trackButtonClick = (data: ButtonClickData) => {
    console.log('Button click tracked:', data);

    try {
      // Track in Vercel Analytics
      track('button_click', { ...data });
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

      track(eventName, vercelData);
    } catch (error) {
      console.error(`Failed to track upsell ${data.action}:`, error);
    }
  }

  const trackSocialClick = (data: SocialClickData) => {
    console.log('Social click tracked:', data);

    try {
      // Track in Vercel Analytics
      track('social_click', { ...data });
    } catch (error) {
      console.error('Failed to track social click:', error);
    }
  }

  const trackStoryClick = (data: StoryClickData) => {
    // Track in Vercel Analytics
    track('story_click', { ...data })
  }

  const trackFAQExpand = (data: FAQEventData) => {
    // Track in Vercel Analytics
    track('faq_expand', { ...data })
  }

  const trackPageView = (page: string) => {
    // Track in Vercel Analytics
    track('page_view', { page })
  }

  return {
    trackInitiateCheckout,
    trackPurchase,
    trackButtonClick,
    trackUpsellInteraction,
    trackSocialClick,
    trackStoryClick,
    trackFAQExpand,
    trackPageView,
  }
}