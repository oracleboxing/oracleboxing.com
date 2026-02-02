import React from 'react'
import { getSupabaseServerClient } from '@/lib/supabase'
import { questions } from '@/lib/quiz-data'
import { ResultsChart } from '../../components/ResultsChart'
import Link from 'next/link'
import QuizHeader from '../../components/QuizHeader'

export default async function FullResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = getSupabaseServerClient()
  const { data } = await supabase
    .from('quiz_results')
    .select('scores, total, level_name, level_description')
    .eq('id', id)
    .single()

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <p>Results not found. Try retaking the <Link href="/quiz" className="underline">quiz</Link>.</p>
          </div>
        </main>
      </div>
    )
  }

  const { scores, total, level_name, level_description } = data as {
    scores: Record<string, number>
    total: number
    level_name: string
    level_description: string
  }

  // Normalize dimension scores to percentages
  // Calculate max possible per dimension (questions count × 4)
  const counts: Record<string, number> = {}
  questions.forEach((q) => {
    counts[q.category] = (counts[q.category] || 0) + 1
  })
  const chartData = Object.entries(scores).map(([skill, score]) => {
    const max = (counts[skill] || 1) * 4
    const pct = Math.round((score / max) * 100)
    return { skill, score: pct }
  })
  // Sort by percentage for strengths/weaknesses
  const sorted = chartData.slice().sort((a, b) => b.score - a.score)
  const strengths = sorted.slice(0, 3).map((d) => d.skill)
  const weaknesses = sorted.slice(-3).map((d) => d.skill)

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
      <main className="flex-grow px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-10">
          <section className="text-center">
            <div className="inline-block px-4 py-2 bg-[#171717] rounded-full shadow-lg">
              <span className="text-xl font-bold text-[#F5F5F5]">{level_name}</span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold">Your Boxing Profile</h1>
            <p className="mt-2 text-lg text-neutral-600">{level_description}</p>
          </section>
          <section className="bg-white border border-neutral-200 shadow-md p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 text-center">Skill Radar</h2>
            <ResultsChart data={chartData} maxScore={100} />
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strengths.map((s) => (
              <div key={s} className="bg-white border border-neutral-200 shadow-md p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Strength</h3>
                <p>{s}</p>
              </div>
            ))}
            {weaknesses.map((s) => (
              <div key={s} className="bg-white border border-neutral-200 shadow-md p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Improve</h3>
                <p>{s}</p>
              </div>
            ))}
          </section>
          <section className="text-center space-y-4">
            <Link href="/">
              <button className="ob-btn ob-btn-primary px-6 py-3">Ready to level up? Join Oracle Boxing</button>
            </Link>
            <div className="flex justify-center space-x-4 text-neutral-400">
              <button aria-label="Share on Twitter" className="hover:text-neutral-900">
                {/* Social icons */}
                Tweet
              </button>
              <button aria-label="Share on Facebook" className="hover:text-neutral-900">
                Facebook
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
