import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "6 Head Movement Drills That Will Make You Impossible to Hit | Oracle Boxing",
  description:
    "Master slips, rolls, and pulls with 6 boxing head movement drills. Learn why positioning matters more than speed, and how your shape creates built-in defence.",
  openGraph: {
    title: "6 Head Movement Drills That Will Make You Impossible to Hit",
    description:
      "Master slips, rolls, and pulls with 6 boxing head movement drills that build on proper stance and shape.",
    url: "https://oracleboxing.com/blog/head-movement-drills",
    siteName: "Oracle Boxing",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://img.youtube.com/vi/HVTTZI_7Lvw/maxresdefault.jpg",
        width: 1280,
        height: 720,
        alt: "6 Head Movement Drills",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "6 Head Movement Drills That Will Make You Impossible to Hit",
    description:
      "Master slips, rolls, and pulls with 6 boxing head movement drills.",
    images: ["https://img.youtube.com/vi/HVTTZI_7Lvw/maxresdefault.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
