'use client'

import { useState } from 'react'

type SessionData = {
  number: number
  date: string
  title: string
  contentHtml: string | null
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#9CABA8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SessionTimeline({ sessions }: { sessions: SessionData[] }) {
  const [openSessions, setOpenSessions] = useState<Set<number>>(new Set())

  function toggle(num: number) {
    setOpenSessions(prev => {
      const next = new Set(prev)
      if (next.has(num)) {
        next.delete(num)
      } else {
        next.add(num)
      }
      return next
    })
  }

  return (
    <div>
      {sessions.map((session) => {
        const isOpen = openSessions.has(session.number)
        return (
          <div
            key={session.number}
            className="border-b border-[rgba(55,50,47,0.12)] last:border-b-0"
          >
            <button
              onClick={() => toggle(session.number)}
              className="w-full py-5 flex items-start gap-4 text-left cursor-pointer hover:bg-[#F7F5F3]/50 transition-colors -mx-3 px-3 rounded-lg"
            >
              <span className="text-body text-[#9CABA8] tabular-nums flex-shrink-0 pt-0.5">
                {session.number}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-title font-medium text-[#37322F] leading-snug">
                  {session.title}
                </p>
                <p className="text-body text-[#9CABA8] mt-1">
                  {session.date}
                </p>
              </div>
              <ChevronIcon open={isOpen} />
            </button>

            {isOpen && session.contentHtml && (
              <div className="pb-6 pl-10 pr-3">
                <div
                  className="text-body text-[#605A57] leading-relaxed space-y-4 [&_h2]:text-title [&_h2]:font-semibold [&_h2]:text-[#37322F] [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-semibold [&_strong]:text-[#37322F]"
                  dangerouslySetInnerHTML={{ __html: session.contentHtml }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
