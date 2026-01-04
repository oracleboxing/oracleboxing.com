"use client"

import Image from "next/image"

export default function FundamentalsWarningSection() {
  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center bg-[#FFFCF5]">
      {/* Content */}
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

        <div className="flex-1 min-w-0 sm:border-l sm:border-r border-[rgba(55,50,47,0.12)] bg-[#FFFCF5] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col gap-6 sm:gap-8">
          {/* Title */}
          <h3 className="text-[#49423D] text-xl sm:text-2xl md:text-3xl font-normal leading-tight font-serif tracking-tight text-center md:text-left">
            Not Having Solid Fundamentals Is Costing You Progress Every Single Day
          </h3>

          {/* Two Column Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left - Text Content */}
            <div className="flex flex-col justify-center items-start gap-4">
              <p className="text-[#37322F] text-base md:text-lg font-semibold leading-relaxed font-sans">
                Improper fundamentals = bad habits.
              </p>

              <div className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans space-y-3">
                <p>And bad habits don't just slow you down. They set you back.</p>
                <p>The longer you train with poor form, the deeper those habits sink in. Every rep. Every round. You're building the wrong muscle memory.</p>
                <p>Later, you'll have to unlearn all of it just to move forward. That means more time fixing, less time progressing.</p>
                <p className="text-[#37322F] font-medium">Build the right habits from day one. That's how real skill is made. That's what we teach here.</p>
              </div>
            </div>

            {/* Right - Illustration */}
            <div className="flex flex-col justify-center items-center w-full h-[240px] sm:h-[280px] md:h-[300px] relative rounded-lg overflow-hidden">
              <Image
                src="https://sb.oracleboxing.com/Website/habits.webp"
                alt="Bad habits vs good habits"
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
