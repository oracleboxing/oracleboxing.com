import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { searchParams } = request.nextUrl
  const testId = searchParams.get('id')
  const metric = searchParams.get('metric') || 'initiate_checkout'

  if (!testId) {
    return NextResponse.json({ error: 'Missing required parameter: id' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServerClient()

    // Fetch the test config
    const { data: test, error: testError } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('id', testId)
      .single()

    if (testError || !test) {
      return NextResponse.json({ error: `Test '${testId}' not found` }, { status: 404 })
    }

    const variantIds = (test.variants as any[]).map(v => v.id)

    // Query page views per variant
    const { data: pageViews } = await supabase
      .from('page_views')
      .select('experiments')
      .not('experiments', 'is', null)
      .filter(`experiments->>${testId}`, 'not.is', null)

    // Query initiate checkouts per variant
    const { data: checkouts } = await supabase
      .from('initiate_checkouts')
      .select('experiments, amount')
      .not('experiments', 'is', null)
      .filter(`experiments->>${testId}`, 'not.is', null)

    // Query purchases per variant
    const { data: purchases } = await supabase
      .from('purchases')
      .select('experiments, amount')
      .not('experiments', 'is', null)
      .filter(`experiments->>${testId}`, 'not.is', null)

    // Query engagement events per variant (from events table)
    const { data: events } = await supabase
      .from('events')
      .select('experiments, event_name, value')
      .not('experiments', 'is', null)
      .filter(`experiments->>${testId}`, 'not.is', null)

    // Aggregate results per variant
    const results: Record<string, {
      variant: string
      page_views: number
      checkouts: number
      purchases: number
      revenue: number
      checkout_rate: number
      purchase_rate: number
      avg_scroll_depth: number
      avg_time_on_page: number
      exit_intents: number
      engagement_events: Record<string, number>
    }> = {}

    for (const vid of variantIds) {
      results[vid] = {
        variant: vid,
        page_views: 0,
        checkouts: 0,
        purchases: 0,
        revenue: 0,
        checkout_rate: 0,
        purchase_rate: 0,
        avg_scroll_depth: 0,
        avg_time_on_page: 0,
        exit_intents: 0,
        engagement_events: {},
      }
    }

    // Count page views per variant
    for (const pv of pageViews || []) {
      const variant = pv.experiments?.[testId]
      if (variant && results[variant]) {
        results[variant].page_views++
      }
    }

    // Count checkouts per variant
    for (const co of checkouts || []) {
      const variant = co.experiments?.[testId]
      if (variant && results[variant]) {
        results[variant].checkouts++
      }
    }

    // Count purchases + revenue per variant
    for (const p of purchases || []) {
      const variant = p.experiments?.[testId]
      if (variant && results[variant]) {
        results[variant].purchases++
        results[variant].revenue += Number(p.amount) || 0
      }
    }

    // Aggregate engagement events per variant
    const scrollDepthSums: Record<string, { total: number; count: number }> = {}
    const timeOnPageSums: Record<string, { total: number; count: number }> = {}

    for (const vid of variantIds) {
      scrollDepthSums[vid] = { total: 0, count: 0 }
      timeOnPageSums[vid] = { total: 0, count: 0 }
    }

    for (const ev of events || []) {
      const variant = ev.experiments?.[testId]
      if (!variant || !results[variant]) continue

      const eventName = ev.event_name
      results[variant].engagement_events[eventName] =
        (results[variant].engagement_events[eventName] || 0) + 1

      if (eventName === 'scroll_depth' && ev.value) {
        scrollDepthSums[variant].total += Number(ev.value)
        scrollDepthSums[variant].count++
      }

      if (eventName === 'time_on_page' && ev.value) {
        timeOnPageSums[variant].total += Number(ev.value)
        timeOnPageSums[variant].count++
      }

      if (eventName === 'exit_intent') {
        results[variant].exit_intents++
      }
    }

    // Calculate rates and averages
    for (const vid of variantIds) {
      const r = results[vid]
      r.checkout_rate = r.page_views > 0 ? r.checkouts / r.page_views : 0
      r.purchase_rate = r.page_views > 0 ? r.purchases / r.page_views : 0
      r.avg_scroll_depth = scrollDepthSums[vid].count > 0
        ? scrollDepthSums[vid].total / scrollDepthSums[vid].count
        : 0
      r.avg_time_on_page = timeOnPageSums[vid].count > 0
        ? timeOnPageSums[vid].total / timeOnPageSums[vid].count
        : 0
    }

    // Calculate statistical significance (z-test for proportions)
    let significance = null
    if (variantIds.length === 2) {
      const [a, b] = variantIds
      const ra = results[a]
      const rb = results[b]

      // Use the configured optimize_for metric
      let pA = 0, pB = 0, nA = 0, nB = 0
      if (metric === 'purchase' || metric === 'purchases') {
        pA = ra.purchase_rate; pB = rb.purchase_rate
        nA = ra.page_views; nB = rb.page_views
      } else {
        pA = ra.checkout_rate; pB = rb.checkout_rate
        nA = ra.page_views; nB = rb.page_views
      }

      if (nA > 0 && nB > 0) {
        const pPooled = (pA * nA + pB * nB) / (nA + nB)
        const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / nA + 1 / nB))
        const zScore = se > 0 ? (pB - pA) / se : 0
        // Two-tailed p-value approximation
        const pValue = 2 * (1 - normalCDF(Math.abs(zScore)))

        significance = {
          metric,
          z_score: Math.round(zScore * 1000) / 1000,
          p_value: Math.round(pValue * 10000) / 10000,
          significant_at_95: pValue < 0.05,
          significant_at_99: pValue < 0.01,
          leading_variant: pB > pA ? b : a,
          lift_percent: pA > 0 ? Math.round(((pB - pA) / pA) * 10000) / 100 : null,
        }
      }
    }

    return NextResponse.json({
      test: {
        id: test.id,
        name: test.name,
        status: test.status,
        optimize_for: test.optimize_for,
        start_date: test.start_date,
        winner: test.winner,
      },
      variants: Object.values(results),
      significance,
    })
  } catch (error: any) {
    console.error('Error fetching experiment results:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** Standard normal CDF approximation */
function normalCDF(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x)
  const t = 1.0 / (1.0 + p * absX)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2)
  return 0.5 * (1.0 + sign * y)
}
