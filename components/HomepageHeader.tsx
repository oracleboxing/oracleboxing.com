"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ENROLLMENT_CLOSED, getCheckoutUrl } from "@/lib/enrollment"
import { getClientSiteMode, getHeaderButtonLink } from "@/lib/site-mode"
// Campaign removed
// CampaignSpotCounter removed
import { trackAddToCart } from "@/lib/webhook-tracking"
import { useCurrency } from "@/contexts/CurrencyContext"
import { getProductPrice } from "@/lib/currency"


function getNavLinks(mode: string) {
  if (mode === 'membership') {
    return [
      { label: "Transformations", href: "#transformations" },
      { label: "What's Included", href: "#whats-included" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ]
  }
  // challenge or test
  return [
    { label: "Transformations", href: "#transformations" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ]
}


export default function HomepageHeader() {
  const { currency } = useCurrency()
  const [isScrolled, setIsScrolled] = useState(false)
  const [pricingVisible, setPricingVisible] = useState(false)
  const siteMode = getClientSiteMode()
  const headerLink = getHeaderButtonLink(siteMode)
  const navLinksForMode = getNavLinks(siteMode)

  // Track scroll position to hide mobile header when sticky footer appears
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hide header when pricing section is in view
  useEffect(() => {
    const pricingEl = document.getElementById('pricing')
    if (!pricingEl) return

    const observer = new IntersectionObserver(
      ([entry]) => setPricingVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(pricingEl)
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleJoinNowClick = () => {
    if (ENROLLMENT_CLOSED) return // Don't track AddToCart for waitlist

    const price = getProductPrice('21dc_entry', currency) || 147
    trackAddToCart('21dc-entry', '21-Day Challenge', price, currency, 'header')
  }

  return (
    <header className={`fixed left-0 right-0 z-50 transition-transform duration-300 top-0 ${pricingVisible ? '-translate-y-full' : 'translate-y-0'} px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between rounded-2xl border border-white/60 h-14 md:h-16"
        style={{
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(12px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
        }}
      >
        {/* Logo - long dark on both mobile and desktop */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="https://sb.oracleboxing.com/logo/long_dark.webp"
            alt="Oracle Boxing"
            width={240}
            height={48}
            className="h-4 md:h-5 w-auto"
            unoptimized
            priority
          />
        </Link>

        {/* Mobile: Join Now button on right */}
        <Link
          href={ENROLLMENT_CLOSED ? getCheckoutUrl() : headerLink}
          onClick={handleJoinNowClick}
          className="md:hidden h-8 px-4 bg-[#37322f] hover:bg-[#37322f]/90 text-white rounded-xl font-medium text-xs inline-flex items-center justify-center transition-all"
        >
          {ENROLLMENT_CLOSED ? 'Join Waitlist' : 'Join Now'}
        </Link>

        {/* Navigation - Center (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinksForMode.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[#37322F] text-body font-medium hover:text-[#37322F]/70 transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Side - Spot Counter + Join Now Button (hidden on mobile - sticky bar handles it) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Join Now Button */}
          <Link
            href={ENROLLMENT_CLOSED ? getCheckoutUrl() : headerLink}
            onClick={handleJoinNowClick}
            className="h-10 px-6 bg-[#37322f] hover:bg-[#37322f]/90 text-white rounded-xl font-medium text-body inline-flex items-center justify-center transition-all"
          >
            Join Now
          </Link>
        </div>
      </div>
    </header>
  )
}
