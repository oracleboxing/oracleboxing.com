'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalytics } from '@/hooks/useAnalytics'
import { trackPurchase as trackPurchaseToSupabase } from '@/lib/webhook-tracking'
import { convertToUSD, Currency } from '@/lib/currency'

interface SuccessContentProps {
  sessionId: string
  isPaymentIntent?: boolean
  isSubscription?: boolean
}

/**
 * Get tracking cookie data (returns empty object if no consent/cookie)
 */
function getTrackingCookie(): any {
  if (typeof document === 'undefined') return {};

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const obTrackCookie = cookies['ob_track'];
  if (!obTrackCookie) return {};

  try {
    return JSON.parse(decodeURIComponent(obTrackCookie));
  } catch {
    return {};
  }
}

/**
 * Generate a unique event ID for deduplication
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Get Facebook Click ID (fbclid) from cookies
 */
function getFbclid(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {} as Record<string, string>);

  return cookies['fbclid'] || null;
}

/**
 * Check if purchase event has already been sent for this session
 * Uses sessionStorage to prevent duplicate events on page refresh
 */
function isPurchaseAlreadyTracked(sessionId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const trackedPurchases = sessionStorage.getItem('ob_tracked_purchases');
    if (!trackedPurchases) return false;

    const purchases = JSON.parse(trackedPurchases) as string[];
    return purchases.includes(sessionId);
  } catch {
    return false;
  }
}

/**
 * Mark a purchase as tracked to prevent duplicate events
 */
function markPurchaseAsTracked(sessionId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const trackedPurchases = sessionStorage.getItem('ob_tracked_purchases');
    const purchases = trackedPurchases ? JSON.parse(trackedPurchases) as string[] : [];

    if (!purchases.includes(sessionId)) {
      purchases.push(sessionId);
      sessionStorage.setItem('ob_tracked_purchases', JSON.stringify(purchases));
    }
  } catch (e) {
    console.warn('Failed to mark purchase as tracked:', e);
  }
}

export function SuccessContent({ sessionId, isPaymentIntent = false, isSubscription = false }: SuccessContentProps) {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [countdown, setCountdown] = useState(4)
  const { trackPurchase } = useAnalytics()
  const hasFetchedRef = useRef(false)
  const router = useRouter()

  useEffect(() => {
    // Prevent multiple fetches due to React strict mode or re-renders
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true

    async function fetchSession() {
      try {
        // Fetch session data from Stripe (supports session_id, payment_intent, or subscription)
        const param = isSubscription ? 'subscription' : isPaymentIntent ? 'payment_intent' : 'session_id'
        const response = await fetch(`/api/session?${param}=${sessionId}`);
        const sessionData = await response.json();

        console.log('Session data:', sessionData);
        setSession(sessionData);

        // Send Purchase event to Facebook (browser + CAPI)
        await sendPurchaseEvent(sessionData);

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching session:', error)
        setIsLoading(false)
      }
    }

    async function sendPurchaseEvent(sessionData: any) {
      try {
        // Check for duplicate purchase events
        if (isPurchaseAlreadyTracked(sessionId)) {
          console.log('⚠️ Purchase event already tracked for session:', sessionId);
          return;
        }

        console.log('Session data received for Purchase tracking:', {
          has_amount_total: !!sessionData.amount_total,
          has_line_items: !!sessionData.line_items,
          line_items_count: sessionData.line_items?.data?.length || 0,
          has_customer_details: !!sessionData.customer_details,
          sessionData_keys: Object.keys(sessionData),
        });

        // Get cookie data (empty if no consent)
        const cookieData = getTrackingCookie();

        // Use cookie event_id or generate new one
        const eventId = cookieData.event_id || generateEventId();

        // Get fbclid from cookies
        const fbclid = getFbclid();

        // Extract purchase data from session
        const amountTotal = sessionData.amount_total ? sessionData.amount_total / 100 : 0;
        const currency = sessionData.currency?.toUpperCase() || 'USD';

        // Extract product IDs from line items
        const contentIds = sessionData.line_items?.data?.map((item: any) => {
          const product = item.price?.product;
          return typeof product === 'object' ? product.id : product;
        }).filter(Boolean) || [];

        // Build contents array with quantities and prices
        const contents = sessionData.line_items?.data?.map((item: any) => ({
          id: typeof item.price?.product === 'object' ? item.price.product.id : item.price?.product,
          quantity: item.quantity || 1,
          item_price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
        })) || [];

        // Extract metadata for Vercel Analytics
        const metadata = sessionData.metadata || {};
        const products = contentIds;
        const funnelType = metadata.funnel_type || 'unknown';
        const orderBumps = metadata.add_ons_included ? metadata.add_ons_included.split(',') : [];
        const hasOrderBumps = orderBumps.length > 0;

        console.log('Sending Purchase event:', {
          event_id: eventId,
          value: amountTotal,
          currency,
          content_ids: contentIds,
          contents_count: contents.length,
          products,
          funnel_type: funnelType,
          has_order_bumps: hasOrderBumps,
          order_bumps: orderBumps,
          has_customer_email: !!(sessionData.customer_details?.email || sessionData.customer_email || sessionData.customerEmail),
        });

        // 1. Send browser-side Facebook Pixel Purchase event
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Purchase', {
            value: amountTotal,
            currency,
            content_ids: contentIds,
            content_type: 'product',
            num_items: contents.length,
          }, {
            eventID: eventId
          });
          console.log('Browser Purchase event sent with event_id:', eventId);
        } else {
          console.warn('Facebook Pixel not loaded - browser Purchase event not sent');
        }

        // 2. Send server-side CAPI Purchase event
        fetch('/api/facebook-purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_id: eventId,
            value: amountTotal,
            currency,
            content_ids: contentIds,
            contents,
            customer_email: sessionData.customer_details?.email || sessionData.customer_email || sessionData.customerEmail,
            customer_phone: sessionData.customer_details?.phone,
            cookie_data: cookieData,
            fbclid,
            session_url: `https://oracleboxing.com/success/${sessionId}`,
          }),
          keepalive: true,
        }).then(async response => {
          if (response.ok) {
            const result = await response.json();
            console.log('CAPI Purchase event sent successfully:', result);
          } else {
            const error = await response.json();
            console.error('CAPI Purchase event failed:', response.status, error);
          }
        }).catch((error) => {
          console.error('Failed to send CAPI Purchase event:', error);
        });

        // 3. Send Vercel Analytics Purchase event with enriched data
        // Extract product names from line items for better analytics
        const productNames = sessionData.line_items?.data?.map((item: any) => {
          const product = item.price?.product;
          return typeof product === 'object' ? product.name : item.description || 'Unknown Product';
        }).filter(Boolean) || [];

        // Get order bump names from metadata if available
        const orderBumpNames = orderBumps.map((bumpId: string) => {
          // Map order bump IDs to human-readable names
          const bumpNameMap: Record<string, string> = {
            'bffp': 'Boxing from First Principles',
            'tracksuit': 'Oracle Boxing Tracksuit',
            'recordings-vault': 'Recordings Vault',
            'lifetime-bffp': 'Lifetime Masterclass Access',
            'bundle': 'Oracle Boxing Bundle',
            '6wm': '6-Week Membership',
          };
          return bumpNameMap[bumpId] || bumpId;
        });

        trackPurchase({
          value: amountTotal,
          currency,
          transaction_id: sessionId,
          products,
          product_names: productNames,
          product_count: products.length,
          funnel_type: funnelType as any,
          has_order_bumps: hasOrderBumps,
          order_bumps: orderBumps,
          order_bump_names: orderBumpNames,
        });
        console.log('Vercel Analytics Purchase event sent');

        // 4. Track purchase in Supabase (non-blocking)
        const customerName = sessionData.customer_details?.name ||
                            (metadata.customer_first_name && metadata.customer_last_name
                              ? `${metadata.customer_first_name} ${metadata.customer_last_name}`
                              : undefined);
        const customerEmail = sessionData.customer_details?.email || sessionData.customer_email || sessionData.customerEmail || undefined;
        const customerPhone = sessionData.customer_details?.phone || metadata.customer_phone || undefined;

        // Convert amount to USD for consistent analytics
        const amountInUSD = convertToUSD(amountTotal, currency as Currency);

        trackPurchaseToSupabase(
          cookieData.session_id || sessionId,
          amountInUSD,
          'USD', // Always store in USD
          productNames, // Already contains all product names from line items
          {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          }
        );
        console.log('✅ Purchase tracked to Supabase (amount in USD:', amountInUSD, ')');

        // Mark purchase as tracked to prevent duplicates on page refresh
        markPurchaseAsTracked(sessionId);
        console.log('✅ Purchase marked as tracked for session:', sessionId);

      } catch (error) {
        console.error('Error sending Purchase event:', error);
      }
    }

    fetchSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, isPaymentIntent])

  // Countdown and redirect effect
  useEffect(() => {
    if (isLoading || !session) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Build redirect URL with customer info
          const customerEmail = session?.customerEmail || session?.customer_details?.email || ''
          const customerName = session?.customer_details?.name ||
            (session?.metadata?.customer_first_name && session?.metadata?.customer_last_name
              ? `${session.metadata.customer_first_name} ${session.metadata.customer_last_name}`
              : '')

          const params = new URLSearchParams()
          if (customerEmail) params.set('email', customerEmail)
          if (customerName) params.set('name', customerName)

          router.push(`/onboarding${params.toString() ? '?' + params.toString() : ''}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isLoading, session, router])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-[rgba(73,66,61,0.90)]">Loading...</div>
      </div>
    )
  }

  const customerEmail = session?.customerEmail || session?.customer_details?.email || 'your email'

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-[#37322F] mb-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
          Purchase Successful
        </h1>
        <p className="text-[rgba(73,66,61,0.90)] text-lg leading-relaxed mb-6">
          We will email your receipt and further instructions to{' '}
          <span className="font-medium text-[#37322F]">{customerEmail}</span>.
        </p>
        <div className="text-[#847971] text-sm">
          Redirecting to onboarding in <span className="font-semibold text-[#37322F]">{countdown}</span>...
        </div>
      </div>
    </div>
  )
}
