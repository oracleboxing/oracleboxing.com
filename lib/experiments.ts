// A/B experiment configuration, variant assignment, and caching
// Used by middleware (edge) and client components

export interface Variant {
  id: string
  weight: number
  config?: Record<string, any>
}

export interface ActiveTest {
  id: string
  name: string
  page: string
  element: string
  variants: Variant[]
  optimize_for: string
  status: string
  winner: string | null
}

// --- In-memory cache for active tests ---
let cachedTests: ActiveTest[] | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60_000 // 60 seconds

/**
 * Fetch active tests from the /api/experiments/active endpoint.
 * Caches results in memory for 60 seconds.
 * Used by middleware and ExperimentContext.
 */
export async function getActiveTests(baseUrl?: string): Promise<ActiveTest[]> {
  const now = Date.now()
  if (cachedTests && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedTests
  }

  try {
    const url = baseUrl
      ? `${baseUrl}/api/experiments/active`
      : '/api/experiments/active'

    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.warn('Failed to fetch active experiments:', res.status)
      return cachedTests || []
    }

    const data = await res.json()
    cachedTests = data.tests || []
    cacheTimestamp = now
    return cachedTests!
  } catch (error) {
    console.warn('Error fetching active experiments:', error)
    return cachedTests || []
  }
}

/**
 * Assign a variant for a test using weighted random selection.
 */
export function assignVariant(variants: Variant[]): string {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
  let random = Math.random() * totalWeight
  for (const variant of variants) {
    random -= variant.weight
    if (random <= 0) return variant.id
  }
  return variants[0].id
}

/**
 * Get variant assignments for all active tests, reusing existing cookie values.
 * Returns updated assignments map.
 */
export function getAssignments(
  existingCookie: Record<string, string>,
  activeTests: ActiveTest[]
): Record<string, string> {
  const assignments = { ...existingCookie }

  for (const test of activeTests) {
    // If test is completed with a winner, always use the winner
    if (test.status === 'completed' && test.winner) {
      assignments[test.id] = test.winner
      continue
    }

    // Only assign new variants for active tests
    if (test.status !== 'active') continue

    // Reuse existing assignment if user already has one for this test
    if (assignments[test.id]) continue

    // New test for this user — assign a variant
    assignments[test.id] = assignVariant(test.variants)
  }

  // Clean up assignments for tests that no longer exist
  // (keep completed test assignments for a grace period)
  const activeTestIds = new Set(activeTests.map(t => t.id))
  for (const testId of Object.keys(assignments)) {
    if (!activeTestIds.has(testId)) {
      delete assignments[testId]
    }
  }

  return assignments
}

/**
 * Get the config for a specific variant of a test.
 */
export function getVariantConfig(
  testId: string,
  variantId: string,
  activeTests: ActiveTest[]
): Record<string, any> | null {
  const test = activeTests.find(t => t.id === testId)
  if (!test) return null

  const variant = test.variants.find(v => v.id === variantId)
  return variant?.config || null
}
