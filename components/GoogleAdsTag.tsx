'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const GTM_ID = 'GTM-NXKTDCT5'
const GA_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-L6KY3Q6RDF'

function GoogleAdsTagInternal() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views on SPA navigation via dataLayer
  useEffect(() => {
    if (typeof window === 'undefined') return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    // Push page_view to dataLayer for GTM
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
    })

    // Also fire via gtag if available (for Google Ads config)
    if (GA_ADS_ID && typeof window.gtag === 'function') {
      window.gtag('config', GA_ADS_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function GoogleAdsTag() {
  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
        }}
      />
      {/* Keep gtag function available for existing event calls */}
      <Script
        id="gtag-compat"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            ${GA4_ID ? `gtag('config', '${GA4_ID}');` : ''}
            ${GA_ADS_ID ? `gtag('config', '${GA_ADS_ID}', { send_page_view: false });` : ''}
          `,
        }}
      />
      {/* SPA page view tracking */}
      <Suspense fallback={null}>
        <GoogleAdsTagInternal />
      </Suspense>
    </>
  )
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
