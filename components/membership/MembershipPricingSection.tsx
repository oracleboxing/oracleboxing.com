'use client'

import { useState } from 'react'
import { ArrowButton } from '@/components/ui/arrow-button'
import { getMemberships } from '@/lib/products'

export default function MembershipPricingSection() {
  const memberships = getMemberships()
  const monthlyPlan = memberships.find(m => m.id === 'membership-monthly')!
  const annualPlan = memberships.find(m => m.id === 'membership-annual')!
  
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual')

  // Calculate savings
  const monthlyYearlyCost = monthlyPlan.price * 12
  const annualSavings = monthlyYearlyCost - annualPlan.price

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-section font-normal mb-4">
            Choose Your <span className="text-[#9CABA8]">Membership Plan</span>
          </h2>
          <p className="text-title text-[#605A57] max-w-2xl mx-auto">
            Flexible options to fit your commitment level. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <div 
            className={`relative rounded-2xl border-2 p-8 transition-all cursor-pointer ${
              selectedPlan === 'monthly' 
                ? 'border-[#37322F] shadow-xl' 
                : 'border-[rgba(55,50,47,0.2)] hover:border-[#37322F] hover:shadow-lg'
            }`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="mb-6">
              <h3 className="text-sub font-semibold mb-2">
                Monthly
              </h3>
              <p className="text-[#605A57] text-sm">
                Perfect for getting started
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-hero font-bold">
                  ${monthlyPlan.price}
                </span>
                <span className="text-[#605A57]">/month</span>
              </div>
              <p className="text-sm text-[#847971] mt-2">
                Billed monthly • Cancel anytime
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#49423D]">Daily live coaching with Oliver & Toni</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#49423D]">Access to all courses (BFFP, Roadmap, Vault)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#49423D]">Private community access</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#49423D]">Personal video feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#49423D]">Cancel anytime</span>
              </li>
            </ul>

            <ArrowButton
              href={`/membership-checkout?product=membership-monthly`}
              className="w-full"
            >
              Get Started Monthly
            </ArrowButton>
          </div>

          {/* Annual Plan */}
          <div 
            className={`relative rounded-2xl border-2 p-8 transition-all cursor-pointer ${
              selectedPlan === 'annual' 
                ? 'border-[#37322F] shadow-xl' 
                : 'border-[rgba(55,50,47,0.2)] hover:border-[#37322F] hover:shadow-lg'
            }`}
            onClick={() => setSelectedPlan('annual')}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#37322F] text-white px-4 py-1 rounded-full text-sm font-medium">
              Best Value - Save ${annualSavings}
            </div>

            <div className="mb-6">
              <h3 className="text-sub font-semibold mb-2">
                Annual
              </h3>
              <p className="text-[#605A57] text-sm">
                Best for committed learners
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-hero font-bold">
                  ${annualPlan.price}
                </span>
                <span className="text-[#605A57]">/year</span>
              </div>
              <p className="text-sm text-[#847971] mt-2">
                ${Math.round(annualPlan.price / 12)}/month • Billed annually
              </p>
              <div className="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Save ${annualSavings} vs monthly
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#49423D] font-medium">Everything in Monthly</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#49423D]">Save ${annualSavings}/year</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#49423D]">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#49423D]">Best value for commitment</span>
              </li>
            </ul>

            <ArrowButton
              href={`/membership-checkout?product=membership-annual`}
              className="w-full"
            >
              Get Started Annually
            </ArrowButton>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#605A57] flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            Secure payment • Cancel anytime • No long-term commitment required
          </p>
        </div>
      </div>
    </section>
  )
}
