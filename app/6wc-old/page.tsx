'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import WistiaVideo from '@/components/WistiaVideo'
import { sendChallengeSignup } from '@/lib/simple-webhook'

export default function ChallengeComingSoonPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Countdown to November 23, 2025
  useEffect(() => {
    const targetDate = new Date('2025-11-23T00:00:00+00:00')

    const updateCountdown = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await sendChallengeSignup({
        firstName,
        lastName,
        email
      })
      setSubmitSuccess(true)
      setFirstName('')
      setLastName('')
      setEmail('')
    } catch (error) {
      console.error('Signup error:', error)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />

      {/* VSL Video */}
      <section className="pt-6 sm:pt-8 lg:pt-12 pb-6 sm:pb-8 lg:pb-12 bg-white">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <WistiaVideo />
        </div>
      </section>

      {/* Two-Column Challenge Section */}
      <section className="pt-6 sm:pt-8 lg:pt-12 pb-6 sm:pb-8 lg:pb-12 bg-white border-b border-gray-200">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Side - Image with Countdown */}
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl mb-6">
                <img
                  src="https://media.oracleboxing.com/Website/skool_art.webp"
                  alt="6-Week Challenge"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Countdown Timer */}
              <div className="bg-white border-4 border-black rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="text-sm sm:text-base font-bold uppercase tracking-wide mb-4 text-center">
                  OPENS IN:
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm uppercase opacity-80">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm uppercase opacity-80">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm uppercase opacity-80">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm uppercase opacity-80">Seconds</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content and Signup Form */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-100 text-black border border-gray-300 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider">
                Temporarily Closed
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Satoshi' }}>
                Six Week Challenge
              </h2>

              {/* Description */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                  Temporarily closed due to high demand
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Reopening November 23rd
                </p>
              </div>

              {/* Signup Form */}
              <div className="max-w-xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ fontFamily: 'Satoshi' }}>
                  For Guaranteed Access
                </h3>

                <p className="text-sm sm:text-base text-gray-700 mb-6">
                  Please enter your details below and we'll send you an email with an invitation before November 23rd
                </p>

                {!submitSuccess ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-bold text-gray-900 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-bold text-gray-900 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="john@example.com"
                      />
                    </div>

                    {submitError && (
                      <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg text-red-700 text-sm">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-8 bg-yellow-100 text-black border-4 border-black font-black text-xl rounded-xl uppercase tracking-wide shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'Satoshi' }}
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'SECURE MY SPOT'}
                    </button>
                  </form>
                ) : (
                  <div className="p-6 sm:p-8 bg-green-50 border-4 border-green-500 rounded-2xl text-center">
                    <div className="text-4xl mb-4">✓</div>
                    <h4 className="text-xl sm:text-2xl font-bold text-green-900 mb-2" style={{ fontFamily: 'Satoshi' }}>
                      You're on the list!
                    </h4>
                    <p className="text-base sm:text-lg text-green-800">
                      We'll email you an invitation before November 23rd
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Purchase Options */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'Satoshi' }}>
              Can't Wait Until November 23rd?
            </h3>

            <p className="text-base sm:text-lg text-gray-700 mb-8">
              Alternatively, you can purchase the courses for life or buy the full access membership here
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
              <a
                href="/"
                className="py-4 px-6 bg-yellow-100 text-black border-4 border-black font-black text-lg rounded-xl uppercase tracking-wide shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all duration-200 flex items-center justify-center"
                style={{ fontFamily: 'Satoshi' }}
              >
                Oracle Boxing Bundle →
              </a>

              <a
                href="/"
                className="py-4 px-6 bg-yellow-100 text-black border-4 border-black font-black text-lg rounded-xl uppercase tracking-wide shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all duration-200 flex items-center justify-center"
                style={{ fontFamily: 'Satoshi' }}
              >
                Full Access Membership →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
