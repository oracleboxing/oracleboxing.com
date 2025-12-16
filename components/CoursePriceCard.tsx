'use client'

import { useRouter } from 'next/navigation'
import { Product } from '@/lib/types'
import { Check } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice, isMembershipProduct } from '@/lib/currency'

interface CoursePriceCardProps {
  product: Product
  features?: string[]
}

export function CoursePriceCard({ product, features = [] }: CoursePriceCardProps) {
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
      return bffpPrice + roadmapPrice + clinicPrice // $541 USD or equivalent
    }
    return null
  }

  const bundleCrossedPrice = getBundleCrossedOutPrice()

  const handleEnroll = () => {
    // Direct URL routing - no cart needed
    router.push(`/checkout?product=${product.id}&source=course-price-card`)
  }

  // Dynamic course name heading
  const getCourseHeading = () => {
    const headings: Record<string, string> = {
      'bffp': 'Boxing Masterclass',
      'roadmap': 'The Boxing Roadmap',
      'vault': 'Boxing Clinic Replays',
      'bundle': 'Oracle Boxing Bundle'
    }
    return headings[product.id] || product.title
  }

  return (
    <section className="py-6 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#000000] rounded-xl sm:rounded-3xl p-4 sm:p-16 shadow-2xl text-white">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src="https://sb.oracleboxing.com/Website/infinity_squared_white.svg"
              alt="Oracle Boxing"
              className="h-4 sm:h-5"
              onError={(e) => {
                // Fallback if logo doesn't load
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
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
