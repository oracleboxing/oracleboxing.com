'use client'

import { useEffect, useState, useCallback } from 'react'
import { Clock } from 'lucide-react'

interface CheckoutTimerProps {
  /** Duration in minutes (default: 15) */
  duration?: number
  /** Callback when timer expires */
  onExpire?: () => void
  /** Custom class name */
  className?: string
}

const STORAGE_KEY = 'checkout_timer_start'
const DEFAULT_DURATION = 45 // minutes

export default function CheckoutTimer({
  duration = DEFAULT_DURATION,
  onExpire,
  className = ''
}: CheckoutTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Initialize timer from sessionStorage or start new
  useEffect(() => {
    const storedStart = sessionStorage.getItem(STORAGE_KEY)
    const durationMs = duration * 60 * 1000

    if (storedStart) {
      const startTime = parseInt(storedStart, 10)
      const elapsed = Date.now() - startTime
      const remaining = durationMs - elapsed

      if (remaining > 0) {
        setTimeLeft(remaining)
      } else {
        // Timer already expired
        setTimeLeft(0)
        setShowModal(true)
      }
    } else {
      // Start new timer
      sessionStorage.setItem(STORAGE_KEY, Date.now().toString())
      setTimeLeft(durationMs)
    }
  }, [duration])

  // Countdown logic
  useEffect(() => {
    if (timeLeft === null) return

    if (timeLeft <= 0) {
      // Timer expired
      setShowModal(true)
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1000) {
          clearInterval(interval)
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  // Handle expiry and redirect
  const handleExpire = useCallback(() => {
    // Clear the timer from storage
    sessionStorage.removeItem(STORAGE_KEY)

    // Call the onExpire callback or redirect to home
    if (onExpire) {
      onExpire()
    } else {
      window.location.href = '/'
    }
  }, [onExpire])

  // Auto-redirect after showing modal
  useEffect(() => {
    if (showModal) {
      const timeout = setTimeout(handleExpire, 5000)
      return () => clearTimeout(timeout)
    }
  }, [showModal, handleExpire])

  // Format time for display
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Don't render until initialized
  if (timeLeft === null) return null

  const isWarning = timeLeft <= 2 * 60 * 1000 // 2 minutes or less
  const isCritical = timeLeft <= 60 * 1000 // 1 minute or less

  return (
    <>
      {/* Timer display */}
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          ${isCritical
            ? 'bg-red-50 border border-red-200'
            : isWarning
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-[#37322F]/5 border border-[rgba(55,50,47,0.12)]'
          }
          ${className}
        `}
      >
        <Clock
          className={`
            w-4 h-4
            ${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-[#49423D]'}
          `}
        />
        <span
          className={`
            text-sm font-medium
            ${isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-[#49423D]'}
          `}
        >
          Your spot is reserved for{' '}
          <span className={`font-bold tabular-nums ${isCritical ? 'animate-pulse' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </span>
      </div>

      {/* Expiry modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md mx-4 text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <Clock className="w-8 h-8 text-red-500" />
            </div>

            {/* Title */}
            <h2
              className="text-sub font-semibold text-[#37322F] mb-2"
            >
              Your Reservation Expired
            </h2>

            {/* Message */}
            <p className="text-[#605A57] text-body mb-6">
              Your spot is no longer reserved. You'll be redirected to the homepage to start again.
            </p>

            {/* Button */}
            <button
              onClick={handleExpire}
              className="w-full py-3 px-6 bg-[#007AFF] hover:bg-[#0066DD] text-white rounded-full font-medium transition-colors"
            >
              Return to Homepage
            </button>

            {/* Auto-redirect notice */}
            <p className="text-xs text-[#847971] mt-4">
              Redirecting automatically in 5 seconds...
            </p>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Clear the checkout timer from storage
 * Call this when checkout is completed successfully
 */
export function clearCheckoutTimer() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}
