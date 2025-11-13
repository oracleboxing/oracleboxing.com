'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Footer } from '@/components/Footer'
import { ArrowRight, Loader2 } from 'lucide-react'
import { getTrackingParams, getOrInitTrackingData } from '@/lib/tracking-cookies'

export default function MerchCheckoutPage() {
  const router = useRouter()
  const { items, total } = useCart()
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

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items, router])

  const handleSubmit = async (e: React.FormEvent) => {
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
          items,
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

  // Get order summary
  const getOrderSummary = () => {
    return items.map(item => {
      const parts = [item.product.title]

      if (item.metadata) {
        // Add color if present
        if (item.metadata.tracksuit_color || item.metadata.hoodie_color) {
          parts.push(`Color: ${item.metadata.tracksuit_color || item.metadata.hoodie_color}`)
        }

        // Add sizes
        if (item.metadata.hoodie_size && item.metadata.joggers_size) {
          parts.push(`Hoodie: ${item.metadata.hoodie_size}`)
          parts.push(`Joggers: ${item.metadata.joggers_size}`)
        } else if (item.metadata.hoodie_size) {
          parts.push(`Size: ${item.metadata.hoodie_size}`)
        }
      }

      return parts.join(', ')
    }).join(' | ')
  }

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-black mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg border-2 border-black h-fit">
              <h2 className="text-2xl font-bold text-black mb-4">Order Summary</h2>

              {items.map((item, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-gray-200">
                  <div className="font-semibold text-black">{item.product.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.metadata?.tracksuit_color || item.metadata?.hoodie_color && (
                      <div>Color: {item.metadata.tracksuit_color || item.metadata.hoodie_color}</div>
                    )}
                    {item.metadata?.hoodie_size && item.metadata?.joggers_size && (
                      <>
                        <div>Hoodie Size: {item.metadata.hoodie_size}</div>
                        <div>Joggers Size: {item.metadata.joggers_size}</div>
                      </>
                    )}
                    {item.metadata?.hoodie_size && !item.metadata?.joggers_size && (
                      <div>Size: {item.metadata.hoodie_size}</div>
                    )}
                  </div>
                  <div className="text-lg font-bold text-black mt-2">
                    £{item.product.price}
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <div className="flex justify-between text-xl font-bold text-black">
                  <span>Subtotal:</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Shipping calculated at next step</p>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-lg border-2 border-black">
                <h2 className="text-xl font-bold text-black mb-4">Contact Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-black mb-1">First Name *</label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-black mb-1">Last Name *</label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-1">Email *</label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">Phone Number</label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-lg border-2 border-black">
                <h2 className="text-xl font-bold text-black mb-4">Shipping Address</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-black mb-1">Country *</label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-black mb-1">Address Line 1 *</label>
                    <Input
                      id="addressLine1"
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-black mb-1">Address Line 2</label>
                    <Input
                      id="addressLine2"
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-black mb-1">City *</label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-black mb-1">State/County *</label>
                      <Input
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-black mb-1">Postal Code *</label>
                    <Input
                      id="postalCode"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                size="lg"
                className="w-full bg-yellow-100 text-black hover:bg-black hover:text-white border-2 border-black text-lg py-6 font-black uppercase tracking-wide"
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
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
