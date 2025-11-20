'use client'

import { useState } from 'react'
import { MerchHeader } from '@/components/MerchHeader'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { TracksuitImageGallery } from '@/components/tracksuit/TracksuitImageGallery'
import { ColorSelector } from '@/components/tracksuit/ColorSelector'
import { DualSizeSelector } from '@/components/tracksuit/DualSizeSelector'
import { getProductById } from '@/lib/products'
import { TracksuitColor, TracksuitSize } from '@/lib/tracksuit-config'
import { Package, X, Plus, Trash2 } from 'lucide-react'

interface TracksuitItem {
  id: string
  color: TracksuitColor
  hoodieSize: TracksuitSize
  joggersSize: TracksuitSize
}

export default function CostTracksuitPage() {
  const [tracksuits, setTracksuits] = useState<TracksuitItem[]>([
    {
      id: '1',
      color: 'Forest',
      hoodieSize: 'M',
      joggersSize: 'M',
    }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showBankDetailsPopup, setShowBankDetailsPopup] = useState(false)
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false)

  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    shippingRegion: 'UK' as 'UK' | 'EU' | 'OTHER',
  })

  const product = getProductById('tracksuit')!
  const COST_PRICE = 89.12

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    })
  }

  const addTracksuit = () => {
    setTracksuits([
      ...tracksuits,
      {
        id: Date.now().toString(),
        color: 'Forest',
        hoodieSize: 'M',
        joggersSize: 'M',
      }
    ])
  }

  const removeTracksuit = (id: string) => {
    if (tracksuits.length > 1) {
      setTracksuits(tracksuits.filter(t => t.id !== id))
    }
  }

  const updateTracksuit = (id: string, updates: Partial<TracksuitItem>) => {
    setTracksuits(tracksuits.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const calculateTotal = () => {
    const subtotal = tracksuits.length * COST_PRICE
    const shipping = shippingInfo.shippingRegion === 'UK' ? 5 : shippingInfo.shippingRegion === 'EU' ? 10 : 0
    return {
      subtotal,
      shipping,
      total: subtotal + shipping
    }
  }

  const handleBuy = async () => {
    // Validate required fields
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.line1 || !shippingInfo.city || !shippingInfo.postal_code || !shippingInfo.country) {
      alert('Please fill in all required fields')
      return
    }

    // Show bank details popup
    setShowBankDetailsPopup(true)
  }

  const handlePaymentConfirmed = async () => {
    setIsSubmitting(true)

    try {
      const { subtotal, shipping, total } = calculateTotal()

      const payload = {
        // Order details
        tracksuits: tracksuits.map(t => ({
          color: t.color,
          hoodie_size: t.hoodieSize,
          joggers_size: t.joggersSize,
          tracksuit_sku: `ORA-TS-${t.color.substring(0, 3).toUpperCase()}-HD${t.hoodieSize}-JG${t.joggersSize}`,
        })),
        quantity: tracksuits.length,

        // Pricing
        cost_price_per_unit: COST_PRICE,
        subtotal: subtotal,
        shipping_cost: shipping,
        shipping_region: shippingInfo.shippingRegion,
        total_amount: total,

        // Shipping information
        customer_name: shippingInfo.name,
        customer_email: shippingInfo.email,
        customer_phone: shippingInfo.phone,
        shipping_line1: shippingInfo.line1,
        shipping_line2: shippingInfo.line2,
        shipping_city: shippingInfo.city,
        shipping_state: shippingInfo.state,
        shipping_postal_code: shippingInfo.postal_code,
        shipping_country: shippingInfo.country,

        // Metadata
        order_type: 'cost_price',
        payment_method: 'bank_transfer',
        order_timestamp: new Date().toISOString(),
      }

      const response = await fetch('https://hook.eu2.make.com/s7gsqzw9jp9maqjh53w1gmeuoce247c3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit order')
      }

      setIsOrderSubmitted(true)
      setShowBankDetailsPopup(false)
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isOrderSubmitted) {
    return (
      <>
        <MerchHeader showCart={false} />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
              <Package className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>
              Order Received!
            </h1>
            <p className="text-lg text-black leading-relaxed" style={{ fontFamily: 'Zodiak, serif' }}>
              We've received your order details. Once your bank transfer is processed, we'll send a confirmation email to <span className="font-bold">{shippingInfo.email}</span>
            </p>
            <div className="bg-white border-2 border-black rounded-lg p-6 text-left space-y-3">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Zodiak, serif' }}>Order Summary:</p>
              <p className="text-black font-bold" style={{ fontFamily: 'Zodiak, serif' }}>
                {tracksuits.length} × Tracksuit{tracksuits.length > 1 ? 's' : ''}
              </p>
              <p className="text-black text-lg font-bold" style={{ fontFamily: 'Zodiak, serif' }}>
                Total: £{calculateTotal().total.toFixed(2)}
              </p>
            </div>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Zodiak, serif' }}>
              Please use <span className="font-bold">{shippingInfo.name}</span> as your payment reference
            </p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const { subtotal, shipping, total } = calculateTotal()

  return (
    <>
      <MerchHeader showCart={false} />

      {/* Pre-Order Banner */}
      <div className="bg-yellow-100 border-b-2 border-black py-2 px-4 text-center">
        <p className="text-sm md:text-base font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>
          Cost Price - Bank Transfer Only - £{COST_PRICE.toFixed(2)} per tracksuit
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center" style={{ fontFamily: 'Zodiak, serif' }}>
            Order Tracksuits at Cost Price
          </h1>

          {/* Tracksuit Selection */}
          <div className="space-y-6 mb-8">
            {tracksuits.map((tracksuit, index) => (
              <div key={tracksuit.id} className="bg-white rounded-xl p-6 border-2 border-black shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>
                    Tracksuit #{index + 1}
                  </h2>
                  {tracksuits.length > 1 && (
                    <button
                      onClick={() => removeTracksuit(tracksuit.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Remove tracksuit"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Color Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3" style={{ fontFamily: 'Zodiak, serif' }}>
                      Color
                    </label>
                    <ColorSelector
                      selectedColor={tracksuit.color}
                      onColorChange={(color) => updateTracksuit(tracksuit.id, { color })}
                    />
                  </div>

                  {/* Size Selectors */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3" style={{ fontFamily: 'Zodiak, serif' }}>
                      Sizes
                    </label>
                    <DualSizeSelector
                      hoodieSize={tracksuit.hoodieSize}
                      joggersSize={tracksuit.joggersSize}
                      onHoodieSizeChange={(size) => updateTracksuit(tracksuit.id, { hoodieSize: size })}
                      onJoggersSizeChange={(size) => updateTracksuit(tracksuit.id, { joggersSize: size })}
                    />
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <span className="text-lg font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>
                    £{COST_PRICE.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {/* Add Another Tracksuit Button */}
            <button
              onClick={addTracksuit}
              className="w-full py-4 px-6 bg-white text-black border-2 border-black rounded-xl font-bold text-lg hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: 'Zodiak, serif' }}
            >
              <Plus className="w-5 h-5" />
              Add Another Tracksuit
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-yellow-100 border-2 border-black rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Zodiak, serif' }}>
              Order Summary
            </h2>
            <div className="space-y-2 text-black" style={{ fontFamily: 'Zodiak, serif' }}>
              <div className="flex justify-between">
                <span>{tracksuits.length} × Tracksuit @ £{COST_PRICE.toFixed(2)}</span>
                <span className="font-bold">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({shippingInfo.shippingRegion})</span>
                <span className="font-bold">£{shipping.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-black pt-2 mt-2 flex justify-between text-xl font-black">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information Form */}
          <div className="bg-white rounded-xl p-6 border-2 border-black shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Zodiak, serif' }}>
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shipping Region */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  Shipping Region *
                </label>
                <select
                  name="shippingRegion"
                  value={shippingInfo.shippingRegion}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                >
                  <option value="UK">UK (£5 shipping)</option>
                  <option value="EU">EU (£10 shipping)</option>
                  <option value="OTHER">Other (contact for shipping)</option>
                </select>
              </div>

              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  Full Name * (use this as payment reference)
                </label>
                <input
                  type="text"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                />
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                />
              </div>

              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="line1"
                  value={shippingInfo.line1}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address, P.O. box"
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                />
              </div>

              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="line2"
                  value={shippingInfo.line2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                />
              </div>

              {/* State/Province */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={shippingInfo.postal_code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100"
                  style={{ fontFamily: 'Zodiak, serif' }}
                />
              </div>
            </div>

            {/* Buy Button */}
            <Button
              onClick={handleBuy}
              disabled={isSubmitting}
              size="lg"
              className="w-full mt-6 bg-yellow-100 text-black hover:bg-black hover:text-white border-2 border-black text-xl md:text-2xl py-6 md:py-8 font-black uppercase tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Zodiak, serif' }}
            >
              Buy - £{total.toFixed(2)}
              <Package className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bank Details Popup */}
      {showBankDetailsPopup && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" />

          {/* Popup */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative pointer-events-auto animate-scale-in max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowBankDetailsPopup(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close popup"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Content */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4" style={{ fontFamily: 'Zodiak, serif' }}>
                  Bank Transfer Details
                </h2>

                <div className="bg-yellow-100 border-2 border-black rounded-xl p-6 mb-6">
                  <p className="text-xl font-bold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                    Amount to Transfer: £{total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Zodiak, serif' }}>
                    Includes {tracksuits.length} × tracksuit{tracksuits.length > 1 ? 's' : ''} + £{shipping.toFixed(2)} shipping
                  </p>
                </div>

                <div className="space-y-6 mb-6">
                  {/* Recipient Details */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3" style={{ fontFamily: 'Zodiak, serif' }}>
                      Recipient Information
                    </h3>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-2" style={{ fontFamily: 'Zodiak, serif' }}>
                      <p><strong>Recipient:</strong> ORACLE BOXING LTD</p>
                      <p><strong>Address:</strong> Artillery 88 Artillery Road, Unit 5, Lufton, BA22 8RP, Yeovil, United Kingdom</p>
                    </div>
                  </div>

                  {/* UK Bank Transfer */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3" style={{ fontFamily: 'Zodiak, serif' }}>
                      Transfer from a UK bank?
                    </h3>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-2" style={{ fontFamily: 'Zodiak, serif' }}>
                      <p><strong>Account number:</strong> 24711616</p>
                      <p><strong>Sort code:</strong> 04-29-09</p>
                    </div>
                  </div>

                  {/* International Bank Transfer */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3" style={{ fontFamily: 'Zodiak, serif' }}>
                      Transfer from outside the UK?
                    </h3>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-2" style={{ fontFamily: 'Zodiak, serif' }}>
                      <p><strong>IBAN:</strong> GB76 REVO 0099 6903 1047 29</p>
                      <p><strong>BIC:</strong> REVOGB21</p>
                      <p><strong>Intermediary BIC:</strong> CHASGB2L</p>
                    </div>
                  </div>

                  {/* Payment Reference */}
                  <div className="bg-black text-white border-2 border-black rounded-xl p-4">
                    <p className="font-bold mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                      IMPORTANT: Payment Reference
                    </p>
                    <p style={{ fontFamily: 'Zodiak, serif' }}>
                      Use your name as the reference: <strong>{shippingInfo.name}</strong>
                    </p>
                  </div>
                </div>

                {/* I've Paid Button */}
                <Button
                  onClick={handlePaymentConfirmed}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-yellow-100 text-black hover:bg-black hover:text-white border-2 border-black text-xl py-6 font-black uppercase tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Zodiak, serif' }}
                >
                  {isSubmitting ? 'Processing...' : "I've Paid"}
                </Button>
              </div>
            </div>
          </div>

          {/* Animations */}
          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes scale-in {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            .animate-fade-in {
              animation: fade-in 0.2s ease-out;
            }

            .animate-scale-in {
              animation: scale-in 0.3s ease-out;
            }
          `}</style>
        </>
      )}

      <Footer />
    </>
  )
}
