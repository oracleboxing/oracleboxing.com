'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatPrice, getProductPrice, Currency } from '@/lib/currency';

interface CoachingUpsellProps {
  normalPrice: number;
  discountedPrice: number;
  onAccept: () => void;
  onDecline: () => void;
  isLoading?: boolean;
  purchaseCurrency?: string; // The currency of the original purchase (e.g., 'USD', 'GBP', 'EUR')
}

export const CoachingUpsell: React.FC<CoachingUpsellProps> = ({
  normalPrice,
  discountedPrice,
  onAccept,
  onDecline,
  isLoading = false,
  purchaseCurrency,
}) => {
  const { currency } = useCurrency();

  // Use the purchase currency if provided, otherwise fall back to user's currency preference
  // This ensures the displayed price matches what will actually be charged
  const chargeCurrency = (purchaseCurrency?.toUpperCase() || currency) as Currency;

  // Get the currency-converted prices using the charge currency
  const displayPrice = getProductPrice('coach1', chargeCurrency) || discountedPrice;

  // Regular price for 3 months coaching (USD base)
  const regularPrice = 1500;

  const savings = regularPrice - displayPrice;

  const displayCurrency = chargeCurrency;

  return (
    <div className="h-full flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-6 sm:py-8 lg:py-12 bg-gray-50 border-l border-gray-200 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto lg:justify-start">
      <div className="max-w-xl mx-auto w-full lg:my-0">
        {/* Next Step Notice - Desktop Only */}
        <div className="hidden lg:block bg-white p-4 sm:p-5 lg:p-6 mb-5 sm:mb-6 lg:mb-8 rounded-lg border border-gray-200">
          <p className="text-title text-black leading-relaxed">
            <strong>Next Step:</strong> Read the information below and then click one of the buttons to continue to the next page.
          </p>
        </div>

        {/* Exclusive Offer Badge */}
        <div className="flex justify-center mb-4 sm:mb-5 lg:mb-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#000000] text-white rounded text-body font-bold uppercase tracking-wide animate-bounce">
            Exclusive Offer
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-5 sm:mb-6 lg:mb-8">
          <h2 className="text-hero font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight">
            Get 1-on-1 Coaching for 1 Month at an Exclusive Discount
          </h2>
          <p className="text-sub text-gray-600 font-medium">
            Want to learn faster? Get personal help from a coach!
          </p>
        </div>

        {/* Offer Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-5 sm:mb-6 lg:mb-8 shadow-sm">
          {/* What You Get */}
          <div className="mb-5 sm:mb-6 lg:mb-8">
            <h3 className="text-sub font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6">What You Get:</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" strokeWidth={3} />
                </div>
                <p className="text-body font-semibold text-gray-900">4 Weekly Video Calls with Your Coach</p>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" strokeWidth={3} />
                </div>
                <p className="text-body font-semibold text-gray-900">A Training Plan Made Just for You</p>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" strokeWidth={3} />
                </div>
                <p className="text-body font-semibold text-gray-900">Fast Help Anytime on WhatsApp</p>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" strokeWidth={3} />
                </div>
                <p className="text-body font-semibold text-gray-900">Your Coach Watches Your Videos and Helps You Improve</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 mb-4 sm:mb-5 lg:mb-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <span className="text-body text-gray-600 font-medium">Regular Price (3 Months):</span>
              <span className="text-title text-gray-400 line-through font-semibold">
                {formatPrice(regularPrice, displayCurrency)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 gap-2">
              <span className="text-title text-gray-900 font-bold">Today's Price (1 Month):</span>
              <span className="text-section font-bold text-gray-900">
                {formatPrice(displayPrice, displayCurrency)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-700 font-semibold text-body">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              Save {formatPrice(savings, displayCurrency)} Today
            </div>
          </div>

          {/* Urgency Notice */}
          <div className="p-3 sm:p-4 mb-4 sm:mb-5 lg:mb-6">
            <p className="text-body text-gray-900 font-medium text-center">
              This is your only chance to try coaching for just 1 month. Usually, you have to buy 3 months at once. This special deal is only on this page!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={onAccept}
              disabled={isLoading}
              className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#000000] hover:bg-[#1a1a1a] cursor-pointer'
              } text-white flex flex-col items-center gap-1`}
            >
              <span className="text-title font-bold">
                {isLoading ? 'Processing...' : 'Yes! Add 1-on-1 Coaching'}
              </span>
              {!isLoading && (
                <span className="text-xs font-normal">
                  You will be charged {formatPrice(displayPrice, displayCurrency)}
                </span>
              )}
            </button>

            <button
              onClick={onDecline}
              disabled={isLoading}
              className="w-full py-2 sm:py-3 px-4 sm:px-6 text-body font-medium text-black hover:text-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              No thanks, I'll pass on this exclusive offer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
