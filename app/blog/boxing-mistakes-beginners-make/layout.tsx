import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "7 Boxing Mistakes That Ruin Your Fundamentals (And How to Fix Them) | Oracle Boxing",
  description:
    "The real mistakes holding back your boxing aren't the obvious ones. Learn the 7 fundamental errors most beginners don't even know they're making - and exactly how to fix each one.",
  openGraph: {
    title: "7 Boxing Mistakes That Ruin Your Fundamentals (And How to Fix Them)",
    description:
      "The real mistakes holding back your boxing aren't the obvious ones. Weight distribution, hip mechanics, shape, and relaxation - here's what's actually going wrong.",
    url: "https://oracleboxing.com/blog/boxing-mistakes-beginners-make",
    siteName: "Oracle Boxing",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://sb.oracleboxing.com/Website/skool_art2.webp",
        width: 1200,
        height: 630,
        alt: "7 Boxing Mistakes That Ruin Your Fundamentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "7 Boxing Mistakes That Ruin Your Fundamentals (And How to Fix Them)",
    description:
      "The real mistakes holding back your boxing aren't the obvious ones. Here's what's actually going wrong and how to fix it.",
    images: ["https://sb.oracleboxing.com/Website/skool_art2.webp"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
