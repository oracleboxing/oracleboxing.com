'use client'

import { useState } from 'react'

export default function MembershipFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Can I cancel my membership anytime?',
      answer: 'Yes! Both monthly and annual memberships can be cancelled at any time. For monthly memberships, you\'ll have access until the end of your current billing period. Annual memberships are pro-rated based on usage.'
    },
    {
      question: 'What equipment do I need?',
      answer: 'To get the most out of Oracle Boxing, you\'ll need: boxing gloves, hand wraps, a heavy bag (or access to one), and enough space to move around. A mirror is helpful but not required. We\'ll guide you through proper equipment selection when you join.'
    },
    {
      question: 'I\'m a complete beginner. Is this for me?',
      answer: 'Absolutely! Many of our members started with zero boxing experience. Our curriculum is designed to take you from complete beginner to advanced boxer. You\'ll start with fundamentals and progress at your own pace with expert guidance every step of the way.'
    },
    {
      question: 'How much time do I need to commit?',
      answer: 'We recommend 3-5 hours per week for best results: 2-3 live coaching sessions (or replays) plus personal practice time. However, you can adapt the program to your schedule. All sessions are recorded so you can train when it works for you.'
    },
    {
      question: 'What\'s the difference between monthly and annual?',
      answer: 'Both plans include the same full access to coaching, courses, and community. The annual plan saves you $267/year (equivalent to 2.75 months free) and includes priority support. Choose monthly for flexibility or annual for best value.'
    },
    {
      question: 'Do I get access to all the courses?',
      answer: 'Yes! Your membership includes lifetime access to Boxing from First Principles, Boxing Roadmap, and our complete coaching recordings vault (620+ sessions and growing). You keep access as long as you maintain your membership.'
    },
    {
      question: 'When are the live coaching sessions?',
      answer: 'We run 11 live sessions per week at various times to accommodate different time zones. All sessions are recorded and available within hours, so you never miss out. Our community spans 50+ countries, and we work hard to serve everyone.'
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'We offer a 7-day satisfaction guarantee. If Oracle Boxing isn\'t right for you within the first week, contact us for a full refund. We\'re confident you\'ll love the coaching and community, but we want you to feel secure in your decision.'
    },
    {
      question: 'Can I upgrade from monthly to annual?',
      answer: 'Yes! You can upgrade anytime. We\'ll credit your unused monthly time toward the annual membership. Just contact our support team and we\'ll handle the transition for you.'
    },
    {
      question: 'What happens if I miss live sessions?',
      answer: 'No problem! All sessions are recorded and available to watch later. Many members prefer to watch replays at their own pace. You\'ll still get full value from the program even if you can\'t attend live.'
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-section font-normal mb-4">
            Frequently Asked <span className="text-[#9CABA8]">Questions</span>
          </h2>
          <p className="text-title text-[#605A57]">
            Everything you need to know about Oracle Boxing membership
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-[rgba(55,50,47,0.2)] rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-[#F7F5F3] transition-colors"
              >
                <span className="font-semibold text-[#37322F] pr-8">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-[#605A57] flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 bg-[#F7F5F3]">
                  <p className="text-[#605A57] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
