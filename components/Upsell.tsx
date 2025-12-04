'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductPrice, formatPrice, isMembershipProduct } from '@/lib/currency'
import { getCookie, getTrackingParams } from '@/lib/tracking-cookies'
import { useAnalytics } from '@/hooks/useAnalytics'
import { ColorSelector, getColorImages, TRACKSUIT_COLORS, type TrackSuitColor } from '@/app/upsell-library/components/ColorSelector'

interface UpsellProps {
  product: Product
  sessionId: string
}

export function Upsell({ product, sessionId }: UpsellProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [hasDeclined, setHasDeclined] = useState(false)
  const [selectedColor, setSelectedColor] = useState<TrackSuitColor>('black')
  const [showShippingInfo, setShowShippingInfo] = useState(false)
  const { currency } = useCurrency()
  const { trackUpsellInteraction } = useAnalytics()

  // Get price in selected currency
  const isMembership = isMembershipProduct(product.metadata)
  const convertedPrice = isMembership
    ? product.price
    : getProductPrice(product.metadata, currency) || product.price
  const displayCurrency = isMembership ? 'USD' : currency

  const handleAccept = async () => {
    setIsAdding(true)

    try {
      // Get cookie data and tracking params
      const cookieData = getCookie('ob_track')
      const trackingParams = getTrackingParams()

      const response = await fetch('/api/upsell/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          price_id: product.stripe_price_id,
          product_id: product.id,
          trackingParams: trackingParams,
          cookieData: cookieData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add upsell')
      }

      // Handle 3DS if required
      if (data.requires_action && data.client_secret) {
        // In production, you'd use Stripe.js to handle 3DS
        toast.info('Additional authentication required')
        // const stripe = await loadStripe(...)
        // await stripe.confirmCardPayment(data.client_secret)
      }

      if (data.success) {
        setIsAdded(true)
        toast.success('Added to your order!')

        // Track upsell acceptance
        trackUpsellInteraction({
          action: 'accept',
          product_id: product.id,
          product_name: product.title,
          value: convertedPrice,
          currency: displayCurrency,
        })

        // Redirect to Shopify tracksuit page for tracksuit purchases
        if (product.id === 'tracksuit') {
          setTimeout(() => {
            window.location.href = 'https://shop.oracleboxing.com/collections/tracksuits'
          }, 1500) // 1.5 second delay to show success message
        }
      }
    } catch (error: any) {
      console.error('Upsell error:', error)
      toast.error(error.message || 'Failed to add to order')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDecline = () => {
    if (hasDeclined) return;

    setHasDeclined(true);

    // Track upsell decline
    trackUpsellInteraction({
      action: 'decline',
      product_id: product.id,
      product_name: product.title,
      value: convertedPrice,
      currency: displayCurrency,
    })

    console.log('Upsell declined:', product.title)
  }

  if (isAdded) {
    return (
      <div className="bg-green-50 border-2 border-green-600 rounded-xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Added to Your Order!
        </h3>
        <p className="text-gray-600">
          You'll receive access details in your confirmation email.
        </p>
      </div>
    )
  }

  // Check if this is the tracksuit product - use Apple Card Style design
  const isTracksuit = product.id === 'tracksuit'

  if (isTracksuit) {
    const images = getColorImages(selectedColor)
    if (!images) return null

    // All product images including model shots
    // Extract color from hoodieFront path (e.g., https://media.oracleboxing.com/tracksuit/hoodie_black_front.webp -> black)
    const colorMatch = images.hoodieFront.match(/hoodie_(\w+)_front/)
    const colorName = colorMatch ? colorMatch[1] : 'black'

    const allImages = [
      { src: images.hoodieFront, alt: 'Hoodie Front' },
      { src: images.hoodieBack, alt: 'Hoodie Back' },
      { src: images.joggerFront, alt: 'Joggers Front' },
      { src: images.joggerBack, alt: 'Joggers Back' },
      { src: `https://media.oracleboxing.com/tracksuit/hoodie_${colorName}_front_model.webp`, alt: 'Hoodie Model Front' },
      { src: `https://media.oracleboxing.com/tracksuit/hoodie_${colorName}_back_model.webp`, alt: 'Hoodie Model Back' },
      { src: `https://media.oracleboxing.com/tracksuit/jogger_${colorName}_front_model.webp`, alt: 'Jogger Model Front' },
      { src: `https://media.oracleboxing.com/tracksuit/jogger_${colorName}_back_model.webp`, alt: 'Jogger Model Back' },
    ]

    return (
      <div className="w-full">
        {/* Title */}
        <div className="text-center mb-8 mt-12 px-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Redeem your 20% discount on an Oracle Boxing Tracksuit
          </h2>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-0 w-full">
            {/* Left: Scrollable Image Gallery - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-0">
              {allImages.map((image, idx) => (
                <div key={idx} className="bg-gray-100 w-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Right: Sticky Sidebar */}
            <div className="sticky top-0 h-screen overflow-y-auto">
              <div className="p-12 bg-white">
                <div className="space-y-6">
                  {/* Tracksuit Title */}
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      TRACKSUIT
                    </h1>
                    <div className="flex items-center gap-3">
                      <p className="text-lg text-gray-500 line-through">
                        {formatPrice(Math.round(convertedPrice / 0.8), displayCurrency)}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(convertedPrice, displayCurrency)}
                      </p>
                      <span className="bg-yellow-100 text-black text-sm font-bold px-2 py-1 rounded">
                        20% OFF
                      </span>
                    </div>
                  </div>

                  {/* Colour Selector */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2 uppercase">Colour</p>
                    <div className="grid grid-cols-5 gap-1.5">
                      {TRACKSUIT_COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className={`border-2 ${
                            selectedColor === color.id ? 'border-black' : 'border-gray-200'
                          } rounded overflow-hidden transition-all`}
                        >
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={`${color.hoodieUrl}_front.webp`}
                              alt={color.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="bg-white p-0.5 text-center">
                            <p className="text-[10px] font-semibold text-gray-900">{color.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={handleAccept}
                    disabled={isAdding}
                    className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-colors ${
                      isAdding
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    {isAdding ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Buy'
                    )}
                  </button>

                  {/* Shipping Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-900 mb-2">
                      <strong>Note:</strong> Price does not include shipping. Once purchased, you will be given a coupon to complete checkout for your tracksuit, which will require additional payment for shipping from the UK.
                    </p>
                    <button
                      onClick={() => setShowShippingInfo(!showShippingInfo)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      See shipping prices
                    </button>
                    {showShippingInfo && (
                      <div className="mt-3 text-sm text-gray-700 space-y-1">
                        <p>• UK: £5-10</p>
                        <p>• Europe: £15-25</p>
                        <p>• USA/Canada: £20-35</p>
                        <p>• Rest of World: £25-45</p>
                      </div>
                    )}
                  </div>

                  {/* No Thanks */}
                  <button
                    onClick={handleDecline}
                    disabled={hasDeclined}
                    className={`w-full text-center text-sm font-medium transition-colors ${
                      hasDeclined
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {hasDeclined ? 'Declined' : 'No thanks'}
                  </button>

                  {/* Product Info */}
                  <div className="pt-6 border-t border-gray-200">
                    <p className="font-bold text-gray-900 mb-3">100% PURE COTTON</p>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>Made in Britain</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Carousel */}
        <div className="md:hidden">
          {/* Image Carousel */}
          <div className="relative mb-6 overflow-x-auto snap-x snap-mandatory flex gap-0">
            {allImages.map((image, idx) => (
              <div key={idx} className="flex-shrink-0 w-full snap-center">
                <div className="bg-gray-100 w-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Product Details */}
          <div className="px-4 space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                TRACKSUIT
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-base text-gray-500 line-through">
                  {formatPrice(Math.round(convertedPrice / 0.8), displayCurrency)}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(convertedPrice, displayCurrency)}
                </p>
                <span className="bg-yellow-100 text-black text-xs font-bold px-2 py-1 rounded">
                  20% OFF
                </span>
              </div>
            </div>

            {/* Colour Selector */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2 uppercase">Colour</p>
              <div className="grid grid-cols-4 gap-1.5">
                {TRACKSUIT_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`border-2 ${
                      selectedColor === color.id ? 'border-black' : 'border-gray-200'
                    } rounded overflow-hidden transition-all`}
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={`${color.hoodieUrl}_front.webp`}
                        alt={color.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-white p-0.5 text-center">
                      <p className="text-[10px] font-semibold text-gray-900">{color.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Button */}
            <button
              onClick={handleAccept}
              disabled={isAdding}
              className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-colors ${
                isAdding
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                'Buy'
              )}
            </button>

            {/* Shipping Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-900 mb-2">
                <strong>Note:</strong> Price does not include shipping. Once purchased, you will be given a coupon to complete checkout for your tracksuit, which will require additional payment for shipping from the UK.
              </p>
              <button
                onClick={() => setShowShippingInfo(!showShippingInfo)}
                className="text-sm text-blue-600 hover:underline"
              >
                See shipping prices
              </button>
              {showShippingInfo && (
                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>• UK: £5-10</p>
                  <p>• Europe: £15-25</p>
                  <p>• USA/Canada: £20-35</p>
                  <p>• Rest of World: £25-45</p>
                </div>
              )}
            </div>

            {/* No Thanks */}
            <button
              onClick={handleDecline}
              disabled={hasDeclined}
              className={`w-full text-center text-sm font-medium transition-colors ${
                hasDeclined
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {hasDeclined ? 'Declined' : 'No thanks'}
            </button>

            {/* Product Info */}
            <div className="pt-6 border-t border-gray-200">
              <p className="font-bold text-gray-900 mb-3">100% PURE COTTON</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p>Made in Britain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default upsell layout for non-tracksuit products
  return (
    <div className="bg-gradient-to-br from-red-50 to-white border-2 border-red-600 rounded-xl p-8">
      <div className="text-center mb-6">
        <p className="text-sm font-semibold text-red-600 mb-2">SPECIAL OFFER</p>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Add {product.title}
        </h2>
        <p className="text-lg text-gray-600">
          Complete your boxing journey
        </p>
      </div>

      {/* Product Benefits */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <div className="space-y-3 text-sm text-gray-600">
          {product.description.split('\n').slice(0, 3).map((line, i) => (
            <p key={i} className="flex items-start gap-2">
              <span className="text-red-600">✓</span>
              <span>{line}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-gray-900">
          {formatPrice(convertedPrice, displayCurrency)}
          {product.recurring && <span className="text-lg text-gray-600">/{product.interval}</span>}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          One-click add to your order
          {isMembership && currency !== 'USD' && <span className="block text-xs mt-1">USD only</span>}
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAccept}
          disabled={isAdding}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors ${
            isAdding
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          } text-white flex items-center justify-center gap-2`}
        >
          {isAdding ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Yes, Add to My Order`
          )}
        </button>

        <button
          onClick={handleDecline}
          disabled={hasDeclined}
          className={`w-full py-3 px-6 font-semibold transition-colors ${
            hasDeclined
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {hasDeclined ? 'Declined' : 'No thanks'}
        </button>
      </div>
    </div>
  )
}
