'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubMenu, setMobileSubMenu] = useState<'courses' | 'coaching' | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { trackButtonClick } = useAnalytics()

  const isHomePage = pathname === '/'

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      // Don't hide header when mobile menu is open
      if (mobileMenuOpen) {
        setIsVisible(true)
        return
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - hide header
            setIsVisible(false)
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up - show header
            setIsVisible(true)
          } else if (currentScrollY === 0) {
            // At the very top - show header
            setIsVisible(true)
          }

          setLastScrollY(currentScrollY)
          ticking = false
        })

        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, mobileMenuOpen])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setMobileSubMenu(null)
  }

  const handleNavClick = (location: string, destination: string) => {
    trackButtonClick({
      button_location: location,
      button_type: 'navigation',
      destination,
    })
  }

  const courses = [
    {
      name: 'Boxing Bundle',
      href: '/courses/bundle',
      image: 'https://sb.oracleboxing.com/Website/optimized/products/obm_tn-small.webp',
    },
    {
      name: 'Boxing Masterclass',
      href: '/courses/bffp',
      image: 'https://sb.oracleboxing.com/Website/optimized/products/bffp_tn5-small.webp',
    },
    {
      name: 'Boxing Roadmap',
      href: '/courses/roadmap',
      image: 'https://sb.oracleboxing.com/Website/optimized/products/tbrtn5hq-small.webp',
    },
  ]

  const coaching = [
    {
      name: 'Full Access Membership',
      href: '/membership',
    },
    {
      name: '6-Week Challenge',
      href: '/6wc',
    },
  ]

  return (
    <>
      <header
        className={`z-50 transition-all duration-300 bg-neutral-900 ${
          isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        } ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Logo and Back Button - Same position with fade transitions */}
            <div className="flex-shrink-0 relative">
              {/* Logo */}
              <Link
                href="/"
                className={`z-10 transition-opacity duration-300 ${
                  mobileMenuOpen || mobileSubMenu ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                onClick={() => handleNavClick('header', '/')}
              >
                <img
                  src="https://sb.oracleboxing.com/Website/infinity_squared_white.svg"
                  alt="Oracle Boxing"
                  className="h-3 md:h-4 w-auto"
                />
              </Link>

              {/* Back Button (when submenu is open) */}
              <button
                onClick={() => setMobileSubMenu(null)}
                className={`md:hidden text-white p-2 rounded-md hover:bg-neutral-800 transition-opacity duration-300 absolute top-1/2 left-0 transform -translate-y-1/4 ${
                  mobileSubMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-label="Back"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8 lg:space-x-12">
              {/* Courses Dropdown */}
              <div className="group relative">
                <button className="text-white font-semibold text-sm lg:text-base tracking-wide hover:text-gray-300 transition-colors py-2">
                  Courses
                </button>

                {/* Courses Dropdown Menu */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-neutral-900 border border-gray-800 rounded-lg shadow-2xl p-6 min-w-[600px]">
                    <div className="grid grid-cols-3 gap-6">
                      {courses.map((course) => (
                        <Link
                          key={course.href}
                          href={course.href}
                          onClick={() => handleNavClick('header_dropdown', course.href)}
                          className="group/item flex flex-col items-center text-center space-y-3 hover:bg-neutral-800 p-4 rounded-lg transition-colors"
                        >
                          <h3 className="text-white font-semibold text-sm tracking-wide group-hover/item:font-bold transition-all">
                            {course.name}
                          </h3>
                          <div className="w-full aspect-video relative overflow-hidden rounded-md">
                            <img
                              src={course.image}
                              alt={course.name}
                              className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Dropdown */}
              <div className="group relative">
                <button className="text-white font-semibold text-sm lg:text-base tracking-wide hover:text-gray-300 transition-colors py-2">
                  Community
                </button>

                {/* Community Dropdown Menu */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-neutral-900 border border-gray-800 rounded-lg shadow-2xl py-3 min-w-[240px]">
                    {coaching.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => handleNavClick('header_dropdown', item.href)}
                        className="block px-6 py-3 text-white font-medium text-sm tracking-wide hover:bg-neutral-800 hover:font-semibold transition-all"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clothing Link */}
              <a
                href="https://shop.oracleboxing.com/collections/catalog?utm_source=oracleboxing.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleNavClick('header', 'https://shop.oracleboxing.com')}
                className="text-white font-semibold text-sm lg:text-base tracking-wide hover:text-gray-300 transition-colors"
              >
                Clothing
              </a>

              {/* Contact Link */}
              <Link
                href="/contact"
                onClick={() => handleNavClick('header', '/contact')}
                className="text-white font-semibold text-sm lg:text-base tracking-wide hover:text-gray-300 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => {
                if (mobileMenuOpen) {
                  closeMobileMenu()
                } else {
                  setMobileMenuOpen(true)
                }
              }}
              className="md:hidden text-white p-2 rounded-md hover:bg-neutral-800 transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center relative">
                <div
                  className={`absolute w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45' : '-translate-y-1'
                  }`}
                ></div>
                <div
                  className={`absolute w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45' : 'translate-y-1'
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed left-0 right-0 bg-neutral-900 shadow-2xl z-40 md:hidden transition-all duration-300 ease-out origin-top ${
          mobileMenuOpen ? 'top-0 bottom-0 opacity-100 pt-12' : 'top-0 bottom-full opacity-0'
        }`}
      >
        <div className="h-full overflow-hidden relative">
          {/* Layer 1: Main Menu */}
          <div
            className={`h-full transition-all duration-300 ease-out ${
              mobileSubMenu ? '-translate-x-8 opacity-0' : 'translate-x-0 opacity-100'
            }`}
          >
            <nav className="p-6">
              <div className="flex flex-col space-y-1">
                {/* Courses Button */}
                <button
                  onClick={() => setMobileSubMenu('courses')}
                  className="text-white font-bold text-xl py-4 px-5 hover:bg-neutral-800 rounded-lg transition-colors text-left"
                >
                  Courses
                </button>

                {/* Community Button */}
                <button
                  onClick={() => setMobileSubMenu('coaching')}
                  className="text-white font-bold text-xl py-4 px-5 hover:bg-neutral-800 rounded-lg transition-colors text-left"
                >
                  Community
                </button>

                {/* Clothing Link */}
                <a
                  href="https://shop.oracleboxing.com/collections/catalog?utm_source=oracleboxing.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    handleNavClick('mobile_menu', 'https://shop.oracleboxing.com')
                    closeMobileMenu()
                  }}
                  className="text-white font-bold text-xl py-4 px-5 hover:bg-neutral-800 rounded-lg transition-colors text-left block"
                >
                  Clothing
                </a>

                {/* Contact Link */}
                <Link
                  href="/contact"
                  onClick={() => {
                    handleNavClick('mobile_menu', '/contact')
                    closeMobileMenu()
                  }}
                  className="text-white font-bold text-xl py-4 px-5 hover:bg-neutral-800 rounded-lg transition-colors text-left block"
                >
                  Contact
                </Link>
              </div>
            </nav>
          </div>

          {/* Layer 2: Courses Submenu */}
          <div
            className={`absolute inset-0 bg-neutral-900 transition-all duration-300 ease-out ${
              mobileSubMenu === 'courses' ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Courses List */}
              <nav className="flex-1 p-6">
                <div className="flex flex-col space-y-3">
                  {courses.map((course) => (
                    <Link
                      key={course.href}
                      href={course.href}
                      onClick={() => {
                        handleNavClick('mobile_submenu', course.href)
                        closeMobileMenu()
                      }}
                      className="flex flex-col space-y-2 p-3 hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <h4 className="text-white font-semibold text-base">{course.name}</h4>
                      <div className="w-full max-w-[200px] aspect-video relative overflow-hidden rounded-md">
                        <img
                          src={course.image}
                          alt={course.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>

          {/* Layer 2: Community Submenu */}
          <div
            className={`absolute inset-0 bg-neutral-900 transition-all duration-300 ease-out ${
              mobileSubMenu === 'coaching' ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Community List */}
              <nav className="flex-1 p-6">
                <div className="flex flex-col space-y-2">
                  {coaching.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        handleNavClick('mobile_submenu', item.href)
                        closeMobileMenu()
                      }}
                      className="text-white font-semibold text-lg py-4 px-4 hover:bg-neutral-800 rounded-lg transition-colors block"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
