'use client'

import React, { useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { fbInitiateCheckout } from "@/lib/fbpixel";
import { getCheckoutUrl } from "@/lib/checkout";
import { getOrInitTrackingData, updateTrackingData, generateEventId } from "@/lib/tracking-cookies";
import { useAnalytics } from "@/hooks/useAnalytics";

interface EpicCTAButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  asChild?: boolean;
  trackingName?: string; // For Vercel Analytics tracking
}

export function EpicCTAButton({ 
  children, 
  className, 
  size = "md",
  href,
  onClick,
  asChild = false,
  trackingName
}: EpicCTAButtonProps) {
  const { trackInitiateCheckout } = useAnalytics();
  
  // Debug logging
  useEffect(() => {
    if (typeof window !== 'undefined' && trackingName) {
      console.log(`Button ${trackingName} - href:`, href);
    }
  }, [href, trackingName]);
  
  // Generate checkout URL with UTM parameters and event_id if this is a checkout button
  const finalHref = useMemo(() => {
    // Only process checkout URLs on client side
    if (typeof window === 'undefined') {
      return href;
    }
    
    if (href && (href.includes('checkout.oracleboxing.com') || href.includes('buy.stripe.com'))) {
      // Get tracking data to add event_id to URL
      const trackingData = getOrInitTrackingData();
      let url = getCheckoutUrl(trackingName);
      
      // Add event_id to the URL
      if (trackingData.event_id) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('event_id', trackingData.event_id);
        url = urlObj.toString();
      }
      
      console.log(`Generated URL for ${trackingName}:`, url);
      return url;
    }
    return href;
  }, [href, trackingName]);
  
  // Check if this is a checkout button
  const isCheckoutButton = useMemo(() => {
    return trackingName && (href?.includes('buy.stripe.com') || href?.includes('checkout.oracleboxing.com'));
  }, [trackingName, href]);
  
  const handleClick = (e?: React.MouseEvent) => {
    // Track add_to_cart event when CTA button is clicked
    if (trackingName) {
      // Generate event_id for deduplication
      const addToCartEventId = generateEventId();

      // GA4 Tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: 197,
          items: [{
            item_id: '6WC',
            item_name: '6-Week Challenge',
            price: 197,
            quantity: 1,
            item_category: 'Training Program'
          }]
        });
      }

      // Facebook Pixel Tracking - Use AddToCart with event_id
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
          content_ids: ['6WC'],
          content_name: '6-Week Challenge',
          content_type: 'product',
          value: 197,
          currency: 'USD',
          button_location: trackingName
        }, {
          eventID: addToCartEventId
        });
        console.log('📱 Facebook Pixel AddToCart event sent with event_id:', addToCartEventId);
      }

      // Get tracking cookie data and fbclid for Facebook CAPI
      let cookieData = {};
      let fbclid = null;

      if (typeof document !== 'undefined') {
        // Get tracking cookie
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        const obTrackCookie = cookies['ob_track'];
        if (obTrackCookie) {
          try {
            cookieData = JSON.parse(decodeURIComponent(obTrackCookie));
          } catch (e) {
            console.warn('Failed to parse tracking cookie:', e);
          }
        }

        // Get fbclid
        fbclid = cookies['fbclid'] || null;
      }

      // Send to Facebook Conversions API (server-side)
      fetch('/api/facebook-addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: addToCartEventId,
          content_ids: ['6WC'],
          content_name: '6-Week Challenge',
          value: 197,
          currency: 'USD',
          button_location: trackingName,
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          cookie_data: cookieData,
          fbclid: fbclid,
        }),
        keepalive: true,
      }).catch((error) => {
        console.error('Failed to send AddToCart to Facebook CAPI:', error);
      });

      // Vercel Analytics
      if (typeof window !== 'undefined' && (window as any).va) {
        (window as any).va('track', 'add_to_cart', {
          product: '6WC',
          value: 197,
          location: trackingName
        });
      }

      console.log('Tracking AddToCart (Epic CTA):', {
        event_id: addToCartEventId,
        value: 197,
        location: trackingName
      });
    }

    // Scroll to pricing section with smooth animation
    if (typeof window !== 'undefined') {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Call onClick callback if provided
    if (onClick) {
      onClick();
    }
  };
  const sizeClasses = {
    sm: "min-h-9 px-5 text-sm py-1.5",
    md: "min-h-10 px-6 text-sm py-1.5",
    lg: "py-3 sm:py-4 lg:py-5 px-8 sm:px-10 lg:px-12 text-base sm:text-lg lg:text-xl"
  };

  const buttonContent = (
    <>
      <span className="font-black">{children}</span>
    </>
  );

  const buttonClasses = cn(
    "inline-flex items-center justify-center",
    "bg-yellow-100 hover:bg-black",
    "text-black hover:text-white font-black",
    "border-4 border-black",
    "rounded-xl",
    "transition-colors duration-300",
    "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
    "cursor-pointer",
    "animate-bounce-subtle",
    "uppercase tracking-wide",
    sizeClasses[size],
    className
  );

  const buttonStyle = {
    fontFamily: 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    cursor: 'pointer'
  };

  if (asChild) {
    return (
      <div className={buttonClasses} style={buttonStyle} onClick={handleClick}>
        {buttonContent}
      </div>
    );
  }

  if (href) {
    return (
      <a href={finalHref} className={buttonClasses} style={buttonStyle} onClick={handleClick}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button className={buttonClasses} style={buttonStyle} onClick={handleClick}>
      {buttonContent}
    </button>
  );
}
