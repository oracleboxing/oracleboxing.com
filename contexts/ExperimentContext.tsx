'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getExperimentCookie } from '@/lib/tracking-cookies'
import type { ActiveTest } from '@/lib/experiments'

interface ExperimentResult {
  variant: string
  config: Record<string, any> | null
}

interface ExperimentContextType {
  /** Get variant + config for a specific test */
  getExperiment: (testId: string) => ExperimentResult
  /** Get all variant assignments as a flat map */
  assignments: Record<string, string>
  isLoading: boolean
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined)

/**
 * Hook to get a specific experiment's variant and config.
 * Returns { variant: 'control', config: null } if test not found.
 */
export function useExperiment(testId: string): ExperimentResult {
  const ctx = useContext(ExperimentContext)
  if (!ctx) {
    return { variant: 'control', config: null }
  }
  return ctx.getExperiment(testId)
}

/**
 * Hook to get all experiment assignments.
 */
export function useExperiments(): Record<string, string> {
  const ctx = useContext(ExperimentContext)
  return ctx?.assignments || {}
}

interface ExperimentProviderProps {
  children: ReactNode
}

export const ExperimentProvider: React.FC<ExperimentProviderProps> = ({ children }) => {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [activeTests, setActiveTests] = useState<ActiveTest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Read assignments from cookie (set by middleware)
    const cookieAssignments = getExperimentCookie()
    setAssignments(cookieAssignments)

    // Fetch active tests for config data
    fetch('/api/experiments/active')
      .then(res => res.ok ? res.json() : { tests: [] })
      .then(data => {
        setActiveTests(data.tests || [])
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const getExperiment = (testId: string): ExperimentResult => {
    const variantId = assignments[testId]
    if (!variantId) {
      return { variant: 'control', config: null }
    }

    // Find the test and its variant config
    const test = activeTests.find(t => t.id === testId)
    if (!test) {
      return { variant: variantId, config: null }
    }

    const variant = test.variants.find(v => v.id === variantId)
    return {
      variant: variantId,
      config: variant?.config || null,
    }
  }

  return (
    <ExperimentContext.Provider value={{ getExperiment, assignments, isLoading }}>
      {children}
    </ExperimentContext.Provider>
  )
}
