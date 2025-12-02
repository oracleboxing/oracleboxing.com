'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export function ApparelCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let isPaused = false

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += 1.2

        // Reset to beginning when reaching end
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0
        }
      }
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    const handleMouseEnter = () => {
      // Only pause on desktop (window width > 768px)
      if (window.innerWidth > 768) {
        isPaused = true
      }
    }

    const handleMouseLeave = () => {
      isPaused = false
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const colors = ['black', 'blue', 'green', 'grey', 'brown']
  const items = ['hoodie', 'jogger']

  // Generate all image combinations - only front views, no jogger backs
  const allImages = colors.flatMap(color =>
    items.flatMap(item => {
      // For joggers, only include front view
      if (item === 'jogger') {
        return [{
          src: `https://media.oracleboxing.com/tracksuit/${item}_${color}_front.webp`,
          alt: `Oracle Boxing ${item} - ${color} front`
        }]
      }
      // For hoodies, include both views
      return ['back', 'front'].map(view => ({
        src: `https://media.oracleboxing.com/tracksuit/${item}_${color}_${view}.webp`,
        alt: `Oracle Boxing ${item} - ${color} ${view}`
      }))
    })
  )

  // Duplicate for infinite scroll
  const duplicatedImages = [...allImages, ...allImages]

  return (
    <div className="w-full overflow-hidden py-4">
      <div
        ref={scrollRef}
        className="flex gap-4 scrollbar-hide"
        style={{
          display: 'flex',
          overflow: 'scroll',
          whiteSpace: 'nowrap',
          width: '100%',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="flex-shrink-0 w-[200px] sm:w-[240px] lg:w-[280px] rounded-xl overflow-hidden shadow-lg"
            style={{ display: 'inline-block' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={280}
              height={350}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
