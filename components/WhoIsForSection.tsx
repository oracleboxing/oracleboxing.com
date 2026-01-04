"use client"

import WhoIsForIllustration from "./challenge/WhoIsForIllustration"

export default function WhoIsForSection() {
  const isForYou = [
    "You're patient and disciplined.",
    "You're ready to focus on the fundamentals, not flashy tricks.",
    "You want honest coaching, real progress, and are open to feedback.",
    "You're ready to slow down in order to master the art faster.",
  ]

  const notForYou = [
    "You think you have to be perfect before you start.",
    "You're trying to rush through levels to feel \"advanced.\"",
    "You want to freestyle, shadowbox, or \"look good\" without the basics.",
    "You care more about appearances than building real boxing skill.",
  ]

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center bg-[#FFFCF5]">
      {/* Bento Grid Content */}
      <div className="self-stretch flex justify-center items-start">
        {/* Left decorative pattern */}
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 200 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-0 sm:border-l sm:border-r border-[rgba(55,50,47,0.12)] bg-[#FFFCF5]">
          {/* Left - This Is For You */}
          <div className="border-b md:border-b-0 border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-4 w-full">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                Oracle Boxing is for you if:
              </h3>
              <div className="flex flex-col gap-3">
                {isForYou.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <circle cx="10" cy="10" r="10" fill="#E8F5E9" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="#4CAF50"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - This Is NOT For You */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-4 w-full">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                This is NOT for you if:
              </h3>
              <div className="flex flex-col gap-3">
                {notForYou.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <circle cx="10" cy="10" r="10" fill="#FFEBEE" />
                      <path
                        d="M7 7L13 13M13 7L7 13"
                        stroke="#EF5350"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right decorative pattern */}
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 200 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
