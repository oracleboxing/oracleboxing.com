'use client'

import Link from "next/link"
import { useCurrency } from "@/contexts/CurrencyContext"
import { Currency, CURRENCIES } from "@/lib/currency"

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
    return (
      <div className="h-9 w-32 bg-[rgba(55,50,47,0.1)] rounded-lg animate-pulse" />
    )
  }

  const currentOption = CURRENCY_OPTIONS.find(opt => opt.code === currency) || CURRENCY_OPTIONS[0]

  return (
    <div className="relative">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="appearance-none bg-white border border-[rgba(55,50,47,0.12)] rounded-lg px-3 py-2 pr-8 text-sm text-[#37322F] font-medium cursor-pointer hover:border-[rgba(55,50,47,0.24)] focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all"
        aria-label="Select currency"
      >
        {CURRENCY_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.flag} {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-[#49423D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

export default function FooterSection() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="w-full pt-10 flex flex-col justify-start items-start">
      {/* Main Footer Content */}
      <div className="self-stretch h-auto flex flex-col md:flex-row justify-between items-stretch pr-0 pb-8 pt-0">
        <div className="h-auto p-4 md:p-8 flex flex-col justify-center items-center md:justify-start md:items-start gap-6">
          {/* Brand Section */}
          <div className="self-stretch flex justify-center md:justify-start items-center gap-3">
            <img
              src="https://sb.oracleboxing.com/logo/long_dark.webp"
              alt="Oracle Boxing"
              className="h-5 w-auto"
            />
          </div>
          <div className="text-[rgba(73,66,61,0.90)] text-sm font-medium leading-[18px] font-sans max-w-[280px] text-center md:text-left">
            Learn Better Boxing
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center md:justify-start items-start gap-4">
            {/* YouTube Icon */}
            <a
              href="https://youtube.com/@oracle_boxing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 relative overflow-hidden hover:opacity-70 transition-opacity"
            >
              <div className="w-6 h-6 left-0 top-0 absolute flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    fill="#49423D"
                  />
                </svg>
              </div>
            </a>

            {/* Instagram Icon */}
            <a
              href="https://instagram.com/oracle.boxing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 relative overflow-hidden hover:opacity-70 transition-opacity"
            >
              <div className="w-6 h-6 left-0 top-0 absolute flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    fill="#49423D"
                  />
                </svg>
              </div>
            </a>

            {/* TikTok Icon */}
            <a
              href="https://tiktok.com/@oracleboxing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 relative overflow-hidden hover:opacity-70 transition-opacity"
            >
              <div className="w-6 h-6 left-0 top-0 absolute flex items-center justify-center">
                <svg width="14" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                    fill="#49423D"
                  />
                </svg>
              </div>
            </a>
          </div>

          {/* Currency Selector */}
          <div className="flex flex-col gap-2">
            <div className="text-[rgba(73,66,61,0.50)] text-xs font-medium leading-5 font-sans">Currency</div>
            <CurrencySelector />
          </div>
        </div>

        {/* Legal Links */}
        <div className="self-stretch p-4 md:p-8 flex flex-col sm:flex-row flex-wrap justify-center md:justify-end items-center md:items-start gap-6 md:gap-8">
          <div className="flex flex-col justify-start items-center md:items-start gap-3 min-w-[120px]">
            <div className="text-[rgba(73,66,61,0.50)] text-sm font-medium leading-5 font-sans">Legal</div>
            <div className="flex flex-col justify-end items-center md:items-start gap-2">
              <Link
                href="/terms"
                className="text-[#49423D] text-sm font-normal leading-5 font-sans cursor-pointer hover:text-[#37322F] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-[#49423D] text-sm font-normal leading-5 font-sans cursor-pointer hover:text-[#37322F] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund"
                className="text-[#49423D] text-sm font-normal leading-5 font-sans cursor-pointer hover:text-[#37322F] transition-colors"
              >
                Refund Policy
              </Link>
              <Link
                href="/contact"
                className="text-[#49423D] text-sm font-normal leading-5 font-sans cursor-pointer hover:text-[#37322F] transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with Pattern */}
      <div className="self-stretch h-12 relative overflow-hidden border-t border-b border-[rgba(55,50,47,0.12)]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 400 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[300px] h-16 border border-[rgba(3,7,18,0.08)]"
                style={{
                  left: `${i * 300 - 600}px`,
                  top: "-120px",
                  transform: "rotate(-45deg)",
                  transformOrigin: "top left",
                }}
              />
            ))}
          </div>
        </div>

        {/* Copyright text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[rgba(73,66,61,0.50)] text-xs font-medium font-sans">
            © {currentYear} Oracle Boxing. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
