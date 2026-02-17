'use client'

import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'

interface ShopProduct {
  id: string
  title: string
  description: string
  price: string
  image: string
  paymentLink: string
  note?: string
}

const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'bffp',
    title: 'Boxing from First Principles',
    description: '26 lessons across 5 modules. Learn how boxing really works - from mental game to power generation to ring IQ.',
    price: '$147',
    image: 'https://sb.oracleboxing.com/Website/bffp-checkout.jpg',
    paymentLink: 'https://checkout.oracleboxing.com/b/5kQeVefokeAXfkD5ZrgQE2O',
  },
  {
    id: 'vault-2025',
    title: '2025 Call Recording Vault',
    description: '620+ coaching call recordings. 200+ group sessions and 420+ one-to-one calls covering footwork, defence, combinations, and more.',
    price: '$97',
    image: 'https://sb.oracleboxing.com/Website/2025_call_recording.webp',
    paymentLink: 'https://checkout.oracleboxing.com/b/3cI7sMa40akH1tNbjLgQE2N',
  },
  {
    id: 'tracksuit',
    title: 'Oracle Boxing Tracksuit',
    description: 'Premium tracksuit. Made in Britain. 100% cotton. Colours: Steel, Hazel, Forest, Black, Grey.',
    price: '$187',
    image: 'https://sb.oracleboxing.com/Website/ob_black_4.webp',
    paymentLink: 'https://checkout.oracleboxing.com/b/bJe00k4JG0K78WfcnPgQE2P',
    note: "You'll be contacted to select size and add shipping.",
  },
]

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-sub font-semibold text-[#37322F] font-sans flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" aria-hidden="true" />
            Shop
          </h1>
          <p className="text-gray-500 text-body mt-1">Courses and gear to level up your training</p>
        </div>
      </header>

      {/* Products */}
      <div className="max-w-4xl mx-auto p-6">
        <ul className="space-y-6" role="list" aria-label="Products">
          {SHOP_PRODUCTS.map((product) => (
            <li
              key={product.id}
              className="border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6"
            >
              {/* Image */}
              <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-title font-semibold text-[#37322F] font-sans">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-body mt-1 flex-1">
                  {product.description}
                </p>
                {product.note && (
                  <p className="text-gray-400 text-xs mt-2 italic">{product.note}</p>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sub font-bold text-[#37322F]">
                    {product.price}
                  </span>
                  <a
                    href={product.paymentLink}
                    className="h-10 px-6 bg-[#37322F] text-white rounded-lg font-medium text-body hover:bg-[#49423D] transition-colors flex items-center"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-body mt-12">
          Questions? Ask in the community or email support.
        </p>
      </div>
    </div>
  )
}
