'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollQuoteProps {
  quote: string
}

export function ScrollQuote({ quote }: ScrollQuoteProps) {
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

  // Split by newlines first, then by spaces within each line
  const lines = quote.split('\n')
  const allWords: { word: string; isLineEnd: boolean }[] = []

  lines.forEach((line, lineIndex) => {
    const wordsInLine = line.split(' ')
    wordsInLine.forEach((word, wordIndex) => {
      allWords.push({
        word,
        isLineEnd: lineIndex < lines.length - 1 && wordIndex === wordsInLine.length - 1
      })
    })
  })

  const totalWords = allWords.length

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-32 border-b border-[rgba(55,50,47,0.12)]">
      <div className="max-w-[900px] mx-auto px-6">
        <p
          className="text-center text-hero leading-tight md:leading-snug"
          style={{
            letterSpacing: '-0.02em',
          }}
        >
          <span className={`transition-all duration-300 ${progress > 0 ? 'text-[#37322F]' : 'text-[#37322F]/20'}`}>"</span>
          {allWords.map((item, index) => {
            // Calculate if this word should be bold based on scroll progress
            const wordThreshold = index / totalWords
            const isActive = progress > wordThreshold

            return (
              <span key={index}>
                <span
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'text-[#37322F] font-medium'
                      : 'text-[#37322F]/20 font-normal'
                  }`}
                >
                  {item.word}
                </span>
                {item.isLineEnd ? <br /> : (index < allWords.length - 1 ? ' ' : '')}
              </span>
            )
          })}
          <span className={`transition-all duration-300 ${progress >= 1 ? 'text-[#37322F]' : 'text-[#37322F]/20'}`}>"</span>
        </p>
      </div>
    </section>
  )
}
