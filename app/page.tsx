'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { TestimonialCarousel } from '@/components/TestimonialCarousel'
import { ApparelCarousel } from '@/components/ApparelCarousel'
import { NotifyMeModal } from '@/components/NotifyMeModal'
import { globalTestimonials } from '@/lib/testimonials'
import { useAnalytics } from '@/hooks/useAnalytics'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false)
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const { trackButtonClick } = useAnalytics()

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

      <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
        <Header />

        {/* Hero Section - Full-width video background */}
        <section className="relative w-full h-[555px] sm:h-[490px] lg:h-[560px] overflow-hidden">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://media.oracleboxing.com/Website/hero-section-frame.webp"
            className="absolute inset-0 w-full h-full object-cover object-[60%_top] sm:object-[center_top]"
          >
            <source src="https://media.oracleboxing.com/Website/optimized/videos/hero-section-desktop.webm" type="video/webm" media="(min-width: 768px)" />
            <source src="https://media.oracleboxing.com/Website/optimized/videos/hero-section-desktop.mp4" type="video/mp4" media="(min-width: 768px)" />
            <source src="https://media.oracleboxing.com/Website/optimized/videos/hero-section-mobile.mp4" type="video/mp4" />
          </video>

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/80"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl text-center lg:text-left">
                <h1
                  className="font-bold text-white mb-4 sm:mb-6 drop-shadow-lg"
                  style={{
                    fontSize: 'clamp(2.1rem, 4vw, 3.5rem)',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Master Old School Boxing From Home
                </h1>

                <p className="text-lg sm:text-xl text-white mb-8 sm:mb-10 drop-shadow-md">
                  Structured courses, live coaching, and a supportive community for beginners and intermediate boxers.
                </p>

                {/* CTAs */}
                <div className="flex flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link
                    href="/6wc"
                    onClick={() => handleButtonClick('homepage-hero', 'primary-cta', '6wc', undefined, '/6wc')}
                    className="ob-btn ob-btn-gp-try-p"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', padding: 'clamp(0.7rem, 1.5vw, 1rem) clamp(1.4rem, 3vw, 2.2rem)' }}
                  >
                    Get Coaching
                  </Link>
                  <Link
                    href="https://www.oracleboxing.com/courses/bundle"
                    onClick={() => handleButtonClick('homepage-hero', 'secondary-cta', 'bundle', undefined, '/courses/bundle')}
                    className="ob-btn ob-btn-gp-try-s"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', padding: 'clamp(0.7rem, 1.5vw, 1rem) clamp(1.4rem, 3vw, 2.2rem)' }}
                  >
                    View Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Carousel */}
        <TestimonialCarousel testimonials={globalTestimonials} />

        {/* 6-Week Challenge Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                The 6-Week Challenge
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Build real boxing fundamentals in 42 days with a week-by-week skill schedule, live coaching, and a money-back guarantee when you complete the checklist.
              </p>
            </div>

            {/* Two Column Layout: Week Schedule + Checklist */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* Left: Week Schedule Table - Two Column Grid */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  <span className="bg-yellow-100 px-2 py-1 rounded">Weekly Training Schedule</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { week: 1, focus: 'Stance & Shape' },
                    { week: 2, focus: 'Footwork & Rhythm' },
                    { week: 3, focus: 'Kinetic Linkage' },
                    { week: 4, focus: 'Power Development' },
                    { week: 5, focus: 'Biomechanics' },
                    { week: 6, focus: 'Flow of Boxing' }
                  ].map(({ week, focus }) => (
                    <div key={week} className="bg-white rounded-lg p-3 border border-gray-200 flex flex-col items-center text-center">
                      <div className="text-sm font-medium text-gray-600 mb-2">Week {week}</div>
                      <div className="text-base font-bold text-gray-900">{focus}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Refund Checklist */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  <span className="bg-yellow-100 px-2 py-1 rounded">100% Money Back Checklist</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-base font-medium leading-snug">Join 2 live coaching calls every week (12 total).</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-base font-medium leading-snug">Post one training video for feedback.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-base font-medium leading-snug">Finish the Boxing Masterclass.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 flex-shrink-0 border-2 border-gray-400 rounded mt-0.5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-base font-medium leading-snug">Attend the mid-challenge and graduation calls.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
              <Link
                href="/6wc"
                onClick={() => handleButtonClick('homepage-6wc-section', 'primary-cta', '6wc', undefined, '/6wc')}
                className="ob-btn ob-btn-gp-wbg-s ob-btn-large"
              >
                See Full Challenge Details
              </Link>
            </div>
          </div>
        </section>

        {/* Courses Overview Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bold text-gray-900 text-center mb-12 sm:mb-16" style={{
              fontSize: 'clamp(1.875rem, 5vw, 3rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}>
              Explore Courses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1: Oracle Boxing Bundle */}
              <div className="ob-card relative flex flex-col">
                <div className="mb-4">
                  <Image
                    src="https://media.oracleboxing.com/Website/optimized/products/obm_tn-large.webp"
                    alt="Oracle Boxing Bundle"
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">
                  <span className="bg-yellow-100 text-gray-900 px-2 py-1 rounded-lg">Boxing Bundle</span>
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base flex-grow">
                  Every course and system in one bundle. Learn faster with the complete curriculum.
                </p>
                <Link
                  href="/courses/bundle"
                  onClick={() => handleButtonClick('homepage-courses', 'course-card', 'bundle', undefined, '/courses/bundle')}
                  className="ob-btn ob-btn-gp-wbg-p ob-btn-small w-full mt-auto"
                  style={{ transition: 'none' }}
                >
                  View Course
                </Link>
              </div>

              {/* Card 2: Boxing Masterclass */}
              <div className="ob-card flex flex-col">
                <div className="mb-4">
                  <Image
                    src="https://media.oracleboxing.com/Website/optimized/products/bffp_tn5-medium.webp"
                    alt="Boxing Masterclass"
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">
                  <span className="bg-yellow-100 text-gray-900 px-2 py-1 rounded-lg">Boxing Masterclass</span>
                </h3>
                <p className="text-gray-600 mb-2 text-sm sm:text-base">
                  Understand the principles, mechanics, and tactics behind old-school boxing.
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 italic flex-grow">
                  Best for: theory-focused learners
                </p>
                <Link
                  href="/courses/bffp"
                  onClick={() => handleButtonClick('homepage-courses', 'course-card', 'bffp', undefined, '/courses/bffp')}
                  className="ob-btn ob-btn-gp-wbg-p ob-btn-small w-full mt-auto"
                  style={{ transition: 'none' }}
                >
                  View Course
                </Link>
              </div>

              {/* Card 3: Boxing Roadmap */}
              <div className="ob-card flex flex-col">
                <div className="mb-4">
                  <Image
                    src="https://media.oracleboxing.com/Website/optimized/products/tbrtn5hq-medium.webp"
                    alt="Boxing Roadmap"
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">
                  <span className="bg-yellow-100 text-gray-900 px-2 py-1 rounded-lg">Boxing Roadmap</span>
                </h3>
                <p className="text-gray-600 mb-2 text-sm sm:text-base">
                  Follow a 5-phase progression from fundamentals to sparring-ready skills.
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 italic flex-grow">
                  Best for: structured doers
                </p>
                <Link
                  href="/courses/roadmap"
                  onClick={() => handleButtonClick('homepage-courses', 'course-card', 'roadmap', undefined, '/courses/roadmap')}
                  className="ob-btn ob-btn-gp-wbg-p ob-btn-small w-full mt-auto"
                  style={{ transition: 'none' }}
                >
                  View Course
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Membership & Community Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 2-column layout on desktop, stacked on mobile */}
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left: Title and Subheadline */}
                <div>
                  <h2 className="font-bold text-black mb-4" style={{
                    fontSize: 'clamp(1.875rem, 5vw, 3rem)',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em'
                  }}>
                    Join the Oracle Boxing Community
                  </h2>
                  <p className="text-lg sm:text-xl text-black">
                    Daily live coaching, accountability, and all courses included.
                  </p>
                </div>

                {/* Right: Bullet Points */}
                <div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-black text-base sm:text-lg">
                        <span className="bg-yellow-100 px-2 py-1 rounded">Unlimited access to all courses</span> and replays
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-black text-base sm:text-lg">
                        <span className="bg-yellow-100 px-2 py-1 rounded">Daily live calls</span> with real-time feedback
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-black text-base sm:text-lg">
                        <span className="bg-yellow-100 px-2 py-1 rounded">200+ members worldwide</span> training together
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Transformation Videos */}
            {/* Desktop: Grid layout */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {[
                { video: 'sha-lyn.webm', poster: 'sha-lyn_poster.webp' },
                { video: 'nico.webm', poster: 'nico_poster.webp' },
                { video: 'charlie.webm', poster: 'charlie_poster.webp' }
              ].map((item, index) => (
                <div key={index} className="relative aspect-[9/16] rounded-lg overflow-hidden">
                  <video
                    autoPlay
                    muted
                    playsInline
                    loop
                    poster={`https://media.oracleboxing.com/Website/transfo/${item.poster}`}
                    className="w-full h-full object-cover"
                  >
                    <source src={`https://media.oracleboxing.com/Website/transfo/${item.video}`} type="video/webm" />
                  </video>
                </div>
              ))}
            </div>

            {/* Mobile: Scrollable carousel with snap */}
            <div className="sm:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory mb-12">
              <div className="flex gap-4 pb-4 px-[15vw]">
                {[
                  { video: 'sha-lyn.webm', poster: 'sha-lyn_poster.webp' },
                  { video: 'nico.webm', poster: 'nico_poster.webp' },
                  { video: 'charlie.webm', poster: 'charlie_poster.webp' }
                ].map((item, index) => (
                  <div key={index} className="relative flex-shrink-0 w-[70vw] sm:w-[320px] aspect-[9/16] rounded-lg overflow-hidden snap-center">
                    <video
                      autoPlay
                      muted
                      playsInline
                      loop
                      poster={`https://media.oracleboxing.com/Website/transfo/${item.poster}`}
                      className="w-full h-full object-cover"
                    >
                      <source src={`https://media.oracleboxing.com/Website/transfo/${item.video}`} type="video/webm" />
                    </video>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA centered below transformations */}
            <div className="text-center">
              <Link
                href="/membership"
                onClick={() => handleButtonClick('homepage-membership', 'primary-cta', 'membership', undefined, '/membership')}
                className="ob-btn ob-btn-gp-ybg-s ob-btn-large"
              >
                View Community
              </Link>
              <p className="mt-3 text-sm">
                <Link href="/membership#pricing" className="text-black hover:underline">
                  Compare membership plans →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Apparel Teaser Section */}
        <section className="py-12 sm:py-16 bg-white border-t border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 px-4">
              Oracle Boxing Apparel
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Limited-run tracksuits and hoodies designed for serious boxers. Perfect for training and travel.
            </p>
          </div>

          {/* Apparel Carousel - Full Width */}
          <div className="mb-8">
            <ApparelCarousel />
          </div>

          <div className="text-center px-4">
            <Link
              href="https://shop.oracleboxing.com/collections/all"
              onClick={() => handleButtonClick('homepage-apparel', 'primary-cta', undefined, undefined, 'https://shop.oracleboxing.com/collections/all')}
              className="ob-btn ob-btn-gp-wbg-s ob-btn-large"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop Apparel
            </Link>
          </div>
        </section>

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
              <form onSubmit={handleNewsletterSubmit} className="flex flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full bg-transparent border-2 border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="ob-btn ob-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ padding: 'clamp(0.6rem, 2vw, 0.9rem) clamp(1.2rem, 3vw, 2rem)' }}
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
