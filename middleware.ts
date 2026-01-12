import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  const { pathname, searchParams } = request.nextUrl

  // 301 redirect from shop.oracleboxing.com to oracleboxing.com
  if (host === 'shop.oracleboxing.com') {
    const url = request.nextUrl.clone()
    url.host = 'oracleboxing.com'
    url.protocol = 'https'

    return NextResponse.redirect(url, { status: 301 })
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
