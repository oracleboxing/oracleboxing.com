"use client"

import Image from "next/image"

interface CommunityIllustrationProps {
  width?: number | string
  height?: number | string
  className?: string
}

export default function CommunityIllustration({ width = 400, height = 250, className = "" }: CommunityIllustrationProps) {
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
      {/* Video Feedback Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[300px] bg-white rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.08)] border border-[rgba(55,50,47,0.08)] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[rgba(55,50,47,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FF8000] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M23 7L16 12L23 17V7Z" stroke="white" strokeWidth="2"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-[#37322F] text-sm font-semibold">Video Review</span>
            </div>
            <span className="text-[#22c55e] text-xs font-medium">Uploaded</span>
          </div>

          {/* Video Preview with Thumbnail */}
          <div className="p-3">
            <div className="rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
              <Image
                src="https://sb.oracleboxing.com/Website/kris_action.webp"
                alt="Boxing drill video"
                fill
                className="object-cover"
              />
              {/* Play overlay */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3L19 12L5 21V3Z" fill="white"/>
                  </svg>
                </div>
              </div>
              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-white text-[10px] z-10">
                0:45
              </div>
            </div>
          </div>

          {/* Coach Feedback */}
          <div className="px-3 pb-3 space-y-2">
            <div className="text-[#847971] text-[10px] font-medium uppercase tracking-wide">Coach Feedback</div>

            {/* Feedback Item */}
            <div className="bg-[#FAFAF8] rounded-lg p-2.5 flex gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 relative">
                <Image
                  src="https://sb.oracleboxing.com/Website/a3cf922ac005426da60104096acb4e790c123dfeebb3484faa3d996067eb57a6-md.jpg"
                  alt="Coach T"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span className="text-[#37322F] text-xs font-semibold block mb-0.5">Coach T</span>
                <p className="text-[#605A57] text-xs leading-relaxed">Good snap on the jab. Focus on bringing that shoulder to chin and quick recoil back to guard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
