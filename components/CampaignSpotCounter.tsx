'use client'

import { useEffect, useState } from 'react'
import { CAMPAIGN_ACTIVE, CAMPAIGN_CONFIG, getCurrentSpots } from '@/lib/campaign'

interface CampaignSpotCounterProps {
  /** Size variant - 'sm' for header, 'md' for checkout */
  size?: 'sm' | 'md'
  /** Whether to show the animated ping indicator */
  showPing?: boolean
  /** Custom class name */
  className?: string
}

export default function CampaignSpotCounter({
  size = 'sm',
  showPing = true,
  className = ''
}: CampaignSpotCounterProps) {
  // Initialize with null to avoid hydration mismatch (SSR vs client date differences)
  const [spots, setSpots] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Only compute values after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
    setSpots(getCurrentSpots())
  }, [])

  // Update spots periodically (every 30 seconds is enough since it changes daily)
  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setSpots(getCurrentSpots())
    }, 30000)

    return () => clearInterval(interval)
  }, [mounted])

  // Don't render if campaign is not active or not yet mounted (prevents hydration mismatch)
  if (!CAMPAIGN_ACTIVE || !mounted || spots === null) return null

  const totalSpots = CAMPAIGN_CONFIG.totalSpots
  const isLowSpots = spots <= 5
  const isLastSpot = spots === 1

  // Size-specific classes
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 gap-1.5',
      ping: 'h-1.5 w-1.5',
      number: 'text-xs',
      text: 'text-[8px]',
    },
    md: {
      container: 'px-3 py-1.5 gap-2',
      ping: 'h-2 w-2',
      number: 'text-body',
      text: 'text-[10px]',
    },
  }

  const classes = sizeClasses[size]

  return (
    <span
      className={`
        inline-flex items-center rounded-full
        ${isLowSpots ? 'bg-red-50 border-red-200' : 'bg-white border-[rgba(55,50,47,0.12)]'}
        border
        ${classes.container}
        ${className}
      `}
    >
      {/* Animated ping indicator */}
      {showPing && (
        <span className={`relative flex ${classes.ping}`}>
          <span
            className={`
              animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
              ${isLowSpots ? 'bg-red-400' : 'bg-green-400'}
            `}
          />
          <span
            className={`
              relative inline-flex rounded-full ${classes.ping}
              ${isLowSpots ? 'bg-red-500' : 'bg-green-500'}
            `}
          />
        </span>
      )}

      {/* Spot count */}
      <span
        className={`
          ${classes.number} font-bold tabular-nums
          ${isLowSpots ? 'text-red-600' : 'text-[#37322F]'}
        `}
      >
        {spots}
        <span className="opacity-50">/{totalSpots}</span>
      </span>

      {/* Label */}
      <span
        className={`
          ${classes.text} font-semibold uppercase tracking-wide
          ${isLowSpots ? 'text-red-500' : 'text-[#49423D]'}
        `}
      >
        {isLastSpot ? 'SPOT' : 'SPOTS'}
      </span>
    </span>
  )
}
