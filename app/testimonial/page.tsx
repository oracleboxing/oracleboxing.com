'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import FooterSection from '@/components/footer-section'

const TESTIMONIAL_WEBHOOK_URL = 'https://hook.eu2.make.com/2ik4knuikxwg8xljes2uwo7rdyjdvpj4'

export default function TestimonialPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    testimonial: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { firstName, lastName, email, testimonial } = formData

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !testimonial.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(TESTIMONIAL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          testimonial: testimonial.trim(),
          timestamp: new Date().toISOString(),
          source: 'testimonial-page',
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ firstName: '', lastName: '', email: '', testimonial: '' })
        toast.success('Thank you! Your testimonial has been submitted.')
      } else {
        throw new Error('Failed to submit testimonial')
      }
    } catch (error) {
      console.error('Testimonial submission error:', error)
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
                Share Your Story
              </h1>
              <p className="max-w-[700px] text-center text-[#37322f]/80 text-lg md:text-xl font-medium leading-7 font-sans">
                Your transformation inspires others. Share how Oracle Boxing has impacted your training, confidence, or life.
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
                  Your testimonial has been received. We truly appreciate you sharing your experience with us.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-4 px-8 bg-[#37322F] text-white rounded-full font-semibold text-lg font-sans cursor-pointer hover:bg-[#49423D] transition-colors shadow-[0px_2px_4px_rgba(55,50,47,0.12)]"
                >
                  Submit Another Testimonial
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                        placeholder="John"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                        placeholder="Doe"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                      placeholder="john@example.com"
                      required
                      disabled={isLoading}
                    />
                    <p className="mt-1 text-xs text-[rgba(73,66,61,0.50)] font-sans">
                      Your email will not be shared publicly.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="testimonial" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      Your Testimonial <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="testimonial"
                      name="testimonial"
                      rows={6}
                      value={formData.testimonial}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans resize-none"
                      placeholder="Share your experience with Oracle Boxing... How has it helped your training? What results have you seen?"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.testimonial.trim()}
                    className="w-full py-4 bg-[#37322F] text-white rounded-full font-semibold text-lg font-sans cursor-pointer hover:bg-[#49423D] transition-colors shadow-[0px_2px_4px_rgba(55,50,47,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Testimonial'}
                  </button>
                </form>

                <p className="mt-6 text-xs text-[rgba(73,66,61,0.50)] text-center font-sans">
                  By submitting, you agree that we may use your testimonial on our website and marketing materials.
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
