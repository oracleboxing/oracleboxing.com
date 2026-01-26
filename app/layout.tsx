import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { CurrencyProvider } from "@/contexts/CurrencyContext"
import PageViewTracker from "@/components/PageViewTracker"
import EngagementTracker from "@/components/EngagementTracker"
import { UTMTracker } from "@/components/UTMTracker"

const FAVICON_BASE = "https://sb.oracleboxing.com/favicons"
const FAVICON_VERSION = "v=3" // Cache buster - increment to force refresh

export const metadata: Metadata = {
  title: "Oracle Boxing",
  description:
    "Learn the fundamental pillars of boxing so that your technique just looks right. 21 days to master what matters.",
  openGraph: {
    title: "Oracle Boxing",
    description: "Learn the fundamental pillars of boxing so that your technique just looks right. 21 days to master what matters.",
    url: "https://oracleboxing.com",
    siteName: "Oracle Boxing",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://sb.oracleboxing.com/Website/skool_art2.webp",
        width: 1200,
        height: 630,
        alt: "Oracle Boxing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oracle Boxing",
    description: "Learn the fundamental pillars of boxing so that your technique just looks right. 21 days to master what matters.",
    images: ["https://sb.oracleboxing.com/Website/skool_art2.webp"],
  },
  icons: {
    icon: [
      { url: `${FAVICON_BASE}/favicon.ico?${FAVICON_VERSION}`, sizes: "any" },
      { url: `${FAVICON_BASE}/favicon-16x16.png?${FAVICON_VERSION}`, sizes: "16x16", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-32x32.png?${FAVICON_VERSION}`, sizes: "32x32", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-48x48.png?${FAVICON_VERSION}`, sizes: "48x48", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-96x96.png?${FAVICON_VERSION}`, sizes: "96x96", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-192x192.png?${FAVICON_VERSION}`, sizes: "192x192", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-512x512.png?${FAVICON_VERSION}`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: `${FAVICON_BASE}/apple-touch-icon.png?${FAVICON_VERSION}`, sizes: "180x180" },
      { url: `${FAVICON_BASE}/apple-touch-icon-152x152.png?${FAVICON_VERSION}`, sizes: "152x152" },
      { url: `${FAVICON_BASE}/apple-touch-icon-144x144.png?${FAVICON_VERSION}`, sizes: "144x144" },
      { url: `${FAVICON_BASE}/apple-touch-icon-120x120.png?${FAVICON_VERSION}`, sizes: "120x120" },
      { url: `${FAVICON_BASE}/apple-touch-icon-114x114.png?${FAVICON_VERSION}`, sizes: "114x114" },
      { url: `${FAVICON_BASE}/apple-touch-icon-76x76.png?${FAVICON_VERSION}`, sizes: "76x76" },
      { url: `${FAVICON_BASE}/apple-touch-icon-72x72.png?${FAVICON_VERSION}`, sizes: "72x72" },
      { url: `${FAVICON_BASE}/apple-touch-icon-60x60.png?${FAVICON_VERSION}`, sizes: "60x60" },
      { url: `${FAVICON_BASE}/apple-touch-icon-57x57.png?${FAVICON_VERSION}`, sizes: "57x57" },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#3d3830",
    "msapplication-TileImage": `${FAVICON_BASE}/mstile-144x144.png?${FAVICON_VERSION}`,
    "msapplication-config": `${FAVICON_BASE}/browserconfig.xml`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#3d3830" />
      </head>
      <body className="font-sans antialiased">
        <CurrencyProvider>
          <Analytics />
          <UTMTracker />
          <PageViewTracker />
          <EngagementTracker />
          {children}
          <Toaster position="top-center" richColors />
        </CurrencyProvider>
      </body>
    </html>
  )
}
