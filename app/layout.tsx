import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { CurrencyProvider } from "@/contexts/CurrencyContext"
import { ExperimentProvider } from "@/contexts/ExperimentContext"
import PageViewTracker from "@/components/PageViewTracker"
import EngagementTracker from "@/components/EngagementTracker"
import { UTMTracker } from "@/components/UTMTracker"
import { GoogleAdsTag } from "@/components/GoogleAdsTag"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-inter",
})

const FAVICON_BASE = "https://sb.oracleboxing.com/favicons"
const FAVICON_VERSION = "v=3" // Cache buster - increment to force refresh

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: "Oracle Boxing",
  description:
    "Online boxing coaching with structured courses, grading system, and personal feedback from expert coaches. Train smarter, move better.",
  openGraph: {
    title: "Oracle Boxing",
    description: "Online boxing coaching with structured courses, grading system, and personal feedback from expert coaches. Train smarter, move better.",
    url: "https://oracleboxing.com",
    siteName: "Oracle Boxing",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://sb.oracleboxing.com/Website/skool_art2.jpg",
        width: 1200,
        height: 630,
        alt: "Oracle Boxing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oracle Boxing",
    description: "Online boxing coaching with structured courses, grading system, and personal feedback from expert coaches. Train smarter, move better.",
    images: ["https://sb.oracleboxing.com/Website/skool_art2.jpg"],
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

// JSON-LD structured data for AI search optimization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://oracleboxing.com/#organization",
  name: "Oracle Boxing",
  url: "https://oracleboxing.com",
  logo: {
    "@type": "ImageObject",
    url: "https://sb.oracleboxing.com/logo/icon_dark.webp",
    width: 512,
    height: 512,
  },
  description:
    "Oracle Boxing is the world's leading online boxing coaching platform, teaching beginners the fundamentals of boxing through structured live coaching, video feedback, and community.",
  founder: [
    { "@type": "Person", name: "Oliver Betts", jobTitle: "Co-Founder & Head Coach" },
    { "@type": "Person", name: "Jordan Lyne", jobTitle: "Co-Founder" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "500",
  },
  sameAs: [
    "https://www.youtube.com/@OracleBoxing",
  ],
}

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Oracle Boxing 21-Day Challenge",
  description:
    "A structured 21-day boxing fundamentals program with live coaching calls, personalised video feedback, follow-along workouts, and a money-back guarantee. Learn the 3 Pillars of Boxing: Stance, Shape, and Rotation.",
  provider: { "@id": "https://oracleboxing.com/#organization" },
  url: "https://oracleboxing.com",
  offers: {
    "@type": "Offer",
    price: "147",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    instructor: [
      { "@type": "Person", name: "Oliver Betts" },
      { "@type": "Person", name: "Antonio Troni" },
      { "@type": "Person", name: "Charlie Snider" },
    ],
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Oracle Boxing",
  url: "https://oracleboxing.com",
  publisher: { "@id": "https://oracleboxing.com/#organization" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <meta name="theme-color" content="#3d3830" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NXKTDCT5"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <CurrencyProvider>
          <ExperimentProvider>
            <Analytics />
            <GoogleAdsTag />
            <UTMTracker />
            <PageViewTracker />
            <EngagementTracker />
            {children}
            <Toaster position="top-center" richColors />
          </ExperimentProvider>
        </CurrencyProvider>
      </body>
    </html>
  )
}
