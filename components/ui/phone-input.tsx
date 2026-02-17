'use client'

import * as React from 'react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Country data with dial codes and expected phone lengths (without country code)
// Length can be a single number or [min, max] for variable length
const COUNTRIES = [
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸', length: 10 },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧', length: 10 },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', length: 10 },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', length: 9 },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿', length: [8, 10] },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪', length: [7, 9] },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪', length: [10, 11] },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷', length: 9 },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸', length: 9 },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹', length: 10 },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱', length: 9 },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪', length: [8, 9] },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹', length: 9 },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹', length: [10, 11] },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭', length: 9 },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪', length: [7, 13] },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴', length: 8 },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰', length: 8 },
  { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮', length: [6, 11] },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱', length: 9 },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪', length: 9 },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦', length: 9 },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳', length: 10 },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰', length: 10 },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩', length: 10 },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭', length: 10 },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬', length: 8 },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾', length: [9, 10] },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩', length: [9, 12] },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭', length: 9 },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳', length: 9 },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵', length: 10 },
  { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷', length: [9, 10] },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳', length: 11 },
  { code: 'HK', name: 'Hong Kong', dial: '+852', flag: '🇭🇰', length: 8 },
  { code: 'TW', name: 'Taiwan', dial: '+886', flag: '🇹🇼', length: 9 },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦', length: 9 },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬', length: 10 },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬', length: 10 },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪', length: 9 },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭', length: 9 },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷', length: 11 },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽', length: 10 },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷', length: 10 },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴', length: 10 },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱', length: 9 },
  { code: 'PE', name: 'Peru', dial: '+51', flag: '🇵🇪', length: 9 },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺', length: 10 },
  { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦', length: 9 },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷', length: 10 },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱', length: 9 },
  { code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷', length: 10 },
  { code: 'CZ', name: 'Czech Republic', dial: '+420', flag: '🇨🇿', length: 9 },
  { code: 'HU', name: 'Hungary', dial: '+36', flag: '🇭🇺', length: 9 },
  { code: 'RO', name: 'Romania', dial: '+40', flag: '🇷🇴', length: 9 },
] as const

type Country = typeof COUNTRIES[number]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  onCountryChange?: (countryCode: string) => void
  defaultCountryCode?: string
  disabled?: boolean
  className?: string
  inputClassName?: string
  placeholder?: string
  required?: boolean
  id?: string
  error?: string
}

/**
 * Normalize a phone number by:
 * - Removing the country dial code if user typed it
 * - Removing leading 0 for UK/AU style numbers
 * - Stripping any non-digit characters
 */
function normalizePhoneNumber(input: string, dialCode: string): string {
  // Remove all non-digit characters except + at start
  let cleaned = input.replace(/[^\d+]/g, '')

  // Remove the dial code from the start (with or without +)
  const dialCodeDigits = dialCode.replace('+', '')

  // If starts with +, check for full dial code
  if (cleaned.startsWith('+')) {
    if (cleaned.startsWith(dialCode)) {
      cleaned = cleaned.slice(dialCode.length)
    }
  } else if (cleaned.startsWith(dialCodeDigits)) {
    // Check if it starts with the dial code digits (e.g., "44" for UK)
    cleaned = cleaned.slice(dialCodeDigits.length)
  }

  // Remove leading 0 (UK mobile format: 07xxx -> 7xxx)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1)
  }

  // Only keep digits
  return cleaned.replace(/\D/g, '')
}

/**
 * Validate phone number length for the country
 */
function validatePhoneLength(number: string, country: Country): { valid: boolean; message?: string } {
  const length = country.length
  const numLength = number.length

  if (Array.isArray(length)) {
    const [min, max] = length
    if (numLength < min) {
      return { valid: false, message: `Phone number too short (min ${min} digits)` }
    }
    if (numLength > max) {
      return { valid: false, message: `Phone number too long (max ${max} digits)` }
    }
    return { valid: true }
  } else {
    const expectedLength = length as number
    if (numLength < expectedLength) {
      return { valid: false, message: `Phone number should be ${expectedLength} digits` }
    }
    if (numLength > expectedLength) {
      return { valid: false, message: `Phone number should be ${expectedLength} digits` }
    }
    return { valid: true }
  }
}

/**
 * Format phone number for display
 */
function formatPhoneDisplay(number: string, country: Country): string {
  // Just return the clean number for now - could add formatting per country
  return number
}

/**
 * Get the full E.164 formatted phone number
 */
