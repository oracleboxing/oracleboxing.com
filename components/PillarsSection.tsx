"use client"

import { useState, useEffect, useRef } from "react"
import { CoursesIllustration, CoachingIllustration, CommunityIllustration } from "./feature-illustrations"

export default function PillarsSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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

  // Only start animating when scrolled into view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || isPaused) return

    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length)
      setAnimationKey((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [cards.length, isPaused, isVisible])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setAnimationKey((prev) => prev + 1)
    setIsPaused(true)
  }

  return (
    <section ref={sectionRef} className="w-full pb-8">
      {/* Tabs Row */}
      <div className="max-w-[900px] mx-auto px-4">
        {/* Mobile: single continuous progress bar */}
        <div className="md:hidden w-[60%] mx-auto h-[3px] bg-[#37322F]/20 relative overflow-hidden rounded-full mb-3">
          <div
            key={animationKey}
            className="absolute top-0 bottom-0 left-0 bg-[#37322F] will-change-transform rounded-full"
            style={{
              width: `${100 / cards.length}%`,
              transform: `translateX(${activeCard * 100}%)`,
              transition: 'transform 0.3s ease',
            }}
          />
        </div>

        <div className="flex flex-row w-full">
          {cards.map((card, index) => {
            const isActive = index === activeCard

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className="flex-1 overflow-hidden flex flex-col cursor-pointer transition-all duration-300 bg-transparent"
              >
                {/* Desktop: individual progress bar for each tab */}
                <div className="hidden md:block w-full h-[3px] bg-[#37322F]/20 relative overflow-hidden">
                  <div
                    key={`${animationKey}-${index}`}
                    className="absolute inset-0 bg-[#37322F] will-change-transform origin-left"
                    style={{
                      transform: index === activeCard
                        ? (isPaused ? 'scaleX(1)' : undefined)
                        : 'scaleX(0)',
                      animation: index === activeCard && !isPaused && isVisible
                        ? 'progressBarScale 5s linear forwards'
                        : 'none',
                    }}
                  />
                </div>
                {/* Content */}
                <div className="px-3 py-3 md:px-6 md:py-5 w-full">
                  <div className={`text-center text-body font-semibold leading-tight font-sans transition-colors duration-300 ${
                    isActive ? 'text-[#37322F]' : 'text-[#49423D]/60'
                  }`}>
                    {card.title}
                  </div>
                  <div className={`hidden md:block text-center text-body mt-1 leading-tight transition-colors duration-300 ${
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

      {/* Illustration */}
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
