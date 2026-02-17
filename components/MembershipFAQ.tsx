'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const membershipFaqData: FAQItem[] = [
  {
    question: "What is included in the Full Access Membership?",
    answer: "Your membership gives you complete access to:\n\n• All Oracle Boxing Courses (including Boxing Masterclass, Boxing Roadmap, and The Vault)\n• Live Coaching Calls every week with Oliver, Toni, and guest coaches\n• Video Feedback Reviews – upload your training clips for breakdowns and corrections\n• Private Skool Community of 300+ boxers, with leaderboards, challenges, and feedback threads\n• Recording Vault – every live call, workshop, and 1:1 session archive\n• Daily Access to the Founders via the Ask Oliver and Win of the Day categories"
  },
  {
    question: "How is this different from the 6-Week Challenge?",
    answer: "The 6-Week Challenge is a short-term commitment program with a refund guarantee. The Full Access Membership is ongoing and designed for consistent progress, not just fast results. It includes everything from the Challenge plus long-term access to all live calls, courses, and community events."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. You can cancel your membership anytime from your Skool billing settings or by emailing team@oracleboxing.com. Your access remains active until the end of your billing period."
  },
  {
    question: "Is there a refund policy?",
    answer: "The refund guarantee only applies to the 6-Week Challenge. Membership fees are non-refundable once the billing cycle starts, but you can cancel future renewals anytime."
  },
  {
    question: "Who is this membership for?",
    answer: "• Late starters or self-taught boxers who want real technical guidance\n• Fighters training alone who need structure, feedback, and accountability\n• Coaches who want to improve their eye for boxing and tactical understanding\n• Anyone serious about building skill, not just fitness"
  },
  {
    question: "What equipment do I need?",
    answer: "Just your phone for filming training clips, and basic boxing gear (gloves, wraps, bag, etc.). A tripod or stable setup helps for video feedback."
  },
  {
    question: "How do live calls work?",
    answer: "Calls run daily on Zoom. You can:\n\n• Join live and get real-time feedback\n• Watch the replay in the Boxing Clinic category\n• Post clips or questions for review if you can't attend"
  },
  {
    question: "How does the leaderboard system work?",
    answer: "Every time you give feedback, share wins, or post videos-you earn points. Top 10 members each week win free 1:1 coaching calls with Oliver or Toni. This keeps the community competitive and generous at the same time."
  },
  {
    question: "Can I still get 1-on-1 coaching?",
    answer: "Yes. Full members get priority access and discounts for the 1-on-1 coaching tiers. You can upgrade anytime for more personal guidance."
  },
  {
    question: "How do I contact support?",
    answer: "Email team@oracleboxing.com or message Oliver or Jordan directly inside Skool. We usually reply within 24 hours (Mon–Fri)."
  },
  {
    question: "Do I need to be in the UK?",
    answer: "No. We have members worldwide. All calls, feedback, and resources are delivered online-your timezone won't hold you back."
  },
  {
    question: "What happens if I miss a few weeks?",
    answer: "No stress. All sessions are recorded. You can jump back in anytime and catch up through the Vault or community posts."
  },
  {
    question: "What results can I expect?",
    answer: "If you show up to calls, post footage weekly, and follow the system, most members report visible technical transformation within 4–8 weeks, and complete stylistic rewiring within 3–6 months."
  },
  {
    question: "What's the best way to get started?",
    answer: "Once you join:\n\n• Introduce yourself in the Introductions category (with a short shadowboxing clip)\n• Start the Boxing Masterclass course in the Classroom\n• Book your first live call or post your first clip for feedback\n\nStill have questions?\nEmail team@oracleboxing.com or DM the founders inside Skool - we'll get you sorted."
  }
]

export function MembershipFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-hero font-bold text-gray-900 mb-3 sm:mb-4">
            Oracle Boxing Full Access Membership FAQ
          </h2>
          <p className="text-title text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about joining the community
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {membershipFaqData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-4 py-3 sm:px-6 sm:py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-title font-semibold text-gray-900 pr-3 sm:pr-4">
                  {item.question}
                </span>
                <div
                  className="flex-shrink-0 transition-transform duration-150"
                  style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </div>
              </button>

              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 pt-0 sm:px-6 sm:pb-5">
                    <div className="text-body text-gray-600 whitespace-pre-line leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
