'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EpicCTAButton } from '@/components/EpicCTAButton'
import { detectUserCurrency, formatPrice, getProductPrice, type Currency } from '@/lib/currency'
import { fbInitiateCheckout } from '@/lib/fbpixel'
import { getOrInitTrackingData, generateEventId } from '@/lib/tracking-cookies'
import { useAnalytics } from '@/hooks/useAnalytics'
import { track } from '@vercel/analytics'

export default function BlackFridayChallengePage() {
  const { trackInitiateCheckout } = useAnalytics()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [spotsRemaining, setSpotsRemaining] = useState(30)
  const [currency, setCurrency] = useState<Currency>('USD')
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [videosLoaded, setVideosLoaded] = useState(false)

  // Video autoplay on scroll
  useEffect(() => {
    if (!videosLoaded) return

    const observers: IntersectionObserver[] = []

    videoRefs.current.forEach((video) => {
      if (!video) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLVideoElement
            if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
              target.play().catch((err) => {
                console.log('Video play prevented:', err)
              })
            } else {
              target.pause()
            }
          })
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: '0px'
        }
      )

      observer.observe(video)
      observers.push(observer)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [videosLoaded])

  // Currency detection
  useEffect(() => {
    const loadCurrency = async () => {
      const detectedCurrency = await detectUserCurrency()
      setCurrency(detectedCurrency)
      setIsLoadingCurrency(false)
    }
    loadCurrency()
  }, [])

  // Quota meter - deterministic spot countdown
  useEffect(() => {
    const TOTAL_SPOTS = 30
    const WINDOWS: [string, string, number][] = [
      ['2025-11-23T00:00:00+00:00', '2025-11-24T00:00:00+00:00', 10], // spike 1
      ['2025-11-24T00:00:00+00:00', '2025-11-30T22:00:00+00:00', 8],  // mid
      ['2025-11-30T22:00:00+00:00', '2025-12-02T22:00:00+00:00', 12], // spike 2
    ]
    const FLOOR_AT_END = 0

    // Deterministic PRNG (Mulberry32)
    function mulberry32(a: number) {
      return function() {
        let t = a += 0x6D2B79F5
        t = Math.imul(t ^ t >>> 15, t | 1)
        t ^= t + Math.imul(t ^ t >>> 7, t | 61)
        return ((t ^ t >>> 14) >>> 0) / 4294967296
      }
    }

    const seed = 420691
    const rng = mulberry32(seed)

    function randomTimeInRange(startMs: number, endMs: number) {
      return startMs + Math.floor(rng() * (endMs - startMs))
    }

    function uniqueTimes(startMs: number, endMs: number, count: number) {
      const set = new Set<number>()
      while (set.size < count) {
        set.add(randomTimeInRange(startMs, endMs))
      }
      return Array.from(set).sort((a, b) => a - b)
    }

    const drops = WINDOWS.flatMap(([ws, we, c]) => {
      const s = Date.parse(ws)
      const e = Date.parse(we)
      return uniqueTimes(s, e, c)
    }).sort((a, b) => a - b)

    const MAX_DROPS = Math.min(drops.length, TOTAL_SPOTS - FLOOR_AT_END)
    const dropSchedule = drops.slice(0, MAX_DROPS)

    function computeRemaining(nowMs: number) {
      const occurred = dropSchedule.filter(t => t <= nowMs).length
      const remaining = Math.max(TOTAL_SPOTS - occurred, FLOOR_AT_END)
      return remaining
    }

    function updateSpots() {
      const now = Date.now()
      const remaining = computeRemaining(now)
      setSpotsRemaining(remaining)
    }

    updateSpots()
    const spotsInterval = setInterval(updateSpots, 30000) // Update every 30 seconds

    return () => clearInterval(spotsInterval)
  }, [])

  // Countdown to December 2, 10 PM UK time (22:00 GMT = 22:00 UTC in winter)
  useEffect(() => {
    const targetDate = new Date('2025-12-02T22:00:00+00:00') // 10 PM UK time

    const updateCountdown = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Track InitiateCheckout for button clicks
  const handleCTAClick = (buttonLocation: string, productId: string) => {
    // Map product ID to currency lookup key (bfc-vip -> bfc_vip)
    const currencyKey = productId === 'bfc-vip' ? 'bfc_vip' : productId
    const price = getProductPrice(currencyKey, currency) || (productId === 'bfc-vip' ? 397 : 97)
    const eventId = generateEventId()
    const trackingData = getOrInitTrackingData()

    // Facebook Pixel InitiateCheckout
    fbInitiateCheckout(price, currency, 1, buttonLocation, {
      eventID: eventId,
      ...trackingData
    })

    // Vercel Analytics
    track('initiate_checkout', {
      button_location: buttonLocation,
      product_id: productId,
      value: price,
      currency: currency
    })

    // GA4 via useAnalytics
    trackInitiateCheckout({
      value: price,
      currency: currency,
      item_name: productId === 'bfc-vip' ? 'Black Friday Challenge VIP' : 'Black Friday Challenge',
      button_text: 'JOIN NOW',
      button_location: buttonLocation as any
    })

    console.log('InitiateCheckout tracked:', {
      eventId,
      buttonLocation,
      productId,
      price,
      currency
    })
  }

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
      answer: 'The standard challenge gives you 6 weeks of access to everything. If you upgrade to VIP at checkout, you get lifetime access to all courses and content forever. After the challenge ends, you can also upgrade to a full membership to keep learning and training with the coaches long term.'
    },
    {
      question: 'What equipment do I need?',
      answer: 'Just boxing gloves and some space to move. If you have a heavy bag, great. If not, shadowboxing works too. You don\'t need a fancy gym or expensive gear. Most people train at home and get amazing results.'
    },
    {
      question: 'When does the challenge start?',
      answer: 'We kick off December 2nd at 10 PM UK time. That\'s when doors close and we start the challenge together. You\'ll get access to everything right away, your first coaching call, and the full course library.'
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
            "name": "The Black Friday Challenge",
            "description": "6-week boxing training program with full money-back guarantee when you finish. Starts December 2nd, ends 2026 strong.",
            "brand": {
              "@type": "Brand",
              "name": "Oracle Boxing"
            },
            "offers": {
              "@type": "Offer",
              "price": "97",
              "priceCurrency": "USD",
              "availability": "https://schema.org/LimitedAvailability",
              "url": "https://oracleboxing.com/6wcv2",
              "priceValidUntil": "2025-12-02"
            }
          })
        }}
      />

      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20">
          {/* Badge */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-3 px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wide rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              SPOTS REMAINING: <span className="bg-yellow-100 text-black px-3 py-0.5 rounded font-black text-base sm:text-lg transition-transform duration-300">{spotsRemaining}</span>
            </span>
          </div>

          {/* Main Headline */}
          <div className="text-center" style={{ fontFamily: 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight px-4 max-w-5xl mx-auto mb-4 sm:mb-5"
              style={{
                fontFamily: 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight: '700'
              }}
            >
              The <span className="bg-black text-white px-2 py-1">Black Friday</span> Challenge is live: 6 Weeks, $97, money back if you finish.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-4xl mx-auto px-4 leading-relaxed mb-8">
              While everyone else slows down for Christmas, we train. We finish the year sharper, stronger, and more focused. Only 30 spots. Doors close December 2nd at 10 PM UK.
            </p>

            {/* VSL Video */}
            <div className="mt-8 sm:mt-12 max-w-4xl mx-auto px-4">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-20 h-20 mx-auto mb-4 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    <p className="text-white text-lg font-medium">Video Sales Letter</p>
                    <p className="text-gray-400 text-sm mt-2">(Placeholder - Add your VSL here)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center px-4 mt-8 mb-8">
              <button
                onClick={scrollToPricing}
                className="w-full sm:w-auto max-w-md sm:max-w-none px-8 py-4 bg-yellow-100 text-black font-black text-xl rounded-xl uppercase tracking-wide shadow-lg hover:bg-white transition-all duration-200"
                style={{ fontFamily: 'Satoshi' }}
              >
                JOIN THE CHALLENGE →
              </button>
            </div>

            {/* Timer */}
            <div className="max-w-2xl mx-auto px-4 mb-12">
              <div className="bg-black text-white rounded-2xl p-6 sm:p-8">
                <div className="text-sm sm:text-base font-bold uppercase tracking-wide mb-4">
                  DOORS CLOSE IN:
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm uppercase opacity-80">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm uppercase opacity-80">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm uppercase opacity-80">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm uppercase opacity-80">Seconds</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 items-start">
                {/* Left Column */}
                <div className="flex flex-col gap-3 sm:gap-5">
                  <div className="bg-white border-4 border-black px-3 sm:px-5 py-2.5 sm:py-4 rounded-lg shadow-md text-left">
                    <div className="flex gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs sm:text-base text-black font-bold mb-1.5 sm:mb-3 leading-relaxed">
                      "This course showed me where my power comes from. I can't thank you enough for helping me box better! It was the best choice I ever made - the "aha!" moments are amazing!"
                    </p>
                    <div>
                      <div className="font-bold text-xs sm:text-base text-black">Niclas Laux</div>
                    </div>
                  </div>

                  <div className="bg-white border-4 border-black px-3 sm:px-5 py-2.5 sm:py-4 rounded-lg shadow-md text-left">
                    <div className="flex gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs sm:text-base text-black font-bold mb-1.5 sm:mb-3 leading-relaxed">
                      "Being part of this community has changed my life. Joining the live Zoom calls almost every day has helped me lose weight, box better, and feel more confident."
                    </p>
                    <div>
                      <div className="font-bold text-xs sm:text-base text-black">Balal Hanif</div>
                    </div>
                  </div>

                  <div className="bg-white border-4 border-black px-3 sm:px-5 py-2.5 sm:py-4 rounded-lg shadow-md text-left">
                    <div className="flex gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs sm:text-base text-black font-bold mb-1.5 sm:mb-3 leading-relaxed">
                      "The value that the coaches bring is WAY BEYOND what I ever expected when I joined this challenge. I can genuinely SEE and FEEL the shift happening."
                    </p>
                    <div>
                      <div className="font-bold text-xs sm:text-base text-black">Bruno Martins</div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3 sm:gap-5">
                  <div className="bg-white border-4 border-black px-3 sm:px-5 py-2.5 sm:py-4 rounded-lg shadow-md text-left">
                    <div className="flex gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs sm:text-base text-black font-bold mb-1.5 sm:mb-3 leading-relaxed">
                      "I came back to this community and already made big progress on Toni and Oliver's Zoom calls. You guys are really good at coaching online. I learn so much every time I join a call."
                    </p>
                    <div>
                      <div className="font-bold text-xs sm:text-base text-black">Torey Goodall</div>
                    </div>
                  </div>

                  <div className="bg-white border-4 border-black px-3 sm:px-5 py-2.5 sm:py-4 rounded-lg shadow-md text-left">
                    <div className="flex gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs sm:text-base text-black font-bold mb-1.5 sm:mb-3 leading-relaxed">
                      "The Boxing Masterclass course was a huge rewiring of my thinking. You could be training here and learning new things for months, maybe years!"
                    </p>
                    <div>
                      <div className="font-bold text-xs sm:text-base text-black">Daniel Ramirez</div>
                    </div>
                  </div>

                  <div className="bg-white border-4 border-black px-3 sm:px-5 py-2.5 sm:py-4 rounded-lg shadow-md text-left">
                    <div className="flex gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black fill-black" viewBox="0 0 24 24" strokeWidth={2}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs sm:text-base text-black font-bold mb-1.5 sm:mb-3 leading-relaxed">
                      "I am truly humbled by the passion, dedication and depth of analysis exemplified by our coaches here. You have every asset necessary to become a real boxer and change your life forever."
                    </p>
                    <div>
                      <div className="font-bold text-xs sm:text-base text-black">Illya</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Challenge Exists */}
      <section className="relative min-h-screen overflow-hidden flex items-end">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        >
          <source src="https://media.oracleboxing.com/Website/6wcv2_obvid.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content - Bottom Half */}
        <div className="relative z-10 w-full pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 text-white" style={{ fontFamily: 'Satoshi' }}>
              Everyone switches off in December. We switch on.
            </h2>

            <div className="prose prose-lg max-w-3xl mx-auto mb-8">
              <p className="text-base sm:text-lg text-white leading-relaxed text-center">
                While most people drift through the holidays, we get sharper, stronger, and more disciplined.
                This is your moment to separate from the crowd, fix what's been holding you back,
                and master the fundamentals that make real boxers dangerous.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-base sm:text-lg mb-1" style={{ fontFamily: 'Satoshi' }}>Fix bad habits</h3>
                <p className="text-sm sm:text-base text-gray-700">Break patterns that have slowed your progress all year.</p>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-base sm:text-lg mb-1" style={{ fontFamily: 'Satoshi' }}>Rebuild fundamentals</h3>
                <p className="text-sm sm:text-base text-gray-700">Lock in balance, rhythm, and timing so everything feels automatic.</p>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-base sm:text-lg mb-1" style={{ fontFamily: 'Satoshi' }}>Understand biomechanics</h3>
                <p className="text-sm sm:text-base text-gray-700">Tap into your body's mechanics so every punch carries real force.</p>
              </div>
            </div>

            <p className="text-xl sm:text-2xl font-bold text-center text-white" style={{ fontFamily: 'Satoshi' }}>
              We don't wait for motivation, we create it.
            </p>
          </div>
        </div>
      </section>

      {/* 6-Week Skill Schedule */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6" style={{ fontFamily: 'Satoshi' }}>
            The 6-Week Skill Schedule
          </h2>

          <p className="text-base sm:text-lg text-gray-700 text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            Every week, you'll build a new layer of skill.
            By the end, you'll be transformed.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-lg rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 sm:px-6 py-4 text-left font-bold text-sm sm:text-base">Week</th>
                  <th className="px-4 sm:px-6 py-4 text-left font-bold text-sm sm:text-base">Focus</th>
                  <th className="px-4 sm:px-6 py-4 text-left font-bold text-sm sm:text-base">What You'll Get</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 sm:px-6 py-4 font-bold">1</td>
                  <td className="px-4 sm:px-6 py-4 font-bold">Stance & Shape</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-700">Build your frame and balance</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 font-bold">2</td>
                  <td className="px-4 sm:px-6 py-4 font-bold">Footwork & Rhythm</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-700">Control distance and timing</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 sm:px-6 py-4 font-bold">3</td>
                  <td className="px-4 sm:px-6 py-4 font-bold">Kinetic Linkage</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-700">Connect hands, hips, and feet for real power</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 font-bold">4</td>
                  <td className="px-4 sm:px-6 py-4 font-bold">Power Development</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-700">Learn to hit hard without tension</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 sm:px-6 py-4 font-bold">5</td>
                  <td className="px-4 sm:px-6 py-4 font-bold">Biomechanics</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-700">Move efficiently, conserve energy</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 font-bold">6</td>
                  <td className="px-4 sm:px-6 py-4 font-bold">Flow of Boxing</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-700">Bring it all together, full confidence</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xl sm:text-2xl font-bold text-center mt-8 sm:mt-10" style={{ fontFamily: 'Satoshi' }}>
            Simple structure, real change.
          </p>
        </div>
      </section>

      {/* Community & Proof */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Transformation Carousel */}
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
                  <div key={index} className="relative flex-shrink-0 w-[70vw] sm:w-[320px] aspect-[9/16] rounded-xl overflow-hidden snap-center">
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
                      className="w-full h-full object-cover"
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
              className="w-full sm:w-auto max-w-md sm:max-w-none px-8 py-4 bg-yellow-100 text-black font-black text-xl rounded-xl uppercase tracking-wide shadow-lg hover:bg-white transition-all duration-200"
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

      {/* How the Refund Works */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8" style={{ fontFamily: 'Satoshi' }}>
            Finish it, get your money back.
          </h2>

          <div className="prose prose-lg max-w-3xl mx-auto mb-8">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center mb-8">
              This challenge isn't easy, but it's simple.
              If you show up, do the work, and complete the checklist, you'll earn your {isLoadingCurrency ? '$97' : formatPrice(getProductPrice('bfc', currency) || 97, currency)} back at the end.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg mb-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ fontFamily: 'Satoshi' }}>Checklist:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base sm:text-lg font-medium">Join two coaching calls each week.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base sm:text-lg font-medium">Post one feedback video each week.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base sm:text-lg font-medium">Finish the Boxing Masterclass.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base sm:text-lg font-medium">Attend the mid-challenge and graduation calls.</span>
              </div>
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-bold text-center" style={{ fontFamily: 'Satoshi' }}>
            Discipline pays. Literally.
          </p>
        </div>
      </section>

      {/* Pricing & Offer */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 sm:mb-12" style={{ fontFamily: 'Satoshi' }}>
            Black Friday Entry — 6 Weeks for {formatPrice(getProductPrice('bfc', currency) || 97, currency)}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Main Offer */}
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex justify-center mb-6">
                <img
                  src="https://media.oracleboxing.com/Website/infinity_squared_white.svg"
                  alt="Oracle Boxing"
                  className="h-5"
                />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 uppercase" style={{ fontFamily: 'Satoshi' }}>
                BLACK FRIDAY CHALLENGE
              </h3>

              <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl font-black mb-2">
                  {isLoadingCurrency ? '$97' : formatPrice(getProductPrice('bfc', currency) || 97, currency)}
                </div>
                <div className="text-sm text-white/80">incl. all taxes</div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base font-medium">6-Week program</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base font-medium">Live coaching calls</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base font-medium"><strong>Refund guarantee</strong> when you finish</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base font-medium">December cohort access</span>
                </div>
              </div>

              <a
                href="/checkout?product=bfc&source=bfc-page"
                onClick={() => handleCTAClick('pricing-main', 'bfc')}
                className="w-full py-4 sm:py-5 px-6 sm:px-8 bg-yellow-100 text-black font-black text-xl sm:text-2xl rounded-xl uppercase tracking-wide shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Satoshi' }}
              >
                JOIN NOW →
              </a>
            </div>

            {/* VIP Package */}
            <div className="bg-gray-100 rounded-2xl p-6 sm:p-8 shadow-lg border-4 border-black">
              <h3 className="text-center mb-6" style={{ fontFamily: 'Satoshi' }}>
                <span className="inline-block bg-yellow-100 text-black px-8 py-3 rounded-xl text-3xl sm:text-4xl lg:text-5xl font-black uppercase">
                  VIP
                </span>
              </h3>

              <div className="text-center mb-8">
                <div className="text-lg text-gray-500 line-through mb-1">
                  {isLoadingCurrency ? '$638 value' : `${formatPrice((getProductPrice('bfc', currency) || 97) + 541, currency)} value`}
                </div>
                <div className="text-5xl sm:text-6xl font-black mb-2">
                  {isLoadingCurrency ? '$397' : formatPrice(getProductPrice('bfc_vip', currency) || 397, currency)}
                </div>
                <div className="text-sm text-gray-600">one-time payment</div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-black mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base font-medium">Everything in the Challenge</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-black mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base font-medium">Lifetime Access to All Course Content</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-black mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base font-medium">Priority Onboarding Call (Instant Access)</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-black mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base font-medium">Exclusive Early Access to Oracle Boxing Apparel (Releasing Before Christmas)</span>
                </div>
              </div>

              <a
                href="/checkout?product=bfc-vip&source=bfc-vip"
                onClick={() => handleCTAClick('pricing-vip', 'bfc-vip')}
                className="w-full py-4 sm:py-5 px-6 sm:px-8 bg-yellow-100 text-black font-black text-xl sm:text-2xl rounded-xl uppercase tracking-wide shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center gap-2 mb-3"
                style={{ fontFamily: 'Satoshi' }}
              >
                JOIN VIP NOW →
              </a>

              <p className="text-center text-sm text-gray-600 font-medium">
                Keep everything forever
              </p>
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-bold text-center mt-10" style={{ fontFamily: 'Satoshi' }}>
            Start now, finish in 2026 with real skill and proof you can commit.
          </p>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Satoshi' }}>
            Doors close December 2nd at 10 PM UK.
          </h2>

          <div className="mb-8">
            <div className="inline-flex items-center gap-4 bg-white text-black px-8 py-6 rounded-2xl">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
              <div className="text-left">
                <div className="text-sm font-bold uppercase tracking-wide opacity-80">Spots Remaining</div>
                <div className="text-5xl sm:text-6xl font-black" style={{ fontFamily: 'Satoshi' }}>{spotsRemaining}</div>
              </div>
            </div>
          </div>

          <p className="text-base sm:text-lg mb-8">
            Only 30 spots are available. Once it's full, it's full.
            When everyone else hits pause, we hit play.
          </p>

          <div className="bg-white text-black rounded-2xl p-6 sm:p-8 mb-8">
            <div className="text-sm sm:text-base font-bold uppercase tracking-wide mb-4">
              TIME REMAINING:
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm uppercase opacity-60">Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm uppercase opacity-60">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm uppercase opacity-60">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm uppercase opacity-60">Seconds</div>
              </div>
            </div>
          </div>

          <p className="text-lg sm:text-xl mb-8">
            This is your window to step up and set the tone for 2026.
          </p>

          <a
            href="/checkout?product=bfc&source=bfc-page"
            onClick={() => handleCTAClick('urgency-section', 'bfc')}
            className="inline-block w-full sm:w-auto px-8 py-4 bg-yellow-100 text-black font-black text-xl rounded-xl uppercase tracking-wide shadow-lg hover:bg-white transition-all duration-200"
            style={{ fontFamily: 'Satoshi' }}
          >
            JOIN THE CHALLENGE →
          </a>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 sm:mb-12" style={{ fontFamily: 'Satoshi' }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold mb-3" style={{ fontFamily: 'Satoshi' }}>
                  {faq.question}
                </h3>
                <p className="text-gray-700">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Satoshi' }}>
            Be the one who doesn't quit in December.
          </h2>

          <p className="text-xl sm:text-2xl mb-8 text-gray-700">
            6 weeks. {isLoadingCurrency ? '$97' : formatPrice(getProductPrice('bfc', currency) || 97, currency)}. Money back if you finish.<br/>
            Starts December 2nd. Ends 2026 strong.
          </p>

          <a
            href="/checkout?product=bfc&source=bfc-page"
            onClick={() => handleCTAClick('final-call', 'bfc')}
            className="inline-block w-full sm:w-auto px-8 py-4 bg-yellow-100 text-black font-black text-xl rounded-xl uppercase tracking-wide shadow-lg hover:bg-white transition-all duration-200 mb-8"
            style={{ fontFamily: 'Satoshi' }}
          >
            JOIN THE CHALLENGE →
          </a>

          <p className="text-base sm:text-lg font-bold text-gray-600" style={{ fontFamily: 'Satoshi' }}>
            While everyone else slows down, we rise up.
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
