import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function QuizHeader() {
  return (
    <header className="w-full bg-[#171717] text-[#F5F5F5] py-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="https://sb.oracleboxing.com/logo/icon_dark.webp"
            alt="Oracle Boxing"
            width={40}
            height={40}
            className="w-10 h-auto"
            priority
          />
        </Link>
        <span className="ml-4 text-lg font-semibold">Boxing Level Quiz</span>
      </div>
    </header>
  )
}
