"use client"

import { useState } from "react"

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
        <span className="text-[#37322F] text-base md:text-lg font-medium font-sans">
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
        <div className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ChallengeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0])

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
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center bg-[#FFFCF5]">
      {/* FAQ Content */}
      <div className="self-stretch flex justify-center items-start">
        {/* Left decorative pattern */}
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 200 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 sm:border-l sm:border-r border-[rgba(55,50,47,0.12)] bg-[#FFFCF5]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
            {/* Title */}
            <h2 className="text-center text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight font-serif tracking-tight mb-8 sm:mb-10">
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
                  And yes—we have a full progression path. So if you join, you'll have structured
                  levels to grow through for years to come.
                </p>
              </div>
            </FAQItem>

            {/* FAQ 3 - 1-on-1 Coaching */}
            <FAQItem
              question="Can I get 1-on-1 coaching?"
              isOpen={openIndex === 2}
              onToggle={() => setOpenIndex(openIndex === 2 ? null : 2)}
            >
              <div className="space-y-3">
                <p>
                  <span className="text-[#37322F] font-medium">Yes—but it's invite-only.</span>
                </p>
                <p>
                  If you show potential and commitment, you may be invited to our 1-on-1 Coaching
                  Programme. This is the fastest way to sharpen your skills by working directly with
                  a coach.
                </p>
              </div>
            </FAQItem>
          </div>
        </div>

        {/* Right decorative pattern */}
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 200 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
