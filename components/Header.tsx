'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { trackButtonClick } = useAnalytics()

  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
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

      // Set scrolled state for background
      setIsScrolled(currentScrollY > 50)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
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
      image: 'https://media.oracleboxing.com/Website/optimized/products/obm_tn-small.webp',
    },
    {
      name: 'Boxing Masterclass',
      href: '/courses/bffp',
      image: 'https://media.oracleboxing.com/Website/optimized/products/bffp_tn5-small.webp',
    },
    {
      name: 'Boxing Roadmap',
      href: '/courses/roadmap',
      image: 'https://media.oracleboxing.com/Website/optimized/products/tbrtn5hq-small.webp',
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
        className={`shadow-lg z-40 transition-all duration-300 ${
          isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        } ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isHomePage && !isScrolled && !isHovered
            ? 'bg-transparent'
            : 'bg-black'
        }`}
        onMouseEnter={() => isHomePage && setIsHovered(true)}
        onMouseLeave={() => isHomePage && setIsHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Logo - Left side */}
            <Link
              href="/"
              className="flex-shrink-0 z-10"
              onClick={() => handleNavClick('header', '/')}
            >
              <img
                src="https://media.oracleboxing.com/Website/infinity_squared_white.svg"
                alt="Oracle Boxing"
                className="h-3 md:h-4 w-auto"
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8 lg:space-x-12">
              {/* Courses Dropdown */}
              <div className="group relative">
                <button className="text-white font-semibold text-sm lg:text-base tracking-wide hover:text-gray-300 transition-colors py-2">
                  Courses
                </button>

                {/* Courses Dropdown Menu */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6 min-w-[600px]">
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

              {/* Coaching Dropdown */}
              <div className="group relative">
                <button className="text-white font-semibold text-sm lg:text-base tracking-wide hover:text-gray-300 transition-colors py-2">
                  Coaching
                </button>

                {/* Coaching Dropdown Menu */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-black border border-gray-800 rounded-lg shadow-2xl py-3 min-w-[240px]">
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
                href="https://shop.oracleboxing.com/collections/all?utm_source=oracleboxing.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleNavClick('header', 'https://shop.oracleboxing.com')}
                className="text-white font-semibold text-sm lg:text-base tracking-wide hover:text-gray-300 transition-colors"
              >
                Clothing
              </a>
            </nav>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 rounded-md hover:bg-neutral-800 transition-colors z-10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                  <div className="w-full h-0.5 bg-white rounded-full"></div>
                  <div className="w-full h-0.5 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 right-0 bg-black shadow-2xl z-50 md:hidden transform transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="max-h-screen overflow-y-auto">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-end p-4 border-b border-gray-800">
            <button
              onClick={closeMobileMenu}
              className="text-white p-2 rounded-md hover:bg-neutral-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="p-6">
            <div className="flex flex-col space-y-6">
              {/* Courses Section */}
              <div className="space-y-3">
                <h3 className="text-white font-bold text-lg px-4">Courses</h3>
                {courses.map((course, index) => (
                  <Link
                    key={course.href}
                    href={course.href}
                    onClick={() => {
                      handleNavClick('mobile_menu', course.href)
                      closeMobileMenu()
                    }}
                    className="flex flex-col space-y-3 p-4 hover:bg-neutral-800 rounded-lg transition-all"
                    style={{
                      animation: mobileMenuOpen ? `slideIn 0.3s ease-out ${index * 0.1}s both` : 'none'
                    }}
                  >
                    <h4 className="text-white font-semibold text-base">{course.name}</h4>
                    <div className="w-full max-w-xs mx-auto aspect-video relative overflow-hidden rounded-md">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Coaching Section */}
              <div className="space-y-3">
                <h3 className="text-white font-bold text-lg px-4">Coaching</h3>
                {coaching.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      handleNavClick('mobile_menu', item.href)
                      closeMobileMenu()
                    }}
                    className="block text-white font-medium text-base py-3 px-4 hover:bg-neutral-800 rounded-lg transition-all"
                    style={{
                      animation: mobileMenuOpen ? `slideIn 0.3s ease-out ${(courses.length + index) * 0.1}s both` : 'none'
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Clothing Link */}
              <a
                href="https://shop.oracleboxing.com/collections/all?utm_source=oracleboxing.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleNavClick('mobile_menu', 'https://shop.oracleboxing.com')
                  closeMobileMenu()
                }}
                className="block text-white font-bold text-lg py-4 px-4 hover:bg-neutral-800 rounded-lg transition-all"
                style={{
                  animation: mobileMenuOpen ? `slideIn 0.3s ease-out ${(courses.length + coaching.length) * 0.1}s both` : 'none'
                }}
              >
                Clothing
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
