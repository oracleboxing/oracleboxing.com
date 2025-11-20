'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { VideoPlayer } from '@/components/VideoPlayer'
import { CourseStats } from '@/components/CourseStats'
import { WhoThisIsFor } from '@/components/WhoThisIsFor'
import { CourseCurriculum } from '@/components/CourseCurriculum'
import { CourseModules } from '@/components/CourseModules'
import { TestimonialSection } from '@/components/TestimonialSection'
import { CoursePriceCard } from '@/components/CoursePriceCard'
import { CourseFAQ } from '@/components/CourseFAQ'
import { CoursePricingPopup } from '@/components/CoursePricingPopup'
import { BlackFridayChallengePopup } from '@/components/BlackFridayChallengePopup'
import { getProductById } from '@/lib/products'
import { getRoadmapTestimonials, roadmapTestimonials } from '@/lib/testimonials'

export default function RoadmapPage() {
  const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false)

  const openPricingPopup = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setIsPricingPopupOpen(true)
  }

  const product = getProductById('roadmap')!

  const personas = [
    {
      emoji: '🎓',
      title: 'You want to train the right way from day one.',
      subtitle: 'You like order, progress, and doing things the right way.'
    },
    {
      emoji: '🏠',
      title: 'You train alone and don\'t want to guess.',
      subtitle: 'You need a clear plan and drills that build real skill without a coach watching you.'
    },
    {
      emoji: '🥇',
      title: 'You\'re getting ready to spar and want to be ready.',
      subtitle: 'You want your moves to be clean, strong, and ready for a fight.'
    }
  ]

  const learningCards = [
    {
      emoji: '📐',
      text: 'Build good form, clean moves, and control from the start.',
      imageUrl: 'https://media.oracleboxing.com/Website/optimized/course-content/tbr_course1.webp'
    },
    {
      emoji: '🛡️',
      text: 'Learn defense and movement that keep you safe and sharp.',
      imageUrl: 'https://media.oracleboxing.com/Website/optimized/course-content/tbr_course2.webp'
    },
    {
      emoji: '👟',
      text: 'Build fast footwork that connects balance with power.',
      imageUrl: 'https://media.oracleboxing.com/Website/optimized/course-content/tbr_course22.webp'
    },
    {
      emoji: '🎭',
      text: 'Mix attack, defense, and rhythm into one smooth style.',
      imageUrl: 'https://media.oracleboxing.com/Website/optimized/course-content/tbr_course4.webp'
    }
  ]

  const modules = [
    {
      title: "Phase I (Fundamentals)",
      description: "Learn your stance, balance, and how each punch really works. Build relaxation and flow before speed or power.\n\nFocus: Shape · Turning · Staying Relaxed · Connecting Punches\nOutcome: Clean, smooth moves that feel natural and powerful.",
      lessons: 15
    },
    {
      title: "Phase II (Defence & Range)",
      description: "Add movement, defense, and awareness. Learn to slip, roll, control space, and mix punches with footwork.\n\nFocus: Space · Defense · Pendulum Steps · Flow\nOutcome: Confidence in distance, rhythm, and quick defense.",
      lessons: 18
    },
    {
      title: "Phase III (Footwork)",
      description: "Learn how to shift, turn, and move with balance and purpose. Connect the power of your legs to every punch.\n\nFocus: Shifting · Drop Steps · Balance · Turning\nOutcome: Fast footwork that brings both speed and control.",
      lessons: 14
    },
    {
      title: "Phase IV (Advanced Defence)",
      description: "Mix head, hand, and foot defense smoothly. Learn to use fakes to control reactions and make openings.\n\nFocus: Pulls · Weaves · Lay Back · Fakes\nOutcome: Smooth defensive moves and tricky offense.",
      lessons: 16
    },
    {
      title: "Phase V (Integration)",
      description: "Perfect your moves while moving. Master how each punch works. Then add steps, slips, and rolls to make it ready for the ring.\n\nFocus: Punch Mastery · Stepping · Slipping · Rolling\nOutcome: Complete skill that works in sparring.",
      lessons: 12
    }
  ]

  // Use Roadmap-specific testimonials
  const testimonials = roadmapTestimonials

  const faqs = [
    {
      question: "How is the Roadmap different from BFFP?",
      answer: "BFFP explains why boxing works the way it does. The Roadmap shows you how to train with drills and daily practice that makes it real."
    },
    {
      question: "Do I need to finish the phases in order?",
      answer: "Yes. Each phase builds on the last one to teach you all the skills. You can go back to earlier phases anytime."
    },
    {
      question: "How long should I spend on each phase?",
      answer: "Most students spend 2 to 4 weeks per phase. It depends on how often you train. Take your time. Getting better is more important than rushing."
    },
    {
      question: "Can I use this if I train at a gym?",
      answer: "Yes. The Roadmap gives you a clear plan and homework to add to your gym training."
    },
    {
      question: "What do I need?",
      answer: "Gloves, hand wraps, and a heavy bag work best. But many drills can be done shadowboxing if you don't have a bag."
    },
    {
      question: "Will this help me get ready for sparring?",
      answer: "Yes. By Phase V, you'll be sharp with your moves, good at defense, and confident when things get tough."
    },
    {
      question: "Do I get new videos when you add them?",
      answer: "Yes. All new videos and improvements are free. You keep the videos forever and always get the newest version."
    }
  ]

  const priceFeatures = [
    "75 lessons across 5 clear phases",
    "Keep all videos forever",
    "Step-by-step lessons from beginner to advanced",
    "Drills and moves for every stage",
    "Get your money back within 30 days if not happy"
  ]

  return (
    <>
      {/* Course Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Boxing Roadmap",
            "description": "Follow a clear 5-phase system with 75 structured lessons that takes you from your first stance to sparring-ready. Every move, every drill, in the right order.",
            "provider": {
              "@type": "Organization",
              "name": "Oracle Boxing",
              "sameAs": "https://oracleboxing.com"
            },
            "image": "https://media.oracleboxing.com/Website/optimized/products/tbrtn5hq-large.webp",
            "offers": {
              "@type": "Offer",
              "category": "Paid",
              "price": "147",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://oracleboxing.com/courses/roadmap"
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Online",
              "courseWorkload": "PT75H"
            },
            "teaches": [
              "Boxing fundamentals and clean mechanics",
              "Defence and movement techniques",
              "Explosive footwork and balance",
              "Advanced defensive combinations",
              "Ring-ready technique integration"
            ],
            "numberOfLessons": 75,
            "educationalLevel": "Beginner to Advanced",
            "coursePrerequisites": "No prior boxing experience required"
          })
        }}
      />

      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Boxing Roadmap",
            "description": "Follow a clear 5-phase system with 75 structured lessons that takes you from your first stance to sparring-ready.",
            "image": "https://media.oracleboxing.com/Website/optimized/products/tbrtn5hq-large.webp",
            "brand": {
              "@type": "Brand",
              "name": "Oracle Boxing"
            },
            "offers": {
              "@type": "Offer",
              "price": "147",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://oracleboxing.com/courses/roadmap",
              "priceValidUntil": "2026-12-31"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "200"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-8 sm:pt-16 pb-4 sm:pb-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Course Title with Pill Border - Smaller */}
          <div className="inline-block mx-auto mb-4 sm:mb-8 w-full text-center">
            <div className="inline-block border-2 border-black rounded-full px-3 sm:px-6 py-1 sm:py-2">
              <h1 className="text-xs sm:text-base md:text-lg text-gray-900 uppercase tracking-wide font-medium" style={{ fontFamily: "var(--font-satoshi)" }}>
                Boxing Roadmap
              </h1>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-2 sm:mb-4 px-2">
            Learn Boxing Step by Step
          </h2>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-6 sm:mb-12 px-2 leading-relaxed">
            Follow a clear 5-step plan. Go from your first boxing stance to being ready to spar. Every move and drill in the right order.
          </p>

          {/* Video Sales Letter */}
          <div className="mb-4 sm:mb-8">
            <VideoPlayer
              thumbnail={product.image}
              title="Boxing Roadmap Overview"
            />
          </div>

          {/* Primary CTA */}
          <div className="text-center mb-4 sm:mb-8">
            <a
              href="#pricing"
              onClick={openPricingPopup}
              className="inline-block py-3 sm:py-4 lg:py-5 px-8 sm:px-10 lg:px-12 bg-yellow-100 text-black border-4 border-black font-black text-base sm:text-lg lg:text-xl rounded-xl uppercase tracking-wide cursor-pointer animate-bounce-subtle hover:bg-black hover:text-white transition-colors duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              SEE PRICING
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="overview" className="pt-4 sm:pt-6 pb-8 sm:pb-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseStats
            lessonCount={176}
            weeksCount={20}
            workoutsCount={100}
            hasLifetimeAccess={true}
          />
        </div>
      </section>

      {/* Who This Is For */}
      <WhoThisIsFor courseName="Boxing Roadmap" personas={personas} />

      {/* Learning Outcomes */}
      <CourseCurriculum
        learningCards={learningCards}
        showButton={false}
      />

      {/* Course Modules */}
      <div id="lessons">
        <CourseModules
          modules={modules}
          headerImage={product.image}
          showButton={false}
        />
      </div>

      {/* Pricing Popup */}
      <CoursePricingPopup
        isOpen={isPricingPopupOpen}
        onClose={() => setIsPricingPopupOpen(false)}
        product={product}
        features={priceFeatures}
      />

      {/* Testimonials */}
      <div id="testimonials">
        <TestimonialSection testimonials={testimonials} />
      </div>

      {/* Inline Pricing Card */}
      <CoursePriceCard
        product={product}
        features={priceFeatures}
      />

      {/* FAQ */}
      <CourseFAQ courseType="roadmap" />

      <Footer />

      {/* Black Friday Challenge Popup */}
      <BlackFridayChallengePopup />
    </div>
    </>
  )
}
