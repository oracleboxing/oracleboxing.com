import { Metadata } from 'next'
import HomepageHeader from '@/components/HomepageHeader'
import FooterSection from '@/components/footer-section'
import MembershipPricingSection from '@/components/membership/MembershipPricingSection'
import MembershipFAQSection from '@/components/membership/MembershipFAQSection'

export const metadata: Metadata = {
  title: 'Oracle Boxing Pricing - Choose Your Plan',
  description: 'Flexible membership options: $97/month or $897/year. Get daily coaching, complete course access, and community support.',
  openGraph: {
    title: 'Oracle Boxing Pricing',
    description: 'Choose your plan and start mastering boxing today',
    images: [{ url: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp' }],
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <HomepageHeader />
      <div className="flex flex-1 pt-[72px]">
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
        <main className="flex-1 min-w-0">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-16 px-4 md:px-8 bg-gradient-to-b from-[#37322F] to-[#49423D] text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-hero font-normal text-white mb-6">
                Simple, Transparent <span className="text-[#C4B5A0]">Pricing</span>
              </h1>
              <p className="text-title text-[#E5DDD3] max-w-2xl mx-auto">
                Choose the plan that fits your commitment level. Cancel anytime, no hidden fees.
              </p>
            </div>
          </section>

          {/* Pricing Section */}
          <MembershipPricingSection />

          {/* What's Included Overview */}
          <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-[#F7F5F3]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-section font-normal text-center mb-12">
                What's Included in <span className="text-[#9CABA8]">Every Plan</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-sub font-semibold mb-4 text-[#37322F]">
                    Live Coaching
                  </h3>
                  <ul className="space-y-2 text-[#605A57]">
                    <li>• 11 live sessions per week</li>
                    <li>• Expert instruction from Oliver & Toni</li>
                    <li>• All sessions recorded for replay</li>
                    <li>• Q&A and technique breakdowns</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-sub font-semibold mb-4 text-[#37322F]">
                    Complete Curriculum
                  </h3>
                  <ul className="space-y-2 text-[#605A57]">
                    <li>• Boxing from First Principles (26 lessons)</li>
                    <li>• Boxing Roadmap (100+ workouts)</li>
                    <li>• Coaching Recordings Vault (620+ sessions)</li>
                    <li>• New content added weekly</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-sub font-semibold mb-4 text-[#37322F]">
                    Community & Feedback
                  </h3>
                  <ul className="space-y-2 text-[#605A57]">
                    <li>• Private member community (500+ boxers)</li>
                    <li>• Personal video feedback</li>
                    <li>• Direct coach access</li>
                    <li>• Peer support and accountability</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-sub font-semibold mb-4 text-[#37322F]">
                    Flexibility & Support
                  </h3>
                  <ul className="space-y-2 text-[#605A57]">
                    <li>• Train on your schedule</li>
                    <li>• Cancel anytime</li>
                    <li>• 7-day money-back guarantee</li>
                    <li>• Priority support (annual members)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <MembershipFAQSection />

          {/* Final CTA */}
          <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-b from-[#37322F] to-[#49423D] text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-section font-normal text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-title text-[#E5DDD3] mb-8">
                Choose your plan and join 500+ boxers training with Oracle Boxing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/checkout-v2?product=membership-annual"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#37322F] rounded-lg font-semibold hover:bg-[#F7F5F3] transition-colors"
                >
                  Start Annual Plan
                </a>
                <a 
                  href="/checkout-v2?product=membership-monthly"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#37322F] transition-colors"
                >
                  Start Monthly Plan
                </a>
              </div>
            </div>
          </section>

          <FooterSection />
        </main>
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
      </div>
    </div>
  )
}
