'use client'

import { useEffect, useState } from 'react'
import { CAMPAIGN_ACTIVE, CAMPAIGN_CONFIG, getCurrentSpots, getTimeUntilClose } from '@/lib/campaign'

export default function CampaignBanner() {
  // Initialize with null to avoid hydration mismatch (SSR vs client date differences)
  const [spots, setSpots] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeUntilClose>>(null)
  const [mounted, setMounted] = useState(false)

  // Only compute values after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
    setSpots(getCurrentSpots())
    setTimeLeft(getTimeUntilClose())
  }, [])

  // Update spots and time every second
  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setSpots(getCurrentSpots())
      setTimeLeft(getTimeUntilClose())
    }, 1000)

    return () => clearInterval(interval)
  }, [mounted])

  // Don't render if campaign is not active or enrollment has ended
  if (!CAMPAIGN_ACTIVE || !timeLeft) return null

  // Format countdown for display
  const countdownText = timeLeft.days > 0
    ? `${timeLeft.days}d ${timeLeft.hours}h`
    : `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`

  // Create the scrolling content items
  const items = [
    CAMPAIGN_CONFIG.bannerText.title,
    `CLOSES IN ${countdownText}`,
    `ONLY ${spots} SPOT${spots === 1 ? '' : 'S'} LEFT`,
  ]

  // Repeat items for seamless loop
  const repeatedItems = [...items, ...items, ...items, ...items]

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#37322F] overflow-hidden">
      <div className="relative h-9 sm:h-10 flex items-center">
        {/* Scrolling marquee */}
        <div className="marquee-container">
          <div className="marquee-content">
            {repeatedItems.map((item, index) => (
              <span key={index} className="marquee-item">
                <span className="text-white text-body font-semibold tracking-wider uppercase">
                  {item}
                </span>
                <span className="mx-4 sm:mx-6 text-white/30">|</span>
              </span>
            ))}
          </div>
        </div>

        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#37322F] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#37322F] to-transparent z-10 pointer-events-none" />
      </div>

      <style jsx>{`
        .marquee-container {
          display: flex;
          width: 100%;
          overflow: hidden;
        }

        .marquee-content {
          display: flex;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause animation on hover */
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
