'use client'

import { useEffect, useState } from 'react'

export function WeeklyCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      
      // Get current day of week (0 = Sunday, 1 = Monday, etc.) in Eastern Time
      const currentDayET = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"})).getDay()
      
      // Find the next Sunday (or today if it's Sunday)
      const daysUntilSunday = currentDayET === 0 ? 0 : 7 - currentDayET
      
      // Calculate the target Sunday date
      const targetDate = new Date(now)
      targetDate.setDate(targetDate.getDate() + daysUntilSunday)
      
      // Create the target time: 11:59 PM on Sunday in Eastern Time
      // We'll create a date string and parse it with timezone info
      const year = targetDate.getFullYear()
      const month = String(targetDate.getMonth() + 1).padStart(2, '0')
      const day = String(targetDate.getDate()).padStart(2, '0')
      
      // Create target time in Eastern timezone
      // Using ISO string format with Eastern timezone offset
      const isDST = (targetDate: Date): boolean => {
        const jan = new Date(targetDate.getFullYear(), 0, 1).getTimezoneOffset()
        const jul = new Date(targetDate.getFullYear(), 6, 1).getTimezoneOffset()
        return Math.max(jan, jul) !== targetDate.getTimezoneOffset()
      }
      
      // EST is UTC-5, EDT is UTC-4
      const offset = isDST(targetDate) ? '-04:00' : '-05:00'
      const targetTimeString = `${year}-${month}-${day}T23:59:00${offset}`
      const targetTime = new Date(targetTimeString)
      
      const difference = targetTime.getTime() - now.getTime()
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        // Reset for new week
        setTimeLeft({ days: 6, hours: 23, minutes: 59, seconds: 59 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate next cohort date (2 months from now)
  const getNextCohortDate = () => {
    const now = new Date()
    const nextCohort = new Date(now.getFullYear(), now.getMonth() + 2, 1)
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    return `${monthNames[nextCohort.getMonth()]} ${nextCohort.getFullYear()}`
  }

  return (
    <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-white">
      <div className="text-center">
        <div className="flex items-center justify-end gap-1.5">
          <div className="text-body uppercase tracking-wide font-bold text-yellow-300 text-right">
            Closes:
          </div>
          <div className="flex items-center gap-0.5">
            <div className="flex items-center">
              <span className="text-sub font-bold tabular-nums">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-body ml-0.5 opacity-70">d</span>
            </div>
            <span className="text-body opacity-50">:</span>
            <div className="flex items-center">
              <span className="text-sub font-bold tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-body ml-0.5 opacity-70">h</span>
            </div>
            <span className="text-body opacity-50">:</span>
            <div className="flex items-center">
              <span className="text-sub font-bold tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-body ml-0.5 opacity-70">m</span>
            </div>
            <span className="text-body opacity-50">:</span>
            <div className="flex items-center">
              <span className="text-sub font-bold tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-body ml-0.5 opacity-70">s</span>
            </div>
          </div>
        </div>
        <div className="text-body uppercase tracking-wider text-white font-semibold mt-0.5">
          Next Cohort: {getNextCohortDate()}
        </div>
      </div>
    </div>
  )
}