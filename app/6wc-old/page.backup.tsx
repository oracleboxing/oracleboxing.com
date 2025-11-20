'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import { PricingPopup } from '@/components/PricingPopup'
import { ChallengePrice, ValuePrice } from '@/components/AdaptivePrice'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice } from '@/lib/currency'

// Dynamic imports for below-the-fold components to reduce initial bundle
const TestimonialsWithMediaSection = dynamic(() => import('@/components/TestimonialsWithMediaSection'))

const RefundRequirementsSection = dynamic(() => import('@/components/RefundRequirementsSection'))

const TransformationStory = dynamic(() => import('@/components/TransformationStory'))

const CostOfInactionCTA = dynamic(() => import('@/components/CostOfInactionCTA'))

const FAQSection = dynamic(() => import('@/components/FAQSection'))

const PlatformScreenshotsCarousel = dynamic(() => import('@/components/PlatformScreenshotsCarousel').then(mod => ({ default: mod.PlatformScreenshotsCarousel })))

export default function ChallengePage() {
  const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false)
  const { currency } = useCurrency()

  const handleOpenPricing = () => {
    setIsPricingPopupOpen(true)
  }

  // Benefits to display with checkmarks
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
      <HeroSection onOpenPricing={handleOpenPricing} />

      {/* Founder's Transformation Story */}
      <TransformationStory />

      {/* Testimonials with Media Section */}
      <TestimonialsWithMediaSection />

      {/* Platform Screenshots Carousel */}
      <PlatformScreenshotsCarousel />

      {/* How to Win Your Money Back - Moved before offer stack */}
      <RefundRequirementsSection />

      {/* Inline Pricing Section */}
      <section className="py-6 sm:py-20 bg-white">
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

      {/* Cost of Inaction Final CTA */}
      <CostOfInactionCTA />

      {/* FAQ Section */}
      <FAQSection />

      {/* Pricing Popup */}
      <PricingPopup isOpen={isPricingPopupOpen} onClose={() => setIsPricingPopupOpen(false)} />

      {/* Footer only; header and consultation widget omitted for this page */}
      <Footer />
    </>
  )
}
