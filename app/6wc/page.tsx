'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
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

  const testimonials = [
    {
      name: "Niclas Laux",
      role: "Founder of Samurai Movement Academy, BJJ Purple Belt, Self-Defense Instructor",
      image: "https://media.oracleboxing.com/webp/Website/niclas.webp",
      quote: "This course showed me where my power comes from. I can't thank you enough for helping me box better! It was the best choice I ever made - the \"aha!\" moments are amazing!"
    },
    {
      name: "Torey Goodall",
      role: "Community Member & Boxing Enthusiast",
      image: "https://media.oracleboxing.com/webp/Website/torey.webp",
      quote: "I came back to this community and already made big progress on Toni and Oliver's Zoom calls. I have to say - you guys are really good at coaching online. I learn so much about boxing technique every time I join a call."
    },
    {
      name: "Balal Hanif",
      role: "Community Member & Boxing Enthusiast",
      image: "https://media.oracleboxing.com/webp/Website/balal.webp",
      quote: "Being part of this community has changed my life. Joining the live Zoom calls almost every day has helped me lose weight, box better, and feel more confident. The help, support, and friendship here have made a real difference in how I box."
    }
  ]

  return (
    <>
      <Header />

      {/* Hero with VSL */}
      <HeroSection
        onOpenPricing={() => {}}
      />

      {/* Reopening Notice with Countdown */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black text-white">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'Satoshi' }}>
            Temporarily Closed Due to High Demand
          </h2>

          <p className="text-xl sm:text-2xl lg:text-3xl mb-8 sm:mb-12 text-yellow-100 font-bold" style={{ fontFamily: 'Satoshi' }}>
            Reopening November 23rd for Guaranteed Access
          </p>

          {/* Countdown Timer */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white text-black rounded-2xl p-6 sm:p-8">
              <div className="text-sm sm:text-base font-bold uppercase tracking-wide mb-4">
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
        </div>
      </section>

      {/* Email Signup Form */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6" style={{ fontFamily: 'Satoshi' }}>
              Get Notified When We Reopen
            </h3>

            <p className="text-base sm:text-lg text-gray-700 text-center mb-8">
              Sign up here to receive an email notification when the Six Week Challenge reopens on November 23rd
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
                  {isSubmitting ? 'SUBMITTING...' : 'NOTIFY ME →'}
                </button>
              </form>
            ) : (
              <div className="p-6 sm:p-8 bg-green-50 border-4 border-green-500 rounded-2xl text-center">
                <div className="text-4xl mb-4">✓</div>
                <h4 className="text-xl sm:text-2xl font-bold text-green-900 mb-2" style={{ fontFamily: 'Satoshi' }}>
                  You're on the list!
                </h4>
                <p className="text-base sm:text-lg text-green-800">
                  We'll email you when the challenge opens on November 23rd
                </p>
              </div>
            )}
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

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="w-full lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16" style={{ fontFamily: 'Satoshi' }}>
            What Our Members Say
          </h3>

          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border-4 border-black rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0 border-2 border-black"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-xl sm:text-2xl text-black mb-1" style={{ fontFamily: 'Satoshi' }}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 mb-4">
                      {testimonial.role}
                    </div>
                    <blockquote className="text-base sm:text-lg text-gray-900 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
