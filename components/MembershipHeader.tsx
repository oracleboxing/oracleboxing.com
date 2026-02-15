"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Pricing", href: "/pricing" },
]

export default function MembershipHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`w-full bg-white py-4 fixed top-0 left-0 right-0 z-50 transition-shadow ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="https://sb.oracleboxing.com/logo/long_dark.webp"
            alt="Oracle Boxing"
            width={120}
            height={24}
            className="h-6 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#37322F] text-sm font-medium hover:text-[#37322F]/70 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/pricing"
            className="h-10 px-6 border border-[#37322F] text-[#37322F] rounded-lg font-medium text-sm inline-flex items-center justify-center hover:bg-[#F7F5F3] transition-colors"
          >
            View Pricing
          </Link>
          <Link
            href="/membership"
            className="h-10 px-6 bg-[#37322f] hover:bg-[#37322f]/90 text-white rounded-lg font-medium text-sm inline-flex items-center justify-center transition-all"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#37322F]"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-[rgba(55,50,47,0.1)]">
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#37322F] text-base font-medium hover:text-[#37322F]/70 transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[rgba(55,50,47,0.1)] space-y-3">
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full h-10 px-6 border border-[#37322F] text-[#37322F] rounded-lg font-medium text-sm text-center leading-10 hover:bg-[#F7F5F3] transition-colors"
              >
                View Pricing
              </Link>
              <Link
                href="/membership"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full h-10 px-6 bg-[#37322f] hover:bg-[#37322f]/90 text-white rounded-lg font-medium text-sm text-center leading-10 transition-all"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
