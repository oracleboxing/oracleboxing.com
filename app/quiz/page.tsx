import Link from 'next/link'
import type { Metadata } from 'next'
import QuizHeader from './components/QuizHeader'

export const metadata: Metadata = {
  title: "What's Your Boxing Level? | Oracle Boxing",
  description: 'Take our free 2-minute quiz to discover your boxing skill level and get a personalized training plan.',
}

export default function QuizLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl text-center">
          <span className="uppercase text-sm text-neutral-400 tracking-wider">Free Assessment</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold">What&apos;s Your Boxing Level?</h1>
          <p className="mt-4 text-lg sm:text-xl text-neutral-400">Take our quick 10-question quiz to discover your boxing skill across 6 dimensions.</p>
          <div className="mt-6 flex justify-center">
            <div className="text-5xl">🥊</div>
          </div>
          <ul className="mt-6 space-y-2 text-left list-disc list-inside">
            <li>Personalized skill breakdown</li>
            <li>Identify your strengths &amp; weaknesses</li>
            <li>Get a custom training recommendation</li>
          </ul>
          <p className="mt-6 text-neutral-400">Join thousands of boxers who&apos;ve discovered their level</p>
          <Link
            href="/quiz/take"
            className="mt-8 ob-btn ob-btn-primary px-8 py-3 text-lg inline-block"
          >
            Start the Quiz
          </Link>
        </div>
      </main>
      <footer className="text-center py-4 text-neutral-600">
        <Link href="/">Oracle Boxing</Link>
      </footer>
    </div>
  )
}
