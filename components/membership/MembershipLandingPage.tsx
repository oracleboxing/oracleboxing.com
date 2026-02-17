'use client'

import { useState } from 'react'
import { ArrowButton } from '@/components/ui/arrow-button'
import HomepageHeader from '@/components/HomepageHeader'
import FooterSection from '@/components/footer-section'
import { FadeInOnScroll } from '@/components/FadeInOnScroll'
import MembershipPricingSection from '@/components/membership/MembershipPricingSection'
import MembershipBenefitsSection from '@/components/membership/MembershipBenefitsSection'
import MembershipTestimonialsSection from '@/components/membership/MembershipTestimonialsSection'
import MembershipFAQSection from '@/components/membership/MembershipFAQSection'

export default function MembershipLandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <HomepageHeader />
      <div className="flex flex-1 pt-[72px]">
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
        <main className="flex-1 min-w-0">
          {/* Hero Section */}
          <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#37322F] to-[#49423D]">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-hero font-normal text-white mb-6">
                Master Boxing<br />
                <span className="text-[#C4B5A0]">with Expert Coaching</span>
              </h1>
              <p className="text-title text-[#E5DDD3] max-w-3xl mx-auto mb-10 leading-relaxed">
                Join a community of dedicated boxers learning from world-class coaches Oliver and Toni. Get daily live coaching, personalized feedback, and access to our complete curriculum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ArrowButton 
                  href="#pricing"
                  className="min-w-[240px]"
                  onClick={() => {
                    const pricingSection = document.getElementById('pricing')
                    pricingSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  View Pricing
                </ArrowButton>
                <ArrowButton
                  href="#benefits"
                  className="min-w-[240px]"
                  onClick={() => {
                    const benefitsSection = document.getElementById('benefits')
                    benefitsSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Learn More
                </ArrowButton>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <FadeInOnScroll>
            <MembershipBenefitsSection />
          </FadeInOnScroll>

          {/* Video/Social Proof Section */}
          <FadeInOnScroll>
            <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-[#F7F5F3]">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-section font-normal mb-6">
                  Real Members, Real Results
                </h2>
                <p className="text-title text-[#605A57] mb-10">
                  Join 500+ boxers from around the world learning and improving together
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-section font-bold text-[#37322F] mb-2">500+</div>
                    <div className="text-sm text-[#605A57]">Active Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-section font-bold text-[#37322F] mb-2">11</div>
                    <div className="text-sm text-[#605A57]">Live Classes/Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-section font-bold text-[#37322F] mb-2">50+</div>
                    <div className="text-sm text-[#605A57]">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-section font-bold text-[#37322F] mb-2">4.9★</div>
                    <div className="text-sm text-[#605A57]">Member Rating</div>
                  </div>
                </div>
              </div>
            </section>
          </FadeInOnScroll>

          {/* Testimonials */}
          <FadeInOnScroll>
            <MembershipTestimonialsSection />
          </FadeInOnScroll>

          {/* Pricing Section */}
          <FadeInOnScroll>
            <div id="pricing">
              <MembershipPricingSection />
            </div>
          </FadeInOnScroll>

          {/* FAQ Section */}
          <FadeInOnScroll>
            <MembershipFAQSection />
          </FadeInOnScroll>

          {/* Final CTA */}
          <FadeInOnScroll>
            <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#37322F] to-[#49423D]">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-section font-normal text-white mb-6">
                  Ready to Start Your Boxing Journey?
                </h2>
                <p className="text-title text-[#E5DDD3] mb-10">
                  Join Oracle Boxing today and start learning from world-class coaches
                </p>
                <ArrowButton 
                  href="#pricing"
                  className="min-w-[240px]"
                  onClick={() => {
                    const pricingSection = document.getElementById('pricing')
                    pricingSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Choose Your Plan
                </ArrowButton>
              </div>
            </section>
          </FadeInOnScroll>

          <FooterSection />
        </main>
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
      </div>
    </div>
  )
}
