'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { toast } from 'sonner'
import { getCookie } from '@/lib/tracking-cookies'

function MerchSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!sessionId) {
        router.push('/')
        return
      }

      try {
        const response = await fetch(`/api/session?session_id=${sessionId}`)
        const data = await response.json()

        if (response.ok) {
          setOrderData(data)

          // Send Facebook Purchase event
          await sendPurchaseEvent(data, sessionId)
        } else {
          console.error('Failed to fetch session:', data.error)
          toast.error('Failed to load order details')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        toast.error('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }

    const sendPurchaseEvent = async (sessionData: any, sessionId: string) => {
      try {
        // Get tracking cookie data
        const cookieData = getCookie('ob_track') || {}
        const eventId = cookieData.event_id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Get fbclid from cookies
        const getFbclid = (): string | null => {
          if (typeof document === 'undefined') return null
          const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=')
            acc[key] = decodeURIComponent(value)
            return acc
          }, {} as Record<string, string>)
          return cookies['fbclid'] || null
        }
        const fbclid = getFbclid()

        // Extract purchase data
        const amountTotal = sessionData.amount_total ? sessionData.amount_total / 100 : 0
        const currency = sessionData.currency?.toUpperCase() || 'GBP'
        const contentIds = sessionData.line_items?.data?.map((item: any) => {
          const product = item.price?.product
          return typeof product === 'object' ? product.id : product
        }).filter(Boolean) || []
        const contents = sessionData.line_items?.data?.map((item: any) => ({
          id: typeof item.price?.product === 'object' ? item.price.product.id : item.price?.product,
          quantity: item.quantity || 1,
          item_price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
        })) || []

        // Browser-side Facebook Pixel Purchase event
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Purchase', {
            value: amountTotal,
            currency,
            content_ids: contentIds,
            content_type: 'product',
            num_items: contents.length,
          }, {
            eventID: eventId
          })
        }

        // Server-side CAPI Purchase event
        fetch('/api/facebook-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: eventId,
            value: amountTotal,
            currency,
            content_ids: contentIds,
            contents,
            customer_email: sessionData.customer_details?.email || sessionData.customer_email || sessionData.customerEmail,
            customer_phone: sessionData.customer_details?.phone,
            cookie_data: cookieData,
            fbclid,
            session_url: `https://oracleboxing.com/success/merch?session_id=${sessionId}`,
          }),
          keepalive: true,
        })
      } catch (error) {
        console.error('Error sending purchase event:', error)
      }
    }

    fetchOrderData()
  }, [sessionId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    )
  }

  // Extract customer info
  const customerName = orderData.customer_details?.name || orderData.shipping?.name || 'Customer'
  const firstName = customerName.split(' ')[0]

  // Color name mapping for image filenames
  const colorNameMap: Record<string, string> = {
    'Forest': 'green',
    'Hazel': 'brown',
    'Steel': 'blue',
    'Black': 'black',
  }

  // Extract order items with metadata
  const orderItems = orderData.line_items?.data?.map((item: any) => {
    const metadata = orderData.metadata || {}
    const colorName = metadata.tracksuit_color || metadata.hoodie_color || 'Forest'
    const colorFilename = colorNameMap[colorName] || 'green'
    const isTracksuit = !!(metadata.hoodie_size && metadata.joggers_size)

    return {
      name: item.description || item.price?.product?.name || 'Product',
      quantity: item.quantity || 1,
      price: item.amount_total / 100,
      color: colorName,
      colorFilename: colorFilename,
      hoodieSize: metadata.hoodie_size,
      joggersSize: metadata.joggers_size,
      isTracksuit: isTracksuit,
    }
  }) || []

  const totalAmount = orderData.amount_total / 100
  const currency = orderData.currency?.toUpperCase() || 'GBP'
  const currencySymbol = currency === 'GBP' ? '£' : '$'

  // Determine shipping timeline based on country
  const shippingCountry = orderData.shipping?.address?.country || orderData.customer_details?.address?.country
  const isUK = shippingCountry === 'GB'

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Success Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
              Thank You For Your Purchase, {firstName}
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Zodiak, serif' }}>
              Order confirmation has been sent to {orderData.customer_details?.email}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Order Details */}
            <div className="bg-white p-6 lg:p-8 rounded-lg border-2 border-black">
              <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Zodiak, serif' }}>
                Order Details
              </h2>

              <div className="space-y-6">
                {orderItems.map((item: any, index: number) => (
                  <div key={index} className="pb-6 border-b border-gray-200 last:border-0">
                    {/* Product Name */}
                    <div className="font-semibold text-lg text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                      {item.name}
                    </div>

                    {/* Product Image(s) - Aspect ratio 1080:1440 (0.75 or 3:4) */}
                    {item.isTracksuit ? (
                      <div className="mb-4 flex gap-0">
                        <div className="flex-1" style={{ aspectRatio: '1080/1440' }}>
                          <img
                            src={`https://media.oracleboxing.com/tracksuit/hoodie_${item.colorFilename}_back.webp`}
                            alt={`${item.color} Hoodie Back`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1" style={{ aspectRatio: '1080/1440' }}>
                          <img
                            src={`https://media.oracleboxing.com/tracksuit/jogger_${item.colorFilename}_front.webp`}
                            alt={`${item.color} Joggers Front`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="w-full" style={{ aspectRatio: '1080/1440' }}>
                          <img
                            src={`https://media.oracleboxing.com/tracksuit/hoodie_${item.colorFilename}_back.webp`}
                            alt={`${item.color} Hoodie`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="space-y-2 text-sm" style={{ fontFamily: 'Zodiak, serif' }}>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Colour:</span>
                        <span className="text-black font-semibold">{item.color}</span>
                      </div>
                      {item.hoodieSize && item.joggersSize ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hoodie Size:</span>
                            <span className="text-black font-semibold">{item.hoodieSize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Joggers Size:</span>
                            <span className="text-black font-semibold">{item.joggersSize}</span>
                          </div>
                        </>
                      ) : item.hoodieSize ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="text-black font-semibold">{item.hoodieSize}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}

                {/* Total Amount */}
                <div className="pt-4 border-t-2 border-black">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>Amount Paid:</span>
                    <span className="text-2xl font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>
                      {currencySymbol}{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Shipping Info */}
            <div className="bg-white p-6 lg:p-8 rounded-lg border-2 border-black">
              <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Zodiak, serif' }}>
                Thank You For Pre-Ordering
              </h2>

              <div className="space-y-4 text-black" style={{ fontFamily: 'Zodiak, serif' }}>
                <p className="leading-relaxed">
                  Your tracksuit will be shipped before Christmas.
                </p>

                {isUK ? (
                  <p className="leading-relaxed">
                    We expect that you'll receive it before Christmas if you're in the UK.
                  </p>
                ) : (
                  <p className="leading-relaxed">
                    For customers outside the UK, delivery may arrive just after the new year or around that time.
                  </p>
                )}

                <p className="leading-relaxed">
                  We thank you for your patience, and we'll keep you updated via email.
                </p>

                <div className="pt-6 mt-6 border-t border-gray-200">
                  <p className="font-semibold mb-2">Have Questions?</p>
                  <p>
                    Please contact us at{' '}
                    <a href="mailto:team@oracleboxing.com" className="text-black underline font-bold">
                      team@oracleboxing.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default function MerchSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <MerchSuccessContent />
    </Suspense>
  )
}
