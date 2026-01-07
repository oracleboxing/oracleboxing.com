import { HeroSection } from "@/components/hero-section"
import MinimalTestimonials from "@/components/MinimalTestimonials"
import TransformationsSection from "@/components/transformations-section"
import ChallengeDetailsSection from "@/components/ChallengeDetailsSection"
import FooterSection from "@/components/footer-section"
import PricingSection from "@/components/pricing-section"
import WhoIsForSection from "@/components/WhoIsForSection"
import FundamentalsWarningSection from "@/components/FundamentalsWarningSection"
import ChallengeFAQSection from "@/components/ChallengeFAQSection"
import TeamSection from "@/components/TeamSection"
import EnrollmentClosedBanner from "@/components/EnrollmentClosedBanner"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFCF5] flex flex-col overflow-x-hidden">
      <EnrollmentClosedBanner />
      <div className="flex flex-1">
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
        <main className="flex-1 min-w-0">
        <HeroSection />
        <MinimalTestimonials />
        <TransformationsSection />
        <ChallengeDetailsSection />
        <PricingSection />
        <WhoIsForSection />
        <FundamentalsWarningSection />
        <TeamSection />
        <ChallengeFAQSection />
        <FooterSection />
        </main>
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
      </div>
    </div>
  )
}
