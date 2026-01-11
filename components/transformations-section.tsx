"use client"

import { LiquidGlassCarousel } from "@/components/ui/LiquidGlassCarousel"

export default function TransformationsSection() {
  return (
    <div className="w-full relative overflow-hidden flex flex-col justify-center items-center border-b border-[rgba(55,50,47,0.12)]">
      {/* Diagonal stripes background - CSS gradient instead of DOM elements */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 15px,
            rgba(3,7,18,0.08) 15px,
            rgba(3,7,18,0.08) 16px
          )`
        }}
      />

      {/* Content with solid background - Full width */}
      <div className="mx-0 my-0 self-stretch relative bg-white py-10 sm:py-12 md:py-16 flex flex-col justify-center items-center gap-6 sm:gap-8 z-10">
        {/* Header */}
        <div className="w-full max-w-[700px] flex flex-col items-center gap-4 relative z-20 px-6">
          <div className="self-stretch text-center text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-normal leading-tight md:leading-[60px] font-serif tracking-tight">
            Fundamentals
            <br />
            First Approach
          </div>
          <p className="text-center text-[#49423D]/70 text-sm sm:text-base max-w-[500px]">
            Results vary, but on average it takes about 5-6 months in Oracle Boxing to achieve a transformation like what you see below.
          </p>
        </div>

        {/* Carousel Container - Natural aspect ratio */}
        <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] relative z-20 rounded-2xl overflow-hidden">
          <LiquidGlassCarousel />
        </div>
      </div>
    </div>
  )
}
