'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import FooterSection from '@/components/footer-section'
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
      const response = await fetch('https://hook.eu2.make.com/e9y5273eqsxw5odmoxor8u717ihlsu2t', {
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
    {
      question: "How quickly will I hear back?",
      answer: "We typically respond within 24 hours during business days. For urgent matters, please mention it in your message."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes! We offer a 30-day money-back guarantee on our courses and challenges. Check our refund policy for details."
    },
    {
      question: "Can I try before buying?",
      answer: "Join our free newsletter to get training tips and updates. We also offer free content on our YouTube channel."
    },
    {
      question: "Where are you located?",
      answer: "We're based in the United Kingdom but serve students worldwide with our online courses and coaching."
    }
  ]

  return (
    <div className="min-h-screen bg-[#FFFCF5] flex overflow-x-hidden">
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
      <main className="flex-1 min-w-0">

        {/* Hero Section */}
        <section className="relative pt-[120px] md:pt-[160px] pb-16 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4">
            <div className="flex flex-col items-center gap-6">
              <h1 className="max-w-[900px] text-center text-[#37322f] text-4xl md:text-[64px] font-normal leading-tight md:leading-[1.15] font-serif">
                Get in Touch
              </h1>
              <p className="max-w-[700px] text-center text-[#37322f]/80 text-lg md:text-xl font-medium leading-7 font-sans">
                Have questions about our courses or coaching? We're here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 md:py-24 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[600px] mx-auto px-4">
            <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                      placeholder="John"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                      placeholder="Doe"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                    placeholder="john@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select a topic</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Course Information">Course Information</option>
                    <option value="21-Day Challenge">21-Day Challenge</option>
                    <option value="Billing & Payments">Billing & Payments</option>
                    <option value="Partnership & Media">Partnership & Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans resize-none"
                    placeholder="Tell us more about how we can help..."
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#37322F] text-white rounded-full font-semibold text-lg font-sans cursor-pointer hover:bg-[#49423D] transition-colors shadow-[0px_2px_4px_rgba(55,50,47,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              {/* Alternative Contact Info */}
              <div className="mt-8 pt-8 border-t border-[rgba(55,50,47,0.08)]">
                <p className="text-sm text-[rgba(73,66,61,0.70)] text-center font-sans">
                  You can also email us directly at{' '}
                  <a href="mailto:team@oracleboxing.com" className="text-[#37322F] font-semibold hover:underline">
                    team@oracleboxing.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[700px] mx-auto px-4">
            <h2 className="text-center text-[#37322F] text-2xl md:text-4xl font-normal font-serif mb-12">
              Questions & Answers
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden border border-[rgba(55,50,47,0.12)]">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[rgba(55,50,47,0.02)] transition-colors"
                  >
                    <span className="text-[#37322F] text-base font-medium font-sans pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[rgba(73,66,61,0.50)] flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5">
                      <p className="text-[rgba(73,66,61,0.90)] text-sm font-sans leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <FooterSection />
      </main>
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
    </div>
  )
}
