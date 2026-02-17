'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductById } from '@/lib/products'
import { formatPrice } from '@/lib/currency'

import HomepageHeader from '@/components/HomepageHeader'

function MembershipCheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { currency } = useCurrency()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const productId = searchParams.get('product') || 'membership-monthly'
  const product = getProductById(productId)

  useEffect(() => {
    if (!product || product.type !== 'membership') {
      router.push('/membership')
    }
  }, [product, router])

  if (!product || product.type !== 'membership') {
    return null
  }

  const price = product.price
  const formattedPrice = formatPrice(price, currency)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/membership-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          customerInfo,
          currency,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const isFormValid = 
    customerInfo.firstName.trim() && 
    customerInfo.email.trim() && 
    customerInfo.email.includes('@')

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <HomepageHeader />
      <div className="flex flex-1 pt-[72px]">
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
        <main className="flex-1 min-w-0 py-16 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-section font-normal mb-4">
                Complete Your <span className="text-[#9CABA8]">Membership</span>
              </h1>
              <p className="text-[#605A57]">
                Enter your details to start your Oracle Boxing journey
              </p>
            </div>

            {/* Product Summary */}
            <div className="bg-[#F7F5F3] rounded-xl p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-sub font-semibold mb-1">
                    {product.title}
                  </h2>
                  <p className="text-sm text-[#605A57]">{product.shortDescription}</p>
                </div>
                <div className="text-right">
                  <div className="text-sub font-bold">
                    {formattedPrice}
                  </div>
                  <div className="text-sm text-[#605A57]">
                    {product.interval === 'month' ? '/month' : '/year'}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-[rgba(55,50,47,0.12)] pt-4">
                <div className="flex items-center gap-2 text-sm text-[#605A57]">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cancel anytime • 7-day money-back guarantee</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#37322F] mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#37322F] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#37322F] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#37322F] mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full py-4 px-8 bg-[#C8102E] hover:bg-[#a50d25] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-title"
              >
                {isLoading ? 'Processing...' : 'Continue to Payment'}
              </button>

              {/* Trust Badges */}
              <div className="text-center text-sm text-[#605A57] flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                Secure checkout powered by Stripe
              </div>
            </form>
          </div>
        </main>
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
      </div>
    </div>
  )
}

export default function MembershipCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#605A57]">Loading checkout...</div>
      </div>
    }>
      <MembershipCheckoutContent />
    </Suspense>
  )
}
