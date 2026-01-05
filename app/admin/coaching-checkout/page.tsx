'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Copy, Check, ChevronDown } from 'lucide-react'
import FooterSection from '@/components/footer-section'
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
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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

  const faqs = [
    {
      question: "Payment Methods",
      answer: `PayPal: Customers need to select "Pay with USD" option when checking out to use PayPal.

Klarna: Only available for GBP, EUR, and certain other currencies - NOT available for USD payments.

Apple Pay / Google Pay: Automatically appears for customers on supported devices (iPhone/Safari for Apple Pay, Android/Chrome for Google Pay).`
    },
    {
      question: "Discounts & Payment Plans",
      answer: `Challenge Winner: -$197 discount (applies to Pay in Full and Split by 2 only)

Existing Member: -$297 discount (applies to Pay in Full and Split by 2 only)

$97 Off: -$97 discount (applies to Pay in Full and Split by 2 only)

Monthly Subscriptions: Do NOT receive customer discounts - standard rates only ($500, $667, or $833/month)

6-Month Commitment: Get 10% off + pay for 2 months upfront (not available for monthly plans)`
    },
    {
      question: "Payment Plan Details",
      answer: `Pay in Full: One-time payment, customer discounts apply

Split by 2: 2 monthly payments, auto-cancels after 2nd payment, customer discounts apply

Monthly: Ongoing subscription over 3 months, NO customer discounts, 6-month commitment NOT available`
    },
    {
      question: "Tax & Billing",
      answer: `Automatic Tax: Tax is calculated automatically based on customer location and added to the total.

Subscription Billing: For Split by 2 and Monthly plans, customers are charged on the same day each month.`
    },
    {
      question: "Coach Assignment",
      answer: `Toni & Charlie: Select the coach that will work with this client - this is tracked in metadata.`
    }
  ]

  return (
    <div className="min-h-screen bg-[#FFFCF5] flex overflow-x-hidden">
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
      <main className="flex-1 min-w-0">

        {/* Hero Section */}
        <section className="relative pt-[120px] md:pt-[160px] pb-16 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4">
            <div className="flex flex-col items-center gap-6">
              <h1 className="max-w-[900px] text-center text-[#37322f] text-4xl md:text-[64px] font-normal leading-tight md:leading-[1.15] font-serif">
                Internal Coaching Checkout
              </h1>
              <p className="max-w-[700px] text-center text-[#37322f]/80 text-lg md:text-xl font-medium leading-7 font-sans">
                Create custom checkout links for 1-on-1 coaching clients
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-24 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[600px] mx-auto px-4">
            {checkoutUrl ? (
              // Success State - Show checkout URL
              <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)]">
                <div className="text-center mb-6">
                  <h2 className="text-[#37322F] text-2xl md:text-3xl font-normal font-serif mb-2">Checkout Link Created</h2>
                  <p className="text-[rgba(73,66,61,0.70)] text-base font-sans">Share this link with {name}</p>
                </div>

                <div className="bg-[#FFFCF5] rounded-xl p-4 mb-6">
                  <p className="text-xs font-medium text-[rgba(73,66,61,0.50)] mb-2 font-sans">CHECKOUT URL</p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={checkoutUrl}
                      readOnly
                      className="flex-1 px-4 py-2 bg-white border border-[rgba(55,50,47,0.12)] rounded-xl text-sm font-mono text-[#37322F]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(checkoutUrl, '_blank')}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#49423D] text-white rounded-full hover:bg-[#37322F] transition-colors flex items-center justify-center gap-2 font-sans font-semibold text-sm"
                      >
                        Open
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#37322F] text-white rounded-full hover:bg-[#49423D] transition-colors flex items-center justify-center gap-2 font-sans font-semibold text-sm"
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
                </div>

                <div className="bg-[#FFFCF5] rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-[#37322F] mb-3 font-sans">Payment Details:</p>
                  <div className="space-y-2 text-sm text-[rgba(73,66,61,0.70)] font-sans">
                    <div className="flex justify-between">
                      <span>Tier:</span>
                      <span className="font-semibold text-[#37322F]">{tier.toUpperCase().replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span className="font-semibold text-[#37322F]">{formatPrice(calculation.basePrice)}</span>
                    </div>
                    {calculation.customerDiscount > 0 && (
                      <div className="flex justify-between">
                        <span>Customer Discount:</span>
                        <span className="font-semibold text-[#37322F]">-{formatPrice(calculation.customerDiscount)}</span>
                      </div>
                    )}
                    {calculation.sixMonthDiscount > 0 && (
                      <div className="flex justify-between">
                        <span>6-Month Discount (10%):</span>
                        <span className="font-semibold text-[#37322F]">-{formatPrice(calculation.sixMonthDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-[rgba(55,50,47,0.12)]">
                      <span className="font-semibold text-[#37322F]">Final Price:</span>
                      <span className="font-semibold text-lg text-[#37322F]">{formatPrice(calculation.finalPrice)}</span>
                    </div>
                    {calculation.monthlyAmount && (
                      <div className="flex justify-between">
                        <span>Monthly Payment:</span>
                        <span className="font-semibold text-[#37322F]">{formatPrice(calculation.monthlyAmount)}/mo</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="w-full py-4 bg-[#FFFCF5] text-[#37322F] rounded-full font-semibold text-lg font-sans cursor-pointer hover:bg-[#F5F2EB] transition-colors border border-[rgba(55,50,47,0.12)]"
                >
                  Create Another Link
                </button>
              </div>
            ) : (
              // Form State
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)] space-y-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h2 className="text-[#37322F] text-xl font-normal font-serif">Customer Information</h2>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                        placeholder="customer@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Pricing Configuration */}
                  <div className="space-y-4 pt-6 border-t border-[rgba(55,50,47,0.08)]">
                    <h2 className="text-[#37322F] text-xl font-normal font-serif">Pricing Configuration</h2>

                    {/* Tier Selection */}
                    <div>
                      <label htmlFor="tier" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                        Tier *
                      </label>
                      <select
                        id="tier"
                        value={tier}
                        onChange={(e) => setTier(e.target.value as CoachingTier)}
                        className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                      >
                        <option value="tier_1">Tier 1 - {formatPrice(TIER_PRICES.tier_1)}</option>
                        <option value="tier_2">Tier 2 - {formatPrice(TIER_PRICES.tier_2)}</option>
                        <option value="tier_3">Tier 3 - {formatPrice(TIER_PRICES.tier_3)}</option>
                      </select>
                    </div>

                    {/* Customer Discount */}
                    <div>
                      <label htmlFor="discount" className={`block text-sm font-medium mb-2 font-sans ${paymentPlan === 'monthly' ? 'text-[rgba(73,66,61,0.50)]' : 'text-[#37322F]'}`}>
                        Customer Discount
                        {paymentPlan === 'monthly' && <span className="text-xs text-[rgba(73,66,61,0.50)] ml-2">(Not available for monthly plans)</span>}
                      </label>
                      <select
                        id="discount"
                        value={customerDiscount}
                        onChange={(e) => setCustomerDiscount(e.target.value as CustomerDiscount)}
                        disabled={paymentPlan === 'monthly'}
                        className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#FFFCF5]"
                      >
                        <option value="none">No Discount</option>
                        <option value="challenge_winner">Challenge Winner (-{formatPrice(CUSTOMER_DISCOUNTS.challenge_winner)})</option>
                        <option value="existing_member">Existing Member (-{formatPrice(CUSTOMER_DISCOUNTS.existing_member)})</option>
                        <option value="97_off">$97 Off (-{formatPrice(CUSTOMER_DISCOUNTS['97_off'])})</option>
                      </select>
                    </div>

                    {/* Payment Plan */}
                    <div>
                      <label className="block text-sm font-medium text-[#37322F] mb-3 font-sans">
                        Payment Plan *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentPlan('full')}
                          className={`py-3 px-4 rounded-xl font-medium transition-all font-sans text-sm ${
                            paymentPlan === 'full'
                              ? 'bg-[#37322F] text-white shadow-lg'
                              : 'bg-[#FFFCF5] text-[#37322F] hover:bg-[#F5F2EB] border border-[rgba(55,50,47,0.12)]'
                          }`}
                        >
                          Pay in Full
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentPlan('split_2')}
                          className={`py-3 px-4 rounded-xl font-medium transition-all font-sans text-sm ${
                            paymentPlan === 'split_2'
                              ? 'bg-[#37322F] text-white shadow-lg'
                              : 'bg-[#FFFCF5] text-[#37322F] hover:bg-[#F5F2EB] border border-[rgba(55,50,47,0.12)]'
                          }`}
                        >
                          Split by 2
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentPlan('monthly')}
                          className={`py-3 px-4 rounded-xl font-medium transition-all font-sans text-sm ${
                            paymentPlan === 'monthly'
                              ? 'bg-[#37322F] text-white shadow-lg'
                              : 'bg-[#FFFCF5] text-[#37322F] hover:bg-[#F5F2EB] border border-[rgba(55,50,47,0.12)]'
                          }`}
                        >
                          Monthly
                        </button>
                      </div>
                    </div>

                    {/* 6-Month Commitment */}
                    <div className="flex items-center gap-3 p-4 bg-[#FFFCF5] rounded-xl border border-[rgba(55,50,47,0.12)]">
                      <input
                        type="checkbox"
                        id="sixMonth"
                        checked={sixMonthCommitment}
                        onChange={(e) => setSixMonthCommitment(e.target.checked)}
                        disabled={paymentPlan === 'monthly'}
                        className="w-5 h-5 rounded border-[rgba(55,50,47,0.12)] text-[#37322F] focus:ring-[#37322F] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <label htmlFor="sixMonth" className={`text-sm font-medium flex-1 font-sans ${paymentPlan === 'monthly' ? 'text-[rgba(73,66,61,0.50)]' : 'text-[#37322F]'}`}>
                        6-Month Commitment <span className="text-[#37322F] font-semibold">(Get 10% off + 2 months upfront)</span>
                        {paymentPlan === 'monthly' && <span className="block text-xs text-[rgba(73,66,61,0.50)] mt-1">Not available for monthly plans</span>}
                      </label>
                    </div>

                    {/* Coach Selection */}
                    <div>
                      <label htmlFor="coach" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                        Coach Assignment *
                      </label>
                      <select
                        id="coach"
                        value={coach}
                        onChange={(e) => setCoach(e.target.value as Coach)}
                        className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                      >
                        <option value="Toni">Toni</option>
                        <option value="Charlie">Charlie</option>
                      </select>
                    </div>
                  </div>

                  {/* Price Preview */}
                  <div className="bg-[#FFFCF5] rounded-xl p-6 border border-[rgba(55,50,47,0.12)]">
                    <p className="text-sm font-medium text-[rgba(73,66,61,0.70)] mb-4 font-sans">Price Preview</p>
                    <div className="space-y-2 text-sm font-sans">
                      <div className="flex justify-between">
                        <span className="text-[rgba(73,66,61,0.70)]">Base Price:</span>
                        <span className="font-semibold text-[#37322F]">{formatPrice(calculation.basePrice)}</span>
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
                      <div className="flex justify-between pt-3 border-t border-[rgba(55,50,47,0.12)] text-lg">
                        <span className="font-semibold text-[#37322F]">Total:</span>
                        <span className="font-semibold text-[#37322F]">{formatPrice(calculation.finalPrice)}</span>
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
                    className="w-full py-4 bg-[#37322F] text-white rounded-full font-semibold text-lg font-sans cursor-pointer hover:bg-[#49423D] transition-colors shadow-[0px_2px_4px_rgba(55,50,47,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Checkout Link...
                      </span>
                    ) : (
                      'Create Checkout Link'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 border-b border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[700px] mx-auto px-4">
            <h2 className="text-center text-[#37322F] text-2xl md:text-4xl font-normal font-serif mb-12">
              FAQ for Closers
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden border border-[rgba(55,50,47,0.12)]">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[rgba(55,50,47,0.02)] transition-colors"
                  >
                    <span className="text-[#37322F] text-base font-medium font-sans pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[rgba(73,66,61,0.50)] flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5">
                      <p className="text-[rgba(73,66,61,0.90)] text-sm font-sans leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <FooterSection />
      </main>
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
    </div>
  )
}
