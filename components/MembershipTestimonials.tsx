'use client'

import { useRef } from 'react'
import Image from 'next/image'

interface MembershipTestimonial {
  name: string
  role: string
  content: string
  image: string
}

interface MembershipTestimonialsProps {
  testimonials: MembershipTestimonial[]
}

export function MembershipTestimonials({ testimonials }: MembershipTestimonialsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
          Engineered for results
        </h2>

        {/* Mobile: Horizontal scrolling carousel */}
        <div
          ref={scrollContainerRef}
          className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border-4 border-black rounded-xl px-4 sm:px-5 py-3 sm:py-4 flex-shrink-0 w-[85vw] snap-center shadow-md"
            >
              {/* 5-star rating */}
              <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-sm sm:text-base text-black font-bold mb-3 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Profile Picture */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <div className="font-bold text-black text-sm sm:text-base">{testimonial.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: 2-column grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border-4 border-black rounded-xl px-5 py-4 shadow-md"
            >
              {/* 5-star rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-base text-black font-bold mb-3 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <div className="font-bold text-black text-base">{testimonial.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
