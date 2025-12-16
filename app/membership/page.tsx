'use client'

import { useState, useEffect, useRef } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MembershipTestimonials } from '@/components/MembershipTestimonials'
import { MembershipPricingPopup } from '@/components/MembershipPricingPopup'
import { BlackFridayChallengePopup } from '@/components/BlackFridayChallengePopup'
import { getMemberships } from '@/lib/products'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Video, Users, Clock, BookOpen, Award, Target, TrendingUp, Heart, CheckCircle, CreditCard, Smartphone, TrendingUp as Progress, ChevronDown } from 'lucide-react'
import { AdaptivePrice, AdaptivePricePerMonth } from '@/components/AdaptivePrice'

export const dynamic = 'force-dynamic'

export default function MembershipsPage() {
  const router = useRouter()
  const memberships = getMemberships()
  const [selectedPlan, setSelectedPlan] = useState('membership-annual')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [videosLoaded, setVideosLoaded] = useState(false)

  // Video autoplay on scroll for transformation videos
  useEffect(() => {
    if (!videosLoaded) return

    const observers: IntersectionObserver[] = []

    videoRefs.current.forEach((video) => {
      if (!video) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLVideoElement
            if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
              target.play().catch((err) => {
                console.log('Video play prevented:', err)
              })
            } else {
              target.pause()
            }
          })
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: '0px'
        }
      )

      observer.observe(video)
      observers.push(observer)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [videosLoaded])

  // Membership testimonials with profile pictures
  const testimonials = [
    {
      name: "Torey Goodall",
      role: "Community Member",
      content: "Did pad work yesterday and my coach kept asking what I've been doing. My balance and power got way better - all from what I learned here!",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/torey-256.webp"
    },
    {
      name: "Harvey Swift",
      role: "Community Member",
      content: "The training here is great! I didn't expect such detailed, personal help from the coaches. I'm already seeing how small changes can make big results.",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/harvey-256.webp"
    },
    {
      name: "Myles Suehiro",
      role: "Community Member",
      content: "Being part of this community has changed me. The help, support, and friendship I get here has made all the difference in how I box.",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/luacs-256.webp"
    },
    {
      name: "Charlie Snider",
      role: "Community Member",
      content: "You need to find something you really love and set goals for it. For me it was boxing. Work hard for those goals and get obsessed with hitting them.",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/charlie-256.webp"
    },
    {
      name: "Balal Hanif",
      role: "Community Member",
      content: "Just finished my session with Toni. The way he breaks things down and explains them was amazing. I've been boxing for over 50 years and never had this experience.",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/balal-256.webp"
    },
    {
      name: "Sam Oliver",
      role: "Community Member",
      content: "Great stuff, really well done! I'm changing the way I think about boxing and this really helps. It confirms I made the right choice to join.",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/niko-256.webp"
    },
    {
      name: "Niclas Laux",
      role: "Community Member",
      content: "I think you saved my life! I'm not sure how many things will change, but my mind changed for the better! I was sure I'd learn to box here, and I was right!",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/niclas-256.webp"
    },
    {
      name: "Bernardo D",
      role: "Community Member",
      content: "The Nervous System lesson was great. Control your breathing to control your body. Being relaxed helps you box better because it removes tension.",
      image: "https://sb.oracleboxing.com/Website/optimized/profiles/bernardo-256.webp"
    }
  ]

  const benefits = [
    {
      icon: Video,
      title: 'Daily Coaching Calls',
      description: 'Live sessions with Oliver & Toni to refine your technique and answer questions'
    },
    {
      icon: Users,
      title: '300+ Members',
      description: 'Join a thriving community of dedicated boxers from around the world'
    },
    {
      icon: BookOpen,
      title: 'All Courses Included',
      description: 'Full access to BFFP, Boxing Roadmap, and Coaching Call Replays'
    },
    {
      icon: Clock,
      title: 'Train Anytime',
      description: 'Access all content 24/7 on mobile, tablet, or desktop from anywhere'
    }
  ]

  const steps = [
    'Choose your plan and finish buying',
    'Log in to the site and download the app',
    'Start getting better faster than you thought'
  ]

  const faqs = [
    {
      question: "What is the Full Access Membership?",
      answer: "The Full Access Membership is Oracle Boxing's ongoing coaching and community program. Boxers train live with the coaches every week, get feedback on their videos, and keep building their skills after finishing any courses or the 6-Week Challenge."
    },
    {
      question: "What do I get with my membership?",
      answer: "Live coaching calls twice per week with Oliver, Toni, and the team. Video feedback on your clips. Access to all call replays through the Recordings Vault. Community help through our private Skool group. Progress tracking and help staying on track."
    },
    {
      question: "How much does it cost?",
      answer: "We offer three plans:\n\n• Quarterly: Paid every 3 months\n• 6-Month: Paid every 6 months (save about 15%)\n• Annual: Paid every year (save about 25%)\n\nPrices show in your local money and renew on their own unless you cancel. You can switch to monthly billing after you buy."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. You can cancel your membership anytime from your account settings or by emailing team@oracleboxing.com. Your access stays until the end of your current billing time."
    },
    {
      question: "What happens if I cancel?",
      answer: "You'll lose access to live calls, feedback, and the private community at the end of your billing time. But any courses you bought separately stay in your account forever."
    },
    {
      question: "Can I get my money back?",
      answer: "Membership payments cannot be refunded since they include live access and coaching time. You can cancel future payments anytime."
    },
    {
      question: "What's the difference between membership and the 6-Week Challenge?",
      answer: "The 6-Week Challenge is a short program with a money-back promise if you finish. The Membership is ongoing coaching where you keep getting better, improve your skills, and get direct feedback long-term."
    },
    {
      question: "What's the difference between membership and the courses?",
      answer: "Courses (like BFFP and Oracle Boxing Bundle) teach the system. Membership is where you train the system with live help and feedback."
    },
    {
      question: "What are the membership levels?",
      answer: "Quarterly: Flexible and short-term access.\nBi-Annual: Best for steady improvement with lower pricing.\nAnnual: Best overall value with bonuses like extra vault access."
    },
    {
      question: "What are the optional add-ons?",
      answer: "Lifetime Access (All Courses): $197 to keep every course forever.\n1-Month 1-on-1 Coaching: $397 for four weeks of private Zoom coaching and custom training feedback."
    },
    {
      question: "How do I join the calls?",
      answer: "Once you join, you'll get the Zoom links and calendar invites in your member area and email each week. You can join from any device."
    },
    {
      question: "What if I miss a call?",
      answer: "All sessions are recorded and uploaded to the Recordings Vault, which comes with your membership. You can watch them again anytime."
    },
    {
      question: "Who are the coaches?",
      answer: "Your main coaches are Oliver Betts, Coach Toni, and Coach Charlie."
    },
    {
      question: "How do I get help with billing or access?",
      answer: "Email team@oracleboxing.com for any help. We usually reply within 24 hours (Monday to Friday)."
    }
  ]

  return (
    <>
      {/* Product Schema for Membership */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Oracle Boxing Membership",
            "description": "Ongoing boxing coaching and community program with daily live coaching calls, complete course access, personalized video feedback, and private community support.",
            "image": "https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp",
            "brand": {
              "@type": "Brand",
              "name": "Oracle Boxing"
            },
            "offers": [
              {
                "@type": "Offer",
                "name": "Annual Membership",
                "price": "897",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "url": "https://oracleboxing.com/membership",
                "priceValidUntil": "2026-12-31"
              },
              {
                "@type": "Offer",
                "name": "Bi-Annual Membership",
                "price": "497",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "url": "https://oracleboxing.com/membership"
              },
              {
                "@type": "Offer",
                "name": "Quarterly Membership",
                "price": "297",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "url": "https://oracleboxing.com/membership"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "300"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero Section - Two Column */}
      <section className="pt-12 sm:pt-16 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mx-auto lg:max-w-[80%]">
            {/* Left Column - Text & CTA */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                Join Our Community and Get Live Coaching with Full Access to All Courses
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-3 sm:mb-4 lg:mb-5 leading-relaxed">
                Learn the basics of boxing with modern coaching, smart training methods, and a helpful community from around the world.
              </p>

              {/* Pricing */}
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
                Starting from just <AdaptivePricePerMonth usdAmount={897} months={12} metadata="mema" className="inline" />/mo
              </p>

              {/* CTA Button */}
              <button
                onClick={() => setIsPricingPopupOpen(true)}
                className="ob-btn ob-btn-gp-ybg-p inline-block cursor-pointer"
                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(2rem, 3vw, 3rem)' }}
              >
                ENROLL NOW
              </button>
            </div>

            {/* Right Column - Video */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] aspect-[9/16] overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://sb.oracleboxing.com/Website/membership-herov4-frame.jpg"
                  className="w-full h-full object-cover"
                >
                  <source src="https://sb.oracleboxing.com/Website/membership-herov4.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformations Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 lg:max-w-[80%] mx-auto">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
            Does 16 transformations prove that this works?
          </h3>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-12">
            See what happens when you show up and do the work
          </p>

          {/* Desktop: 4x4 Grid layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4">
            {[
              { video: 'andre.webm', poster: 'andre_poster.webp' },
              { video: 'sha-lyn.webm', poster: 'sha-lyn_poster.webp' },
              { video: 'jordan.webm', poster: 'jordan_poster.webp' },
              { video: 'charlie.webm', poster: 'charlie_poster.webp' },
              { video: 'Niclas.webm', poster: 'Niclas_poster.webp' },
              { video: 'rod.webm', poster: 'rod_poster.webp' },
              { video: 'nico.webm', poster: 'nico_poster.webp' },
              { video: 'keli.webm', poster: 'keli_poster.webp' },
              { video: 'balal.webm', poster: 'balal_poster.webp' },
              { video: 'Beat.webm', poster: 'Beat_poster.webp' },
              { video: 'Bruno.webm', poster: 'Bruno_poster.webp' },
              { video: 'daniel.webm', poster: 'daniel_poster.webp' },
              { video: 'David.webm', poster: 'David_poster.webp' },
              { video: 'iilya.webm', poster: 'iilya_poster.webp' },
              { video: 'kris.webm', poster: 'kris_poster.webp' },
              { video: 'Maria.webm', poster: 'Maria_poster.webp' }
            ].map((item, index) => (
              <div key={index} className="relative aspect-[9/16] rounded-xl overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={`https://sb.oracleboxing.com/Website/transfo/${item.poster}`}
                  className="w-full h-full object-cover"
                >
                  <source src={`https://sb.oracleboxing.com/Website/transfo/${item.video}`} type="video/webm" />
                </video>
              </div>
            ))}
          </div>

          {/* Mobile: Scrollable carousel */}
          <div className="lg:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
            <div className="flex gap-4 pb-4">
              {[
                { video: 'andre.webm', poster: 'andre_poster.webp' },
                { video: 'sha-lyn.webm', poster: 'sha-lyn_poster.webp' },
                { video: 'jordan.webm', poster: 'jordan_poster.webp' },
                { video: 'charlie.webm', poster: 'charlie_poster.webp' },
                { video: 'Niclas.webm', poster: 'Niclas_poster.webp' },
                { video: 'rod.webm', poster: 'rod_poster.webp' },
                { video: 'nico.webm', poster: 'nico_poster.webp' },
                { video: 'keli.webm', poster: 'keli_poster.webp' },
                { video: 'balal.webm', poster: 'balal_poster.webp' },
                { video: 'Beat.webm', poster: 'Beat_poster.webp' },
                { video: 'Bruno.webm', poster: 'Bruno_poster.webp' },
                { video: 'daniel.webm', poster: 'daniel_poster.webp' },
                { video: 'David.webm', poster: 'David_poster.webp' },
                { video: 'iilya.webm', poster: 'iilya_poster.webp' },
                { video: 'kris.webm', poster: 'kris_poster.webp' },
                { video: 'Maria.webm', poster: 'Maria_poster.webp' },
                { video: 'zyginta.webm', poster: 'zyginta_poster.webp' }
              ].map((item, index) => (
                <div key={index} className="relative flex-shrink-0 w-[70vw] sm:w-[320px] aspect-[9/16] rounded-xl overflow-hidden snap-center bg-gray-200">
                  {/* Poster image as background fallback */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(https://sb.oracleboxing.com/Website/transfo/${item.poster})` }}
                  />
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el
                      if (el && !videosLoaded) {
                        setVideosLoaded(true)
                      }
                    }}
                    loop
                    muted
                    playsInline
                    poster={`https://sb.oracleboxing.com/Website/transfo/${item.poster}`}
                    className="relative w-full h-full object-cover"
                    preload="metadata"
                  >
                    <source src={`https://sb.oracleboxing.com/Website/transfo/${item.video}`} type="video/webm" />
                  </video>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learn the Right Way Section */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 lg:max-w-[80%] mx-auto">
          {/* Main Headline */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Three ways to learn
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Structured courses, live coaching, and community support all in one place
            </p>
          </div>

          {/* Three Features Grid */}
          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-12 mb-16 sm:mb-20">
            {/* Feature 1 - Courses */}
            <div className="text-center lg:text-center">
              <div className="mb-4 lg:mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-black text-white text-xl lg:text-2xl font-bold">
                  1
                </div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">
                Structured Courses
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto">
                Complete video courses that break down every fundamental, from stance to power generation
              </p>
            </div>

            {/* Feature 2 - Live Coaching */}
            <div className="text-center lg:text-center">
              <div className="mb-4 lg:mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-black text-white text-xl lg:text-2xl font-bold">
                  2
                </div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">
                Live Coaching Calls
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto">
                Join daily sessions with expert coaches who give real-time feedback and answer your questions
              </p>
            </div>

            {/* Feature 3 - Community */}
            <div className="text-center lg:text-center">
              <div className="mb-4 lg:mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-black text-white text-xl lg:text-2xl font-bold">
                  3
                </div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">
                Active Community
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto">
                Train alongside 300+ members who share progress, ask questions, and push each other forward
              </p>
            </div>
          </div>

          {/* Social Proof - Three Testimonials */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Niclas Testimonial */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src="https://sb.oracleboxing.com/webp/Website/niclas.webp"
                  alt="Niclas Laux"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div className="font-bold text-gray-900 text-sm sm:text-base">Niclas Laux</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Martial Arts Instructor</div>
                </div>
              </div>
              <blockquote className="text-base sm:text-lg text-gray-900 leading-relaxed">
                "This is THE source of our kinetic energy potential. Can't thank you enough for the changes I've made thanks to your dedication with First Principles! It was the best choice of my martial arts life - the aha-moments are incredible!"
              </blockquote>
            </div>

            {/* Torey Testimonial */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src="https://sb.oracleboxing.com/webp/Website/torey.webp"
                  alt="Torey Goodall"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div className="font-bold text-gray-900 text-sm sm:text-base">Torey Goodall</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Community Member</div>
                </div>
              </div>
              <blockquote className="text-base sm:text-lg text-gray-900 leading-relaxed">
                "I decided to recommit to this community and I already feel like I made breakthroughs on Toni and Ollie's zoom calls. I've gotta tip my hat to how effective you guys are at coaching in this format. I feel like I gain a significantly better understanding of technique every time I make a call."
              </blockquote>
            </div>

            {/* Balal Testimonial */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src="https://sb.oracleboxing.com/webp/Website/balal.webp"
                  alt="Balal Hanif"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div className="font-bold text-gray-900 text-sm sm:text-base">Balal Hanif</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Community Member</div>
                </div>
              </div>
              <blockquote className="text-base sm:text-lg text-gray-900 leading-relaxed">
                "Being part of this community has been an incredibly transformative experience. Joining the live Zoom calls almost every day has helped me lose weight, improve my technique, and significantly boost my confidence."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* See Inside The Platform Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 lg:max-w-[80%] mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
            See Inside The Platform
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 text-center max-w-3xl mx-auto">
            Everything you need to learn boxing, all in one place
          </p>

          {/* Desktop: 2-column grid */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside1.webp',
                title: 'All Your Courses in One Place',
                subtitle: 'Access all three courses from a single organized dashboard'
              },
              {
                image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside2.webp',
                title: 'Full Video Lessons',
                subtitle: 'Follow clear lessons with detailed video shows and learning'
              },
              {
                image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside3.webp',
                title: 'Follow-Along Workouts',
                subtitle: 'Train with step-by-step drills and clear workout plans'
              },
              {
                image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside4.webp',
                title: 'Strong Search Feature',
                subtitle: 'Find any move, idea, or drill quickly across all courses'
              }
            ].map((screenshot, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 lg:p-8 text-center">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                    {screenshot.title}
                  </h3>
                  <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-4">
                    {screenshot.subtitle}
                  </p>
                </div>
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={screenshot.image}
                    alt={screenshot.title}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Vertical stacked cards */}
          <div className="lg:hidden space-y-6">
            {[
              {
                image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside1.webp',
                title: 'All Your Courses in One Place',
                subtitle: 'Access all three courses from a single organized dashboard'
              },
              {
                image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside2.webp',
                title: 'Full Video Lessons',
                subtitle: 'Follow clear lessons with detailed video shows and learning'
              },
              {
                image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside3.webp',
                title: 'Follow-Along Workouts',
                subtitle: 'Train with step-by-step drills and clear workout plans'
              },
              {
                image: 'https://sb.oracleboxing.com/Website/optimized/screenshots/inside4.webp',
                title: 'Strong Search Feature',
                subtitle: 'Find any move, idea, or drill quickly across all courses'
              }
            ].map((screenshot, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden">
                <div className="p-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    {screenshot.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed mb-4">
                    {screenshot.subtitle}
                  </p>
                </div>
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={screenshot.image}
                    alt={screenshot.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inline Membership Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 lg:max-w-[80%] mx-auto">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 text-center">
            Join Oracle Boxing for as little as <AdaptivePricePerMonth usdAmount={897} months={12} metadata="mema" className="inline" /> per month!
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            Choose the plan that fits your commitment level
          </p>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 sm:mb-8">
            {/* Annual - Left */}
            <div className="relative">
              {/* Best Value Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#FFF8DC] text-black text-xs font-black uppercase rounded-full z-10 whitespace-nowrap border-2 border-black">
                Best Value
              </div>

              <div
                onClick={() => setSelectedPlan('membership-annual')}
                className={`cursor-pointer rounded-xl border-2 transition-all ${
                  selectedPlan === 'membership-annual'
                    ? 'border-[#FFF8DC] bg-gray-900'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'membership-annual' ? 'border-[#FFF8DC] bg-[#FFF8DC]' : 'border-gray-600 bg-gray-900'
                    }`}>
                      {selectedPlan === 'membership-annual' && (
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Annual</h3>
                    <div className="text-3xl sm:text-4xl font-black text-white">
                      <AdaptivePrice usdAmount={897} metadata="mema" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-3">Billed every year</div>
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        <AdaptivePricePerMonth usdAmount={897} months={12} metadata="mema" />
                      </div>
                      <div className="text-xs text-gray-400">/ month</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">incl. all taxes</div>
                </div>
              </div>
            </div>

            {/* 6-Month - Middle */}
            <div className="relative">
              <div
                onClick={() => setSelectedPlan('membership-6month')}
                className={`cursor-pointer rounded-xl border-2 transition-all ${
                  selectedPlan === 'membership-6month'
                    ? 'border-[#FFF8DC] bg-gray-900'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'membership-6month' ? 'border-[#FFF8DC] bg-[#FFF8DC]' : 'border-gray-600 bg-gray-900'
                    }`}>
                      {selectedPlan === 'membership-6month' && (
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Bi-Annual</h3>
                    <div className="text-3xl sm:text-4xl font-black text-white">
                      <AdaptivePrice usdAmount={497} metadata="mem6" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-3">Billed every 6 months</div>
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        <AdaptivePricePerMonth usdAmount={497} months={6} metadata="mem6" />
                      </div>
                      <div className="text-xs text-gray-400">/ month</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">incl. all taxes</div>
                </div>
              </div>
            </div>

            {/* Quarterly - Right */}
            <div className="relative">
              <div
                onClick={() => setSelectedPlan('membership-monthly')}
                className={`cursor-pointer rounded-xl border-2 transition-all ${
                  selectedPlan === 'membership-monthly'
                    ? 'border-[#FFF8DC] bg-gray-900'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'membership-monthly' ? 'border-[#FFF8DC] bg-[#FFF8DC]' : 'border-gray-600 bg-gray-900'
                    }`}>
                      {selectedPlan === 'membership-monthly' && (
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Quarterly</h3>
                    <div className="text-3xl sm:text-4xl font-black text-white">
                      <AdaptivePrice usdAmount={297} metadata="memq" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-3">Billed every 3 months</div>
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        <AdaptivePricePerMonth usdAmount={297} months={3} metadata="memq" />
                      </div>
                      <div className="text-xs text-gray-400">/ month</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">incl. all taxes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Join Now Button */}
          <div className="text-center mb-3 sm:mb-4">
            <button
              onClick={() => router.push(`/checkout?product=${selectedPlan}&source=membership-page`)}
              className="py-4 sm:py-5 lg:py-6 px-10 sm:px-12 lg:px-14 bg-[#FFF8DC] text-black font-black text-xl sm:text-2xl md:text-3xl rounded-xl uppercase tracking-wide transition-colors cursor-pointer hover:bg-white flex items-center justify-center gap-2 mx-auto border-4 border-black"
            >
              CHECKOUT
              <span className="text-2xl sm:text-3xl">→</span>
            </button>
          </div>

          {/* Monthly billing note */}
          <p className="text-center text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
            You can switch to monthly billing at <AdaptivePrice usdAmount={97} metadata="mem_monthly" className="inline" />/month after purchase
          </p>

          {/* Payment Methods */}
          <div className="payment_icons-group mb-6 sm:mb-8">
            <img
              loading="lazy"
              alt=""
              src="https://sb.oracleboxing.com/Website/payment1.svg"
              className="image-55"
            />
            <img
              loading="lazy"
              alt=""
              src="https://sb.oracleboxing.com/Website/payment2.svg"
              className="image-55 second"
            />
            <img
              loading="lazy"
              alt=""
              src="https://sb.oracleboxing.com/Website/paypal2.svg"
              className="image-55 bigger"
            />
            <img
              loading="lazy"
              src="https://sb.oracleboxing.com/Website/klarna.svg"
              alt=""
              className="image-55 bigger-mobile"
            />
          </div>

          {/* Benefits List - 2 Column Grid */}
          <div className="mb-6 sm:mb-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-4">
              {/* Left Column */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#FFF8DC] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-white">
                  <strong className="font-bold">Unlimited access</strong> to all Oracle Boxing courses and replays
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#FFF8DC] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-white">
                  <strong className="font-bold">Entry to the private Skool coaching community</strong>
                </span>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#FFF8DC] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-white">
                  <strong className="font-bold">Daily live coaching calls</strong> and community training sessions
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#FFF8DC] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-white">
                  <strong className="font-bold">Leaderboards, accountability, and live competitions</strong>
                </span>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#FFF8DC] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-white">
                  <strong className="font-bold">Personal feedback</strong> on your training videos from real coaches
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#FFF8DC] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-white">
                  <strong className="font-bold">Exclusive workshops, mentorship calls, and bonus drops</strong>
                </span>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#FFF8DC] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-white">
                  <strong className="font-bold">Access to the full Boxing Masterclass and Boxing Roadmap</strong>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#FFF8DC] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-white">
                  <strong className="font-bold">Free access</strong> to all future courses and system updates
                </span>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="border-t border-gray-700 pt-6 sm:pt-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
              How it works
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-8 h-8 text-[#FFF8DC]" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-white font-semibold">
                  Choose your plan and finish buying
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-8 h-8 text-[#FFF8DC]" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-white font-semibold">
                  Log in to the site and download the app
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Progress className="w-8 h-8 text-[#FFF8DC]" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-white font-semibold">
                  Start getting better faster than you thought
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 lg:max-w-[80%] mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 lg:p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 pr-4 sm:pr-6 lg:pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 bg-gray-50">
                    <p className="text-xs sm:text-sm lg:text-base text-gray-700 whitespace-pre-line leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Popup */}
      <MembershipPricingPopup
        isOpen={isPricingPopupOpen}
        onClose={() => setIsPricingPopupOpen(false)}
        defaultPlan={selectedPlan}
      />

      <Footer />

      {/* Black Friday Challenge Popup */}
      <BlackFridayChallengePopup />
    </div>
    </>
  )
}
