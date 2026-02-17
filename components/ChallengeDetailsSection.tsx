"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"

// Live Coaching Calls Calendar Component
export function ChallengeCoachingIllustration() {
  const schedule = [
    { day: 'M', calls: [{ time: '9pm', lesson: 'Jab', attended: false }] },
    { day: 'T', calls: [{ time: '9am', lesson: 'Shape', attended: true }, { time: '11pm', lesson: 'Slips', attended: false }] },
    { day: 'W', calls: [{ time: '9am', lesson: '1-2', attended: false }] },
    { day: 'T', calls: [{ time: '9am', lesson: 'Pivots', attended: false }] },
    { day: 'F', calls: [{ time: '12pm', lesson: 'Hooks', attended: false }, { time: '7pm', lesson: 'Parry', attended: false }] },
    { day: 'S', calls: [{ time: '12pm', lesson: 'Chain', attended: true }, { time: '5pm', lesson: 'Tilt', attended: false }] },
    { day: 'S', calls: [{ time: '8pm', lesson: 'Flow', attended: false }] },
  ]

  return (
    <div className="w-full relative">
      {/* Video layer - 16:9 aspect ratio, clipped to rounded corners */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-[#1A1714] relative">
        <Image
          src="https://sb.oracleboxing.com/Website/ob_course_3.webp"
          alt="Oliver coaching"
          fill
          className="object-cover"
        />
      </div>

      {/* You - PiP - spills outside bottom right */}
      <div className="absolute -bottom-4 -right-4 md:-bottom-5 md:-right-5 w-[130px] h-[95px] md:w-[170px] md:h-[125px] rounded-2xl overflow-hidden shadow-xl z-20" style={{
        background: 'rgba(30, 27, 24, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '2px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
      }}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#37322F] flex items-center justify-center">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-[#605A57]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 left-3 text-white text-[9px] md:text-[11px] font-medium">You</div>
      </div>

      {/* Bottom toolbar - overlays video */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 rounded-b-2xl flex items-center justify-center gap-3 z-10">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </div>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
        </div>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-red-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
          </svg>
        </div>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>

      {/* Participant count */}
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 z-10">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        <span className="text-white text-[8px] md:text-[10px] font-medium">14</span>
      </div>

      {/* Mini calendar - light liquid glass - spills out top left (hidden on mobile) */}
      <div className="hidden md:block absolute -top-8 -left-8 w-[250px] rounded-2xl overflow-hidden shadow-lg z-20" style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}>
        <div className="px-3 pt-3 pb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#37322F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span className="text-[#37322F] text-[10px] md:text-[11px] font-semibold">Calendar</span>
          </div>
          <span className="text-[#37322F]/50 text-[9px] md:text-[10px] font-medium">2 attended</span>
        </div>
        <div className="px-3 pb-3 pt-1">
          <div className="grid grid-cols-7 gap-1">
            {schedule.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[#37322F]/60 text-[8px] md:text-[9px] font-medium uppercase">{item.day}</span>
                <div className="flex flex-col gap-1 w-full">
                  {item.calls.map((call, cIdx) => (
                    <div
                      key={cIdx}
                      className={`flex flex-col items-center rounded-lg py-1 ${
                        call.attended
                          ? 'bg-[#37322F]'
                          : 'bg-[#37322F]/8'
                      }`}
                    >
                      <span className={`text-[6px] md:text-[7px] font-semibold ${
                        call.attended ? 'text-white' : 'text-[#37322F]/60'
                      }`}>{call.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .live-pulse {
          animation: livePulse 1.5s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <style jsx>{`
        .header-ribbon {
          position: absolute;
          top: 0;
          left: -50%;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,252,245,0.15) 30%,
            rgba(255,252,245,0.3) 50%,
            rgba(255,252,245,0.15) 70%,
            transparent 100%
          );
          filter: blur(8px);
          animation: headerDrift 6s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .header-ribbon {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .header-ribbon {
            display: none;
          }
        }
        @keyframes headerDrift {
          0%, 100% {
            transform: translateX(-20%);
            opacity: 0.7;
          }
          50% {
            transform: translateX(20%);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

// Coach Feedback Pointer - liquid glass pill
function CoachPointer({ coach, image, feedback, className = "" }: { coach: string; image: string; feedback: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 md:px-4 md:py-3 shadow-lg ${className}`} style={{
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(20px) saturate(1.2)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
    }}>
      <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/40">
        <Image src={image} alt={coach} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[#1A1714] text-[11px] md:text-xs font-semibold">{coach}</span>
        <p className="text-[#37322F] text-[10px] md:text-[11px] leading-snug mt-0.5 line-clamp-2">{feedback}</p>
      </div>
    </div>
  )
}

// Feedback Illustration Component
export function ChallengeFeedbackIllustration() {
  const teamImages = {
    toni: "https://sb.oracleboxing.com/Website/team_toni.webp",
    oliver: "https://sb.oracleboxing.com/Website/team_ollie.webp",
    jordan: "https://sb.oracleboxing.com/Website/team_jordan.webp",
  }

  const pointers = [
    {
      coach: "Oliver",
      image: teamImages.oliver,
      feedback: "Jab timing looks clean. Shoulder to chin on release, elbow tucked, recoil straight back to guard.",
    },
    {
      coach: "Toni",
      image: teamImages.toni,
      feedback: "Good rotation on the hook. Get that lead foot pivoting more and you'll double the power.",
    },
    {
      coach: "Jordan",
      image: teamImages.jordan,
      feedback: "Head position is solid through the 1-2. Work on bringing the rear hand back faster after the cross.",
    },
  ]

  return (
    <div className="w-full relative">
      {/* Video - 16:9 */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-[#1A1714] relative">
        <Image
          src="https://sb.oracleboxing.com/Website/kris_action_enhanced.webp"
          alt="Boxing technique video"
          fill
          className="object-cover scale-100"
        />
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-[10px] md:text-xs font-medium">
          0:45
        </div>
      </div>

      {/* Coach pointers - stacked, overspill bottom-right */}
      <div className="absolute -bottom-8 -left-5 md:-bottom-10 md:-left-8 z-20 space-y-2 w-[230px] md:w-[280px]">
        {pointers.map((p, i) => (
          <CoachPointer key={i} coach={p.coach} image={p.image} feedback={p.feedback} className="w-full" />
        ))}
      </div>
    </div>
  )
}

// Challenge Progress Illustration Component
export function ChallengeGradeIllustration() {
  const grades = [
    {
      name: 'GRADE 1',
      image: 'https://sb.oracleboxing.com/courses/thumbnails/grade-1.webp',
      progress: 75,
    },
    {
      name: 'GRADE 2',
      image: 'https://sb.oracleboxing.com/courses/thumbnails/grade-2.webp',
      progress: 0,
      locked: true,
    },
    {
      name: 'GRADE 3',
      image: 'https://sb.oracleboxing.com/courses/thumbnails/grade-3.webp',
      progress: 0,
      locked: true,
    },
  ]

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {grades.map((grade, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-lg" style={{
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(16px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}>
            {/* Thumbnail */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image src={grade.image} alt={grade.name} fill className="object-cover" />
              {grade.locked && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </div>
              )}
            </div>
            {/* Info */}
            <div className="p-2.5 md:p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[#1A1714] text-[11px] md:text-xs font-bold tracking-wide">{grade.name}</h4>
                <span className="text-[#37322F]/50 text-[9px] md:text-[10px] font-semibold">{grade.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 bg-[#37322F]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#37322F] rounded-full" style={{ width: `${grade.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grading call notification - liquid glass, spills bottom */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:-bottom-20 z-20 flex items-center gap-2 rounded-2xl px-4 py-2.5 md:px-5 md:py-3 shadow-lg whitespace-nowrap" style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}>
        <svg className="w-4 h-4 md:w-5 md:h-5 text-[#37322F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span className="text-[#1A1714] text-[10px] md:text-xs font-semibold">Grading Call in 6 days</span>
      </div>
    </div>
  )
}

// Win Money Back Illustration Component
function WinMoneyBackIllustration() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCredit, setShowCredit] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowConfetti(true)
          setTimeout(() => setShowCredit(true), 800)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={cardRef} className="w-full relative">
      {/* Receipt card - liquid glass */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(16px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}>
        {/* Header */}
        <div className="px-5 pt-5 pb-3 md:px-6 md:pt-6 md:pb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#1A1714] text-xs md:text-sm font-bold">Oracle Boxing</span>
            <span className="text-[#37322F]/40 text-[10px] md:text-[11px] font-medium">Receipt</span>
          </div>
          <div className="h-px bg-[#37322F]/10" />
        </div>

        {/* Line items */}
        <div className="px-5 md:px-6 space-y-3 md:space-y-4">
          {/* Purchase */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#37322F] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <div>
                <p className="text-[#1A1714] text-[11px] md:text-xs font-semibold">21-Day Challenge</p>
                <p className="text-[#37322F]/50 text-[9px] md:text-[10px]">One-time payment</p>
              </div>
            </div>
            <span className="text-[#1A1714] text-xs md:text-sm font-bold">$147</span>
          </div>

          <div className="h-px bg-[#37322F]/10" />

          {/* Credit applied - animates in */}
          <div className="flex items-center justify-between transition-all duration-700" style={{
            opacity: showCredit ? 1 : 0.3,
            transform: showCredit ? 'translateY(0)' : 'translateY(8px)',
          }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                background: showCredit ? '#16a34a' : '#E5E0DB',
                transition: 'background 0.7s ease',
              }}>
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[#1A1714] text-[11px] md:text-xs font-semibold">Membership Credit</p>
                <p className="text-[10px] md:text-[11px] font-medium" style={{
                  color: showCredit ? '#16a34a' : '#9CA3AF',
                  transition: 'color 0.7s ease',
                }}>{showCredit ? 'Applied to your account' : 'Pending...'}</p>
              </div>
            </div>
            <span className="text-xs md:text-sm font-bold" style={{
              color: showCredit ? '#16a34a' : '#9CA3AF',
              transition: 'color 0.7s ease',
            }}>-$147</span>
          </div>
        </div>

        {/* Total */}
        <div className="mx-5 md:mx-6 mt-4 mb-5 md:mt-5 md:mb-6 pt-3 border-t border-[#37322F]/10">
          <div className="flex items-center justify-between">
            <span className="text-[#1A1714] text-xs md:text-sm font-bold">You pay for membership</span>
            <span className="text-lg md:text-xl font-bold" style={{
              color: showCredit ? '#16a34a' : '#1A1714',
              transition: 'color 0.7s ease',
            }}>{showCredit ? '$0' : '$147'}</span>
          </div>
        </div>
      </div>

      {/* Guarantee badge - overspill bottom */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 md:-bottom-6 z-20 flex items-center gap-2 rounded-2xl px-4 py-2.5 md:px-5 md:py-3 shadow-lg whitespace-nowrap" style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}>
        <svg className="w-4 h-4 md:w-5 md:h-5 text-[#9CABA8] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
        <span className="text-[#1A1714] text-[10px] md:text-xs font-semibold">100% money-back guarantee</span>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                width: Math.random() * 5 + 3 + 'px',
                height: Math.random() * 5 + 3 + 'px',
                left: Math.random() * 100 + '%',
                top: '-8px',
                background: ['#9CABA8', '#C8C4C0', '#37322F', '#E5E0DB', '#7A8C89', '#16a34a'][i % 6],
                opacity: 0.7,
                animation: `confettiFall ${Math.random() * 2 + 2}s ease-out ${Math.random() * 1.2}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(350px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// Badge Component (matching Brilliance)
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)]">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

const sections = [
  {
    title: 'Show up. Twice a week.',
    description: 'Attend 2 live coaching calls per week. That\'s the bare minimum to stay on track and build momentum.',
  },
  {
    title: 'Get feedback on your technique',
    description: 'Submit 1 video per week and get detailed feedback from our coaches. Watch your technique improve in real time.',
  },
  {
    title: 'Work through Grade 1',
    description: 'Follow our structured curriculum and get weekly feedback on your progress. Complete 21 days and book your graduation call.',
  },
  {
    title: 'Win your money back',
    description: 'Complete the challenge and your entry fee becomes credit towards full membership. Not for you? Full refund. No hard feelings.',
  },
]

export default function ChallengeDetailsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardProgress, setCardProgress] = useState<number[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    cardRefs.current.forEach((ref, index) => {
      if (!ref) return
      const activeObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index)
        },
        { threshold: 0.5, rootMargin: '0px 0px 0px 0px' }
      )
      activeObserver.observe(ref)
      observers.push(activeObserver)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Scroll-based fade: 0 at bottom, 1 in centre, 0 at top
  useEffect(() => {
    const handleScroll = () => {
      const progress = cardRefs.current.map((ref) => {
        if (!ref) return 0
        const rect = ref.getBoundingClientRect()
        const vh = window.innerHeight
        // Centre of element relative to viewport centre
        const centre = rect.top + rect.height / 2
        const distFromCentre = Math.abs(centre - vh / 2)
        const maxDist = vh / 2 + rect.height / 2
        const normalized = distFromCentre / maxDist; return normalized < 0.3 ? 1 : Math.max(0, 1 - (normalized - 0.3) / 0.2)
      })
      setCardProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const illustrations = [
    <ChallengeCoachingIllustration key="cal" />,
    <ChallengeFeedbackIllustration key="feedback" />,
    <ChallengeGradeIllustration key="progress" />,
    <WinMoneyBackIllustration key="win" />,
  ]

  const heights = [
    'h-[220px] sm:h-[250px] md:h-[680px]',
    'h-[320px] sm:h-[340px] md:h-[720px]',
    'h-[260px] sm:h-[260px] md:h-[680px]',
    'h-[280px] sm:h-[280px] md:h-[680px]',
  ]

  return (
    <div id="how-it-works" className="w-full bg-white scroll-mt-16">
      {/* Section header */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-12 md:pt-20 pb-8 md:pb-12 text-center">
        <h2 className="text-[#37322F] text-hero font-normal leading-tight md:leading-[60px] tracking-tight mb-4">
          The 21-Day Challenge
        </h2>
        <p className="text-[#605A57] text-body font-normal leading-6 sm:leading-7 font-sans max-w-[520px] mx-auto">
          Complete all the requirements and we refund your money at the end. Show up, train hard, and it costs you nothing.
        </p>
      </div>
      {/* Mobile: stacked layout */}
      <div className="md:hidden px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-10">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-[#37322F] text-sub font-semibold leading-tight">{section.title}</h3>
                <p className="text-[#605A57] text-body font-normal leading-relaxed font-sans">{section.description}</p>
              </div>
              <div className={`w-full ${heights[i].split(' ').slice(0, 2).join(' ')} rounded-lg flex items-center justify-center`}>
                {illustrations[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: two columns - sticky left text, scrolling right illustrations */}
      <div className="hidden md:flex max-w-[1200px] mx-auto px-8 py-20 gap-12">
        {/* Left column: takes full height of right column, contains sticky text */}
        <div className="w-5/12 relative">
          <div className="sticky top-[calc(50vh-70px)] h-[140px]">
            {sections.map((section, i) => (
              <div
                key={i}
                className="absolute inset-0 flex flex-col gap-3 transition-all duration-200 ease-out"
                style={{
                  opacity: activeIndex === i ? 1 : 0,
                  transform: activeIndex === i ? 'translateY(0)' : activeIndex > i ? 'translateY(-20px)' : 'translateY(20px)',
                  pointerEvents: activeIndex === i ? 'auto' : 'none',
                }}
              >
                <h3 className="text-[#37322F] text-sub font-semibold leading-tight">{section.title}</h3>
                <p className="text-[#605A57] text-body font-normal leading-relaxed font-sans">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Right column: scrolling illustrations */}
        <div className="w-7/12 flex flex-col gap-0">
          {illustrations.map((illust, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el }}
              className={`flex items-center ${i === 0 || i === illustrations.length - 1 ? '' : 'min-h-screen'} ${i === 0 ? 'pt-0' : ''} ${i === illustrations.length - 1 ? 'pb-0' : ''}`}
            >
              <div
                className={`w-full ${heights[i]} rounded-lg flex items-center justify-center`}
                style={{
                  opacity: cardProgress[i] ?? 0,
                  transform: `translateY(${(1 - (cardProgress[i] ?? 0)) * 40}px)`,
                  transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                }}
              >
                {illust}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
