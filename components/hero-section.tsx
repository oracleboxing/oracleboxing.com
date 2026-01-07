"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CoursesIllustration, CoachingIllustration, CommunityIllustration } from "./feature-illustrations"

// Temporary flag to disable enrollment
const ENROLLMENT_CLOSED = true

export function HeroSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const cards = [
    {
      title: "Courses",
      illustration: <CoursesIllustration />,
    },
    {
      title: "Coaching",
      illustration: <CoachingIllustration />,
    },
    {
      title: "Community",
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

  const scrollToPricing = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const pricingSection = document.getElementById("pricing")
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative pt-[120px] md:pt-[160px] pb-8">
      {/* Text Content - Constrained */}
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          {/* Hero Content */}
          <div className="max-w-[937px] flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-6">
              <h1 className="max-w-[900px] text-center text-[#37322f] text-4xl md:text-[64px] font-normal leading-tight md:leading-[1.15] font-serif">
                Learn
                <br />
                Better Boxing
              </h1>
              <p className="max-w-[700px] text-center text-[#37322f]/80 text-lg md:text-xl font-medium leading-7">
                Oracle Boxing is the virtual school for beginners in the sweet science.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            {ENROLLMENT_CLOSED ? (
              <div className="h-auto px-12 py-3 bg-[#37322f]/40 text-white/60 rounded-full font-medium text-base cursor-not-allowed flex flex-col items-center">
                <span>Choose Your Package</span>
                <span className="text-xs text-white/40">Temporarily Closed</span>
              </div>
            ) : (
              <Button
                onClick={scrollToPricing}
                className="h-12 px-12 bg-[#37322f] hover:bg-[#37322f]/90 text-white rounded-full font-medium text-base shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] cursor-pointer"
              >
                Choose Your Package
              </Button>
            )}
          </div>

          {/* Tabs Row */}
          <div className="w-full flex justify-center items-center gap-2 md:gap-4 mt-4">
            {cards.map((card, index) => {
              const isActive = index === activeCard

              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`flex-1 max-w-[180px] overflow-hidden flex flex-col justify-start items-start transition-all duration-300 cursor-pointer rounded-lg ${
                    isActive
                      ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
                      : "border border-[rgba(2,6,23,0.08)] hover:border-[rgba(2,6,23,0.15)]"
                  }`}
                >
                  <div
                    className={`w-full h-0.5 bg-[rgba(50,45,43,0.08)] overflow-hidden ${isActive && !isPaused ? "opacity-100" : "opacity-0"}`}
                  >
                    <div
                      key={animationKey}
                      className="h-0.5 bg-[#322D2B] animate-[progressBar_5s_linear_forwards] will-change-transform"
                    />
                  </div>
                  <div className="px-4 py-3 w-full">
                    <div className="text-center text-[#49423D] text-sm md:text-base font-semibold leading-6 font-sans">
                      {card.title}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
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
              <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-[#FFFCF5] via-[#FFFCF5]/80 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
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
