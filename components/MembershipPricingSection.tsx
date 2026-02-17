'use client'

import { ArrowButton } from '@/components/ui/arrow-button'
import { trackAddToCart } from '@/lib/webhook-tracking'

export default function MembershipPricingSection() {
  const features = [
    'Weekly group coaching calls',
    'Full course library access',
    'Private community on Skool',
    'Personal video feedback',
    'Grading system access',
  ]

  return (
    <section className="w-full md:min-h-screen flex flex-col justify-center py-0 md:py-24 px-0 md:px-8 bg-white md:bg-[#37322F] relative overflow-hidden">
      {/* Animated flowing ribbons background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ribbon ribbon-1" />
        <div className="ribbon ribbon-2" />
        <div className="ribbon ribbon-3" />
        <div className="ribbon ribbon-4" />
        <div className="ribbon ribbon-5" />
        <div className="ribbon ribbon-6" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-6 md:mb-10 py-10 md:py-0 bg-[#37322F] md:bg-transparent">
          <h2 className="text-3xl md:text-4xl font-normal leading-tight">
            <span className="text-white">Full Access </span>
            <span className="text-white/70">Membership</span>
          </h2>
          <p className="text-white text-sm mt-3">
            Ongoing coaching, community, and course access for serious boxers
          </p>
        </div>

        {/* Two cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
          {/* Monthly Card */}
          <div className="bg-white rounded-none md:rounded-2xl shadow-none md:shadow-2xl p-8 md:p-10 text-center flex flex-col">
            <h3 className="text-lg font-medium text-[#37322F] mb-1">Monthly</h3>
            <div className="mt-4 mb-2">
              <span className="text-[#37322F] text-5xl md:text-6xl font-semibold tracking-tight">$97</span>
              <span className="text-[#847971] text-lg">/mo</span>
            </div>
            <p className="text-[#847971] text-sm mb-8">Cancel anytime</p>

            <div className="w-12 h-px bg-[#37322F]/10 mx-auto mb-8" />

            <div className="flex flex-col gap-3 mb-10 max-w-xs mx-auto flex-1">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                    <circle cx="10" cy="10" r="10" fill="#E8F5E9" />
                    <path d="M6 10L9 13L14 7" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[#49423D] text-sm font-medium text-left">{feature}</span>
                </div>
              ))}
            </div>

            <ArrowButton
              href="/checkout-v2?product=membership&plan=monthly"
              onClick={() => trackAddToCart('membership-monthly', 'Oracle Membership (Monthly)', 97, 'USD', 'membership-pricing')}
              className="w-full"
            >
              Join Monthly
            </ArrowButton>
          </div>

          {/* Annual Card */}
          <div className="bg-white rounded-none md:rounded-2xl shadow-none md:shadow-2xl p-8 md:p-10 text-center flex flex-col relative">
            <h3 className="text-lg font-medium text-[#37322F] mb-1">Annual</h3>
            <div className="mt-4 mb-2">
              <span className="text-[#37322F] text-5xl md:text-6xl font-semibold tracking-tight">$897</span>
              <span className="text-[#847971] text-lg">/yr</span>
            </div>
            <p className="text-[#49423D]/50 text-xs mb-8">That&apos;s just $74.75/mo</p>

            <div className="w-12 h-px bg-[#37322F]/10 mx-auto mb-8" />

            <div className="flex flex-col gap-3 mb-10 max-w-xs mx-auto flex-1">
              <p className="text-[#49423D]/70 text-sm text-left italic mb-1">Everything in Monthly, plus:</p>
              {['Save $267/yr vs monthly', 'Boxing from First Principles course', 'Free 1-on-1 coaching call', 'Custom 2-week starter workout plan'].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                    <circle cx="10" cy="10" r="10" fill="#E8F5E9" />
                    <path d="M6 10L9 13L14 7" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[#49423D] text-sm font-medium text-left">{feature}</span>
                </div>
              ))}
            </div>

            <ArrowButton
              href="/checkout-v2?product=membership&plan=annual"
              onClick={() => trackAddToCart('membership-annual', 'Oracle Membership (Annual)', 897, 'USD', 'membership-pricing')}
              className="w-full"
            >
              Join Annual
            </ArrowButton>

            {/* moved to below Save line */}
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
        @media (max-width: 768px) {
          .ribbon { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ribbon { display: none; }
        }
        .ribbon-1 { top: 5%; left: -50%; transform: rotate(-15deg); animation: drift1 12s ease-in-out infinite; }
        .ribbon-2 { top: 25%; left: -30%; height: 200px; transform: rotate(10deg); animation: drift2 15s ease-in-out infinite; animation-delay: -3s; }
        .ribbon-3 { top: 50%; left: -40%; height: 180px; transform: rotate(-8deg); animation: drift3 11s ease-in-out infinite; animation-delay: -5s; }
        .ribbon-4 { top: 70%; left: -60%; height: 160px; transform: rotate(20deg); animation: drift1 14s ease-in-out infinite; animation-delay: -8s; }
        .ribbon-5 { top: 85%; left: -20%; height: 140px; transform: rotate(-12deg); animation: drift2 12s ease-in-out infinite; animation-delay: -4s; }
        .ribbon-6 { top: 40%; left: -50%; height: 220px; transform: rotate(5deg); animation: drift3 16s ease-in-out infinite; animation-delay: -10s; }
        @keyframes drift1 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(-15deg); opacity: 0.8; }
          50% { transform: translateX(60vw) translateY(30px) rotate(-10deg); opacity: 1; }
        }
        @keyframes drift2 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(10deg); opacity: 0.75; }
          50% { transform: translateX(50vw) translateY(-40px) rotate(15deg); opacity: 1; }
        }
        @keyframes drift3 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(-8deg); opacity: 0.7; }
          50% { transform: translateX(55vw) translateY(20px) rotate(-5deg); opacity: 0.95; }
        }
      `}</style>
    </section>
  )
}
