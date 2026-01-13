"use client"

import { useState, useEffect } from "react"
import { ArrowButton } from "@/components/ui/arrow-button"
import { CoursesIllustration, CoachingIllustration, CommunityIllustration } from "./feature-illustrations"
import { TransformationShowcase } from "./TransformationShowcase"
import { MemberQuotes } from "./MemberQuotes"
import { ENROLLMENT_CLOSED, getCheckoutUrl } from "@/lib/enrollment"

export function HeroSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const cards = [
    {
      title: "Courses",
      description: "Learn the fundamentals",
      illustration: <CoursesIllustration />,
    },
    {
      title: "Coaching",
      description: "Refine your technique",
      illustration: <CoachingIllustration />,
    },
    {
      title: "Community",
      description: "Stay accountable",
      illustration: <CommunityIllustration />,
    },
  ]

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length)
      setAnimationKey((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [cards.length, isPaused])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setAnimationKey((prev) => prev + 1)
    setIsPaused(true)
  }

  return (
    <section className="relative pt-[90px] sm:pt-[120px] md:pt-[160px] pb-8">
      {/* Text Content - Constrained */}
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          {/* Hero Content */}
          <div className="max-w-[937px] flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-6">
              <h1 className="max-w-[900px] text-center text-[#37322f] text-3xl sm:text-4xl md:text-[64px] font-normal leading-tight md:leading-[1.15]" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                <span className="block tracking-tight">Become The Fighter</span>
                <span className="block tracking-wide">You Were Born To Be</span>
              </h1>
              <p className="max-w-[900px] text-center text-[#37322f]/80 text-lg sm:text-xl md:text-2xl font-medium leading-7 sm:leading-8">
                The online boxing school that transforms more than your technique.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <ArrowButton href={getCheckoutUrl()}>{ENROLLMENT_CLOSED ? 'Join the Waitlist' : 'Start Now'}</ArrowButton>
          </div>
        </div>
      </div>

      {/* Transformation Showcase - Full Width */}
      <TransformationShowcase />

      {/* Member Quotes - Graffiti Style */}
      <MemberQuotes />

      {/* Tabs Row - Stacked on mobile, horizontal on desktop */}
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex flex-col md:flex-row w-full">
          {cards.map((card, index) => {
            const isActive = index === activeCard

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className="flex-1 overflow-hidden flex flex-col cursor-pointer transition-all duration-300 bg-transparent"
              >
                {/* Individual progress bar for each tab */}
                <div className="w-full h-[3px] bg-[#37322F]/20 relative overflow-hidden">
                  <div
                    key={`${animationKey}-${index}`}
                    className="absolute inset-0 bg-[#37322F] will-change-transform origin-left"
                    style={{
                      transform: index === activeCard
                        ? (isPaused ? 'scaleX(1)' : undefined)
                        : 'scaleX(0)',
                      animation: index === activeCard && !isPaused
                        ? 'progressBarScale 5s linear forwards'
                        : 'none',
                    }}
                  />
                </div>
                {/* Content */}
                <div className="px-3 py-4 md:px-6 md:py-5 w-full">
                  <div className={`text-center text-sm md:text-base font-semibold leading-tight font-sans transition-colors duration-300 ${
                    isActive ? 'text-[#37322F]' : 'text-[#49423D]/60'
                  }`}>
                    {card.title}
                  </div>
                  <div className={`text-center text-xs md:text-sm mt-1 leading-tight transition-colors duration-300 ${
                    isActive ? 'text-[#49423D]/80' : 'text-[#49423D]/40'
                  }`}>
                    {card.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Illustration - Full Width on Desktop */}
      <div className="w-full mt-6">
        <div className="w-full max-w-none lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="w-full rounded-lg flex flex-col justify-center items-center relative">
            <div className="w-full h-[280px] md:h-[480px] lg:h-[560px] xl:h-[640px] overflow-hidden rounded-lg relative">
              <div
                key={activeCard}
                className="w-full h-full animate-[popIn_0.4s_ease-out_forwards]"
              >
                {cards[activeCard].illustration}
              </div>
              {/* Bottom gradient fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBarScale {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
