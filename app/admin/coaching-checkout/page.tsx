'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Copy, Check, ChevronDown } from 'lucide-react'
import {
  CoachingTier,
  CustomerDiscount,
  PaymentPlan,
  Coach,
  calculateCoachingPrice,
  formatPrice,
  TIER_PRICES_BY_COACH,
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

  // Get coach-specific tier prices
  const coachTierPrices = TIER_PRICES_BY_COACH[coach]

  // Calculate pricing whenever selections change (coach-aware)
  const calculation = calculateCoachingPrice(tier, customerDiscount, sixMonthCommitment, paymentPlan, coach)

  // Reset discounts and 6-month when monthly is selected
  useEffect(() => {
    if (paymentPlan === 'monthly') {
      if (customerDiscount !== 'none') {
        setCustomerDiscount('none')
      }
      if (sixMonthCommitment) {
        setSixMonthCommitment(false)
      }
    }
  }, [paymentPlan, customerDiscount, sixMonthCommitment])

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

  // Button style helper for coach buttons
  const btnClass = (isActive: boolean) =>
    `py-3 px-4 rounded-lg font-medium transition-all font-sans text-body ${
      isActive
        ? 'bg-[#37322F] text-white'
        : 'bg-gray-100 text-[#37322F] hover:bg-gray-200'
    }`

  // Select dropdown styles
  const selectClass = "w-full h-12 px-4 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] bg-white text-[#37322F] font-sans text-body appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <h1 className="text-title font-semibold text-[#37322F] font-sans">Admin</h1>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {checkoutUrl ? (
          // Success State
          <div className="space-y-6">
            <div>
              <h2 className="text-[#37322F] text-title font-semibold font-sans mb-1">Link Created</h2>
              <p className="text-gray-500 text-body font-sans">Share with {name}</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={checkoutUrl}
                readOnly
                className="flex-1 h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg text-body font-mono text-[#37322F]"
              />
              <button
                onClick={() => window.open(checkoutUrl, '_blank')}
                className="h-12 px-5 bg-gray-100 text-[#37322F] rounded-lg hover:bg-gray-200 transition-colors font-sans font-medium text-body"
              >
                Open
              </button>
              <button
                onClick={copyToClipboard}
                className="h-12 px-5 bg-[#37322F] text-white rounded-lg hover:bg-[#49423D] transition-colors flex items-center gap-2 font-sans font-medium text-body"
              >
                {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
            </div>

            <div className="flex items-center gap-6 text-body font-sans py-3 border-y border-gray-100">
              <span className="text-gray-500">
                {tier === 'tier_1' ? 'Tier 1' : 'Tier 2'} • {coach}
              </span>
              {calculation.customerDiscount > 0 && (
                <span className="text-green-600">-{formatPrice(calculation.customerDiscount)} discount</span>
              )}
              {calculation.sixMonthDiscount > 0 && (
                <span className="text-green-600">-{formatPrice(calculation.sixMonthDiscount)} (10% off)</span>
              )}
              <span className="font-semibold text-[#37322F] ml-auto text-body">
                {formatPrice(calculation.finalPrice)}
                {calculation.monthlyAmount && <span className="text-gray-400 font-normal text-body ml-2">({formatPrice(calculation.monthlyAmount)}/payment)</span>}
              </span>
            </div>

            <button
              onClick={resetForm}
              className="text-body text-gray-500 hover:text-[#37322F] font-sans underline"
            >
              Create another link
            </button>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] bg-white text-[#37322F] font-sans text-body"
                  placeholder="customer@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] bg-white text-[#37322F] font-sans text-body"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Coach</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCoach('Toni')}
                    className={btnClass(coach === 'Toni')}
                  >
                    Toni
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoach('Charlie')}
                    className={btnClass(coach === 'Charlie')}
                  >
                    Charlie
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Plan Options */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Tier</label>
                <div className="relative">
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as CoachingTier)}
                    className={selectClass}
                  >
                    <option value="tier_1">Tier 1 — {formatPrice(coachTierPrices.tier_1)}</option>
                    <option value="tier_2">Tier 2 — {formatPrice(coachTierPrices.tier_2)}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Payment</label>
                <div className="relative">
                  <select
                    value={paymentPlan}
                    onChange={(e) => setPaymentPlan(e.target.value as PaymentPlan)}
                    className={selectClass}
                  >
                    <option value="full">Pay in Full</option>
                    <option value="split_2">Split by 2</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">6-Month</label>
                <div className="relative">
                  <select
                    value={sixMonthCommitment ? 'yes' : 'no'}
                    onChange={(e) => setSixMonthCommitment(e.target.value === 'yes')}
                    disabled={paymentPlan === 'monthly'}
                    className={selectClass}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes — 10% off</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-body font-medium text-[#37322F] mb-1.5 font-sans">Discount</label>
                <div className="relative">
                  <select
                    value={customerDiscount}
                    onChange={(e) => setCustomerDiscount(e.target.value as CustomerDiscount)}
                    disabled={paymentPlan === 'monthly'}
                    className={selectClass}
                  >
                    <option value="none">None</option>
                    <option value="challenge_winner">Challenge Winner (-{formatPrice(CUSTOMER_DISCOUNTS.challenge_winner)})</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Order Summary Preview - matches customer checkout page */}
            <div className="border-t border-[rgba(55,50,47,0.08)] pt-6 mt-6">
              <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4 text-center">
                Order preview /
              </p>

              {/* Centered container matching checkout page width */}
              <div className="max-w-md mx-auto">
              {/* Gold card preview with animated ribbons */}
              <div className="gold-card rounded-2xl p-6 mb-6 relative overflow-hidden">
                {/* Animated flowing ribbons background */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="ribbon-gold ribbon-gold-1" />
                  <div className="ribbon-gold ribbon-gold-2" />
                  <div className="ribbon-gold ribbon-gold-3" />
                </div>

                <div className="relative">
                  <h3 className="text-title font-medium mb-1 text-[#1a1611]">1-on-1 Coaching</h3>
                  <p className="text-[#5c4a36] text-body mb-6">
                    {tier === 'tier_1' ? 'Tier 1' : 'Tier 2'} with {coach}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-section font-bold text-[#1a1611]">
                        {paymentPlan === 'monthly'
                          ? formatPrice(calculation.monthlyAmount || 0)
                          : paymentPlan === 'split_2'
                          ? formatPrice(calculation.monthlyAmount || 0)
                          : formatPrice(calculation.finalPrice)
                        }
                      </span>
                      <p className="text-[#5c4a36] text-xs mt-1">
                        {paymentPlan === 'split_2'
                          ? 'payment 1 of 2'
                          : paymentPlan === 'monthly'
                          ? 'per month'
                          : 'one time'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer info preview */}
              {(name || email) && (
                <div className="mb-6">
                  <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-2">Purchasing for /</p>
                  <p className="text-[#37322F] font-medium">{name || 'Customer Name'}</p>
                  <p className="text-[#605A57] text-body">{email || 'customer@email.com'}</p>
                </div>
              )}

              {/* Order breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-body">
                  <span className="text-[#605A57]">
                    {paymentPlan === 'split_2'
                      ? `1-on-1 Coaching (Payment 1 of 2)`
                      : paymentPlan === 'monthly'
                      ? `1-on-1 Coaching (${tier === 'tier_1' ? 'Tier 1' : 'Tier 2'}) - Monthly`
                      : `1-on-1 Coaching (${tier === 'tier_1' ? 'Tier 1' : 'Tier 2'})`
                    }
                  </span>
                  <span className="text-[#37322F] font-medium">
                    {paymentPlan === 'monthly'
                      ? <>{formatPrice(calculation.monthlyAmount || 0)}<span className="text-[#847971] font-normal">/mo</span></>
                      : paymentPlan === 'split_2'
                      ? formatPrice(calculation.monthlyAmount || 0)
                      : formatPrice(calculation.finalPrice)
                    }
                  </span>
                </div>

                {paymentPlan === 'split_2' && (
                  <div className="flex justify-between text-body">
                    <span className="text-[#847971]">Payment 2 (in 30 days)</span>
                    <span className="text-[#847971]">{formatPrice(calculation.monthlyAmount || 0)}</span>
                  </div>
                )}

                {paymentPlan === 'monthly' && (
                  <div className="flex justify-between text-body">
                    <span className="text-[#847971]">Recurring monthly (cancel anytime)</span>
                  </div>
                )}

                {/* Show discounts applied */}
                {calculation.customerDiscount > 0 && (
                  <div className="flex justify-between text-body">
                    <span className="text-green-600">Challenge Winner Discount</span>
                    <span className="text-green-600">-{formatPrice(calculation.customerDiscount)}</span>
                  </div>
                )}
                {calculation.sixMonthDiscount > 0 && (
                  <div className="flex justify-between text-body">
                    <span className="text-green-600">6-Month Commitment (10% off)</span>
                    <span className="text-green-600">-{formatPrice(calculation.sixMonthDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[rgba(55,50,47,0.08)] mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-[#37322F] font-medium">
                    {paymentPlan === 'monthly' ? 'First payment' : paymentPlan === 'split_2' ? 'Due today' : 'Total'}
                  </span>
                  <span className="text-[#37322F] font-bold text-title">
                    {paymentPlan === 'monthly' || paymentPlan === 'split_2'
                      ? formatPrice(calculation.monthlyAmount || 0)
                      : formatPrice(calculation.finalPrice)
                    }
                  </span>
                </div>
                {paymentPlan !== 'monthly' && paymentPlan !== 'split_2' && calculation.finalPrice !== calculation.basePrice && (
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-[#847971]">Original price</span>
                    <span className="text-[#847971] line-through">{formatPrice(calculation.basePrice)}</span>
                  </div>
                )}
              </div>

              {/* Submit Button - inside centered container */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 px-8 bg-[#37322F] text-white rounded-lg font-semibold text-body font-sans cursor-pointer hover:bg-[#49423D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create Link'
                  )}
                </button>
              </div>
              </div>{/* End centered container */}
            </div>
          </form>
        )}
      </div>

      <style jsx global>{`
        /* Metallic gold card */
        .gold-card {
          background: linear-gradient(
            135deg,
            #f5e6c8 0%,
            #e8d48b 15%,
            #fff8dc 35%,
            #e8d48b 50%,
            #d4c47a 65%,
            #fff8dc 80%,
            #e8d48b 100%
          );
          box-shadow:
            0 4px 20px rgba(212, 175, 55, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
        }
        /* Gold ribbons */
        .ribbon-gold {
          position: absolute;
          width: 200%;
          height: 80px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.25) 20%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0.25) 80%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(15px);
        }
        .ribbon-gold-1 {
          top: 10%;
          left: -50%;
          transform: rotate(-15deg);
          animation: driftGold1 8s ease-in-out infinite;
        }
        .ribbon-gold-2 {
          top: 40%;
          left: -30%;
          height: 100px;
          transform: rotate(10deg);
          animation: driftGold2 10s ease-in-out infinite;
          animation-delay: -2s;
        }
        .ribbon-gold-3 {
          top: 70%;
          left: -40%;
          height: 60px;
          transform: rotate(-8deg);
          animation: driftGold3 7s ease-in-out infinite;
          animation-delay: -4s;
        }
        @keyframes driftGold1 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-15deg);
            opacity: 0.6;
          }
          50% {
            transform: translateX(80%) translateY(10px) rotate(-10deg);
            opacity: 0.9;
          }
        }
        @keyframes driftGold2 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(10deg);
            opacity: 0.5;
          }
          50% {
            transform: translateX(70%) translateY(-15px) rotate(15deg);
            opacity: 0.85;
          }
        }
        @keyframes driftGold3 {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(-8deg);
            opacity: 0.55;
          }
          50% {
            transform: translateX(75%) translateY(8px) rotate(-5deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
