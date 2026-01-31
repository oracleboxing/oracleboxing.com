// Campaign configuration - update these for each new campaign
// ============================================================
// Set CAMPAIGN_ACTIVE = true when a campaign is running
// Update the dates and spot schedule for each campaign

export const CAMPAIGN_ACTIVE = true

export const CAMPAIGN_CONFIG = {
  name: 'February 2026 21-Day Challenge (Extended)',

  // Enrollment window (ISO 8601 format)
  // Use 'Z' suffix for UTC or specify timezone offset
  enrollmentStart: '2026-01-22T00:00:00Z',      // Jan 22nd midnight UTC
  enrollmentEnd: '2026-02-02T11:00:00+00:00',   // Feb 2nd 7:00 PM Bali time (extended)

  totalSpots: 30,

  // Spot decrease schedule
  // Decreases gradually over the enrollment window
  // Format: { date: 'YYYY-MM-DD', spots: number }
  // The spots value applies from midnight UTC on that date
  spotSchedule: [
    { date: '2026-01-22', spots: 28 },
    { date: '2026-01-23', spots: 27 },
    { date: '2026-01-24', spots: 24 },
    { date: '2026-01-25', spots: 21 },
    { date: '2026-01-26', spots: 17 },
    { date: '2026-01-27', spots: 13 },
    { date: '2026-01-28', spots: 9 },
    { date: '2026-01-29', spots: 5 },
    { date: '2026-01-30', spots: 3 },
    { date: '2026-01-31', spots: 11 }, // Extended: +10 spots added
    { date: '2026-02-01', spots: 7 },
    { date: '2026-02-02', spots: 3 },  // Final day
  ],

  // Display text for the banner
  bannerText: {
    title: 'THE 21-DAY CHALLENGE - NOW OPEN',
    deadline: 'CLOSES IN',
  }
}

/**
 * Calculate current spots remaining based on the date schedule
 * Returns the number of spots for the current date
 */
export function getCurrentSpots(): number {
  if (!CAMPAIGN_ACTIVE) return CAMPAIGN_CONFIG.totalSpots

  const now = new Date()
  const schedule = CAMPAIGN_CONFIG.spotSchedule

  // Find the current spot count based on date
  // Iterate backwards to find the most recent date that has passed
  for (let i = schedule.length - 1; i >= 0; i--) {
    const scheduleDate = new Date(schedule[i].date + 'T00:00:00Z')
    if (now >= scheduleDate) {
      return schedule[i].spots
    }
  }

  // Before campaign starts, return total spots
  return CAMPAIGN_CONFIG.totalSpots
}

/**
 * Check if the campaign is currently within the enrollment window
 */
export function isEnrollmentOpen(): boolean {
  if (!CAMPAIGN_ACTIVE) return false

  const now = new Date()
  const start = new Date(CAMPAIGN_CONFIG.enrollmentStart)
  const end = new Date(CAMPAIGN_CONFIG.enrollmentEnd)

  return now >= start && now <= end
}

/**
 * Check if enrollment has ended (past the deadline)
 */
export function hasEnrollmentEnded(): boolean {
  if (!CAMPAIGN_ACTIVE) return true

  const now = new Date()
  const end = new Date(CAMPAIGN_CONFIG.enrollmentEnd)

  return now > end
}

/**
 * Check if enrollment hasn't started yet
 */
export function isBeforeEnrollment(): boolean {
  if (!CAMPAIGN_ACTIVE) return false

  const now = new Date()
  const start = new Date(CAMPAIGN_CONFIG.enrollmentStart)

  return now < start
}

/**
 * Get time remaining until enrollment closes
 * Returns null if campaign is not active or enrollment has ended
 */
export function getTimeUntilClose(): {
  days: number
  hours: number
  minutes: number
  seconds: number
} | null {
  if (!CAMPAIGN_ACTIVE) return null

  const now = new Date()
  const end = new Date(CAMPAIGN_CONFIG.enrollmentEnd)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return null

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  }
}

/**
 * Format the enrollment end date for display
 * Returns a human-readable string like "Jan 31st at midnight UK"
 */
export function getEnrollmentDeadlineText(): string {
  const end = new Date(CAMPAIGN_CONFIG.enrollmentEnd)

  // Use Intl.DateTimeFormat for consistent timezone handling
  const formatter = new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Europe/London'
  })

  const parts = formatter.formatToParts(end)
  const month = parts.find(p => p.type === 'month')?.value
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1')

  // Add ordinal suffix
  const suffix = day === 1 || day === 21 || day === 31 ? 'st'
    : day === 2 || day === 22 ? 'nd'
    : day === 3 || day === 23 ? 'rd'
    : 'th'

  return `${month} ${day}${suffix} at Midnight UK`
}
