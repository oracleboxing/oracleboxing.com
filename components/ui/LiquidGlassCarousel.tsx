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
  { id: 1, video: 'kris_prob4.webm', poster: 'kris_prob4_poster.webp', title: 'Kris' },
  { id: 2, video: 'zyginta_prob4.webm', poster: 'zyginta_prob4_poster.webp', title: 'Zyginta' },
  { id: 3, video: 'andre_prob4.webm', poster: 'andre_prob4_poster.webp', title: 'Andre' },
  { id: 4, video: 'sha-lyn_prob4.webm', poster: 'sha-lyn_prob4_poster.webp', title: 'Sha-lyn' },
  { id: 5, video: 'Niclas_prob4.webm', poster: 'Niclas_prob4_poster.webp', title: 'Niclas' },
  { id: 6, video: 'rod_prob4.webm', poster: 'rod_prob4_poster.webp', title: 'Rod' },
  { id: 7, video: 'nico_prob4.webm', poster: 'nico_prob4_poster.webp', title: 'Nico' },
  { id: 8, video: 'keli_prob4.webm', poster: 'keli_prob4_poster.webp', title: 'Keli' },
  { id: 9, video: 'balal_prob4.webm', poster: 'balal_prob4_poster.webp', title: 'Balal' },
  { id: 10, video: 'daniel_prob4.webm', poster: 'daniel_prob4_poster.webp', title: 'Daniel' },
  { id: 11, video: 'David_prob4.webm', poster: 'David_prob4_poster.webp', title: 'David' },
  { id: 12, video: 'ilyas_prob4.webm', poster: 'ilyas_prob4_poster.webp', title: 'Ilyas' },
  { id: 13, video: 'Maria_prob4_Copy(1).webm', poster: 'Maria_prob4_poster.webp', title: 'Maria' },
  { id: 14, video: 'lovensky_prob4.webm', poster: 'lovensky_prob4_poster.webp', title: 'Lovensky' },
]

const BASE_URL = 'https://sb.oracleboxing.com/transfo/'

// Constants for thumbnails
const FULL_WIDTH = 120
const COLLAPSED_WIDTH = 35
const GAP = 2
const MARGIN = 2

export function LiquidGlassCarousel({ items = defaultItems }: LiquidGlassCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)

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
    setCurrentIndex(prevIndex => {
      const nextIndex = prevIndex < items.length - 1 ? prevIndex + 1 : 0
      updateTranslate(nextIndex)
      scrollThumbnailsToIndex(nextIndex)
      return nextIndex
    })
  }, [items.length, updateTranslate, scrollThumbnailsToIndex])

  // Update container height based on current video dimensions
  const updateContainerHeight = useCallback(() => {
    const currentVideo = videoRefs.current[currentIndex]
    if (currentVideo && carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth
      const videoWidth = currentVideo.videoWidth || currentVideo.offsetWidth
      const videoHeight = currentVideo.videoHeight || currentVideo.offsetHeight

      if (videoWidth && videoHeight) {
        const aspectRatio = videoHeight / videoWidth
        const newHeight = containerWidth * aspectRatio
        setContainerHeight(newHeight)
      }
    }
  }, [currentIndex])

  // Play current video, pause others, and set up ended event listener
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

    if (currentVideo) {
      currentVideo.addEventListener('ended', advanceToNext)
      currentVideo.addEventListener('loadedmetadata', updateContainerHeight)
      updateContainerHeight()
    }

    return () => {
      if (currentVideo) {
        currentVideo.removeEventListener('ended', advanceToNext)
        currentVideo.removeEventListener('loadedmetadata', updateContainerHeight)
      }
    }
  }, [currentIndex, advanceToNext, updateContainerHeight])

  // Handle resize
  useEffect(() => {
    updateTranslate(currentIndex)
    scrollThumbnailsToIndex(currentIndex)

    const handleResize = () => {
      updateTranslate(currentIndex)
      updateContainerHeight()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, updateTranslate, scrollThumbnailsToIndex, updateContainerHeight])

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
    <div className="w-full max-w-full mx-auto p-0">
      <div className="flex flex-col gap-0">
        {/* Main Carousel */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden rounded-t-lg bg-transparent transition-[height] duration-300 ease-out"
          style={{ height: containerHeight ? `${containerHeight}px` : 'auto' }}
        >
          <div
            className="flex will-change-transform"
            style={{
              transform: `translateX(${translateX}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-full flex flex-col overflow-hidden rounded-t-lg bg-gray-900"
              >
                <video
                  ref={(el) => { videoRefs.current[index] = el }}
                  autoPlay={index === 0}
                  muted
                  playsInline
                  preload="auto"
                  poster={`${BASE_URL}${item.poster}`}
                  className="w-full h-auto rounded-t-lg pointer-events-none"
                >
                  <source src={`${BASE_URL}${item.video}`} type="video/webm" />
                </video>
              </div>
            ))}
          </div>

          {/* Video Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white py-1 px-3 rounded-full text-sm font-medium pointer-events-none">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div
          ref={thumbnailsRef}
          className="overflow-x-auto scrollbar-hide pointer-events-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-0 h-20 pb-0 w-fit">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`relative flex-shrink-0 h-full overflow-hidden p-0 bg-transparent ${i === currentIndex ? 'ring-2 ring-gray-900' : ''}`}
                style={getThumbnailStyle(i)}
              >
                <Image
                  src={`${BASE_URL}${item.poster}`}
                  alt={item.title}
                  fill
                  className="object-cover pointer-events-none select-none"
                  draggable={false}
                  sizes="120px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiquidGlassCarousel
