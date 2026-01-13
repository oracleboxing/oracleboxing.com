'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LiquidGlassHeader() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<'home' | 'pricing' | 'contact' | null>('home')
  const [homeMagnify, setHomeMagnify] = useState(false)
  const [pricingMagnify, setPricingMagnify] = useState(false)
  const [contactMagnify, setContactMagnify] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Track timeouts for cleanup
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])

  const isHomePage = pathname === '/'

  useEffect(() => {
    setIsMounted(true)
    // Cleanup all timeouts on unmount
    return () => {
      timeoutRefs.current.forEach(clearTimeout)
    }
  }, [])

  // Throttled scroll handler
  const checkActiveSection = useCallback(() => {
    const pricingSection = document.getElementById('pricing')
    const scrollPosition = window.scrollY + 200

    if (pricingSection) {
      const pricingTop = pricingSection.offsetTop

      if (scrollPosition >= pricingTop) {
        setActiveSection('pricing')
      } else {
        setActiveSection('home')
      }
    }
  }, [])

  // Check which section is currently in view - with throttling
  useEffect(() => {
    if (!isHomePage) return

    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkActiveSection()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    checkActiveSection()

    return () => window.removeEventListener('scroll', throttledScroll)
  }, [isHomePage, checkActiveSection])

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setHomeMagnify(true)
    const timeout = setTimeout(() => setHomeMagnify(false), 400)
    timeoutRefs.current.push(timeout)

    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.location.href = '/'
    }
  }

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setPricingMagnify(true)
    const timeout = setTimeout(() => setPricingMagnify(false), 400)
    timeoutRefs.current.push(timeout)

    if (isHomePage) {
      const pricingSection = document.getElementById('pricing')
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      window.location.href = '/#pricing'
    }
  }

  const handleContactClick = () => {
    setContactMagnify(true)
    const timeout = setTimeout(() => setContactMagnify(false), 400)
    timeoutRefs.current.push(timeout)
  }

  const isActive = (section: 'home' | 'pricing' | 'contact') => {
    if (!isMounted) return false
    return activeSection === section
  }

  const isMagnified = (section: 'home' | 'pricing' | 'contact') => {
    if (!isMounted) return false
    switch (section) {
      case 'home': return homeMagnify
      case 'pricing': return pricingMagnify
      case 'contact': return contactMagnify
    }
  }

  return (
    <header className="fixed bottom-6 lg:bottom-auto lg:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav
        className="pointer-events-auto bg-white/80 border border-white/50 rounded-full p-1.5"
        style={{
          boxShadow: '0 8px 32px rgba(17, 17, 17, 0.08), 0 2px 8px rgba(17, 17, 17, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(17, 17, 17, 0.03)'
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-center gap-1">
          {/* Home link */}
          <a
            href="/"
            onClick={handleHomeClick}
            className={`flex items-center justify-center text-gray-900 no-underline py-2 px-4 rounded-full transition-all duration-200 ${
              isActive('home') ? 'bg-gray-900/10' : 'hover:bg-gray-900/5'
            } ${isMagnified('home') ? 'scale-110 bg-gray-900/10' : ''}`}
            style={isActive('home') ? {
              boxShadow: 'inset 0 1px 2px rgba(17, 17, 17, 0.08), inset 0 -1px 1px rgba(255, 255, 255, 0.3)'
            } : {}}
            aria-label="Home"
          >
            <div className="flex flex-col items-center gap-0.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isActive('home') ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isMagnified('home') ? 'scale-[1.15]' : ''}`}
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className={`text-[10px] font-medium tracking-tight text-gray-900 transition-opacity duration-200 ${
                isActive('home') ? 'opacity-100 font-semibold' : 'opacity-70'
              }`}>
                Home
              </span>
            </div>
          </a>

          {/* Pricing link */}
          <a
            href="/#pricing"
            onClick={handlePricingClick}
            className={`flex items-center justify-center text-gray-900 no-underline py-2 px-4 rounded-full transition-all duration-200 ${
              isActive('pricing') ? 'bg-gray-900/10' : 'hover:bg-gray-900/5'
            } ${isMagnified('pricing') ? 'scale-110 bg-gray-900/10' : ''}`}
            style={isActive('pricing') ? {
              boxShadow: 'inset 0 1px 2px rgba(17, 17, 17, 0.08), inset 0 -1px 1px rgba(255, 255, 255, 0.3)'
            } : {}}
            aria-label="Pricing"
          >
            <div className="flex flex-col items-center gap-0.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isActive('pricing') ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isMagnified('pricing') ? 'scale-[1.15]' : ''}`}
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <span className={`text-[10px] font-medium tracking-tight text-gray-900 transition-opacity duration-200 ${
                isActive('pricing') ? 'opacity-100 font-semibold' : 'opacity-70'
              }`}>
                Pricing
              </span>
            </div>
          </a>

          {/* Contact link */}
          <Link
            href="/contact"
            onClick={handleContactClick}
            className={`flex items-center justify-center text-gray-900 no-underline py-2 px-4 rounded-full transition-all duration-200 ${
              pathname === '/contact' ? 'bg-gray-900/10' : 'hover:bg-gray-900/5'
            } ${isMagnified('contact') ? 'scale-110 bg-gray-900/10' : ''}`}
            style={pathname === '/contact' ? {
              boxShadow: 'inset 0 1px 2px rgba(17, 17, 17, 0.08), inset 0 -1px 1px rgba(255, 255, 255, 0.3)'
            } : {}}
            aria-label="Contact"
          >
            <div className="flex flex-col items-center gap-0.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={pathname === '/contact' ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isMagnified('contact') ? 'scale-[1.15]' : ''}`}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className={`text-[10px] font-medium tracking-tight text-gray-900 transition-opacity duration-200 ${
                pathname === '/contact' ? 'opacity-100 font-semibold' : 'opacity-70'
              }`}>
                Contact
              </span>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default LiquidGlassHeader
