import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 60 // ISR: revalidate every 60 seconds

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('id, name, page, element, variants, optimize_for, status, winner')
      .in('status', ['active', 'completed'])

    if (error) {
      console.error('Failed to fetch active experiments:', error)
      return NextResponse.json({ tests: [] }, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
      })
    }

    return NextResponse.json({ tests: data || [] }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    })
  } catch (error) {
    console.error('Error in /api/experiments/active:', error)
    return NextResponse.json({ tests: [] }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    })
  }
}
