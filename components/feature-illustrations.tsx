"use client"

import Image from "next/image"

export function CoursesIllustration() {
  return (
    <div className="w-full h-full relative">
      <Image
        src="https://sb.oracleboxing.com/Website/hero_courses.webp"
        alt="Courses"
        fill
        className="object-contain"
      />
    </div>
  )
}

export function CoachingIllustration() {
  return (
    <div className="w-full h-full relative">
      <Image
        src="https://sb.oracleboxing.com/Website/hero_coaching.webp"
        alt="Coaching"
        fill
        className="object-contain"
      />
    </div>
  )
}

export function CommunityIllustration() {
  return (
    <div className="w-full h-full relative">
      <Image
        src="https://sb.oracleboxing.com/Website/hero_community.webp"
        alt="Community"
        fill
        className="object-contain"
      />
    </div>
  )
}
