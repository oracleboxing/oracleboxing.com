// Facebook Conversions API Parameter Builder
// Handles fbc, fbp, client_ip_address, and normalized PII extraction

import { NextRequest } from 'next/server'

/**
 * Extract Facebook parameters from request
 * This follows Meta's best practices for parameter collection
 */
export interface FacebookParams {
  fbc?: string
  fbp?: string
  client_ip_address?: string
  client_user_agent?: string
  fbclid?: string
}

/**
 * Extract Facebook click ID (fbclid) from URL parameters
 */
export function extractFbclid(url: string): string | undefined {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('fbclid') || undefined
  } catch {
    return undefined
  }
}

/**
 * Build _fbc cookie value from fbclid
 * Format: fb.{domain}.{timestamp}.{fbclid}
 */
export function buildFbcFromFbclid(fbclid: string, domain: string = 'oracleboxing.com'): string {
  const timestamp = Date.now()
  // Remove subdomains, keep only main domain
  const mainDomain = domain.split('.').slice(-2).join('.')
  return `fb.1.${timestamp}.${fbclid}`
}

/**
 * Extract _fbc (Facebook Click ID) cookie
 * Priority: existing cookie > build from fbclid parameter
 */
export function extractFbc(
  cookies: Record<string, string>,
  urlParams: Record<string, string> = {},
  referer?: string
): string | undefined {
  // 1. Check existing _fbc cookie
  if (cookies._fbc) {
    return cookies._fbc
  }

  // 2. Check for fbclid in URL parameters
  const fbclid = urlParams.fbclid
  if (fbclid) {
    return buildFbcFromFbclid(fbclid)
  }

  // 3. Check referer URL for fbclid
  if (referer) {
    const refererFbclid = extractFbclid(referer)
    if (refererFbclid) {
      return buildFbcFromFbclid(refererFbclid)
    }
  }

  return undefined
}

/**
 * Extract _fbp (Facebook Browser ID) cookie
 * This is set by the Facebook Pixel
 */
export function extractFbp(cookies: Record<string, string>): string | undefined {
  return cookies._fbp || undefined
}

/**
 * Extract client IP address from request
 * Handles proxies and load balancers
 */
export function extractClientIp(request: NextRequest): string | undefined {
  // Priority order for IP extraction
  const headers = request.headers

  // 1. X-Forwarded-For (most common with proxies/load balancers)
  const xForwardedFor = headers.get('x-forwarded-for')
  if (xForwardedFor) {
    // Take the first IP in the chain (original client IP)
    return xForwardedFor.split(',')[0].trim()
  }

  // 2. X-Real-IP (nginx proxy)
  const xRealIp = headers.get('x-real-ip')
  if (xRealIp) {
    return xRealIp
  }

  // 3. CF-Connecting-IP (Cloudflare)
  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // 4. True-Client-IP (Akamai, Cloudflare)
  const trueClientIp = headers.get('true-client-ip')
  if (trueClientIp) {
    return trueClientIp
  }

  return undefined
}

/**
 * Extract client user agent from request
 */
export function extractUserAgent(request: NextRequest): string | undefined {
  return request.headers.get('user-agent') || undefined
}

/**
 * Parse cookies from request into a key-value object
 */
export function parseCookies(request: NextRequest): Record<string, string> {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return {}

  const cookies: Record<string, string> = {}
  cookieHeader.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=')
    if (key && value) {
      cookies[key] = decodeURIComponent(value)
    }
  })
  return cookies
}

/**
 * Parse URL search parameters into a key-value object
 */
export function parseUrlParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url)
    const params: Record<string, string> = {}
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  } catch {
    return {}
  }
}

/**
 * Extract all Facebook parameters from a Next.js request
 * This is the main function to use in API routes
 */
export function extractFacebookParams(request: NextRequest): FacebookParams {
  const cookies = parseCookies(request)
  const url = request.url
  const urlParams = parseUrlParams(url)
  const referer = request.headers.get('referer') || undefined

  return {
    fbc: extractFbc(cookies, urlParams, referer),
    fbp: extractFbp(cookies),
    client_ip_address: extractClientIp(request),
    client_user_agent: extractUserAgent(request),
    fbclid: urlParams.fbclid,
  }
}

/**
 * Normalize and hash email for Facebook Conversions API
 * Follows Meta's normalization best practices
 */
export function normalizeAndHashEmail(email: string): string {
  if (!email) return ''

  // 1. Remove leading/trailing whitespace
  let normalized = email.trim()

  // 2. Convert to lowercase
  normalized = normalized.toLowerCase()

  // 3. Remove dots from Gmail addresses (before @)
  const [localPart, domain] = normalized.split('@')
  if (domain === 'gmail.com') {
    normalized = localPart.replace(/\./g, '') + '@' + domain
  }

  // 4. Hash using SHA-256
  return hashSHA256(normalized)
}

/**
 * Normalize and hash phone number for Facebook Conversions API
 * Follows Meta's normalization best practices
 */
export function normalizeAndHashPhone(phone: string): string {
  if (!phone) return ''

  // 1. Remove all non-digit characters
  let normalized = phone.replace(/\D/g, '')

  // 2. If starts with country code, keep it; otherwise assume US (+1)
  if (!normalized.startsWith('1') && normalized.length === 10) {
    normalized = '1' + normalized
  }

  // 3. Hash using SHA-256
  return hashSHA256(normalized)
}

/**
 * SHA-256 hash function (server-side only)
 * Uses Node.js crypto module
 */
function hashSHA256(input: string): string {
  if (typeof window !== 'undefined') {
    // Client-side: return unhashed (should not be called client-side)
    console.warn('SHA-256 hashing should only be done server-side')
    return input
  }

  // Server-side: use Node.js crypto
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(input).digest('hex')
}

/**
 * Build Facebook Conversions API user data object
 * This combines all user parameters for CAPI events
 */
export interface FacebookUserData {
  em?: string // hashed email
  ph?: string // hashed phone
  client_ip_address?: string
  client_user_agent?: string
  fbc?: string
  fbp?: string
  external_id?: string // hashed email for user matching (same as em but not in array)
}

export function buildFacebookUserData(params: {
  email?: string
  phone?: string
  clientIpAddress?: string
  clientUserAgent?: string
  fbc?: string
  fbp?: string
  customerId?: string
}): FacebookUserData {
  const userData: FacebookUserData = {}

  // Email: both em (array) and external_id (string) for better matching
  if (params.email) {
    const hashedEmail = normalizeAndHashEmail(params.email)
    userData.em = hashedEmail
    // external_id improves match rate by providing additional matching key
    userData.external_id = hashedEmail
  }

  if (params.phone) {
    userData.ph = normalizeAndHashPhone(params.phone)
  }

  if (params.clientIpAddress) {
    userData.client_ip_address = params.clientIpAddress
  }

  if (params.clientUserAgent) {
    userData.client_user_agent = params.clientUserAgent
  }

  if (params.fbc) {
    userData.fbc = params.fbc
  }

  if (params.fbp) {
    userData.fbp = params.fbp
  }

  // If customerId provided, override external_id
  if (params.customerId) {
    userData.external_id = params.customerId
  }

  return userData
}
