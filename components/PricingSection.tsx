'use client'

import { useEffect, useRef } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { formatPrice, getProductPrice } from '@/lib/currency'
import { ArrowButton } from '@/components/ui/arrow-button'
import { getCheckoutUrl } from '@/lib/enrollment'
import { trackAddToCart } from '@/lib/webhook-tracking'

export default function PricingSection() {
  const { currency } = useCurrency()
  const price = getProductPrice('21dc_entry', currency) || 147
  const viewItemFired = useRef(false)

  // Fire view_item for Google Ads when pricing section mounts
  useEffect(() => {
    if (viewItemFired.current) return
    viewItemFired.current = true

    try {
      import('@/lib/gtag').then(({ gtagViewItem }) => {
        gtagViewItem({
          item_id: '21dc-entry',
          item_name: '21-Day Challenge',
          price: price,
          currency: currency,
          item_category: 'Boxing Course',
        })
      }).catch(() => {})
    } catch (e) {
      // silently ignore
    }
  }, [price, currency])
  const checkoutUrl = getCheckoutUrl()
  // Campaign spots removed

  const includedFeatures = [
    '21-day structured program',
    '1-on-1 graduation call with coach',
    'Weekly technique feedback',
    'Community access',
  ]

  return (
    <section className="w-full min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 md:px-8 bg-[#37322F] relative overflow-hidden">
      {/* Animated flowing ribbons background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ribbon ribbon-1" />
        <div className="ribbon ribbon-2" />
        <div className="ribbon ribbon-3" />
        <div className="ribbon ribbon-4" />
        <div className="ribbon ribbon-5" />
        <div className="ribbon ribbon-6" />
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        {/* Inner white card - vertically stacked, centered */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-2">
            <span className="text-[#37322F]">21-Day </span>
            <span className="text-[#9CABA8]">Challenge</span>
          </h2>

          {/* Price */}
          <div className="mt-6 mb-2">
            <span className="text-[#37322F] text-6xl md:text-7xl font-semibold tracking-tight">
              {formatPrice(price, currency)}
            </span>
          </div>
          <p className="text-[#847971] text-sm mb-8">One-time payment</p>

          {/* Divider */}
          <div className="w-12 h-px bg-[#37322F]/10 mx-auto mb-8" />

          {/* Features - single column, left-aligned */}
          <div className="flex flex-col gap-3 mb-10 max-w-xs mx-auto">
            {includedFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
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
                <span className="text-[#49423D] text-sm font-medium text-left">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button - full width */}
          <ArrowButton
            href={checkoutUrl}
            onClick={() => trackAddToCart('21dc-entry', '21-Day Challenge', price, currency, 'pricing-section')}
            className="w-full"
          >
            Join Now
          </ArrowButton>

          {/* Trust badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[#49423D]/50 text-xs sm:text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            <span>Complete the work, get your money back</span>
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
