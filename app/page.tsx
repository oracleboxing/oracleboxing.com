'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CourseCard } from '@/components/CourseCard'
import { TestimonialSection } from '@/components/TestimonialSection'
import { NotifyMeModal } from '@/components/NotifyMeModal'
import { AdaptivePrice } from '@/components/AdaptivePrice'
import { ApparelBanner } from '@/components/ApparelBanner'
import { getCourses } from '@/lib/products'
import { getRandomTestimonials, globalTestimonials } from '@/lib/testimonials'
import { useAnalytics } from '@/hooks/useAnalytics'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Video } from 'lucide-react'

export default function HomePage() {
  const courses = getCourses()
  // Use stable testimonials for SSR, then randomize on client
  const [testimonials, setTestimonials] = useState(globalTestimonials.slice(0, 6))
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false)
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const { trackButtonClick } = useAnalytics()

  // Randomize testimonials after hydration to avoid mismatch
  useEffect(() => {
    setTestimonials(getRandomTestimonials(6))
  }, [])

  const handleButtonClick = (location: string, type: string, productId?: string, value?: number, destination?: string) => {
    trackButtonClick({
      button_location: location,
      button_type: type,
      product_id: productId,
      value: value,
      currency: 'USD',
      destination: destination,
    })
  }

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNewsletterLoading(true)
    setNewsletterMessage('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value

    try {
      // Send to Make.com webhook
      const response = await fetch('https://hook.eu2.make.com/88r1e3e2u8t7uobr5amfeykt4m4vgqtd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'homepage',
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setNewsletterSuccess(true)
        setNewsletterMessage('✅ Successfully subscribed! Check your email.')
        form.reset()

        // Track newsletter signup
        trackButtonClick({
          button_location: 'homepage-newsletter',
          button_type: 'newsletter-signup',
          destination: 'newsletter',
        })
      } else {
        throw new Error('Subscription failed')
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      setNewsletterSuccess(false)
      setNewsletterMessage('❌ Something went wrong. Please try again.')
    } finally {
      setNewsletterLoading(false)
    }
  }

  const scrollToCourses = (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById('courses')
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Oracle Boxing",
            "url": "https://oracleboxing.com",
            "logo": "https://media.oracleboxing.com/Website/optimized/logos/long_black-large.webp",
            "description": "Master Old School Boxing Anytime, Anywhere",
            "email": "team@oracleboxing.com",
            "sameAs": [
              "https://www.instagram.com/oracleboxing",
              "https://www.youtube.com/@oracleboxing"
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Unit 5 Artillery 88, Artillery Road",
              "postalCode": "BA22 8RP",
              "addressCountry": "GB"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[500px] sm:h-[600px] lg:h-[800px] overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://media.oracleboxing.com/Website/hero-section-frame.webp"
          className="absolute inset-0 w-full h-full object-cover object-[70%] sm:object-center"
        >
          <source src="https://media.oracleboxing.com/Website/optimized/videos/hero-section-desktop.webm" type="video/webm" media="(min-width: 768px)" />
          <source src="https://media.oracleboxing.com/Website/optimized/videos/hero-section-desktop.mp4" type="video/mp4" media="(min-width: 768px)" />
          <source src="https://media.oracleboxing.com/Website/optimized/videos/hero-section-mobile.mp4" type="video/mp4" />
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 capitalize drop-shadow-lg leading-tight sm:leading-normal lg:leading-tight">
                Learn Boxing - Perfect for <span className="font-bold text-white">Beginners</span>
              </h1>
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white leading-relaxed drop-shadow-md font-medium">
                Learn boxing step-by-step with videos, coaching, and a team of boxers like you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Black Friday Challenge Section */}
      <section className="pt-6 sm:pt-8 lg:pt-12 pb-6 sm:pb-8 lg:pb-12 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Side - Image */}
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://media.oracleboxing.com/Website/skool_art.webp"
                  alt="Black Friday Challenge"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-100 text-black border-2 border-black rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider">
                Limited 30 Spots
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                The Black Friday Challenge
              </h2>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Learn Boxing Fundamentals In Under 48 Days
              </p>

              {/* Description */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  A structured 6-week challenge for beginners, late starters, and frustrated sparrers. Train from home, follow the weekly plan, get coached over the holidays.
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="text-lg text-gray-500 line-through">
                    <AdaptivePrice usdAmount={197} metadata="6wc" className="text-gray-500" showCode={false} />
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-gray-900">
                    <AdaptivePrice usdAmount={97} metadata="bfc" className="font-black text-gray-900" showCode={true} />
                  </span>
                  <span className="inline-block bg-yellow-100 text-black px-3 py-1 rounded-lg text-sm font-black uppercase">
                    50% OFF
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3 mt-4">
                  <div className="inline-flex items-center gap-3 bg-white text-black px-4 py-2 rounded-lg border-2 border-black shadow-md">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <div className="text-left">
                      <div className="text-xs font-bold uppercase tracking-wide opacity-80">Spots Remaining</div>
                      <div className="text-2xl font-black" style={{ fontFamily: 'Satoshi' }}>
                        20<span className="text-lg opacity-60">/30</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center lg:text-left mt-2 font-bold">
                  One colour already sold out!!!
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/6wc"
                  onClick={() => handleButtonClick('homepage-6wc', 'secondary-cta', 'bfc', undefined, '/6wc')}
                  className="inline-block w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white text-black border-4 border-black rounded-xl shadow-lg font-black text-base sm:text-lg md:text-xl uppercase tracking-wide hover:bg-black hover:text-white transition-all text-center"
                  style={{ fontFamily: 'Satoshi' }}
                >
                  Learn More
                </Link>
                <Link
                  href="/checkout?product=bfc&source=homepage-6wc"
                  onClick={() => handleButtonClick('homepage-6wc', 'buy-now', 'bfc', 97, '/checkout?product=bfc&source=homepage-6wc')}
                  className="inline-block w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-yellow-100 text-black border-4 border-black rounded-xl shadow-lg font-black text-base sm:text-lg md:text-xl uppercase tracking-wide hover:bg-black hover:text-yellow-100 transition-all text-center"
                  style={{ fontFamily: 'Satoshi' }}
                >
                  Buy Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="pt-6 sm:pt-8 lg:pt-12 pb-6 sm:pb-8 lg:pb-12 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Most popular
            </h2>
          </div>

          {/* 2-Column Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
            <CourseCard key="bundle" product={{
              id: 'bundle',
              title: 'Oracle Boxing Bundle',
              price: 397,
              type: 'course',
              metadata: 'obm',
              stripe_product_id: 'prod_THsui65fQm9N6o',
              stripe_price_id: 'price_1SLLSAQNEdHwdojXPF01j36I',
              image: 'https://media.oracleboxing.com/Website/optimized/products/obm_tn-large.webp',
              shortDescription: 'Every Course, Every Call, Every System, All in One Bundle.',
              perfectFor: 'Boxers who want to learn everything quickly',
              moduleCount: 5,
              lessonCount: 225,
              lessonCountPrefix: '+',
              workoutCount: 100,
              description: `**Get everything. Master the complete boxing system from fundamentals to real application.**

**This bundle includes:**
• Boxing Masterclass ($297)
• Boxing Roadmap ($147)

**Total value: $444**
**Bundle price: $397**
**You save: $47**

Complete access to the entire Oracle Boxing system — theory, technique, and tactics.`,
            }} />
            <CourseCard key="membership-6month" product={{
              id: 'membership-6month',
              title: 'Oracle Membership (6-Month)',
              price: 497,
              type: 'membership',
              metadata: 'mem6',
              recurring: true,
              interval: '6 months',
              stripe_product_id: 'prod_THsviAkmOBiKx4',
              stripe_price_id: 'price_1SLMIWQNEdHwdojXMLLS6yhP',
              image: 'https://media.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp',
              description: `**6 months of access — save vs quarterly**

✓ Everything in Quarterly Membership
✓ Save $98 vs quarterly ($497 vs $595)
✓ Commit to mastery with 6 months of expert guidance
✓ Perfect for serious skill development

Best for dedicated students ready to transform their boxing.`,
              shortDescription: 'Save With 6-Month Commitment',
              perfectFor: 'Boxers ready to make big changes',
              hasLiveCoaching: true,
              hasCommunity: true,
              hasVideoFeedback: true,
            }} />
          </div>
        </div>
      </section>

      {/* Apparel Banner */}
      <ApparelBanner />

      {/* Testimonials Section */}
      <TestimonialSection testimonials={testimonials} />

      {/* Newsletter Section */}
      <section id="newsletter" className="py-16 sm:py-20 lg:py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get special deals, training tips, and find out first about new courses.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg bg-transparent border-2 border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="px-8 py-4 bg-white text-black font-black rounded-lg uppercase tracking-wide hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {newsletterMessage && (
              <p className={`text-sm mt-4 ${newsletterSuccess ? 'text-green-400' : 'text-red-400'}`}>
                {newsletterMessage}
              </p>
            )}
            <p className="text-sm text-gray-400 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Notify Me Modal */}
      <NotifyMeModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
      />
    </div>
    </>
  )
}
