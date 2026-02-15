import { Metadata } from 'next'
import HomepageHeader from '@/components/HomepageHeader'
import FooterSection from '@/components/footer-section'
import TeamSection from '@/components/TeamSection'
import { ArrowButton } from '@/components/ui/arrow-button'

export const metadata: Metadata = {
  title: 'About Oracle Boxing - Our Story & Mission',
  description: 'Learn about Oracle Boxing\'s mission to make world-class boxing coaching accessible to everyone through online training.',
  openGraph: {
    title: 'About Oracle Boxing',
    description: 'World-class boxing coaching, accessible to everyone',
    images: [{ url: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp' }],
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <HomepageHeader />
      <div className="flex flex-1 pt-[72px]">
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
        <main className="flex-1 min-w-0">
          {/* Hero Section */}
          <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#37322F] to-[#49423D]">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                World-Class Boxing,<br />
                <span className="text-[#C4B5A0]">Accessible to Everyone</span>
              </h1>
              <p className="text-lg md:text-xl text-[#E5DDD3] max-w-3xl mx-auto leading-relaxed">
                Oracle Boxing was founded on a simple belief: exceptional boxing coaching shouldn't be limited by geography or gym access. We're making world-class instruction available to anyone with dedication and an internet connection.
              </p>
            </div>
          </section>

          {/* Mission Section */}
          <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-normal mb-6" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                    Our <span className="text-[#9CABA8]">Mission</span>
                  </h2>
                  <p className="text-lg text-[#605A57] mb-6 leading-relaxed">
                    Traditional boxing gyms often lack structured curriculum and personalized attention. Many boxers train for years without understanding the fundamentals that make technique truly effective.
                  </p>
                  <p className="text-lg text-[#605A57] mb-6 leading-relaxed">
                    Oracle Boxing bridges this gap by combining the best of in-person coaching with the scalability of online education. Our members get daily access to expert instruction, detailed feedback, and a proven curriculum that breaks down complex movements into learnable fundamentals.
                  </p>
                  <p className="text-lg text-[#605A57] leading-relaxed">
                    We're building a global community where serious boxers can learn, improve, and connect — regardless of where they live or their experience level.
                  </p>
                </div>
                <div className="bg-[#F7F5F3] rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                    By the Numbers
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-4xl font-bold text-[#37322F] mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>500+</div>
                      <div className="text-[#605A57]">Active members training worldwide</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-[#37322F] mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>50+</div>
                      <div className="text-[#605A57]">Countries represented in our community</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-[#37322F] mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>2,500+</div>
                      <div className="text-[#605A57]">Hours of live coaching delivered</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-[#37322F] mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>11</div>
                      <div className="text-[#605A57]">Live coaching sessions every week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Approach Section */}
          <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-[#F7F5F3]">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                  Our <span className="text-[#9CABA8]">Approach</span>
                </h2>
                <p className="text-lg text-[#605A57] max-w-3xl mx-auto">
                  What makes Oracle Boxing different from traditional gyms and other online programs
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-8">
                  <div className="w-12 h-12 bg-[#37322F] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                    Fundamentals First
                  </h3>
                  <p className="text-[#605A57] leading-relaxed">
                    We teach boxing from first principles — breaking down complex movements into fundamental mechanics you can understand and apply.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-8">
                  <div className="w-12 h-12 bg-[#37322F] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                    Personalized Feedback
                  </h3>
                  <p className="text-[#605A57] leading-relaxed">
                    Submit videos and get detailed technical feedback from our coaches. We identify exactly what to improve and how.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-8">
                  <div className="w-12 h-12 bg-[#37322F] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                    Supportive Community
                  </h3>
                  <p className="text-[#605A57] leading-relaxed">
                    Train alongside 500+ dedicated boxers from around the world. Share progress, ask questions, and stay motivated together.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <TeamSection />

          {/* Values Section */}
          <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                  Our <span className="text-[#9CABA8]">Values</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="border-l-4 border-[#37322F] pl-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                    Excellence Through Fundamentals
                  </h3>
                  <p className="text-[#605A57] leading-relaxed">
                    We believe mastery comes from deep understanding of fundamentals, not flashy techniques. We teach the "why" behind every movement.
                  </p>
                </div>

                <div className="border-l-4 border-[#37322F] pl-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                    Accessibility Without Compromise
                  </h3>
                  <p className="text-[#605A57] leading-relaxed">
                    World-class coaching should be available to everyone. We make it accessible online without sacrificing quality or personal attention.
                  </p>
                </div>

                <div className="border-l-4 border-[#37322F] pl-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                    Community Over Competition
                  </h3>
                  <p className="text-[#605A57] leading-relaxed">
                    We foster a supportive environment where members help each other improve. Your progress inspires others, and their progress inspires you.
                  </p>
                </div>

                <div className="border-l-4 border-[#37322F] pl-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                    Continuous Improvement
                  </h3>
                  <p className="text-[#605A57] leading-relaxed">
                    We're constantly refining our curriculum, improving our coaching, and building better learning experiences for our members.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#37322F] to-[#49423D]">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-normal text-white mb-6" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                Join Our Community
              </h2>
              <p className="text-lg text-[#E5DDD3] mb-10">
                Start training with Oracle Boxing today and experience the difference that world-class coaching makes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ArrowButton href="/membership" className="min-w-[240px]">
                  Learn About Membership
                </ArrowButton>
                <ArrowButton href="/pricing" variant="secondary" className="min-w-[240px]">
                  View Pricing
                </ArrowButton>
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
