import Link from 'next/link'
import type { Metadata } from 'next'
import QuizHeader from './components/QuizHeader'

export const metadata: Metadata = {
  title: "What's Your Boxing Level? | Free 2-Minute Quiz | Oracle Boxing",
  description: 'Take our free 2-minute quiz to discover your boxing skill level across 6 dimensions and get personalised training recommendations.',
  openGraph: {
    title: "What's Your Boxing Level?",
    description: 'Free 2-minute boxing assessment. Discover your skill level across Technique, Movement, Defense, Offense, Ring IQ & Training Habits.',
    type: 'website',
  },
}

export default function QuizLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />

      <main className="flex-grow">
        {/* Hero */}
        <section className="px-4 pt-12 pb-8 sm:pt-16 sm:pb-12">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-sm uppercase tracking-wider text-neutral-500 font-medium mb-3">Free 2-Minute Assessment</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              What&apos;s Your<br />Boxing Level?
            </h1>
            <p className="mt-4 text-lg text-neutral-600 max-w-md mx-auto leading-relaxed">
              10 questions. 6 skill dimensions. One honest look at where you really stand — and what to work on next.
            </p>
            <Link
              href="/quiz/take"
              className="mt-8 ob-btn ob-btn-primary px-10 py-3.5 text-lg inline-flex items-center gap-2"
            >
              Take the Quiz
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="mt-3 text-sm text-neutral-400">Takes less than 2 minutes · No sign-up required</p>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-8">
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 sm:gap-8">
              {[
                { step: '1', label: 'Answer 10 questions' },
                { step: '2', label: 'Get your skill radar' },
                { step: '3', label: 'See what to work on' },
              ].map((item, i) => (
                <div key={item.step} className="flex items-center gap-3 sm:flex-col sm:text-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">{item.label}</span>
                  {i < 2 && <span className="hidden sm:block text-neutral-300 ml-4">→</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You'll Get */}
        <section className="px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">What You&apos;ll Discover</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold mb-1">Skill Radar</h3>
                <p className="text-sm text-neutral-600">See how you score across Technique, Movement, Defense, Offense, Ring IQ &amp; Training Habits</p>
              </div>
              <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold mb-1">Your Weak Spots</h3>
                <p className="text-sm text-neutral-600">Find out exactly which areas are holding you back — and get specific advice to fix them</p>
              </div>
              <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="font-semibold mb-1">Your Next Step</h3>
                <p className="text-sm text-neutral-600">Get a personalised recommendation for how to level up based on where you are right now</p>
              </div>
            </div>
          </div>
        </section>

        {/* The 4 Levels */}
        <section className="px-4 py-10 bg-white border-y border-neutral-200">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">4 Levels of Boxing</h2>
            <p className="text-center text-neutral-500 mb-8">Which one are you?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Foundation', emoji: '🥊', desc: 'Building the basics', color: '#6B7280' },
                { name: 'Developing', emoji: '🥊', desc: 'Closing the gaps', color: '#D97706' },
                { name: 'Fighter', emoji: '🔥', desc: 'Ring-ready skills', color: '#DC2626' },
                { name: 'Ring General', emoji: '👑', desc: 'Tactical mastery', color: '#7C3AED' },
              ].map((level) => (
                <div key={level.name} className="rounded-xl border border-neutral-200 p-4 text-center transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div className="text-2xl mb-2">{level.emoji}</div>
                  <p className="font-bold text-sm" style={{ color: level.color }}>{level.name}</p>
                  <p className="text-xs text-neutral-500 mt-1">{level.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="px-4 py-10">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-sm text-neutral-400 mb-6 uppercase tracking-wider font-medium">Trusted by boxers worldwide</p>
            <div className="flex justify-center gap-8 sm:gap-12 text-center">
              <div>
                <p className="text-3xl font-bold text-neutral-900">2,400+</p>
                <p className="text-sm text-neutral-500">Quizzes taken</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">6</p>
                <p className="text-sm text-neutral-500">Skill dimensions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">2 min</p>
                <p className="text-sm text-neutral-500">To complete</p>
              </div>
            </div>

            {/* CTA repeat */}
            <Link
              href="/quiz/take"
              className="mt-10 ob-btn ob-btn-primary px-10 py-3.5 text-lg inline-flex items-center gap-2"
            >
              Find Out Your Level
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-sm text-neutral-400 border-t border-neutral-200">
        <Link href="/" className="hover:text-neutral-600 transition-colors">oracleboxing.com</Link>
      </footer>
    </div>
  )
}
