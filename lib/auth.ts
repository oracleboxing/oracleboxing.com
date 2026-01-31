import { getServerSession as getNextAuthSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-options'

// Email allowlist for admin access - individual emails or @domain for whole org
const ADMIN_EMAILS = [
  'jordan@oracleboxing.com',
]
const ADMIN_DOMAINS = [
  'oracleboxing.com',
]

/**
 * Check if an email is in the admin allowlist
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const lower = email.toLowerCase()
  const domain = lower.split('@')[1]
  return ADMIN_EMAILS.includes(lower) || ADMIN_DOMAINS.includes(domain)
}

/**
 * Get the current server session (wrapper around next-auth)
 */
export async function getServerSession() {
  return getNextAuthSession(authOptions)
}

/**
 * Require admin authentication for an API route.
 * Returns null if authorized, or a NextResponse 401 if not.
 * 
 * Usage in API routes:
 * ```ts
 * const authError = await requireAdmin()
 * if (authError) return authError
 * ```
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized — sign in required' },
      { status: 401 }
    )
  }

  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json(
      { error: 'Forbidden — admin access only' },
      { status: 403 }
    )
  }

  return null // authorized
}
