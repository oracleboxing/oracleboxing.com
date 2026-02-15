import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Admin domain allowlist - any @oracleboxing.com email can access admin
const ADMIN_DOMAIN = 'oracleboxing.com'

function isAdminEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]
  return domain === ADMIN_DOMAIN
}

// Routes that require admin authentication
const PROTECTED_API_PATHS = [
  '/api/admin/',
  '/api/supabase/setup-tables',
]

// Page routes that require admin authentication
const PROTECTED_PAGE_PATHS = [
  '/admin',
]

function isProtectedApi(pathname: string): boolean {
  return PROTECTED_API_PATHS.some((path) => pathname.startsWith(path))
}

function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PAGE_PATHS.some((path) => pathname.startsWith(path))
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  const { pathname } = request.nextUrl

  // 301 redirect from shop.oracleboxing.com to oracleboxing.com
  if (host === 'shop.oracleboxing.com') {
    const url = request.nextUrl.clone()
    url.host = 'oracleboxing.com'
    url.protocol = 'https'

    return NextResponse.redirect(url, { status: 301 })
  }

  // Protect admin pages — redirect to Google sign-in if not authenticated
  if (isProtectedPage(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token?.email || !isAdminEmail(token.email as string)) {
      const signInUrl = new URL('/api/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Protect admin API routes — return 401 JSON
  if (isProtectedApi(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token?.email || !isAdminEmail(token.email as string)) {
      return NextResponse.json(
        { error: 'Unauthorized — admin access required' },
        { status: 401 }
      )
    }
  }

  // --- A/B Experiment Variant Assignment ---
  // Only run on page routes, not API routes or static assets
  const response = NextResponse.next()
  const isPageRoute = !pathname.startsWith('/api/') && !pathname.startsWith('/_next/')

  if (!isPageRoute) return response

  try {
    // Read existing experiment cookie
    const abCookieRaw = request.cookies.get('ob_ab')?.value
    let existingAssignments: Record<string, string> = {}
    if (abCookieRaw) {
      try {
        existingAssignments = JSON.parse(decodeURIComponent(abCookieRaw))
      } catch {
        existingAssignments = {}
      }
    }

    // Fetch active tests (edge-cached, 60s TTL)
    const origin = request.nextUrl.origin
    const activeRes = await fetch(`${origin}/api/experiments/active`, {
      next: { revalidate: 60 },
    })

    if (activeRes.ok) {
      const { tests } = await activeRes.json()

      if (tests && tests.length > 0) {
        // Check if we need to assign any new variants
        let needsUpdate = false
        const assignments = { ...existingAssignments }

        for (const test of tests) {
          if (test.status === 'completed' && test.winner) {
            if (assignments[test.id] !== test.winner) {
              assignments[test.id] = test.winner
              needsUpdate = true
            }
            continue
          }

          if (test.status === 'active' && !assignments[test.id]) {
            // Weighted random assignment
            const variants = test.variants || []
            const totalWeight = variants.reduce((sum: number, v: any) => sum + (v.weight || 0), 0)
            let random = Math.random() * totalWeight
            let assignedVariant = variants[0]?.id || 'control'
            for (const v of variants) {
              random -= (v.weight || 0)
              if (random <= 0) {
                assignedVariant = v.id
                break
              }
            }
            assignments[test.id] = assignedVariant
            needsUpdate = true
          }
        }

        // Clean up stale test assignments
        const activeTestIds = new Set(tests.map((t: any) => t.id))
        for (const testId of Object.keys(assignments)) {
          if (!activeTestIds.has(testId)) {
            delete assignments[testId]
            needsUpdate = true
          }
        }

        if (needsUpdate) {
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          response.cookies.set('ob_ab', JSON.stringify(assignments), {
            expires,
            path: '/',
            sameSite: 'lax',
          })
        }
      }
    }
  } catch (error) {
    // Graceful degradation — don't block page load if experiment fetch fails
    console.warn('A/B experiment assignment failed (non-blocking):', error)
  }

  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
