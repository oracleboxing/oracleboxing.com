'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { EpicCTAButton } from '@/components/EpicCTAButton'

interface TransformationStoryProps {
  onCTAClick?: () => void;
}

interface Testimonial {
  name: string
  image: string
  badge: string
  title: string
  content: string[]
  hashtag?: string
}

export default function TransformationStory({ onCTAClick }: TransformationStoryProps) {
  const fontFamily = 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const testimonials: Testimonial[] = [
    {
      name: "Bruno Martins",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/bruno-256.webp",
      badge: "10h (edited) • 🏆 Win of the Day",
      title: "Week 6! Here you are... and damn that went fast!",
      content: [
        "Even today, while still recovering from a bit of a flu, I somehow found myself waking up at 6:40 AM for a +5km run.",
        "I can genuinely SEE and FEEL the shift happening — and it's all been sparked by being part of Oracle Boxing.",
        "The value that the coaches bring is WAY BEYOND what I ever expected when I joined this challenge."
      ],
      hashtag: "#FUCKPLANB"
    },
    {
      name: "Daniel Ramirez",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/daniel-256.webp",
      badge: "1d ago • 🏆 WOTD",
      title: "Week 6 🤯 - The final results",
      content: [
        "This is it. These are the final results that I got from the last 6 weeks of this challenge. It's been a pleasure to join this community.",
        "The material is very rich in content, from videos to coaching calls, even 1-1 calls for the top 10.",
        "The Boxing Masterclass course was a huge rewiring of my thinking. You could be training here and learning new things for months, maybe years! 🥶"
      ]
    },
    {
      name: "Illya",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/iilya-256.webp",
      badge: "2d ago",
      title: "JOINING ORACLE BOXING",
      content: [
        "I already made it clear I'm in Oracle Boxing for the long haul. Just now, I had yet another epiphany about just what an amazing decision I made when I first joined up.",
        "I am truly humbled by the passion, dedication and depth of analysis exemplified by our coaches here.",
        "If you were attracted to this place by the excitement of becoming a real boxer, then dive in DEEP, knowing you have every asset necessary to achieve exactly that and change your life forever."
      ],
      hashtag: "#FUCKPLANB"
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Swipe handlers
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
      nextTestimonial()
    }
    if (isRightSwipe) {
      prevTestimonial()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  // Handle click on left/right side of testimonial (both mobile and desktop)
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const cardWidth = rect.width

    if (clickX < cardWidth / 2) {
      prevTestimonial()
    } else {
      nextTestimonial()
    }
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="relative bg-white py-12 sm:py-16 lg:py-20 overflow-hidden" style={{ fontFamily }}>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-4" style={{ fontFamily: 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontWeight: '700', color: '#222', letterSpacing: '0.02em', lineHeight: '1.2' }}>
            Real Boxing, Smart System
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto relative">
          <div
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 cursor-pointer select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleCardClick}
          >
            {/* Profile Header */}
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h3 className="font-bold text-gray-900">{currentTestimonial.name}</h3>
                <p className="text-sm text-gray-500">{currentTestimonial.badge}</p>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="space-y-3 text-gray-700">
              <p className="font-semibold text-lg">{currentTestimonial.title}</p>
              {currentTestimonial.content.map((paragraph, index) => (
                <p key={index} className="text-sm sm:text-base md:text-lg leading-relaxed">{paragraph}</p>
              ))}
              {currentTestimonial.hashtag && (
                <p className="font-bold pt-2">{currentTestimonial.hashtag}</p>
              )}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-gray-900 w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          {onCTAClick && (
            <div className="text-center mt-8">
              <EpicCTAButton
                size="lg"
                className="min-h-[52px] sm:min-h-[56px]"
                onClick={onCTAClick}
                trackingName="transformation-story"
              >
                <span className="text-lg sm:text-xl font-black uppercase">VIEW DETAILS</span>
              </EpicCTAButton>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}