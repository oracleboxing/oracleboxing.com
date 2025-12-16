'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { ChallengePrice, ValuePrice } from '@/components/AdaptivePrice'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice } from '@/lib/currency'

interface PricingPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingPopup({ isOpen, onClose }: PricingPopupProps) {
  const { currency } = useCurrency()

  // Benefits to display with checkmarks
  const benefits = [
    { text: "100% refund guarantee", bold: " on completion" },
    { text: "Structured 6-week training path", bold: "" },
    { text: "Weekly live coaching calls", bold: " with Oliver" },
    { text: "Personal feedback", bold: " on your training videos" },
    { text: "Full access", bold: " to the Boxing Masterclass" },
    { text: "Lifetime access", bold: " to the Boxing Roadmap" },
    { text: "Direct access", bold: " to your coaches for questions" }
  ]

  // Calculate total value in current currency
  const bffpPrice = getProductPrice('bffp', currency) || 297
  const rcvPrice = getProductPrice('rcv', currency) || 97
  const brdmpPrice = getProductPrice('brdmp', currency) || 147
  const totalValue = bffpPrice + rcvPrice + rcvPrice + brdmpPrice

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Price Card Content */}
        <div className="bg-[#000000] rounded-3xl p-6 sm:p-8 lg:p-10 text-white">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src="https://sb.oracleboxing.com/Website/infinity_squared_white.svg"
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
              src="https://sb.oracleboxing.com/Website/skool_art.webp"
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
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black"><ChallengePrice /></div>
            </div>
            <div className="text-sm text-white/80 mt-2">incl. all taxes</div>
          </div>

          {/* CTA Button */}
          <a
            href="/checkout?product=6wc&source=6wc-pricing-popup"
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
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                  <strong className="font-bold">{benefit.text}</strong>
                  {benefit.bold}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
