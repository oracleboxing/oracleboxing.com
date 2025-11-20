      {/* LIMITED 6-WEEK CHALLENGE SECTION - OLD VERSION */}
      {/* Archived on 2025-11-20 */}
      <section className="pt-6 sm:pt-8 lg:pt-12 pb-6 sm:pb-8 lg:pb-12 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Side - Image */}
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://media.oracleboxing.com/Website/skool_art.webp"
                  alt="6-Week Challenge"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-100 text-black border border-gray-300 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider">
                Limited Spots Available
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                Join The 6-Week Challenge
              </h2>

              {/* Description */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                  Pay <AdaptivePrice usdAmount={197} metadata="6wc" className="font-black text-gray-900" showCode={true} /> today. Do the work for 6 weeks. Get better at boxing.
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  We give you all your money back at the end.
                </p>
                <p className="text-sm sm:text-base text-gray-600 italic">
                  Train with us for 6 weeks. Finish the tasks. We give you 100% of your money back. It's that easy.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/6wc"
                  onClick={() => handleButtonClick('homepage-hero', 'secondary-cta', '6wc', undefined, '/6wc')}
                  className="inline-block w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white text-black border-4 border-black rounded-xl shadow-lg font-black text-base sm:text-lg md:text-xl uppercase tracking-wide hover:bg-black hover:text-white transition-all text-center"
                >
                  Learn More
                </Link>
                <Link
                  href="/checkout?product=6wc&source=homepage-hero"
                  onClick={() => handleButtonClick('homepage-hero', 'buy-now', '6wc', 197, '/checkout?product=6wc&source=homepage-hero')}
                  className="inline-block w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-yellow-100 text-black border-4 border-black rounded-xl shadow-lg font-black text-base sm:text-lg md:text-xl uppercase tracking-wide hover:bg-black hover:text-yellow-100 transition-all text-center"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
