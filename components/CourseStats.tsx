'use client'

import { useEffect, useState, useRef } from 'react'

interface CourseStatsProps {
  lessonCount: number
  purchaseCount?: string
  purchaseLabel?: string
  purchaseLabelText?: string
  hasLifetimeAccess?: boolean
  weeksCount?: number
  workoutsCount?: number
  avgDuration?: string
  updatedMonthly?: boolean
}

function CountingNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            const duration = 1500 // 1.5 seconds
            const steps = 60
            const increment = target / steps
            let current = 0

            const timer = setInterval(() => {
              current += increment
              if (current >= target) {
                setCount(target)
                clearInterval(timer)
              } else {
                setCount(Math.floor(current))
              }
            }, duration / steps)

            return () => clearInterval(timer)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [target, hasAnimated])

  return (
    <div ref={elementRef} className="text-hero font-semibold text-black mb-1 md:mb-2">
      {count}{suffix}
    </div>
  )
}

export function CourseStats({ lessonCount, purchaseCount, purchaseLabel, purchaseLabelText, hasLifetimeAccess = true, weeksCount, workoutsCount, avgDuration, updatedMonthly }: CourseStatsProps) {
  // Parse purchaseCount to extract number and suffix (e.g., "500+" -> 500 and "+")
  const numericPurchases = purchaseCount ? parseInt(purchaseCount.replace(/\D/g, '')) : null
  const purchaseSuffix = purchaseCount ? purchaseCount.replace(/\d/g, '') : ''

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 py-6 md:py-12">
      {/* Lessons/Recordings */}
      <div className="text-center px-4 md:px-8">
        <CountingNumber target={lessonCount} suffix={lessonCount > 150 ? '+' : ''} />
        <div className="text-body text-gray-700">{avgDuration ? 'Recordings' : 'Lessons'}</div>
      </div>

      {/* Separator - hidden on mobile */}
      <div className="hidden md:block w-px h-20 bg-gray-300"></div>

      {/* Average Duration */}
      {avgDuration && (
        <>
          <div className="text-center px-4 md:px-8">
            <div className="text-hero font-semibold text-black mb-1 md:mb-2">{avgDuration}</div>
            <div className="text-body text-gray-700">Minutes Each</div>
          </div>
          {/* Separator - hidden on mobile */}
          <div className="hidden md:block w-px h-20 bg-gray-300"></div>
        </>
      )}

      {/* Updated Monthly */}
      {updatedMonthly && (
        <>
          <div className="text-center px-4 md:px-8">
            <div className="text-hero font-semibold text-black mb-1 md:mb-2">📅</div>
            <div className="text-body text-gray-700">Updated Monthly</div>
          </div>
          {/* Separator - hidden on mobile */}
          <div className="hidden md:block w-px h-20 bg-gray-300"></div>
        </>
      )}

      {/* Weeks Count */}
      {weeksCount && (
        <>
          <div className="text-center px-4 md:px-8">
            <CountingNumber target={weeksCount} />
            <div className="text-body text-gray-700">Weeks</div>
          </div>
          {/* Separator - hidden on mobile */}
          <div className="hidden md:block w-px h-20 bg-gray-300"></div>
        </>
      )}

      {/* Workouts Count */}
      {workoutsCount && (
        <>
          <div className="text-center px-4 md:px-8">
            <CountingNumber target={workoutsCount} />
            <div className="text-body text-gray-700">Workouts</div>
          </div>
          {/* Separator - hidden on mobile */}
          <div className="hidden md:block w-px h-20 bg-gray-300"></div>
        </>
      )}

      {/* Purchases or Custom Label - Only show if no weeks/workouts/duration */}
      {!weeksCount && !workoutsCount && !avgDuration && (
        <>
          <div className="text-center px-4 md:px-8">
            {purchaseLabel ? (
              <div className="text-hero font-semibold text-black mb-1 md:mb-2">{purchaseLabel}</div>
            ) : numericPurchases !== null ? (
              <CountingNumber target={numericPurchases} suffix={purchaseSuffix} />
            ) : null}
            <div className="text-body text-gray-700">{purchaseLabel ? (purchaseLabelText || 'Course for Learning Boxing') : 'Purchases'}</div>
          </div>
          {/* Separator - hidden on mobile */}
          <div className="hidden md:block w-px h-20 bg-gray-300"></div>
        </>
      )}

      {hasLifetimeAccess && (
        <>
          {/* Lifetime Access */}
          <div className="text-center px-4 md:px-8">
            <div className="text-hero font-semibold text-black mb-1 md:mb-2">∞</div>
            <div className="text-body text-gray-700">Lifetime Access</div>
          </div>
        </>
      )}
    </div>
  )
}
