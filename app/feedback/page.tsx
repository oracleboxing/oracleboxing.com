'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import FooterSection from '@/components/footer-section'

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
    <div className="min-h-screen bg-[#FFFCF5] flex overflow-x-hidden">
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
      <main className="flex-1 min-w-0">

        {/* Hero Section */}
        <section className="relative pt-[120px] md:pt-[160px] pb-16 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4">
            <div className="flex flex-col items-center gap-6">
              <h1 className="max-w-[900px] text-center text-[#37322f] text-4xl md:text-[64px] font-normal leading-tight md:leading-[1.15] font-serif">
                Anonymous Feedback
              </h1>
              <p className="max-w-[700px] text-center text-[#37322f]/80 text-lg md:text-xl font-medium leading-7 font-sans">
                We're always looking to make this community better. If you have any ideas, suggestions, or thoughts on what you'd like to see, please share them below.
              </p>
              <p className="text-sm text-[rgba(73,66,61,0.50)] font-sans">
                All submissions are completely anonymous.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-24 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[600px] mx-auto px-4">
            {submitted ? (
              <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)] text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-[#37322F] text-2xl md:text-3xl font-normal font-serif mb-3">Thank You!</h2>
                <p className="text-[rgba(73,66,61,0.70)] text-base font-sans mb-6">
                  Your feedback has been received. We appreciate you taking the time to help us improve.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-4 px-8 bg-[#37322F] text-white rounded-full font-semibold text-lg font-sans cursor-pointer hover:bg-[#49423D] transition-colors shadow-[0px_2px_4px_rgba(55,50,47,0.12)]"
                >
                  Submit More Feedback
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      Your Feedback
                    </label>
                    <textarea
                      id="feedback"
                      rows={8}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans resize-none"
                      placeholder="Share your ideas, suggestions, or anything you'd like us to know..."
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !feedback.trim()}
                    className="w-full py-4 bg-[#37322F] text-white rounded-full font-semibold text-lg font-sans cursor-pointer hover:bg-[#49423D] transition-colors shadow-[0px_2px_4px_rgba(55,50,47,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>

                <p className="mt-6 text-xs text-[rgba(73,66,61,0.50)] text-center font-sans">
                  We read every piece of feedback. Your input helps shape the future of Oracle Boxing.
                </p>
              </div>
            )}
          </div>
        </section>

        <FooterSection />
      </main>
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
    </div>
  )
}
