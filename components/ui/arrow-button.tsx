"use client"

import Link from "next/link"

interface ArrowButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export function ArrowButton({ children, href, onClick, className = "" }: ArrowButtonProps) {
  const buttonContent = (
    <>
      <span className="text-white font-medium">{children}</span>
      <span className="text-white/40 mx-3">|</span>
      <span className="w-5 h-5 overflow-hidden relative">
        <span className="arrow-scroll flex items-center transition-transform duration-300 group-hover:animate-[scrollArrow_0.3s_ease_forwards]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M4 10H16M16 10L11 5M16 10L11 15"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 ml-1"
          >
            <path
              d="M4 10H16M16 10L11 5M16 10L11 15"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <style jsx global>{`
        @keyframes scrollArrow {
          0% {
            transform: translateX(-24px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )

  const baseClasses = `group h-12 px-6 bg-[#007AFF] hover:bg-[#0066DD] rounded-lg font-medium text-base shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] cursor-pointer inline-flex items-center justify-center transition-all ${className}`

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={baseClasses}>
        {buttonContent}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {buttonContent}
    </button>
  )
}
