'use client'

import { Check, Mail } from 'lucide-react'

export default function OnboardingStep2Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-20">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-[#37322F] text-center mb-4" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
          You&apos;re All Set!
        </h1>

        <p className="text-lg text-[#605A57] text-center mb-10">
          Your graduation call has been booked.
        </p>

        {/* Email instruction card */}
        <div className="bg-[#f9f8f6] border border-[#e5e2dc] rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#37322F] flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#37322F] mb-2">
                Check your email
              </h2>
              <p className="text-[#605A57] leading-relaxed">
                Go to your email and <span className="font-medium text-[#37322F]">accept the most recent invite to Oracle Boxing</span>. This will unlock your course content.
              </p>
            </div>
          </div>
        </div>

        {/* Additional courses note */}
        <div className="text-center">
          <p className="text-sm text-[#847971]">
            If you also purchased additional courses, you&apos;ll have separate invites to unlock those.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-10" />

        {/* What's next section */}
        <div className="text-center">
          <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
            What happens next
          </p>
          <div className="space-y-3 text-[#605A57]">
            <p>1. Accept the Skool invite in your email</p>
            <p>2. Watch the introduction video</p>
          </div>
        </div>
      </div>
    </div>
  )
}
