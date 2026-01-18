'use client'

import { useCurrency } from '@/contexts/CurrencyContext'
import { formatPrice, getProductPrice } from '@/lib/currency'
import { ArrowButton } from '@/components/ui/arrow-button'
import { ENROLLMENT_CLOSED, getCheckoutUrl } from '@/lib/enrollment'
import { CAMPAIGN_ACTIVE, getEnrollmentDeadlineText } from '@/lib/campaign'
import CampaignSpotCounter from '@/components/CampaignSpotCounter'

export default function PricingSection() {
  const { currency } = useCurrency()
  const price = getProductPrice('21dc_entry', currency) || 147
  const checkoutUrl = getCheckoutUrl()

  const includedFeatures = [
    'Boxing Fundamentals Course',
    '3 Weekly Feedback Submissions',
    '21-Day Structured Program',
    'Graduation Call with Coach',
    'Community Access',
    'Money-Back Guarantee',
  ]

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-[#37322F] relative overflow-hidden">
      {/* Animated flowing ribbons background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ribbon ribbon-1" />
        <div className="ribbon ribbon-2" />
        <div className="ribbon ribbon-3" />
        <div className="ribbon ribbon-4" />
        <div className="ribbon ribbon-5" />
        <div className="ribbon ribbon-6" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Inner white card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-8 lg:gap-8">
            {/* Left side - Product info */}
            <div className="lg:max-w-[420px]">
                {/* Logo */}
                <div className="flex justify-start mb-6">
                  <img
                    src="https://sb.oracleboxing.com/logo/icon_dark.webp"
                    alt="Oracle Boxing"
                    className="w-10 h-auto"
                  />
                </div>

                {/* Heading */}
                <h2 className="text-left text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                  <span className="text-[#37322F]">21-Day</span><br />
                  <span className="text-[#9CABA8]">Challenge</span>
                </h2>

                {/* Description */}
                <p className="text-left text-[#605A57] text-sm md:text-base font-normal leading-relaxed mb-6">
                  Join the 21-Day Challenge and prove you have what it takes. Show up, put in the work, and earn your place in Oracle Boxing.
                </p>

                {/* Features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {includedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                      >
                        <circle cx="10" cy="10" r="10" fill="#E8F5E9" />
                        <path
                          d="M6 10L9 13L14 7"
                          stroke="#4CAF50"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[#49423D] text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Price and CTA */}
              <div className="flex-1 flex flex-col items-center lg:items-end lg:justify-between">
                {/* Price - Top Right (hidden when enrollment closed) */}
                {!ENROLLMENT_CLOSED && (
                  <div className="text-center lg:text-right">
                    <div className="flex items-baseline justify-center lg:justify-end gap-2">
                      <span
                        className="text-[#37322F] text-4xl md:text-5xl font-medium"
                        style={{ fontFamily: 'ClashDisplay, sans-serif' }}
                      >
                        {formatPrice(price, currency)}
                      </span>
                    </div>
                    <p className="text-[#847971] text-sm mt-1">One-time payment</p>
                    {/* Campaign Info - Spot Counter & Deadline */}
                    {CAMPAIGN_ACTIVE && (
                      <div className="mt-3 flex flex-col items-center lg:items-end gap-2">
                        <CampaignSpotCounter size="md" />
                        <p className="text-[#847971] text-xs">
                          Enrollment closes {getEnrollmentDeadlineText()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Spacer to push button to bottom when price is hidden */}
                {ENROLLMENT_CLOSED && <div className="flex-1" />}

                {/* CTA Button - Bottom Right */}
                <ArrowButton href={checkoutUrl} className="w-full lg:w-auto lg:min-w-[280px] mt-6 lg:mt-0">
                  {ENROLLMENT_CLOSED ? 'Join the Waitlist' : 'Start Your Transformation'}
                </ArrowButton>
            </div>
          </div>
        </div>
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
        /* Also hide for users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
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
      `}</style>
    </section>
  )
}
