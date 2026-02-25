'use client'

import { useEffect, useState } from 'react'
import { CAMPAIGN_ACTIVE, getTimeUntilClose } from '@/lib/campaign'

type CampaignCountdownProps = {
  variant?: 'hero' | 'card'
  className?: string
}

export default function CampaignCountdown({ variant = 'hero', className = '' }: CampaignCountdownProps) {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeUntilClose>>(null)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeUntilClose())
  }, [])

  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilClose())
    }, 1000)

    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted || !CAMPAIGN_ACTIVE || !timeLeft) return null

  const countdownText = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
  const isHero = variant === 'hero'

  return (
    <div
      className={
        isHero
          ? `inline-flex items-center gap-2 rounded-full border border-[#847971]/30 bg-white/65 px-4 py-2 text-xs sm:text-sm text-[#37322F] backdrop-blur-sm ${className}`
          : `flex items-center justify-center gap-2 rounded-xl border border-[#9CABA8]/50 bg-[#9CABA8]/10 px-4 py-3 text-sm text-[#37322F] ${className}`
      }
      aria-live="polite"
    >
      {isHero ? (
        <span className="h-1.5 w-1.5 rounded-full bg-[#007AFF]/80" />
      ) : (
        <svg
          className="h-4 w-4 text-[#847971]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      )}
      <span className="font-medium">
        Enrollment closes in <span className="font-semibold">{countdownText}</span>
      </span>
    </div>
  )
}
