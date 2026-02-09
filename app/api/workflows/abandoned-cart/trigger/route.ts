import { NextRequest, NextResponse } from 'next/server'
import { start } from 'workflow/api'
import { abandonedCartRecovery } from '../workflow'

interface CheckoutData {
  paymentIntentId: string
  email: string | null
  phone: string | null
  firstName: string | null
  lastName: string | null
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutData = await req.json()

    if (!body.paymentIntentId) {
      return NextResponse.json(
        { error: 'paymentIntentId is required' },
        { status: 400 }
      )
    }

    const run = await start(abandonedCartRecovery, [JSON.stringify(body)])

    return NextResponse.json({ success: true, runId: run.runId })
  } catch (error: any) {
    console.error('Failed to start abandoned cart workflow:', error)
    return NextResponse.json(
      { error: 'Failed to start workflow' },
      { status: 500 }
    )
  }
}
