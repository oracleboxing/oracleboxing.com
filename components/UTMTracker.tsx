'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { captureUTMParameters, syncFacebookCookies } from '@/lib/tracking-cookies'

/**
 * Client-side UTM parameter tracker
 * Captures UTM parameters immediately on every page navigation
 * Re-captures on every navigation to track referrer changes
 */
export function UTMTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Capture UTM parameters on every page navigation
    // This ensures document.referrer is captured correctly
    captureUTMParameters()
    // Sync Facebook cookies (_fbc from fbclid, _fbp from pixel)
    syncFacebookCookies()
  }, [pathname]) // Re-run on navigation

  // This component renders nothing
  return null
}
