"use client";

import { useEffect, useRef, useState } from 'react';
import { EpicCTAButton } from '@/components/EpicCTAButton';

interface TestimonialsWithMediaSectionProps {
  onCTAClick?: () => void;
  onOpenPricing?: () => void;
}

// Lazy video that only loads and plays when visible
function LazyTestimonialVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(() => {})
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause()
        }
      },
      { threshold: 0.3, rootMargin: '100px' }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative aspect-video rounded-xl overflow-hidden lg:max-w-md lg:mx-auto">
      {isVisible ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} type="video/webm" />
        </video>
      ) : (
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  )
}

export default function TestimonialsWithMediaSection({ onCTAClick, onOpenPricing }: TestimonialsWithMediaSectionProps) {
  return (
    <section className="w-full pt-12 pb-24 sm:py-28 lg:py-36 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-hero font-bold text-gray-900">
            <span className="bg-yellow-200/80 text-black px-2 py-[2px]">Learn the right way</span>
          </h2>
        </div>

        {/* Niclas Testimonial - Course */}
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 mb-12 sm:mb-16 lg:mb-12">
          <div className="flex gap-8 flex-col">
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                  <img
                    src="https://sb.oracleboxing.com/webp/Website/niclas.webp"
                    alt="Niclas Laux"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-gray-900 font-semibold text-body">Niclas Laux</h4>
                    <p className="text-gray-600 text-body">
                      Founder of Samurai Movement Academy, BJJ Purple Belt, Self-Defense Instructor
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 sm:mt-1 italic">
                      Boxing Masterclass Course
                    </p>
                  </div>
                </div>
                <blockquote className="text-title text-gray-700 leading-relaxed">
                  This course showed me where my power comes from. I can't thank you enough for helping me box better! It was the best choice I ever made - the "aha!" moments are amazing!
                </blockquote>
              </div>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden lg:max-w-md lg:mx-auto" style={{ aspectRatio: '16/9' }}>
            <img
              src="https://sb.oracleboxing.com/webp/Website/laptop_mockup.webp"
              alt="Boxing Masterclass Course"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Torey Testimonial - Live Coaching */}
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 mb-12 sm:mb-16 lg:mb-12">
          <div className="order-2 lg:order-1">
            <LazyTestimonialVideo
              src="https://sb.oracleboxing.com/Website/optimized/videos/obcoachingcall-optimized.webm"
              poster="https://sb.oracleboxing.com/Website/obcoachingcall-frame.jpg"
            />
          </div>
          <div className="flex gap-8 flex-col order-1 lg:order-2">
            <div className="lg:pl-6">
              <div className="bg-white rounded-xl p-4 sm:p-6">
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                    <img
                      src="https://sb.oracleboxing.com/webp/Website/torey.webp"
                      alt="Torey Goodall"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-gray-900 font-semibold text-body">Torey Goodall</h4>
                      <p className="text-gray-600 text-body">
                        Community Member & Boxing Enthusiast
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-title text-gray-700 leading-relaxed">
                    I came back to this community and already made big progress on Toni and Oliver's Zoom calls. I have to say - you guys are really good at coaching online. I learn so much about boxing technique every time I join a call.
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balal Testimonial - Community */}
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 mb-12">
          <div className="flex gap-8 flex-col">
            <div className="lg:pl-6">
              <div className="bg-white rounded-xl p-4 sm:p-6">
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                    <img
                      src="https://sb.oracleboxing.com/webp/Website/balal.webp"
                      alt="Balal Hanif"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-gray-900 font-semibold text-body">Balal Hanif</h4>
                      <p className="text-gray-600 text-body">
                        Community Member & Boxing Enthusiast
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-title text-gray-700 leading-relaxed">
                    Being part of this community has changed my life. Joining the live Zoom calls almost every day has helped me lose weight, box better, and feel more confident. The help, support, and friendship here have made a real difference in how I box.
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          <LazyTestimonialVideo
            src="https://sb.oracleboxing.com/Website/optimized/videos/online_rating-optimized.webm"
            poster="https://sb.oracleboxing.com/Website/online_rating-frame.jpg"
          />
        </div>

        {/* Final CTA Button */}
        {(onOpenPricing || onCTAClick) && (
          <div className="text-center mt-12">
            <EpicCTAButton
              size="lg"
              className="min-h-[56px]"
              onClick={() => {
                if (onOpenPricing) onOpenPricing()
                if (onCTAClick) onCTAClick()
              }}
              trackingName="testimonials"
            >
              <span className="text-sub font-black uppercase">VIEW DETAILS</span>
            </EpicCTAButton>
          </div>
        )}
      </div>
    </section>
  );
}
