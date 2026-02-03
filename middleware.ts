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
