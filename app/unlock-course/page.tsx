'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Header with Logo */}
      <header className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/logos/long_white-large.webp"
              alt="Oracle Boxing"
              width={200}
              height={50}
              className="h-8 w-auto"
              style={{ filter: 'invert(1)' }}
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {!submitted ? (
            <div className="text-center">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Claim your course access
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-700 mb-8">
                Submit your email to receive access to the course you've already purchased.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-black text-white rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Claim Access'}
                </button>
              </form>

              {/* Help Text */}
              <div className="mt-8 text-sm text-gray-600 space-y-2">
                <p>
                  You'll receive an email invitation to join Oracle Boxing Courses.
                  <br />
                  It can take up to 10 minutes to arrive.
                </p>
                <p>
                  Having trouble?{' '}
                  <Link
                    href="mailto:team@oracleboxing.com"
                    className="text-black font-semibold hover:underline"
                  >
                    Contact our support team
                  </Link>{' '}
                  at team@oracleboxing.com
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {/* Success Message */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
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
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Check your email
                </h1>
                <p className="text-lg text-gray-700">
                  We've sent you a course access invitation.
                </p>
              </div>

              {/* Help Text */}
              <div className="mt-8 text-sm text-gray-600 space-y-2">
                <p>
                  It can take up to 10 minutes to arrive.
                </p>
                <p>
                  Having trouble?{' '}
                  <Link
                    href="mailto:team@oracleboxing.com"
                    className="text-black font-semibold hover:underline"
                  >
                    Contact our support team
                  </Link>{' '}
                  at team@oracleboxing.com
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
