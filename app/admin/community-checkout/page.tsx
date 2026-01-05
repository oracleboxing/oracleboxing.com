'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Copy, Check, AlertTriangle, ChevronDown } from 'lucide-react'
import FooterSection from '@/components/footer-section'
import {
  CommunityTier,
  CommunityDiscount,
  calculateCommunityPrice,
  formatPrice,
  getTierDisplayName,
  isDiscountEligible,
  TIER_PRICES,
} from '@/lib/community-pricing'

export default function AdminCommunityCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Form state
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [tier, setTier] = useState<CommunityTier>('monthly')
  const [discount, setDiscount] = useState<CommunityDiscount>('none')

  // Calculate pricing whenever selections change
  const calculation = calculateCommunityPrice(tier, discount)

  // Check if current discount is eligible
  const discountEligible = isDiscountEligible(tier, discount)

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

  const faqs = [
    {
      question: "Membership Tiers",
      answer: `⚠️ ALL memberships are subscriptions that renew automatically. Direct customers to the billing portal at checkout.oracleboxing.com/p/login/dR69Bm6Pg7Csavm288 to manage their subscription or cancel.

Monthly: ${formatPrice(TIER_PRICES.monthly)}/month - Renews monthly

3-Month: ${formatPrice(TIER_PRICES['3_month'])} - Renews every 3 months

6-Month: ${formatPrice(TIER_PRICES['6_month'])} - Renews every 6 months

Annual: ${formatPrice(TIER_PRICES.annual)} - Renews yearly

24-Month: ${formatPrice(TIER_PRICES['24_month'])} - Renews every 24 months`
    },
    {
      question: "Discount Codes",
      answer: `Challenge Winner ($147 off): Available for 6-Month, Annual, and 24-Month tiers. Can be applied to 3-Month but NOT ADVISED.

First 4 Months ($49.25/mo × 4): Only available for Monthly subscription - gives $49.25 off per month for the first 4 months.`
    },
    {
      question: "Payment Methods",
      answer: `PayPal: Customers need to select "Pay with USD" option when checking out.

Klarna: Only available for GBP, EUR, and certain other currencies - NOT available for USD.

Apple Pay / Google Pay: Automatically appears on supported devices.`
    },
    {
      question: "Billing & Subscription Management",
      answer: `Automatic Tax: Tax is calculated automatically based on customer location and added to the total.

All Subscriptions: All memberships auto-renew at their respective intervals (monthly, 3-month, 6-month, annual, or 24-month).

Billing Portal: Customers can manage their subscription, update payment methods, or cancel at checkout.oracleboxing.com/p/login/dR69Bm6Pg7Csavm288

Renewal Date: Subscriptions renew on the same day of their billing cycle.`
    },
    {
      question: "Sales Recommendations & Pricing Comparisons",
      answer: `Best Value: Annual membership at ${formatPrice(TIER_PRICES.annual - 147)} with Challenge Winner discount (${formatPrice((TIER_PRICES.annual - 147) / 12)}/mo equivalent)

Avoid: Don't apply Challenge Winner discount to 3-Month tier - better to upsell to 6-Month or Annual.

6-Month vs Annual (Common Misconception): Many think buying 6-Month twice is cheaper than Annual. Reality: 6-Month × 2 = ${formatPrice(TIER_PRICES['6_month'] * 2)} vs Annual with discount = ${formatPrice(TIER_PRICES.annual - 147)}. Annual saves ${formatPrice((TIER_PRICES['6_month'] * 2) - (TIER_PRICES.annual - 147))}!

Savings Breakdown: 3-Month (${formatPrice(TIER_PRICES['3_month'] / 3)}/mo) → 6-Month (${formatPrice(TIER_PRICES['6_month'] / 6)}/mo) → Annual with discount (${formatPrice((TIER_PRICES.annual - 147) / 12)}/mo) - Longer commitment = better value`
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
                Internal Community Checkout
              </h1>
              <p className="max-w-[700px] text-center text-[#37322f]/80 text-lg md:text-xl font-medium leading-7 font-sans">
                Create custom checkout links for community memberships
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
                  <p className="text-sm font-medium text-[#37322F] mb-3 font-sans">Membership Details:</p>
                  <div className="space-y-2 text-sm text-[rgba(73,66,61,0.70)] font-sans">
                    <div className="flex justify-between">
                      <span>Membership:</span>
                      <span className="font-semibold text-[#37322F]">{getTierDisplayName(calculation.tier)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span className="font-semibold text-[#37322F]">{formatPrice(calculation.basePrice)}</span>
                    </div>
                    {calculation.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="font-semibold text-[#37322F]">-{formatPrice(calculation.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-[rgba(55,50,47,0.12)]">
                      <span className="font-semibold text-[#37322F]">Final Price:</span>
                      <span className="font-semibold text-lg text-[#37322F]">{formatPrice(calculation.finalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Equivalent:</span>
                      <span className="font-semibold text-[#37322F]">{formatPrice(calculation.monthlyEquivalent)}/mo</span>
                    </div>
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

                  {/* Membership Configuration */}
                  <div className="space-y-4 pt-6 border-t border-[rgba(55,50,47,0.08)]">
                    <h2 className="text-[#37322F] text-xl font-normal font-serif">Membership Configuration</h2>

                    {/* Tier Selection */}
                    <div>
                      <label htmlFor="tier" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
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
                        className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
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
                      <label htmlFor="discount" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                        Discount Code
                      </label>
                      <select
                        id="discount"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value as CommunityDiscount)}
                        className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                      >
                        <option value="none">No Discount</option>
                        <option value="challenge_winner" disabled={!isDiscountEligible(tier, 'challenge_winner')}>
                          Challenge Winner (-$147) {!isDiscountEligible(tier, 'challenge_winner') && '(Not available)'}
                        </option>
                        <option value="first_4_months" disabled={!isDiscountEligible(tier, 'first_4_months')}>
                          First 4 Months (-$49.25/mo × 4) {!isDiscountEligible(tier, 'first_4_months') && '(Not available)'}
                        </option>
                      </select>

                      {/* Warning for 3-month + challenge winner */}
                      {discount === 'challenge_winner' && tier === '3_month' && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-amber-800 font-sans">
                            <strong>Warning:</strong> Applying the Challenge Winner discount to the 3-Month membership is not advised.
                            Consider recommending the 6-Month, Annual, or 24-Month plan instead for better value.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Preview */}
                  <div className="bg-[#FFFCF5] rounded-xl p-6 border border-[rgba(55,50,47,0.12)]">
                    <p className="text-sm font-medium text-[rgba(73,66,61,0.70)] mb-4 font-sans">Price Preview</p>
                    <div className="space-y-2 text-sm font-sans">
                      <div className="flex justify-between">
                        <span className="text-[rgba(73,66,61,0.70)]">Membership:</span>
                        <span className="font-semibold text-[#37322F]">{getTierDisplayName(tier)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgba(73,66,61,0.70)]">Base Price:</span>
                        <span className="font-semibold text-[#37322F]">{formatPrice(calculation.basePrice)}</span>
                      </div>
                      {calculation.discountAmount > 0 && (
                        <div className="flex justify-between text-green-700">
                          <span>Discount:</span>
                          <span className="font-semibold">-{formatPrice(calculation.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-3 border-t border-[rgba(55,50,47,0.12)] text-lg">
                        <span className="font-semibold text-[#37322F]">Final Price:</span>
                        <span className="font-semibold text-[#37322F]">{formatPrice(calculation.finalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-[rgba(73,66,61,0.70)] pt-2">
                        <span>Monthly Equivalent:</span>
                        <span className="font-semibold text-[#37322F]">{formatPrice(calculation.monthlyEquivalent)}/mo</span>
                      </div>
                      <div className="flex justify-between text-[rgba(73,66,61,0.70)]">
                        <span>Total Duration:</span>
                        <span className="font-semibold text-[#37322F]">{calculation.totalMonths} {calculation.totalMonths === 1 ? 'month' : 'months'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !discountEligible}
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
