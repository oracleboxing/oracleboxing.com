'use client'

import Image from 'next/image'
import { Timeline } from '@/components/ui/timeline'

interface BundleTimelineProcessProps {
  cta?: React.ReactNode;
}

export function BundleTimelineProcess({ cta }: BundleTimelineProcessProps) {
  const data = [
    {
      title: 'Understand the Principles',
      content: (
        <div>
          <p className="text-gray-800 text-body font-normal mb-8">
            Start with Boxing Masterclass to build a deep understanding of the conceptual framework, mechanics, tactics, and mental game that underpin elite boxing.
          </p>
          <div className="mb-8 space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-gray-700 flex-shrink-0">•</span>
              <p className="text-gray-700 text-body">Understand the mental framework and flow state that keeps you calm under pressure</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-700 flex-shrink-0">•</span>
              <p className="text-gray-700 text-body">Learn the biomechanics and fascia mechanics behind natural, effortless power</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-700 flex-shrink-0">•</span>
              <p className="text-gray-700 text-body">Master tactical positioning, pattern recognition, and the strategic side of boxing</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/ob_fight3.webp"
              alt="Stay calm under pressure"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/bffp_tn4.webp"
              alt="Biomechanics"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/bffp_course3.webp"
              alt="Pattern recognition"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/bbffp_course4.webp"
              alt="Endurance and relaxation"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Apply the Structure',
      content: (
        <div>
          <p className="text-gray-800 text-body font-normal mb-8">
            Follow the Boxing Roadmap&apos;s 5-phase progression system to transform theoretical knowledge into practical skill through structured drills and techniques.
          </p>
          <div className="mb-8 space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-gray-700 flex-shrink-0">•</span>
              <p className="text-gray-700 text-body">Progress through fundamentals, defence, and footwork with clear phase-by-phase structure</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-700 flex-shrink-0">•</span>
              <p className="text-gray-700 text-body">Build technical form and mechanics systematically with drills for each phase</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-700 flex-shrink-0">•</span>
              <p className="text-gray-700 text-body">Develop ring-ready skill with clear progression markers from beginner to sparring-ready</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/tbr_course1.webp"
              alt="Technical form and mechanics"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/tbr_course2.webp"
              alt="Defence and movement"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/tbr_course22.webp"
              alt="Explosive footwork"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/tbr_course4.webp"
              alt="Flowing style integration"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Refine with Real Coaching',
      content: (
        <div>
          <p className="text-gray-800 text-body font-normal mb-8">
            Use the Boxing Clinic replays to see concepts applied in real-time and troubleshoot common issues with live coaching from Oliver & Toni.
          </p>
          <div className="mb-8 space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-gray-700 flex-shrink-0">•</span>
              <p className="text-gray-700 text-body">Watch real technique corrections and see how coaching solves common problems</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-700 flex-shrink-0">•</span>
              <p className="text-gray-700 text-body">Learn from mistakes and refinements happening in real time with live students</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-700 flex-shrink-0">•</span>
              <p className="text-gray-700 text-body">See high-level tactics, defensive flow, and advanced concepts demonstrated live</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/bcr_course6.webp"
              alt="Real coaching solutions"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/bcr_course2.webp"
              alt="Movement refinement"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/bcr_course4.webp"
              alt="High-level tactics"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://sb.oracleboxing.com/Website/optimized/course-content/bcr_course1.webp"
              alt="Think like a coach"
              width={1920}
              height={1080}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-auto lg:aspect-video w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-hidden">
      <Timeline data={data} cta={cta} />
    </div>
  )
}
