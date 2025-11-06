import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oracle Boxing | Courses | Coaching | Community",
  description: "Master Old School Boxing Anytime, Anywhere",
  keywords: "boxing courses, boxing training, online boxing, boxing masterclass, boxing coaching, oracle boxing",
  authors: [{ name: "Oracle Boxing" }],
  creator: "Oracle Boxing",
  publisher: "Oracle Boxing",
  metadataBase: new URL('https://oracleboxing.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: 'https://media.oracleboxing.com/Website/favicon.ico' },
      { url: 'https://media.oracleboxing.com/Website/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: 'https://media.oracleboxing.com/Website/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: 'https://media.oracleboxing.com/Website/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: 'https://media.oracleboxing.com/Website/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: 'https://media.oracleboxing.com/Website/android-chrome-512x512.png' },
    ],
  },
  openGraph: {
    title: "Oracle Boxing | Courses | Coaching | Community",
    description: "Master Old School Boxing Anytime, Anywhere",
    url: 'https://oracleboxing.com',
    siteName: 'Oracle Boxing',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://media.oracleboxing.com/Website/optimized/products/obm_tn-large.webp',
        width: 1200,
        height: 630,
        alt: 'Oracle Boxing - Master Old School Boxing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Oracle Boxing | Courses | Coaching | Community",
    description: "Master Old School Boxing Anytime, Anywhere",
    images: ['https://media.oracleboxing.com/Website/optimized/products/obm_tn-large.webp'],
  },
};

import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Toaster } from "sonner";
import { UTMTracker } from "@/components/UTMTracker";
import PageViewTracker from "@/components/PageViewTracker";
import { CookieBanner } from "@/components/CookieBanner";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NXKTDCT5');`
        }} />
        {/* End Google Tag Manager */}

        {/* Facebook Pixel */}
        <script dangerouslySetInnerHTML={{
          __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          // Generate event_id for deduplication
          var pageViewEventId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);

          // Initialize with autoConfig: false and agent: 'plnextjs' to disable automatic PageView tracking
          fbq('init', '1474540100541059', {}, {
            autoConfig: false,
            agent: 'plnextjs'
          });
          fbq('track', 'PageView', {}, { eventID: pageViewEventId });

          // Store event_id globally for server-side tracking
          window._fbPageViewEventId = pageViewEventId;
        `
        }} />
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=1474540100541059&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Facebook Pixel */}

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QL4S6JCWK7"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QL4S6JCWK7');
        `
        }} />

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NXKTDCT5"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <UTMTracker />
        <PageViewTracker />
        <CurrencyProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" />
            <CookieBanner />
          </CartProvider>
        </CurrencyProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
