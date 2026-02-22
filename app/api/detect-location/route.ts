import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Priority 1: Check for test mode (for development testing)
    const testCountry = request.nextUrl.searchParams.get('test_country');
    if (testCountry) {
      return NextResponse.json({ country_code: testCountry.toUpperCase() });
    }

    // Priority 2: Use Vercel's built-in geolocation headers (production)
    // These are automatically provided by Vercel Edge Network - no rate limits!
    const vercelCountry = request.headers.get('x-vercel-ip-country');
    const vercelCity = request.headers.get('x-vercel-ip-city');
    const vercelRegion = request.headers.get('x-vercel-ip-country-region');

    if (vercelCountry) {
      return NextResponse.json({
        country_code: vercelCountry,
        country_name: vercelCountry, // Vercel provides 2-letter code
        city: vercelCity || undefined,
        region: vercelRegion || undefined,
        source: 'vercel'
      });
    }

    // Priority 3: Fallback to ipapi.co for localhost development
    // Get client IP from request headers
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '';

    // Check for localhost/reserved IPs
    const isLocalhost = !clientIp || clientIp === '::1' || clientIp === '127.0.0.1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.') || clientIp.startsWith('172.');

    if (isLocalhost) {
      return NextResponse.json({ country_code: 'US', source: 'localhost-fallback' });
    }

    // Use ipapi.co as fallback for localhost development with real IPs
    const url = `https://ipapi.co/${clientIp}/json/`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'oracleboxing.com/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`ipapi.co returned ${response.status}, using US fallback`);
      return NextResponse.json({ country_code: 'US', source: 'ipapi-error-fallback' });
    }

    const data = await response.json();

    if (data.error) {
      console.warn('ipapi.co error:', data.reason || 'Unknown error');
      return NextResponse.json({ country_code: 'US', source: 'ipapi-error-fallback' });
    }

    return NextResponse.json({
      country_code: data.country_code,
      country_name: data.country_name,
      city: data.city,
      source: 'ipapi'
    });
  } catch (error) {
    console.error('Location detection error:', error);
    return NextResponse.json({ country_code: 'US', source: 'error-fallback' });
  }
}
