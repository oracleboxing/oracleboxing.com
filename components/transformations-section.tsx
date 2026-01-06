"use client"

import { LiquidGlassCarousel } from "@/components/ui/LiquidGlassCarousel"

export default function TransformationsSection() {
  return (
    <div className="w-full relative overflow-hidden flex flex-col justify-center items-center border-b border-[rgba(55,50,47,0.12)]">
      {/* Diagonal stripes background on margins */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="w-full h-full relative">
          {Array.from({ length: 300 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              style={{
                top: `${i * 16 - 120}px`,
                left: "-100%",
                width: "300%",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content with solid background - Full width */}
      <div className="mx-0 my-0 self-stretch relative bg-[#FFFCF5] py-10 sm:py-12 md:py-16 flex flex-col justify-center items-center gap-6 sm:gap-8 z-10">
        {/* Header */}
        <div className="w-full max-w-[700px] flex flex-col items-center gap-4 relative z-20 px-6">
          <div className="self-stretch text-center text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-normal leading-tight md:leading-[60px] font-serif tracking-tight">
            Fundamentals
            <br />
            First Approach
          </div>
        </div>

        {/* Carousel Container - Sized for 9:16 videos */}
        <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] relative z-20 rounded-2xl overflow-hidden">
          <LiquidGlassCarousel />
        </div>
      </div>
    </div>
  )
}
