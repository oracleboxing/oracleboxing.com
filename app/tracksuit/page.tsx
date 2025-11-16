'use client'

import { useState, useEffect } from 'react'
import { MerchHeader } from '@/components/MerchHeader'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TracksuitImageGallery } from '@/components/tracksuit/TracksuitImageGallery'
import { ColorSelector } from '@/components/tracksuit/ColorSelector'
import { DualSizeSelector } from '@/components/tracksuit/DualSizeSelector'
import { SizeGuideModal } from '@/components/tracksuit/SizeGuideModal'
import { ProductAccordion } from '@/components/tracksuit/ProductAccordion'
import { getProductById } from '@/lib/products'
import { tracksuitConfig, TracksuitColor, TracksuitSize, getRemainingStock } from '@/lib/tracksuit-config'
import { useMerchCart } from '@/contexts/MerchCartContext'
import { ShoppingCart, Check, Truck, Shield, Package } from 'lucide-react'
import { fbTrack } from '@/lib/fbpixel'

export default function TracksuitPage() {
  const { addItem } = useMerchCart()
  const [selectedColor, setSelectedColor] = useState<TracksuitColor>('Forest')
  const [hoodieSize, setHoodieSize] = useState<TracksuitSize>('M')
  const [joggersSize, setJoggersSize] = useState<TracksuitSize>('M')

  const product = getProductById('tracksuit')!
  const remainingStock = getRemainingStock()

  // Preload all hoodie and tracksuit images on mount
  useEffect(() => {
    const colors = ['green', 'brown', 'blue', 'black']
    const hoodieImages = ['hoodie_front', 'hoodie_back', 'hoodie_front_model', 'hoodie_back_model']
    const tracksuitImages = ['jogger_front', 'jogger_back', 'jogger_front_model', 'jogger_back_model']

    // Preload all tracksuit images (current page)
    colors.forEach(color => {
      tracksuitImages.forEach(image => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = `/images/${image}_${color}.webp`
        document.head.appendChild(link)
      })
    })

    // Preload all hoodie images (other page)
    colors.forEach(color => {
      hoodieImages.forEach(image => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = `/images/${image}_${color}.webp`
        document.head.appendChild(link)
      })
    })
  }, [])

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
      tracksuit_color: selectedColor,
      hoodie_size: hoodieSize,
      joggers_size: joggersSize,
      tracksuit_sku: `ORA-TS-${selectedColor.substring(0, 3).toUpperCase()}-HD${hoodieSize}-JG${joggersSize}`,
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

      {/* Mobile: Product info above carousel */}
      <div className="lg:hidden px-6 pt-6 pb-4 bg-gray-50">
        <h1 className="text-4xl font-bold text-black mb-3" style={{ fontFamily: 'Zodiak, serif' }}>
          TRACKSUIT
        </h1>
        <div className="flex items-center gap-3 mb-2">
          <p className="text-2xl text-gray-400 line-through" style={{ fontFamily: 'Zodiak, serif' }}>£150</p>
          <p className="text-2xl text-black font-bold" style={{ fontFamily: 'Zodiak, serif' }}>£{product.price}</p>
        </div>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Zodiak, serif' }}>
          Buy 2 or more and get 10% off your entire order
        </p>
      </div>

      {/* Product Selection Section */}
      <TracksuitImageGallery selectedColor={selectedColor}>
        <div className="space-y-6 md:space-y-8">
          {/* Desktop: Product info */}
          <div className="hidden lg:block">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4" style={{ fontFamily: 'Zodiak, serif' }}>
              TRACKSUIT
            </h1>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-2xl text-gray-400 line-through" style={{ fontFamily: 'Zodiak, serif' }}>£150</p>
                <p className="text-2xl text-black font-bold" style={{ fontFamily: 'Zodiak, serif' }}>£{product.price}</p>
              </div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Zodiak, serif' }}>
                Buy 2 or more and get 10% off your entire order
              </p>
            </div>

            <p className="text-black leading-relaxed mb-4" style={{ fontFamily: 'Zodiak, serif' }}>
              Heavyweight 100% cotton tracksuit.
              Built as armour, for those who live by the discipline of boxing.
            </p>
          </div>

          {/* Color Selector */}
          <ColorSelector selectedColor={selectedColor} onColorChange={setSelectedColor} />

          {/* Dual Size Selector */}
          <DualSizeSelector
            hoodieSize={hoodieSize}
            joggersSize={joggersSize}
            onHoodieSizeChange={setHoodieSize}
            onJoggersSizeChange={setJoggersSize}
          />

          {/* Mobile: Description below size selector */}
          <div className="lg:hidden">
            <p className="text-black leading-relaxed" style={{ fontFamily: 'Zodiak, serif' }}>
              Heavyweight 100% cotton tracksuit.
              Built as armour, for those who live by the discipline of boxing.
            </p>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            size="lg"
            className="w-full bg-yellow-100 text-black hover:bg-black hover:text-white border-2 border-black text-xl md:text-2xl py-6 md:py-8 font-black uppercase tracking-wide cursor-pointer"
            style={{ fontFamily: 'Zodiak, serif' }}
          >
            Add to Cart
            <ShoppingCart className="w-6 h-6 ml-2" />
          </Button>

          {/* Cross-sell Link */}
          <div className="text-left">
            <a
              href="/hoodie#product"
              className="text-sm text-black font-bold underline cursor-pointer inline-block"
              style={{ fontFamily: 'Zodiak, serif' }}
            >
              Get just the hoodie →
            </a>
          </div>

          {/* Product Details Accordion */}
          <ProductAccordion />
        </div>
      </TracksuitImageGallery>

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
