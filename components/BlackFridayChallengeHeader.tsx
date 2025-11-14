'use client'

import { useState, useEffect } from 'react'

interface BlackFridayChallengeHeaderProps {
  targetDate?: string // Default: December 2, 2025 at 10 PM UK time
  spotsRemaining?: number
}

export function BlackFridayChallengeHeader({
  targetDate = '2025-12-02T22:00:00+00:00',
  spotsRemaining
}: BlackFridayChallengeHeaderProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const target = new Date(targetDate)

    const updateCountdown = () => {
      const now = new Date()
      const difference = target.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsVisible(true)
      } else if (currentScrollY === 0) {
        // At the very top - show header
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header className={`sticky top-0 z-40 bg-black shadow-lg transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Side: Title + Countdown */}
          <div className="flex flex-col gap-1 items-start text-left">
            {/* Title */}
            <h1 className="text-white text-xs sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-wide leading-none">
              BLACK FRIDAY CHALLENGE
            </h1>

            {/* Countdown */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-white">
              <span className="text-[9px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide opacity-80">
                Closes in:
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tabular-nums">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs opacity-60">d</span>
                </div>
                <span className="text-[9px] sm:text-xs opacity-40">:</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs opacity-60">h</span>
                </div>
                <span className="text-[9px] sm:text-xs opacity-40">:</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs opacity-60">m</span>
                </div>
                <span className="text-[9px] sm:text-xs opacity-40">:</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs opacity-60">s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Spots Remaining Badge */}
          {spotsRemaining !== undefined && (
            <div className="flex items-center">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-black text-[9px] sm:text-xs font-bold uppercase tracking-wide rounded-full">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500"></span>
                </span>
                <span className="bg-yellow-100 px-1.5 sm:px-2 py-0.5 rounded font-black text-xs sm:text-sm transition-transform duration-300">
                  {spotsRemaining}<span className="text-[8px] sm:text-[10px] opacity-60">/30</span>
                </span>
                <span className="text-[8px] sm:text-[10px]">SPOTS</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
