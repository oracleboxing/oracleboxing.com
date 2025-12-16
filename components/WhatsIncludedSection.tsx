'use client'

import {
  Trophy,
  Users,
  BookOpen,
  Video,
  Phone,
  Award,
  Shield,
  Star
} from "lucide-react"
import { EpicCTAButton } from '@/components/EpicCTAButton'

export default function WhatsIncludedSection() {
  const features = [
    {
      title: "Boxing Masterclass",
      image: "https://sb.oracleboxing.com/Website/optimized/products/bffp_tn5-large.webp",
      description: "Master the science of boxing with our comprehensive 5-module course covering mindset, anatomy, mechanics, tactics, and conditioning."
    },
    {
      title: "Daily Live Coaching Calls",
      image: "https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp",
      description: "Join Oliver & Toni for daily live coaching sessions where you'll get real-time feedback and technique refinement."
    },
    {
      title: "Private Boxing Community Access",
      image: "https://sb.oracleboxing.com/Website/optimized/screenshots/phone_mockup1.webp",
      description: "Connect with fellow boxers, share your progress, and get support from our expert coaches and community members."
    },
    {
      title: "The Boxing Roadmap",
      image: "https://sb.oracleboxing.com/Website/optimized/products/tbrtn5hq-large.webp",
      description: "Follow our proven 5-phase training system with 100+ workouts taking you from fundamentals to mastery."
    },
  ]

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 text-gray-900" style={{ fontFamily: "var(--font-satoshi)" }}>
          What's Included in the 6-Week Challenge
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="mb-6">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200'
                  }}
                />
              </div>

              {/* Title */}
              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {feature.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12">
          <EpicCTAButton
            size="lg"
            trackingName="whats-included-cta"
          >
            START YOUR CHALLENGE
          </EpicCTAButton>
        </div>
      </div>
    </section>
  )
}
