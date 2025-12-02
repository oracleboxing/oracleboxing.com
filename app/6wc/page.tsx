'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ChallengePrice, ValuePrice } from '@/components/AdaptivePrice'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice } from '@/lib/currency'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function SixWeekChallengePage() {
  const { currency } = useCurrency()
  const { trackButtonClick } = useAnalytics()
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [videosLoaded, setVideosLoaded] = useState(false)

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleButtonClick = (location: string, buttonText: string) => {
    trackButtonClick(location, buttonText, '6wc', undefined, '/checkout?product=6wc')
  }

  // Benefits to display with checkmarks in price card
  const benefits = [
    { text: "100% money back", bold: " when you finish" },
    { text: "Clear 6-week training plan", bold: "" },
    { text: "Live coaching calls every week", bold: " with Oliver" },
    { text: "Personal help", bold: " on your training videos" },
    { text: "Full access", bold: " to the Boxing Masterclass" },
    { text: "Keep forever", bold: " the Boxing Roadmap" },
    { text: "Ask your coaches", bold: " questions anytime" }
  ]

  // Calculate total value in current currency
  const bffpPrice = getProductPrice('bffp', currency) || 297
  const rcvPrice = getProductPrice('rcv', currency) || 97
  const brdmpPrice = getProductPrice('brdmp', currency) || 147
  const totalValue = bffpPrice + rcvPrice + rcvPrice + brdmpPrice

  const faqs = [
    {
      question: 'Do I really get my money back if I finish?',
      answer: 'Yes! Finish all four things on the checklist by the end of the 6 weeks, and we send you your full payment back. No tricks, no fine print. Just do the work and get your money back.'
    },
    {
      question: 'What happens after the 6 weeks?',
      answer: 'After the challenge ends, you can upgrade to a full Oracle Boxing membership. This lets you keep training with our coaches, join live calls, get video feedback, and continue improving your skills for as long as you want. Many people do the challenge, love it, and then join the full community to keep going.'
    },
    {
      question: 'What if I\'m a complete beginner?',
      answer: 'Even better. We teach you the correct boxing technique from day one. Most beginners pick up bad habits from YouTube or random gym trainers. We fix that. You\'ll learn proper footwork, punch technique, and movement from coaches who actually know what they\'re doing.'
    },
    {
      question: 'What happens if I miss a coaching call?',
      answer: 'Every call gets recorded and uploaded to the Recordings Vault. You can watch it anytime. But to get your refund, you need to join at least 2 calls per week live. Watching replays doesn\'t count toward your refund checklist.'
    },
    {
      question: 'How long do I keep access to the course?',
      answer: 'The standard challenge gives you 6 weeks of access to everything. After the challenge ends, you can also upgrade to a full membership to keep learning and training with the coaches long term.'
    },
    {
      question: 'What equipment do I need?',
      answer: 'Just boxing gloves and some space to move. If you have a heavy bag, great. If not, shadowboxing works too. You don\'t need a fancy gym or expensive gear. Most people train at home and get amazing results.'
    },
    {
      question: 'What if I can\'t keep up?',
      answer: 'The challenge is designed for real people with real lives. You don\'t need to train for hours every day. Most workouts are 20 to 30 minutes. Join 2 calls per week, post 1 feedback video, finish the course, and attend 2 special calls. That\'s it.'
    },
    {
      question: 'Can I still join if I live in a different time zone?',
      answer: 'Yes! We have members all over the world. Every coaching call is recorded, so even if you can\'t make it live, you can watch the replay. Just remember, you need to attend at least 2 live calls per week to qualify for the refund.'
    },
    {
      question: 'What makes this different from YouTube tutorials?',
      answer: 'YouTube gives you random videos with no structure. This is a complete system. You get a step by step course, live coaching twice a week, personal feedback on your videos, and a whole community pushing you forward. Plus, you can actually ask questions and get real answers from expert coaches.'
    },
    {
      question: 'Is this actually worth it?',
      answer: 'Look at the 16 transformation videos on this page. Real people, real results. You get professional coaching, a proven training system, and if you complete it, you get your money back anyway. The only way you lose is if you quit.'
    }
  ]

  return (
    <>
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "6-Week Challenge",
            "description": "6-week boxing training program with full money-back promise when you finish. Includes Boxing Masterclass, Boxing Roadmap you keep forever, live coaching, and personal help.",
            "image": "https://media.oracleboxing.com/Website/skool_art.webp",
            "brand": {
              "@type": "Brand",
              "name": "Oracle Boxing"
            },
            "offers": {
              "@type": "Offer",
              "price": "197",
              "priceCurrency": "USD",
              "availability": "https://schema.org/LimitedAvailability",
              "url": "https://oracleboxing.com/6wc",
              "priceValidUntil": "2026-12-31"
            }
          })
        }}
      />

      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-4 sm:pt-6 lg:pt-12">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-20">
          {/* 2-Column Layout on Desktop */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left" style={{ fontFamily: 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15] sm:leading-tight mb-3 sm:mb-4"
                style={{
                  fontFamily: 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: '700'
                }}
              >
                Learn Boxing Fundamentals In Under 42 Days
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed mb-5 sm:mb-6">
                A structured 6-week challenge for beginners, late starters, and frustrated sparrers. Train from home, follow the weekly plan, get live coaching.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center lg:justify-start mb-5 sm:mb-6">
                <button
                  onClick={scrollToPricing}
                  className="w-full sm:w-auto max-w-md sm:max-w-none px-6 py-3 sm:px-8 sm:py-4 bg-yellow-100 text-black border-3 sm:border-4 border-black font-black text-lg sm:text-xl rounded-xl uppercase tracking-wide shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all duration-200"
                  style={{ fontFamily: 'Satoshi' }}
                >
                  JOIN THE CHALLENGE →
                </button>
              </div>
            </div>

            {/* Right Column - VSL Video */}
            <div className="lg:order-last">
              <div className="relative w-full mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <video
                  controls
                  poster="https://media.oracleboxing.com/Website/vsl2_thumbnail.webp"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'none', opacity: 1 }}
                >
                  <source src="https://media.oracleboxing.com/Website/VSL2_2.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="max-w-6xl mx-auto px-0 sm:px-4 mt-6 sm:mt-10 lg:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 items-start">
              {/* Left Column */}
              <div className="flex flex-col gap-2.5 sm:gap-4">
                <div className="bg-white border-2 sm:border-4 border-black px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm sm:shadow-md text-left">
                  <div className="flex gap-0.5 mb-1 sm:mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[13px] sm:text-sm text-black font-semibold mb-1 sm:mb-2 leading-snug">
                    "This course showed me where my power comes from. I can't thank you enough for helping me box better! The "aha!" moments are amazing!"
                  </p>
                  <div className="font-bold text-[11px] sm:text-xs text-gray-600">Niclas Laux</div>
                </div>

                <div className="bg-white border-2 sm:border-4 border-black px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm sm:shadow-md text-left">
                  <div className="flex gap-0.5 mb-1 sm:mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[13px] sm:text-sm text-black font-semibold mb-1 sm:mb-2 leading-snug">
                    "Being part of this community has changed my life. Joining the live Zoom calls has helped me lose weight, box better, and feel more confident."
                  </p>
                  <div className="font-bold text-[11px] sm:text-xs text-gray-600">Balal Hanif</div>
                </div>

                <div className="bg-white border-2 sm:border-4 border-black px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm sm:shadow-md text-left">
                  <div className="flex gap-0.5 mb-1 sm:mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[13px] sm:text-sm text-black font-semibold mb-1 sm:mb-2 leading-snug">
                    "The value that the coaches bring is WAY BEYOND what I ever expected. I can genuinely SEE and FEEL the shift happening."
                  </p>
                  <div className="font-bold text-[11px] sm:text-xs text-gray-600">Bruno Martins</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-2.5 sm:gap-4">
                <div className="bg-white border-2 sm:border-4 border-black px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm sm:shadow-md text-left">
                  <div className="flex gap-0.5 mb-1 sm:mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[13px] sm:text-sm text-black font-semibold mb-1 sm:mb-2 leading-snug">
                    "I came back to this community and already made big progress. You guys are really good at coaching online. I learn so much every call."
                  </p>
                  <div className="font-bold text-[11px] sm:text-xs text-gray-600">Torey Goodall</div>
                </div>

                <div className="bg-white border-2 sm:border-4 border-black px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm sm:shadow-md text-left">
                  <div className="flex gap-0.5 mb-1 sm:mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[13px] sm:text-sm text-black font-semibold mb-1 sm:mb-2 leading-snug">
                    "The Boxing Masterclass course was a huge rewiring of my thinking. You could be training here for months, maybe years!"
                  </p>
                  <div className="font-bold text-[11px] sm:text-xs text-gray-600">Daniel Ramirez</div>
                </div>

                <div className="bg-white border-2 sm:border-4 border-black px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm sm:shadow-md text-left">
                  <div className="flex gap-0.5 mb-1 sm:mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[13px] sm:text-sm text-black font-semibold mb-1 sm:mb-2 leading-snug">
                    "I am truly humbled by the passion and depth of analysis here. You have every asset necessary to become a real boxer."
                  </p>
                  <div className="font-bold text-[11px] sm:text-xs text-gray-600">Illya</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Videos */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
              Does 16 transformations prove that this works?
            </h3>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-12">
              See what happens when you show up and do the work
            </p>

            {/* Desktop: 4x4 Grid layout */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4 mb-8">
              {[
                { video: 'andre.webm', poster: 'andre_poster.webp' },
                { video: 'sha-lyn.webm', poster: 'sha-lyn_poster.webp' },
                { video: 'jordan.webm', poster: 'jordan_poster.webp' },
                { video: 'charlie.webm', poster: 'charlie_poster.webp' },
                { video: 'Niclas.webm', poster: 'Niclas_poster.webp' },
                { video: 'rod.webm', poster: 'rod_poster.webp' },
                { video: 'nico.webm', poster: 'nico_poster.webp' },
                { video: 'keli.webm', poster: 'keli_poster.webp' },
                { video: 'balal.webm', poster: 'balal_poster.webp' },
                { video: 'Beat.webm', poster: 'Beat_poster.webp' },
                { video: 'Bruno.webm', poster: 'Bruno_poster.webp' },
                { video: 'daniel.webm', poster: 'daniel_poster.webp' },
                { video: 'David.webm', poster: 'David_poster.webp' },
                { video: 'iilya.webm', poster: 'iilya_poster.webp' },
                { video: 'kris.webm', poster: 'kris_poster.webp' },
                { video: 'Maria.webm', poster: 'Maria_poster.webp' }
              ].map((item, index) => (
                <div key={index} className="relative aspect-[9/16] rounded-xl overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={`https://media.oracleboxing.com/Website/transfo/${item.poster}`}
                    className="w-full h-full object-cover"
                  >
                    <source src={`https://media.oracleboxing.com/Website/transfo/${item.video}`} type="video/webm" />
                  </video>
                </div>
              ))}
            </div>

            {/* Mobile: Scrollable carousel with snap */}
            <div className="lg:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
              <div className="flex gap-4 pb-4">
                {[
                  { video: 'andre.webm', poster: 'andre_poster.webp' },
                  { video: 'sha-lyn.webm', poster: 'sha-lyn_poster.webp' },
                  { video: 'jordan.webm', poster: 'jordan_poster.webp' },
                  { video: 'charlie.webm', poster: 'charlie_poster.webp' },
                  { video: 'Niclas.webm', poster: 'Niclas_poster.webp' },
                  { video: 'rod.webm', poster: 'rod_poster.webp' },
                  { video: 'nico.webm', poster: 'nico_poster.webp' },
                  { video: 'keli.webm', poster: 'keli_poster.webp' },
                  { video: 'balal.webm', poster: 'balal_poster.webp' },
                  { video: 'Beat.webm', poster: 'Beat_poster.webp' },
                  { video: 'Bruno.webm', poster: 'Bruno_poster.webp' },
                  { video: 'daniel.webm', poster: 'daniel_poster.webp' },
                  { video: 'David.webm', poster: 'David_poster.webp' },
                  { video: 'iilya.webm', poster: 'iilya_poster.webp' },
                  { video: 'kris.webm', poster: 'kris_poster.webp' },
                  { video: 'Maria.webm', poster: 'Maria_poster.webp' },
                  { video: 'zyginta.webm', poster: 'zyginta_poster.webp' }
                ].map((item, index) => (
                  <div key={index} className="relative flex-shrink-0 w-[70vw] sm:w-[320px] aspect-[9/16] rounded-xl overflow-hidden snap-center bg-gray-200">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(https://media.oracleboxing.com/Website/transfo/${item.poster})` }}
                    />
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el
                        if (el && !videosLoaded) {
                          setVideosLoaded(true)
                        }
                      }}
                      loop
                      muted
                      playsInline
                      poster={`https://media.oracleboxing.com/Website/transfo/${item.poster}`}
                      className="relative w-full h-full object-cover"
                      preload="metadata"
                    >
                      <source src={`https://media.oracleboxing.com/Website/transfo/${item.video}`} type="video/webm" />
                    </video>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-bold text-center mb-10" style={{ fontFamily: 'Satoshi' }}>
            300+ boxers have already transformed inside Oracle. You're next.
          </p>

          <div className="flex justify-center">
            <button
              onClick={scrollToPricing}
              className="w-full sm:w-auto max-w-md sm:max-w-none px-8 py-4 bg-yellow-100 text-black border-4 border-black font-black text-xl rounded-xl uppercase tracking-wide shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all duration-200"
              style={{ fontFamily: 'Satoshi' }}
            >
              JOIN THE CHALLENGE →
            </button>
          </div>
        </div>

        {/* Hide scrollbar */}
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      {/* See Inside The Platform Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 lg:max-w-[80%] mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 text-center" style={{ fontFamily: 'Satoshi' }}>
            See Inside The Platform
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 text-center max-w-3xl mx-auto">
            Everything you need to learn boxing, all in one place
          </p>

          {/* Desktop: 2-column grid with smaller images */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              {
                image: 'https://media.oracleboxing.com/Website/optimized/screenshots/inside1.webp',
                title: 'All Your Courses in One Place',
                subtitle: 'Access all three courses from a single organized dashboard'
              },
              {
                image: 'https://media.oracleboxing.com/Website/optimized/screenshots/inside2.webp',
                title: 'Full Video Lessons',
                subtitle: 'Follow clear lessons with detailed video shows and learning'
              },
              {
                image: 'https://media.oracleboxing.com/Website/optimized/screenshots/inside3.webp',
                title: 'Follow-Along Workouts',
                subtitle: 'Train with step-by-step drills and clear workout plans'
              },
              {
                image: 'https://media.oracleboxing.com/Website/optimized/screenshots/inside4.webp',
                title: 'Strong Search Feature',
                subtitle: 'Find any move, idea, or drill quickly across all courses'
              }
            ].map((screenshot, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 lg:p-6 text-center">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                    {screenshot.title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-3">
                    {screenshot.subtitle}
                  </p>
                </div>
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={screenshot.image}
                    alt={screenshot.title}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Vertical stacked cards with smaller images */}
          <div className="lg:hidden space-y-6 max-w-lg mx-auto">
            {[
              {
                image: 'https://media.oracleboxing.com/Website/optimized/screenshots/inside1.webp',
                title: 'All Your Courses in One Place',
                subtitle: 'Access all three courses from a single organized dashboard'
              },
              {
                image: 'https://media.oracleboxing.com/Website/optimized/screenshots/inside2.webp',
                title: 'Full Video Lessons',
                subtitle: 'Follow clear lessons with detailed video shows and learning'
              },
              {
                image: 'https://media.oracleboxing.com/Website/optimized/screenshots/inside3.webp',
                title: 'Follow-Along Workouts',
                subtitle: 'Train with step-by-step drills and clear workout plans'
              },
              {
                image: 'https://media.oracleboxing.com/Website/optimized/screenshots/inside4.webp',
                title: 'Strong Search Feature',
                subtitle: 'Find any move, idea, or drill quickly across all courses'
              }
            ].map((screenshot, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {screenshot.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {screenshot.subtitle}
                  </p>
                </div>
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={screenshot.image}
                    alt={screenshot.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the Refund Works - "Real Boxing Smart System" */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 leading-tight px-2" style={{ fontFamily: 'Satoshi' }}>
            Real Boxing Smart System
          </h2>

          {/* Desktop: 2-column layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-center mb-8">
            {/* Left Column - Description */}
            <div>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6">
                This challenge isn't easy, but it's simple.
              </p>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6">
                If you show up, do the work, and complete the checklist, you'll earn your money back at the end.
              </p>
              <p className="text-xl lg:text-2xl font-bold" style={{ fontFamily: 'Satoshi' }}>
                Discipline pays. Literally.
              </p>
            </div>

            {/* Right Column - Checklist */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              <h3 className="text-xl lg:text-2xl font-bold mb-6" style={{ fontFamily: 'Satoshi' }}>Checklist:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-base lg:text-lg font-medium leading-snug">Join two coaching calls each week.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-base lg:text-lg font-medium leading-snug">Post one feedback video each week.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-base lg:text-lg font-medium leading-snug">Finish the Boxing Masterclass.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-base lg:text-lg font-medium leading-snug">Attend the mid-challenge and graduation calls.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Stacked layout */}
          <div className="lg:hidden">
            <div className="prose prose-lg max-w-3xl mx-auto mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center mb-6 sm:mb-8 px-2">
                This challenge isn't easy, but it's simple.
                If you show up, do the work, and complete the checklist, you'll earn your money back at the end.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6 border-2 border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'Satoshi' }}>Checklist:</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium leading-snug">Join two coaching calls each week.</span>
                </div>
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium leading-snug">Post one feedback video each week.</span>
                </div>
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium leading-snug">Finish the Boxing Masterclass.</span>
                </div>
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium leading-snug">Attend the mid-challenge and graduation calls.</span>
                </div>
              </div>
            </div>

            <p className="text-lg sm:text-xl font-bold text-center px-2" style={{ fontFamily: 'Satoshi' }}>
              Discipline pays. Literally.
            </p>
          </div>
        </div>
      </section>

      {/* Inline Pricing Section */}
      <section id="pricing" className="py-6 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#000000] rounded-xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl text-white">
            {/* Logo */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <img
                src="https://media.oracleboxing.com/Website/infinity_squared_white.svg"
                alt="Oracle Boxing"
                className="h-4 sm:h-5"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            {/* Challenge Thumbnail */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <img
                src="https://media.oracleboxing.com/Website/skool_art.webp"
                alt="6-Week Challenge"
                className="w-full max-w-[280px] rounded-xl border-4 border-white shadow-lg"
              />
            </div>

            {/* Heading */}
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 uppercase px-4 whitespace-nowrap" style={{ fontFamily: "var(--font-satoshi)" }}>
              6-WEEK CHALLENGE
            </h3>

            {/* Price Section */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-3">
                <ValuePrice usdAmount={totalValue} className="text-xl sm:text-2xl md:text-3xl font-bold opacity-60 line-through" />
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black">
                  <ChallengePrice />
                </div>
              </div>
              <div className="text-sm text-white/80 mt-2">incl. all taxes</div>
            </div>

            {/* CTA Button */}
            <a
              href="/checkout?product=6wc&source=6wc-page"
              onClick={() => handleButtonClick('pricing-section', 'CHECKOUT')}
              className="w-full py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-12 bg-yellow-100 text-[#000000] font-black text-xl sm:text-2xl md:text-3xl rounded-xl mb-4 sm:mb-6 uppercase tracking-wide min-h-[60px] sm:min-h-[64px] lg:min-h-[72px] shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{ cursor: 'pointer' }}
            >
              CHECKOUT
              <span className="text-2xl sm:text-3xl">→</span>
            </a>

            {/* Payment Methods */}
            <div className="payment_icons-group mb-6 sm:mb-8">
              <img
                loading="lazy"
                alt=""
                src="https://media.oracleboxing.com/Website/payment1.svg"
                className="image-55"
              />
              <img
                loading="lazy"
                alt=""
                src="https://media.oracleboxing.com/Website/payment2.svg"
                className="image-55 second"
              />
              <img
                loading="lazy"
                alt=""
                src="https://media.oracleboxing.com/Website/paypal2.svg"
                className="image-55 bigger"
              />
              <img
                loading="lazy"
                src="https://media.oracleboxing.com/Website/klarna.svg"
                alt=""
                className="image-55 bigger-mobile"
              />
            </div>

            {/* Benefits List */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-white mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                    <strong className="font-bold">{benefit.text}</strong>
                    {benefit.bold}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 leading-tight px-2" style={{ fontFamily: 'Satoshi' }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 leading-snug" style={{ fontFamily: 'Satoshi' }}>
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call - Evergreen CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight px-2" style={{ fontFamily: 'Satoshi' }}>
            Start building real boxing fundamentals today
          </h2>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-700 leading-relaxed px-2">
            6 weeks. $197. Money back when you finish.<br className="hidden sm:block"/>
            <span className="block sm:inline"> </span>Step up and commit to real skill development.
          </p>

          <a
            href="/checkout?product=6wc&source=6wc-page"
            onClick={() => handleButtonClick('final-call', 'JOIN THE CHALLENGE')}
            className="inline-block w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-yellow-100 text-black border-4 border-black font-black text-lg sm:text-xl rounded-xl uppercase tracking-wide shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all duration-200 mb-6 sm:mb-8"
            style={{ fontFamily: 'Satoshi' }}
          >
            JOIN THE CHALLENGE →
          </a>

          <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-600 px-2" style={{ fontFamily: 'Satoshi' }}>
            While everyone else talks, we train.
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
