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
import { Package } from 'lucide-react'

export default function RedeemTracksuitPage() {
  const [selectedColor, setSelectedColor] = useState<TracksuitColor>('Forest')
  const [hoodieSize, setHoodieSize] = useState<TracksuitSize>('M')
  const [joggersSize, setJoggersSize] = useState<TracksuitSize>('M')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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
  })

  const product = getProductById('tracksuit')!

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleRedeem = async () => {
    // Validate required fields
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.line1 || !shippingInfo.city || !shippingInfo.postal_code || !shippingInfo.country) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        // Product details
        color: selectedColor,
        hoodie_size: hoodieSize,
        joggers_size: joggersSize,
        tracksuit_sku: `ORA-TS-${selectedColor.substring(0, 3).toUpperCase()}-HD${hoodieSize}-JG${joggersSize}`,

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
        presale_cohort: 'Presale-2025',
        redemption_timestamp: new Date().toISOString(),
      }

      const response = await fetch('https://hook.eu2.make.com/7kiw7ct1q69gmzsx45recvgjee3y2pi7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit redemption')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Redemption error:', error)
      alert('Failed to submit redemption. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <MerchHeader showCart={false} />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
              <Package className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>
              Redemption Complete!
            </h1>
            <p className="text-lg text-black leading-relaxed" style={{ fontFamily: 'Zodiak, serif' }}>
              Your tracksuit will be shipped to the address provided. You'll receive a confirmation email at <span className="font-bold">{shippingInfo.email}</span>
            </p>
            <div className="bg-white border-2 border-black rounded-lg p-6 text-left space-y-2">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Zodiak, serif' }}>Your Selection:</p>
              <p className="text-black font-bold" style={{ fontFamily: 'Zodiak, serif' }}>
                {selectedColor} Tracksuit
              </p>
              <p className="text-black" style={{ fontFamily: 'Zodiak, serif' }}>
                Hoodie: {hoodieSize} • Joggers: {joggersSize}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <MerchHeader showCart={false} />

      {/* Pre-Order Banner */}
      <div className="bg-yellow-100 border-b-2 border-black py-2 px-4 text-center">
        <p className="text-sm md:text-base font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>
          Redeem your tracksuit - Ships before Christmas
        </p>
      </div>

      {/* Mobile: Product info above carousel */}
      <div className="lg:hidden px-6 pt-6 pb-4 bg-gray-50">
        <h1 className="text-4xl font-bold text-black mb-3" style={{ fontFamily: 'Zodiak, serif' }}>
          TRACKSUIT
        </h1>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Zodiak, serif' }}>
          Select your color and sizes below
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
            <p className="text-black leading-relaxed mb-6" style={{ fontFamily: 'Zodiak, serif' }}>
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

          {/* Shipping Information Form */}
          <div className="space-y-4 border-t-2 border-gray-300 pt-6">
            <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>
                  Full Name *
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

            {/* Redeem Button */}
            <Button
              onClick={handleRedeem}
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-yellow-100 text-black hover:bg-black hover:text-white border-2 border-black text-xl md:text-2xl py-6 md:py-8 font-black uppercase tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Zodiak, serif' }}
            >
              {isSubmitting ? 'Processing...' : 'Redeem'}
              {!isSubmitting && <Package className="w-6 h-6 ml-2" />}
            </Button>
          </div>
        </div>
      </TracksuitImageGallery>

      <Footer />
    </>
  )
}
