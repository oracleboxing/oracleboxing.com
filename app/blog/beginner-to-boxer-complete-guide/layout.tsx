import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Beginner to Boxer: The Complete Guide to Learning Boxing Online | Oracle Boxing",
  description:
    "The complete beginner's roadmap to learning boxing — from stance and shape to rotation, punches, and defence. Learn how online coaching accelerates your progress.",
  openGraph: {
    title: "Beginner to Boxer: The Complete Guide to Learning Boxing Online",
    description:
      "The complete beginner's roadmap to learning boxing — stance, shape, rotation, punches, and how online coaching works.",
    url: "https://oracleboxing.com/blog/beginner-to-boxer-complete-guide",
    siteName: "Oracle Boxing",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://img.youtube.com/vi/oZOXsO_LN7M/maxresdefault.jpg",
        width: 1280,
        height: 720,
        alt: "Beginner to Boxer Complete Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beginner to Boxer: The Complete Guide to Learning Boxing Online",
    description:
      "The complete beginner's roadmap to learning boxing online with proper coaching.",
    images: ["https://img.youtube.com/vi/oZOXsO_LN7M/maxresdefault.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
