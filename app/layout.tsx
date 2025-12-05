import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Oracle Boxing",
    template: "%s"
  },
  description: "Transform your boxing with expert courses, live coaching, and a thriving community. Master the fundamentals, techniques, and tactics of old school boxing.",
  keywords: "boxing courses, boxing training, online boxing, boxing masterclass, boxing coaching, oracle boxing, learn boxing online, boxing fundamentals",
  authors: [{ name: "Oracle Boxing" }],
  creator: "Oracle Boxing",
  publisher: "Oracle Boxing",
  metadataBase: new URL('https://oracleboxing.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/apple-touch-icon-167x167.png', sizes: '167x167' },
    ],
    other: [
      { rel: 'icon', url: '/favicons/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicons/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Oracle Boxing",
    description: "Transform your boxing with expert courses, live coaching, and a thriving community.",
    url: 'https://oracleboxing.com',
    siteName: 'Oracle Boxing',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://media.oracleboxing.com/Website/skool_art.webp',
        width: 1200,
        height: 630,
        alt: 'Oracle Boxing - Master Old School Boxing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Oracle Boxing",
    description: "Transform your boxing with expert courses, live coaching, and a thriving community.",
    images: ['https://media.oracleboxing.com/Website/skool_art.webp'],
    creator: '@oracleboxing',
  },
};

import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Toaster } from "sonner";
import { UTMTracker } from "@/components/UTMTracker";
import PageViewTracker from "@/components/PageViewTracker";
import { CookieBanner } from "@/components/CookieBanner";
import { ThirdPartyScripts } from "@/components/ThirdPartyScripts";
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Favicons - explicit links for Safari compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png" />

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

        {/* Load tracking scripts after hydration */}
        <ThirdPartyScripts />

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
