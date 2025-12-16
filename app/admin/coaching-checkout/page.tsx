'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Copy, Check } from 'lucide-react'
import {
  CoachingTier,
  CustomerDiscount,
  PaymentPlan,
  Coach,
  calculateCoachingPrice,
  formatPrice,
  TIER_PRICES,
  CUSTOMER_DISCOUNTS,
} from '@/lib/coaching-pricing'

export default function AdminCoachingCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Form state
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [tier, setTier] = useState<CoachingTier>('tier_1')
  const [customerDiscount, setCustomerDiscount] = useState<CustomerDiscount>('none')
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('full')
  const [sixMonthCommitment, setSixMonthCommitment] = useState(false)
  const [coach, setCoach] = useState<Coach>('Toni')

  // Calculate pricing whenever selections change
  const calculation = calculateCoachingPrice(tier, customerDiscount, sixMonthCommitment, paymentPlan)

  // Reset discounts and 6-month commitment when monthly is selected
  useEffect(() => {
    if (paymentPlan === 'monthly') {
      if (sixMonthCommitment) {
        setSixMonthCommitment(false)
      }
      if (customerDiscount !== 'none') {
        setCustomerDiscount('none')
      }
    }
  }, [paymentPlan, sixMonthCommitment, customerDiscount])

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

    setIsLoading(true)
    setCheckoutUrl(null)

    try {
      const response = await fetch('/api/admin/create-coaching-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          tier,
          customerDiscount,
          sixMonthCommitment,
          paymentPlan,
          coach,
          trackingParams: {
            referrer: 'internal_coaching_tool',
            utm_source: 'internal',
            utm_medium: 'admin_tool',
            utm_campaign: 'coaching',
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
    setTier('tier_1')
    setCustomerDiscount('none')
    setPaymentPlan('full')
    setSixMonthCommitment(false)
    setCoach('Toni')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://sb.oracleboxing.com/Website/optimized/logos/long_black-large.webp"
            alt="Oracle Boxing"
            className="h-4"
          />
        </div>

        {/* Heading */}
        <h1 className="text-center text-gray-900 text-xl font-bold mb-2">
          Internal Coaching Checkout
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Create custom checkout links for 1-on-1 coaching clients
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
              <p className="text-sm font-medium text-gray-700 mb-3">Payment Details:</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tier:</span>
                  <span className="font-semibold text-gray-900">{tier.toUpperCase().replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(calculation.basePrice)}</span>
                </div>
                {calculation.customerDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>Customer Discount:</span>
                    <span className="font-semibold text-gray-900">-{formatPrice(calculation.customerDiscount)}</span>
                  </div>
                )}
                {calculation.sixMonthDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>6-Month Discount (10%):</span>
                    <span className="font-semibold text-gray-900">-{formatPrice(calculation.sixMonthDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-bold text-gray-900">Final Price:</span>
                  <span className="font-bold text-lg text-gray-900">{formatPrice(calculation.finalPrice)}</span>
                </div>
                {calculation.monthlyAmount && (
                  <div className="flex justify-between">
                    <span>Monthly Payment:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(calculation.monthlyAmount)}/mo</span>
                  </div>
                )}
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

              {/* Pricing Configuration */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pricing Configuration</h2>

                {/* Tier Selection */}
                <div>
                  <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-2">
                    Tier *
                  </label>
                  <select
                    id="tier"
                    value={tier}
                    onChange={(e) => setTier(e.target.value as CoachingTier)}
                    className="w-full px-5 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all"
                  >
                    <option value="tier_1">Tier 1 - {formatPrice(TIER_PRICES.tier_1)}</option>
                    <option value="tier_2">Tier 2 - {formatPrice(TIER_PRICES.tier_2)}</option>
                    <option value="tier_3">Tier 3 - {formatPrice(TIER_PRICES.tier_3)}</option>
                  </select>
                </div>

                {/* Customer Discount */}
                <div>
                  <label htmlFor="discount" className={`block text-sm font-medium mb-2 ${paymentPlan === 'monthly' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Customer Discount
                    {paymentPlan === 'monthly' && <span className="text-xs text-gray-400 ml-2">(Not available for monthly plans)</span>}
                  </label>
                  <select
                    id="discount"
                    value={customerDiscount}
                    onChange={(e) => setCustomerDiscount(e.target.value as CustomerDiscount)}
                    disabled={paymentPlan === 'monthly'}
                    className="w-full px-5 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="none">No Discount</option>
                    <option value="challenge_winner">Challenge Winner (-{formatPrice(CUSTOMER_DISCOUNTS.challenge_winner)})</option>
                    <option value="existing_member">Existing Member (-{formatPrice(CUSTOMER_DISCOUNTS.existing_member)})</option>
                    <option value="97_off">$97 Off (-{formatPrice(CUSTOMER_DISCOUNTS['97_off'])})</option>
                  </select>
                </div>

                {/* Payment Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Plan *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('full')}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        paymentPlan === 'full'
                          ? 'bg-[#000000] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Pay in Full
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('split_2')}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        paymentPlan === 'split_2'
                          ? 'bg-[#000000] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Split by 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('monthly')}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        paymentPlan === 'monthly'
                          ? 'bg-[#000000] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* 6-Month Commitment */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    id="sixMonth"
                    checked={sixMonthCommitment}
                    onChange={(e) => setSixMonthCommitment(e.target.checked)}
                    disabled={paymentPlan === 'monthly'}
                    className="w-5 h-5 rounded border-gray-300 text-[#000000] focus:ring-[#000000] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="sixMonth" className={`text-sm font-medium flex-1 ${paymentPlan === 'monthly' ? 'text-gray-400' : 'text-gray-700'}`}>
                    6-Month Commitment <span className="text-gray-900 font-semibold">(Get 10% off + 2 months upfront)</span>
                    {paymentPlan === 'monthly' && <span className="block text-xs text-gray-400 mt-1">Not available for monthly plans</span>}
                  </label>
                </div>

                {/* Coach Selection */}
                <div>
                  <label htmlFor="coach" className="block text-sm font-medium text-gray-700 mb-2">
                    Coach Assignment *
                  </label>
                  <select
                    id="coach"
                    value={coach}
                    onChange={(e) => setCoach(e.target.value as Coach)}
                    className="w-full px-5 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all"
                  >
                    <option value="Toni">Toni</option>
                    <option value="Charlie">Charlie</option>
                  </select>
                </div>
              </div>

              {/* Price Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-4">Price Preview</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(calculation.basePrice)}</span>
                  </div>
                  {calculation.customerDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Customer Discount:</span>
                      <span className="font-semibold">-{formatPrice(calculation.customerDiscount)}</span>
                    </div>
                  )}
                  {calculation.sixMonthDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>6-Month Discount:</span>
                      <span className="font-semibold">-{formatPrice(calculation.sixMonthDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-gray-300 text-lg">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-[#000000]">{formatPrice(calculation.finalPrice)}</span>
                  </div>
                  {calculation.monthlyAmount && (
                    <div className="flex justify-between text-blue-700 pt-2">
                      <span className="font-medium">Monthly Payment:</span>
                      <span className="font-semibold">{formatPrice(calculation.monthlyAmount)}/mo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 font-bold text-base rounded-full shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLoading
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
            {/* Payment Methods */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Payment Methods</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>PayPal:</strong> Customers need to select "Pay with USD" option when checking out to use PayPal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Klarna:</strong> Only available for GBP, EUR, and certain other currencies - NOT available for USD payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Apple Pay / Google Pay:</strong> Automatically appears for customers on supported devices (iPhone/Safari for Apple Pay, Android/Chrome for Google Pay)</span>
                </li>
              </ul>
            </div>

            {/* Discounts */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Discounts & Payment Plans</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Challenge Winner:</strong> -$197 discount (applies to Pay in Full and Split by 2 only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Existing Member:</strong> -$297 discount (applies to Pay in Full and Split by 2 only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>$97 Off:</strong> -$97 discount (applies to Pay in Full and Split by 2 only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Monthly Subscriptions:</strong> Do NOT receive customer discounts - standard rates only ($500, $667, or $833/month)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>6-Month Commitment:</strong> Get 10% off + pay for 2 months upfront (not available for monthly plans)</span>
                </li>
              </ul>
            </div>

            {/* Payment Plan Breakdown */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Payment Plan Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Pay in Full:</strong> One-time payment, customer discounts apply</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Split by 2:</strong> 2 monthly payments, auto-cancels after 2nd payment, customer discounts apply</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Monthly:</strong> Ongoing subscription over 3 months, NO customer discounts, 6-month commitment NOT available</span>
                </li>
              </ul>
            </div>

            {/* Tax & Billing */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Tax & Billing</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Automatic Tax:</strong> Tax is calculated automatically based on customer location and added to the total</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Subscription Billing:</strong> For Split by 2 and Monthly plans, customers are charged on the same day each month</span>
                </li>
              </ul>
            </div>

            {/* Coach Assignment */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Coach Assignment</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span><strong>Toni & Charlie:</strong> Select the coach that will work with this client - this is tracked in metadata</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
