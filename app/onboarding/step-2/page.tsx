'use client'

export default function OnboardingStep2Page() {
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
          <div className="max-w-[600px] mx-auto px-6 py-16 sm:py-24">
            {/* Success indicator - simple checkmark */}
            <div className="flex justify-center mb-6">
              <span className="text-4xl text-[#37322F]">✓</span>
            </div>

            {/* Header */}
            <h1
              className="text-3xl sm:text-4xl text-[#37322F] text-center mb-3"
              style={{ fontFamily: 'ClashDisplay, sans-serif' }}
            >
              You&apos;re all set
            </h1>

            <p className="text-lg text-[#605A57] text-center mb-12">
              Your graduation call has been booked.
            </p>

            {/* Email instruction */}
            <div className="border border-[rgba(55,50,47,0.12)] rounded-lg p-6 sm:p-8 mb-6">
              <h2
                className="text-lg sm:text-xl text-[#37322F] mb-2"
                style={{ fontFamily: 'ClashDisplay, sans-serif' }}
              >
                Check your email
              </h2>
              <p className="text-[#605A57] leading-relaxed">
                Accept the invite to Oracle Boxing in your inbox. This will unlock your course content and get you started.
              </p>
            </div>

            <p className="text-sm text-[#847971] text-center mb-12">
              Purchased additional courses? You&apos;ll have separate invites for those.
            </p>

            {/* Divider */}
            <div className="border-t border-[rgba(55,50,47,0.12)] my-10" />

            {/* What's next section */}
            <div>
              <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-6 text-center">
                What happens next
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="text-[#37322F] font-medium w-6 flex-shrink-0">1.</span>
                  <span className="text-[#605A57]">Accept the Skool invite in your email</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#37322F] font-medium w-6 flex-shrink-0">2.</span>
                  <span className="text-[#605A57]">Watch the introduction video to get started</span>
                </div>
              </div>
            </div>
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
