'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { VideoPlayer } from '@/components/VideoPlayer'
import { CourseStats } from '@/components/CourseStats'
import { WhoThisIsFor } from '@/components/WhoThisIsFor'
import { TestimonialSection } from '@/components/TestimonialSection'
import { CoursePriceCard } from '@/components/CoursePriceCard'
import { CourseFAQ } from '@/components/CourseFAQ'
import { CoursePricingPopup } from '@/components/CoursePricingPopup'
import { BundleCourseCarousel } from '@/components/BundleCourseCarousel'
import { BundleTimelineProcess } from '@/components/BundleTimelineProcess'
import { PlatformScreenshotsCarousel } from '@/components/PlatformScreenshotsCarousel'
import { BlackFridayChallengePopup } from '@/components/BlackFridayChallengePopup'
import { getProductById } from '@/lib/products'
import { getBundleTestimonials, bundleTestimonials } from '@/lib/testimonials'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice } from '@/lib/currency'

export default function BundlePage() {
  const { currency } = useCurrency()
  const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false)

  const openPricingPopup = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setIsPricingPopupOpen(true)
  }

  const product = getProductById('bundle')!

  const personas = [
    {
      emoji: '⚡',
      title: 'You want to be the best at boxing.',
      subtitle: 'You work hard on every small detail to get better.'
    },
    {
      emoji: '🥇',
      title: 'You\'re getting ready to spar and want to be ready.',
      subtitle: 'You want your moves to be clean and strong.'
    },
    {
      emoji: '💼',
      title: 'You are busy and work from home.',
      subtitle: 'You need quick, good ways to get better at boxing at home with real coaching help.'
    }
  ]

  // Use Bundle-specific testimonials
  const testimonials = bundleTestimonials

  const faqs = [
    {
      question: "What do I get in the bundle?",
      answer: "You get all three courses forever: Boxing Masterclass (150 lessons, $297), Boxing Roadmap (75 lessons, $147), and Coaching Call Replays (140+ videos, $97). Total value $541 for just $397. You save $144."
    },
    {
      question: "Can I start watching right away?",
      answer: "Yes! As soon as you buy, you can watch all three courses. Start with any course and go at your own speed."
    },
    {
      question: "Which course should I watch first?",
      answer: "Most students start with the Masterclass to learn the basics. Then they move to Roadmap for drills. You can watch the Vault anytime. But you can start anywhere. They all work together."
    },
    {
      question: "Is this cheaper than buying them one at a time?",
      answer: "Yes. Buying all three separately costs $541. The bundle is $397. You save $144. Plus, you get everything at once instead of buying it piece by piece."
    },
    {
      question: "Do I get new videos when you add them?",
      answer: "Yes! You get all videos now plus any new videos we add later to BFFP, Roadmap, and the Vault. We add new coaching call videos every month to the Vault."
    },
    {
      question: "What if I already bought one course?",
      answer: "If you already own one course and want the bundle, email us at support@oracleboxing.com. We will give you a fair price based on what you already bought."
    },
    {
      question: "Can I pay in parts?",
      answer: "Right now, the bundle is one payment. But we do give you your money back if you are not happy within 30 days."
    }
  ]

  // Calculate prices in current currency
  const bffpPrice = getProductPrice('bffp', currency) || 297
  const roadmapPrice = getProductPrice('brdmp', currency) || 147
  const replaysPrice = getProductPrice('rcv', currency) || 97
  const totalIndividualPrice = bffpPrice + roadmapPrice + replaysPrice
  const bundlePrice = getProductPrice('obm', currency) || 397
  const savings = totalIndividualPrice - bundlePrice

  const priceFeatures = [
    "Full Boxing Masterclass course",
    "Complete Boxing Roadmap system",
    "Coaching Call Replays library",
    "Keep all courses forever",
    "Get all new videos we add for free",
    `Save ${formatPrice(savings, currency)} compared to buying separately`,
    "Get your money back within 30 days if not happy"
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
            "name": "Oracle Boxing Bundle",
            "description": "Complete Oracle Boxing system including Boxing Masterclass, Boxing Roadmap, and Coaching Call Replays. 225+ lessons, 220+ coaching calls, lifetime access.",
            "image": "https://media.oracleboxing.com/Website/optimized/products/obm_tn-large.webp",
            "brand": {
              "@type": "Brand",
              "name": "Oracle Boxing"
            },
            "offers": {
              "@type": "Offer",
              "price": "397",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://oracleboxing.com/courses/bundle",
              "priceValidUntil": "2026-12-31"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "300"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-8 sm:pt-16 pb-4 sm:pb-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Course Title with Pill Border - Smaller */}
          <div className="inline-block mx-auto mb-4 sm:mb-8 w-full text-center">
            <div className="inline-block border-2 border-black rounded-full px-3 sm:px-6 py-1 sm:py-2">
              <h1 className="text-xs sm:text-base md:text-lg text-gray-900 uppercase tracking-wide font-medium" style={{ fontFamily: "var(--font-satoshi)" }}>
                Oracle Boxing Bundle
              </h1>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-6 sm:mb-12 px-2">
            Learn Old School Boxing Anytime, Anywhere
          </h2>

          {/* Video Sales Letter */}
          <div className="mb-4 sm:mb-8">
            <VideoPlayer
              thumbnail={product.image}
              title="Oracle Boxing Bundle Overview"
            />
          </div>

          {/* Primary CTA */}
          <div className="text-center mb-4 sm:mb-8">
            <a
              href="#pricing"
              onClick={openPricingPopup}
              className="inline-block py-3 sm:py-4 lg:py-5 px-8 sm:px-10 lg:px-12 bg-yellow-100 text-black border-4 border-black font-black text-base sm:text-lg lg:text-xl rounded-xl uppercase tracking-wide cursor-pointer animate-bounce-subtle hover:bg-black hover:text-white transition-colors duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              SEE PRICING
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pt-4 sm:pt-6 pb-8 sm:pb-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseStats
            lessonCount={225}
            purchaseLabel="220+"
            purchaseLabelText="Coaching Calls"
            hasLifetimeAccess={true}
          />
        </div>
      </section>

      {/* Who This Is For */}
      <WhoThisIsFor courseName="Oracle Boxing Bundle" personas={personas} />

      {/* Platform Screenshots Carousel */}
      <PlatformScreenshotsCarousel />

      {/* Course Cards Carousel */}
      <section id="lessons">
        <BundleCourseCarousel />
      </section>

      {/* Timeline Process */}
      <section id="overview">
        <BundleTimelineProcess />
      </section>

      {/* Pricing Popup */}
      <CoursePricingPopup
        isOpen={isPricingPopupOpen}
        onClose={() => setIsPricingPopupOpen(false)}
        product={product}
        features={priceFeatures}
      />

      {/* Testimonials */}
      <div id="testimonials">
        <TestimonialSection testimonials={testimonials} />
      </div>

      {/* Inline Pricing Card */}
      <CoursePriceCard
        product={product}
        features={priceFeatures}
      />

      {/* FAQ */}
      <CourseFAQ courseType="bundle" />

      <Footer />

      {/* Black Friday Challenge Popup */}
      <BlackFridayChallengePopup />
    </div>
    </>
  )
}
