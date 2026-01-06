'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  trackScrollDepth,
  trackTimeOnPage,
  trackExitIntent,
} from '@/lib/event-tracking'

/**
 * EngagementTracker - Automatically tracks user engagement metrics:
 * - Scroll depth (25%, 50%, 75%, 100%)
 * - Time on page (30s, 60s, 120s, 300s)
 * - Exit intent (mouse leaving viewport on desktop)
 *
 * Place this in your root layout alongside PageViewTracker
 */
export default function EngagementTracker() {
  const pathname = usePathname()
  const scrollMilestones = useRef<Set<number>>(new Set())
  const timeMilestones = useRef<Set<number>>(new Set())
  const exitIntentFired = useRef(false)
  const startTime = useRef<number>(Date.now())

  useEffect(() => {
    // Reset trackers on route change
    scrollMilestones.current = new Set()
    timeMilestones.current = new Set()
    exitIntentFired.current = false
    startTime.current = Date.now()

    const page = pathname || '/'

    // --- Scroll Depth Tracking ---
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return

      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100)

      const milestones = [25, 50, 75, 100]
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone)
          trackScrollDepth(page, milestone)
        }
      }
    }

    // --- Time on Page Tracking ---
    const timeIntervals = [30, 60, 120, 300] // seconds
    const timeIntervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000)

      for (const seconds of timeIntervals) {
        if (elapsed >= seconds && !timeMilestones.current.has(seconds)) {
          timeMilestones.current.add(seconds)
          trackTimeOnPage(page, seconds)
        }
      }

      // Stop checking after 5 minutes
      if (elapsed >= 300) {
        clearInterval(timeIntervalId)
      }
    }, 5000) // Check every 5 seconds

    // --- Exit Intent Tracking (Desktop only) ---
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves through the top of the page
      if (e.clientY <= 0 && !exitIntentFired.current) {
        exitIntentFired.current = true
        trackExitIntent(page)
      }
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    // Initial scroll check (in case page loaded scrolled)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearInterval(timeIntervalId)
    }
  }, [pathname])

  return null
}
