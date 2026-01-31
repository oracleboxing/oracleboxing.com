/**
 * POST /api/progress-tracker
 *
 * Receives progress tracker form submissions and forwards them to Make.com
 * for automation processing (e.g., setting up accountability tracking).
 *
 * Required environment variable:
 *   MAKE_PROGRESS_TRACKER_WEBHOOK_URL - The Make.com webhook URL to forward submissions to
 *
 * Request body:
 *   - name: string (2-60 chars)
 *   - email: string (valid email format)
 *   - weeklyTarget: number (integer 1-7)
 *
 * Response:
 *   - 200: { ok: true }
 *   - 400: { ok: false, error: "validation error message" }
 *   - 429: { ok: false, error: "Too many requests" }
 *   - 500: { ok: false, error: "Failed to process request" }
 */

import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting
// Maps IP -> { count, resetTime }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5 // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  record.count++
  return false
}

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip)
    }
  }
}, 5 * 60 * 1000)

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = req.headers.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown'

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { name, email, weeklyTarget } = body

    // Validate name
    if (typeof name !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Name is required' },
        { status: 400 }
      )
    }
    const sanitizedName = name.trim()
    if (sanitizedName.length < 2 || sanitizedName.length > 60) {
      return NextResponse.json(
        { ok: false, error: 'Name must be between 2 and 60 characters' },
        { status: 400 }
      )
    }

    // Validate email
    if (typeof email !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Email is required' },
        { status: 400 }
      )
    }
    const sanitizedEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate weeklyTarget
    const parsedTarget = Number(weeklyTarget)
    if (!Number.isInteger(parsedTarget) || parsedTarget < 1 || parsedTarget > 7) {
      return NextResponse.json(
        { ok: false, error: 'Weekly target must be a number between 1 and 7' },
        { status: 400 }
      )
    }

    // Get webhook URL from environment variable (strip quotes/whitespace if present)
    const webhookUrl = process.env.MAKE_PROGRESS_TRACKER_WEBHOOK_URL?.replace(/^["'\s]+|["'\s]+$/g, '')
    if (!webhookUrl) {
      console.error('MAKE_PROGRESS_TRACKER_WEBHOOK_URL environment variable is not set')
      return NextResponse.json(
        { ok: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Build payload with server-side date
    const today = new Date()
    const startDate = today.toISOString().split('T')[0] // YYYY-MM-DD format

    const payload = {
      name: sanitizedName,
      email: sanitizedEmail,
      weeklyTarget: parsedTarget,
      startDate,
    }

    // Forward to Make.com webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      // Log error without exposing webhook URL
      console.error('Make.com webhook returned non-2xx status:', response.status)
      return NextResponse.json(
        { ok: false, error: 'Failed to process request. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Progress tracker API error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { ok: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
