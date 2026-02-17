'use client'

import { Square, Check } from 'lucide-react'
import { EpicCTAButton } from '@/components/EpicCTAButton'

interface CostOfInactionCTAProps {
  onCTAClick?: () => void;
  onOpenPricing?: () => void;
}

export default function CostOfInactionCTA({ onCTAClick, onOpenPricing }: CostOfInactionCTAProps) {
  const fitnessBoxing = [
    "Drive for an hour",
    "Practice bad moves",
    "Get hit too hard",
    "Hear \"keep your hands up\" over and over",
    "Leave with more questions"
  ]

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-hero font-bold mb-4 sm:mb-6 text-gray-900">
            You don't have to pick one, but here's how they compare
          </h2>
        </div>

        {/* Two Paths Comparison */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Commercial Boxing Gyms */}
          <div className="relative">
            <div className="p-4 sm:p-6 lg:p-8 h-full">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sub font-bold text-gray-900">Commercial Boxing Gyms</h3>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {fitnessBoxing.map((item, index) => (
                  <div key={index} className="flex gap-2 sm:gap-3 items-start">
                    <Square className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 text-gray-400" />
                    <p className="text-body leading-relaxed text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real Coaching */}
          <div className="relative">
            <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sub font-bold text-gray-900">Online Coaching</h3>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex gap-2 sm:gap-3 items-start">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 text-green-600" />
                  <p className="text-body leading-relaxed text-gray-700">Learn the right way to box</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="border-t border-gray-200"></div>
        </div>

        {/* Closing Statement */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-sub leading-relaxed max-w-2xl mx-auto text-gray-600">
            Less effort. Better results.
          </p>
        </div>

        {/* CTA Button */}
        {(onOpenPricing || onCTAClick) && (
          <div className="text-center">
            <EpicCTAButton
              size="lg"
              className="min-h-[56px]"
              onClick={() => {
                if (onOpenPricing) onOpenPricing()
                if (onCTAClick) onCTAClick()
              }}
              trackingName="cost-of-inaction"
            >
              <span className="text-sub font-black uppercase">VIEW DETAILS</span>
            </EpicCTAButton>
          </div>
        )}
      </div>
    </section>
  )
}