"use client"
import React, { useState } from 'react'
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

  const q = questions[current]

  const handleAnswer = (id: number, value: number) => {
    setResponses((prev: QuizResponses) => ({ ...prev, [id]: value }))
  }

  const handleNext = async () => {
    if (!responses[q.id]) return
    if (current < total - 1) {
      setCurrent((i) => i + 1)
    } else {
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
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center text-lg font-semibold mb-6">Oracle Boxing Quiz</div>
        <div className="w-full max-w-xl mx-auto">
          <ProgressBar current={current} total={total} />
        </div>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl bg-white border border-neutral-200 shadow-md p-6 rounded-xl mx-auto mt-6"
          >
            <p className="text-sm text-neutral-600 mb-2">
              Question {current + 1} of {total} — {q.category}
            </p>
            <QuizQuestionComponent
              question={q}
              value={responses[q.id]}
              onAnswer={handleAnswer}
            />
            {error && (
              <p className="mt-3 text-red-400 text-sm">{error}</p>
            )}
            <div className="mt-6 flex space-x-4">
              {current > 0 && (
                <button
                  onClick={() => setCurrent((i) => i - 1)}
                  disabled={submitting}
                  className="ob-btn ob-btn-secondary"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!responses[q.id] || submitting}
                className="flex-1 ob-btn ob-btn-primary disabled:opacity-50"
              >
                {current < total - 1 ? 'Next' : submitting ? 'Submitting...' : 'See Results'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
