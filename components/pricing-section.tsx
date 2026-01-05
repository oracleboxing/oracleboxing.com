"use client"

import Link from "next/link"
import { useCurrency } from "@/contexts/CurrencyContext"
import { getProductPrice, formatPrice } from "@/lib/currency"

export default function PricingSection() {
  const { currency, isLoading } = useCurrency()
  return (
    <div id="pricing" className="w-full relative overflow-hidden flex flex-col justify-center items-center scroll-mt-8 border-b border-[rgba(55,50,47,0.12)]">
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

      {/* Content with solid background */}
      <div className="mx-0 sm:mx-4 md:mx-8 lg:mx-12 my-0 self-stretch relative bg-[#FFFCF5] sm:border border-[rgba(55,50,47,0.12)] py-12 sm:py-16 md:py-24 flex flex-col justify-center items-center gap-8 sm:gap-10 md:gap-12 z-10">
        {/* Header */}
        <div className="w-full max-w-[500px] text-center px-4 flex flex-col gap-2">
          <p className="text-[#37322F] text-xl sm:text-2xl md:text-3xl font-normal font-serif">
            Earn Your Place.
          </p>
          <p className="text-[#FF8000] text-base sm:text-lg font-medium font-sans">
            Win Your Money Back
          </p>
        </div>

        {/* Pricing Card */}
        <div className="w-full px-4 sm:px-6 flex justify-center">
          <div className="w-full max-w-[440px] bg-[#37322F] rounded-2xl overflow-hidden shadow-xl">
            {/* Card Content */}
            <div className="px-5 sm:px-8 py-8 sm:py-10 flex flex-col gap-6 sm:gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="text-[#FBFAF9] text-xl sm:text-2xl md:text-3xl font-semibold font-sans">
                21-Day Challenge
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[#F0EFEE] text-4xl sm:text-5xl md:text-6xl font-medium font-serif">
                  {isLoading ? '...' : formatPrice(getProductPrice('21dc_entry', currency) || 147, currency)}
                </span>
              </div>
              <div className="text-[#847971] text-sm font-medium font-sans">
                one-time payment
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/checkout?product=21dc-entry"
              className="w-full px-6 py-4 bg-[#FBFAF9] hover:bg-white transition-colors rounded-full flex justify-center items-center shadow-[0px_2px_4px_rgba(55,50,47,0.12)]"
            >
              <span className="text-[#37322F] text-base font-semibold font-sans">
                Join the Challenge
              </span>
            </Link>

            {/* Features */}
            <div className="flex flex-col gap-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
              {[
                "11 Live Classes Per Week",
                "Private Community Access",
                "Boxing Roadmap Course",
                "1-on-1 Graduation Call",
                "Win Your Money Back Guarantee",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="#FF8000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[#F0EFEE] text-base font-medium font-sans">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
