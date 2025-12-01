'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Instagram, Youtube } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'

export function Header() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { trackSocialClick, trackButtonClick } = useAnalytics()

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

  const isActive = (path: string) => {
    if (path === '/courses') return pathname === '/' || pathname === '/courses' || pathname.startsWith('/courses/')
    return pathname === path
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleSocialClick = (platform: 'instagram' | 'youtube', url: string) => {
    trackSocialClick({
      platform,
      location: 'sidebar',
      destination: url,
    })
  }

  const handleContactClick = () => {
    trackButtonClick({
      button_location: 'sidebar',
      button_type: 'contact',
      destination: 'mailto:team@oracleboxing.com',
    })
  }

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
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left Hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white p-2 rounded-md hover:bg-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Centered Logo - fades when sidebar opens */}
            <Link
              href="/"
              className={`absolute left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
                sidebarOpen ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <img
                src="https://media.oracleboxing.com/Website/optimized/logos/long_white-large.webp"
                alt="Oracle Boxing"
                className="h-3 sm:h-5 w-auto"
              />
            </Link>

          </div>
        </div>

      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-start p-4 sm:p-6 border-b border-gray-800">
            <button
              onClick={closeSidebar}
              className="text-white p-2 rounded-md hover:bg-gray-900 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="flex flex-col space-y-4 sm:space-y-6">
              {/* Home */}
              <Link
                href="/"
                onClick={closeSidebar}
                className="text-base sm:text-xl font-bold py-2 sm:py-3 px-3 sm:px-4 text-white relative group"
              >
                <span className="relative">
                  HOME
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-700"></div>

              {/* Courses Section - Always Expanded */}
              <div>
                <h3 className="text-gray-400 text-base sm:text-xl font-bold mb-3 sm:mb-4 px-3 sm:px-4">COURSES</h3>
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <Link
                    href="/courses/bundle"
                    onClick={closeSidebar}
                    className="text-sm sm:text-lg py-2 sm:py-3 px-3 sm:px-4 text-white font-semibold relative group uppercase"
                  >
                    <span className="relative">
                      Oracle Boxing Bundle
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                  <Link
                    href="/courses/bffp"
                    onClick={closeSidebar}
                    className="text-sm sm:text-lg py-2 sm:py-3 px-3 sm:px-4 text-white font-semibold relative group uppercase"
                  >
                    <span className="relative">
                      Boxing Masterclass
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                  <Link
                    href="/courses/roadmap"
                    onClick={closeSidebar}
                    className="text-sm sm:text-lg py-2 sm:py-3 px-3 sm:px-4 text-white font-semibold relative group uppercase"
                  >
                    <span className="relative">
                      Boxing Roadmap
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700"></div>

              {/* Membership */}
              <Link
                href="/membership"
                onClick={closeSidebar}
                className="text-base sm:text-xl font-bold py-2 sm:py-3 px-3 sm:px-4 text-white relative group"
              >
                <span className="relative">
                  MEMBERSHIP
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-700"></div>

              {/* 6-Week Challenge */}
              <Link
                href="/6wc"
                onClick={closeSidebar}
                className="text-base sm:text-xl font-bold py-2 sm:py-3 px-3 sm:px-4 text-white relative group uppercase"
              >
                <span className="relative">
                  6-WEEK CHALLENGE
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-700"></div>

              {/* Apparel Shop */}
              <a
                href="https://shop.oracleboxing.com/collections/all"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeSidebar}
                className="text-base sm:text-xl font-bold py-2 sm:py-3 px-3 sm:px-4 text-white relative group uppercase"
              >
                <span className="relative">
                  APPAREL
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </a>

              {/* Newsletter */}
              <Link
                href="/#newsletter"
                onClick={closeSidebar}
                className="text-sm sm:text-base font-semibold py-1.5 sm:py-2 px-3 sm:px-4 text-gray-400 relative group text-left"
              >
                <span className="relative inline-block">
                  NEWSLETTER
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Contact */}
              <a
                href="mailto:team@oracleboxing.com"
                onClick={handleContactClick}
                className="text-sm sm:text-base font-semibold py-1.5 sm:py-2 px-3 sm:px-4 text-gray-400 relative group text-left"
              >
                <span className="relative inline-block">
                  CONTACT
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </a>
            </div>
          </nav>

          {/* Social Media Icons */}
          <div className="p-4 sm:p-6 border-t border-gray-800">
            <div className="flex items-center justify-start gap-4 sm:gap-6 px-3 sm:px-4">
              <a
                href="https://www.instagram.com/oracle.boxing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('instagram', 'https://www.instagram.com/oracle.boxing')}
                className="text-white hover:text-gray-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-8 h-8" />
              </a>
              <a
                href="https://www.youtube.com/@oracle_boxing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('youtube', 'https://www.youtube.com/@oracle_boxing')}
                className="text-white hover:text-gray-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
