"use client"

interface CalendarIllustrationProps {
  width?: number | string
  height?: number | string
  className?: string
}

const weekData = [
  { day: "Mon", date: 27, sessions: [{ time: "8pm", coach: "Toni", attended: false }] },
  { day: "Tue", date: 28, sessions: [{ time: "9pm", coach: "Toni", attended: true }, { time: "9am", coach: "Oliver", attended: false }] },
  { day: "Wed", date: 29, sessions: [{ time: "11pm", coach: "Charlie", attended: false }] },
  { day: "Thu", date: 30, sessions: [{ time: "9am", coach: "Oliver", attended: false }] },
  { day: "Fri", date: 31, sessions: [{ time: "9am", coach: "Oliver", attended: false }, { time: "12am", coach: "Charlie", attended: false }, { time: "12pm", coach: "Toni", attended: true }, { time: "7pm", coach: "Charlie", attended: false }] },
  { day: "Sat", date: 1, sessions: [{ time: "12pm", coach: "Toni", attended: false }, { time: "5pm", coach: "Charlie", attended: false }] },
  { day: "Sun", date: 2, sessions: [{ time: "12pm", coach: "Toni", attended: false }, { time: "5pm", coach: "Charlie", attended: false }] },
]

export default function CalendarIllustration({ width = 400, height = 250, className = "" }: CalendarIllustrationProps) {
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
      {/* Calendar Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[340px] bg-white rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.08)] border border-[rgba(55,50,47,0.08)] overflow-hidden">
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-[rgba(55,50,47,0.08)] flex items-center justify-between">
            <span className="text-[#37322F] text-sm font-semibold">Live Coaching Calls</span>
            <span className="text-[#847971] text-[10px]">London Time</span>
          </div>

          {/* Week View */}
          <div className="grid grid-cols-7 gap-0.5 p-2">
            {weekData.map((dayData, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Day Header */}
                <div className="text-[9px] text-[#847971] font-medium mb-0.5">{dayData.day}</div>
                <div className="text-[10px] text-[#37322F] font-semibold mb-1">{dayData.date}</div>

                {/* Sessions */}
                <div className="flex flex-col gap-0.5 w-full">
                  {dayData.sessions.slice(0, 3).map((session, j) => (
                    <div
                      key={j}
                      className={`text-[7px] px-1 py-0.5 rounded text-center truncate ${
                        session.attended
                          ? 'bg-[#22c55e] text-white'
                          : 'bg-[#37322F]/10 text-[#37322F]'
                      }`}
                    >
                      {session.time}
                    </div>
                  ))}
                  {dayData.sessions.length > 3 && (
                    <div className="text-[7px] text-[#847971] text-center">+{dayData.sessions.length - 3}</div>
                  )}
                  {dayData.sessions.length === 0 && (
                    <div className="text-[7px] text-[#D1CCC8] text-center">-</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="px-3 pb-2 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-[#22c55e]"></div>
              <span className="text-[9px] text-[#847971]">Attended</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-[#37322F]/20"></div>
              <span className="text-[9px] text-[#847971]">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
