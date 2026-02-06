import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { id, result } = await request.json()

    if (!id || !result) {
      return NextResponse.json({ error: 'Missing id or result' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { error } = await supabase
      .from('quiz_results')
      .upsert({
        id,
        responses: result.responses || {},
        scores: result, // Store the full diagnostic result in scores jsonb
        total: result.percentage || 0,
        level_name: result.level || '',
        level_description: `${result.totalCorrect}/${result.totalQuestions}`,
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error saving quiz result:', e)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
