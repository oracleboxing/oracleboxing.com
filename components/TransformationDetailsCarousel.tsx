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

// Helper to generate poster path from video path
const getPosterUrl = (videoPath: string) => {
  return `${BASE_URL}${videoPath.replace('.webm', '_poster.webp')}`
}

const transformations: TransformationItem[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    name: 'Balal',
    beforeVideo: 'balal_before.webm',
    afterVideo: 'balal_after.webm',
    duration: '6 MONTHS',
    corrections: [
      { before: 'Weight forward on punches', after: 'Centred weight' },
      { before: 'Moving too much throwing', after: 'Rotating on axis, planted' },
    ],
  },
  {
    id: 4,
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
    id: 8,
    name: 'Rod',
    beforeVideo: 'rod_before.webm',
    afterVideo: 'rod_after.webm',
    duration: '9 MONTHS',
    corrections: [
      { before: 'Not fully extending punches', after: 'Full punch extension' },
      { before: 'Unorthodox timing, no rhythm', after: 'Smooth, rhythmic flow' },
    ],
  },
  {
    id: 9,
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
    id: 10,
    name: 'Ilya',
    beforeVideo: 'ilya_before2.webm',
    afterVideo: 'ilya_after.webm',
    duration: '3 MONTHS',
    corrections: [
      { before: 'No kinetic linkage', after: 'Full body connection' },
      { before: 'Weight shifting forward', after: 'Centred, balanced weight' },
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
  const desktopVideoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Counting animations for header
  const { count: daysCount, elementRef: daysRef } = useCountUp(21, 1500)
  const { count: monthsCount, elementRef: monthsRef } = useCountUp(6, 1500)

  const updateTranslate = useCallback((index: number) => {
    // Only used for desktop carousel with swipe
    if (!desktopCarouselRef.current) return
    const containerWidth = desktopCarouselRef.current.offsetWidth
    setTranslateX(-index * containerWidth)
  }, [])

  useEffect(() => {
    updateTranslate(currentIndex)
    const handleResize = () => updateTranslate(currentIndex)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, updateTranslate])

  // Smooth loop handler - restart video slightly before end to avoid freeze
  const handleTimeUpdate = useCallback((video: HTMLVideoElement) => {
    // If within 0.1 seconds of the end, restart immediately for seamless loop
    if (video.duration - video.currentTime < 0.1) {
      video.currentTime = 0
      video.play().catch(() => {})
    }
  }, [])

  // Handle video playback for desktop
  useEffect(() => {
    desktopVideoRefs.current.forEach((video, index) => {
      if (video) {
        if (Math.floor(index / 2) === currentIndex) {
          video.play().catch(() => {})
        } else {
          video.pause()
          video.currentTime = 0
        }
      }
    })
  }, [currentIndex])

  // Handle video playback for mobile
  useEffect(() => {
    mobileVideoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {})
      }
    })
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
    <section id="transformations" className="w-full min-h-screen flex items-center py-12 md:py-16 scroll-mt-16">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col lg:flex-row lg:items-center lg:gap-16 w-full">
      {/* Section Header - left column on desktop */}
      <div className="lg:w-4/12 mb-8 lg:mb-0">
        <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-2 sm:gap-6 lg:gap-4">
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
            <div className="hidden sm:block lg:hidden w-px h-8 bg-[#37322F]/20" />
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
      {/* Carousel Container - right column on desktop */}
      <div className="lg:w-8/12 w-full">
        <div className="relative">
          {/* Desktop layout with arrows beside */}
          <div className="hidden md:flex items-center gap-4">
            {/* Left Arrow - Desktop */}
            <button
              className="flex flex-shrink-0 w-12 h-12 rounded-full items-center justify-center bg-white/90 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:scale-110 hover:enabled:bg-white active:enabled:scale-95 transition-all duration-200"
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
                            <div className="relative overflow-hidden aspect-[9/16] rounded-l-lg">
                              {/* Poster image as background - always visible */}
                              <img
                                src={getPosterUrl(item.beforeVideo)}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              {/* Video loads on top */}
                              <video
                                ref={(el) => { desktopVideoRefs.current[cardIndex * 2] = el }}
                                src={cardIndex === currentIndex ? `${BASE_URL}${item.beforeVideo}` : undefined}
                                autoPlay={cardIndex === currentIndex}
                                muted
                                loop
                                playsInline
                                preload={cardIndex === currentIndex ? "auto" : "none"}
                                onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget)}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute top-0 left-0 bg-[#37322F]/90 px-3 py-1.5 rounded-br-md z-10">
                                <span className="text-white text-sm font-semibold tracking-wide">
                                  BEFORE
                                </span>
                              </div>
                            </div>

                            {/* After Video */}
                            <div className="relative overflow-hidden aspect-[9/16] rounded-r-lg">
                              {/* Poster image as background - always visible */}
                              <img
                                src={getPosterUrl(item.afterVideo)}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              {/* Video loads on top */}
                              <video
                                ref={(el) => { desktopVideoRefs.current[cardIndex * 2 + 1] = el }}
                                src={cardIndex === currentIndex ? `${BASE_URL}${item.afterVideo}` : undefined}
                                autoPlay={cardIndex === currentIndex}
                                muted
                                loop
                                playsInline
                                preload={cardIndex === currentIndex ? "auto" : "none"}
                                onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget)}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute top-0 right-0 bg-[#37322F]/90 px-3 py-1.5 rounded-bl-md z-10">
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
              className="flex flex-shrink-0 w-12 h-12 rounded-full items-center justify-center bg-white/90 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:scale-110 hover:enabled:bg-white active:enabled:scale-95 transition-all duration-200"
              disabled={currentIndex === transformations.length - 1}
              onClick={handleNextClick}
              aria-label="Next transformation"
            >
              <svg className="w-6 h-6 text-[#37322F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile Carousel - simple card with buttons, no swipe */}
          <div className="md:hidden px-4">
            {/* Current card only */}
            {(() => {
              const item = transformations[currentIndex]
              return (
                <div className="relative bg-white p-4 md:rounded-xl md:border md:border-[rgba(55,50,47,0.12)] md:shadow-sm -mx-4">
                  {/* Row 1: Before/After Videos */}
                  <div className="grid grid-cols-2 gap-0 mb-4">
                    {/* Before Video */}
                    <div className="relative overflow-hidden aspect-[9/16] rounded-l-lg">
                      {/* Poster image as background - always visible */}
                      <img
                        src={getPosterUrl(item.beforeVideo)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Video loads on top */}
                      <video
                        key={`mobile-before-${currentIndex}`}
                        ref={(el) => { mobileVideoRefs.current[0] = el }}
                        src={`${BASE_URL}${item.beforeVideo}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 bg-[#37322F]/90 px-2 py-1 rounded-br-md z-10">
                        <span className="text-white text-xs font-semibold tracking-wide">
                          BEFORE
                        </span>
                      </div>
                    </div>

                    {/* After Video */}
                    <div className="relative overflow-hidden aspect-[9/16] rounded-r-lg">
                      {/* Poster image as background - always visible */}
                      <img
                        src={getPosterUrl(item.afterVideo)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Video loads on top */}
                      <video
                        key={`mobile-after-${currentIndex}`}
                        ref={(el) => { mobileVideoRefs.current[1] = el }}
                        src={`${BASE_URL}${item.afterVideo}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-[#37322F]/90 px-2 py-1 rounded-bl-md z-10">
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
                      <div key={corrIndex} className="grid grid-cols-2 gap-2 sm:gap-3">
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
              )
            })()}

            {/* Navigation buttons below card */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                className="flex w-10 h-10 rounded-full items-center justify-center bg-[#37322F] text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
                disabled={currentIndex === 0}
                onClick={handlePrevClick}
                aria-label="Previous transformation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-[#49423D] text-sm font-medium">
                {currentIndex + 1} / {transformations.length}
              </span>
              <button
                className="flex w-10 h-10 rounded-full items-center justify-center bg-[#37322F] text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
                disabled={currentIndex === transformations.length - 1}
                onClick={handleNextClick}
                aria-label="Next transformation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
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
      </div>{/* end flex wrapper */}
    </section>
  )
}

export default TransformationDetailsCarousel
