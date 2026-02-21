'use client'

import Script from 'next/script'

export function ThirdPartyScripts() {
  return (
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

        var pageViewEventId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
        fbq('init', '1474540100541059');
        fbq('track', 'PageView', {}, { eventID: pageViewEventId });
        window._fbPageViewEventId = pageViewEventId;
        `
      }}
    />
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    fbq: any
  }
}
