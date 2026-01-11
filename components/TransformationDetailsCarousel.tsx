'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// Counting animation hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!startOnView) {
      // Start immediately if not waiting for view
      setHasStarted(true)
    }
  }, [startOnView])

  useEffect(() => {
    if (!startOnView || hasStarted) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [startOnView, hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [hasStarted, end, duration])

  return { count, elementRef }
}

interface TransformationItem {
  id: number
  name: string
  beforeVideo: string
  afterVideo: string
  duration: string
  corrections: {
    before: string
    after: string
  }[]
}

const BASE_URL = 'https://sb.oracleboxing.com/transfo-v2/'

const transformations: TransformationItem[] = [
  {
    id: 1,
    name: 'Kris',
    beforeVideo: 'kris_before_1.webm',
    afterVideo: 'kris_after.webm',
    duration: '3 MONTHS',
    corrections: [
      { before: 'No upper body rotation', after: 'Twisting punches, relaxed' },
      { before: 'Way too stiff and tense', after: 'Full kinetic chain rotation' },
    ],
  },
  {
    id: 2,
    name: 'Zyginta',
    beforeVideo: 'zyginta_before.webm',
    afterVideo: 'zyginta_after.webm',
    duration: '9 MONTHS',
    corrections: [
      { before: 'Not finishing punches', after: 'Full punch extension' },
      { before: 'Weight coming forward', after: 'Proper weight distribution' },
    ],
  },
  {
    id: 3,
    name: 'Keli',
    beforeVideo: 'keli_before.webm',
    afterVideo: 'keli_after.webm',
    duration: '6 MONTHS',
    corrections: [
      { before: 'Arm punching, no rotation', after: 'Full body rotation' },
      { before: 'No finishing punches', after: 'Head movement and footwork' },
    ],
  },
  {
    id: 4,
    name: 'Maria',
    beforeVideo: 'maria_before.webm',
    afterVideo: 'maria_after.webm',
    duration: '6 MONTHS',
    corrections: [
      { before: 'Stance opens up on punches', after: 'Tight, compact stance' },
      { before: 'Limited head movement', after: 'More variety in movement' },
    ],
  },
  {
    id: 5,
    name: 'Niclas',
    beforeVideo: 'niclas_before.webm',
    afterVideo: 'niclas_after.webm',
    duration: '6 MONTHS',
    corrections: [
      { before: 'Too tense, no arm twist', after: 'Relaxed with proper twist' },
      { before: 'Heel-heavy on feet', after: 'Weight on balls of feet' },
    ],
  },
  {
    id: 6,
    name: 'Nico',
    beforeVideo: 'nico_before.webm',
    afterVideo: 'nico_after.webm',
    duration: '9 MONTHS',
    corrections: [
      { before: 'Losing shape when sparring', after: 'Tighter defensive shape' },
      { before: 'Poor footwork in range', after: 'Better distance control' },
    ],
  },
  {
    id: 7,
    name: 'Shalyn',
    beforeVideo: 'shalyn_before.webm',
    afterVideo: 'shalyn_after.webm',
    duration: '12 MONTHS',
    corrections: [
      { before: 'Shape too open on hooks', after: 'Compact, smaller target' },
      { before: 'No whipping in punches', after: 'Kinetic chain power' },
    ],
  },
  {
    id: 8,
    name: 'Balal',
    beforeVideo: 'balal_before.webm',
    afterVideo: 'balal_after.webm',
    duration: '6 MONTHS',
    corrections: [
      { before: 'Weight forward on punches', after: 'Centred weight' },
      { before: 'Moving too much throwing', after: 'Rotating on axis, planted' },
    ],
  },
]

export function TransformationDetailsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const desktopCarouselRef = useRef<HTMLDivElement>(null)
  const mobileCarouselRef = useRef<HTMLDivElement>(null)
  const desktopVideoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Counting animations for header
  const { count: daysCount, elementRef: daysRef } = useCountUp(21, 1500)
  const { count: monthsCount, elementRef: monthsRef } = useCountUp(6, 1500)

  const updateTranslate = useCallback((index: number) => {
    // Use whichever carousel is visible
    const carouselRef = window.innerWidth >= 768 ? desktopCarouselRef : mobileCarouselRef
    if (!carouselRef.current) return
    const containerWidth = carouselRef.current.offsetWidth
    setTranslateX(-index * containerWidth)
  }, [])

  useEffect(() => {
    updateTranslate(currentIndex)
    const handleResize = () => updateTranslate(currentIndex)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, updateTranslate])

  // Handle video playback for both desktop and mobile
  useEffect(() => {
    const playVideos = (refs: (HTMLVideoElement | null)[]) => {
      refs.forEach((video, index) => {
        if (video) {
          if (Math.floor(index / 2) === currentIndex) {
            video.play().catch(() => {})
          } else {
            video.pause()
            video.currentTime = 0
          }
        }
      })
    }
    playVideos(desktopVideoRefs.current)
    playVideos(mobileVideoRefs.current)
  }, [currentIndex])

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      updateTranslate(newIndex)
    }
  }

  const handleNextClick = () => {
    if (currentIndex < transformations.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      updateTranslate(newIndex)
    }
  }

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    setDragOffset(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    const diff = currentX - dragStartX
    setDragOffset(diff)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50 // Minimum swipe distance to trigger navigation

    if (dragOffset > threshold && currentIndex > 0) {
      // Swiped right - go to previous
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      updateTranslate(newIndex)
    } else if (dragOffset < -threshold && currentIndex < transformations.length - 1) {
      // Swiped left - go to next
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      updateTranslate(newIndex)
    }

    setDragOffset(0)
  }

  return (
    <section className="w-full py-12 md:py-16">
      {/* Section Header - constrained width */}
      <div className="max-w-[900px] mx-auto px-4 mb-8 md:mb-12">
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <div className="flex items-baseline gap-2">
              <span
                ref={daysRef}
                className="text-[#37322F] text-3xl md:text-4xl lg:text-5xl font-medium tabular-nums"
                style={{ fontFamily: 'ClashDisplay, sans-serif' }}
              >
                {daysCount} Days
              </span>
              <span className="text-[#49423D] text-lg md:text-xl">to see results</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#37322F]/20" />
            <div className="flex items-baseline gap-2">
              <span
                ref={monthsRef}
                className="text-[#37322F] text-3xl md:text-4xl lg:text-5xl font-medium tabular-nums"
                style={{ fontFamily: 'ClashDisplay, sans-serif' }}
              >
                {monthsCount} Months
              </span>
              <span className="text-[#49423D] text-lg md:text-xl">to transform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Container - full width on mobile, constrained on desktop */}
      <div className="w-full md:max-w-[900px] md:mx-auto md:px-0">
        <div className="relative">
          {/* Desktop layout with arrows beside */}
          <div className="hidden md:flex items-center gap-4">
            {/* Left Arrow - Desktop */}
            <button
              className="flex flex-shrink-0 w-12 h-12 rounded-full items-center justify-center backdrop-blur-[20px] saturate-[180%] bg-[#37322F]/10 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:scale-110 hover:enabled:bg-[#37322F]/20 active:enabled:scale-95 transition-all duration-200"
              disabled={currentIndex === 0}
              onClick={handlePrevClick}
              aria-label="Previous transformation"
            >
              <svg className="w-6 h-6 text-[#37322F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Main Carousel - Desktop */}
            <div className="flex-1 min-w-0">
              <div
                ref={desktopCarouselRef}
                className="relative overflow-hidden touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex will-change-transform"
                  style={{
                    transform: `translateX(${translateX + dragOffset}px)`,
                    transition: isDragging ? 'none' : 'transform 0.4s ease-out',
                  }}
                >
                  {transformations.map((item, cardIndex) => (
                    <div key={item.id} className="flex-shrink-0 w-full px-2">
                      {/* Card with animated border */}
                      <div
                        className="relative overflow-hidden rounded-2xl"
                        style={{ padding: '8px' }}
                      >
                        {/* Pattern border background */}
                        <div className="absolute inset-0 bg-[#37322F] overflow-hidden rounded-2xl">
                          {/* Animated flowing ribbons/orbs */}
                          <div className="ribbon ribbon-1" />
                          <div className="ribbon ribbon-2" />
                          <div className="ribbon ribbon-3" />
                          <div className="ribbon ribbon-4" />
                          <div className="ribbon ribbon-5" />
                          <div className="ribbon ribbon-6" />
                        </div>

                        {/* Inner white card */}
                        <div className="relative bg-white p-6 rounded-xl">
                          {/* Row 1: Before/After Videos */}
                          <div className="grid grid-cols-2 gap-0 mb-6">
                            {/* Before Video */}
                            <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-l-lg">
                              <video
                                ref={(el) => { desktopVideoRefs.current[cardIndex * 2] = el }}
                                src={`${BASE_URL}${item.beforeVideo}`}
                                autoPlay={cardIndex === currentIndex}
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3 bg-[#37322F]/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
                                <span className="text-white text-sm font-semibold tracking-wide">
                                  BEFORE
                                </span>
                              </div>
                            </div>

                            {/* After Video */}
                            <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-r-lg">
                              <video
                                ref={(el) => { desktopVideoRefs.current[cardIndex * 2 + 1] = el }}
                                src={`${BASE_URL}${item.afterVideo}`}
                                autoPlay={cardIndex === currentIndex}
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3 bg-[#37322F]/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
                                <span className="text-white text-sm font-semibold tracking-wide">
                                  AFTER
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Row 2: Duration with line */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-[#37322F]/20" />
                            <span
                              className="text-[#37322F] text-base font-semibold tracking-wider"
                              style={{ fontFamily: 'ClashDisplay, sans-serif' }}
                            >
                              {item.duration}
                            </span>
                            <div className="flex-1 h-px bg-[#37322F]/20" />
                          </div>

                          {/* Row 3: Technique Corrections */}
                          <div className="space-y-3">
                            {item.corrections.map((correction, corrIndex) => (
                              <div key={corrIndex} className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-2">
                                  <span className="text-red-500 mt-0.5 flex-shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                                      <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                  </span>
                                  <span className="text-[#49423D] text-sm leading-relaxed">
                                    {correction.before}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-green-600 mt-0.5 flex-shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                                      <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </span>
                                  <span className="text-[#49423D] text-sm leading-relaxed">
                                    {correction.after}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Arrow - Desktop */}
            <button
              className="flex flex-shrink-0 w-12 h-12 rounded-full items-center justify-center backdrop-blur-[20px] saturate-[180%] bg-[#37322F]/10 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:scale-110 hover:enabled:bg-[#37322F]/20 active:enabled:scale-95 transition-all duration-200"
              disabled={currentIndex === transformations.length - 1}
              onClick={handleNextClick}
              aria-label="Next transformation"
            >
              <svg className="w-6 h-6 text-[#37322F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile Carousel - full width with fixed background */}
          <div className="md:hidden">
            {/* Fixed dark background with animated ribbons - fixed height container */}
            <div className="relative overflow-hidden bg-[#37322F] flex items-center justify-center" style={{ minHeight: '580px' }}>
              {/* Animated flowing ribbons/orbs - stays fixed */}
              <div className="ribbon ribbon-1" />
              <div className="ribbon ribbon-2" />
              <div className="ribbon ribbon-3" />
              <div className="ribbon ribbon-4" />
              <div className="ribbon ribbon-5" />
              <div className="ribbon ribbon-6" />

              {/* Navigation arrows - vertically centered */}
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex w-10 h-10 rounded-full items-center justify-center backdrop-blur-[20px] saturate-[180%] bg-white/80 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:scale-110 hover:enabled:bg-white active:enabled:scale-95 transition-all duration-200"
                disabled={currentIndex === 0}
                onClick={handlePrevClick}
                aria-label="Previous transformation"
              >
                <svg className="w-5 h-5 text-[#37322F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex w-10 h-10 rounded-full items-center justify-center backdrop-blur-[20px] saturate-[180%] bg-white/80 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:scale-110 hover:enabled:bg-white active:enabled:scale-95 transition-all duration-200"
                disabled={currentIndex === transformations.length - 1}
                onClick={handleNextClick}
                aria-label="Next transformation"
              >
                <svg className="w-5 h-5 text-[#37322F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Sliding carousel of white cards - centered with fixed width */}
              <div
                ref={mobileCarouselRef}
                className="relative overflow-hidden touch-pan-y w-full max-w-[340px] mx-auto"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex will-change-transform"
                  style={{
                    transform: `translateX(${translateX + dragOffset}px)`,
                    transition: isDragging ? 'none' : 'transform 0.4s ease-out',
                  }}
                >
                  {transformations.map((item, cardIndex) => (
                    <div key={item.id} className="flex-shrink-0 w-full px-2">
                      {/* White card - slides */}
                      <div className="relative bg-white p-4 rounded-xl">
                        {/* Row 1: Before/After Videos */}
                        <div className="grid grid-cols-2 gap-0 mb-4">
                          {/* Before Video */}
                          <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-l-lg">
                            <video
                              ref={(el) => { mobileVideoRefs.current[cardIndex * 2] = el }}
                              src={`${BASE_URL}${item.beforeVideo}`}
                              autoPlay={cardIndex === currentIndex}
                              muted
                              loop
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-[#37322F]/80 backdrop-blur-sm px-2 py-1 rounded-md">
                              <span className="text-white text-xs font-semibold tracking-wide">
                                BEFORE
                              </span>
                            </div>
                          </div>

                          {/* After Video */}
                          <div className="relative overflow-hidden aspect-[9/16] bg-[#37322F] rounded-r-lg">
                            <video
                              ref={(el) => { mobileVideoRefs.current[cardIndex * 2 + 1] = el }}
                              src={`${BASE_URL}${item.afterVideo}`}
                              autoPlay={cardIndex === currentIndex}
                              muted
                              loop
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-[#37322F]/80 backdrop-blur-sm px-2 py-1 rounded-md">
                              <span className="text-white text-xs font-semibold tracking-wide">
                                AFTER
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Duration with line */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1 h-px bg-[#37322F]/20" />
                          <span
                            className="text-[#37322F] text-sm font-semibold tracking-wider"
                            style={{ fontFamily: 'ClashDisplay, sans-serif' }}
                          >
                            {item.duration}
                          </span>
                          <div className="flex-1 h-px bg-[#37322F]/20" />
                        </div>

                        {/* Row 3: Technique Corrections */}
                        <div className="space-y-2">
                          {item.corrections.map((correction, corrIndex) => (
                            <div key={corrIndex} className="grid grid-cols-2 gap-3">
                              <div className="flex items-start gap-1.5">
                                <span className="text-red-500 mt-0.5 flex-shrink-0">
                                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                </span>
                                <span className="text-[#49423D] text-xs leading-relaxed">
                                  {correction.before}
                                </span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-green-600 mt-0.5 flex-shrink-0">
                                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                                <span className="text-[#49423D] text-xs leading-relaxed">
                                  {correction.after}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ribbon {
          position: absolute;
          width: 300%;
          height: 80px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,252,245,0.25) 20%,
            rgba(255,252,245,0.5) 50%,
            rgba(255,252,245,0.25) 80%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(20px);
          box-shadow: 0 0 60px 30px rgba(255, 252, 245, 0.2);
        }
        /* Hide heavy animations on mobile to prevent Safari crashes */
        @media (max-width: 768px) {
          .ribbon {
            display: none;
          }
        }
        .ribbon-1 {
          top: 0%;
          left: -100%;
          transform: rotate(-10deg);
          animation: drift1 8s ease-in-out infinite;
        }
        .ribbon-2 {
          top: 30%;
          left: -80%;
          height: 100px;
          transform: rotate(5deg);
          animation: drift2 10s ease-in-out infinite;
          animation-delay: -2s;
        }
        .ribbon-3 {
          top: 60%;
          left: -90%;
          height: 90px;
          transform: rotate(-5deg);
          animation: drift3 9s ease-in-out infinite;
          animation-delay: -4s;
        }
        .ribbon-4 {
          top: 85%;
          left: -110%;
          height: 70px;
          transform: rotate(8deg);
          animation: drift1 11s ease-in-out infinite;
          animation-delay: -6s;
        }
        .ribbon-5 {
          top: 15%;
          left: -70%;
          height: 60px;
          transform: rotate(-8deg);
          animation: drift2 7s ease-in-out infinite;
          animation-delay: -3s;
        }
        .ribbon-6 {
          top: 50%;
          left: -100%;
          height: 110px;
          transform: rotate(3deg);
          animation: drift3 12s ease-in-out infinite;
          animation-delay: -5s;
        }
        @keyframes drift1 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-10deg);
            opacity: 0.9;
          }
          50% {
            transform: translateX(80%) translateY(10px) rotate(-5deg);
            opacity: 1;
          }
        }
        @keyframes drift2 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(5deg);
            opacity: 0.85;
          }
          50% {
            transform: translateX(70%) translateY(-15px) rotate(10deg);
            opacity: 1;
          }
        }
        @keyframes drift3 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-5deg);
            opacity: 0.8;
          }
          50% {
            transform: translateX(75%) translateY(8px) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}

export default TransformationDetailsCarousel
