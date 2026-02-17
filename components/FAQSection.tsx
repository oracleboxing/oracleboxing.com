'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { EpicCTAButton } from '@/components/EpicCTAButton'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice } from '@/lib/currency'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  onCTAClick?: () => void;
  onOpenPricing?: () => void;
}

const baseFaqData: FAQItem[] = [
  {
    question: "What is the 6-Week Challenge?",
    answer: "It's a 6-week online boxing program. You learn boxing basics through lessons and live coaching. When you finish, you get all your money back."
  },
  {
    question: "What do I get?",
    answer: `• Weekly live coaching calls with Oliver, Toni, and the Oracle team
• The Boxing Masterclass course
• The Oracle Boxing community on Skool
• Challenge Tracker to track your progress
• Help from other boxers doing the challenge`
  },
  {
    question: "What do I need to do to get my money back?",
    answer: `To get your refund, you must:

• Join 2 live calls each week (or watch recordings if you can't make it live)
• Send 1 training video each week for feedback
• Complete all 5 lessons of the Boxing Masterclass course
• Join your 2 check-in calls (one in the middle, one at the end)
• Show proof in the Challenge Tracker`
  },
  {
    question: "What if I can't join live calls because of my time zone?",
    answer: "No problem. You can watch the videos later and post what you learned. Just reply \"TZ\" to your welcome email and we'll show you how to get credit."
  },
  {
    question: "What if I miss a week?",
    answer: "You can catch up. As long as you finish everything by the end of the 6 weeks, you can still get your money back."
  },
  {
    question: "What stuff do I need?",
    answer: "Just your phone (to record videos) and boxing gear — gloves, hand wraps, and a bag or space to shadowbox. You don't need a gym."
  },
  {
    question: "How do I send videos?",
    answer: "Post your videos in the Video Feedback section each week. Our coaches and other members will watch them and help you get better."
  },
  {
    question: "Who is this for?",
    answer: `• People just starting boxing who want to learn the right way
• Boxers who feel stuck and want to get better
• Anyone who wants a clear plan to learn real boxing`
  },
  {
    question: "How long does it take to get my refund?",
    answer: "After you show us everything is done, we'll check it in 2-3 days. Then we'll send your money back in 1-2 weeks to the same way you paid."
  },
  {
    question: "What if I don't finish?",
    answer: "You still get to keep the course, community, and live calls for your 6 weeks — but you won't get your money back."
  },
  {
    question: "Can I keep going after the challenge?",
    answer: "Yes — most people join the Full Access Membership after they finish. That gives you more calls, harder training, and all our other programs."
  },
  {
    question: "How do I get help?",
    answer: "Email team@oracleboxing.com or message us on Skool. We usually answer in 24 hours (Monday to Friday)."
  }
]

const FAQSection = ({ onCTAClick, onOpenPricing }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { trackFAQExpand } = useAnalytics()
  const { currency } = useCurrency()

  // Get the price for 6wc in user's currency
  const price6wc = getProductPrice('6wc', currency) || 197
  const formattedPrice = formatPrice(price6wc, currency)

  // Create FAQ data with dynamic price
  const faqData: FAQItem[] = [
    baseFaqData[0],
    {
      question: "How does the money-back promise work?",
      answer: `You pay ${formattedPrice} to join. Do everything we ask — join coaching calls, post training videos, finish the course, and come to both check-in calls — and you'll get all your money back in 1-2 weeks.`
    },
    ...baseFaqData.slice(1)
  ]

  const toggleQuestion = (index: number) => {
    // Track FAQ expansion only when opening
    if (openIndex !== index) {
      trackFAQExpand({
        question_text: faqData[index].question,
        question_index: index
      })
    }
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-hero font-bold text-gray-900 mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-title text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about the challenge
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqData.map((item, index) => (
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

        {/* CTA Button */}
        {(onOpenPricing || onCTAClick) && (
          <div className="text-center mt-8 sm:mt-12">
            <EpicCTAButton
              size="lg"
              className="min-h-[56px]"
              onClick={() => {
                if (onOpenPricing) onOpenPricing()
                if (onCTAClick) onCTAClick()
              }}
              trackingName="faq"
            >
              <span className="text-sub font-black uppercase">VIEW DETAILS</span>
            </EpicCTAButton>
          </div>
        )}
      </div>
    </section>
  )
}

export default FAQSection