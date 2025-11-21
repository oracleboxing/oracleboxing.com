'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Copy, Check, AlertTriangle } from 'lucide-react'
import {
  CommunityTier,
  CommunityDiscount,
  calculateCommunityPrice,
  formatPrice,
  getTierDisplayName,
  getDiscountDisplayName,
  isDiscountEligible,
  isDiscountAdvised,
  TIER_PRICES,
} from '@/lib/community-pricing'

export default function AdminCommunityCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Form state
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [tier, setTier] = useState<CommunityTier>('monthly')
  const [discount, setDiscount] = useState<CommunityDiscount>('none')

  // Calculate pricing whenever selections change
  const calculation = calculateCommunityPrice(tier, discount)

  // Check if current discount is eligible and advised
  const discountEligible = isDiscountEligible(tier, discount)
  const discountAdvised = isDiscountAdvised(tier, discount)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!email || !name) {
      toast.error('Please fill in all required fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!discountEligible) {
      toast.error('Selected discount is not eligible for this tier')
      return
    }

    setIsLoading(true)
    setCheckoutUrl(null)

    try {
      const response = await fetch('/api/admin/create-community-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          tier,
          discount,
          trackingParams: {
            referrer: 'internal_community_tool',
            utm_source: 'internal',
            utm_medium: 'admin_tool',
            utm_campaign: 'community',
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (!data.url) {
        throw new Error('No checkout URL returned')
      }

      setCheckoutUrl(data.url)
      toast.success('Checkout link created successfully!')
    } catch (error: any) {
      console.error('Error creating session:', error)
      toast.error(error.message || 'Failed to create checkout session')
    } finally {
      setIsLoading(false)
    }
  }

  // Copy URL to clipboard
  const copyToClipboard = () => {
    if (checkoutUrl) {
      navigator.clipboard.writeText(checkoutUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Reset form
  const resetForm = () => {
    setCheckoutUrl(null)
    setEmail('')
    setName('')
    setTier('monthly')
    setDiscount('none')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://media.oracleboxing.com/Website/optimized/logos/long_black-large.webp"
            alt="Oracle Boxing"
            className="h-4"
          />
        </div>

        {/* Heading */}
        <h1 className="text-center text-gray-900 text-xl font-bold mb-2">
          Internal Community Checkout
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Create custom checkout links for community memberships
        </p>

        {checkoutUrl ? (
          // Success State - Show checkout URL
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Link Created</h2>
              <p className="text-gray-600">Share this link with {name}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs font-medium text-gray-500 mb-2">CHECKOUT URL</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={checkoutUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => window.open(checkoutUrl, '_blank')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  Open
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-[#000000] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Membership Details:</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Membership:</span>
                  <span className="font-semibold text-gray-900">{getTierDisplayName(calculation.tier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(calculation.basePrice)}</span>
                </div>
                {calculation.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-semibold text-gray-900">-{formatPrice(calculation.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-bold text-gray-900">Final Price:</span>
                  <span className="font-bold text-lg text-gray-900">{formatPrice(calculation.finalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Equivalent:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(calculation.monthlyEquivalent)}/mo</span>
                </div>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3 px-6 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition-colors"
            >
              Create Another Link
            </button>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all"
                    placeholder="customer@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Membership Configuration */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Membership Configuration</h2>

                {/* Tier Selection */}
                <div>
                  <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Tier *
                  </label>
                  <select
                    id="tier"
                    value={tier}
                    onChange={(e) => {
                      const newTier = e.target.value as CommunityTier
                      setTier(newTier)
                      // Reset discount if not eligible
                      if (!isDiscountEligible(newTier, discount)) {
                        setDiscount('none')
                      }
                    }}
                    className="w-full px-5 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all"
                  >
                    <option value="monthly">Monthly - {formatPrice(TIER_PRICES.monthly)}/mo</option>
                    <option value="3_month">3-Month - {formatPrice(TIER_PRICES['3_month'])} total</option>
                    <option value="6_month">6-Month - {formatPrice(TIER_PRICES['6_month'])} total</option>
                    <option value="annual">Annual - {formatPrice(TIER_PRICES.annual)} total</option>
                    <option value="24_month">24-Month - {formatPrice(TIER_PRICES['24_month'])} total</option>
                  </select>
                </div>

                {/* Discount Selection */}
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code
                  </label>
                  <select
                    id="discount"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value as CommunityDiscount)}
                    className="w-full px-5 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all"
                  >
                    <option value="none">No Discount</option>
                    <option value="challenge_winner" disabled={!isDiscountEligible(tier, 'challenge_winner')}>
                      Challenge Winner (-$197) {!isDiscountEligible(tier, 'challenge_winner') && '(Not available)'}
                    </option>
                    <option value="first_4_months" disabled={!isDiscountEligible(tier, 'first_4_months')}>
                      First 4 Months (-$49.25/mo × 4) {!isDiscountEligible(tier, 'first_4_months') && '(Not available)'}
                    </option>
                  </select>

                  {/* Warning for 3-month + challenge winner */}
                  {discount === 'challenge_winner' && tier === '3_month' && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>Warning:</strong> Applying the Challenge Winner discount to the 3-Month membership is not advised.
                        Consider recommending the 6-Month, Annual, or 24-Month plan instead for better value.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-4">Price Preview</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membership:</span>
                    <span className="font-semibold text-gray-900">{getTierDisplayName(tier)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(calculation.basePrice)}</span>
                  </div>
                  {calculation.discountAmount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount:</span>
                      <span className="font-semibold">-{formatPrice(calculation.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-gray-300 text-lg">
                    <span className="font-bold text-gray-900">Final Price:</span>
                    <span className="font-bold text-[#000000]">{formatPrice(calculation.finalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 pt-2">
                    <span>Monthly Equivalent:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(calculation.monthlyEquivalent)}/mo</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Duration:</span>
                    <span className="font-semibold text-gray-900">{calculation.totalMonths} {calculation.totalMonths === 1 ? 'month' : 'months'}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !discountEligible}
                className={`w-full py-4 px-6 font-bold text-base rounded-full shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLoading || !discountEligible
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#000000] hover:bg-[#1a1a1a] cursor-pointer'
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Checkout Link...
                  </>
                ) : (
                  'Create Checkout Link'
                )}
              </button>
            </div>
          </form>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">FAQ for Closers</h2>

          <div className="space-y-6">
            {/* Membership Tiers */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Membership Tiers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Monthly:</strong> {formatPrice(TIER_PRICES.monthly)}/month - Recurring subscription</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>3-Month:</strong> {formatPrice(TIER_PRICES['3_month'])} total - One-time payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>6-Month:</strong> {formatPrice(TIER_PRICES['6_month'])} total - One-time payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Annual:</strong> {formatPrice(TIER_PRICES.annual)} total - One-time payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>24-Month:</strong> {formatPrice(TIER_PRICES['24_month'])} total - One-time payment</span>
                </li>
              </ul>
            </div>

            {/* Discounts */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Discount Codes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Challenge Winner ($197 off):</strong> Available for 6-Month, Annual, and 24-Month tiers. Can be applied to 3-Month but NOT ADVISED.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>First 4 Months ($49.25/mo × 4):</strong> Only available for Monthly subscription - gives $49.25 off per month for the first 4 months.</span>
                </li>
              </ul>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Payment Methods</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>PayPal:</strong> Customers need to select "Pay with USD" option when checking out</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Klarna:</strong> Only available for GBP, EUR, and certain other currencies - NOT available for USD</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Apple Pay / Google Pay:</strong> Automatically appears on supported devices</span>
                </li>
              </ul>
            </div>

            {/* Billing */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Billing & Tax</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Automatic Tax:</strong> Tax is calculated automatically based on customer location and added to the total</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>One-Time Payments:</strong> 3-Month, 6-Month, Annual, and 24-Month are all one-time payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Monthly Subscription:</strong> Recurring monthly charge on the same day each month</span>
                </li>
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Sales Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Best Value:</strong> Annual membership at {formatPrice(TIER_PRICES.annual - 197)} with Challenge Winner discount ({formatPrice((TIER_PRICES.annual - 197) / 12)}/mo equivalent)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Avoid:</strong> Don't apply Challenge Winner discount to 3-Month tier - better to upsell to 6-Month or Annual</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
