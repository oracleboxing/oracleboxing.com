"use client"
import React, { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import QuizHeader from '../components/QuizHeader'
import { questions } from '@/lib/quiz-data'
import { QuizResponses } from '@/lib/quiz-types'
import { QuizQuestionComponent } from '../components/QuizQuestion'
import { ProgressBar } from '../components/ProgressBar'

export default function QuizTakePage() {
  const router = useRouter()
  const total = questions.length
  const [current, setCurrent] = useState(0)
  const [responses, setResponses] = useState<QuizResponses>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const q = questions[current]

  const goForward = useCallback(async () => {
    if (current < total - 1) {
      setDirection(1)
      setCurrent((i) => i + 1)
    } else {
      // Submit
      setSubmitting(true)
      setError(null)
      try {
        const res = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responses }),
        })
        if (!res.ok) throw new Error('Failed to submit quiz')
        const json = await res.json()
        router.push(`/quiz/results?id=${json.id}`)
      } catch {
        setError('Something went wrong. Please try again.')
        setSubmitting(false)
      }
    }
  }, [current, total, responses, router])

  const handleAnswer = useCallback((id: number, value: number) => {
    setResponses((prev: QuizResponses) => {
      const next = { ...prev, [id]: value }
      return next
    })

    // Auto-advance after a short delay for better UX
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
    autoAdvanceTimer.current = setTimeout(() => {
      if (current < total - 1) {
        setDirection(1)
        setCurrent((i) => i + 1)
      }
    }, 500)
  }, [current, total])

  const goBack = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
    setDirection(-1)
    setCurrent((i) => i - 1)
  }, [])

  const isLastQuestion = current === total - 1
  const hasAnswer = !!responses[q.id]

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
      <main className="flex-grow flex flex-col items-center px-4 py-6 sm:py-10">
        {/* Progress section */}
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-500 font-medium">
              Question {current + 1} of {total}
            </span>
            <span className="text-sm text-neutral-400">
              {Math.round(((current + (hasAnswer ? 1 : 0)) / total) * 100)}% complete
            </span>
          </div>
          <ProgressBar current={current + (hasAnswer ? 1 : 0)} total={total} />
        </div>

        {/* Question card */}
        <div className="w-full max-w-xl mt-4 sm:mt-6 relative" style={{ minHeight: '320px' }}>
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={q.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full bg-white border border-neutral-200 shadow-sm p-5 sm:p-6 rounded-xl"
            >
              <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-medium">
                {q.category}
              </p>
              <QuizQuestionComponent
                question={q}
                value={responses[q.id]}
                onAnswer={handleAnswer}
              />

              {error && (
                <p className="mt-3 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <div className="mt-5 flex gap-3">
                {current > 0 && (
                  <button
                    onClick={goBack}
                    disabled={submitting}
                    className="ob-btn ob-btn-secondary px-5"
                  >
                    ← Back
                  </button>
                )}
                {isLastQuestion && (
                  <button
                    onClick={goForward}
                    disabled={!hasAnswer || submitting}
                    className="flex-1 ob-btn ob-btn-primary disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Calculating...
                      </span>
                    ) : (
                      'See My Results →'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
