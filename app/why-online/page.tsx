"use client"

import Link from "next/link"
import FooterSection from "@/components/footer-section"
import { ArrowButton } from "@/components/ui/arrow-button"
import { getCheckoutUrl, ENROLLMENT_CLOSED } from "@/lib/enrollment"
import { trackAddToCart } from "@/lib/webhook-tracking"

type Rating = "good" | "variable" | "poor"

interface MethodData {
  name: string
  description: string
  ratings: {
    feedback: { rating: Rating; note: string }
    time: { rating: Rating; note: string }
    price: { rating: Rating; note: string }
    quality: { rating: Rating; note: string }
    community: { rating: Rating; note: string }
    sparring: { rating: Rating; note: string }
  }
}

const methods: MethodData[] = [
  {
    name: "YouTube Self-Study",
    description: "It feels like progress because there's so much information. But it's easy to mistake education for entertainment.",
    ratings: {
      feedback: { rating: "poor", note: "Nobody to correct you. You're just guessing if you're doing it right." },
      time: { rating: "poor", note: "Endless videos, no structure. You forget everything or save clips you'll never watch again." },
      price: { rating: "good", note: "Free. Can't argue with that." },
      quality: { rating: "good", note: "Good stuff exists but it's buried in oceans of opinion and gimmicks." },
      community: { rating: "poor", note: "Comment sections and Reddit threads don't count as coaching." },
      sparring: { rating: "poor", note: "Step in with YouTube-only training and you'll just get beaten up." },
    },
  },
  {
    name: "Local Boxing Gym",
    description: "Most gyms are business first, boxing gym second. One coach managing 20-30 people means very little individual attention.",
    ratings: {
      feedback: { rating: "variable", note: "You'll hear 'hands up' or 'good job' but rarely the technical breakdown you need." },
      time: { rating: "variable", note: "Most sessions are conditioning drills. You walk out thinking 'no one taught me a thing.'" },
      price: { rating: "good", note: "£50-100/month is good value - if you find a proper coach." },
      quality: { rating: "variable", note: "As Chris Eubank said: boxing coaches are PE teachers now. The real ones are gold dust." },
      community: { rating: "variable", note: "A great gym feels like family. A bad one reinforces the same mistakes until they become gospel." },
      sparring: { rating: "good", note: "Available, but most gyms throw you in too early. Sparring only helps if you're ready." },
    },
  },
  {
    name: "1-on-1 Trainer",
    description: "Sounds like the dream. But the quality depends entirely on who the trainer is. Most are just there to make money.",
    ratings: {
      feedback: { rating: "variable", note: "Best case: constant corrections that crush your ego. Worst case: a pad holder who tells you you're doing great." },
      time: { rating: "good", note: "At least you're getting their full attention." },
      price: { rating: "poor", note: "£25-60/hour adds up quick. Terrible value if they can't actually teach." },
      quality: { rating: "variable", note: "A good coach has real fight experience and can demonstrate what they teach. Most are winging it." },
      community: { rating: "poor", note: "Just you and them. No peers, no second opinions, no collective growth." },
      sparring: { rating: "poor", note: "Moving around with your coach isn't the same as facing someone trying to beat you." },
    },
  },
  {
    name: "Online Coaching",
    description: "Takes the best parts of every method and strips away the flaws. Every mistake gets caught in 4K.",
    ratings: {
      feedback: { rating: "good", note: "Coaches review your footage, give detailed corrections, demonstrate fixes. All recorded to watch back." },
      time: { rating: "good", note: "No travelling, no filler workouts. Every session is focused on skill, not just conditioning." },
      price: { rating: "good", note: "Similar to a gym but with exponentially more coaching. Better cost per rate of progress." },
      quality: { rating: "good", note: "Online coaches are market-tested. Bad coaches don't survive - the internet calls them out." },
      community: { rating: "good", note: "Coaching others is the fastest way to learn yourself. Every member becomes a coach." },
      sparring: { rating: "variable", note: "Prepares you to join a gym with solid fundamentals. Makes sparring productive instead of destructive." },
    },
  },
]

