import { NextRequest, NextResponse } from 'next/server'
import { start } from 'workflow/api'
import { getSupabaseServerClient } from '@/lib/supabase'
import { processSplitPayment } from '../workflow'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (
      process.env.NODE_ENV === 'production' &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseServerClient()

    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const { data: duePayments, error: fetchError } = await supabase
      .from('coaching_split_payments')
      .select('id, customer_email')
      .eq('second_payment_status', 'pending')
      .lte('second_payment_due_date', today.toISOString())

    if (fetchError) {
      console.error('Failed to fetch due payments:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch due payments' }, { status: 500 })
    }

    if (!duePayments || duePayments.length === 0) {
      return NextResponse.json({ message: 'No payments due', started: 0 })
    }

    const results: { id: string; email: string; status: string }[] = []

    for (const payment of duePayments) {
      try {
        await start(processSplitPayment, [payment.id])
        results.push({ id: payment.id, email: payment.customer_email, status: 'started' })
      } catch (err: any) {
        console.error(`Failed to start workflow for ${payment.id}:`, err.message)
        results.push({ id: payment.id, email: payment.customer_email, status: `error: ${err.message}` })
      }
    }

    const started = results.filter((r) => r.status === 'started').length
    const failed = results.filter((r) => r.status !== 'started').length

    return NextResponse.json({
      message: 'Split payment workflows triggered',
      total: duePayments.length,
      started,
      failed,
      details: results,
    })
  } catch (error: any) {
    console.error('Split payment trigger failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
