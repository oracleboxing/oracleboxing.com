'use client'

import {
  Trophy,
  Users,
  BookOpen,
  Video,
  Phone,
  Award,
  Shield,
  Star
} from "lucide-react"
import { ScrollToTopLink as Link } from '@/components/ScrollToTopLink'
import { EpicCTAButton } from '@/components/EpicCTAButton'
import { ChallengePrice, ValuePrice } from '@/components/AdaptivePrice'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice } from '@/lib/currency'

interface EpicOfferStackSectionProps {
  onCTAClick?: () => void;
}

export default function EpicOfferStackSection({ onCTAClick }: EpicOfferStackSectionProps) {
  const { currency } = useCurrency()

  // Benefits to display with checkmarks
  const benefits = [
    "Learn step-by-step with live coaching and feedback.",
    "Structured 6-week system with progress tracking and community support.",
    "Finish the challenge, prove your commitment, and get a full refund.",
  ]

  // Calculate total value in current currency
  const bffpPrice = getProductPrice('bffp', currency) || 297
  const rcvPrice = getProductPrice('rcv', currency) || 97
  const brdmpPrice = getProductPrice('brdmp', currency) || 147
  const totalValue = bffpPrice + rcvPrice + rcvPrice + brdmpPrice // Same as original: bffp + rcv + rcv + brdmp

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#000000] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl text-white">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src="https://sb.oracleboxing.com/Website/infinity_squared_white.svg"
              alt="Oracle Boxing"
              className="h-6 sm:h-8"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 uppercase px-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
            6-WEEK CHALLENGE
          </h3>

          {/* Price Section */}
          <div className="text-center mb-6 sm:mb-8">
            <ValuePrice usdAmount={totalValue} className="text-xl sm:text-2xl md:text-3xl font-bold opacity-60 line-through mb-2" />
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3"><ChallengePrice /></div>
          </div>

          {/* CTA Button - White with Navy Text */}
          <a
            href="/checkout?product=6wc&source=epic-offer-stack"
            className="w-full py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-12 bg-white text-[#000000] font-black text-base sm:text-lg md:text-xl rounded-xl mb-6 sm:mb-8 uppercase tracking-wide min-h-[60px] sm:min-h-[64px] lg:min-h-[72px] shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
            style={{ cursor: 'pointer' }}
          >
            START CHALLENGE
          </a>

          {/* Benefits List with Checkmarks */}
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
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="payment_icons-group">
            <img
              loading="lazy"
              alt=""
              src="https://sb.oracleboxing.com/Website/payment1.svg"
              className="image-55"
            />
            <img
              loading="lazy"
              alt=""
              src="https://sb.oracleboxing.com/Website/payment2.svg"
              className="image-55 second"
            />
            <img
              loading="lazy"
              alt=""
              src="https://sb.oracleboxing.com/Website/paypal2.svg"
              className="image-55 bigger"
            />
            <img
              loading="lazy"
              src="https://sb.oracleboxing.com/Website/klarna.svg"
              alt=""
              className="image-55 bigger-mobile"
            />
          </div>
        </div>
      </div>
    </section>
  )
}