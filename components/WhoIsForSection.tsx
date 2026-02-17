"use client"

const forYou = [
  "You want proper coaching on fundamentals",
  "You train at home and want to actually improve",
  "You're preparing for a fight",
  "You're open to honest, direct feedback",
  "You're willing to contribute to the community",
]

const notForYou = [
  "You're not willing to put in the reps",
  "You're an active amateur or pro",
  "You train MMA or kickboxing, not boxing",
  "You can't handle being critiqued",
  "You expect results without the work",
]

function GlassPill({ text, variant }: { text: string; variant: "yes" | "no" }) {
  const isYes = variant === "yes"
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{
      background: isYes ? 'rgba(156, 171, 168, 0.08)' : 'rgba(183, 135, 128, 0.06)',
      border: `1px solid ${isYes ? 'rgba(156, 171, 168, 0.2)' : 'rgba(183, 135, 128, 0.15)'}`,
    }}>
      {isYes ? (
        <div className="w-5 h-5 rounded-full bg-[#9CABA8]/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-[#7A8C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-[#B78780]/15 flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-[#B78780]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
      <span className="text-[#37322F] text-[13px] md:text-sm font-medium">{text}</span>
    </div>
  )
}

export function IsForYouSection() {
  return null // Now rendered inside WhoIsForSection
}

export function NotForYouSection() {
  return null // Now rendered inside WhoIsForSection
}

export default function WhoIsForSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[#37322F] text-hero font-normal mb-4">
            Is This For You?
          </h2>
          <p className="text-[#605A57] text-sub max-w-[500px] mx-auto">
            We're not for everyone. And that's by design.
          </p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* For you */}
          <div className="rounded-2xl p-6 md:p-8" style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(16px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}>
            <h3 className="text-[#37322F] text-lg md:text-xl font-semibold mb-5">This is for you if...</h3>
            <div className="flex flex-col gap-2.5">
              {forYou.map((item, i) => (
                <GlassPill key={i} text={item} variant="yes" />
              ))}
            </div>
          </div>

          {/* Not for you */}
          <div className="rounded-2xl p-6 md:p-8" style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(16px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}>
            <h3 className="text-[#37322F] text-lg md:text-xl font-semibold mb-5">This is NOT for you if...</h3>
            <div className="flex flex-col gap-2.5">
              {notForYou.map((item, i) => (
                <GlassPill key={i} text={item} variant="no" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
