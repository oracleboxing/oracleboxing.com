"use client"

import { useState } from "react"
import { getClientSiteMode } from "@/lib/site-mode"

// Schedule data with London times (24hr format for easy conversion)
const schedule = [
  { day: "Sunday", time: "20:00", coach: "Toni" },
  { day: "Monday", time: "21:00", coach: "Toni" },
  { day: "Tuesday", time: "09:00", coach: "Oliver" },
  { day: "Tuesday", time: "23:00", coach: "Charlie" },
  { day: "Wednesday", time: "09:00", coach: "Oliver" },
  { day: "Thursday", time: "09:00", coach: "Oliver" },
  { day: "Friday", time: "00:00", coach: "Charlie" },
  { day: "Friday", time: "12:00", coach: "Toni" },
  { day: "Friday", time: "19:00", coach: "Charlie" },
  { day: "Saturday", time: "12:00", coach: "Toni" },
  { day: "Saturday", time: "17:00", coach: "Charlie" },
]

// Timezone options
const timezones = [
  { label: "London (GMT)", offset: 0 },
  { label: "New York (EST)", offset: -5 },
  { label: "Los Angeles (PST)", offset: -8 },
  { label: "Sydney (AEDT)", offset: 11 },
  { label: "Dubai (GST)", offset: 4 },
  { label: "Singapore (SGT)", offset: 8 },
  { label: "Tokyo (JST)", offset: 9 },
  { label: "Berlin (CET)", offset: 1 },
  { label: "Mumbai (IST)", offset: 5.5 },
]

