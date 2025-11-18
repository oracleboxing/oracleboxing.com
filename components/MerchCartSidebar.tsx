'use client'

import { useState, useEffect } from 'react'
import { useMerchCart } from '@/contexts/MerchCartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, ArrowRight, Loader2, Trash2 } from 'lucide-react'
import { getTrackingParams, getOrInitTrackingData } from '@/lib/tracking-cookies'

export function MerchCartSidebar() {
  const { items, total, subtotal, discount, totalItems, isOpen, closeCart, removeItem, updateQuantity } = useMerchCart()
  const [isProcessing, setIsProcessing] = useState(false)

  // Customer info
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Shipping address
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('GB')

  // Determine postal code label based on country
  const postalCodeLabel = country === 'US' || country === 'CA' ? 'Zip Code *' : 'Postal Code *'

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Get tracking params and cookie data
      const trackingParams = getTrackingParams()
      const cookieData = getOrInitTrackingData()

      // Create checkout session with customer info and shipping address
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            price_id: item.product.stripe_price_id,
            metadata: item.metadata,
          })),
          customerInfo: {
            firstName: `${firstName} ${lastName}`,
            lastName,
            email,
            phone,
            address: {
              line1: addressLine1,
              line2: addressLine2,
              city,
              state,
              postal_code: postalCode,
              country,
            },
          },
          currency: 'GBP',
          trackingParams,
          cookieData,
          pageUrl: window.location.href,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Transparent overlay to close cart when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-[2px] backdrop-brightness-75 transition-all duration-300"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pb-4 mb-4">
            <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>Review your cart</h2>
            <button
              onClick={closeCart}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4" style={{ fontFamily: 'Zodiak, serif' }}>Your cart is empty</p>
              <a
                href="/tracksuit"
                className="inline-block px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
                style={{ fontFamily: 'Zodiak, serif' }}
              >
                Browse Products
              </a>
            </div>
          ) : (
            <>
              <div className="px-6 space-y-4 mb-4">
                {items.map((item, index) => {
                  // Get the first image for the product
                  const colorName = item.metadata?.tracksuit_color || item.metadata?.hoodie_color || 'Hazel'
                  const colorMap: Record<string, string> = {
                    Forest: 'green',
                    Hazel: 'brown',
                    Steel: 'blue',
                    Black: 'black',
                  }
                  const colorCode = colorMap[colorName] || 'brown'
                  const productType = item.product.id === 'tracksuit' ? 'hoodie' : 'hoodie'
                  const imageUrl = `https://media.oracleboxing.com/tracksuit/${productType}_${colorCode}_front.webp`

                  // Format the variant text
                  const color = item.metadata?.tracksuit_color || item.metadata?.hoodie_color || ''
                  let variantText = color
                  if (item.metadata?.hoodie_size && item.metadata?.joggers_size) {
                    variantText = `${color} / Hoodie ${item.metadata.hoodie_size}, Joggers ${item.metadata.joggers_size}`
                  } else if (item.metadata?.hoodie_size) {
                    variantText = `${color} / ${item.metadata.hoodie_size}`
                  }

                  return (
                    <div key={index} className="flex gap-3 items-start">
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info - Middle Column */}
                      <div className="flex-1 flex flex-col justify-start">
                        <h3 className="font-semibold text-black text-sm mb-1" style={{ fontFamily: 'Zodiak, serif' }}>{item.product.title}</h3>
                        <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Zodiak, serif' }}>{variantText}</p>
                        <p className="text-base font-bold text-black" style={{ fontFamily: 'Zodiak, serif' }}>£{item.product.price}</p>
                      </div>

                      {/* Controls - Right Column */}
                      <div className="flex flex-col items-end gap-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded text-sm">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.metadata, item.quantity - 1)}
                            className="px-2 py-0.5 hover:bg-gray-100 transition"
                          >
                            −
                          </button>
                          <span className="px-2 py-0.5 border-x border-gray-300 min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.metadata, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-gray-100 transition"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id, item.metadata)}
                          className="text-xs text-gray-600 underline cursor-pointer hover:text-black transition"
                          style={{ fontFamily: 'Zodiak, serif' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Subtotal Divider */}
              <div className="bg-black py-4 px-4 mb-4">
                {discount > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-base text-white" style={{ fontFamily: 'Zodiak, serif' }}>
                      <span>Subtotal</span>
                      <span>£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base text-yellow-100" style={{ fontFamily: 'Zodiak, serif' }}>
                      <span>Multi-item discount (10%)</span>
                      <span>-£{discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-700" style={{ fontFamily: 'Zodiak, serif' }}>
                      <span>Total</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between text-lg font-bold text-white" style={{ fontFamily: 'Zodiak, serif' }}>
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                )}
                <p className="text-sm text-gray-300 mt-2" style={{ fontFamily: 'Zodiak, serif' }}>Shipping calculated at checkout</p>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-3">
                <div className="px-6">
                {/* Contact Info */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>Contact Information</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Zodiak, serif' }}>
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="text-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Zodiak, serif' }}>
                          Last Name *
                        </label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="text-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Zodiak, serif' }}>
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-sm font-bold text-black mb-2" style={{ fontFamily: 'Zodiak, serif' }}>Shipping Address</h3>
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="country" className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Zodiak, serif' }}>
                        Country *
                      </label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md h-9 focus:outline-none focus:ring-0 focus:border-gray-400"
                      >
                          <option value="GB">United Kingdom</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="AT">Austria</option>
                          <option value="BE">Belgium</option>
                          <option value="BG">Bulgaria</option>
                          <option value="HR">Croatia</option>
                          <option value="CY">Cyprus</option>
                          <option value="CZ">Czech Republic</option>
                          <option value="DK">Denmark</option>
                          <option value="EE">Estonia</option>
                          <option value="FI">Finland</option>
                          <option value="FR">France</option>
                          <option value="DE">Germany</option>
                          <option value="GR">Greece</option>
                          <option value="HU">Hungary</option>
                          <option value="IE">Ireland</option>
                          <option value="IT">Italy</option>
                          <option value="LV">Latvia</option>
                          <option value="LT">Lithuania</option>
                          <option value="LU">Luxembourg</option>
                          <option value="MT">Malta</option>
                          <option value="NL">Netherlands</option>
                          <option value="PL">Poland</option>
                          <option value="PT">Portugal</option>
                          <option value="RO">Romania</option>
                          <option value="SK">Slovakia</option>
                          <option value="SI">Slovenia</option>
                          <option value="ES">Spain</option>
                          <option value="SE">Sweden</option>
                          <option value="CH">Switzerland</option>
                          <option value="NO">Norway</option>
                          <option value="IS">Iceland</option>
                          <option value="AU">Australia</option>
                          <option value="NZ">New Zealand</option>
                          <option value="JP">Japan</option>
                          <option value="SG">Singapore</option>
                          <option value="AE">United Arab Emirates</option>
                          <option value="ZA">South Africa</option>
                          <option value="MX">Mexico</option>
                          <option value="BR">Brazil</option>
                          <option value="AR">Argentina</option>
                          <option value="IN">India</option>
                          <option value="KR">South Korea</option>
                          <option value="TH">Thailand</option>
                          <option value="MY">Malaysia</option>
                          <option value="PH">Philippines</option>
                          <option value="ID">Indonesia</option>
                          <option value="VN">Vietnam</option>
                        </select>
                    </div>
                    <div>
                      <label htmlFor="addressLine1" className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Zodiak, serif' }}>
                        Address *
                      </label>
                      <Input
                        id="addressLine1"
                        type="text"
                        placeholder="Street address"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        required
                        className="text-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="addressLine2" className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Zodiak, serif' }}>
                        Apartment, suite, etc.
                      </label>
                      <Input
                        id="addressLine2"
                        type="text"
                        placeholder="Apt, suite, unit, etc."
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="text-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Zodiak, serif' }}>
                          City *
                        </label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          className="text-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Zodiak, serif' }}>
                          {postalCodeLabel}
                        </label>
                        <Input
                          id="postalCode"
                          type="text"
                          placeholder={country === 'US' || country === 'CA' ? '12345' : 'AB12 3CD'}
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          required
                          className="text-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Zodiak, serif' }}>
                        State/County *
                      </label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="State or County"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        className="text-sm h-9 mb-3 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Pre-Order Notice */}
                <p className="text-xs text-gray-600 text-center mb-3" style={{ fontFamily: 'Zodiak, serif' }}>
                  Pre-orders will be shipped before Christmas
                </p>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-yellow-100 text-black hover:bg-black hover:text-white border-2 border-black text-base py-6 font-black uppercase tracking-wide mb-3 cursor-pointer"
                  style={{ fontFamily: 'Zodiak, serif' }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                </div>
              </form>

              {/* Payment Methods Banner */}
              <div className="bg-black py-3 px-4 mt-auto">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <img
                    src="https://media.oracleboxing.com/Website/payment1.svg"
                    alt="Visa & Mastercard"
                    className="h-4"
                  />
                  <img
                    src="https://media.oracleboxing.com/Website/payment2.svg"
                    alt="Apple Pay & Google Pay"
                    className="h-4"
                  />
                  <img
                    src="https://media.oracleboxing.com/Website/paypal2.svg"
                    alt="PayPal"
                    className="h-5"
                  />
                  <img
                    src="https://media.oracleboxing.com/Website/klarna.svg"
                    alt="Klarna"
                    className="h-5"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
