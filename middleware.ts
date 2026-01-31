import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Admin email allowlist (must match lib/auth.ts)
const ADMIN_EMAILS = [
  'jordan@oracleboxing.com',
]

// Routes that require admin authentication
const PROTECTED_PATHS = [
  '/api/admin/',
  '/api/supabase/setup-tables',
]

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path))
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

  // Protect admin API routes with NextAuth JWT check
  if (isProtectedRoute(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token?.email || !ADMIN_EMAILS.includes((token.email as string).toLowerCase())) {
      return NextResponse.json(
        { error: 'Unauthorized — admin access required' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
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
