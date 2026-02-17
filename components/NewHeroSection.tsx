"use client"

import Image from "next/image"
import { ArrowButton } from "@/components/ui/arrow-button"
import { ENROLLMENT_CLOSED, getCheckoutUrl } from "@/lib/enrollment"
import { getClientSiteMode, getHeroButtonText, getHeroButtonLink } from "@/lib/site-mode"
import { trackAddToCart } from "@/lib/webhook-tracking"
import { useCurrency } from "@/contexts/CurrencyContext"
import { getProductPrice } from "@/lib/currency"

/* ─────────────────────────────────────────────
   Liquid Glass Card Wrapper
   ───────────────────────────────────────────── */

function GlassCard({
  children,
  className = "",
  variant = "glass",
}: {
  children: React.ReactNode
  className?: string
  variant?: "glass" | "white"
}) {
  const isWhite = variant === "white"
  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        background: isWhite ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)",
        backdropFilter: isWhite ? undefined : "blur(12px) saturate(1.5)",
        WebkitBackdropFilter: isWhite ? undefined : "blur(12px) saturate(1.5)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow: isWhite
          ? "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)"
          : "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Glass highlight removed for performance */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Unified Platform Visual
   ───────────────────────────────────────────── */

function PlatformVisual() {
  const memberImages = {
    bruno: "https://sb.oracleboxing.com/Website/1560863789646.jpeg",
    kris: "https://sb.oracleboxing.com/Website/kris.jpg",
    anton: "https://sb.oracleboxing.com/Website/anton.webp",
    meiyan: "https://sb.oracleboxing.com/Website/meiyan.webp",
  }

  return (
    <div className="relative w-[65vw] sm:w-full sm:max-w-[720px] lg:max-w-[820px] ml-auto mr-[4%] sm:mx-auto lg:mx-0">
      {/* Main app window - the "inbox" equivalent */}
      <GlassCard className="w-full">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/30">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          <div className="ml-3 flex-1">
            <span className="text-[#37322F] text-[10px] md:text-xs font-semibold">Kinetic Chain Tutorial</span>
          </div>
        </div>

        {/* Course interface inside */}
        <div className="flex h-[240px] md:h-[320px] lg:h-[380px]">
          {/* Sidebar */}
          <div className="hidden sm:flex w-[60px] md:w-[90px] lg:w-[110px] bg-white/30 border-r border-white/30 flex-col overflow-hidden">
            <div className="p-2 md:p-2.5 border-b border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-[#37322F] text-[10px] md:text-xs font-medium">Grade 1</span>
                <span className="text-[#9CA3AF] text-[8px] md:text-[10px]">40%</span>
              </div>
              <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden mt-1.5">
                <div className="h-full w-[40%] bg-[#847971] rounded-full" />
              </div>
            </div>
            <div className="flex-1 py-1 overflow-hidden">
              {[
                { title: "Jab", expanded: true, items: ["Jab Tutorial", "Drill 1"] },
                { title: "Cross", expanded: false, items: [] },
                { title: "Rotation", expanded: true, items: ["Kinetic Chain", "Drill 3", "Drill 4"], activeItem: "Kinetic Chain" },
                { title: "Workouts", expanded: true, items: ["Workout 1"] },
              ].map((section, sIdx) => (
                <div key={sIdx} className="mb-0.5">
                  <div className="flex items-center justify-between px-2.5 md:px-3 py-1 md:py-1.5">
                    <span className="text-[#37322F] text-[9px] md:text-[11px] font-medium">{section.title}</span>
                    <svg className={`w-2.5 h-2.5 text-[#9CA3AF] transition-transform ${section.expanded ? "" : "-rotate-90"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {section.expanded && section.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className={`px-3 md:px-4 py-0.5 md:py-1 text-[8px] md:text-[10px] mx-1 rounded ${
                        section.activeItem === item
                          ? "bg-[#847971]/15 text-[#605A57] font-medium"
                          : "text-[#6B7280]"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 p-1.5 md:p-4 flex flex-col bg-white/20">
            {/* Title moved to window chrome bar */}
            <div className="relative flex-1 bg-black/5 rounded-xl overflow-hidden">
              <Image
                src="https://sb.oracleboxing.com/Website/coaching_tn_1.webp"
                alt="Kinetic Chain Tutorial"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-white text-[10px]">
                45:27
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Community posts - stacked notification cards, top-right */}
      <div className="hidden md:block absolute md:-top-8 md:-right-[18%] md:bottom-auto lg:-top-10 lg:-right-[20%] z-30 space-y-1 md:space-y-2 w-[220px] md:w-[320px] lg:w-[360px]">
          {/* Post 1 - Mike */}
          <GlassCard className="p-2 md:p-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="relative w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden flex-shrink-0">
                <Image src="https://sb.oracleboxing.com/Website/Forouzanfar-M.-Uroloog_LR.webp" alt="Mike Forouzanfar" fill className="object-cover" />
              </div>
              <span className="text-[#37322F] text-[10px] md:text-xs font-semibold">Mike Forouzanfar</span>
            </div>
            <p className="text-[#37322F] text-[10px] md:text-xs font-semibold mb-0.5">Week 5 - Revenge of the Hip Hinge</p>
            <p className="text-[#6B7280] text-[8px] md:text-[10px] line-clamp-1">LAST WEEKS KEY TAKEAWAYS #1 Stance + Shape: Balance - Feet need to be gripping the ground</p>
          </GlassCard>

          {/* Post 2 - Bruno (hidden on mobile) */}
          <GlassCard className="hidden md:block p-2 md:p-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="relative w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden flex-shrink-0">
                <Image src={memberImages.bruno} alt="Bruno Martins" fill className="object-cover" />
              </div>
              <span className="text-[#37322F] text-[10px] md:text-xs font-semibold">Bruno Martins</span>
            </div>
            <p className="text-[#37322F] text-[10px] md:text-xs font-semibold mb-0.5">🥊 Why do YOU really box? (Be honest)</p>
            <p className="text-[#6B7280] text-[8px] md:text-[10px] line-clamp-1">Everyone says &quot;discipline&quot; or &quot;fitness&quot;...but let&apos;s be real for a second 👇</p>
          </GlassCard>
      </div>

      {/* Coaching call - mobile device window, bottom-left (large, like Kinso) */}
      <div className="absolute bottom-[-12%] left-[-35%] md:bottom-[-22%] md:left-[-10%] lg:bottom-[-26%] lg:left-[-12%] z-20">
        <div className="relative w-[45vw] sm:w-[200px] md:w-[240px] lg:w-[280px]">
          {/* Glass card frame */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(12px) saturate(1.5)",
              WebkitBackdropFilter: "blur(12px) saturate(1.5)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Content */}
            <div className="p-3 md:p-4">
              {/* Header image - taller */}
              <div className="relative h-24 md:h-28 rounded-lg overflow-hidden mb-3">
                <Image
                  src="https://sb.oracleboxing.com/Website/skool_art2.jpg"
                  alt="Shape Masterclass"
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-[#37322F] text-[10px] md:text-xs font-semibold mb-1.5">
                Shape Masterclass - Oliver
              </h3>

              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-2.5 h-2.5 text-[#6B7280] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[#37322F] text-[8px] md:text-[10px]">Tomorrow @ 9am - 10am</span>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2.5 h-2.5 bg-[#2D8CFF] rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h10v10H4V4zm12 0v10l4-5V4h-4z" />
                  </svg>
                </div>
                <span className="text-[#2D8CFF] text-[8px] md:text-[10px] font-medium">Zoom link</span>
              </div>

              <div className="space-y-0.5 text-[#49423D] text-[8px] md:text-[10px]">
                <p>Why is shape so important?</p>
                <p>How do I setup my shape?</p>
                <p>How do I maintain it?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Hero Section
   ───────────────────────────────────────────── */

export default function NewHeroSection() {
  const { currency } = useCurrency()
  const price = getProductPrice("21dc_entry", currency) || 147
  const siteMode = getClientSiteMode()
  const heroButtonText = getHeroButtonText(siteMode)
  const heroButtonLink = getHeroButtonLink(siteMode)

  return (
    <section className="relative w-full h-[100svh] md:min-h-[100vh] md:h-auto overflow-x-clip overflow-y-clip md:overflow-y-visible flex items-center">
      {/* Kinso-style gradient: gunmetal/silver left -> white center -> warm brown right */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg,
              #C8C2BC 0%,
              #D5D0CA 15%,
              #E8E3DD 30%,
              #F5F2EF 45%,
              #FAFAF8 55%,
              #F5F0EB 65%,
              #EDE5DA 78%,
              #DDD2C4 90%,
              #C9B9A8 100%
            )
          `,
        }}
      />

      {/* Soft radial overlays for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 70% at 15% 50%, rgba(180, 175, 170, 0.3) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 85% 40%, rgba(200, 180, 155, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 80% 40% at 50% 100%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)
          `,
        }}
      />

      {/* Noise texture removed for performance */}

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:pl-16 lg:pr-0 pt-[max(7rem,calc(env(safe-area-inset-top)+5rem))] pb-16 md:py-0 overflow-visible">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 overflow-visible">

          {/* Left - Text + CTA */}
          <div className="flex-1 flex flex-col items-center lg:items-start gap-4 sm:gap-6 text-center lg:text-left max-w-[540px]">
            <h1 className="text-[#37322F] text-[8vw] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.08] tracking-tight">
              Learn to box
              <span className="block bg-gradient-to-r from-[#8C7560] via-[#7A6B5E] to-[#6B5D52] bg-clip-text text-transparent">
                properly, online.
              </span>
            </h1>

            <p className="text-[#605A57] text-[3.5vw] sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-[460px]">
              Structured courses, live coaching calls, and a community of dedicated boxers. Learn the fundamentals the right way.
            </p>

            {/* CTA + Social proof - hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex flex-col items-start gap-3 mt-2">
              {/* Social proof */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    "https://sb.oracleboxing.com/Website/kris.jpg",
                    "https://sb.oracleboxing.com/Website/1560863789646.jpeg",
                    "https://sb.oracleboxing.com/Website/anton.webp",
                    "https://sb.oracleboxing.com/Website/meiyan.webp",
                    "https://sb.oracleboxing.com/Website/leo.webp",
                  ].map((src, i) => (
                    <div key={i} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/80 shadow-sm">
                      <Image src={src} alt="member" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-[#605A57]">
                  <span className="font-semibold text-[#37322F]">100+</span> boxers improving their technique
                </div>
              </div>

              <ArrowButton
                href={ENROLLMENT_CLOSED ? getCheckoutUrl() : heroButtonLink}
                onClick={() =>
                  !ENROLLMENT_CLOSED &&
                  trackAddToCart("21dc-entry", "21-Day Challenge", price, currency, "hero")
                }
              >
                {ENROLLMENT_CLOSED ? "Join the Waitlist" : heroButtonText}
              </ArrowButton>

              {!ENROLLMENT_CLOSED && (
                <p className="text-[#847971] text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                  Money-back guarantee. Do the work, get a refund.
                </p>
              )}
            </div>
          </div>

          {/* Right - Unified Platform Visual */}
          <div className="flex-1 w-full max-w-[100vw] overflow-visible">
            <PlatformVisual />
          </div>
        </div>

        {/* Mobile CTA - centred below both columns */}
        <div className="flex lg:hidden flex-col items-center gap-3 mt-32 relative z-30">
          {/* Social proof */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {[
                "https://sb.oracleboxing.com/Website/kris.jpg",
                "https://sb.oracleboxing.com/Website/1560863789646.jpeg",
                "https://sb.oracleboxing.com/Website/anton.webp",
                "https://sb.oracleboxing.com/Website/meiyan.webp",
                "https://sb.oracleboxing.com/Website/leo.webp",
              ].map((src, i) => (
                <div key={i} className="relative w-6 h-6 rounded-full overflow-hidden border-[1.5px] border-white/80 shadow-sm">
                  <Image src={src} alt="member" fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="text-xs text-[#605A57] whitespace-nowrap">
              <span className="font-semibold text-[#37322F]">100+</span> boxers improving their technique
            </div>
          </div>

          <ArrowButton
            href={ENROLLMENT_CLOSED ? getCheckoutUrl() : heroButtonLink}
            onClick={() =>
              !ENROLLMENT_CLOSED &&
              trackAddToCart("21dc-entry", "21-Day Challenge", price, currency, "hero")
            }
          >
            {ENROLLMENT_CLOSED ? "Join the Waitlist" : heroButtonText}
          </ArrowButton>

        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

      {/* Unused float animations removed */}
    </section>
  )
}
