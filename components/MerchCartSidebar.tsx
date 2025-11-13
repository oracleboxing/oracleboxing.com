'use client'

import { useState, useEffect } from 'react'
import { useMerchCart } from '@/contexts/MerchCartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, ArrowRight, Loader2, Trash2 } from 'lucide-react'
import { getTrackingParams, getOrInitTrackingData } from '@/lib/tracking-cookies'

export function MerchCartSidebar() {
  const { items, total, isOpen, closeCart, removeItem, updateQuantity } = useMerchCart()
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
            <h2 className="text-2xl font-bold text-black">Review your cart</h2>
            <button
              onClick={closeCart}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Your cart is empty</p>
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
                  const imageUrl = `https://media.oracleboxing.com/tracksuit/${productType}_${colorCode}_front.png`

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
                        <h3 className="font-semibold text-black text-sm mb-1">{item.product.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">{variantText}</p>
                        <p className="text-base font-bold text-black">£{item.product.price}</p>
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
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Subtotal</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">Shipping calculated at checkout</p>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-3">
                <div className="px-6">
                {/* Contact Info */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-black mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
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
                        <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
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
                      <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
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
                  <h3 className="text-sm font-bold text-black mb-2">Shipping Address</h3>
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="country" className="block text-xs font-medium text-gray-700 mb-1">
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
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="ES">Spain</option>
                          <option value="IT">Italy</option>
                          <option value="NL">Netherlands</option>
                          <option value="BE">Belgium</option>
                          <option value="AU">Australia</option>
                          <option value="NZ">New Zealand</option>
                        </select>
                    </div>
                    <div>
                      <label htmlFor="addressLine1" className="block text-xs font-medium text-gray-700 mb-1">
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
                      <label htmlFor="addressLine2" className="block text-xs font-medium text-gray-700 mb-1">
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
                        <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">
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
                        <label htmlFor="postalCode" className="block text-xs font-medium text-gray-700 mb-1">
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
                      <label htmlFor="state" className="block text-xs font-medium text-gray-700 mb-1">
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-yellow-100 text-black hover:bg-black hover:text-white border-2 border-black text-base py-6 font-black uppercase tracking-wide mb-3"
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
