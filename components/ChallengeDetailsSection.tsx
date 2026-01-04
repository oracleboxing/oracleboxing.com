"use client"

import Image from "next/image"

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
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center bg-[#FFFCF5]">
      {/* Header Section */}
      <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[616px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
          <div className="w-full text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-normal leading-tight md:leading-[60px] font-serif tracking-tight">
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

        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-0 sm:border-l sm:border-r border-[rgba(55,50,47,0.12)] bg-[#FFFCF5]">
          {/* Top Left - Show Up Twice a Week */}
          <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                Show up. Twice a week.
              </h3>
              <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                Attend 2 live coaching calls per week. That's the bare minimum to stay on track and build momentum.
              </p>
            </div>
            <div className="w-full h-[220px] sm:h-[250px] md:h-[300px] rounded-lg flex items-center justify-center overflow-hidden relative">
              <Image
                src="https://sb.oracleboxing.com/Website/OpenAI%20Playground%202026-01-04%20at%2011.53.24.png"
                alt="Live coaching calls"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Top Right - Submit Videos for Review */}
          <div className="border-b border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] font-semibold leading-tight font-sans text-lg sm:text-xl">
                Get feedback on your technique
              </h3>
              <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                Submit 1 video per week and get detailed feedback from our coaches. Watch your technique improve in real time.
              </p>
            </div>
            <div className="w-full h-[280px] sm:h-[280px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center relative">
              <Image
                src="https://sb.oracleboxing.com/Website/feedback_1.webp"
                alt="Get feedback on your technique"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Bottom Left - Track Your Progress */}
          <div className="border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                Work through Grade 1
              </h3>
              <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                Follow our structured curriculum and get weekly feedback on your progress. Complete 21 days and book your graduation call.
              </p>
            </div>
            <div className="w-full h-[260px] sm:h-[260px] md:h-[300px] rounded-lg flex overflow-hidden justify-center items-center relative">
              <Image
                src="https://sb.oracleboxing.com/Website/progress2.webp"
                alt="Track your progress"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Bottom Right - Two Outcomes */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                Win your money back
              </h3>
              <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                Complete the challenge and your $147 becomes credit towards full membership. Not for you? Full refund. No hard feelings.
              </p>
            </div>
            <div className="w-full h-[280px] sm:h-[280px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center relative">
              <Image
                src="https://sb.oracleboxing.com/Website/refund.webp"
                alt="Win your money back"
                fill
                className="object-cover rounded-lg"
              />
            </div>
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
