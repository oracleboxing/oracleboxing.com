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
import { getBffpTestimonials, bffpTestimonials } from '@/lib/testimonials'

export default function BFFPPage() {
  const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false)

  const openPricingPopup = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setIsPricingPopupOpen(true)
  }

  const product = getProductById('bffp')!

  const personas = [
    {
      emoji: '🧠',
      title: 'You ask questions and want to understand everything.',
      subtitle: 'You break things down until they make sense. You want the full truth.'
    },
    {
      emoji: '⚡',
      title: 'You want to be the best at boxing.',
      subtitle: 'You work hard on every small detail to get better.'
    },
    {
      emoji: '🥊',
      title: 'You believe real boxing starts with strong basics.',
      subtitle: 'You build your skills step by step. You know that doing simple things really well is how you get great.'
    }
  ]

  const learningCards = [
    {
      emoji: '🧘',
      text: 'Stay calm when things get hard and control your feelings.',
      imageUrl: 'https://sb.oracleboxing.com/Website/optimized/course-content/ob_fight3.webp'
    },
    {
      emoji: '⚡',
      text: 'Use your body the right way to punch with more power.',
      imageUrl: 'https://sb.oracleboxing.com/Website/optimized/course-content/bffp_tn4.webp'
    },
    {
      emoji: '🥊',
      text: 'See patterns, read your opponent, and think ahead.',
      imageUrl: 'https://sb.oracleboxing.com/Website/optimized/course-content/bffp_course3.webp'
    },
    {
      emoji: '♟️',
      text: 'Build energy and stay relaxed through every round.',
      imageUrl: 'https://sb.oracleboxing.com/Website/optimized/course-content/bbffp_course4.webp'
    }
  ]

  const modules = [
    {
      title: "Sentience (Mind)",
      description: "Learn how to think like a real boxer. You'll build focus, control your emotions, and learn to do your best without thinking too much. This is where you learn to stay in the zone.\n\nLessons:\n• Changing Your Mindset For Success\n• Spoon Bending 101\n• Getting Into The Flow State\n\nFocus: Who you are · Awareness · Flow · Stay calm when stressed\nOutcome: A clear, steady mind that keeps you calm and focused every moment.",
      lessons: 4
    },
    {
      title: "Anatomy (Body)",
      description: "See what really makes your body fast and strong. You'll learn how your brain, nerves, and body parts connect every punch and step. Energy moves through you the right way.\n\nLessons:\n• The Nervous System\n• Fascia\n\nFocus: Nervous System · Fascia · How Energy Moves · Energy Flow\nOutcome: Easy speed and natural power by using your body the right way.",
      lessons: 3
    },
    {
      title: "Formis (Movement)",
      description: "Build the shape and form of great boxing. You'll learn how to stand, move, and throw with balance. Turn good moves into natural habit.\n\nLessons:\n• What Is Formis\n• Standing And Moving\n• Punching\n• Defense\n• The Flow Of Boxing\n• Your Default Way\n• Fakes And Tricks\n• Distance\n\nFocus: Shape · Stance · Defense · Punching\nOutcome: Smooth, balanced moves that stay sharp in every fight.",
      lessons: 8
    },
    {
      title: "Gambit (Tactics)",
      description: "Boxing is a game of moves and answers. Here you'll learn how to control space, find the right time, and make your opponent react to you.\n\nLessons:\n• What Is Gambit\n• Where To Stand\n• Seeing Patterns\n• Comfort Tricks\n• Guard Control\n\nFocus: Where You Stand · Timing · Tricks · Smart Thinking\nOutcome: Smarter choices and the ability to control every exchange.",
      lessons: 6
    },
    {
      title: "Engine (Conditioning)",
      description: "This is where strength meets control. Learn how to use breathing, rest, and staying relaxed to stay calm and sharp even when tired. You'll finish stronger than you started.\n\nLessons:\n• What Is Engine\n• Staying Relaxed\n• Energy Systems\n• Breathing And Breath Holds\n• Food And Health\n\nFocus: Conditioning · Breathing · Staying Relaxed · Recovery\nOutcome: Long energy, fast recovery, and staying calm when tired.",
      lessons: 5
    }
  ]

  // Use BFFP-specific testimonials
  const testimonials = bffpTestimonials

  const faqs = [
    {
      question: "Is this for beginners?",
      answer: "Yes. It's made to teach you from the start. You don't need to know anything about boxing."
    },
    {
      question: "How is it different from the Boxing Roadmap?",
      answer: "The Roadmap shows what to train each week. This course explains why it all works. Together, they give you the plan and the reasons."
    },
    {
      question: "Will it help with sparring?",
      answer: "Yes. You'll learn how to stay calm, think clearly, and make smarter choices when things get tough."
    },
    {
      question: "How long will it take?",
      answer: "Most students finish in three to six months. But you can go at your own speed."
    },
    {
      question: "What do I need?",
      answer: "Nothing to start. Gloves and a bag help for practice. But all the learning comes from understanding the basics first."
    },
    {
      question: "Can I get my money back?",
      answer: "Yes. Try it for 30 days. If it's not for you, we give you all your money back."
    }
  ]

  const priceFeatures = [
    "26 complete lessons across 5 modules",
    "Watch all videos forever starting now",
    "Learn the mind, body, moves, tactics, and conditioning",
    "Get all new videos we add for free",
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
            "name": "Boxing Masterclass",
            "description": "Master the science of boxing through 26 comprehensive lessons covering mind, body, movement, tactics, and conditioning. The deepest truths of the sweet science, boiled down to their simplest form.",
            "provider": {
              "@type": "Organization",
              "name": "Oracle Boxing",
              "sameAs": "https://oracleboxing.com"
            },
            "image": "https://sb.oracleboxing.com/Website/optimized/products/bffp_tn5-large.webp",
            "offers": {
              "@type": "Offer",
              "category": "Paid",
              "price": "297",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://oracleboxing.com/courses/bffp"
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Online",
              "courseWorkload": "PT26H"
            },
            "teaches": [
              "Boxing fundamentals and theory",
              "Biomechanics and natural power generation",
              "Flow state and mental training",
              "Tactical awareness and pattern recognition",
              "Conditioning and breathing techniques"
            ],
            "numberOfLessons": 26,
            "educationalLevel": "Beginner to Advanced"
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
            "name": "Boxing Masterclass",
            "description": "Master the science of boxing through 26 comprehensive lessons covering mind, body, movement, tactics, and conditioning.",
            "image": "https://sb.oracleboxing.com/Website/optimized/products/bffp_tn5-large.webp",
            "brand": {
              "@type": "Brand",
              "name": "Oracle Boxing"
            },
            "offers": {
              "@type": "Offer",
              "price": "297",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://oracleboxing.com/courses/bffp",
              "priceValidUntil": "2026-12-31"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "150"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-8 sm:pt-16 pb-4 sm:pb-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Course Title with Pill Border - Smaller & Thinner */}
          <div className="inline-block mx-auto mb-4 sm:mb-8 w-full text-center">
            <div className="inline-block border-2 border-black rounded-full px-3 sm:px-6 py-1 sm:py-2">
              <h1 className="text-xs sm:text-base md:text-lg text-gray-900 uppercase tracking-wide font-medium" style={{ fontFamily: "var(--font-satoshi)" }}>
                Boxing Masterclass
              </h1>
            </div>
          </div>

          {/* Headline - Bigger */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-2 sm:mb-4 px-2">
            Learn How Boxing Really Works.
          </h2>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-6 sm:mb-12 px-2 leading-relaxed">
            The biggest secrets of boxing explained in simple ways.
          </p>

          {/* Video Sales Letter */}
          <div className="mb-4 sm:mb-8">
            <VideoPlayer
              thumbnail={product.image}
              title="Boxing Masterclass Overview"
            />
          </div>

          {/* Primary CTA */}
          <div className="text-center mb-4 sm:mb-8">
            <a
              href="#pricing"
              onClick={openPricingPopup}
              className="ob-btn ob-btn-gp-ybg-p inline-block cursor-pointer"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(2rem, 3vw, 3rem)' }}
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
            lessonCount={26}
            purchaseLabel="#1"
            hasLifetimeAccess={true}
          />
        </div>
      </section>

      {/* Who This Is For */}
      <WhoThisIsFor courseName="Boxing Masterclass" personas={personas} />

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
      <CourseFAQ />

      <Footer />

      {/* Black Friday Challenge Popup */}
      <BlackFridayChallengePopup />
    </div>
    </>
  )
}
