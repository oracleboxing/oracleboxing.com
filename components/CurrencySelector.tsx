'use client';

import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Currency, CURRENCIES } from '@/lib/currency';

const CURRENCY_ORDER: Currency[] = ['USD', 'GBP', 'EUR', 'AUD', 'CAD', 'AED'];

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, isLoading } = useCurrency();

  if (isLoading) {
    return (
      <div className="flex gap-1 bg-neutral-900/50 rounded-lg p-1">
        <div className="h-8 w-16 bg-neutral-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex gap-1 bg-neutral-900/50 rounded-lg p-1">
      {CURRENCY_ORDER.map((curr) => {
        const isActive = currency === curr;
        return (
          <button
            key={curr}
            onClick={() => setCurrency(curr)}
            className={`
              px-3 py-1.5 text-body font-medium rounded-md transition-all duration-200
              ${
                isActive
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }
            `}
            aria-label={`Switch to ${CURRENCIES[curr].name}`}
          >
            {curr}
          </button>
        );
      })}
    </div>
  );
};
