import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Boxing Punches 1–6 Explained: Perfect Technique for Beginners | Oracle Boxing",
  description:
    "Learn how to throw all 6 fundamental boxing punches — jab, cross, lead hook, rear hook, lead uppercut, and rear uppercut — with proper technique built on stance, shape, and rotation.",
  openGraph: {
    title: "Boxing Punches 1–6 Explained: Perfect Technique for Beginners",
    description:
      "Learn how to throw all 6 fundamental boxing punches with proper technique built on stance, shape, and rotation.",
    url: "https://oracleboxing.com/blog/boxing-punches-1-6-explained",
    siteName: "Oracle Boxing",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://img.youtube.com/vi/JhkqSCahsNY/maxresdefault.jpg",
        width: 1280,
        height: 720,
        alt: "Boxing Punches 1-6 Explained",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boxing Punches 1–6 Explained: Perfect Technique for Beginners",
    description:
      "Learn how to throw all 6 fundamental boxing punches with proper technique.",
    images: ["https://img.youtube.com/vi/JhkqSCahsNY/maxresdefault.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
