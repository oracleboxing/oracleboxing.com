'use client'

import { useAnalytics } from '@/hooks/useAnalytics'

export function ApparelBanner() {
  const { trackButtonClick } = useAnalytics()

  const handleCTAClick = () => {
    trackButtonClick({
      button_location: 'homepage-apparel-banner',
      button_type: 'apparel-cta',
      destination: 'https://shop.oracleboxing.com/collections/all',
    })
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 text-black border border-gray-800 rounded-lg font-black text-sm uppercase tracking-wider">
              Shop Now
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Oracle Boxing Apparel
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Premium boxing apparel designed for champions.
            </p>

            <a
              href="https://shop.oracleboxing.com/collections/all"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCTAClick}
              className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-white text-black border-4 border-white rounded-xl shadow-lg font-black text-base sm:text-lg md:text-xl uppercase tracking-wide hover:bg-black hover:text-white hover:border-white transition-all"
            >
              Shop Now
            </a>
          </div>

          {/* Right Side - Images (Hoodie Back + Jogger Front) */}
          <div className="order-first lg:order-last">
            <div className="grid grid-cols-2 gap-0">
              <img
                src="https://media.oracleboxing.com/tracksuit/hoodie_green_back.webp"
                alt="Oracle Boxing Hoodie - Back"
                className="w-full h-auto object-cover"
              />
              <img
                src="https://media.oracleboxing.com/tracksuit/jogger_green_front.webp"
                alt="Oracle Boxing Joggers - Front"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
