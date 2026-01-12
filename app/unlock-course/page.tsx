'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FooterSection from '@/components/footer-section'

export default function ClaimAccessPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/claim-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Something went wrong. Please try again or contact support.')
      }
    } catch (error) {
      alert('Something went wrong. Please try again or contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
      <main className="flex-1 min-w-0">

        {/* Hero Section */}
        <section className="relative pt-[120px] md:pt-[160px] pb-16 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4">
            <div className="flex flex-col items-center gap-6">
              <h1 className="max-w-[900px] text-center text-[#37322f] text-4xl md:text-[64px] font-normal leading-tight md:leading-[1.15] font-serif">
                {submitted ? 'Check your email' : 'Claim your course access'}
              </h1>
              <p className="max-w-[700px] text-center text-[#37322f]/80 text-lg md:text-xl font-medium leading-7 font-sans">
                {submitted
                  ? "We've sent you a course access invitation."
                  : "Submit your email to receive access to the course you've already purchased."
                }
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-24 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[500px] mx-auto px-4">
            {!submitted ? (
              <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#37322F] text-white rounded-full font-semibold text-lg font-sans cursor-pointer hover:bg-[#49423D] transition-colors shadow-[0px_2px_4px_rgba(55,50,47,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Claim Access'}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[rgba(55,50,47,0.08)]">
                  <p className="text-sm text-[rgba(73,66,61,0.70)] text-center font-sans">
                    You'll receive an email invitation to join Oracle Boxing Courses.
                    <br />
                    It can take up to 10 minutes to arrive.
                  </p>
                  <p className="text-sm text-[rgba(73,66,61,0.70)] text-center font-sans mt-4">
                    Having trouble?{' '}
                    <Link
                      href="mailto:team@oracleboxing.com"
                      className="text-[#37322F] font-semibold hover:underline"
                    >
                      Contact our support team
                    </Link>{' '}
                    at team@oracleboxing.com
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)] text-center">
                <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div className="mt-8 pt-8 border-t border-[rgba(55,50,47,0.08)]">
                  <p className="text-sm text-[rgba(73,66,61,0.70)] font-sans">
                    It can take up to 10 minutes to arrive.
                  </p>
                  <p className="text-sm text-[rgba(73,66,61,0.70)] font-sans mt-4">
                    Having trouble?{' '}
                    <Link
                      href="mailto:team@oracleboxing.com"
                      className="text-[#37322F] font-semibold hover:underline"
                    >
                      Contact our support team
                    </Link>{' '}
                    at team@oracleboxing.com
                  </p>
                </div>
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
