import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Oracle Boxing",
  description:
    "Technical breakdowns, coaching insights, and training guides from the Oracle Boxing team. Learn boxing fundamentals the right way.",
  openGraph: {
    title: "Blog | Oracle Boxing",
    description:
      "Technical breakdowns, coaching insights, and training guides from the Oracle Boxing team.",
    url: "https://oracleboxing.com/blog",
    siteName: "Oracle Boxing",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://sb.oracleboxing.com/Website/skool_art2.webp",
        width: 1200,
        height: 630,
        alt: "Oracle Boxing Blog",
      },
    ],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
