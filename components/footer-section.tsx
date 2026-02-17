'use client'

import Link from "next/link"
import { useCurrency } from "@/contexts/CurrencyContext"
import { Currency } from "@/lib/currency"

const CURRENCY_OPTIONS: { code: Currency; label: string; flag: string }[] = [
  { code: 'USD', label: 'USD ($)', flag: '🇺🇸' },
  { code: 'GBP', label: 'GBP (£)', flag: '🇬🇧' },
  { code: 'EUR', label: 'EUR (€)', flag: '🇪🇺' },
  { code: 'AUD', label: 'AUD ($)', flag: '🇦🇺' },
  { code: 'CAD', label: 'CAD ($)', flag: '🇨🇦' },
  { code: 'AED', label: 'AED', flag: '🇦🇪' },
]

function CurrencySelector() {
  const { currency, setCurrency, isLoading } = useCurrency()

  if (isLoading) {
    return <div className="h-9 w-32 bg-[rgba(55,50,47,0.1)] rounded-lg animate-pulse" />
  }

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className="w-auto bg-white border border-[rgba(55,50,47,0.12)] rounded-lg px-3 py-2 text-body text-[#37322F] font-medium cursor-pointer hover:border-[rgba(55,50,47,0.24)] focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all"
      aria-label="Select currency"
    >
      {CURRENCY_OPTIONS.map((option) => (
        <option key={option.code} value={option.code}>
          {option.flag} {option.label}
        </option>
      ))}
    </select>
  )
}

export default function FooterSection() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white border-t border-[#e5e2dc]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-24">
        {/* Top: Logo + description + link columns */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 mb-10">
          {/* Brand */}
          <div className="md:w-5/12">
            <div className="mb-4">
              <img
                src="https://sb.oracleboxing.com/logo/long_dark.webp"
                alt="Oracle Boxing"
                className="h-5 w-auto"
              />
            </div>
            <p className="text-[#605A57] text-sm leading-relaxed mb-6">
              Master old school boxing from home with structured courses, live coaching, and a supportive community.
            </p>
            {/* Currency */}
            <div className="inline-flex flex-col gap-2">
              <div className="text-[rgba(73,66,61,0.50)] text-xs font-medium">Currency</div>
              <CurrencySelector />
            </div>
          </div>

          {/* Link columns */}
          <div className="flex-1 flex flex-wrap gap-10 md:gap-16 md:justify-end">
            {/* Product */}
            <div>
              <h4 className="text-[#37322F] text-xs font-semibold uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><Link href="/#transformations" className="text-[#605A57] hover:text-[#37322F] text-sm transition-colors">Transformations</Link></li>
                <li><Link href="/#whats-included" className="text-[#605A57] hover:text-[#37322F] text-sm transition-colors">What&apos;s Included</Link></li>
                <li><Link href="/#pricing" className="text-[#605A57] hover:text-[#37322F] text-sm transition-colors">Pricing</Link></li>
                <li><Link href="/#faq" className="text-[#605A57] hover:text-[#37322F] text-sm transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[#37322F] text-xs font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><Link href="/terms" className="text-[#605A57] hover:text-[#37322F] text-sm transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-[#605A57] hover:text-[#37322F] text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="text-[#605A57] hover:text-[#37322F] text-sm transition-colors">Refund Policy</Link></li>
              </ul>
            </div>

            {/* Customer */}
            <div>
              <h4 className="text-[#37322F] text-xs font-semibold uppercase tracking-wider mb-4">Customer</h4>
              <ul className="space-y-2.5">
                <li><Link href="/contact" className="text-[#605A57] hover:text-[#37322F] text-sm transition-colors">Contact</Link></li>
                <li><Link href="/customer-portal" className="text-[#605A57] hover:text-[#37322F] text-sm transition-colors">Billing Portal</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social links row */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#e5e2dc] rounded-xl overflow-hidden mb-10">
          <a
            href="https://youtube.com/@oracle_boxing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-5 text-[#37322F] hover:bg-[#f8f6f3] transition-colors border-b md:border-b-0 md:border-r border-[#e5e2dc]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-base font-medium">Youtube</span>
          </a>
          <a
            href="https://instagram.com/oracle.boxing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-5 text-[#37322F] hover:bg-[#f8f6f3] transition-colors border-b md:border-b-0 md:border-r border-[#e5e2dc]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-base font-medium">Instagram</span>
          </a>
          <a
            href="https://tiktok.com/@oracleboxing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-5 text-[#37322F] hover:bg-[#f8f6f3] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
            <span className="text-base font-medium">TikTok</span>
          </a>
        </div>

        {/* Bottom */}
        <div className="text-center space-y-1.5">
          <p className="text-[#9a928d] text-xs">&copy; {currentYear} Oracle Boxing Ltd. All rights reserved.</p>
          <p className="text-[#9a928d] text-[11px]">Unit 5 Artillery 88, Artillery Road, Yeovil, BA22 8RP, United Kingdom</p>
          <p className="text-[#9a928d] text-[11px]">team@oracleboxing.com</p>
        </div>
      </div>
    </footer>
  )
}
