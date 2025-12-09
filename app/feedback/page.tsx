'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { toast } from 'sonner'

const FEEDBACK_WEBHOOK_URL = 'https://hook.eu2.make.com/pf28dwgf6kfn106vn4vkwygq37xsqlxi'

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedback.trim()) {
      toast.error('Please enter your feedback')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(FEEDBACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          timestamp: new Date().toISOString(),
          source: 'feedback-page',
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setFeedback('')
        toast.success('Thank you! Your feedback has been submitted.')
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Feedback submission error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Anonymous Feedback
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              We're always looking to make this community better. If you have any ideas, suggestions, or thoughts on what you'd like to see, please share them below.
            </p>
            <p className="text-sm text-gray-500 mt-3">
              All submissions are completely anonymous.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your feedback has been received. We appreciate you taking the time to help us improve.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="ob-btn ob-btn-primary"
              >
                Submit More Feedback
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-900 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    rows={8}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                    placeholder="Share your ideas, suggestions, or anything you'd like us to know..."
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !feedback.trim()}
                  className="w-full ob-btn ob-btn-primary ob-btn-large disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>

              <p className="mt-6 text-xs text-gray-500 text-center">
                We read every piece of feedback. Your input helps shape the future of Oracle Boxing.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
