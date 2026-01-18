"use client"

import Link from "next/link"

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
    good: "bg-green-500",
    variable: "bg-amber-400",
    poor: "bg-red-400",
  }

  return (
    <div className={`w-3 h-3 rounded-full ${colors[rating]}`} />
  )
}

function RatingCell({ rating }: { rating: Rating }) {
  const colors = {
    good: "bg-green-500",
    variable: "bg-amber-400",
    poor: "bg-red-400",
  }

  return (
    <div className="flex justify-center">
      <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${colors[rating]}`} />
    </div>
  )
}

export default function WhyOnlineSection() {
  return (
    <section className="w-full border-b border-[rgba(55,50,47,0.12)] bg-[#FAFAF9] py-16 md:py-24">
      <div className="max-w-[1060px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-[#37322F] text-3xl md:text-4xl lg:text-5xl font-normal mb-4"
            style={{ fontFamily: 'ClashDisplay, sans-serif' }}
          >
            The Fastest Way to Learn Boxing
          </h2>
          <p className="text-[#605A57] text-lg md:text-xl max-w-[700px] mx-auto">
            We compared every method across 6 key factors. The results speak for themselves.
          </p>
        </div>

        {/* Scorecard Table */}
        <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] overflow-hidden shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(55,50,47,0.12)]">
                  <th className="text-left p-4 text-[#37322F] font-semibold">Method</th>
                  {categories.map((cat) => (
                    <th key={cat.key} className="p-4 text-[#605A57] font-medium text-sm text-center">
                      {cat.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {methods.map((method, index) => (
                  <tr
                    key={method.name}
                    className={`
                      border-b border-[rgba(55,50,47,0.12)] last:border-b-0
                      ${method.name === "Online Coaching" ? "bg-[#F0FDF4]" : ""}
                    `}
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

          {/* Mobile Cards */}
          <div className="md:hidden">
            {methods.map((method, index) => (
              <div
                key={method.name}
                className={`
                  p-4 border-b border-[rgba(55,50,47,0.12)] last:border-b-0
                  ${method.name === "Online Coaching" ? "bg-[#F0FDF4]" : ""}
                `}
              >
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
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-sm text-[#605A57]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Variable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span>Poor</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/why-online"
            className="inline-flex items-center gap-2 text-[#37322F] font-medium hover:underline"
          >
            See the full breakdown
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
