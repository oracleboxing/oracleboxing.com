import React from 'react'
import type { Metadata } from 'next'
import { getSupabaseServerClient } from '@/lib/supabase'
import { questions, levels, dimensionDescriptions } from '@/lib/quiz-data'
import { ResultsChart } from '../../components/ResultsChart'
import Link from 'next/link'
import QuizHeader from '../../components/QuizHeader'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = getSupabaseServerClient()
  const { data } = await supabase
    .from('quiz_results')
    .select('total, level_name')
    .eq('id', id)
    .single()

  if (!data) {
    return { title: 'Quiz Results | Oracle Boxing' }
  }

  const levelInfo = levels.find((lv) => lv.name === data.level_name || data.level_name.includes(lv.name))
  const levelName = levelInfo?.name || data.level_name

  return {
    title: `${levelName} — Boxing Level Quiz Results | Oracle Boxing`,
    description: `I scored ${data.total}/40 on the Oracle Boxing quiz. My boxing level: ${levelName}. Take the quiz to find out yours!`,
    openGraph: {
      title: `I'm a "${levelName}" — What's Your Boxing Level?`,
      description: `Scored ${data.total}/40 across Technique, Movement, Defense, Offense, Ring IQ & Training Habits. Take the free 2-minute quiz!`,
      type: 'website',
    },
  }
}

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

  const { scores, total, level_name } = data as {
    scores: Record<string, number>
    total: number
    level_name: string
    level_description: string
  }

  // Find the matching level from our data
  // Support old format "Level X – Name" and new format "Name"
  const level = levels.find((lv) => lv.name === level_name || level_name.includes(lv.name)) 
    || levels.find((lv) => total >= lv.min && total <= lv.max)
    || levels[0]

  // Normalize dimension scores to percentages
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
  const topStrength = sorted[0]
  const topWeakness = sorted[sorted.length - 1]

  // Get dimension feedback based on percentage score
  function getDimensionFeedback(skill: string, pct: number): string {
    const dim = dimensionDescriptions[skill]
    if (!dim) return ''
    if (pct <= 33) return dim.low
    if (pct <= 66) return dim.mid
    return dim.high
  }

  // Overall percentage
  const overallPct = Math.round((total / 40) * 100)

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
      <main className="flex-grow px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Level Badge & Score */}
          <section className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg" style={{ backgroundColor: level.color }}>
              <span className="text-xl">{level.emoji}</span>
              <span className="text-lg font-bold text-white">{level.name}</span>
            </div>
            <h1 className="mt-5 text-3xl sm:text-4xl font-bold">Your Boxing Profile</h1>
            <p className="mt-1 text-sm text-neutral-500">Score: {total}/40 ({overallPct}%)</p>
            <p className="mt-3 text-lg text-neutral-600 max-w-lg mx-auto leading-relaxed">{level.description}</p>
          </section>

          {/* Radar Chart */}
          <section className="bg-white border border-neutral-200 shadow-sm p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-1 text-center">Your Skill Radar</h2>
            <p className="text-sm text-neutral-500 text-center mb-4">How you scored across 6 boxing dimensions</p>
            <ResultsChart data={chartData} maxScore={100} />
          </section>

          {/* Strengths & Weaknesses Highlights */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-neutral-200 shadow-sm p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💪</span>
                <h3 className="text-lg font-semibold">Biggest Strength</h3>
              </div>
              <p className="text-xl font-bold" style={{ color: level.color }}>{topStrength.skill}</p>
              <p className="text-sm text-neutral-500 mt-1">{topStrength.score}% — This is where you shine</p>
            </div>
            <div className="bg-white border border-neutral-200 shadow-sm p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <h3 className="text-lg font-semibold">Focus Area</h3>
              </div>
              <p className="text-xl font-bold text-neutral-700">{topWeakness.skill}</p>
              <p className="text-sm text-neutral-500 mt-1">{topWeakness.score}% — Biggest room for growth</p>
            </div>
          </section>

          {/* Detailed Advice */}
          <section className="bg-white border border-neutral-200 shadow-sm p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-3">What This Means For You</h2>
            <p className="text-neutral-700 leading-relaxed">{level.detailedAdvice}</p>
          </section>

          {/* Dimension Breakdown */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Dimension Breakdown</h2>
            {sorted.map((dim) => {
              const feedback = getDimensionFeedback(dim.skill, dim.score)
              const dimInfo = dimensionDescriptions[dim.skill]
              return (
                <details key={dim.skill} className="bg-white border border-neutral-200 shadow-sm rounded-xl overflow-hidden group">
                  <summary className="p-4 cursor-pointer flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{dimInfo?.name || dim.skill}</span>
                      <span className="text-sm text-neutral-500">{dim.score}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Mini bar */}
                      <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${dim.score}%`, backgroundColor: level.color }}
                        />
                      </div>
                      <svg className="w-4 h-4 text-neutral-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-4 pb-4 pt-1 border-t border-neutral-100">
                    <p className="text-neutral-600 text-sm leading-relaxed">{feedback}</p>
                  </div>
                </details>
              )
            })}
          </section>

          {/* Primary CTA */}
          <section className="bg-[#171717] text-[#F5F5F5] p-6 sm:p-8 rounded-xl text-center">
            <p className="text-sm uppercase tracking-wider text-neutral-400 mb-2">Recommended For You</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{level.ctaText}</h2>
            <p className="text-neutral-300 max-w-md mx-auto mb-6 leading-relaxed text-sm sm:text-base">{level.ctaDescription}</p>
            <Link
              href={level.ctaUrl}
              className="ob-btn inline-flex items-center gap-2 bg-white text-[#171717] font-bold px-8 py-3 text-lg hover:bg-neutral-100 transition-colors"
            >
              {level.ctaText}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>

          {/* Retake & Share */}
          <section className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 pb-4">
            <Link href="/quiz" className="ob-btn ob-btn-outline px-6 py-2.5 text-sm">
              Retake Quiz
            </Link>
            <ShareButton total={total} levelName={level.name} />
          </section>

        </div>
      </main>
    </div>
  )
}

function ShareButton({ total, levelName }: { total: number; levelName: string }) {
  const shareText = `I scored ${total}/40 on the Oracle Boxing quiz — I'm a "${levelName}"! What's your boxing level?`
  const shareUrl = 'https://oracleboxing.com/quiz'
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`

  return (
    <a
      href={twitterUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="ob-btn ob-btn-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Share Result
    </a>
  )
}
