"use client"
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EmailCaptureForm } from '../components/EmailCaptureForm'
import Link from 'next/link'
import QuizHeader from '../components/QuizHeader'
import { questions } from '@/lib/quiz-data'

interface TeaserData {
  level_name: string;
  total: number;
  scores: Record<string, number>;
}

// Calculate max score per dimension from actual questions
const dimMaxScores: Record<string, number> = {}
questions.forEach((q) => {
  dimMaxScores[q.category] = (dimMaxScores[q.category] || 0) + 4
})

export default function ResultsTeaserClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()
  const [teaser, setTeaser] = useState<TeaserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    fetch(`/api/quiz/results/${id}`)
      .then(res => res.json())
      .then(data => {
        setTeaser({ level_name: data.level_name, total: data.total, scores: data.scores })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
        <QuizHeader />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <p>Please complete the <Link href="/quiz" className="underline">quiz</Link> first.</p>
          </div>
        </main>
      </div>
    )
  }

  const handleCapture = async (name: string, email: string) => {
    await fetch('/api/quiz/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, email }),
    })
    router.push(`/quiz/results/${id}`)
  }

  const levelEmoji: Record<string, string> = {
    'Foundation': '🥊',
    'Developing': '🥊',
    'Fighter': '🔥',
    'Ring General': '👑',
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full mx-4">
          {/* Results Preview (blurred) */}
          <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-6 mb-6 relative overflow-hidden">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-neutral-100 rounded w-2/3 mx-auto" />
                <div className="h-48 bg-neutral-100 rounded" />
              </div>
            ) : teaser ? (
              <>
                {/* Level reveal */}
                <div className="text-center mb-4">
                  <span className="text-3xl">{levelEmoji[teaser.level_name] || '🥊'}</span>
                  <h2 className="text-2xl font-bold mt-2">You&apos;re a <span className="text-neutral-900">{teaser.level_name}</span></h2>
                  <p className="text-sm text-neutral-500 mt-1">Score: {teaser.total}/40</p>
                </div>

                {/* Blurred radar preview */}
                <div className="relative">
                  <div className="blur-[6px] pointer-events-none select-none">
                    <div className="space-y-2.5">
                      {Object.entries(teaser.scores).map(([skill, score]) => {
                        const maxPerDim = dimMaxScores[skill] || 8
                        const pct = Math.round((score / maxPerDim) * 100)
                        return (
                          <div key={skill} className="flex items-center gap-3">
                            <span className="text-xs font-medium text-neutral-700 w-24 text-right">{skill}</span>
                            <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                              <div className="h-full bg-neutral-800 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-neutral-500 w-8">{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-neutral-100 rounded w-full" />
                      <div className="h-4 bg-neutral-100 rounded w-5/6" />
                      <div className="h-4 bg-neutral-100 rounded w-4/5" />
                    </div>
                  </div>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-neutral-200">
                      <p className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Unlock your full breakdown below
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Email Capture Card */}
          <div className="bg-white border border-neutral-200 shadow-sm p-6 rounded-xl text-center">
            <h3 className="text-xl font-bold mb-1">Get Your Full Results</h3>
            <p className="text-neutral-500 text-sm mb-5">
              Unlock your personalised skill radar, dimension breakdown, and tailored training recommendations.
            </p>
            <EmailCaptureForm onSubmit={handleCapture} />
            <p className="mt-3 text-xs text-neutral-400">We&apos;ll also send you tips to improve your weakest areas. No spam, ever.</p>
          </div>

          {/* Skip option */}
          <div className="text-center mt-4">
            <button
              onClick={() => router.push(`/quiz/results/${id}`)}
              className="text-sm text-neutral-400 hover:text-neutral-600 underline transition-colors"
            >
              Skip — view results without saving
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
