'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function ThirdPartyScripts() {
  useEffect(() => {
    // Initialize Facebook Pixel after component mounts
    if (typeof window !== 'undefined' && window.fbq) {
      // Generate event_id for deduplication
      const pageViewEventId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9)

      // Initialize with autoConfig: false to disable automatic PageView tracking
      window.fbq('init', '1474540100541059', {}, {
        autoConfig: false,
        agent: 'plnextjs'
      })
      window.fbq('track', 'PageView', {}, { eventID: pageViewEventId })

      // Store event_id globally for server-side tracking
      ;(window as any)._fbPageViewEventId = pageViewEventId
    }
  }, [])

  return (
    <>
      {/* Facebook Pixel - Load after hydration */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
        `
        }}
      />
    </>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    fbq: any
  }
}
