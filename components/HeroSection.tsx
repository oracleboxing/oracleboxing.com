'use client'

import { WeeklyCountdown } from '@/components/WeeklyCountdown'
import WistiaVideo from '@/components/WistiaVideo'
import { EpicCTAButton } from '@/components/EpicCTAButton'
import { useExperiment } from '@/contexts/ExperimentContext'

// Default headlines (used as control and when no experiment is active)
const DEFAULT_HEADLINE = {
  main: 'I\'ll pay you to get better at boxing',
  sub: 'Train with us for 6 weeks. Do what we ask. Get your money back when you finish. That\'s it.'
}

interface HeroSectionProps {
  onCTAClick?: (location: string) => void
  onOpenPricing?: () => void
}

export default function HeroSection({ onCTAClick, onOpenPricing }: HeroSectionProps) {
  // A/B test: if 'hero-headline' experiment is active, use its config
  // Config shape: { headline: string, sub: string }
  const { config } = useExperiment('hero-headline')

  const headline = {
    main: config?.headline || DEFAULT_HEADLINE.main,
    sub: config?.sub || DEFAULT_HEADLINE.sub,
  }

  // Handle CTA click
  const handleCTAClick = () => {
    if (onOpenPricing) {
      onOpenPricing()
    }
    if (onCTAClick) {
      onCTAClick('hero')
    }
  }

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20">
        {/* Centered Text Content */}
        <div className="text-center">
          <h1
            className="text-hero font-bold text-gray-900 tracking-tight leading-tight px-4 max-w-5xl mx-auto mb-4 sm:mb-5"
            style={{
              fontWeight: '700'
            }}
          >
            {headline.main}
          </h1>

          <p className="text-title text-gray-900 max-w-4xl mx-auto px-4 leading-relaxed">
            {headline.sub}
          </p>
        </div>

        {/* VSL Video */}
        <div className="mt-8 sm:mt-12">
          <WistiaVideo />
        </div>

        {/* CTA Button Below Video */}
        <div className="mt-8 sm:mt-12 flex justify-center px-4">
          <EpicCTAButton
            size="lg"
            className="w-full sm:w-auto max-w-md sm:max-w-none"
            trackingName="hero"
            onClick={handleCTAClick}
          >
            START CHALLENGE
          </EpicCTAButton>
        </div>
      </div>
    </section>
  )
}