const categories = [
  { key: "feedback", label: "Feedback", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { key: "time", label: "Time Invested", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "price", label: "Price", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "quality", label: "Info Quality", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { key: "community", label: "Community", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { key: "sparring", label: "Sparring", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
]

function RatingIndicator({ rating }: { rating: Rating }) {
  const colors = {
    good: "bg-green-500",
    variable: "bg-amber-400",
    poor: "bg-red-400",
  }
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[rating]}`} />
}

export default function WhyOnlinePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simplified Header with Back Button */}
      <header className="w-full bg-white py-4 fixed top-0 left-0 right-0 z-50 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Back Button - Left */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[#37322F] text-sm font-medium hover:text-[#37322F]/70 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </Link>

          {/* Join Now Button - Right */}
          <Link
            href={getCheckoutUrl()}
            onClick={() => !ENROLLMENT_CLOSED && trackAddToCart('21dc-entry', '21-Day Challenge', 147, 'USD', 'why-online-header')}
            className="h-10 px-6 bg-[#007AFF] hover:bg-[#0066DD] text-white rounded-lg font-medium text-sm inline-flex items-center justify-center transition-all"
          >
            {ENROLLMENT_CLOSED ? 'Join Waitlist' : 'Join Now'}
          </Link>
        </div>
      </header>
      <main className="flex-1 pt-[72px]">
        {/* Hero Section with Video */}
        <section className="py-16 md:py-24 px-4 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <h1
                className="text-[#37322F] text-hero font-normal mb-6 leading-tight"
              >
                The Fastest Way to Get Good at Boxing
              </h1>
              <p className="text-[#605A57] text-title max-w-[800px] mx-auto leading-relaxed">
                If you've ever walked out of training thinking "I just learned absolutely nothing that session" - or you keep getting beaten up by kids half your size in sparring - this is for you.
              </p>
            </div>

            {/* Video */}
            <div className="max-w-[900px] mx-auto">
              <div className="aspect-video bg-[#37322F] rounded-xl overflow-hidden shadow-lg">
                <video
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src="https://sb.oracleboxing.com/Website/vsl.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Method Breakdown */}
        <section className="py-16 md:py-24 px-4 bg-[#FAFAF9]">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2
                className="text-[#37322F] text-section font-normal"
              >
                Method-by-Method Breakdown
              </h2>
            </div>

            <div className="space-y-6">
              {methods.map((method) => (
                <div
                  key={method.name}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    method.name === "Online Coaching"
                      ? "border-[#9CABA8] bg-white shadow-md"
                      : "border-[rgba(55,50,47,0.12)] bg-white"
                  }`}
                >
                  <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-6">
                      <h3
                        className="text-[#37322F] text-sub font-normal mb-2"
                      >
                        {method.name}
                      </h3>
                      <p className="text-[#605A57] text-body">{method.description}</p>
                    </div>

                    {/* Ratings Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(method.ratings).map(([key, data]) => {
                        const category = categories.find(c => c.key === key)
                        return (
                          <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-[#FAFAF9]">
                            <RatingIndicator rating={data.rating} />
                            <div className="flex-1 min-w-0">
                              <span className="text-[#37322F] font-medium text-sm">{category?.label}</span>
                              <p className="text-[#605A57] text-xs md:text-sm mt-0.5 leading-relaxed">{data.note}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-[#605A57]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span>Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Variable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span>Poor</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 bg-[#37322F] relative overflow-hidden">
          {/* Animated ribbons */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="ribbon ribbon-1" />
            <div className="ribbon ribbon-2" />
            <div className="ribbon ribbon-3" />
          </div>

          <div className="max-w-[600px] mx-auto text-center relative z-10">
            <h2
              className="text-white text-section font-normal mb-6"
            >
              Ready to Start?
            </h2>
            <p className="text-white/70 text-title mb-8 leading-relaxed">
              Online coaching takes the best parts of every method and strips away the flaws. It doesn't replace sparring - it makes sparring productive instead of destructive.
            </p>
            <ArrowButton href={getCheckoutUrl()}>
              Start Now
            </ArrowButton>
          </div>

          <style jsx>{`
            .ribbon {
              position: absolute;
              width: 200%;
              height: 120px;
              background: linear-gradient(90deg,
                transparent 0%,
                rgba(255,252,245,0.1) 20%,
                rgba(255,252,245,0.2) 50%,
                rgba(255,252,245,0.1) 80%,
                transparent 100%
              );
              border-radius: 50%;
              filter: blur(20px);
            }
            @media (max-width: 768px) {
              .ribbon {
                display: none;
              }
            }
            .ribbon-1 {
              top: 10%;
              left: -50%;
              transform: rotate(-10deg);
              animation: drift1 12s ease-in-out infinite;
            }
            .ribbon-2 {
              top: 50%;
              left: -30%;
              transform: rotate(5deg);
              animation: drift2 15s ease-in-out infinite;
              animation-delay: -4s;
            }
            .ribbon-3 {
              top: 80%;
              left: -40%;
              transform: rotate(-5deg);
              animation: drift1 11s ease-in-out infinite;
              animation-delay: -7s;
            }
            @keyframes drift1 {
              0%, 100% {
                transform: translateX(0) translateY(0) rotate(-10deg);
                opacity: 0.6;
              }
              50% {
                transform: translateX(50vw) translateY(20px) rotate(-5deg);
                opacity: 0.9;
              }
            }
            @keyframes drift2 {
              0%, 100% {
                transform: translateX(0) translateY(0) rotate(5deg);
                opacity: 0.5;
              }
              50% {
                transform: translateX(45vw) translateY(-30px) rotate(10deg);
                opacity: 0.85;
              }
            }
          `}</style>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
