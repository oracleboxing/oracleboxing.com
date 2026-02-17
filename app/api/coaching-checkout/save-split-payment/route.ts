import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient, CoachingSplitPaymentRecord } from '@/lib/supabase'
import { createWorkflowLogger } from '@/lib/workflow-logger'

/**
 * Save split payment info to Supabase after first payment succeeds
 * Called from the coaching checkout page after successful payment confirmation
 */
export async function POST(req: NextRequest) {
  const logger = createWorkflowLogger({ workflowName: 'coaching-split-payment-save', workflowType: 'checkout', notifySlack: true });
  try {
    const body = await req.json()
    const {
      customerEmail,
      customerName,
      stripeCustomerId,
      firstPaymentIntentId,
      firstPaymentAmount,
      secondPaymentAmount,
      tier,
      coach,
      sixMonthCommitment,
    } = body

    try { await logger.started('Save split payment requested', { customerEmail, stripeCustomerId, firstPaymentIntentId, secondPaymentAmount, tier, coach }); } catch {}

    // Validate required fields
    if (!customerEmail || !stripeCustomerId || !firstPaymentIntentId || !secondPaymentAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate due date (30 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    const supabase = getSupabaseServerClient()

    // Check if this payment intent already exists
    const { data: existing } = await supabase
      .from('coaching_split_payments')
      .select('id')
      .eq('first_payment_intent_id', firstPaymentIntentId)
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Split payment already recorded',
        id: (existing as any).id,
      })
    }

    // Insert new record
    const record: Omit<CoachingSplitPaymentRecord, 'id' | 'created_at'> = {
      customer_email: customerEmail,
      customer_name: customerName || '',
      stripe_customer_id: stripeCustomerId,
      first_payment_intent_id: firstPaymentIntentId,
      first_payment_date: new Date().toISOString(),
      first_payment_amount: firstPaymentAmount,
      second_payment_amount: secondPaymentAmount,
      second_payment_due_date: dueDate.toISOString(),
      second_payment_status: 'pending',
      second_payment_intent_id: null,
      second_payment_date: null,
      tier: tier || '',
      coach: coach || '',
      six_month_commitment: sixMonthCommitment || false,
      webhook_sent_at: null,
      webhook_response: null,
      retry_count: 0,
      last_error: null,
    }

    const { data, error } = await supabase
      .from('coaching_split_payments')
      .insert(record as any)
      .select()
      .single()

    if (error) {
      console.error('❌ Error saving split payment to Supabase:', error)
      return NextResponse.json(
        { error: 'Failed to save split payment record' },
        { status: 500 }
      )
    }

    console.log('✅ Split payment saved to Supabase:', (data as any).id)

    try { await logger.completed(`Split payment saved for ${customerEmail}`, { id: (data as any).id, email: customerEmail, secondPaymentAmount: secondPaymentAmount / 100, dueDate: dueDate.toISOString(), tier, coach }); } catch {}


    return NextResponse.json({
      success: true,
      id: (data as any).id,
      dueDate: dueDate.toISOString(),
    })
  } catch (error: any) {
    console.error('Route /api/coaching-checkout/save-split-payment failed:', error)
    try { await logger.failed(error.message, { stack: error.stack }); } catch {}
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
