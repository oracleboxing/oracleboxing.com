import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { CurrencyProvider } from "@/contexts/CurrencyContext"

const FAVICON_BASE = "https://sb.oracleboxing.com/favicons"

export const metadata: Metadata = {
  title: "Oracle Boxing",
  description:
    "Learn the fundamental pillars of boxing so that your technique just looks right. 21 days to master what matters.",
  icons: {
    icon: [
      { url: `${FAVICON_BASE}/favicon.ico`, sizes: "any" },
      { url: `${FAVICON_BASE}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-48x48.png`, sizes: "48x48", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-96x96.png`, sizes: "96x96", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-192x192.png`, sizes: "192x192", type: "image/png" },
      { url: `${FAVICON_BASE}/favicon-512x512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: `${FAVICON_BASE}/apple-touch-icon.png`, sizes: "180x180" },
      { url: `${FAVICON_BASE}/apple-touch-icon-152x152.png`, sizes: "152x152" },
      { url: `${FAVICON_BASE}/apple-touch-icon-144x144.png`, sizes: "144x144" },
      { url: `${FAVICON_BASE}/apple-touch-icon-120x120.png`, sizes: "120x120" },
      { url: `${FAVICON_BASE}/apple-touch-icon-114x114.png`, sizes: "114x114" },
      { url: `${FAVICON_BASE}/apple-touch-icon-76x76.png`, sizes: "76x76" },
      { url: `${FAVICON_BASE}/apple-touch-icon-72x72.png`, sizes: "72x72" },
      { url: `${FAVICON_BASE}/apple-touch-icon-60x60.png`, sizes: "60x60" },
      { url: `${FAVICON_BASE}/apple-touch-icon-57x57.png`, sizes: "57x57" },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#3d3830",
    "msapplication-TileImage": `${FAVICON_BASE}/mstile-144x144.png`,
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://sb.oracleboxing.com/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://sb.oracleboxing.com/favicons/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="https://sb.oracleboxing.com/favicons/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased">
        <CurrencyProvider>
          {children}
          <Toaster position="top-center" richColors />
        </CurrencyProvider>
      </body>
    </html>
  )
}
