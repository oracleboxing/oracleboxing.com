"use client"

import Image from "next/image"

// Live Coaching Calls Calendar Component
function LiveCoachingCalendar() {
  // Schedule with coach names, times, and lesson names (London time)
  const schedule = [
    { day: 'Mon', calls: [{ time: '9pm', coach: 'Toni', lesson: 'Jab Mechanics' }] },
    { day: 'Tue', calls: [{ time: '9am', coach: 'Oliver', lesson: 'Shape & Stance' }, { time: '11pm', coach: 'Charlie', lesson: 'Slips & Rolls' }] },
    { day: 'Wed', calls: [{ time: '9am', coach: 'Oliver', lesson: '1-2 Combos' }] },
    { day: 'Thu', calls: [{ time: '9am', coach: 'Oliver', lesson: 'Pivots & Angles' }] },
    { day: 'Fri', calls: [{ time: '12pm', coach: 'Toni', lesson: 'Hook Power' }, { time: '7pm', coach: 'Charlie', lesson: 'Catch & Parry' }] },
    { day: 'Sat', calls: [{ time: '12pm', coach: 'Toni', lesson: 'Kinetic Chain' }, { time: '5pm', coach: 'Charlie', lesson: 'Tilt Work' }] },
    { day: 'Sun', calls: [{ time: '8pm', coach: 'Toni', lesson: 'Footwork Flow' }] },
  ]

  // Track which calls are "attended" for demo
  const attended = { 'Tue-9am': true, 'Sat-12pm': true }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-[#E5E0DB] shadow-sm overflow-hidden">
      {/* Dark Header with glowing effect */}
      <div className="relative overflow-hidden bg-[#37322F] px-3 py-2 md:px-4 md:py-2.5">
        {/* Glowing ribbon */}
        <div className="header-ribbon" />
        <div className="relative flex items-center gap-2">
          {/* Calendar icon */}
          <svg className="w-5 h-5 md:w-6 md:h-6 text-[#C8C4C0] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
          </svg>
          <span className="flex-1 text-white text-xs md:text-sm font-semibold tracking-wide" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
            Live Coaching
          </span>
          <span className="text-white text-sm md:text-base font-bold">2/2</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-3 md:p-4 flex flex-col">
        <div className="flex-1 grid grid-cols-7 gap-1 md:gap-1.5">
          {/* Day Headers */}
          {schedule.map((item, idx) => (
            <div key={idx} className="text-center pb-1.5 md:pb-2 border-b border-[#E5E0DB]">
              <span className="text-[#37322F] text-[9px] md:text-xs font-medium">{item.day}</span>
            </div>
          ))}

          {/* Call cards */}
          {schedule.map((item, dayIdx) => (
            <div key={`calls-${dayIdx}`} className="flex flex-col gap-1 pt-1.5 md:pt-2">
              {item.calls.map((call, callIdx) => {
                const isAttended = attended[`${item.day}-${call.time}` as keyof typeof attended]
                return (
                  <div
                    key={callIdx}
                    className={`px-1 py-1.5 md:py-2 rounded text-center ${
                      isAttended
                        ? 'bg-[#9CABA8]'
                        : 'bg-[#E8E4DE]'
                    }`}
                  >
                    <div className={`text-[6px] md:text-[8px] font-semibold ${isAttended ? 'text-white' : 'text-[#49423D]'}`}>
                      {call.lesson}
                    </div>
                    <div className={`text-[6px] md:text-[8px] ${isAttended ? 'text-white/80' : 'text-[#6B7280]'}`}>
                      {call.time}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
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

// Feedback Illustration Component
function FeedbackIllustration() {
  const teamImages = {
    toni: "https://sb.oracleboxing.com/Website/team_toni.webp",
    oliver: "https://sb.oracleboxing.com/Website/team_ollie.webp",
    jordan: "https://sb.oracleboxing.com/Website/team_jordan.webp",
  }

  const comments = [
    {
      coach: "Oliver",
      image: teamImages.oliver,
      feedback: "Jab timing looks clean. Shoulder to chin on release, elbow tucked, aim with the knuckles and recoil straight back to guard. Maintain head position through the 1–2."
    },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-[#E5E0DB] shadow-sm overflow-hidden feedback-card">
      {/* Dark Header with glowing effect */}
      <div className="relative overflow-hidden bg-[#37322F] px-3 py-2 md:px-4 md:py-2.5">
        {/* Glowing ribbon */}
        <div className="feedback-header-ribbon" />
        <div className="relative flex items-center gap-2">
          {/* Video/feedback icon */}
          <svg className="w-5 h-5 md:w-6 md:h-6 text-[#C8C4C0] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <span className="text-white text-xs md:text-sm font-semibold tracking-wide flex-1" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
            Video Feedback
          </span>
          <span className="text-white text-sm md:text-base font-bold">1/1</span>
        </div>
      </div>

      <style jsx>{`
        .feedback-header-ribbon {
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
          animation: feedbackDrift 7s ease-in-out infinite;
        }
        @keyframes feedbackDrift {
          0%, 100% {
            transform: translateX(-25%);
            opacity: 0.7;
          }
          50% {
            transform: translateX(25%);
            opacity: 1;
          }
        }
      `}</style>

      {/* Content */}
      <div className="flex-1 p-3 md:p-4 flex flex-col">
        {/* Video Thumbnail */}
        <div className="relative w-full h-[120px] sm:h-[140px] md:h-[160px] bg-[#E5E5E5] rounded-lg overflow-hidden mb-3 md:mb-4 flex-shrink-0">
          <Image
            src="https://sb.oracleboxing.com/Website/kris_action.webp"
            alt="Boxing technique video"
            fill
            className="object-cover"
          />
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Duration */}
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-[10px] md:text-xs">
            0:45
          </div>
        </div>

        {/* Coach Comments */}
        <div className="flex-1 flex flex-col gap-2 md:gap-3">
          {comments.map((comment, idx) => (
            <div key={idx} className={`flex items-start gap-2.5 ${idx !== comments.length - 1 ? 'pb-2 md:pb-3 border-b border-[#E5E0DB]' : ''}`}>
              {/* Coach Avatar */}
              <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image src={comment.image} alt={comment.coach} fill className="object-cover" />
              </div>
              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <span className="text-[#37322F] text-[10px] md:text-xs font-semibold">{comment.coach}</span>
                <span className="text-[#9CA3AF] text-[9px] md:text-[11px]"> – </span>
                <span className="text-[#6B7280] text-[9px] md:text-[11px] leading-relaxed">
                  {comment.feedback}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Challenge Progress Illustration Component
function ChallengeProgressIllustration() {
  const weeks = [
    { label: "Week 1", status: "Complete", icon: "check" },
    { label: "Week 2", status: "Complete", icon: "check" },
    { label: "Week 3", status: "In Progress", icon: "progress" },
    { label: "Graduation Call", status: "Locked", icon: "lock" },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-[#E5E0DB] shadow-sm overflow-hidden progress-card">
      {/* Grade Badge Header with glowing effect */}
      <div className="relative overflow-hidden bg-[#37322F] px-3 py-2 md:px-4 md:py-2.5">
        {/* Glowing ribbon effect */}
        <div className="progress-header-ribbon" />

        {/* Badge content */}
        <div className="relative flex items-center gap-2">
          {/* Star icon - lighter color */}
          <svg className="w-5 h-5 md:w-6 md:h-6 text-[#C8C4C0] flex-shrink-0 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>

          {/* Text content */}
          <span className="flex-1 text-white text-xs md:text-sm font-semibold tracking-wide" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
            GRADE 1
          </span>

          <span className="text-white text-sm md:text-base font-bold">75%</span>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-2 h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-[75%] bg-gradient-to-r from-[#9CABA8] to-[#B8C4C1] rounded-full" />
        </div>
      </div>

      <style jsx>{`
        .progress-header-ribbon {
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
          animation: progressDrift 5s ease-in-out infinite;
        }
        @keyframes progressDrift {
          0%, 100% {
            transform: translateX(-15%);
            opacity: 0.7;
          }
          50% {
            transform: translateX(15%);
            opacity: 1;
          }
        }
      `}</style>

      {/* Week List */}
      <div className="flex-1 p-3 md:p-4 flex flex-col justify-center gap-2 md:gap-2.5">
        {weeks.map((week, idx) => (
          <div key={idx} className={`flex items-center gap-2.5 ${idx !== weeks.length - 1 ? 'pb-2 md:pb-2.5 border-b border-[#E5E0DB]' : ''}`}>
            {/* Icon */}
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
            {/* Text */}
            <span className="text-[#49423D] text-[11px] md:text-xs font-medium">
              {week.label}: {week.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

// Win Money Back Illustration Component
function WinMoneyBackIllustration() {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-[#E5E0DB] shadow-sm overflow-hidden">
      {/* Top Section - Challenge Complete */}
      <div className="flex-1 p-4 md:p-6 flex items-center gap-4">
        {/* Trophy/Gift Icon */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#9CABA8] to-[#7A8C89] flex items-center justify-center shadow-md">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1">
          <h4 className="text-[#37322F] text-sm md:text-base font-semibold mb-1" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
            Challenge Complete
          </h4>
          <p className="text-[#6B7280] text-[10px] md:text-xs leading-relaxed">
            Your entry fee becomes 100% membership credit.
          </p>
        </div>
      </div>

      {/* Divider with "or" */}
      <div className="flex items-center gap-3 px-4 md:px-6">
        <div className="flex-1 h-px bg-[#E5E0DB]" />
        <span className="text-[#9CA3AF] text-[10px] md:text-xs font-medium">or</span>
        <div className="flex-1 h-px bg-[#E5E0DB]" />
      </div>

      {/* Bottom Section - Full Refund Guarantee */}
      <div className="flex-1 p-4 md:p-6 flex items-center gap-4">
        {/* Shield Guarantee Icon */}
        <div className="flex-shrink-0">
          <svg className="w-14 h-14 md:w-16 md:h-16 text-[#9CABA8]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
        </div>

        {/* Text content */}
        <div className="flex-1">
          <h4 className="text-[#37322F] text-sm md:text-base font-semibold mb-1" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
            Not for you?
          </h4>
          <p className="text-[#6B7280] text-[10px] md:text-xs leading-relaxed">
            Full refund guaranteed. No questions asked.
          </p>
        </div>
      </div>
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

export default function ChallengeDetailsSection() {
  return (
    <div id="how-it-works" className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center bg-white scroll-mt-16">
      {/* Header Section */}
      <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[616px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
          <div className="w-full text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-normal leading-tight md:leading-[60px] tracking-tight" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
            The 21-Day Challenge
          </div>
          <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
            Oracle Boxing isn't for everyone. It's not a gym. It's not just a course.
            <br className="hidden sm:block" />
            It's a movement. And membership is earned.
          </div>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="self-stretch flex justify-center items-start">
        {/* Left decorative pattern - CSS gradient instead of DOM elements */}
        <div
          className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 11px,
              rgba(3,7,18,0.08) 11px,
              rgba(3,7,18,0.08) 12px
            )`
          }}
        />

        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-0 sm:border-l sm:border-r border-[rgba(55,50,47,0.12)] bg-white">
          {/* Top Left - Show Up Twice a Week */}
          <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                Show up. Twice a week.
              </h3>
              <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                Attend 2 live coaching calls per week. That's the bare minimum to stay on track and build momentum.
              </p>
            </div>
            <div className="w-full h-[220px] sm:h-[250px] md:h-[300px] rounded-lg flex items-center justify-center overflow-hidden">
              <LiveCoachingCalendar />
            </div>
          </div>

          {/* Top Right - Submit Videos for Review */}
          <div className="border-b border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] font-semibold leading-tight text-lg sm:text-xl" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                Get feedback on your technique
              </h3>
              <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                Submit 1 video per week and get detailed feedback from our coaches. Watch your technique improve in real time.
              </p>
            </div>
            <div className="w-full h-[280px] sm:h-[280px] md:h-[300px] rounded-lg flex overflow-hidden items-start">
              <FeedbackIllustration />
            </div>
          </div>

          {/* Bottom Left - Track Your Progress */}
          <div className="border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                Work through Grade 1
              </h3>
              <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                Follow our structured curriculum and get weekly feedback on your progress. Complete 21 days and book your graduation call.
              </p>
            </div>
            <div className="w-full h-[260px] sm:h-[260px] md:h-[300px] rounded-lg flex overflow-hidden items-start">
              <ChallengeProgressIllustration />
            </div>
          </div>

          {/* Bottom Right - Two Outcomes */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
                Win your money back
              </h3>
              <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                Complete the challenge and your entry fee becomes credit towards full membership. Not for you? Full refund. No hard feelings.
              </p>
            </div>
            <div className="w-full h-[280px] sm:h-[280px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center">
              <WinMoneyBackIllustration />
            </div>
          </div>
        </div>

        {/* Right decorative pattern - CSS gradient instead of DOM elements */}
        <div
          className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 11px,
              rgba(3,7,18,0.08) 11px,
              rgba(3,7,18,0.08) 12px
            )`
          }}
        />
      </div>

    </div>
  )
}
