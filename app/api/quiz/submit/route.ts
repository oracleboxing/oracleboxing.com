import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { calculateResults } from '@/lib/quiz-data'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { responses } = await request.json()
    // Validate responses object
    if (typeof responses !== 'object' || responses === null || Array.isArray(responses)) {
      return NextResponse.json({ error: 'Invalid responses format' }, { status: 400 })
    }
    // Validate each question response (1-10 between 1 and 4)
    for (let i = 1; i <= 10; i++) {
      const val = (responses as Record<string, unknown>)[i]
      if (typeof val !== 'number' || val < 1 || val > 4) {
        return NextResponse.json({ error: `Invalid response for question ${i}` }, { status: 400 })
      }
    }
    const { scores, total, level } = calculateResults(responses)
    const id = crypto.randomUUID()
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from('quiz_results').insert({
      id,
      responses,
      scores,
      total,
      level_name: level.name,
      level_description: level.description,
    })
    if (error) throw error
    return NextResponse.json({ id, level_name: level.name })
  } catch (e) {
    console.error('Error saving quiz result', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
