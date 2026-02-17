'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, ShieldCheck, Check, Mail } from 'lucide-react'

export default function ClaimAccessPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/claim-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Something went wrong. Please try again or contact support.')
      }
    } catch (error) {
      alert('Something went wrong. Please try again or contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-[rgba(55,50,47,0.08)] bg-white/80 backdrop-blur-sm flex-shrink-0 z-50">
        <div className="w-full px-4 py-4 flex items-center justify-center">
          <img
            src="https://sb.oracleboxing.com/logo/long_dark.webp"
            alt="Oracle Boxing"
            className="h-4 w-auto"
          />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 xl:px-12 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 h-full">
            {/* Left Column - Form */}
            <div className="order-2 lg:order-1 overflow-y-auto overflow-x-hidden py-8 lg:py-12 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

              {!submitted ? (
                <>
                  {/* Mobile: Info card at top */}
                  <div className="lg:hidden mb-6">
                    <div className="bg-[#37322F] rounded-2xl p-6 text-white">
                      <h3 className="text-title font-medium mb-1">Claim Your Access</h3>
                      <p className="text-white/70 text-body">Enter your email to receive your course invitation</p>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="mb-8">
                    <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                      Your email /
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="w-full px-4 py-4 border border-[rgba(55,50,47,0.20)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all bg-white text-[#37322F] font-sans"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full h-14 px-6 rounded-lg font-medium text-body transition-all duration-200 flex items-center justify-center gap-2 ${
                          loading
                            ? 'bg-[#847971] cursor-not-allowed'
                            : 'bg-[#37322F] hover:bg-[#37322f]/90 cursor-pointer'
                        } text-white`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Claim Access'
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Trust Elements */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-[#605A57] text-body">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Your information is secure</span>
                    </div>

                    <p className="text-center text-[#847971] text-xs">
                      Having trouble?{' '}
                      <Link
                        href="mailto:team@oracleboxing.com"
                        className="text-[#37322F] font-semibold hover:underline"
                      >
                        Contact support
                      </Link>
                    </p>
                  </div>
                </>
              ) : (
                /* Success State */
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-sub font-semibold text-[#37322F] mb-2 text-center">Check your email</h2>
                  <p className="text-[#605A57] text-center max-w-sm mb-8">
                    We&apos;ve sent a course access invitation to your email. It can take up to 10 minutes to arrive.
                  </p>

                  <div className="flex items-center gap-2 text-[#847971] text-body">
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                  </div>

                  <div className="mt-8 pt-8 border-t border-[rgba(55,50,47,0.08)] w-full max-w-sm">
                    <p className="text-body text-[#847971] text-center">
                      Having trouble?{' '}
                      <Link
                        href="mailto:team@oracleboxing.com"
                        className="text-[#37322F] font-semibold hover:underline"
                      >
                        Contact support
                      </Link>{' '}
                      at team@oracleboxing.com
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Info (fixed on desktop) */}
            <div className="order-1 lg:order-2 hidden lg:block py-8 lg:py-12">
              <div className="flex flex-col h-full">
                <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                  Course access /
                </p>

                {/* Info Card */}
                <div className="bg-[#37322F] rounded-2xl p-6 mb-6 text-white">
                  <h3 className="text-title font-medium mb-1">Claim Your Access</h3>
                  <p className="text-white/70 text-body mb-6">Enter your email to receive your course invitation</p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/90 text-body font-medium">Email Invitation</p>
                      <p className="text-white/50 text-xs">Arrives within 10 minutes</p>
                    </div>
                  </div>
                </div>

                {/* How It Works */}
                <div className="mb-6">
                  <h4 className="font-medium text-[#37322F] mb-3">How it works</h4>
                  <div className="space-y-3">
                    {[
                      "Enter the email you used to purchase",
                      "We'll send you a course access invitation",
                      "Click the link in the email to join",
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#37322F] text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-body text-[#605A57] pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer Info */}
                <div className="border-t border-[rgba(55,50,47,0.08)] pt-6">
                  <p className="text-xs font-medium text-[#847971] uppercase tracking-wider mb-4">
                    Need help? /
                  </p>
                  <p className="text-body text-[#605A57]">
                    If you&apos;re having trouble accessing your course, contact us at{' '}
                    <Link href="mailto:team@oracleboxing.com" className="text-[#37322F] font-medium hover:underline">
                      team@oracleboxing.com
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
