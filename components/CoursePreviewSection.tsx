'use client'

import { useState, useEffect, useRef } from 'react'
import { COURSE_PREVIEW_DATA } from '@/lib/course-preview-data'
import { ChallengeCoachingIllustration, ChallengeFeedbackIllustration, ChallengeGradeIllustration } from './ChallengeDetailsSection'

const ILLUSTRATION_MAP: Record<string, React.ReactNode> = {
  'coaching-calls': <ChallengeCoachingIllustration />,
  'technique-feedback': <ChallengeFeedbackIllustration />,
  'grading': <ChallengeGradeIllustration />,
}

export default function CoursePreviewSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardProgress, setCardProgress] = useState<number[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    cardRefs.current.forEach((ref, index) => {
      if (!ref) return
      const activeObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index)
        },
        { threshold: 0.5, rootMargin: '0px 0px 0px 0px' }
      )
      activeObserver.observe(ref)
      observers.push(activeObserver)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const progress = cardRefs.current.map((ref) => {
        if (!ref) return 0
        const rect = ref.getBoundingClientRect()
        const vh = window.innerHeight
        const centre = rect.top + rect.height / 2
        const distFromCentre = Math.abs(centre - vh / 2)
        const maxDist = vh / 2 + rect.height / 2
        const normalized = distFromCentre / maxDist; return normalized < 0.3 ? 1 : Math.max(0, 1 - (normalized - 0.3) / 0.2)
      })
      setCardProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const courses = COURSE_PREVIEW_DATA

  return (
    <section className="w-full bg-white">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-12 md:pt-20 pb-8 md:pb-12 text-center">
        <h2 className="text-hero font-normal text-[#37322F] mb-4">
          What&apos;s Included
        </h2>
        <p className="text-[#605A57] text-body max-w-[700px] mx-auto">
          Everything you need to improve your boxing, stay accountable, and progress through the ranks.
        </p>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden px-4 sm:px-6 pb-12">
        <div className="flex flex-col gap-14">
          {courses.map((course, i) => (
            <div key={course.id} className="flex flex-col gap-4">
              <div>
                <h3 className="text-[#37322F] text-sub font-semibold leading-tight mb-2">{course.title}</h3>
                <p className="text-[#605A57] text-body leading-relaxed font-sans">{course.description}</p>
              </div>
              <CourseCard course={course} key={course.id} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: sticky left + scrolling right */}
      <div className="hidden md:flex max-w-[1200px] mx-auto px-8 py-20 gap-12">
        {/* Left: sticky text */}
        <div className="w-5/12 relative">
          <div className="sticky top-[calc(50vh-70px)] h-[140px]">
            {courses.map((course, i) => (
              <div
                key={course.id}
                className="absolute inset-0 flex flex-col gap-3 transition-all duration-200 ease-out"
                style={{
                  opacity: activeIndex === i ? 1 : 0,
                  transform: activeIndex === i ? 'translateY(0)' : activeIndex > i ? 'translateY(-20px)' : 'translateY(20px)',
                  pointerEvents: activeIndex === i ? 'auto' : 'none',
                }}
              >
                <h3 className="text-[#37322F] text-sub font-semibold leading-tight">{course.title}</h3>
                <p className="text-[#605A57] text-body font-normal leading-relaxed font-sans">{course.description}</p>
                {course.badge && (
                  <span className="text-xs text-[#9a928d] mt-1">Available as add-on purchase</span>
                )}
                {course.modules.length > 0 && (
                  <div className="flex items-center gap-2 text-[#9a928d] text-sm mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h12" />
                    </svg>
                    <span>{course.modules.length} modules</span>
                    <span className="mx-1">-</span>
                    <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: scrolling course cards */}
        <div className="w-7/12 flex flex-col gap-0">
          {courses.map((course, i) => (
            <div
              key={course.id}
              ref={(el) => { cardRefs.current[i] = el }}
              className={`flex items-center ${i === 0 || i === courses.length - 1 ? '' : 'min-h-screen'} ${i === 0 ? 'pt-0' : ''} ${i === courses.length - 1 ? 'pb-0' : ''}`}
            >
              <div
                className="w-full"
                style={{
                  opacity: cardProgress[i] ?? 0,
                  transform: `translateY(${(1 - (cardProgress[i] ?? 0)) * 40}px)`,
                  transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                }}
              >
                <CourseCard course={course} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CourseCard({ course }: { course: typeof COURSE_PREVIEW_DATA[0] }) {
  const illustration = ILLUSTRATION_MAP[course.id]

  if (illustration) {
    return (
      <div className="w-full py-8 md:py-12 px-4 md:px-8">
        {illustration}
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(16px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}
    >
      {course.image && (
        <div className="h-[140px] md:h-[380px] overflow-hidden relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Module breakdown */}
      <div className="p-3 md:p-6">
        <div className="space-y-2 md:space-y-4">
          {course.modules.map((mod, i) => {
            const [prefix, subtitle] = mod.title.includes(':') ? mod.title.split(':') : ['', mod.title]
            const name = prefix || subtitle
            return (
              <div key={i}>
                <div className="flex items-baseline gap-3 md:gap-6">
                  {/* Left: module name */}
                  <div className="w-1/4 shrink-0">
                    <h4 className="text-xs md:text-lg font-bold text-[#37322F] leading-tight">{name}</h4>
                  </div>
                  {/* Right: lessons in columns */}
                  <div className="flex-1 grid grid-cols-2 gap-x-3 md:gap-x-4 gap-y-0.5 md:gap-y-1">
                    {mod.lessons.map((lesson, j) => (
                      <span key={j} className={`text-[9px] md:text-xs text-[#605A57] ${lesson.length > 24 ? 'col-span-2' : ''}`}>
                        {lesson}
                      </span>
                    ))}
                  </div>
                </div>
                {i < course.modules.length - 1 && (
                  <div className="mt-2 md:mt-3 h-px bg-[#e5e2dc]" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
