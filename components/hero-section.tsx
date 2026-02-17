"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowButton } from "@/components/ui/arrow-button"
import { getCheckoutUrl } from "@/lib/enrollment"
import { trackAddToCart } from "@/lib/webhook-tracking"
// Campaign removed
import { useCurrency } from "@/contexts/CurrencyContext"
import { getProductPrice } from "@/lib/currency"

// Lazy video component for hero transformation
function HeroVideo({
  src,
  poster,
  label,
  labelPosition,
}: {
  src: string
  poster: string
  label: string
  labelPosition: 'left' | 'right'
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !isVisible) return

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )

    playObserver.observe(video)
    return () => playObserver.disconnect()
  }, [isVisible])

  return (
    <div ref={containerRef} className="relative overflow-hidden aspect-[9/16] lg:aspect-auto lg:h-full bg-[#f0ede8]">
      {isVisible ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
        />
      ) : (
        <img
          src={poster}
          alt={`${label} transformation preview`}
          className="absolute inset-0 w-[120%] h-full object-cover left-1/2 -translate-x-1/2"
          loading="lazy"
        />
      )}
      <div className={labelPosition === 'left'
        ? 'absolute top-0 left-0 bg-[#37322F]/70 backdrop-blur-sm px-2 py-1 lg:px-3 lg:py-1.5 rounded-br-md'
        : 'absolute top-0 right-0 bg-[#37322F]/70 backdrop-blur-sm px-2 py-1 lg:px-3 lg:py-1.5 rounded-bl-md'
      }>
        <span className="text-white text-[10px] lg:text-xs font-semibold tracking-wide">
          {label}
        </span>
      </div>
    </div>
  )
}

export function HeroSection() {
  const { currency } = useCurrency()
  const price = getProductPrice('21dc_entry', currency) || 147
  // Campaign countdown removed

  return (
    <section className="relative bg-white pt-6 sm:pt-8 md:pt-12 pb-12 md:pb-16 overflow-hidden border-b border-[rgba(55,50,47,0.12)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left - Text + CTA */}
          <div className="flex-1 flex flex-col items-center lg:items-start gap-5 text-center lg:text-left">
            <h1
              className="max-w-[600px] text-[#37322F] text-hero font-normal leading-tight lg:leading-[1.15]"
            >
              <span className="block tracking-tight">Learn the 3 Pillars</span>
              <span className="block tracking-wide">of Boxing in 21 Days</span>
            </h1>
            <p className="max-w-[500px] text-[#605A57] text-sub font-medium leading-6 sm:leading-8">
              Live coaching&nbsp;&bull;&nbsp;Video feedback&nbsp;&bull;&nbsp;Money-back guarantee
            </p>

            {/* CTA Button */}
            <div className="flex flex-col items-center lg:items-start gap-4 mt-1">
              <p className="text-[#847971] text-title font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                Complete the bare minimum. Get all your money back.
              </p>
              <ArrowButton
                href={getCheckoutUrl()}
                onClick={() => trackAddToCart('21dc-entry', '21-Day Challenge', price, currency, 'hero')}
              >
                Join Now
              </ArrowButton>
            </div>
          </div>

          {/* Right - Shalyn Transformation */}
          <div className="flex-1 w-full max-w-[480px] lg:max-w-none">
            <div className="grid grid-cols-2 gap-px rounded-lg overflow-hidden lg:h-[min(75vh,600px)]">
              <HeroVideo
                src="https://sb.oracleboxing.com/transfo-v2/shalyn_before.webm"
                poster="https://sb.oracleboxing.com/transfo-v2/shalyn_before_poster.webp"
                label="BEFORE"
                labelPosition="left"
              />
              <HeroVideo
                src="https://sb.oracleboxing.com/transfo-v2/shalyn_after.webm"
                poster="https://sb.oracleboxing.com/transfo-v2/shalyn_after_poster.webp"
                label="AFTER"
                labelPosition="right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
