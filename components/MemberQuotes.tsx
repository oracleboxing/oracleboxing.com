'use client'

import { useEffect, useRef, useState } from 'react'

const quote = "Boxing doesn't mute what's inside me. It gives it structure, discipline and purpose."

export function MemberQuotes() {
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Start revealing when section enters viewport, complete when it's centered
      const startPoint = windowHeight * 0.8
      const endPoint = windowHeight * 0.3

      if (rect.top <= startPoint && rect.top >= endPoint) {
        const scrollProgress = (startPoint - rect.top) / (startPoint - endPoint)
        setProgress(Math.min(Math.max(scrollProgress, 0), 1))
      } else if (rect.top < endPoint) {
        setProgress(1)
      } else {
        setProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const words = quote.split(' ')
  const totalWords = words.length

  return (
    <section ref={sectionRef} className="w-full py-24 md:py-40">
      <div className="max-w-[900px] mx-auto px-6">
        <p
          className="text-center text-hero leading-tight md:leading-snug"
          style={{
            letterSpacing: '-0.02em',
          }}
        >
          <span className={`transition-all duration-300 ${progress > 0 ? 'text-[#37322F]' : 'text-[#37322F]/20'}`}>"</span>
          {words.map((word, index) => {
            // Calculate if this word should be bold based on scroll progress
            const wordThreshold = index / totalWords
            const isActive = progress > wordThreshold

            return (
              <span
                key={index}
                className={`transition-all duration-300 ${
                  isActive
                    ? 'text-[#37322F] font-medium'
                    : 'text-[#37322F]/20 font-normal'
                }`}
              >
                {word}{index < words.length - 1 ? ' ' : ''}
              </span>
            )
          })}
          <span className={`transition-all duration-300 ${progress >= 1 ? 'text-[#37322F]' : 'text-[#37322F]/20'}`}>"</span>
        </p>
      </div>
    </section>
  )
}
