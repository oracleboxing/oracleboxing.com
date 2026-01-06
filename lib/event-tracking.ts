// Generic event tracking for user interactions
// Stores events in Supabase 'events' table

import { supabase } from './supabase'

export type EventName =
  | 'button_click'      // CTA button clicks
  | 'video_play'        // Video started playing
  | 'video_progress'    // Video watched 25%, 50%, 75%, 100%
  | 'scroll_depth'      // Scroll milestones (25%, 50%, 75%, 100%)
  | 'time_on_page'      // Time spent on page (30s, 60s, 120s, 300s)
  | 'form_start'        // User started filling a form
  | 'form_abandon'      // User left form without submitting
  | 'cta_view'          // CTA entered viewport
  | 'pricing_view'      // Pricing section viewed
  | 'testimonial_view'  // Testimonials section viewed
  | 'faq_expand'        // FAQ item expanded
  | 'exit_intent'       // User showed exit intent
  | 'tab_hidden'        // User switched tabs
  | 'tab_visible'       // User returned to tab
  | 'copy_text'         // User copied text
  | 'email_signup'      // Newsletter/lead magnet signup
  | 'upsell_view'       // Upsell offer displayed
  | 'upsell_click'      // User clicked on upsell
  | 'upsell_accept'     // User accepted upsell
  | 'upsell_decline'    // User declined upsell
  | 'error'             // Client-side error occurred

export interface EventData {
  event_name: EventName
  page: string
  element_id?: string       // ID of element interacted with
  element_text?: string     // Text content of element (truncated)
  element_type?: string     // button, link, video, form, etc.
  value?: number            // Numeric value (scroll %, video %, time in seconds, price)
  metadata?: Record<string, any>  // Additional context
}

interface StoredEvent extends EventData {
  id?: string
  date: string
  session_id: string
  event_id: string
  country: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
}

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get session ID from localStorage
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  try {
    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('session_id', sessionId)
    }
    return sessionId
  } catch {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Get UTM parameters from cookies
 */
function getUTMFromCookies(): {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
} {
  if (typeof document === 'undefined') {
    return { utm_source: null, utm_medium: null, utm_campaign: null }
  }

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = decodeURIComponent(value || '')
    return acc
  }, {} as Record<string, string>)

  // Try ob_track cookie first (from tracking-cookies.ts)
  try {
    const obTrack = cookies['ob_track']
    if (obTrack) {
      const parsed = JSON.parse(obTrack)
      return {
        utm_source: parsed.last_utm_source || null,
        utm_medium: parsed.last_utm_medium || null,
        utm_campaign: parsed.last_utm_campaign || null,
      }
    }
  } catch {}

  // Fallback to individual cookies
  return {
    utm_source: cookies['utm_source'] || null,
    utm_medium: cookies['utm_medium'] || null,
    utm_campaign: cookies['utm_campaign'] || null,
  }
}

/**
 * Get country from localStorage (cached from page view)
 */
function getCachedCountry(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem('user_country') || null
}

/**
 * Track a generic event
 */
export async function trackEvent(data: EventData): Promise<void> {
  try {
    const sessionId = getSessionId()
    const eventId = generateEventId()
    const utm = getUTMFromCookies()
    const country = getCachedCountry()

    const event: StoredEvent = {
      ...data,
      date: new Date().toISOString(),
      session_id: sessionId,
      event_id: eventId,
      country,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      // Truncate element_text to prevent huge payloads
      element_text: data.element_text?.slice(0, 100),
      // Stringify metadata for storage
      metadata: data.metadata,
    }

    // Non-blocking insert to Supabase
    supabase
      .from('events')
      .insert({
        date: event.date,
        session_id: event.session_id,
        event_id: event.event_id,
        event_name: event.event_name,
        page: event.page,
        element_id: event.element_id || null,
        element_text: event.element_text || null,
        element_type: event.element_type || null,
        value: event.value || null,
        metadata: event.metadata ? JSON.stringify(event.metadata) : null,
        country: event.country,
        utm_source: event.utm_source,
        utm_medium: event.utm_medium,
        utm_campaign: event.utm_campaign,
      })
      .then(({ error }) => {
        if (error) {
          console.error('Failed to track event:', error)
        } else {
          console.log(`✅ Event tracked: ${event.event_name}`, data)
        }
      })
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

// Convenience functions for common events

export function trackButtonClick(
  buttonId: string,
  buttonText: string,
  page: string,
  metadata?: Record<string, any>
) {
  trackEvent({
    event_name: 'button_click',
    page,
    element_id: buttonId,
    element_text: buttonText,
    element_type: 'button',
    metadata,
  })
}

export function trackVideoPlay(
  videoId: string,
  videoTitle: string,
  page: string
) {
  trackEvent({
    event_name: 'video_play',
    page,
    element_id: videoId,
    element_text: videoTitle,
    element_type: 'video',
  })
}

export function trackVideoProgress(
  videoId: string,
  videoTitle: string,
  page: string,
  percent: number
) {
  trackEvent({
    event_name: 'video_progress',
    page,
    element_id: videoId,
    element_text: videoTitle,
    element_type: 'video',
    value: percent,
  })
}

export function trackScrollDepth(page: string, percent: number) {
  trackEvent({
    event_name: 'scroll_depth',
    page,
    value: percent,
  })
}

export function trackTimeOnPage(page: string, seconds: number) {
  trackEvent({
    event_name: 'time_on_page',
    page,
    value: seconds,
  })
}

export function trackFormStart(formId: string, page: string) {
  trackEvent({
    event_name: 'form_start',
    page,
    element_id: formId,
    element_type: 'form',
  })
}

export function trackFaqExpand(
  questionText: string,
  page: string,
  index: number
) {
  trackEvent({
    event_name: 'faq_expand',
    page,
    element_text: questionText,
    element_type: 'faq',
    value: index,
  })
}

export function trackExitIntent(page: string) {
  trackEvent({
    event_name: 'exit_intent',
    page,
  })
}

export function trackUpsellView(
  productName: string,
  price: number,
  page: string
) {
  trackEvent({
    event_name: 'upsell_view',
    page,
    element_text: productName,
    value: price,
    element_type: 'upsell',
  })
}

export function trackUpsellClick(
  productName: string,
  price: number,
  page: string,
  action: 'accept' | 'decline'
) {
  trackEvent({
    event_name: action === 'accept' ? 'upsell_accept' : 'upsell_decline',
    page,
    element_text: productName,
    value: price,
    element_type: 'upsell',
  })
}

export function trackEmailSignup(
  formId: string,
  page: string,
  source?: string
) {
  trackEvent({
    event_name: 'email_signup',
    page,
    element_id: formId,
    element_type: 'form',
    metadata: source ? { source } : undefined,
  })
}

export function trackError(
  errorMessage: string,
  page: string,
  metadata?: Record<string, any>
) {
  trackEvent({
    event_name: 'error',
    page,
    element_text: errorMessage,
    metadata,
  })
}
