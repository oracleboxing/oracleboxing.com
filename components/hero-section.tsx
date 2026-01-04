"use client"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  const scrollToPricing = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const pricingSection = document.getElementById("pricing")
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative pt-[120px] md:pt-[160px] pb-16">
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="flex flex-col items-center gap-12">
          {/* Hero Content */}
          <div className="max-w-[937px] flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-6">
              <h1 className="max-w-[900px] text-center text-[#37322f] text-4xl md:text-[64px] font-normal leading-tight md:leading-[1.15] font-serif">
                Learn
                <br />
                Better Boxing
              </h1>
              <p className="max-w-[700px] text-center text-[#37322f]/80 text-lg md:text-xl font-medium leading-7">
                Oracle Boxing is the virtual school for beginners in the sweet science.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              onClick={scrollToPricing}
              className="h-12 px-12 bg-[#37322f] hover:bg-[#37322f]/90 text-white rounded-full font-medium text-base shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset]"
            >
              Choose Your Package
            </Button>
          </div>
        </div>
      </div>

    </section>
  )
}
