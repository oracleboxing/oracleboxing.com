import { NextRequest, NextResponse } from 'next/server'
import { createWorkflowLogger } from '@/lib/workflow-logger'
import { z } from 'zod'
import { validateJsonBody } from '@/lib/security/request-validation'

const CLAIM_ACCESS_WEBHOOK_URL = process.env.MAKE_CLAIM_ACCESS_WEBHOOK_URL?.replace(/^["'\s]+|["'\s]+$/g, '') || ''
const claimAccessSchema = z.object({
  email: z.string().trim().email(),
})

export async function POST(req: NextRequest) {
  const logger = createWorkflowLogger({ workflowName: 'claim-access', workflowType: 'action', notifySlack: true });
  try {
    const parsed = await validateJsonBody(req, claimAccessSchema)
    if (!parsed.success) return parsed.response
    const { email } = parsed.data

    if (!CLAIM_ACCESS_WEBHOOK_URL) {
      return NextResponse.json(
        { error: 'Claim access webhook is not configured' },
        { status: 500 }
      )
    }

    try { await logger.started('Access claim requested', { email }); } catch {}

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
      try { await logger.completed(`Access claimed for ${email}`, { email }); } catch {}
      return NextResponse.json({ success: true })
    } else {
      console.error('❌ Webhook responded with error:', response.status)
      const responseText = await response.text()
      console.error('Response:', responseText)
      try { await logger.failed(`Webhook returned ${response.status}`, { email, webhookStatus: response.status }); } catch {}
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    console.error('❌ Failed to send course access claim:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    const stack = error instanceof Error ? error.stack : undefined
    try { await logger.failed(message, { stack }); } catch {}
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
