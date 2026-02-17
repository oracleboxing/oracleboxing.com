import { HeroSection } from "@/components/hero-section"
import NewHeroSection from "@/components/NewHeroSection"
import { MemberQuotes } from "@/components/MemberQuotes"
import PillarsSection from "@/components/PillarsSection"
import ChallengeDetailsSection from "@/components/ChallengeDetailsSection"
import FooterSection from "@/components/footer-section"
import WhoIsForSection from "@/components/WhoIsForSection"
import ChallengeFAQSection from "@/components/ChallengeFAQSection"
import TeamSection from "@/components/TeamSection"
import HomepageHeader from "@/components/HomepageHeader"
import { TestimonialMarquee } from "@/components/TestimonialMarquee"
import TransformationDetailsCarousel from "@/components/TransformationDetailsCarousel"
import { TestimonialsSection } from "@/components/TestimonialPair"
import { ScrollQuote } from "@/components/ScrollQuote"
import PricingSection from "@/components/PricingSection"
import { FadeInOnScroll } from "@/components/FadeInOnScroll"
import WhyOnlineSection from "@/components/WhyOnlineSection"
import MembershipPricingSection from "@/components/MembershipPricingSection"
// import CampaignBanner from "@/components/CampaignBanner"
import ResearchBenefitsSection from "@/components/ResearchBenefitsSection"
import CoursePreviewSection from "@/components/CoursePreviewSection"
import StickyMobileCTA from "@/components/StickyMobileCTA"
// import { CAMPAIGN_ACTIVE } from "@/lib/campaign"

// Banner height for layout adjustment (36px on mobile, 40px on desktop)
const BANNER_HEIGHT = 0

const testimonialData = {
  krisSaville: {
    quote: "It's transformed me in so many ways and the real joy of it is I'm not the only one.",
    name: "Kristopher Saville",
    role: "Strategic Business Development Director",
    image: "https://sb.oracleboxing.com/Website/kris.jpg"
  },
  brunoMartins: {
    quote: "The value that the coaches bring is WAY BEYOND what I ever expected when I joined this challenge.",
    name: "Bruno Martins",
    role: "Engineer",
    image: "https://sb.oracleboxing.com/Website/1560863789646.jpeg"
  },
  krisQually: {
    quote: "I've improved more in 3 weeks with Oracle than 2 years at my local gym.",
    name: "Kris Qually",
    role: "Sales Professional",
    image: "https://sb.oracleboxing.com/Website/kris_qually.webp"
  },
  antonPolyakov: {
    quote: "Oracle Boxing is a team of top notch young dedicated boxers bringing sharpest boxing technique, attention and dedication to you individually.",
    name: "Anton Polyakov",
    role: "PhD, Director at NVIDIA",
    image: "https://sb.oracleboxing.com/Website/anton.webp"
  },
  meiyanC: {
    quote: "As a minority in the martial arts world, I feel safe joining classes in this respectful community, where scientific coaching has truly transformed my movement.",
    name: "Meiyan C",
    role: "PhD, Organizational Culture Strategist at Google",
    image: "https://sb.oracleboxing.com/Website/meiyan.webp"
  },
  mikeForouzanfar: {
    quote: "Oracle Boxing is all about fun, form, and focus—embedded in a strong, supportive community of coaches and fellow boxing enthusiasts.",
    name: "Mike Forouzanfar",
    role: "Consultant Urologist & Pelvic-Floor Specialist",
    image: "https://sb.oracleboxing.com/Website/Forouzanfar-M.-Uroloog_LR.webp"
  },
  rodKeher: {
    quote: "Boxing elevated to a true martial art, curated for and shared by a dedicated, supportive and truly special community.",
    name: "Rod Keher",
    role: "CEO",
    image: "https://sb.oracleboxing.com/Website/rod.webp"
  },
  leoCarrillo: {
    quote: "I came for better boxing, but this community completely reset my mindset - and that's made me better in boxing, business, and life.",
    name: "Leo Carrillo III",
    role: "CEO & Co-Founder, Craft",
    image: "https://sb.oracleboxing.com/Website/leo.webp"
  },
  pascalPerau: {
    quote: "Real coaching, real people, real progress — that's what makes this class different.",
    name: "Pascal Perau",
    role: "Software Developer",
    image: "https://sb.oracleboxing.com/Website/pascal.webp"
  },
  thomasHaeusle: {
    quote: "No matter how rough my day was, the training with Oracle boxing team brings me back on track.",
    name: "Thomas Haeusle",
    role: "Managing Director / CSO",
    image: "https://sb.oracleboxing.com/Website/thomas.webp"
  },
  chrisDiamantis: {
    quote: "The strong emphasis in classes and in feedback on posted videos on the basics such as stance and shape as well as kinetic linkage, flow and the connection between defence and offence from the phenomenal coaches as well as the continual support of other members, means that committed students cannot fail to improve.",
    name: "Chris Diamantis",
    role: "Managing Director",
    image: "https://sb.oracleboxing.com/Website/chrisd.webp"
  }
}

export default function Home() {
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
        <FadeInOnScroll>
          <ChallengeDetailsSection />
        </FadeInOnScroll>
        <FadeInOnScroll>
          <CoursePreviewSection />
        </FadeInOnScroll>
        <FadeInOnScroll>
          <PricingSection />
        </FadeInOnScroll>
        <FadeInOnScroll>
          <MembershipPricingSection />
        </FadeInOnScroll>
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
