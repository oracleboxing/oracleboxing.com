"use client"
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EmailCaptureForm } from '../components/EmailCaptureForm'
import Link from 'next/link'
import QuizHeader from '../components/QuizHeader'

export default function ResultsTeaserClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <p>Please complete the <Link href="/quiz" className="underline">quiz</Link> first.</p>
          </div>
        </main>
      </div>
    )
  }

  const handleCapture = async (name: string, email: string) => {
    await fetch('/api/quiz/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, email }),
    })
    router.push(`/quiz/results/${id}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6 bg-white border border-neutral-200 shadow-md p-6 rounded-lg mx-4 text-neutral-900">
          <h2 className="text-2xl font-semibold">You&apos;re almost there!</h2>
          <p className="text-neutral-600">
            Enter your name and email to unlock your full personalized boxing results report.
          </p>
          {/* Teaser blurred preview */}
          <div className="h-32 bg-neutral-800 rounded mb-4 animate-pulse" />
          <EmailCaptureForm onSubmit={handleCapture} />
        </div>
      </main>
    </div>
  )
}