function convertTime(londonTime: string, offset: number): { time: string; dayShift: number } {
  const [hours, minutes] = londonTime.split(":").map(Number)
  let newHours = hours + offset
  let dayShift = 0

  if (newHours >= 24) {
    newHours -= 24
    dayShift = 1
  } else if (newHours < 0) {
    newHours += 24
    dayShift = -1
  }

  const period = newHours >= 12 ? "pm" : "am"
  const displayHours = newHours > 12 ? newHours - 12 : newHours === 0 ? 12 : newHours

  return {
    time: `${displayHours}${minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : ""}${period}`,
    dayShift,
  }
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function getShiftedDay(day: string, shift: number): string {
  const dayIndex = days.indexOf(day)
  let newIndex = dayIndex + shift
  if (newIndex >= 7) newIndex -= 7
  if (newIndex < 0) newIndex += 7
  return days[newIndex]
}

interface FAQItemProps {
  question: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, children, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-[rgba(55,50,47,0.12)]">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left gap-4"
      >
        <span className="text-[#37322F] text-title font-medium font-sans">
          {question}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#847971"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[1000px] pb-5" : "max-h-0"
        }`}
      >
        <div className="text-[#605A57] text-body font-normal leading-relaxed font-sans">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ChallengeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0])
  const siteMode = getClientSiteMode()
  const isMembership = siteMode === 'membership'

  const convertedSchedule = schedule.map((item) => {
    const { time, dayShift } = convertTime(item.time, selectedTimezone.offset)
    const day = getShiftedDay(item.day, dayShift)
    return { ...item, convertedTime: time, convertedDay: day }
  })

  // Group by day
  const groupedSchedule = convertedSchedule.reduce(
    (acc, item) => {
      if (!acc[item.convertedDay]) {
        acc[item.convertedDay] = []
      }
      acc[item.convertedDay].push(item)
      return acc
    },
    {} as Record<string, typeof convertedSchedule>
  )

  return (
    <div id="faq" className="w-full flex flex-col justify-center items-center bg-white scroll-mt-16">
      {/* FAQ Content */}
      <div className="self-stretch flex justify-center items-start">

        <div className="flex-1 min-w-0 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
            {/* Title */}
            <h2 className="text-center text-[#49423D] text-section font-normal leading-tight tracking-tight mb-8 sm:mb-10">
              Frequently Asked Questions
            </h2>
            {/* FAQ 1 - Live Classes */}
            <FAQItem
              question="What time are the live classes?"
              isOpen={openIndex === 0}
              onToggle={() => setOpenIndex(openIndex === 0 ? null : 0)}
            >
              <div className="space-y-4">
                <p>Here's the current weekly schedule:</p>

                {/* Timezone Selector */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[#37322F] font-medium text-sm">Your timezone:</span>
                  <select
                    value={selectedTimezone.label}
                    onChange={(e) => {
                      const tz = timezones.find((t) => t.label === e.target.value)
                      if (tz) setSelectedTimezone(tz)
                    }}
                    className="bg-white border border-[rgba(55,50,47,0.2)] rounded-lg px-3 py-1.5 text-sm text-[#37322F] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF8000] focus:border-transparent"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.label} value={tz.label}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Schedule Grid */}
                <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.12)] overflow-hidden">
                  {days.map((day) => {
                    const dayClasses = groupedSchedule[day]
                    if (!dayClasses || dayClasses.length === 0) return null
                    return (
                      <div
                        key={day}
                        className="flex border-b border-[rgba(55,50,47,0.08)] last:border-b-0"
                      >
                        <div className="w-28 sm:w-32 flex-shrink-0 py-2.5 px-3 bg-[#FAFAF9] border-r border-[rgba(55,50,47,0.08)]">
                          <span className="text-[#37322F] text-sm font-medium">{day}</span>
                        </div>
                        <div className="flex-1 py-2.5 px-3 flex flex-wrap gap-x-4 gap-y-1">
                          {dayClasses.map((cls, idx) => (
                            <span key={idx} className="text-sm">
                              <span className="text-[#37322F] font-medium">{cls.convertedTime}</span>
                              <span className="text-[#847971]"> ({cls.coach})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </FAQItem>

            {!isMembership && (
              <>
                {/* FAQ 2 - After Challenge */}
                <FAQItem
                  question="What happens after the challenge?"
                  isOpen={openIndex === 1}
                  onToggle={() => setOpenIndex(openIndex === 1 ? null : 1)}
                >
                  <div className="space-y-3">
                    <p>
                      Once the 21-Day Challenge ends, our coaches will review your effort, consistency,
                      and character. If you've proven yourself, we may offer you a spot in our private
                      membership.
                    </p>
                    <p>
                      If you've completed the challenge, your $147 entry can be applied as credit toward
                      your membership.
                    </p>
                    <p>
                      If membership isn't the right fit, we'll refund your payment. Simple. Either way,
                      a graduation call is required to close out your journey.
                    </p>
                    <p>
                      And yes - we have a full progression path. So if you join, you'll have structured
                      levels to grow through for years to come.
                    </p>
                  </div>
                </FAQItem>

                {/* FAQ 3 - Membership Cost */}
                <FAQItem
                  question="How much does the full membership cost after I finish?"
                  isOpen={openIndex === 2}
                  onToggle={() => setOpenIndex(openIndex === 2 ? null : 2)}
                >
                  <div className="space-y-3">
                    <p>
                      The price of a membership is less than half of what you paid for the challenge, and we offer monthly or annual options.
                    </p>
                    <p>
                      <span className="text-[#37322F] font-medium">But it's invite-only.</span> You'll need to complete the challenge and be accepted before you can join.
                    </p>
                  </div>
                </FAQItem>
              </>
            )}

            {isMembership && (
              <>
                {/* Membership FAQ 2 - What's included */}
                <FAQItem
                  question="What's included in the membership?"
                  isOpen={openIndex === 1}
                  onToggle={() => setOpenIndex(openIndex === 1 ? null : 1)}
                >
                  <div className="space-y-3">
                    <p>
                      Full access to all courses (Boxing Toolkit, Grades 1-3, and more as they're released), 11 live group coaching calls per week, personal video feedback from coaches, the private Skool community, and structured progression through the grading system.
                    </p>
                    <p>
                      Annual members also get the Boxing First Principles course and a free 1-on-1 coaching call included.
                    </p>
                  </div>
                </FAQItem>

                {/* Membership FAQ 3 - Cancel */}
                <FAQItem
                  question="Can I cancel anytime?"
                  isOpen={openIndex === 2}
                  onToggle={() => setOpenIndex(openIndex === 2 ? null : 2)}
                >
                  <div className="space-y-3">
                    <p>
                      <span className="text-[#37322F] font-medium">Yes, cancel anytime.</span> Both monthly and annual memberships can be cancelled at the end of any billing period. No contracts, no cancellation fees.
                    </p>
                  </div>
                </FAQItem>
              </>
            )}

            {/* FAQ 4 - 1-on-1 Coaching */}
            <FAQItem
              question="Can I get 1-on-1 coaching?"
              isOpen={openIndex === 3}
              onToggle={() => setOpenIndex(openIndex === 3 ? null : 3)}
            >
              <div className="space-y-3">
                <p>
                  <span className="text-[#37322F] font-medium">Yes-but it's invite-only.</span>
                </p>
                <p>
                  If you show potential and commitment, you may be invited to our 1-on-1 Coaching
                  Programme. This is the fastest way to sharpen your skills by working directly with
                  a coach.
                </p>
              </div>
            </FAQItem>

            {/* FAQ 5 - Can't make live sessions */}
            <FAQItem
              question="What if I can't make the live sessions?"
              isOpen={openIndex === 4}
              onToggle={() => setOpenIndex(openIndex === 4 ? null : 4)}
            >
              <div className="space-y-3">
                <p>
                  We run <span className="text-[#37322F] font-medium">11 live classes per week</span> across multiple timezones, so there's usually a time that works for most schedules.
                </p>
                <p>
                  If you genuinely can't make any of the live sessions, you can still participate by submitting video of your training for feedback. The coaches review every submission personally.
                </p>
                <p>
                  That said, the live classes are where the real learning happens-real-time corrections, drilling with others, and immediate feedback from coaches.
                </p>
              </div>
            </FAQItem>

            {/* FAQ 6 - Equipment */}
            <FAQItem
              question="Do I need any equipment?"
              isOpen={openIndex === 5}
              onToggle={() => setOpenIndex(openIndex === 5 ? null : 5)}
            >
              <div className="space-y-3">
                <p>
                  <span className="text-[#37322F] font-medium">No equipment required to start.</span> You can train with shadowboxing alone.
                </p>
                <p>
                  If you want to level up, a heavy bag, slip bag, or mirror can help-but they're optional. Most members start with nothing and add equipment as they progress.
                </p>
              </div>
            </FAQItem>

            {/* FAQ 7 - Experience level */}
            <FAQItem
              question="What experience level do I need?"
              isOpen={openIndex === 6}
              onToggle={() => setOpenIndex(openIndex === 6 ? null : 6)}
            >
              <div className="space-y-3">
                {isMembership ? (
                  <>
                    <p>
                      Oracle Boxing is built for <span className="text-[#37322F] font-medium">all levels</span>. Whether you're a complete beginner or you've been training for years, the structured course library and grading system will meet you where you are.
                    </p>
                    <p>
                      Beginners start with the Boxing Toolkit and Grade 1. More experienced boxers can move through the grades faster and focus on refining technique through video feedback and live coaching.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      The 21-Day Challenge is designed for <span className="text-[#37322F] font-medium">beginners and late starters</span> - people who want to learn boxing properly from the ground up.
                    </p>
                    <p>
                      If you've trained for years and already have solid fundamentals, this might not be the right fit. But if you're just starting out, coming back after a break, or feel like you've built bad habits, you're exactly who we built this for.
                    </p>
                  </>
                )}
              </div>
            </FAQItem>

            {!isMembership && (
              <FAQItem
                question="How does the money-back guarantee work?"
                isOpen={openIndex === 7}
                onToggle={() => setOpenIndex(openIndex === 7 ? null : 7)}
              >
                <div className="space-y-3">
                  <p>
                    <span className="text-[#37322F] font-medium">Complete the challenge, get your money back.</span> It's that simple.
                  </p>
                  <p>
                    Here's what "completing" means:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Attend at least 2 live classes per week</li>
                    <li>Submit 1 training video for feedback</li>
                    <li>Complete your graduation call at the end</li>
                  </ul>
                  <p>
                    Do those three things, and we'll refund your full $147. No tricks, no catches. We want people who show up and put in the work.
                  </p>
                </div>
              </FAQItem>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
