'use client'

import { useState } from 'react'
import FooterSection from '@/components/footer-section'

interface FormErrors {
  name?: string
  email?: string
  weeklyTarget?: string
}

export default function ProgressTrackerPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weeklyTarget: 4,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate name
    const trimmedName = formData.name.trim()
    if (!trimmedName) {
      newErrors.name = 'Full name is required'
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (trimmedName.length > 60) {
      newErrors.name = 'Name must be 60 characters or less'
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const trimmedEmail = formData.email.trim()
    if (!trimmedEmail) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate weeklyTarget
    if (formData.weeklyTarget < 1 || formData.weeklyTarget > 7) {
      newErrors.weeklyTarget = 'Weekly target must be between 1 and 7'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }))
    // Clear field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    // Clear server error
    if (serverError) {
      setServerError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/progress-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          weeklyTarget: formData.weeklyTarget,
        }),
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', weeklyTarget: 4 })
      } else {
        setServerError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Progress tracker submission error:', error)
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
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
                Progress Tracker
              </h1>
              <p className="max-w-[700px] text-center text-[#37322f]/80 text-lg md:text-xl font-medium leading-7 font-sans">
                Set your weekly live call target and we'll help you stay accountable to your training goals.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-24 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[500px] mx-auto px-4">
            {submitted ? (
              <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)] text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-[#37322F] text-2xl md:text-3xl font-normal font-serif mb-3">Tracker Request Received</h2>
                <p className="text-[rgba(73,66,61,0.70)] text-base font-sans">
                  Check your inbox shortly for next steps.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)]">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans ${
                        errors.name ? 'border-red-500' : 'border-[rgba(55,50,47,0.12)]'
                      }`}
                      placeholder="John Doe"
                      required
                      disabled={isLoading}
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600 font-sans">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans ${
                        errors.email ? 'border-red-500' : 'border-[rgba(55,50,47,0.12)]'
                      }`}
                      placeholder="john@example.com"
                      required
                      disabled={isLoading}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600 font-sans">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Weekly Target */}
                  <div>
                    <label htmlFor="weeklyTarget" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      Weekly Live Call Target <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="weeklyTarget"
                      name="weeklyTarget"
                      value={formData.weeklyTarget}
                      onChange={handleChange}
                      min={1}
                      max={7}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans ${
                        errors.weeklyTarget ? 'border-red-500' : 'border-[rgba(55,50,47,0.12)]'
                      }`}
                      required
                      disabled={isLoading}
                      aria-invalid={errors.weeklyTarget ? 'true' : 'false'}
                      aria-describedby={errors.weeklyTarget ? 'target-error' : 'target-hint'}
                    />
                    <p id="target-hint" className="mt-1 text-sm text-[rgba(73,66,61,0.50)] font-sans">
                      How many live calls do you want to attend each week? (1-7)
                    </p>
                    {errors.weeklyTarget && (
                      <p id="target-error" className="mt-1 text-sm text-red-600 font-sans">
                        {errors.weeklyTarget}
                      </p>
                    )}
                  </div>

                  {/* Server Error */}
                  {serverError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-700 font-sans">{serverError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#37322F] text-white rounded-full font-semibold text-lg font-sans cursor-pointer hover:bg-[#49423D] transition-colors shadow-[0px_2px_4px_rgba(55,50,47,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Submitting...' : 'Start Tracking'}
                  </button>
                </form>
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
