'use client'

import { useRef, useEffect, useState } from 'react'
import { TracksuitColor } from '@/lib/tracksuit-config'
import Image from 'next/image'

interface HoodieImageGalleryProps {
  selectedColor: TracksuitColor
  children: React.ReactNode
}

// Color name mapping for image filenames
const colorNameMap: Record<TracksuitColor, string> = {
  Forest: 'green',
  Hazel: 'brown',
  Steel: 'blue',
  Black: 'black',
}

// Image configuration for hoodie only (no joggers)
const imageConfigs = [
  { label: 'Hoodie Front', prefix: 'hoodie', angle: 'front', type: '' },
  { label: 'Hoodie Back', prefix: 'hoodie', angle: 'back', type: '' },
  { label: 'Model Front', prefix: 'hoodie', angle: 'front', type: 'model' },
  { label: 'Model Back', prefix: 'hoodie', angle: 'back', type: 'model' },
]

export function HoodieImageGallery({ selectedColor, children }: HoodieImageGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageScrollRef = useRef<HTMLDivElement>(null)
  const [mobileImageIndex, setMobileImageIndex] = useState(1) // Start with back image
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const colorName = colorNameMap[selectedColor]

  // Sync page scroll to image scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !imageScrollRef.current) return
      if (window.innerWidth < 1024) return // Skip on mobile

      const section = sectionRef.current
      const imageScroll = imageScrollRef.current
      const rect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight
      const windowHeight = window.innerHeight

      // Calculate scroll progress through this section (0 to 1)
      const scrollStart = 0
      const scrollEnd = sectionHeight - windowHeight
      const currentScroll = -rect.top
      const scrollProgress = Math.max(0, Math.min(1, (currentScroll - scrollStart) / scrollEnd))

      // Calculate max scroll for images
      const maxScroll = imageScroll.scrollHeight - imageScroll.clientHeight

      // Set image scroll position
      imageScroll.scrollTop = scrollProgress * maxScroll
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setMobileImageIndex((prev) => (prev + 1) % imageConfigs.length)
    }
    if (isRightSwipe) {
      setMobileImageIndex((prev) => (prev - 1 + imageConfigs.length) % imageConfigs.length)
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <>
      {/* Desktop Layout */}
      <div ref={sectionRef} className="hidden lg:block" style={{ height: '500vh' }}>
        <div className="sticky top-0 h-screen">
          <div className="grid grid-cols-[60%_40%] h-full">
            {/* Left: Image Gallery - 60% width */}
            <div
              ref={imageScrollRef}
              className="relative bg-white overflow-y-scroll scrollbar-hide pointer-events-none"
              style={{ height: '100vh' }}
            >
              <div className="grid grid-cols-2 gap-0">
                {imageConfigs.map((config, index) => {
                  const imageUrl = config.type
                    ? `https://media.oracleboxing.com/tracksuit/${config.prefix}_${colorName}_${config.angle}_${config.type}.webp`
                    : `https://media.oracleboxing.com/tracksuit/${config.prefix}_${colorName}_${config.angle}.webp`
                  return (
                    <div key={index} className="aspect-[3/4] overflow-hidden bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={`${selectedColor} - ${config.label}`}
                        width={800}
                        height={1067}
                        className="w-full h-full object-cover"
                        unoptimized
                        onError={(e) => {
                          console.error('Failed to load image:', imageUrl)
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Product Selector - 40% width */}
            <div className="p-8 lg:p-12 bg-gray-50 overflow-y-auto" style={{ height: '100vh' }}>
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Swipeable Carousel */}
      <div className="lg:hidden">
        {/* Image Carousel */}
        <div
          className="relative bg-white overflow-hidden"
          style={{ height: '60vh' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="h-full transition-transform duration-300 ease-out flex"
            style={{
              transform: `translateX(-${mobileImageIndex * 100}%)`,
            }}
          >
            {imageConfigs.map((config, index) => {
              const imageUrl = config.type
                ? `https://media.oracleboxing.com/tracksuit/${config.prefix}_${colorName}_${config.angle}_${config.type}.webp`
                : `https://media.oracleboxing.com/tracksuit/${config.prefix}_${colorName}_${config.angle}.webp`
              return (
                <div key={index} className="flex-shrink-0 w-full h-full">
                  <Image
                    src={imageUrl}
                    alt={`${selectedColor} - ${config.label}`}
                    width={800}
                    height={1067}
                    className="w-full h-full object-cover"
                    unoptimized
                    onError={(e) => {
                      console.error('Failed to load image:', imageUrl)
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {imageConfigs.map((_, index) => (
              <button
                key={index}
                onClick={() => setMobileImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === mobileImageIndex ? 'bg-black w-6' : 'bg-black/30'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Product Selector */}
        <div className="p-6 bg-gray-50">
          {children}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}
