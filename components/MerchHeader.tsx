'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useMerchCart } from '@/contexts/MerchCartContext'

interface MerchHeaderProps {
  showCart?: boolean
}

export function MerchHeader({ showCart = true }: MerchHeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { items, openCart } = useMerchCart()

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

  return (
    <header
      className={`shadow-lg z-50 transition-all duration-300 ${
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
          {/* Centered Logo */}
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <img
              src="https://media.oracleboxing.com/Website/optimized/logos/long_white-large.webp"
              alt="Oracle Boxing"
              className="h-3 sm:h-5 w-auto"
            />
          </Link>

          {/* Right Cart Icon */}
          {showCart && (
            <button
              onClick={openCart}
              className="ml-auto text-white p-2 rounded-md hover:bg-gray-900 transition-colors relative"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-100 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
