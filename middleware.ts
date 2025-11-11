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

  // 307 redirects for TikTok UTM parameters on /6wc
  if (pathname === '/6wc') {
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmContent = searchParams.get('utm_content')

    // TikTok Bio redirect
    if (
      utmSource?.toLowerCase() === 'tiktok' &&
      utmMedium === 'bio' &&
      utmContent === '6wcv2'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/6wc-tt-bio'
      url.search = '' // Clear all query parameters
      return NextResponse.redirect(url, { status: 307 })
    }

    // TikTok Comment redirect
    if (
      utmSource?.toLowerCase() === 'tiktok' &&
      utmMedium === 'comment' &&
      utmContent === '6wcv2'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/6wc-tt-comment'
      url.search = '' // Clear all query parameters
      return NextResponse.redirect(url, { status: 307 })
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
