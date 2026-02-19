'use client'

import { useState } from 'react'

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
    weeklyTarget: 2,
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
        setFormData({ name: '', email: '', weeklyTarget: 2 })
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <h1 className="text-title font-semibold text-[#37322F] font-sans">Progress Tracker</h1>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {submitted ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-[#37322F] text-title font-semibold font-sans">Request Received</h2>
                <p className="text-gray-500 text-body font-sans">Check your inbox for next steps.</p>
              </div>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-body text-gray-500 hover:text-[#37322F] font-sans underline"
            >
              Submit another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] bg-white text-[#37322F] font-sans text-body ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-body text-red-600 font-sans">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] bg-white text-[#37322F] font-sans text-body ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="john@example.com"
                  required
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-body text-red-600 font-sans">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Row 2: Weekly Target */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weeklyTarget" className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">
                  Weekly Live Call Target
                </label>
                <input
                  type="number"
                  id="weeklyTarget"
                  name="weeklyTarget"
                  value={formData.weeklyTarget}
                  onChange={handleChange}
                  min={1}
                  max={7}
                  className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] bg-white text-[#37322F] font-sans text-body ${
                    errors.weeklyTarget ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-400 font-sans">
                  Calls per week (1-7)
                </p>
                {errors.weeklyTarget && (
                  <p className="mt-1 text-body text-red-600 font-sans">{errors.weeklyTarget}</p>
                )}
              </div>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-body text-red-700 font-sans">{serverError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto h-12 px-8 bg-[#007AFF] text-white rounded-lg font-semibold text-body font-sans cursor-pointer hover:bg-[#0066DD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Start Tracking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
