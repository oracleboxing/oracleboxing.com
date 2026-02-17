'use client'

import { useEffect, useRef, useState } from 'react'
import { Testimonial } from '@/lib/testimonials'

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Only run animation when visible
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(scrollContainer)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || !isVisible) return

    let animationId: number
    let isPaused = false

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += 1.1

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
  }, [isVisible])

  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="w-full py-4 sm:py-6 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 scrollbar-hide"
        style={{
          display: 'flex',
          overflow: 'scroll',
          whiteSpace: 'nowrap',
          width: '100%',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.name}-${index}`}
            className="flex-shrink-0 w-[280px] sm:w-[350px] bg-gray-50 rounded-2xl p-5 sm:p-6"
            style={{ display: 'inline-block', whiteSpace: 'normal' }}
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-body text-gray-700 leading-relaxed mb-4 line-clamp-3">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <p className="font-semibold text-gray-900 text-body">{testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
