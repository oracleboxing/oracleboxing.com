"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ENROLLMENT_CLOSED, getCheckoutUrl } from "@/lib/enrollment"
import { CAMPAIGN_ACTIVE } from "@/lib/campaign"
import CampaignSpotCounter from "./CampaignSpotCounter"
import { trackAddToCart } from "@/lib/webhook-tracking"
import { useCurrency } from "@/contexts/CurrencyContext"
import { getProductPrice } from "@/lib/currency"

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
]

export default function HomepageHeader() {
  const { currency } = useCurrency()
  const [isScrolled, setIsScrolled] = useState(false)

  // Track scroll position to hide mobile header when sticky footer appears
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
    <header className={`w-full bg-white py-4 fixed left-0 right-0 z-50 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 ${CAMPAIGN_ACTIVE ? 'top-9 sm:top-10' : 'top-0'} ${isScrolled ? '-translate-y-full md:translate-y-0' : 'translate-y-0'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center md:justify-between">
        {/* Mobile: Centered horizontal logo */}
        <Link href="/" className="md:hidden flex-shrink-0">
          <Image
            src="https://sb.oracleboxing.com/logo/long_dark.webp"
            alt="Oracle Boxing"
            width={80}
            height={16}
            className="h-4 w-auto"
          />
        </Link>

        {/* Desktop: Icon logo on left */}
        <Link href="/" className="hidden md:block flex-shrink-0">
          <Image
            src="https://sb.oracleboxing.com/logo/icon_dark.webp"
            alt="Oracle Boxing"
            width={40}
            height={40}
            className="w-10 h-auto"
          />
        </Link>

        {/* Navigation - Center (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[#37322F] text-sm font-medium hover:text-[#37322F]/70 transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Side - Spot Counter + Join Now Button (hidden on mobile - sticky bar handles it) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Spot Counter (campaign only) */}
          {CAMPAIGN_ACTIVE && (
            <CampaignSpotCounter size="sm" />
          )}

          {/* Join Now Button */}
          <Link
            href={getCheckoutUrl()}
            onClick={handleJoinNowClick}
            className="h-10 px-6 bg-[#37322f] hover:bg-[#37322f]/90 text-white rounded-lg font-medium text-sm inline-flex items-center justify-center transition-all"
          >
            {ENROLLMENT_CLOSED ? 'Join Waitlist' : 'Join Now'}
          </Link>
        </div>
      </div>
    </header>
  )
}
