import NewHeroSection from "@/components/NewHeroSection"
import ChallengeDetailsSection from "@/components/ChallengeDetailsSection"
import FooterSection from "@/components/footer-section"
import ChallengeFAQSection from "@/components/ChallengeFAQSection"
import TeamSection from "@/components/TeamSection"
import HomepageHeader from "@/components/HomepageHeader"
import { TestimonialMarquee } from "@/components/TestimonialMarquee"
import TransformationDetailsCarousel from "@/components/TransformationDetailsCarousel"
import PricingSection from "@/components/PricingSection"
import { FadeInOnScroll } from "@/components/FadeInOnScroll"
import MembershipPricingSection from "@/components/MembershipPricingSection"
import CoursePreviewSection from "@/components/CoursePreviewSection"
import StickyMobileCTA from "@/components/StickyMobileCTA"
import { getSiteMode, showChallengeDetails, showCoursePreview, showChallengePricing, showMembershipPricing } from "@/lib/site-mode"

export default function Home() {
  const mode = getSiteMode()

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ overflowX: 'clip' }}>
      {/* Campaign banner removed */}
      <HomepageHeader />
      <StickyMobileCTA />

      {/* Hero - full bleed, no side margins, header floats over it */}
      <NewHeroSection />

      <div className="flex-1">
        <main className="flex-1 min-w-0">
        <TestimonialMarquee />
        <FadeInOnScroll>
          <TransformationDetailsCarousel />
        </FadeInOnScroll>
        <div className="w-full h-24 md:h-32" />
        {showChallengeDetails(mode) && (
          <FadeInOnScroll>
            <ChallengeDetailsSection />
          </FadeInOnScroll>
        )}
        {showCoursePreview(mode) && (
          <FadeInOnScroll>
            <CoursePreviewSection />
          </FadeInOnScroll>
        )}
        {showChallengePricing(mode) && (
          <FadeInOnScroll>
            <PricingSection />
          </FadeInOnScroll>
        )}
        {showMembershipPricing(mode) && (
          <FadeInOnScroll>
            <MembershipPricingSection />
          </FadeInOnScroll>
        )}
        <FadeInOnScroll>
          <TeamSection />
        </FadeInOnScroll>
        <FadeInOnScroll>
          <ChallengeFAQSection />
        </FadeInOnScroll>
        <FooterSection />
        </main>
      </div>
    </div>
  )
}
