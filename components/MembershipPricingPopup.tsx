'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, CreditCard, Smartphone, TrendingUp } from 'lucide-react'
import { AdaptivePrice, AdaptivePricePerMonth } from './AdaptivePrice'

interface MembershipPricingPopupProps {
  isOpen: boolean
  onClose: () => void
  defaultPlan?: string
}

export function MembershipPricingPopup({ isOpen, onClose, defaultPlan = 'membership-annual' }: MembershipPricingPopupProps) {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan)

  // Update selected plan when defaultPlan changes
  useEffect(() => {
    setSelectedPlan(defaultPlan)
  }, [defaultPlan])

  const handleJoinNow = () => {
    router.push(`/checkout?product=${selectedPlan}&source=membership-pricing-popup`)
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
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
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-900" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8 lg:p-10">
          {/* Title */}
          <h2 className="text-hero font-bold text-gray-900 mb-2 sm:mb-3 text-center">
            Join Oracle Boxing for as little as <AdaptivePricePerMonth usdAmount={897} months={12} metadata="mema" className="inline" /> per month!
          </h2>
          <p className="text-title text-gray-600 text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            Choose the plan that fits your commitment level
          </p>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 sm:mb-8">
            {/* Annual - Left */}
            <div className="relative">
              {/* Best Value Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#000000] text-white text-xs font-black uppercase rounded-full z-10 whitespace-nowrap shadow-md">
                Best Value
              </div>

              <div
                onClick={() => setSelectedPlan('membership-annual')}
                className={`cursor-pointer rounded-xl border-2 transition-all ${
                  selectedPlan === 'membership-annual'
                    ? 'border-[#000000] shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'membership-annual' ? 'border-[#000000] bg-[#000000]' : 'border-gray-300 bg-white'
                    }`}>
                      {selectedPlan === 'membership-annual' && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="text-sub font-bold text-gray-900">Annual</h3>
                    <div className="text-section font-black text-gray-900">
                      <AdaptivePrice usdAmount={897} metadata="mema" />
                    </div>
                  </div>
                  <div className="text-body text-gray-600 mb-3">Billed every year</div>
                  <div className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <div className="text-sub font-bold text-gray-900">
                        <AdaptivePricePerMonth usdAmount={897} months={12} metadata="mema" />
                      </div>
                      <div className="text-xs text-gray-600">/ month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6-Month - Middle */}
            <div className="relative">
              <div
                onClick={() => setSelectedPlan('membership-6month')}
                className={`cursor-pointer rounded-xl border-2 transition-all ${
                  selectedPlan === 'membership-6month'
                    ? 'border-[#000000] shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'membership-6month' ? 'border-[#000000] bg-[#000000]' : 'border-gray-300 bg-white'
                    }`}>
                      {selectedPlan === 'membership-6month' && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="text-sub font-bold text-gray-900">Bi-Annual</h3>
                    <div className="text-section font-black text-gray-900">
                      <AdaptivePrice usdAmount={497} metadata="mem6" />
                    </div>
                  </div>
                  <div className="text-body text-gray-600 mb-3">Billed every 6 months</div>
                  <div className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <div className="text-sub font-bold text-gray-900">
                        <AdaptivePricePerMonth usdAmount={497} months={6} metadata="mem6" />
                      </div>
                      <div className="text-xs text-gray-600">/ month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quarterly - Right */}
            <div className="relative">
              <div
                onClick={() => setSelectedPlan('membership-monthly')}
                className={`cursor-pointer rounded-xl border-2 transition-all ${
                  selectedPlan === 'membership-monthly'
                    ? 'border-[#000000] shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'membership-monthly' ? 'border-[#000000] bg-[#000000]' : 'border-gray-300 bg-white'
                    }`}>
                      {selectedPlan === 'membership-monthly' && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="text-sub font-bold text-gray-900">Quarterly</h3>
                    <div className="text-section font-black text-gray-900">
                      <AdaptivePrice usdAmount={297} metadata="memq" />
                    </div>
                  </div>
                  <div className="text-body text-gray-600 mb-3">Billed every 3 months</div>
                  <div className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <div className="text-sub font-bold text-gray-900">
                        <AdaptivePricePerMonth usdAmount={297} months={3} metadata="memq" />
                      </div>
                      <div className="text-xs text-gray-600">/ month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Join Now Button */}
          <div className="text-center mb-3 sm:mb-4">
            <button
              onClick={handleJoinNow}
              className="py-4 sm:py-5 lg:py-6 px-10 sm:px-12 lg:px-14 bg-yellow-100 text-black font-black text-section rounded-xl uppercase tracking-wide transition-colors cursor-pointer hover:bg-yellow-200 flex items-center justify-center gap-2 mx-auto border-4 border-black shadow-lg"
            >
              CHECKOUT
              <span className="text-section">→</span>
            </button>
          </div>

          {/* Monthly billing note */}
          <p className="text-center text-gray-600 text-body mb-4 sm:mb-6">
            You can switch to monthly billing at <AdaptivePrice usdAmount={97} metadata="mem_monthly" className="inline" />/month after purchase
          </p>

          {/* Payment Methods */}
          <div className="payment_icons-group mb-6 sm:mb-8" role="group" aria-label="Accepted payment methods">
            <img
              loading="lazy"
              alt="Visa and Mastercard accepted"
              src="https://sb.oracleboxing.com/Website/payment1.svg"
              className="image-55"
            />
            <img
              loading="lazy"
              alt="American Express accepted"
              src="https://sb.oracleboxing.com/Website/payment2.svg"
              className="image-55 second"
            />
            <img
              loading="lazy"
              alt="PayPal accepted"
              src="https://sb.oracleboxing.com/Website/paypal2.svg"
              className="image-55 bigger"
            />
            <img
              loading="lazy"
              src="https://sb.oracleboxing.com/Website/klarna.svg"
              alt="Klarna accepted"
              className="image-55 bigger-mobile"
            />
          </div>

          {/* Benefits List */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-w-3xl mx-auto">
            {[
              { text: "Unlimited access", bold: " to all Oracle Boxing courses and replays" },
              { text: "Daily live coaching calls", bold: " and community training sessions" },
              { text: "Personal feedback", bold: " on your training videos from real coaches" },
              { text: "Access to the full Boxing Masterclass and Boxing Roadmap", bold: "" },
              { text: "Entry to the private Skool coaching community", bold: "" },
              { text: "Leaderboards, accountability, and live competitions", bold: "" },
              { text: "Exclusive workshops, mentorship calls, and bonus drops", bold: "" },
              { text: "Free access", bold: " to all future courses and system updates" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-green-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-title font-medium leading-relaxed text-gray-900">
                  <strong className="font-bold">{benefit.text}</strong>
                  {benefit.bold}
                </span>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="border-t border-gray-200 pt-6 sm:pt-8">
            <h3 className="text-sub font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              How it works
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-8 h-8 text-[#000000]" strokeWidth={1.5} />
                </div>
                <p className="text-body text-gray-900 font-semibold">
                  Choose your subscription and complete your purchase
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-8 h-8 text-[#000000]" strokeWidth={1.5} />
                </div>
                <p className="text-body text-gray-900 font-semibold">
                  Login to the portal and download the app
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-[#000000]" strokeWidth={1.5} />
                </div>
                <p className="text-body text-gray-900 font-semibold">
                  Start progressing faster than you could have imagined
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
