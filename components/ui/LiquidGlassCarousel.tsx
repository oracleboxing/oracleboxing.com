'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface CarouselItem {
  id: number
  video: string
  poster: string
  title: string
}

interface LiquidGlassCarouselProps {
  items?: CarouselItem[]
}

const defaultItems: CarouselItem[] = [
  { id: 1, video: 'andre.webm', poster: 'andre_poster.webp', title: 'Andre' },
  { id: 2, video: 'sha-lyn.webm', poster: 'sha-lyn_poster.webp', title: 'Sha-lyn' },
  { id: 3, video: 'jordan.webm', poster: 'jordan_poster.webp', title: 'Jordan' },
  { id: 4, video: 'charlie.webm', poster: 'charlie_poster.webp', title: 'Charlie' },
  { id: 5, video: 'Niclas.webm', poster: 'Niclas_poster.webp', title: 'Niclas' },
  { id: 6, video: 'rod.webm', poster: 'rod_poster.webp', title: 'Rod' },
  { id: 7, video: 'nico.webm', poster: 'nico_poster.webp', title: 'Nico' },
  { id: 8, video: 'keli.webm', poster: 'keli_poster.webp', title: 'Keli' },
  { id: 9, video: 'balal.webm', poster: 'balal_poster.webp', title: 'Balal' },
  { id: 10, video: 'Beat.webm', poster: 'Beat_poster.webp', title: 'Beat' },
  { id: 11, video: 'Bruno.webm', poster: 'Bruno_poster.webp', title: 'Bruno' },
  { id: 12, video: 'daniel.webm', poster: 'daniel_poster.webp', title: 'Daniel' },
  { id: 13, video: 'David.webm', poster: 'David_poster.webp', title: 'David' },
  { id: 14, video: 'iilya.webm', poster: 'iilya_poster.webp', title: 'Illya' },
  { id: 15, video: 'kris.webm', poster: 'kris_poster.webp', title: 'Kris' },
  { id: 16, video: 'Maria.webm', poster: 'Maria_poster.webp', title: 'Maria' },
]

const BASE_URL = 'https://sb.oracleboxing.com/Website/transfo/'

// Constants
const FULL_WIDTH = 120
const COLLAPSED_WIDTH = 35
const GAP = 2
const MARGIN = 2

