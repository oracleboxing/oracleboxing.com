import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Boxing Footwork Fundamentals: Movement, Pivots, and the Petal Drill | Oracle Boxing",
  description:
    "Boxing footwork is a game of inches. Learn the fundamental movement patterns, pivots, angles, and the petal drill that will transform how you move in the ring.",
  openGraph: {
    title: "Boxing Footwork Fundamentals: Movement, Pivots, and the Petal Drill",
    description:
      "Boxing footwork is a game of inches. Learn fundamental movement patterns, pivots, angles, and the drills that transform your ring movement.",
    url: "https://oracleboxing.com/blog/boxing-footwork-fundamentals",
    siteName: "Oracle Boxing",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://sb.oracleboxing.com/Website/skool_art2.webp",
        width: 1200,
        height: 630,
        alt: "Boxing Footwork Fundamentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boxing Footwork Fundamentals: Movement, Pivots, and the Petal Drill",
    description:
      "Boxing footwork is a game of inches. Learn the movement patterns, pivots, and drills that transform how you move in the ring.",
    images: ["https://sb.oracleboxing.com/Website/skool_art2.webp"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