export function getFullPhoneNumber(number: string, dialCode: string): string {
  if (!number) return ''
  const cleaned = number.replace(/\D/g, '')
  if (!cleaned) return ''
  return `${dialCode}${cleaned}`
}

export function PhoneInput({
  value,
  onChange,
  onCountryChange,
  defaultCountryCode = 'US',
  disabled = false,
  className,
  inputClassName,
  placeholder = 'Phone number',
  required = false,
  id,
  error,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    return COUNTRIES.find(c => c.code === defaultCountryCode) || COUNTRIES[0]
  })
  const [localValue, setLocalValue] = useState(value)
  const [validationError, setValidationError] = useState<string | undefined>()

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update selected country when defaultCountryCode changes
  useEffect(() => {
    const country = COUNTRIES.find(c => c.code === defaultCountryCode)
    if (country && country.code !== selectedCountry.code) {
      setSelectedCountry(country)
      onCountryChange?.(country.code)
    }
  }, [defaultCountryCode])

  // Sync local value with external value
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!search) return COUNTRIES
    const searchLower = search.toLowerCase()
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(searchLower) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(searchLower)
    )
  }, [search])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value
    const normalized = normalizePhoneNumber(rawInput, selectedCountry.dial)

    setLocalValue(normalized)
    onChange(normalized)

    // Validate length
    if (normalized.length > 0) {
      const validation = validatePhoneLength(normalized, selectedCountry)
      setValidationError(validation.valid ? undefined : validation.message)
    } else {
      setValidationError(undefined)
    }
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    onCountryChange?.(country.code)
    setIsOpen(false)
    setSearch('')

    // Re-validate with new country
    if (localValue.length > 0) {
      const validation = validatePhoneLength(localValue, country)
      setValidationError(validation.valid ? undefined : validation.message)
    }

    // Focus input after selecting
    inputRef.current?.focus()
  }

  const displayError = error || validationError

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div className={cn(
        'flex items-stretch rounded-lg border transition-all',
        displayError
          ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-200'
          : 'border-[rgba(55,50,47,0.20)] focus-within:ring-2 focus-within:ring-[#37322F] focus-within:border-transparent',
        disabled && 'opacity-50 cursor-not-allowed'
      )}>
        {/* Country selector button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'flex items-center gap-1.5 px-3 py-3 bg-[#F8F7F5] rounded-l-lg border-r border-[rgba(55,50,47,0.10)]',
            'hover:bg-[#F0EFED] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#37322F]',
            disabled && 'cursor-not-allowed hover:bg-[#F8F7F5]'
          )}
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-sm text-[#49423D] font-medium">{selectedCountry.dial}</span>
          <ChevronDown className={cn(
            'w-4 h-4 text-[#847971] transition-transform',
            isOpen && 'rotate-180'
          )} />
        </button>

        {/* Phone number input */}
        <input
          ref={inputRef}
          type="tel"
          id={id}
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={displayError ? 'true' : undefined}
          aria-describedby={displayError ? `${id || 'phone'}-error` : undefined}
          className={cn(
            'flex-1 px-4 py-3 bg-white rounded-r-lg text-base text-[#37322F]',
            'placeholder:text-[#9A918A]',
            'focus:outline-none',
            disabled && 'cursor-not-allowed',
            inputClassName
          )}
        />
      </div>

      {/* Error message */}
      {displayError && (
        <p
          id={`${id || 'phone'}-error`}
          role="alert"
          className="text-red-500 text-xs mt-1"
        >
          {displayError}
        </p>
      )}

      {/* Country dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[rgba(55,50,47,0.15)] shadow-lg z-50 max-h-64 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-[rgba(55,50,47,0.10)]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full px-3 py-2 text-base bg-[#F8F7F5] rounded-md border border-[rgba(55,50,47,0.10)] focus:outline-none focus:ring-1 focus:ring-[#37322F]"
              autoFocus
            />
          </div>

          {/* Countries list */}
          <div className="overflow-y-auto max-h-48">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left',
                  'hover:bg-[#F8F7F5] transition-colors',
                  selectedCountry.code === country.code && 'bg-[#F8F7F5]'
                )}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="flex-1 text-sm text-[#37322F]">{country.name}</span>
                <span className="text-sm text-[#847971]">{country.dial}</span>
                {selectedCountry.code === country.code && (
                  <Check className="w-4 h-4 text-[#37322F]" />
                )}
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="px-4 py-3 text-sm text-[#847971] text-center">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Export the countries list and helper for external use
export { COUNTRIES, normalizePhoneNumber, validatePhoneLength }
export type { Country }
