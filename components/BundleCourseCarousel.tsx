'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice } from '@/lib/currency'

interface CourseModule {
  title: string
  lessons: number
  description: string
}

interface BundleCourse {
  id: string
  title: string
  valueMetadata: string // Product metadata for price lookup
  image: string
  description: string
  modules: CourseModule[]
}

const courses: BundleCourse[] = [
  {
    id: 'bffp',
    title: 'Boxing Masterclass',
    valueMetadata: 'bffp', // Maps to PRODUCT_PRICES in currency.ts
    image: 'https://sb.oracleboxing.com/Website/optimized/products/bffp_tn5-large.webp',
    description: 'The science of boxing, made simple. Master the conceptual framework of boxing through mind, body mechanics, tactics, and conditioning.',
    modules: [
      {
        title: 'Sentience (Mind)',
        lessons: 4,
        description: 'Learn how to think like a real boxer. You\'ll build focus, manage emotions, and learn to perform at your best without overthinking. This is where you master flow state.\n\nLessons:\n• Shifting Your Paradigm For Success\n• Spoon Bending 101\n• Accessing The Flow State\n\nFocus: Identity · Awareness · Flow · Calm under pressure\nOutcome: A clear, stable mindset that keeps you composed and present in every moment.'
      },
      {
        title: 'Anatomy (Body)',
        lessons: 3,
        description: 'See what really makes your body fast and powerful. You\'ll learn how the brain, nerves, and fascia connect every punch and step so energy moves through you instead of against you.\n\nLessons:\n• The Nervous System\n• Fascia\n\nFocus: Nervous System · Fascia · Kinetic Chain · Energy Flow\nOutcome: Effortless speed and natural power through biomechanical alignment.'
      },
      {
        title: 'Formis (Movement)',
        lessons: 8,
        description: 'Build the shape and form of great boxing. You\'ll learn how to stand, move, and throw with balance, turning good technique into natural instinct.\n\nLessons:\n• What Is Formis\n• State And Repositioning\n• Striking\n• Defence\n• The Flow Of Boxing\n• Default Mode\n• Feints And Draws\n• Distance\n\nFocus: Shape · Stance · Defence · Striking\nOutcome: Smooth, balanced movement that stays sharp and efficient in every exchange.'
      },
      {
        title: 'Gambit (Tactics)',
        lessons: 6,
        description: 'Boxing is a game of moves and responses. Here you\'ll learn how to control range, find timing, and make your opponent react to you instead of the other way around.\n\nLessons:\n• What Is Gambit\n• Positioning\n• Pattern Recognition\n• Comfort Deception\n• Guard Manipulation\n\nFocus: Positioning · Timing · Deception · Tactical Awareness\nOutcome: Smarter decision-making and the ability to control every exchange.'
      },
      {
        title: 'Engine (Conditioning)',
        lessons: 5,
        description: 'This is where strength meets control. Learn how to use breath, recovery, and relaxation to stay calm and sharp even when tired. You\'ll finish stronger than you started.\n\nLessons:\n• What Is Engine\n• Relaxation\n• Energy Systems\n• Breathing And Breathe Holds\n• Diet And Health\n\nFocus: Conditioning · Breathing · Relaxation · Recovery\nOutcome: Long-lasting performance, fast recovery, and composure under fatigue.'
      }
    ]
  },
  {
    id: 'roadmap',
    title: 'Boxing Roadmap',
    valueMetadata: 'brdmp',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/tbrtn5hq-large.webp',
    description: 'Your complete 5-phase training system. Follow structured progressions from fundamentals to mastery with clear drills and techniques.',
    modules: [
      {
        title: 'Phase I (Fundamentals)',
        lessons: 15,
        description: 'Learn your stance, balance, and the true mechanics of each punch. Build relaxation and flow before speed or power.\n\nFocus: Shape · Rotation · Relaxation · Linking punches\nOutcome: Clean, efficient movement that feels natural and powerful.'
      },
      {
        title: 'Phase II (Defence & Range)',
        lessons: 18,
        description: 'Add movement, defence, and awareness. Learn to slip, roll, control range, and integrate punches with footwork.\n\nFocus: Range · Defence · Pendulum Steps · Flow\nOutcome: Confidence in distance, rhythm, and reactive defence.'
      },
      {
        title: 'Phase III (Footwork)',
        lessons: 14,
        description: 'Learn how to shift, pivot, and move with balance and intent. Connect the power of your legs to every punch.\n\nFocus: Shifting · Drop Steps · Balance · Rotation\nOutcome: Dynamic footwork that drives both speed and control.'
      },
      {
        title: 'Phase IV (Advanced Defence)',
        lessons: 16,
        description: 'Combine head, hand, and foot defences seamlessly. Learn to use feints to control reactions and create openings.\n\nFocus: Pulls · Weaves · Lay Back · Feints\nOutcome: Fluid defensive reactions and deceptive offence.'
      },
      {
        title: 'Phase V (Integration)',
        lessons: 12,
        description: 'Perfect your technique under motion. Master the mechanics of each punch, then add steps, slips, and rolls to make it ring-ready.\n\nFocus: Punch Mastery · Stepping · Slipping · Rolling\nOutcome: Complete, integrated skill that holds up in sparring.'
      }
    ]
  },
  {
    id: 'clinic',
    title: 'Boxing Clinic Replays',
    valueMetadata: 'rcv',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp',
    description: 'Learn from live coaching Q&A. Watch Oliver & Toni answer real student questions covering every aspect of boxing. Updated monthly.',
    modules: [
      {
        title: 'October 2025',
        lessons: 15,
        description: 'Liver Shot Setups [01/10 (Oliver)]\nFootwork + Punching [02/10 (Oliver)]\nKinetic Chain + Hand Defences [03/10 (Oliver)]\nKinetic Linkage [04/10 (Toni)]\nFlow of Boxing [05/10 (Toni)]\nCombo Buildup [06/10 (Toni)]\n1-2 [07/10 (Toni)]\nKinetic Linkage [08/10 (Oliver)]\nShifting Call [09/10 (Oliver)]\nDefence + Kinetic Counters [10/10 (Oliver)]\nKinetic Linkage 2 [11/10 (Toni)]\nJab Sequences [12/10 (Toni)]\nLiver Setup [13/10 (Toni)]\nCombo Buildup [14/10 (Toni)]\nPunch Technique [16/10 (Oliver)]'
      },
      {
        title: 'September 2025',
        lessons: 17,
        description: 'Tall Tree vs Sportscar [01/09 (Toni)]\nDrills [03/09 (Oliver)]\nFundamentals [04/09 (Oliver)]\nRing-Craft, Straight Shots [05/09 (Oliver)]\nRotation + Flow [06/09 (Toni)]\nCombo Buildup [07/09 (Toni)]\nShifts [09/09 (Toni)]\nFlow of Boxing [12/09 (Oliver)]\nJab Variations [17/09 (Oliver)]\nPost-Punch Defence [16/09 (Toni)]\nCatch and Shoot [21/09 (Toni)]\nCounterpunching [23/09 (Toni)]\nShape Whilst Moving [24/09 (Oliver)]\nFootwork Drills [26/09 (Oliver)]\nSet Up the Rear Hand [28/09 (Toni)]\nJab [29/09 (Toni)]\nFootwork [30/09 (Toni)]'
      },
      {
        title: 'August 2025',
        lessons: 14,
        description: 'Rotation + Flow [04/08 (Toni)]\nCombo Buildup [05/08 (Toni)]\nSetting Up Attacks [07/08 (Oliver)]\nCombinations with Footwork [08/08 (Toni)]\nLayering Defences [10/08 (Toni)]\nCombining Offense + Defence [11/08 (Toni)]\nJab Sequences [12/08 (Toni)]\nKO Setups [15/08 (Oliver)]\nCombining Footwork with Punches [16/08 (Toni)]\nLines of Defence [18/08 (Toni)]\nBasic Punching [21/08 (Oliver)]\nStraight Shot Magic [22/08 (Oliver)]\nPlant and Throw [27/08 (Oliver)]\nMoving vs Planting [28/08 (Oliver)]'
      },
      {
        title: 'July 2025',
        lessons: 19,
        description: 'Jab Only [01/07 (Oliver)]\nFootwork and Punching [02/07 (Oliver)]\nKnee Tapping Carnage [03/07 (Oliver)]\nRotation + Flow [05/07 (Toni)]\nBasic Punching Technique [06/07 (Toni)]\nAngle Changes [11/07 (Oliver)]\nWeight Back [12/07 (Toni)]\nCounter Punching Drills [16/07 (Oliver)]\nFeint & Throw [17/07 (Oliver)]\nFlow Combo [20/07 (Toni)]\nFootwork Drills [21/07 (Toni)]\nRotation [22/07 (Toni)]\nFlow of Boxing [23/07 (Oliver)]\nAngle Footwork Drills [24/07 (Oliver)]\nMuhammad Ali Call [25/07 (Oliver)]\nCombo Buildup [27/07 (Toni)]\nCounterpunching Drills [28/07 (Toni)]\n10 Rounds of Drills [30/07 (Oliver)]\nDrills + Angle Sequence [31/07 (Oliver)]'
      },
      {
        title: 'June 2025',
        lessons: 14,
        description: 'Combination Variety [01/06 (Toni)]\nJabs [02/06 (Toni)]\nDefault Mode [04/05 (Oliver)]\nFootwork Sequence [05/06 (Oliver)]\nJab Variety [09/06 (Toni)]\nFlow of Boxing [10/06 (Toni)]\nEnd Result of Punches [11/06 (Oliver)]\nTwisting Jab [17/06 (Oliver)]\nShoulder Roll + Slots [18/06 (Oliver)]\nHead Movement with Footwork [22/06 (Toni)]\nUltimate Default Mode [25/06 (Oliver)]\nFundamental Drills [26/06 (Oliver)]\nShape + Punch Technique [29/06 (Toni)]\nCombining Footwork and Punches [30/06 (Toni)]'
      }
    ]
  }
]

