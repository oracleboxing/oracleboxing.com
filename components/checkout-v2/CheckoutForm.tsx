'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Currency, formatPrice, getProductPrice } from '@/lib/currency'
import { PhoneInput, getFullPhoneNumber, COUNTRIES } from '@/components/ui/phone-input'

interface CheckoutFormProps {
  onSubmit: (info: { firstName: string; lastName: string; email: string; phone: string }) => Promise<void>
  isLoading: boolean
  error: string | null
  currency: Currency
}

export function CheckoutForm({ onSubmit, isLoading, error, currency }: CheckoutFormProps) {
  const [detectedCountry, setDetectedCountry] = useState('US')
  const [phoneCountry, setPhoneCountry] = useState('US')
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  // Auto-detect country on mount
  useEffect(() => {
    async function detectCountry() {
      try {
        const response = await fetch('/api/detect-location')
        const data = await response.json()
        if (data.country_code) {
          const country = COUNTRIES.find(c => c.code === data.country_code)
          if (country) {
            setDetectedCountry(data.country_code)
            setPhoneCountry(data.country_code)
          }
        }
      } catch (error) {
        console.warn('Failed to detect location:', error)
      }
    }
    detectCountry()
  }, [])

  // Calculate prices
  const mainPrice = getProductPrice('21dc_entry', currency) || 147

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const firstName = customerInfo.firstName.trim()
    const lastName = customerInfo.lastName.trim()
    const email = customerInfo.email.trim()
    const phoneRaw = customerInfo.phone.trim()

    if (!firstName || !lastName || !email || !phoneRaw) {
      toast.error('Please fill in all required fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Get the full E.164 formatted phone number
    const selectedCountry = COUNTRIES.find(c => c.code === phoneCountry)
    const dialCode = selectedCountry?.dial || '+1'
    const phone = getFullPhoneNumber(phoneRaw, dialCode)

    if (!phone) {
      toast.error('Please enter a valid phone number')
      return
    }

    await onSubmit({ firstName, lastName, email, phone })
  }

  return (
    <div className="min-h-screen bg-[#37322F] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated flowing ribbons background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ribbon ribbon-1" />
        <div className="ribbon ribbon-2" />
        <div className="ribbon ribbon-3" />
        <div className="ribbon ribbon-4" />
        <div className="ribbon ribbon-5" />
        <div className="ribbon ribbon-6" />
      </div>

      {/* Back link */}
      <a href="/" className="absolute top-4 left-4 text-white/70 text-sm font-medium hover:text-white transition-colors z-10">
        &larr; Back
      </a>

      {/* Card */}
      <div className="w-full max-w-md lg:max-w-3xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 sm:p-8 lg:p-12 relative z-10">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          {/* Logo */}
          <div className="flex justify-start mb-4 sm:mb-8">
            <img
              src="https://sb.oracleboxing.com/logo/icon_dark.webp"
              alt="Oracle Boxing"
              className="w-8 sm:w-10 h-auto"
            />
          </div>

          {/* Heading */}
          <h1 className="text-left text-2xl sm:text-3xl md:text-4xl font-normal leading-tight mb-3 sm:mb-6" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
            <span className="text-[#37322F]">Start your</span><br />
            <span className="text-[#9CABA8]">Transformation</span>
          </h1>

          {/* Description */}
          <p className="text-left text-[#605A57] text-xs sm:text-sm md:text-base font-normal leading-relaxed mb-5 sm:mb-8">
            Join the 21-Day Challenge and prove you have what it takes. Show up, put in the work, and earn your place in Oracle Boxing.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Name Inputs - Side by Side */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-[#49423D] mb-1.5 sm:mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={customerInfo.firstName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-[rgba(55,50,47,0.20)] rounded-lg focus:ring-2 focus:ring-[#37322F] focus:border-transparent transition-all"
                placeholder="John"
                required
                disabled={isLoading}
                style={{ cursor: 'text' }}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-[#49423D] mb-1.5 sm:mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={customerInfo.lastName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-[rgba(55,50,47,0.20)] rounded-lg focus:ring-2 focus:ring-[#37322F] focus:border-transparent transition-all"
                placeholder="Doe"
                required
                disabled={isLoading}
                style={{ cursor: 'text' }}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-3 sm:mb-4">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#49423D] mb-1.5 sm:mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-[rgba(55,50,47,0.20)] rounded-lg focus:ring-2 focus:ring-[#37322F] focus:border-transparent transition-all"
              placeholder="your@email.com"
              required
              disabled={isLoading}
              style={{ cursor: 'text' }}
            />
          </div>

          {/* Phone Input */}
          <div className="mb-5 sm:mb-8">
            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-[#49423D] mb-1.5 sm:mb-2">
              Phone Number *
            </label>
            <PhoneInput
              id="phone"
              value={customerInfo.phone}
              onChange={(phone) => setCustomerInfo({ ...customerInfo, phone })}
              onCountryChange={setPhoneCountry}
              defaultCountryCode={detectedCountry}
              disabled={isLoading}
              placeholder="7912345678"
              required
            />
            <p className="text-[#847971] text-xs mt-1.5">
              For order confirmations and program reminders.
            </p>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 px-6 rounded-lg font-medium text-base shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] transition-all duration-200 flex items-center justify-center ${
              isLoading
                ? 'bg-[#847971] cursor-not-allowed'
                : 'bg-[#37322F] hover:bg-[#37322f]/90 cursor-pointer'
            } text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <span className="font-medium">Continue to Payment</span>
                <span className="text-white/40 mx-3">|</span>
                <span className="w-5 h-5 overflow-hidden relative">
                  <span className="arrow-container flex items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0"
                    >
                      <path
                        d="M4 10H16M16 10L11 5M16 10L11 15"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 ml-1"
                    >
                      <path
                        d="M4 10H16M16 10L11 5M16 10L11 15"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </>
            )}
          </button>

          {/* Consent */}
          <p className="text-left text-[#847971] text-xs mt-4">
            I agree to receive order updates and program reminders via email and SMS. Reply STOP to opt out. Msg & data rates may apply.
          </p>
        </form>
      </div>

      <style jsx>{`
        .ribbon {
          position: absolute;
          width: 200%;
          height: 150px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,252,245,0.15) 20%,
            rgba(255,252,245,0.3) 50%,
            rgba(255,252,245,0.15) 80%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(20px);
          box-shadow: 0 0 60px 30px rgba(255, 252, 245, 0.15);
        }
        /* Hide heavy animations on mobile to prevent Safari crashes */
        @media (max-width: 768px) {
          .ribbon {
            display: none;
          }
        }
        .ribbon-1 {
          top: 5%;
          left: -50%;
          transform: rotate(-15deg);
          animation: drift1 12s ease-in-out infinite;
        }
        .ribbon-2 {
          top: 25%;
          left: -30%;
          height: 200px;
          transform: rotate(10deg);
          animation: drift2 15s ease-in-out infinite;
          animation-delay: -3s;
        }
        .ribbon-3 {
          top: 50%;
          left: -40%;
          height: 180px;
          transform: rotate(-8deg);
          animation: drift3 11s ease-in-out infinite;
          animation-delay: -5s;
        }
        .ribbon-4 {
          top: 70%;
          left: -60%;
          height: 160px;
          transform: rotate(20deg);
          animation: drift1 14s ease-in-out infinite;
          animation-delay: -8s;
        }
        .ribbon-5 {
          top: 85%;
          left: -20%;
          height: 140px;
          transform: rotate(-12deg);
          animation: drift2 12s ease-in-out infinite;
          animation-delay: -4s;
        }
        .ribbon-6 {
          top: 40%;
          left: -50%;
          height: 220px;
          transform: rotate(5deg);
          animation: drift3 16s ease-in-out infinite;
          animation-delay: -10s;
        }
        @keyframes drift1 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-15deg);
            opacity: 0.8;
          }
          50% {
            transform: translateX(60vw) translateY(30px) rotate(-10deg);
            opacity: 1;
          }
        }
        @keyframes drift2 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(10deg);
            opacity: 0.75;
          }
          50% {
            transform: translateX(50vw) translateY(-40px) rotate(15deg);
            opacity: 1;
          }
        }
        @keyframes drift3 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-8deg);
            opacity: 0.7;
          }
          50% {
            transform: translateX(55vw) translateY(20px) rotate(-5deg);
            opacity: 0.95;
          }
        }
        .arrow-container {
          transition: transform 0.3s ease;
        }
        button:hover .arrow-container {
          animation: scrollArrow 0.3s ease forwards;
        }
        @keyframes scrollArrow {
          0% {
            transform: translateX(-24px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
