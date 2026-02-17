"use client"

import Image from "next/image"

export default function FundamentalsWarningSection() {
  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center bg-white">
      {/* Content */}
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

        <div className="flex-1 min-w-0 sm:border-l sm:border-r border-[rgba(55,50,47,0.12)] bg-white p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col gap-6 sm:gap-8">
          {/* Title */}
          <h3 className="text-[#49423D] text-section font-normal leading-tight tracking-tight text-center md:text-left">
            <span className="hidden sm:inline">Not Having Solid Fundamentals Is Costing You Progress Every Single Day</span>
            <span className="sm:hidden">Bad Fundamentals Cost You Progress Every Day</span>
          </h3>

          {/* Two Column Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Text Content - shows second on mobile, first on desktop */}
            <div className="flex flex-col justify-center items-start gap-4 order-2 md:order-1">
              <p className="text-[#37322F] text-title font-semibold leading-relaxed font-sans">
                Every rep with bad form makes things worse. Not better. Worse.
              </p>

              <div className="text-[#605A57] text-body font-normal leading-relaxed font-sans space-y-3">
                <p>Right now, every time you train without proper fundamentals, you're drilling the wrong movements deeper into your muscle memory.</p>
                <p>That damage compounds. Week after week, round after round. The longer you wait, the harder it becomes to fix.</p>
                <p>And eventually, you'll spend more time unlearning mistakes than actually progressing. That's months of wasted effort you can't get back.</p>
                <p className="text-[#37322F] font-medium">Stop reinforcing bad habits. Build the right foundation now - before it costs you even more time.</p>
              </div>
            </div>

            {/* Illustration - shows first on mobile, second on desktop */}
            <div className="flex flex-col justify-center items-center w-full h-[240px] sm:h-[280px] md:h-[300px] relative rounded-lg overflow-hidden order-1 md:order-2">
              <Image
                src="https://sb.oracleboxing.com/Website/habits-new.webp"
                alt="Bad habits vs good habits"
                fill
                className="object-cover rounded-lg"
              />
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
