import React, { Suspense } from 'react'
import ResultsTeaserClient from './ResultsTeaserClient'

export default function QuizResultsTeaserPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <p className="text-neutral-900">Loading...</p>
      </div>
    }>
      <ResultsTeaserClient />
    </Suspense>
  )
}
