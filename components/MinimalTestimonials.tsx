'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Testimonial {
  quote: string
  name: string
  role: string
  image: string
}

const testimonials: Testimonial[] = [
  {
    quote: "It's transformed me in so many ways and the real joy of it is I'm not the only one.",
    name: "Kristopher Saville",
    role: "Consultant",
    image: "https://sb.oracleboxing.com/Website/kris.jpg"
  },
  {
    quote: "The value that the coaches bring is WAY BEYOND what I ever expected when I joined this challenge.",
    name: "Bruno Martins",
    role: "Engineer",
    image: "https://sb.oracleboxing.com/1560863789646.jpeg"
  }
]

export default function MinimalTestimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="w-full bg-[#FFFCF5] py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Quote */}
        <div className="relative min-h-[80px] md:min-h-[60px] mb-8">
          {testimonials.map((testimonial, index) => (
            <blockquote
              key={index}
              className={`absolute inset-0 text-center transition-all duration-500 ease-out ${
                active === index
                  ? 'opacity-100 translate-y-0 blur-0'
                  : 'opacity-0 translate-y-4 blur-sm pointer-events-none'
              }`}
            >
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-[#37322F] leading-relaxed font-medium" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
                "{testimonial.quote}"
              </p>
            </blockquote>
          ))}
        </div>

        {/* Author Section */}
        <div className="flex items-center justify-center gap-4">
          {/* Avatars */}
          <div className="flex -space-x-3">
            {testimonials.map((testimonial, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`relative w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white transition-all duration-300 ${
                  active === index
                    ? 'scale-110 z-10 grayscale-0'
                    : 'scale-100 grayscale hover:grayscale-0'
                }`}
              >
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-8 sm:h-10 bg-[rgba(55,50,47,0.2)]" />

          {/* Name and Role */}
          <div className="relative h-10 sm:h-12 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-400 ease-out ${
                  active === index
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                }`}
              >
                <p className="text-sm sm:text-base font-semibold text-[#37322F]" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
                  {testimonial.name}
                </p>
                <p className="text-xs sm:text-sm text-[rgba(55,50,47,0.6)] whitespace-nowrap" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
