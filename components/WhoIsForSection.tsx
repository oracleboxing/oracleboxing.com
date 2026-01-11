"use client"

import WhoIsForIllustration from "./challenge/WhoIsForIllustration"

export default function WhoIsForSection() {
  const isForYou = [
    { bold: "You can't get proper coaching on fundamentals", rest: ", your gym doesn't teach technique, your coach can't explain the nuances, or you just don't have access to a boxing gym." },
    { bold: "You train at home and want to actually improve", rest: ", not just hammer a bag mindlessly. You find the art and science of boxing mentally stimulating." },
    { bold: "You're preparing for a fight", rest: " and want to leave no stone unturned, analysing footage, getting critiques, doing what your opponent isn't." },
    { bold: "You're open to honest, direct feedback", rest: ". You want to be told exactly what's wrong and how to fix it, not sugarcoated nonsense." },
    { bold: "You're willing to contribute", rest: ". The community only works because members help each other." },
  ]

  const notForYou = [
    { bold: "You're an active amateur or pro", rest: ". This is a community of beginners learning the very basics. You'd probably learn something, but it's not built for you." },
    { bold: "You train MMA, Muay Thai, or kickboxing", rest: " and want boxing to supplement it. We teach boxing. The way an MMA fighter strikes is different, and you'll be torn between the two." },
    { bold: "You can't handle being critiqued", rest: ". If you get defensive when someone tells you directly what you're doing wrong, this isn't going to work." },
    { bold: "You just want to take", rest: ". If you're here to extract value without becoming part of the community and helping others, look elsewhere." },
  ]

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center bg-white">
      {/* Bento Grid Content */}
      <div className="self-stretch flex justify-center items-start">
        {/* Left decorative pattern - CSS gradient instead of DOM elements */}
        <div
          className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 11px,
              rgba(3,7,18,0.08) 11px,
              rgba(3,7,18,0.08) 12px
            )`
          }}
        />

        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-0 sm:border-l sm:border-r border-[rgba(55,50,47,0.12)] bg-white">
          {/* Left - This Is For You */}
          <div className="border-b md:border-b-0 border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-4 w-full">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
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
                      <span className="font-semibold text-[#37322F]">{item.bold}</span>{item.rest}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - This Is NOT For You */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-4 w-full">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
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
                      <span className="font-semibold text-[#37322F]">{item.bold}</span>{item.rest}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right decorative pattern - CSS gradient instead of DOM elements */}
        <div
          className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 11px,
              rgba(3,7,18,0.08) 11px,
              rgba(3,7,18,0.08) 12px
            )`
          }}
        />
      </div>

    </div>
  )
}
