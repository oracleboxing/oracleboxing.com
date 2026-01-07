"use client"

export default function EnrollmentClosedBanner() {
  return (
    <div className="w-full bg-[#37322F] border-b border-[rgba(255,255,255,0.1)]">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          <span className="text-[#FBFAF9] text-sm sm:text-base font-semibold font-sans">
            Enrollment Closed
          </span>
        </div>
        <span className="text-[#A39E9A] text-sm sm:text-base font-medium font-sans">
          Oracle Boxing is currently closed for enrollment. We'll reopen in a couple of weeks.
        </span>
      </div>
    </div>
  )
}
