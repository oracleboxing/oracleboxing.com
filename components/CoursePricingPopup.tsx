'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Check } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice, isMembershipProduct } from '@/lib/currency'

interface CoursePricingPopupProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  features?: (string | { text: string; bold: string })[]
}

export function CoursePricingPopup({ isOpen, onClose, product, features = [] }: CoursePricingPopupProps) {
  const router = useRouter()
  const { currency } = useCurrency()

  // Get price in selected currency
  const isMembership = isMembershipProduct(product.metadata)
  const convertedPrice = isMembership
    ? product.price
    : getProductPrice(product.metadata, currency) || product.price
  const displayCurrency = isMembership ? 'USD' : currency

  // Bundle crossed-out price (sum of individual course prices)
  const getBundleCrossedOutPrice = () => {
    if (product.id === 'bundle') {
      const bffpPrice = getProductPrice('bffp', currency) || 297
      const roadmapPrice = getProductPrice('brdmp', currency) || 147
      const clinicPrice = getProductPrice('rcv', currency) || 97
      return bffpPrice + roadmapPrice + clinicPrice
    }
    return null
  }

  const bundleCrossedPrice = getBundleCrossedOutPrice()

  const handleEnroll = () => {
    router.push(`/checkout?product=${product.id}&source=course-price-card`)
  }

  // Dynamic course name heading
  const getCourseHeading = () => {
    const headings: Record<string, string> = {
      'bffp': 'Boxing Masterclass',
      'brdmp': 'The Boxing Roadmap',
      'rcv': 'Boxing Clinic Replays',
      'bundle': 'Oracle Boxing Bundle'
    }
    return headings[product.id] || product.title
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Price Card Content */}
        <div className="bg-[#000000] rounded-3xl p-6 sm:p-8 lg:p-10 text-white">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src="https://sb.oracleboxing.com/Website/infinity_squared_white.svg"
              alt="Oracle Boxing"
              className="h-4 sm:h-5"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          {/* Course Thumbnail */}
          {product.image && (
            <div className="flex justify-center mb-6 sm:mb-8">
              <img
                src={product.image}
                alt={product.title}
                className="w-full max-w-[280px] rounded-xl border-4 border-white shadow-lg object-cover aspect-video"
              />
            </div>
          )}

          {/* Heading */}
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 uppercase px-4 whitespace-nowrap" style={{ fontFamily: "var(--font-satoshi)" }}>
            {getCourseHeading()}
          </h3>

          {/* Price Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3">
              {bundleCrossedPrice && (
                <div className="text-xl sm:text-2xl md:text-3xl font-bold opacity-60 line-through">
                  {formatPrice(bundleCrossedPrice, displayCurrency)}
                </div>
              )}
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black">
                {formatPrice(convertedPrice, displayCurrency)}
              </div>
            </div>
            {product.recurring && (
              <div className="text-sm sm:text-lg md:text-xl font-bold opacity-90">per {product.interval}</div>
            )}
            {isMembership && currency !== 'USD' && (
              <div className="text-xs sm:text-sm text-white/70 mt-2">USD only</div>
            )}
            <div className="text-sm text-white/80 mt-2">incl. all taxes</div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleEnroll}
            className="w-full py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-12 bg-yellow-100 text-[#000000] font-black text-xl sm:text-2xl md:text-3xl rounded-xl mb-4 sm:mb-6 uppercase tracking-wide min-h-[60px] sm:min-h-[64px] lg:min-h-[72px] shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center gap-2"
            style={{ cursor: 'pointer' }}
          >
            CHECKOUT
            <span className="text-2xl sm:text-3xl">→</span>
          </button>

          {/* Payment Methods */}
          <div className="payment_icons-group mb-6 sm:mb-8">
            <img
              loading="lazy"
              alt=""
              src="https://sb.oracleboxing.com/Website/payment1.svg"
              className="image-55"
            />
            <img
              loading="lazy"
              alt=""
              src="https://sb.oracleboxing.com/Website/payment2.svg"
              className="image-55 second"
            />
            <img
              loading="lazy"
              alt=""
              src="https://sb.oracleboxing.com/Website/paypal2.svg"
              className="image-55 bigger"
            />
            <img
              loading="lazy"
              src="https://sb.oracleboxing.com/Website/klarna.svg"
              alt=""
              className="image-55 bigger-mobile"
            />
          </div>

          {/* Features List */}
          {features.length > 0 && (
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-white mt-0.5" />
                  <span className="text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                    {typeof feature === 'string' ? (
                      feature
                    ) : (
                      <>
                        <strong className="font-bold">{feature.text}</strong>
                        {feature.bold}
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
