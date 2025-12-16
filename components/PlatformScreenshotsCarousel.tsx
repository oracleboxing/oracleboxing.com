'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { EpicCTAButton } from '@/components/EpicCTAButton'

interface Screenshot {
  image: string
  title: string
  subtitle: string
}

const screenshots: Screenshot[] = [
  {
    image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside1.webp',
    title: 'All Your Courses in One Place',
    subtitle: 'Access all three courses from a single organized dashboard'
  },
  {
    image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside2.webp',
    title: 'Deep-Dive Video Lessons',
    subtitle: 'Follow structured modules with detailed video demonstrations and theory'
  },
  {
    image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside3.webp',
    title: 'Follow-Along Workouts',
    subtitle: 'Train with phase-by-phase drills and structured workout progressions'
  },
  {
    image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside4.webp',
    title: 'Powerful Search Feature',
    subtitle: 'Find any technique, concept, or drill instantly across all courses'
  },
  {
    image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/phone_mockup1.webp',
    title: 'Train Anywhere, Anytime',
    subtitle: 'Full mobile access means you can learn and train from any device'
  }
]

interface PlatformScreenshotsCarouselProps {
  onOpenPricing?: () => void;
  buttonText?: string;
}

export function PlatformScreenshotsCarousel({ onOpenPricing, buttonText = "VIEW DETAILS" }: PlatformScreenshotsCarouselProps = {}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const currentIndexRef = useRef(0)
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll functionality
  useEffect(() => {
    if (isUserInteracting || !scrollContainerRef.current) return

    const container = scrollContainerRef.current

    const autoScroll = setInterval(() => {
      if (!container) return

      currentIndexRef.current = (currentIndexRef.current + 1) % screenshots.length

      // Calculate scroll position based on first card's position
      const firstCard = container.querySelector('div[class*="snap-center"]') as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth
        const gap = 24 // 6 * 4px = 24px gap between cards
        const scrollPosition = (cardWidth + gap) * currentIndexRef.current

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        })
      }
    }, 3000) // Auto-swipe every 3 seconds

    return () => clearInterval(autoScroll)
  }, [isUserInteracting])

  // Handle user interaction
  const handleUserInteraction = () => {
    setIsUserInteracting(true)

    // Clear existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }

    // Set new timeout to resume auto-scroll
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false)
    }, 5000) // Resume auto-scroll after 5 seconds of no interaction
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }
  }, [])

  return (
    <section className="pt-8 pb-12 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
          See Inside The Platform
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
          Everything you need to master boxing, all in one place
        </p>

        {/* Scrollable Carousel */}
        <div className="overflow-x-auto -mx-4 px-4 mb-8">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 pb-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ minWidth: 'max-content' }}
            onTouchStart={handleUserInteraction}
            onMouseDown={handleUserInteraction}
            onScroll={handleUserInteraction}
          >
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="snap-center w-[85vw] md:w-[500px] lg:w-[600px]"
              >
                {/* Card Container */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
                  {/* Image */}
                  <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                    <Image
                      src={screenshot.image}
                      alt={screenshot.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 360px, (max-width: 1024px) 500px, 600px"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                      {screenshot.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {screenshot.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar globally */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
