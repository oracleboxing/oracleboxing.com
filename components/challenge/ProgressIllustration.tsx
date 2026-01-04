"use client"

interface ProgressIllustrationProps {
  width?: number | string
  height?: number | string
  className?: string
}

export default function ProgressIllustration({ width = 400, height = 250, className = "" }: ProgressIllustrationProps) {
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
      {/* Progress Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[320px] bg-white rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.08)] border border-[rgba(55,50,47,0.08)] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[rgba(55,50,47,0.08)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#37322F] text-sm font-semibold">Challenge Progress</span>
              <span className="text-[#37322F] text-sm font-bold">75%</span>
            </div>
            <div className="h-2 bg-[#FAFAF8] rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-[#37322F] to-[#605A57] rounded-full"></div>
            </div>
          </div>

          {/* Milestones */}
          <div className="p-4 space-y-3">
            {/* Week 1 - Complete */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[#37322F] text-sm font-medium">Week 1</div>
                <div className="text-[#847971] text-xs">All requirements met</div>
              </div>
              <span className="text-[#22c55e] text-xs font-semibold">Complete</span>
            </div>

            {/* Week 2 - Complete */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[#37322F] text-sm font-medium">Week 2</div>
                <div className="text-[#847971] text-xs">All requirements met</div>
              </div>
              <span className="text-[#22c55e] text-xs font-semibold">Complete</span>
            </div>

            {/* Week 3 - In Progress */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#37322F] flex items-center justify-center relative">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="absolute inset-0 rounded-full border-2 border-[#37322F] animate-ping opacity-30"></div>
              </div>
              <div className="flex-1">
                <div className="text-[#37322F] text-sm font-medium">Week 3</div>
                <div className="text-[#847971] text-xs">1 video remaining</div>
              </div>
              <span className="text-[#37322F] text-xs font-semibold">In Progress</span>
            </div>

            {/* Graduation */}
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-6 h-6 rounded-full bg-[#FAFAF8] border border-[rgba(55,50,47,0.12)] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M22 10V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7.8C2 6.11984 2 5.27976 2.32698 4.63803C2.6146 4.07354 3.07354 3.6146 3.63803 3.32698C4.27976 3 5.11984 3 6.8 3H12" stroke="#847971" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 16L15 13M15 13L18 10M15 13L12 10M15 13L18 16" stroke="#847971" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[#847971] text-sm font-medium">Graduation Call</div>
                <div className="text-[#B2AEA9] text-xs">Unlock after Week 3</div>
              </div>
              <span className="text-[#B2AEA9] text-xs font-semibold">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
