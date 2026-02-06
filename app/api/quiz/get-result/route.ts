import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('quiz_results')
      .select('scores, name, email')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 })
    }

    return NextResponse.json({
      result: data.scores,
      name: data.name || null,
      email: data.email || null,
    })
  } catch (e) {
    console.error('Error fetching quiz result:', e)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
