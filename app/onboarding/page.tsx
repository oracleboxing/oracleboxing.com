'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { getCalApi } from '@calcom/embed-react'
import { ArrowButton } from '@/components/ui/arrow-button'

function OnboardingContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''

  // Extract first name from full name
  const firstName = name.split(' ')[0] || 'there'

  // Calculate graduation date (today + 21 days)
  const graduationDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + 21)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }, [])

  // Initialize Cal.com embed
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'challenge-graduation' })
      cal('ui', { theme: 'light', hideEventTypeDetails: false, layout: 'month_view' })
    })()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Main layout with gutters */}
      <div className="flex min-h-screen">
        {/* Left gutter - diagonal stripes */}
        <div
          className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 11px,
              rgba(55,50,47,0.06) 11px,
              rgba(55,50,47,0.06) 12px
            )`
          }}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <header className="pt-12 sm:pt-16 md:pt-20 pb-8 px-6">
            <div className="max-w-[700px] mx-auto text-center">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl text-[#37322F] tracking-tight"
                style={{ fontFamily: 'ClashDisplay, sans-serif' }}
              >
                Welcome, {firstName}
              </h1>
              <p className="mt-3 text-[#605A57] text-lg">
                Let&apos;s get you set up for the challenge
              </p>
            </div>
          </header>

          {/* Content */}
          <div className="max-w-[700px] mx-auto px-6 pb-16">
            {/* Video Section */}
            <section className="mb-14">
              <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                First, watch this
              </p>

              <h2
                className="text-xl sm:text-2xl text-[#37322F] mb-3"
                style={{ fontFamily: 'ClashDisplay, sans-serif' }}
              >
                Your Quick Start Video
              </h2>
              <p className="text-[#605A57] mb-6">
                This 3-minute video covers everything you need to know to get the most out of your challenge.
              </p>

              {/* Video container */}
              <div className="border border-[rgba(55,50,47,0.12)] rounded-lg overflow-hidden bg-[#fafaf9]">
                <video
                  className="w-full aspect-video"
                  controls
                  playsInline
                  preload="metadata"
                  poster="https://sb.oracleboxing.com/Website/onboarding_thumbnail.webp"
                >
                  <source src="https://sb.oracleboxing.com/Website/onboarding_1.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[rgba(55,50,47,0.12)] my-10" />

            {/* Book Call Section */}
            <section>
              <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                Then, book your call
              </p>

              <h2
                className="text-xl sm:text-2xl text-[#37322F] mb-3"
                style={{ fontFamily: 'ClashDisplay, sans-serif' }}
              >
                Schedule Your Graduation Call
              </h2>
              <p className="text-[#605A57] mb-2">
                Pick a time for your 1-on-1 graduation call with a coach. Aim for{' '}
                <span className="font-medium text-[#37322F]">{graduationDate}</span>{' '}
                or as close to that date as you can.
              </p>
              <p className="text-[#605A57] mb-8">
                This is where you&apos;ll review your progress and receive your certificate.
              </p>

              {/* Cal.com booking button */}
              <div
                data-cal-namespace="challenge-graduation"
                data-cal-link="team/oracle-boxing/challenge-graduation"
                data-cal-config={JSON.stringify({
                  layout: 'month_view',
                  theme: 'light',
                  email: email,
                })}
                className="inline-block cursor-pointer"
              >
                <ArrowButton>Book Your Graduation Call</ArrowButton>
              </div>

              <p className="text-sm text-[#847971] mt-6">
                This booking is required to unlock your course content.
                <br />
                <span className="text-[#605A57]">Don&apos;t worry — you can reschedule later if needed.</span>
              </p>
            </section>
          </div>
        </div>

        {/* Right gutter - diagonal stripes */}
        <div
          className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 11px,
              rgba(55,50,47,0.06) 11px,
              rgba(55,50,47,0.06) 12px
            )`
          }}
        />
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#847971]">Loading...</div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}

