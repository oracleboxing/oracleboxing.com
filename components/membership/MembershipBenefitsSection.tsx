'use client'

export default function MembershipBenefitsSection() {
  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Daily Live Coaching',
      description: '11 live sessions per week with world-class coaches Oliver and Toni. Master technique, tactics, and mindset.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Complete Course Library',
      description: 'Full access to Boxing from First Principles, Boxing Roadmap, and our entire coaching recordings vault.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Private Community',
      description: 'Join 500+ dedicated boxers from 50+ countries. Share progress, get support, and stay motivated.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      title: 'Personal Video Feedback',
      description: 'Submit your training videos and get detailed technical feedback from our expert coaching team.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Structured Progression',
      description: 'Follow proven training systems from fundamentals to advanced technique. Track your progress and level up.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Flexible Learning',
      description: 'Train on your schedule. All sessions recorded and available to watch anytime, anywhere.',
    },
  ]

  return (
    <section id="benefits" className="w-full py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
            Everything You Need to <span className="text-[#9CABA8]">Master Boxing</span>
          </h2>
          <p className="text-lg text-[#605A57] max-w-3xl mx-auto">
            Oracle Boxing membership gives you complete access to world-class coaching, proven curriculum, and a supportive community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-[#F7F5F3] rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-[#37322F] mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-[#37322F]" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                {benefit.title}
              </h3>
              <p className="text-[#605A57] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* What You'll Learn */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
              What You'll Learn
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#37322F] to-[#49423D] text-white rounded-xl p-8">
              <h4 className="text-xl font-semibold mb-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                Technique & Fundamentals
              </h4>
              <ul className="space-y-2 text-[#E5DDD3]">
                <li>• Perfect stance and balance</li>
                <li>• Powerful, efficient punching mechanics</li>
                <li>• Footwork and movement mastery</li>
                <li>• Defensive techniques and head movement</li>
                <li>• Combination flow and rhythm</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#9CABA8] to-[#B4C4C0] text-white rounded-xl p-8">
              <h4 className="text-xl font-semibold mb-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                Tactics & Mindset
              </h4>
              <ul className="space-y-2">
                <li>• Ring IQ and tactical thinking</li>
                <li>• Reading opponents and patterns</li>
                <li>• Mental game and flow state</li>
                <li>• Conditioning and recovery</li>
                <li>• Sparring preparation and strategy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
