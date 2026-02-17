"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

// Live Coaching Calls Calendar Component
export function LiveCoachingCalendar() {
  const schedule = [
    { day: "Mon", calls: [{ time: "9pm", coach: "Toni", lesson: "Jab Mechanics" }] },
    { day: "Tue", calls: [{ time: "9am", coach: "Oliver", lesson: "Shape & Stance" }, { time: "11pm", coach: "Charlie", lesson: "Slips & Rolls" }] },
    { day: "Wed", calls: [{ time: "9am", coach: "Oliver", lesson: "1-2 Combos" }] },
    { day: "Thu", calls: [{ time: "9am", coach: "Oliver", lesson: "Pivots & Angles" }] },
    { day: "Fri", calls: [{ time: "12pm", coach: "Toni", lesson: "Hook Power" }, { time: "7pm", coach: "Charlie", lesson: "Catch & Parry" }] },
    { day: "Sat", calls: [{ time: "12pm", coach: "Toni", lesson: "Kinetic Chain" }, { time: "5pm", coach: "Charlie", lesson: "Tilt Work" }] },
    { day: "Sun", calls: [{ time: "8pm", coach: "Toni", lesson: "Footwork Flow" }] },
  ]

  const attended = { "Tue-9am": true, "Sat-12pm": true }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-[#E5E0DB] shadow-sm overflow-hidden">
      <div className="relative overflow-hidden bg-[#37322F] px-3 py-2 md:px-4 md:py-2.5">
        <div className="relative flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-[#C8C4C0] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
          </svg>
          <span className="flex-1 text-white text-xs md:text-sm font-semibold tracking-wide">Live Coaching</span>
          <span className="text-white text-body font-bold">2/2</span>
        </div>
      </div>

      <div className="flex-1 p-3 md:p-4 flex flex-col">
        <div className="flex-1 grid grid-cols-7 gap-1 md:gap-1.5">
          {schedule.map((item, idx) => (
            <div key={idx} className="text-center pb-1.5 md:pb-2 border-b border-[#E5E0DB]">
              <span className="text-[#37322F] text-[9px] md:text-xs font-medium">{item.day}</span>
            </div>
          ))}

          {schedule.map((item, dayIdx) => (
            <div key={`calls-${dayIdx}`} className="flex flex-col gap-1 pt-1.5 md:pt-2">
              {item.calls.map((call, callIdx) => {
                const isAttended = attended[`${item.day}-${call.time}` as keyof typeof attended]
                return (
                  <div
                    key={callIdx}
                    className={`px-1 py-1.5 md:py-2 rounded text-center ${
                      isAttended ? "bg-[#9CABA8]" : "bg-[#E8E4DE]"
                    }`}
                  >
                    <div className={`text-[6px] md:text-[8px] font-semibold ${isAttended ? "text-white" : "text-[#49423D]"}`}>
                      {call.lesson}
                    </div>
                    <div className={`text-[6px] md:text-[8px] ${isAttended ? "text-white/80" : "text-[#6B7280]"}`}>
                      {call.time}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-6 mt-3 pt-3 border-t border-[#E5E0DB]">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded bg-[#E8E4DE]" />
            <span className="text-[#6B7280] text-[8px] md:text-[10px]">Available</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded bg-[#9CABA8]" />
            <span className="text-[#6B7280] text-[8px] md:text-[10px]">Attended</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeedbackIllustration() {
  const teamImages = {
    toni: "https://sb.oracleboxing.com/Website/team_toni.webp",
    oliver: "https://sb.oracleboxing.com/Website/team_ollie.webp",
    jordan: "https://sb.oracleboxing.com/Website/team_jordan.webp",
  }

  const comments = [
    {
      coach: "Oliver",
      image: teamImages.oliver,
      feedback:
        "Jab timing looks clean. Shoulder to chin on release, elbow tucked, aim with the knuckles and recoil straight back to guard. Maintain head position through the 1–2.",
    },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-[#E5E0DB] shadow-sm overflow-hidden">
      <div className="relative overflow-hidden bg-[#37322F] px-3 py-2 md:px-4 md:py-2.5">
        <div className="relative flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-[#C8C4C0] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <span className="text-white text-xs md:text-sm font-semibold tracking-wide flex-1">Video Feedback</span>
          <span className="text-white text-body font-bold">1/1</span>
        </div>
      </div>

      <div className="flex-1 p-3 md:p-4 flex flex-col overflow-hidden">
        <div className="relative w-full aspect-video bg-[#E5E5E5] rounded-lg overflow-hidden mb-3 md:mb-4 flex-shrink-0">
          <Image
            src="https://sb.oracleboxing.com/Website/kris_action.webp"
            alt="Boxing technique video"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black/50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-[10px] md:text-xs">0:45</div>
        </div>

        <div className="flex-1 flex flex-col gap-2 md:gap-3 min-h-0 overflow-hidden">
          {comments.map((comment, idx) => (
            <div key={idx} className={`flex items-start gap-2.5 ${idx !== comments.length - 1 ? "pb-2 md:pb-3 border-b border-[#E5E0DB]" : ""}`}>
              <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src={comment.image} alt={comment.coach} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[#37322F] text-body font-semibold">{comment.coach}</span>
                <span className="text-[#9CA3AF] text-[10px] md:text-xs"> - </span>
                <span className="text-[#6B7280] text-[10px] md:text-xs leading-relaxed">{comment.feedback}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChallengeProgressIllustration() {
  const weeks = [
    { label: "Week 1", status: "Complete", icon: "check" },
    { label: "Week 2", status: "Complete", icon: "check" },
    { label: "Week 3", status: "In Progress", icon: "progress" },
    { label: "Graduation Call", status: "Locked", icon: "lock" },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-[#E5E0DB] shadow-sm overflow-hidden">
      <div className="relative overflow-hidden bg-[#37322F] px-3 py-2 md:px-4 md:py-2.5">
        <div className="relative flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-[#C8C4C0] flex-shrink-0 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="flex-1 text-white text-xs md:text-sm font-semibold tracking-wide">GRADE 1</span>
          <span className="text-white text-body font-bold">75%</span>
        </div>
        <div className="relative mt-2 h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-[75%] bg-gradient-to-r from-[#9CABA8] to-[#B8C4C1] rounded-full" />
        </div>
      </div>

      <div className="flex-1 p-3 md:p-4 flex flex-col justify-center gap-2 md:gap-2.5">
        {weeks.map((week, idx) => (
          <div key={idx} className={`flex items-center gap-2.5 ${idx !== weeks.length - 1 ? "pb-2 md:pb-2.5 border-b border-[#E5E0DB]" : ""}`}>
            {week.icon === "check" && (
              <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-[#9CABA8] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {week.icon === "progress" && (
              <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#8E9F9C]" />
              </div>
            )}
            {week.icon === "lock" && (
              <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0 text-[#C4BCB5]">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
            )}
            <span className="text-[#49423D] text-[11px] md:text-xs font-medium">{week.label}: {week.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WinMoneyBackIllustration() {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-[#E5E0DB] shadow-sm overflow-hidden">
      <div className="flex-1 p-4 md:p-6 flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#9CABA8] to-[#7A8C89] flex items-center justify-center shadow-md">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-[#37322F] text-body font-semibold mb-1">Challenge Complete</h4>
          <p className="text-[#6B7280] text-[10px] md:text-xs leading-relaxed">Your entry fee becomes 100% membership credit.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 md:px-6">
        <div className="flex-1 h-px bg-[#E5E0DB]" />
        <span className="text-[#9CA3AF] text-[10px] md:text-xs font-medium">or</span>
        <div className="flex-1 h-px bg-[#E5E0DB]" />
      </div>

      <div className="flex-1 p-4 md:p-6 flex items-center gap-4">
        <div className="flex-shrink-0">
          <svg className="w-14 h-14 md:w-16 md:h-16 text-[#9CABA8]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-[#37322F] text-body font-semibold mb-1">Not for you?</h4>
          <p className="text-[#6B7280] text-[10px] md:text-xs leading-relaxed">Full refund guaranteed. No questions asked.</p>
        </div>
      </div>
    </div>
  )
}

const panels = [
  {
    title: "Show up. Twice a week.",
    description:
      "Attend 2 live coaching calls per week. That's the bare minimum to stay on track and build momentum.",
    content: <LiveCoachingCalendar />,
  },
  {
    title: "Get feedback on your technique",
    description:
      "Post videos of your training. Our coaches watch every single one and give you specific, actionable feedback.",
    content: <FeedbackIllustration />,
  },
  {
    title: "Work through Grade 1",
    description:
      "Follow the structured curriculum. Each grade builds on the last, so you develop real skill - not just random combos.",
    content: <ChallengeProgressIllustration />,
  },
  {
    title: "Win your money back",
    description:
      "Complete the challenge. Do the work. If you show up and put in the effort, you get your money back. No questions asked.",
    content: <WinMoneyBackIllustration />,
  },
]

export default function StickyScrollSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (!visible.length) return
        const mostVisible = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const index = panelRefs.current.findIndex((panel) => panel === mostVisible.target)
        if (index !== -1) setActiveIndex(index)
      },
      { threshold: [0.25, 0.5, 0.75] }
    )

    panelRefs.current.forEach((panel) => {
      if (panel) observer.observe(panel)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setIsVisible(false)
    const timeout = setTimeout(() => setIsVisible(true), 120)
    return () => clearTimeout(timeout)
  }, [activeIndex])

  return (
    <section id="how-it-works" className="w-full bg-[#1a1a1a] text-white scroll-mt-16">
      <div className="px-4 sm:px-6 md:px-8 lg:px-24 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">The 21-Day Challenge</h2>
            <p className="mt-4 text-white/70 text-base sm:text-lg">
              Oracle Boxing isn't for everyone. It's not a gym. It's not just a course. It's a movement. And membership is earned.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            <div className="hidden lg:block lg:w-5/12 relative">
              <div className="lg:sticky lg:top-[40vh]">
                <div
                  className={`transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">How it works</p>
                  <h3 className="text-3xl md:text-4xl font-semibold leading-tight mb-4">
                    {panels[activeIndex].title}
                  </h3>
                  <p className="text-white/70 text-lg leading-relaxed">{panels[activeIndex].description}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-16 lg:gap-24">
              {panels.map((panel, index) => (
                <div
                  key={panel.title}
                  ref={(el) => {
                    panelRefs.current[index] = el
                  }}
                  className="min-h-[360px] lg:min-h-[440px] flex items-center"
                >
                  <div className="w-full bg-[#222] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                    <div className="lg:hidden mb-6">
                      <h3 className="text-2xl sm:text-3xl font-semibold mb-3">{panel.title}</h3>
                      <p className="text-white/70 text-base sm:text-lg leading-relaxed">{panel.description}</p>
                    </div>
                    <div className="w-full h-[260px] sm:h-[300px] md:h-[320px]">
                      {panel.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
