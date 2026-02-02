import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { id, name, email } = await request.json()

    // Validate inputs
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!id || !uuidRegex.test(id) || !name?.trim() || !email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { error } = await supabase
      .from('quiz_results')
      .update({ name, email })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error capturing email:', e)
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 })
  }
}
