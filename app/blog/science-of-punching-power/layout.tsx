import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Science of Punching Power: Rotation, Relaxation, and the Kinetic Chain | Oracle Boxing",
  description:
    "Punching power doesn't come from your arms. Learn how rotation, the kinetic chain, hip mechanics, and relaxation generate knockout power in boxing.",
  openGraph: {
    title: "The Science of Punching Power: Rotation, Relaxation, and the Kinetic Chain",
    description:
      "Punching power doesn't come from your arms. Learn the biomechanics of power generation in boxing - rotation, kinetic chain, and why relaxation matters more than muscle.",
    url: "https://oracleboxing.com/blog/science-of-punching-power",
    siteName: "Oracle Boxing",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://sb.oracleboxing.com/Website/skool_art2.webp",
        width: 1200,
        height: 630,
        alt: "The Science of Punching Power",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Science of Punching Power: Rotation, Relaxation, and the Kinetic Chain",
    description:
      "Punching power doesn't come from your arms. Learn the real biomechanics behind knockout power.",
    images: ["https://sb.oracleboxing.com/Website/skool_art2.webp"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
