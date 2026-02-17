'use client'

import { useState } from 'react'
import { ChevronDown, Mail, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_MAKE_CONTACT_WEBHOOK!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          timestamp: new Date().toISOString(),
          source: 'contact-page',
        }),
      })

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Something went wrong. Please try again or email us directly at team@oracleboxing.com')
    } finally {
      setIsLoading(false)
    }
  }

  const faqs = [
    // Refunds & Billing
    {
      category: 'Refunds & Billing',
      question: "Do you offer refunds?",
      answer: "No. All digital courses, add-ons, and memberships are non-refundable. Physical products (like the tracksuit) cannot be returned. The 21-Day Challenge includes a prize opportunity for those who complete the requirements - this is at the team's discretion."
    },
    {
      category: 'Refunds & Billing',
      question: "How do I cancel my membership?",
      answer: "Go to oracleboxing.com/customer-portal to manage your subscription. You can cancel anytime, but cancellations must be made before your next billing date to avoid being charged. You'll keep access until the end of your paid period."
    },
    {
      category: 'Refunds & Billing',
      question: "How do I update my payment method?",
      answer: "Visit oracleboxing.com/customer-portal to update your card or payment method, view invoices, and manage your billing information."
    },
    // Membership & Access
    {
      category: 'Membership & Access',
      question: "What's included in the membership?",
      answer: "Membership includes access to weekly live coaching calls with Oliver & Toni, personalised video feedback on your training, the private Skool community, all digital course materials, and the grading system to track your progress."
    },
    {
      category: 'Membership & Access',
      question: "What membership options are available?",
      answer: "We offer Monthly and Annual memberships. Both include the same access - choose based on your commitment preference."
    },
    // 21-Day Challenge
    {
      category: '21-Day Challenge',
      question: "How does the 21-Day Challenge prize work?",
      answer: "Complete the requirements (2 live calls per week, 1 video submission per week, finish Grade 1, attend graduation call) and you may be eligible for a full refund OR credit towards a membership. This is a prize, not a guarantee - approval is at the team's discretion based on genuine participation."
    },
    // General
    {
      category: 'General',
      question: "How quickly will I hear back?",
      answer: "We typically respond within 24 hours. For urgent matters, mention it in your message."
    },
    {
      category: 'General',
      question: "Where are you located?",
      answer: "Oracle Boxing Ltd is based in Yeovil, United Kingdom, but we serve members worldwide through our online platform."
    },
  ]

  // Input styling matching admin page
  const inputClass = "w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] bg-white text-[#37322F] font-sans text-body"
  const selectClass = "w-full h-12 px-4 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] bg-white text-[#37322F] font-sans text-body appearance-none cursor-pointer"

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-6 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-sub font-semibold text-[#37322F] font-sans flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            Contact Us
          </h1>
          <p className="text-gray-500 text-body mt-1">Have questions? We typically respond within 24 hours.</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        {/* Contact Form */}
        <div className="mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={inputClass}
                  placeholder="John"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={inputClass}
                  placeholder="Doe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
                placeholder="john@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Subject</label>
              <div className="relative">
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={selectClass}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a topic</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Course Information">Course Information</option>
                  <option value="21-Day Challenge">21-Day Challenge</option>
                  <option value="Membership">Membership</option>
                  <option value="Billing & Payments">Billing & Payments</option>
                  <option value="Partnership & Media">Partnership & Media</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Message</label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] bg-white text-[#37322F] font-sans text-body resize-none"
                placeholder="How can we help?"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#37322F] text-white rounded-lg font-semibold text-body font-sans cursor-pointer hover:bg-[#49423D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Direct Email */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-body text-gray-500">
            <Mail className="w-4 h-4" />
            <span>Or email us directly at</span>
            <a href="mailto:team@oracleboxing.com" className="text-[#37322F] font-medium hover:underline">
              team@oracleboxing.com
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-title font-semibold text-[#37322F] font-sans mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{faq.category}</span>
                    <p className="text-[#37322F] text-body font-medium font-sans mt-0.5">
                      {faq.question}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-body font-sans leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-body text-gray-400">
          <p className="font-medium text-gray-500">Oracle Boxing Ltd</p>
          <p>Unit 5 Artillery 88, Artillery Road</p>
          <p>Yeovil, BA22 8RP, United Kingdom</p>
        </div>
      </div>
    </div>
  )
}
