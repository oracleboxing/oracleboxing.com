import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

/**
 * Update split payment status - called by Make.com after processing the second payment
 *
 * POST body:
 * - split_payment_id: The Supabase record ID
 * - status: 'completed' | 'failed'
 * - second_payment_intent_id: (optional) The PaymentIntent ID for successful payments
 * - error_message: (optional) Error message for failed payments
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      split_payment_id,
      status,
      second_payment_intent_id,
      error_message,
    } = body

    if (!split_payment_id || !status) {
      return NextResponse.json(
        { error: 'split_payment_id and status are required' },
        { status: 400 }
      )
    }

    if (!['completed', 'failed'].includes(status)) {
      return NextResponse.json(
        { error: 'status must be "completed" or "failed"' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Build update object based on status
    const updateData: Record<string, any> = {
      second_payment_status: status,
    }

    if (status === 'completed') {
      updateData.second_payment_date = new Date().toISOString()
      if (second_payment_intent_id) {
        updateData.second_payment_intent_id = second_payment_intent_id
      }
    } else if (status === 'failed') {
      // Increment retry count and store error
      const { data: current } = await supabase
        .from('coaching_split_payments')
        .select('retry_count')
        .eq('id', split_payment_id)
        .single()

      updateData.retry_count = (current?.retry_count || 0) + 1
      updateData.last_error = error_message || 'Payment failed'
    }

    const { data, error } = await supabase
      .from('coaching_split_payments')
      .update(updateData)
      .eq('id', split_payment_id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating split payment status:', error)
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      )
    }

    console.log(`✅ Split payment ${split_payment_id} updated to: ${status}`)

    return NextResponse.json({
      success: true,
      id: data.id,
      status: data.second_payment_status,
    })
  } catch (error: any) {
    console.error('❌ Error in update-split-payment-status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update payment status' },
      { status: 500 }
    )
  }
}