export function BundleCourseCarousel() {
  const [openModules, setOpenModules] = useState<{ [key: string]: number | null }>({})

  const toggleModule = (courseId: string, moduleIndex: number) => {
    setOpenModules(prev => ({
      ...prev,
      [courseId]: prev[courseId] === moduleIndex ? null : moduleIndex
    }))
  }

  return (
    <section className="py-6 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-section font-bold text-gray-900 mb-2 sm:mb-4 text-center">
          The Complete Toolkit for Mastering Boxing
        </h2>

        {/* Subtitle */}
        <p className="text-sub text-black mb-4 sm:mb-12 text-center max-w-4xl mx-auto leading-relaxed">
          Combining the theoretical mastery of Boxing Masterclass, the structured progression of the Boxing Roadmap, and the practical wisdom of the Boxing Clinic, this bundle creates a complete toolkit for becoming a seriously good boxer.
        </p>

        {/* Desktop: 3-column grid | Mobile: horizontal scroll */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 hidden">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group h-full"
            >
              {/* Card Container - flexible height */}
              <div className="relative rounded-xl overflow-hidden bg-white border border-gray-200 shadow-lg flex flex-col h-full">

                {/* Course Image - Fixed aspect ratio */}
                <div className="relative w-full aspect-[9/6] overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  {/* Course Name */}
                  <h3 className="text-sub font-bold text-gray-900 mb-1.5 sm:mb-2">
                    {course.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-body text-gray-900 font-medium mb-3 sm:mb-4">
                    {course.description}
                  </p>

                  {/* Individual Module Dropdowns - Full Width */}
                  <div className="space-y-1.5 sm:space-y-2 flex-1">
                    {course.modules.map((module, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleModule(course.id, index)}
                          className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="text-body font-bold text-gray-900">{module.title}</h4>
                            {module.lessons > 0 && (
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{module.lessons} lessons</p>
                            )}
                          </div>
                          <ChevronDown
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0 transition-transform duration-200 ${
                              openModules[course.id] === index ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>

                        {openModules[course.id] === index && (
                          <div className="px-2.5 pb-2 pt-1 sm:px-3 sm:pb-2.5 border-t border-gray-100">
                            <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                              {module.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Scrollable Carousel */}
        <div className="lg:hidden overflow-x-auto -mx-4 px-4">
          <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
            {courses.map((course) => (
              <div
                key={course.id}
                className="group"
                style={{ width: '320px', maxWidth: '85vw' }}
              >
                {/* Card Container - flexible height */}
                <div className="relative rounded-xl overflow-hidden bg-white border border-gray-200 shadow-lg flex flex-col h-full">

                  {/* Course Image - Fixed aspect ratio */}
                  <div className="relative w-full aspect-[9/6] overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col flex-1">
                    {/* Course Name */}
                    <h3 className="text-body font-bold text-gray-900 mb-1.5">
                      {course.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-gray-900 font-medium mb-3">
                      {course.description}
                    </p>

                    {/* Individual Module Dropdowns - Full Width */}
                    <div className="space-y-1.5 flex-1">
                      {course.modules.map((module, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleModule(course.id, index)}
                            className="w-full px-2.5 py-2 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-gray-900">{module.title}</h4>
                              {module.lessons > 0 && (
                                <p className="text-[10px] text-gray-500 mt-0.5">{module.lessons} lessons</p>
                              )}
                            </div>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 transition-transform duration-200 ${
                                openModules[course.id] === index ? 'transform rotate-180' : ''
                              }`}
                            />
                          </button>

                          {openModules[course.id] === index && (
                            <div className="px-2.5 pb-2 pt-1 border-t border-gray-100">
                              <p className="text-[10px] text-gray-700 leading-relaxed whitespace-pre-line">
                                {module.description}
                              </p>
                            </div>
                          )}
                      </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
