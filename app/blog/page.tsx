"use client"

import Link from "next/link"
import Image from "next/image"
import FooterSection from "@/components/footer-section"

const blogPosts = [
  {
    slug: "boxing-punches-1-6-explained",
    title: "Boxing Punches 1–6 Explained: Perfect Technique for Beginners",
    excerpt:
      "Every punch in boxing comes from the same foundation: stance, shape, and rotation. Here's how to throw all six fundamental punches with proper technique.",
    date: "2025-07-16",
    videoId: "JhkqSCahsNY",
  },
  {
    slug: "head-movement-drills",
    title: "6 Head Movement Drills That Will Make You Impossible to Hit",
    excerpt:
      "Head movement isn't about speed — it's about positioning. Learn the slips, rolls, and pulls that give you built-in defence without thinking about it.",
    date: "2025-07-16",
    videoId: "HVTTZI_7Lvw",
  },
  {
    slug: "beginner-to-boxer-complete-guide",
    title: "Beginner to Boxer: The Complete Guide to Learning Boxing Online",
    excerpt:
      "Most beginners don't have a bad work ethic — they have a bad roadmap. Here's the complete path from your first stance to throwing real combinations.",
    date: "2025-07-16",
    videoId: "oZOXsO_LN7M",
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://sb.oracleboxing.com/Website/icon.webp"
              alt="Oracle Boxing"
              width={32}
              height={32}
              className="rounded"
            />
            <span
              className="text-[#37322F] text-lg font-semibold tracking-tight"
              style={{ fontFamily: "ClashDisplay, sans-serif" }}
            >
              Oracle Boxing
            </span>
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-[1100px] mx-auto px-4 py-12 md:py-20">
        <h1
          className="text-[#37322F] text-3xl md:text-5xl font-semibold tracking-tight mb-4"
          style={{ fontFamily: "ClashDisplay, sans-serif" }}
        >
          Blog
        </h1>
        <p className="text-[#605A57] text-lg mb-12 max-w-[600px]">
          Technical breakdowns, coaching insights, and training guides from the
          Oracle Boxing team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="rounded-xl overflow-hidden border border-[#37322F]/10 transition-all duration-200 hover:border-[#37322F]/25 hover:shadow-lg">
                {/* YouTube Thumbnail */}
                <div className="relative aspect-video bg-[#37322F]/5">
                  <Image
                    src={`https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#37322F]/80 rounded-full flex items-center justify-center group-hover:bg-[#37322F] transition-colors">
                      <svg
                        width="18"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                        className="ml-1"
                      >
                        <path
                          d="M17 10L1 19.5V0.5L17 10Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-[#605A57] text-sm mb-2">
                    {formatDate(post.date)}
                  </p>
                  <h2
                    className="text-[#37322F] text-lg font-semibold leading-snug mb-2 group-hover:text-[#49423D] transition-colors"
                    style={{ fontFamily: "ClashDisplay, sans-serif" }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-[#605A57] text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <FooterSection />
    </div>
  )
}
