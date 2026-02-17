"use client"

import Image from "next/image"
import { useRef, useEffect, useState } from "react"

interface Testimonial {
  quote: string
  name: string
  role: string
  image: string
}

const testimonials: Testimonial[] = [
  { quote: "It's transformed me in so many ways and the real joy of it is I'm not the only one.", name: "Kristopher Saville", role: "Strategic Business Development Director", image: "https://sb.oracleboxing.com/Website/kris.jpg" },
  { quote: "The value that the coaches bring is WAY BEYOND what I ever expected when I joined this challenge.", name: "Bruno Martins", role: "Engineer", image: "https://sb.oracleboxing.com/Website/1560863789646.jpeg" },
  { quote: "I've improved more in 3 weeks with Oracle than 2 years at my local gym.", name: "Kris Qually", role: "Sales Professional", image: "https://sb.oracleboxing.com/Website/kris_qually.webp" },
  { quote: "Oracle Boxing is a team of top notch young dedicated boxers bringing sharpest boxing technique, attention and dedication to you individually.", name: "Anton Polyakov", role: "PhD, Director at NVIDIA", image: "https://sb.oracleboxing.com/Website/anton.webp" },
  { quote: "As a minority in the martial arts world, I feel safe joining classes in this respectful community, where scientific coaching has truly transformed my movement.", name: "Meiyan C", role: "PhD, Organizational Culture Strategist at Google", image: "https://sb.oracleboxing.com/Website/meiyan.webp" },
  { quote: "Oracle Boxing is all about fun, form, and focus - embedded in a strong, supportive community of coaches and fellow boxing enthusiasts.", name: "Mike Forouzanfar", role: "Consultant Urologist & Pelvic-Floor Specialist", image: "https://sb.oracleboxing.com/Website/Forouzanfar-M.-Uroloog_LR.webp" },
  { quote: "Boxing elevated to a true martial art, curated for and shared by a dedicated, supportive and truly special community.", name: "Rod Keher", role: "CEO", image: "https://sb.oracleboxing.com/Website/rod.webp" },
  { quote: "I came for better boxing, but this community completely reset my mindset - and that's made me better in boxing, business, and life.", name: "Leo Carrillo III", role: "CEO & Co-Founder, Craft", image: "https://sb.oracleboxing.com/Website/leo.webp" },
  { quote: "Real coaching, real people, real progress - that's what makes this class different.", name: "Pascal Perau", role: "Software Developer", image: "https://sb.oracleboxing.com/Website/pascal.webp" },
  { quote: "No matter how rough my day was, the training with Oracle boxing team brings me back on track.", name: "Thomas Haeusle", role: "Managing Director / CSO", image: "https://sb.oracleboxing.com/Website/thomas.webp" },
]

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="flex-shrink-0 w-[300px] md:w-[340px] rounded-xl p-4 md:p-5"
      style={{
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(16px) saturate(1.6)",
        WebkitBackdropFilter: "blur(16px) saturate(1.6)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow: "none",
      }}
    >
      <p className="text-[#37322F] text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <Image src={t.image} alt={t.name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-[#37322F] text-xs font-semibold">{t.name}</p>
          <p className="text-[#9CA3AF] text-[10px]">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialMarquee() {
  return (
    <section className="w-full py-12 md:py-16 overflow-hidden bg-white testimonial-marquee-section">
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling track - two identical sets for seamless loop */}
        <div
          className="inline-flex gap-4 md:gap-6"
          style={{
            animation: 'testimonial-marquee var(--marquee-speed, 35s) linear infinite',
            willChange: 'transform',
            width: 'max-content',
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
          {testimonials.map((t, i) => (
            <TestimonialCard key={`dup-${i}`} t={t} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes testimonial-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .testimonial-marquee-section { --marquee-speed: 40s; }
        @media (min-width: 768px) {
          .testimonial-marquee-section { --marquee-speed: 55s; }
        }
      `}</style>
    </section>
  )
}
