'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { getCalApi } from '@calcom/embed-react'
import { EmailSniperLink } from '@/components/EmailSniperLink'

function OnboardingContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''

  const firstName = name.split(' ')[0] || 'there'

  // Calculate graduation date (today + 21 days)
  const graduationDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + 21)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
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
      <div className="flex min-h-screen">
        {/* Left gutter */}
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
        <div className="flex-1 min-w-0 flex items-center justify-center px-6 py-16">
          <div className="max-w-[560px] w-full">
            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-3">
                Welcome to Oracle Boxing
              </p>
              <p className="text-title text-[#605A57]">
                There&apos;s <span className="underline decoration-2 underline-offset-4">one thing you need to do right now</span>.
              </p>
            </div>

            {/* The key message */}
            <div className="bg-[#37322F] text-white rounded-2xl p-6 sm:p-8 mb-6">
              <h2
                className="text-sub font-bold mb-4 leading-snug"
              >
                Book your graduation call
              </h2>

              <div className="space-y-4 text-[#d4d0cd] text-body leading-relaxed">
                <p>
                  Your graduation call is a 1-on-1 session with a coach at the end of your challenge. It&apos;s a <span className="text-white font-medium">requirement</span> to complete the program.
                </p>
                <p>
                  Once you book it, we&apos;ll send you an invite to the <span className="text-white font-medium">Skool community</span> where everything lives: your courses, the coaching calls, and everyone else on the challenge.
                </p>
                <p>
                  No booking = no community access. So please do this now.
                </p>
              </div>

              {/* CTA Button - light mode with glow */}
              <div
                data-cal-namespace="challenge-graduation"
                data-cal-link="team/oracle-boxing/challenge-graduation"
                data-cal-config={JSON.stringify({
                  layout: 'month_view',
                  theme: 'light',
                  email: email,
                })}
                className="cursor-pointer mt-6"
              >
                <button
                  className="w-full bg-white text-[#37322F] font-bold text-title py-5 rounded-xl hover:bg-gray-50 transition-colors"
                  style={{
                    animation: 'wobble 2s ease-in-out infinite',
                    boxShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  Book Your Graduation Call
                </button>
              </div>

              {/* Target date */}
              <div className="mt-6 bg-white/10 rounded-xl p-4">
                <p className="text-sm text-[#a09a96] mb-1">Book it for around</p>
                <p className="text-sub font-bold text-white">{graduationDate}</p>
                <p className="text-sm text-[#a09a96] mt-1">A few days either side is fine. You can always reschedule.</p>
              </div>
            </div>

            {/* Keyframe animations */}
            <style jsx>{`
              @keyframes wobble {
                0%, 100% { transform: translateY(0) scale(1); }
                25% { transform: translateY(-4px) scale(1.01); }
                50% { transform: translateY(0) scale(1); }
                75% { transform: translateY(-2px) scale(1.005); }
              }
            `}</style>

            {/* Important note */}
            <div className="mt-5 text-center space-y-2">
              <p className="text-sm text-[#605A57]">
                Use the <span className="font-medium text-[#37322F]">same email address</span> you purchased with.
              </p>
              <p className="text-xs text-[#847971]">
                Need to reschedule later? No problem. Just book something now to unlock your access.
              </p>
            </div>

            {/* Email sniper link */}
            <div className="mt-8">
              <EmailSniperLink
                message="Already booked? Check your email for the Skool community invite."
                sender="noreply@skool.com"
              />
            </div>
          </div>
        </div>

        {/* Right gutter */}
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
