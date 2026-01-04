"use client"

interface OutcomesIllustrationProps {
  width?: number | string
  height?: number | string
  className?: string
}

export default function OutcomesIllustration({ width = 400, height = 250, className = "" }: OutcomesIllustrationProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      {/* Outcomes Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[300px] flex flex-col gap-4">
          {/* Success Path */}
          <div className="bg-white rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.08)] border border-[rgba(55,50,47,0.08)] overflow-hidden p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-[#37322F] text-sm font-semibold">Challenge Complete</div>
                <div className="text-[#847971] text-xs">Membership unlocked</div>
              </div>
            </div>
            <div className="bg-[#22c55e]/10 rounded-lg p-3 flex items-center justify-between">
              <span className="text-[#22c55e] text-sm font-medium">Credit applied</span>
              <span className="text-[#22c55e] text-lg font-bold">+$147</span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 px-4">
            <div className="flex-1 h-px bg-[rgba(55,50,47,0.12)]"></div>
            <span className="text-[#847971] text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-[rgba(55,50,47,0.12)]"></div>
          </div>

          {/* Refund Path */}
          <div className="bg-white rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.08)] border border-[rgba(55,50,47,0.08)] overflow-hidden p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[rgba(55,50,47,0.12)] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12H21M3 12L9 6M3 12L9 18" stroke="#847971" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-[#37322F] text-sm font-semibold">Not for you?</div>
                <div className="text-[#847971] text-xs">No hard feelings</div>
              </div>
            </div>
            <div className="bg-[#FAFAF8] rounded-lg p-3 flex items-center justify-between">
              <span className="text-[#847971] text-sm font-medium">Full refund</span>
              <span className="text-[#37322F] text-lg font-bold">$147</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
