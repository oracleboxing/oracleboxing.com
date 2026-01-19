'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { getCalApi } from '@calcom/embed-react'
import { Calendar } from 'lucide-react'

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
      {/* Header */}
      <header className="border-b border-gray-200 py-6 px-6">
        <h1 className="text-2xl font-semibold text-[#37322F] font-sans text-center">
          Welcome, {firstName}
        </h1>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Step 1: Video Section */}
        <div className="mb-12">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#37322F] text-white text-sm font-semibold">
              1
            </span>
            <span className="text-sm font-medium text-[#847971] uppercase tracking-wider">
              Step 1
            </span>
          </div>

          {/* Important banner */}
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <p className="text-lg font-semibold text-center text-[#37322F]">
              WATCH THIS VIDEO BEFORE YOU DO ANYTHING ELSE
            </p>
            <p className="text-sm text-center mt-2 text-[#605A57]">
              Your onboarding is starting right now.
            </p>
          </div>

          {/* Video placeholder with gold card styling */}
          <div className="gold-card rounded-2xl overflow-hidden relative">
            {/* Animated flowing ribbons background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="ribbon-gold ribbon-gold-1" />
              <div className="ribbon-gold ribbon-gold-2" />
              <div className="ribbon-gold ribbon-gold-3" />
            </div>

            <div className="relative aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#1a1611]/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#1a1611]/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-[#5c4a36] font-medium">Onboarding video coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Book Call Section */}
        <div>
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#37322F] text-white text-sm font-semibold">
              2
            </span>
            <span className="text-sm font-medium text-[#847971] uppercase tracking-wider">
              Step 2
            </span>
          </div>

          <h2 className="text-xl font-semibold text-[#37322F] mb-2">
            Book Your Challenge Graduation Call
          </h2>
          <p className="text-[#605A57] mb-2">
            Schedule your 1-on-1 graduation call with a coach for <span className="font-semibold text-[#37322F]">{graduationDate}</span> (or as close to that date as possible).
          </p>
          <p className="text-[#605A57] mb-6">
            This is where you&apos;ll review your progress and get your certificate.
          </p>

          {/* Cal.com booking button */}
          <button
            data-cal-namespace="challenge-graduation"
            data-cal-link="team/oracle-boxing/challenge-graduation"
            data-cal-config={JSON.stringify({
              layout: 'month_view',
              theme: 'light',
              email: email,
            })}
            className="w-full h-14 px-8 bg-[#37322F] text-white rounded-lg font-semibold text-base font-sans cursor-pointer hover:bg-[#49423D] transition-colors flex items-center justify-center gap-3"
          >
            <Calendar className="w-5 h-5" />
            Click Here to Book Your Graduation Call
          </button>

          <p className="text-sm text-[#847971] text-center mt-4">
            <span className="font-medium text-[#37322F]">Required to unlock course content</span>
            {' '}&mdash; you can reschedule later if needed
          </p>
        </div>
      </div>

      <style jsx global>{`
        /* Metallic gold card */
        .gold-card {
          background: linear-gradient(
            135deg,
            #f5e6c8 0%,
            #e8d48b 15%,
            #fff8dc 35%,
            #e8d48b 50%,
            #d4c47a 65%,
            #fff8dc 80%,
            #e8d48b 100%
          );
          box-shadow:
            0 4px 20px rgba(212, 175, 55, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
        }
        /* Gold ribbons */
        .ribbon-gold {
          position: absolute;
          width: 200%;
          height: 80px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.25) 20%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0.25) 80%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(15px);
        }
        .ribbon-gold-1 {
          top: 10%;
          left: -50%;
          transform: rotate(-15deg);
          animation: driftGold1 8s ease-in-out infinite;
        }
        .ribbon-gold-2 {
          top: 40%;
          left: -30%;
          height: 100px;
          transform: rotate(10deg);
          animation: driftGold2 10s ease-in-out infinite;
          animation-delay: -2s;
        }
        .ribbon-gold-3 {
          top: 70%;
          left: -40%;
          height: 60px;
          transform: rotate(-8deg);
          animation: driftGold3 7s ease-in-out infinite;
          animation-delay: -4s;
        }
        @keyframes driftGold1 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-15deg);
            opacity: 0.6;
          }
          50% {
            transform: translateX(80%) translateY(10px) rotate(-10deg);
            opacity: 0.9;
          }
        }
        @keyframes driftGold2 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(10deg);
            opacity: 0.5;
          }
          50% {
            transform: translateX(70%) translateY(-15px) rotate(15deg);
            opacity: 0.85;
          }
        }
        @keyframes driftGold3 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-8deg);
            opacity: 0.55;
          }
          50% {
            transform: translateX(75%) translateY(8px) rotate(-5deg);
            opacity: 0.8;
          }
        }
      `}</style>
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