export function LiquidGlassCarousel({ items = defaultItems }: LiquidGlassCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragCurrentX, setDragCurrentX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [prevMagnify, setPrevMagnify] = useState(false)
  const [nextMagnify, setNextMagnify] = useState(false)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)

  const carouselRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const updateTranslate = useCallback((index: number) => {
    if (!carouselRef.current) return
    const containerWidth = carouselRef.current.offsetWidth
    setTranslateX(-index * containerWidth)
  }, [])

  const scrollThumbnailsToIndex = useCallback((index: number) => {
    if (!thumbnailsRef.current) return

    let scrollPosition = 0
    for (let i = 0; i < index; i++) {
      scrollPosition += COLLAPSED_WIDTH + GAP
    }

    scrollPosition += MARGIN

    const containerWidth = thumbnailsRef.current.offsetWidth
    const centerOffset = containerWidth / 2 - FULL_WIDTH / 2
    scrollPosition -= centerOffset

    thumbnailsRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })
  }, [])

  // Auto-advance to next video when current one ends
  const advanceToNext = useCallback(() => {
    if (!autoScrollEnabled) return

    setCurrentIndex(prevIndex => {
      const nextIndex = prevIndex < items.length - 1 ? prevIndex + 1 : 0
      updateTranslate(nextIndex)
      scrollThumbnailsToIndex(nextIndex)
      return nextIndex
    })
  }, [autoScrollEnabled, items.length, updateTranslate, scrollThumbnailsToIndex])

  // Disable auto-scroll on user interaction
  const disableAutoScroll = useCallback(() => {
    setAutoScrollEnabled(false)
  }, [])

  // Play/pause videos based on current index and set up ended event listener
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex]

    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play().catch(() => {
            // Autoplay might be blocked, that's ok
          })
        } else {
          video.pause()
          video.currentTime = 0
        }
      }
    })

    // Add ended event listener to current video for auto-advance
    if (currentVideo) {
      currentVideo.addEventListener('ended', advanceToNext)
    }

    return () => {
      if (currentVideo) {
        currentVideo.removeEventListener('ended', advanceToNext)
      }
    }
  }, [currentIndex, advanceToNext])

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      disableAutoScroll()
      setPrevMagnify(true)
      setTimeout(() => setPrevMagnify(false), 400)

      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      updateTranslate(newIndex)
      scrollThumbnailsToIndex(newIndex)
    }
  }

  const handleNextClick = () => {
    if (currentIndex < items.length - 1) {
      disableAutoScroll()
      setNextMagnify(true)
      setTimeout(() => setNextMagnify(false), 400)

      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      updateTranslate(newIndex)
      scrollThumbnailsToIndex(newIndex)
    }
  }

  const handleThumbnailClick = (index: number) => {
    disableAutoScroll()
    setCurrentIndex(index)
    updateTranslate(index)
    scrollThumbnailsToIndex(index)
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    disableAutoScroll()
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
    setDragCurrentX(translateX)
  }

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !carouselRef.current) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const diff = clientX - dragStartX
    setTranslateX(dragCurrentX + diff)
  }, [isDragging, dragStartX, dragCurrentX])

  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !carouselRef.current) return

    setIsDragging(false)

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX
    const offset = clientX - dragStartX
    const containerWidth = carouselRef.current.offsetWidth

    let newIndex = currentIndex

    // Threshold is 30% of container width
    if (Math.abs(offset) > containerWidth * 0.3) {
      newIndex = offset > 0 ? currentIndex - 1 : currentIndex + 1
    }

    // Clamp index
    newIndex = Math.max(0, Math.min(items.length - 1, newIndex))
    setCurrentIndex(newIndex)

    updateTranslate(newIndex)
    scrollThumbnailsToIndex(newIndex)
  }, [isDragging, dragStartX, currentIndex, items.length, updateTranslate, scrollThumbnailsToIndex])

  useEffect(() => {
    updateTranslate(currentIndex)
    scrollThumbnailsToIndex(currentIndex)

    const handleResize = () => {
      updateTranslate(currentIndex)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, updateTranslate, scrollThumbnailsToIndex])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('touchmove', handleDragMove)
      document.addEventListener('touchend', handleDragEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchmove', handleDragMove)
      document.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  const getThumbnailStyle = (index: number): React.CSSProperties => {
    const isActive = index === currentIndex
    return {
      width: isActive ? `${FULL_WIDTH}px` : `${COLLAPSED_WIDTH}px`,
      marginLeft: isActive ? `${MARGIN}px` : '0',
      marginRight: isActive ? `${MARGIN}px` : '0',
      transition: 'all 0.3s ease-out'
    }
  }

  return (
    <div className="w-full max-w-full mx-auto p-0 -mx-6">
      <div className="flex flex-col gap-0">
        {/* Main Carousel */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden rounded-t-lg bg-transparent cursor-grab select-none active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div
            className="flex will-change-transform"
            style={{
              transform: `translateX(${translateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-full flex flex-col overflow-hidden rounded-t-lg bg-gray-900"
              >
                <div className="relative w-full aspect-[9/16]">
                  <video
                    ref={(el) => { videoRefs.current[index] = el }}
                    loop={!autoScrollEnabled}
                    muted
                    playsInline
                    poster={`${BASE_URL}${item.poster}`}
                    className="w-full h-full object-cover rounded-t-lg"
                  >
                    <source src={`${BASE_URL}${item.video}`} type="video/webm" />
                  </video>
                </div>
              </div>
            ))}
          </div>

          {/* Previous Button with Liquid Glass */}
          <button
            className={`absolute top-1/2 left-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-200 backdrop-blur-[20px] saturate-[180%] bg-slate-50/75 border border-white/90 shadow-[0_8px_32px_rgba(17,17,17,0.08),0_2px_8px_rgba(17,17,17,0.04),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(17,17,17,0.03)] disabled:opacity-40 disabled:cursor-not-allowed opacity-70 hover:enabled:scale-110 hover:enabled:opacity-100 active:enabled:scale-95 ${prevMagnify ? 'scale-[1.15] bg-slate-50/85' : ''}`}
            disabled={currentIndex === 0}
            onClick={handlePrevClick}
            aria-label="Previous video"
          >
            <svg
              className={`w-6 h-6 text-gray-900 transition-transform duration-200 ${prevMagnify ? 'scale-[1.15] drop-shadow-md' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button with Liquid Glass */}
          <button
            className={`absolute top-1/2 right-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-200 backdrop-blur-[20px] saturate-[180%] bg-slate-50/75 border border-white/90 shadow-[0_8px_32px_rgba(17,17,17,0.08),0_2px_8px_rgba(17,17,17,0.04),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(17,17,17,0.03)] disabled:opacity-40 disabled:cursor-not-allowed opacity-70 hover:enabled:scale-110 hover:enabled:opacity-100 active:enabled:scale-95 ${nextMagnify ? 'scale-[1.15] bg-slate-50/85' : ''}`}
            disabled={currentIndex === items.length - 1}
            onClick={handleNextClick}
            aria-label="Next video"
          >
            <svg
              className={`w-6 h-6 text-gray-900 transition-transform duration-200 ${nextMagnify ? 'scale-[1.15] drop-shadow-md' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Video Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white py-1 px-3 rounded-full text-sm font-medium pointer-events-none">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div
          ref={thumbnailsRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-0 h-20 pb-0 w-fit">
            {items.map((item, i) => (
              <button
                key={item.id}
                className={`relative flex-shrink-0 h-full overflow-hidden border-none cursor-pointer p-0 bg-transparent ${i === currentIndex ? 'ring-2 ring-gray-900' : ''}`}
                style={getThumbnailStyle(i)}
                onClick={() => handleThumbnailClick(i)}
                aria-label={`View video ${i + 1}: ${item.title}`}
              >
                <Image
                  src={`${BASE_URL}${item.poster}`}
                  alt={item.title}
                  fill
                  className="object-cover pointer-events-none select-none"
                  draggable={false}
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiquidGlassCarousel
