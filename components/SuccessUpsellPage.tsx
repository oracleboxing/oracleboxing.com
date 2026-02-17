'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { CoachingUpsell } from '@/components/CoachingUpsell';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { getCookie } from '@/lib/tracking-cookies';
import { COACHING_PRODUCT_1MONTH, COACHING_PRICE_1MONTH } from '@/lib/coaching-pricing';

interface SuccessUpsellPageProps {
  isMembership?: boolean;
}

export const SuccessUpsellPage: React.FC<SuccessUpsellPageProps> = ({ isMembership = false }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  // Get session ID from URL
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!sessionId) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`/api/session?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok) {
          setOrderData(data);

          // Check if this is a membership purchase by looking at the product metadata
          // Memberships have funnel: 'membership' in their metadata
          console.log('Order data:', data);

          // Send Facebook Purchase event
          await sendPurchaseEvent(data, sessionId);
        } else {
          console.error('Failed to fetch session:', data.error);
          toast.error('Failed to load order details');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setIsLoadingOrder(false);
      }
    };

    const sendPurchaseEvent = async (sessionData: any, sessionId: string) => {
      try {
        console.log('🔍 Session data received for Purchase tracking:', {
          has_amount_total: !!sessionData.amount_total,
          has_line_items: !!sessionData.line_items,
          line_items_count: sessionData.line_items?.data?.length || 0,
          has_customer_details: !!sessionData.customer_details,
          sessionData_keys: Object.keys(sessionData),
        });

        // Get tracking cookie data (getCookie already returns parsed object)
        const cookieData = getCookie('ob_track') || {};

        // Generate or use event_id for deduplication
        const eventId = cookieData.event_id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Get fbclid from cookies
        const getFbclid = (): string | null => {
          if (typeof document === 'undefined') return null;
          const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
          }, {} as Record<string, string>);
          return cookies['fbclid'] || null;
        };
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

        console.log('📊 Sending Purchase event:', {
          event_id: eventId,
          value: amountTotal,
          currency,
          content_ids: contentIds,
          contents_count: contents.length,
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
          console.log('📱 Browser Purchase event sent with event_id:', eventId);
        } else {
          console.warn('⚠️ Facebook Pixel not loaded - browser Purchase event not sent');
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
            session_url: `https://oracleboxing.com/success?session_id=${sessionId}`,
          }),
          keepalive: true,
        }).then(async response => {
          if (response.ok) {
            const result = await response.json();
            console.log('✅ CAPI Purchase event sent successfully:', result);
          } else {
            const error = await response.json();
            console.error('❌ CAPI Purchase event failed:', response.status, error);
          }
        }).catch((error) => {
          console.error('❌ Failed to send CAPI Purchase event:', error);
        });

        // 3. Send Google Ads Purchase event
        try {
          const { gtagPurchase, gtagSetUserData } = await import('@/lib/gtag')

          gtagSetUserData({
            email: sessionData.customer_details?.email || sessionData.customer_email || sessionData.customerEmail,
            phone_number: sessionData.customer_details?.phone,
          })

          const gtagItems = sessionData.line_items?.data?.map((item: any) => ({
            item_id: typeof item.price?.product === 'object' ? item.price.product.id : item.price?.product || 'unknown',
            item_name: typeof item.price?.product === 'object' ? item.price.product.name : item.description || 'Unknown Product',
            price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
            quantity: item.quantity || 1,
          })) || []

          gtagPurchase({
            transaction_id: sessionId || 'unknown',
            value: amountTotal,
            currency: currency,
            items: gtagItems,
          })

          console.log('📊 Google Ads Purchase event sent (upsell page)')
        } catch (e) {
          console.warn('Failed to send Google Ads purchase (upsell):', e)
        }

      } catch (error) {
        console.error('Error sending Purchase event:', error);
      }
    };

    fetchOrderData();
  }, [sessionId, router]);

  const handleAcceptUpsell = async () => {
    setIsLoading(true);
    try {
      if (!orderData) return;

      // Determine if this is a membership purchase
      const isMembershipPurchase = orderData.productMetadata?.funnel === 'membership';

      // Get the original purchase currency
      const purchaseCurrency = orderData.currency || 'USD';

      // Determine the price ID based on membership status and currency
      // Using environment variable for 1-Month Coaching price (multicurrency)
      const priceId = COACHING_PRICE_1MONTH;
      const productId = COACHING_PRODUCT_1MONTH;

      console.log('🔍 Upsell request:', {
        isMembershipPurchase,
        purchaseCurrency,
        priceId,
        productId,
        sessionId
      });

      // Get cookie data
      const cookieData = getCookie('ob_track')

      // Use the one-click charge endpoint with the correct product
      const response = await fetch('/api/upsell/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          price_id: priceId,
          product_id: productId,
          // Pass through tracking params from original session
          trackingParams: orderData.trackingParams,
          cookieData: cookieData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process upsell');
      }

      // Handle 3DS authentication if required
      if (data.requires_action && data.client_secret) {
        toast.error('Additional authentication required. Please try again.');
        setIsLoading(false);
        return;
      }

      // If successful, redirect to final success page with original session ID
      if (data.success) {
        toast.success('Coaching added successfully!');
        router.push(`/success/final?session_id=${sessionId}`);
      }
    } catch (error: any) {
      console.error('Upsell error:', error);
      toast.error(error.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  const handleDeclineUpsell = () => {
    // Check what they purchased to determine which page to show
    // Course-only purchases: Boxing Roadmap, BFFP (without 6WC membership), OBM (without 3-month membership)
    // Community purchases: 6WC, Membership, or courses WITH membership upgrades

    const productName = orderData?.productPurchased?.toLowerCase() || '';
    const cartItems = orderData?.metadata?.cart_items;

    // Check if they have any community/membership access
    const hasCommunityAccess =
      productName.includes('6-week challenge') ||
      productName.includes('6wc') ||
      productName.includes('membership') ||
      (cartItems && (
        cartItems.includes('6wc') ||
        cartItems.includes('membership') ||
        cartItems.includes('6-week-membership') ||
        cartItems.includes('3-month-membership')
      ));

    if (hasCommunityAccess) {
      // Has community access (6WC, membership, challenge) - show personal onboarding call booking
      router.push(`/success/challenge-only?session_id=${sessionId}`);
    } else {
      // Course-only purchase - show course onboarding call booking
      router.push(`/success/course-only?session_id=${sessionId}`);
    }
  };

  if (isLoadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="grid lg:grid-cols-2 flex-1">
        {/* Left Side - Order Confirmation */}
        <OrderConfirmation
          customerName={orderData.customerName}
          customerEmail={orderData.customerEmail}
          amountPaid={orderData.amountPaid}
          productPurchased={orderData.productPurchased}
          currency={orderData.currency}
        />

        {/* Next Step Notice - Mobile Only (between sections) */}
        <div className="lg:hidden bg-white p-4 sm:p-5 mx-4 sm:mx-6 my-6 rounded-lg border border-gray-200">
          <p className="text-body text-black leading-relaxed">
            <strong>Next Step:</strong> Read the information below and then click one of the buttons to continue to the next page.
          </p>
        </div>

        {/* Right Side - Coaching Upsell */}
        <CoachingUpsell
          normalPrice={1200} // Normal 3-month price per month
          discountedPrice={397} // Special 1-month trial price
          onAccept={handleAcceptUpsell}
          onDecline={handleDeclineUpsell}
          isLoading={isLoading}
          purchaseCurrency={orderData.currency}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
