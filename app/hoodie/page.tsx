'use client'

import { useState } from 'react'
import { MerchHeader } from '@/components/MerchHeader'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HoodieScrollHero } from '@/components/tracksuit/HoodieScrollHero'
import { ImageGallery } from '@/components/tracksuit/ImageGallery'
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
      {/* Hero Section with Scroll Animations */}
      <HoodieScrollHero />

      {/* Product Selection Section */}
      <section id="product" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left: Image Gallery */}
            <ImageGallery selectedColor={selectedColor} />

            {/* Right: Product Selector */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                  Oracle Boxing Hoodie
                </h1>
                <p className="text-2xl text-black mb-6">£80</p>

                <p className="text-black leading-relaxed mb-4">
                  Heavyweight 100% cotton hoodie.
                  Built as armour, for those who live by the discipline of boxing.
                </p>

                <a
                  href="/tracksuit"
                  className="text-sm text-black font-bold underline bg-yellow-100 px-2 py-1 cursor-pointer inline-block"
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
                className="w-full bg-yellow-100 text-black hover:bg-black hover:text-white border-2 border-black text-lg py-6 font-black uppercase tracking-wide"
              >
                Add to Cart
                <ShoppingCart className="w-5 h-5 ml-2" />
              </Button>

              {/* Product Details Accordion */}
              <ProductAccordion />
            </div>
          </div>
        </div>
      </section>

      {/* Why Pre-Order Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center">
            Why Pre-Order Now
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black">Limited Stock</h3>
              <p className="text-black">
                When the main sale opens mid-January, there's no guarantee you'll get one, 50 units max, no restock.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black">Ships First</h3>
              <p className="text-black">
                Pre-orders ship before Christmas, you'll wear it while everyone else waits.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black">Lock Your Size</h3>
              <p className="text-black">
                If you want a specific colour and size, this is your only shot to lock it in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Design Intent Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                Designed as Armour
              </h2>
              <div className="space-y-4 text-black leading-relaxed">
                <p>
                  Boxing changes how you move, and how the world responds to you.
                  The Oracle Boxing hoodie was built to reflect that energy: confidence without arrogance.
                </p>
                <p>
                  The silhouette is clean, the branding subtle, the fabric uncompromising.
                  It's for boxers who carry themselves with quiet certainty, not flash.
                </p>
                <p>
                  Premium heavyweight cotton. Breathable, not fluffy. Built to outlast every cheap gym set you've ever owned.
                  Supporting real boxers and real craftsmanship.
                </p>
              </div>
            </div>
            <div className="aspect-[4/5] bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {tracksuitConfig.faq.map((item, i) => (
              <div key={i} className="border-b border-gray-300 pb-6">
                <h3 className="text-lg font-semibold text-black mb-3">{item.question}</h3>
                <p className="text-black leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-2xl md:text-3xl text-black leading-relaxed">
            Every boxer needs armour. This is yours.
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
