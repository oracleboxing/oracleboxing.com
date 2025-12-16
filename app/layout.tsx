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
    icon: { url: 'https://sb.oracleboxing.com/infinity_squared_white.svg', type: 'image/svg+xml' },
    apple: 'https://sb.oracleboxing.com/infinity_squared_white.svg',
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
        url: 'https://sb.oracleboxing.com/Website/skool_art.webp',
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
    images: ['https://sb.oracleboxing.com/Website/skool_art.webp'],
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

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="https://sb.oracleboxing.com/infinity_squared_white.svg" />

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
