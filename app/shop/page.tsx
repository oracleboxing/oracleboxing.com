'use client'

import { useState } from 'react'
import { Loader2, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice as formatCurrency } from '@/lib/currency'

interface ShopProduct {
  id: string
  title: string
  description: string
  priceKey: string
  image: string
  note?: string
}

const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'bffp',
    title: 'Boxing from First Principles',
    description: '26 lessons across 5 modules. Learn how boxing really works — from mental game to power generation to ring IQ.',
    priceKey: 'bffp',
    image: 'https://sb.oracleboxing.com/Website/bffp_tn_3.webp',
  },
  {
    id: 'vault-2025',
    title: '2025 Call Recording Vault',
    description: '620+ coaching call recordings. 200+ group sessions and 420+ one-to-one calls covering footwork, defence, combinations, and more.',
    priceKey: 'vault2025',
    image: 'https://sb.oracleboxing.com/Website/2025_call_recording.webp',
  },
  {
    id: 'tracksuit',
    title: 'Oracle Boxing Tracksuit',
    description: 'Premium tracksuit. Made in Britain. 100% cotton. Colours: Steel, Hazel, Forest, Black, Grey.',
    priceKey: 'tracksuit',
    image: 'https://sb.oracleboxing.com/Website/ob_black_4.webp',
    note: "You'll be contacted to select size and add shipping.",
  },
]

export default function ShopPage() {
  const { currency, isLoading: currencyLoading } = useCurrency()
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null)

  const handleBuy = async (product: ShopProduct) => {
    setLoadingProduct(product.id)

    try {
      const price = getProductPrice(product.priceKey, currency) || 0

      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              product: {
                id: product.id,
                title: product.title,
                price,
                type: product.id === 'tracksuit' ? 'merch' : 'course',
              },
              quantity: 1,
            },
          ],
          currency,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || 'Something went wrong')
      setLoadingProduct(null)
    }
  }

  const displayPrice = (priceKey: string) => {
    const price = getProductPrice(priceKey, currency)
    if (!price) return '—'
    return formatCurrency(price, currency)
  }

  if (currencyLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-[#37322F]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-[#37322F] font-sans flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            Shop
          </h1>
          <p className="text-gray-500 text-sm mt-1">Courses and gear to level up your training</p>
        </div>
      </header>

      {/* Products */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {SHOP_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6"
            >
              {/* Image */}
              <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-[#37322F] font-sans">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1 flex-1">
                  {product.description}
                </p>
                {product.note && (
                  <p className="text-gray-400 text-xs mt-2 italic">{product.note}</p>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xl font-bold text-[#37322F]">
                    {displayPrice(product.priceKey)}
                  </span>
                  <button
                    onClick={() => handleBuy(product)}
                    disabled={loadingProduct === product.id}
                    className="h-10 px-6 bg-[#37322F] text-white rounded-lg font-medium text-sm hover:bg-[#49423D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingProduct === product.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Buy Now'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-sm mt-12">
          Questions? Ask in the community or email support.
        </p>
      </div>
    </div>
  )
}
