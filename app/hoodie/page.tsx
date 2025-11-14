'use client'

import { useState } from 'react'
import { MerchHeader } from '@/components/MerchHeader'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HoodieImageGallery } from '@/components/tracksuit/HoodieImageGallery'
import { ColorSelector } from '@/components/tracksuit/ColorSelector'
import { SizeSelector } from '@/components/tracksuit/SizeSelector'
import { SizeGuideModal } from '@/components/tracksuit/SizeGuideModal'
import { ProductAccordion } from '@/components/tracksuit/ProductAccordion'
import { getProductById } from '@/lib/products'
import { tracksuitConfig, TracksuitColor, TracksuitSize, getRemainingStock } from '@/lib/tracksuit-config'
import { useMerchCart } from '@/contexts/MerchCartContext'
import { ShoppingCart, Check, Truck, Shield, Package } from 'lucide-react'
import { fbTrack } from '@/lib/fbpixel'

export default function HoodiePage() {
  const { addItem } = useMerchCart()
  const [selectedColor, setSelectedColor] = useState<TracksuitColor>('Hazel')
  const [selectedSize, setSelectedSize] = useState<TracksuitSize>('M')

  const product = getProductById('hoodie')!
  const remainingStock = getRemainingStock()

  const handleAddToCart = () => {
    // Track AddToCart event
    fbTrack('AddToCart', {
      content_name: product.title,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'GBP',
    })

    // Add to cart with metadata - this will open the cart sidebar
    addItem(product, {
      hoodie_color: selectedColor,
      hoodie_size: selectedSize,
      hoodie_sku: `ORA-HD-${selectedColor.substring(0, 3).toUpperCase()}-${selectedSize}`,
      presale_cohort: 'Presale-2025',
    })
  }

  return (
    <>
      <MerchHeader />

      {/* Pre-Order Banner */}
      <div className="bg-yellow-100 border-b-2 border-black py-2 px-4 text-center">
        <p className="text-sm md:text-base font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>
          Pre-orders will be shipped before Christmas
        </p>
      </div>

      {/* Product Selection Section */}
      <HoodieImageGallery selectedColor={selectedColor}>
        <div className="space-y-6 md:space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4" style={{ fontFamily: 'Zodiak, serif' }}>
              HOODIE
            </h1>
            <div className="mb-6">
              <p className="text-2xl text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>£80</p>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Zodiak, serif' }}>
                Buy 2+ items and get 10% off your entire order
              </p>
            </div>

            <p className="text-black leading-relaxed mb-4" style={{ fontFamily: 'Zodiak, serif' }}>
              Heavyweight 100% cotton hoodie.
              Built as armour, for those who live by the discipline of boxing.
            </p>

            <a
              href="/tracksuit"
              className="text-sm text-black font-bold underline bg-yellow-100 px-2 py-1 cursor-pointer inline-block"
              style={{ fontFamily: 'Zodiak, serif' }}
            >
              Want the full tracksuit? →
            </a>
          </div>

          {/* Color Selector */}
          <ColorSelector selectedColor={selectedColor} onColorChange={setSelectedColor} />

          {/* Size Selector */}
          <SizeSelector selectedSize={selectedSize} onSizeChange={setSelectedSize} />

          {/* Size Guide */}
          <SizeGuideModal />

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            size="lg"
            className="w-full bg-yellow-100 text-black hover:bg-black hover:text-white border-2 border-black text-lg md:py-6 py-4 font-black uppercase tracking-wide cursor-pointer"
            style={{ fontFamily: 'Zodiak, serif' }}
          >
            Add to Cart
            <ShoppingCart className="w-5 h-5 ml-2" />
          </Button>

          {/* Product Details Accordion */}
          <ProductAccordion />
        </div>
      </HoodieImageGallery>

      {/* Why Pre-Order Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center" style={{ fontFamily: 'Zodiak, serif' }}>
            Why Pre-Order Now
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex md:flex-col gap-4 md:gap-0 md:space-y-3">
              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-yellow-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-black" style={{ fontFamily: 'Zodiak, serif' }}>Limited Stock</h3>
                <p className="text-black" style={{ fontFamily: 'Zodiak, serif' }}>
                  When the main sale opens mid-January, there's no guarantee you'll get one, 50 units max, no restock.
                </p>
              </div>
            </div>
            <div className="flex md:flex-col gap-4 md:gap-0 md:space-y-3">
              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-yellow-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-black" style={{ fontFamily: 'Zodiak, serif' }}>Ships First</h3>
                <p className="text-black" style={{ fontFamily: 'Zodiak, serif' }}>
                  Pre-orders ship before Christmas, you'll wear it while everyone else waits.
                </p>
              </div>
            </div>
            <div className="flex md:flex-col gap-4 md:gap-0 md:space-y-3">
              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-yellow-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-black" style={{ fontFamily: 'Zodiak, serif' }}>Lock Your Size</h3>
                <p className="text-black" style={{ fontFamily: 'Zodiak, serif' }}>
                  If you want a specific colour and size, this is your only shot to lock it in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center" style={{ fontFamily: 'Zodiak, serif' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {tracksuitConfig.faq.map((item, i) => (
              <div key={i} className="border-b border-gray-300 pb-6">
                <h3 className="text-lg font-semibold text-black mb-3" style={{ fontFamily: 'Zodiak, serif' }}>{item.question}</h3>
                <p className="text-black leading-relaxed" style={{ fontFamily: 'Zodiak, serif' }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-2xl md:text-3xl text-white leading-relaxed" style={{ fontFamily: 'Zodiak, serif' }}>
            Every boxer needs armour. This is yours.
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
