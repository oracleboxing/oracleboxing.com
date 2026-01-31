import { NextRequest, NextResponse } from 'next/server'

const CLAIM_ACCESS_WEBHOOK_URL = process.env.MAKE_CLAIM_ACCESS_WEBHOOK_URL?.replace(/^["'\s]+|["'\s]+$/g, '') || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    console.log('📤 Sending course access claim to webhook:', email)

    // Send to Make.com webhook
    const response = await fetch(CLAIM_ACCESS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        timestamp: new Date().toISOString(),
        source: 'claim_access_page',
      })
    })

    if (response.ok) {
      console.log('✅ Course access claim sent successfully')
      return NextResponse.json({ success: true })
    } else {
      console.error('❌ Webhook responded with error:', response.status)
      const responseText = await response.text()
      console.error('Response:', responseText)
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Failed to send course access claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
