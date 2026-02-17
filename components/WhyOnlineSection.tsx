"use client"

import { useState } from "react"

type Rating = "good" | "variable" | "poor"

interface Method {
  name: string
  feedback: Rating
  timeInvested: Rating
  price: Rating
  informationQuality: Rating
  communityQuality: Rating
  sparringAccess: Rating
}

const methods: Method[] = [
  {
    name: "YouTube Self-Study",
    feedback: "poor",
    timeInvested: "poor",
    price: "good",
    informationQuality: "good",
    communityQuality: "poor",
    sparringAccess: "poor",
  },
  {
    name: "Local Boxing Gym",
    feedback: "variable",
    timeInvested: "variable",
    price: "good",
    informationQuality: "variable",
    communityQuality: "variable",
    sparringAccess: "good",
  },
  {
    name: "1-on-1 Personal Trainer",
    feedback: "variable",
    timeInvested: "good",
    price: "poor",
    informationQuality: "variable",
    communityQuality: "poor",
    sparringAccess: "poor",
  },
  {
    name: "Online Coaching",
    feedback: "good",
    timeInvested: "good",
    price: "good",
    informationQuality: "good",
    communityQuality: "good",
    sparringAccess: "variable",
  },
]

const categories = [
  { key: "feedback", label: "Feedback" },
  { key: "timeInvested", label: "Time" },
  { key: "price", label: "Price" },
  { key: "informationQuality", label: "Info Quality" },
  { key: "communityQuality", label: "Community" },
  { key: "sparringAccess", label: "Sparring" },
]

function RatingDot({ rating }: { rating: Rating }) {
  const colors = {
    good: "bg-[#37322F]",
    variable: "bg-[#9a928d]",
    poor: "bg-[#d4cfc9]",
  }

  return (
    <div className={`w-3 h-3 rounded-full ${colors[rating]}`} />
  )
}

function RatingCell({ rating }: { rating: Rating }) {
  const colors = {
    good: "bg-[#37322F]",
    variable: "bg-[#9a928d]",
    poor: "bg-[#d4cfc9]",
  }

  return (
    <div className="flex justify-center">
      <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${colors[rating]}`} />
    </div>
  )
}

export default function WhyOnlineSection() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">

        {/* Mobile: stacked */}
        <div className="md:hidden">
          <div className="text-center mb-8">
            <h2 className="text-[#37322F] text-hero font-normal mb-4">
              The Fastest Way to Learn Boxing
            </h2>
            <p className="text-[#605A57] text-sub">
              We compared every method across 6 key factors. The results speak for themselves.
            </p>
          </div>

          {showVideo ? (
            <>
              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
                <video src="https://sb.oracleboxing.com/Website/vsl.webm" controls autoPlay className="w-full h-full" />
              </div>
              <div className="text-center mt-6">
                <button onClick={() => setShowVideo(false)} className="inline-flex items-center gap-2 text-[#605A57] text-body font-medium hover:underline">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Back to comparison
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl overflow-hidden" style={{
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(16px) saturate(1.3)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}>
                {methods.map((method) => (
                  <div key={method.name} className={`p-4 last:border-b-0 ${method.name === "Online Coaching" ? "bg-white/40" : ""}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-medium ${method.name === "Online Coaching" ? "text-[#37322F] font-semibold" : "text-[#605A57]"}`}>
                        {method.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <div key={cat.key} className="flex items-center gap-2">
                          <RatingDot rating={method[cat.key as keyof Method] as Rating} />
                          <span className="text-xs text-[#605A57]">{cat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 text-body text-[#605A57]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#37322F]" /><span>Good</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#9a928d]" /><span>Variable</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#d4cfc9]" /><span>Poor</span></div>
              </div>

              <div className="text-center mt-8">
                <button onClick={() => setShowVideo(true)} className="inline-flex items-center gap-2 text-[#37322F] font-medium hover:underline">
                  See the full breakdown
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Desktop: 2 columns full width */}
        <div className="hidden md:flex items-center gap-10 lg:gap-14">
          {/* Left column - text */}
          <div className="w-5/12 flex-shrink-0">
            <h2 className="text-[#37322F] text-hero font-normal mb-4">
              The Fastest Way to Learn Boxing
            </h2>
            <p className="text-[#605A57] text-sub">
              We compared every method across 6 key factors. The results speak for themselves.
            </p>
          </div>

          {/* Right column - table */}
          <div className="w-7/12">
            {showVideo ? (
              <>
                <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-sm">
                  <video src="https://sb.oracleboxing.com/Website/vsl.webm" controls autoPlay className="w-full h-full" />
                </div>
                <div className="text-center mt-6">
                  <button onClick={() => setShowVideo(false)} className="inline-flex items-center gap-2 text-[#605A57] text-body font-medium hover:underline">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Back to comparison
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(16px) saturate(1.3)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#37322F]/10">
                      <th className="text-left p-4 text-[#37322F] font-semibold">Method</th>
                      {categories.map((cat) => (
                        <th key={cat.key} className="p-4 text-[#605A57] font-medium text-body text-center">
                          {cat.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {methods.map((method) => (
                      <tr
                        key={method.name}
                        className={`border-b border-[#37322F]/5 last:border-b-0 ${method.name === "Online Coaching" ? "bg-[#37322F]/[0.03]" : ""}`}
                        style={method.name === "Online Coaching" ? { borderLeft: '3px solid #9CABA8' } : {}}
                      >
                        <td className="p-4">
                          <span className={`font-medium ${method.name === "Online Coaching" ? "text-[#37322F] font-semibold" : "text-[#605A57]"}`}>
                            {method.name}
                          </span>
                        </td>
                        {categories.map((cat) => (
                          <td key={cat.key} className="p-4">
                            <RatingCell rating={method[cat.key as keyof Method] as Rating} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legend + CTA under table */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex flex-wrap gap-5 text-body text-[#605A57]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#37322F]" /><span>Good</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#9a928d]" /><span>Variable</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#d4cfc9]" /><span>Poor</span></div>
              </div>
              <button onClick={() => setShowVideo(!showVideo)} className="inline-flex items-center gap-2 text-[#37322F] font-medium hover:underline">
                {showVideo ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Back to comparison
                  </>
                ) : (
                  <>
                    See the full breakdown
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </>
                )}
              </button>
            </div>
          </div>  
        </div>

      </div>
    </section>
  )
}
