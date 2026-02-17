"use client"

import { useState, useEffect, useRef } from "react"
import { CoursesIllustration, CoachingIllustration, CommunityIllustration } from "./feature-illustrations"

export default function FeaturesSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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

  // Only run auto-cycle when section is visible
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isPaused || !isVisible) return

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
    <div ref={sectionRef} className="w-full flex flex-col justify-center items-center">
      {/* Content Section */}
      <div className="self-stretch px-4 md:px-9 overflow-hidden flex justify-center items-center">
        <div className="flex-1 py-8 md:py-11 flex flex-col justify-center items-center gap-6 max-w-3xl mx-auto">
          {/* Tabs Row */}
          <div className="w-full flex justify-center items-center gap-2 md:gap-4">
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
                    <div className="text-center text-[#49423D] text-body font-semibold leading-6 font-sans">
                      {card.title}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Illustration */}
          <div className="w-full rounded-lg flex flex-col justify-center items-center relative">
            <div className="w-full h-[250px] md:h-[420px] overflow-hidden rounded-lg relative">
              <div
                key={activeCard}
                className="w-full h-full animate-[popIn_0.4s_ease-out_forwards]"
              >
                {cards[activeCard].illustration}
              </div>
              {/* Bottom gradient fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
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
    </div>
  )
}
