export type Currency = 'USD' | 'GBP' | 'EUR' | 'AUD' | 'CAD' | 'AED';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
};

// Country code to currency mapping for location detection
export const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
  US: 'USD',
  GB: 'GBP',
  UK: 'GBP',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  IE: 'EUR',
  PT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  AU: 'AUD',
  CA: 'CAD',
  AE: 'AED',
};

// Product pricing matrix (from product_upsell_matrix.md)
export const PRODUCT_PRICES: Record<string, Record<Currency, number>> = {
  '6wc': { USD: 197, GBP: 157, EUR: 182, AUD: 297, CAD: 267, AED: 725 },
  rcv: { USD: 67, GBP: 53, EUR: 62, AUD: 100, CAD: 91, AED: 245 },
  ltbffp: { USD: 147, GBP: 117, EUR: 136, AUD: 220, CAD: 199, AED: 540 },
  ltbrdmp: { USD: 97, GBP: 77, EUR: 90, AUD: 145, CAD: 132, AED: 355 },
  bffp: { USD: 247, GBP: 197, EUR: 227, AUD: 370, CAD: 335, AED: 910 },
  brdmp: { USD: 147, GBP: 117, EUR: 136, AUD: 220, CAD: 199, AED: 540 },
  clnc: { USD: 97, GBP: 77, EUR: 90, AUD: 145, CAD: 132, AED: 355 },
  obm: { USD: 397, GBP: 317, EUR: 365, AUD: 595, CAD: 538, AED: 1465 },
  '6wm': { USD: 97, GBP: 77, EUR: 90, AUD: 145, CAD: 132, AED: 355 },
  coach1: { USD: 397, GBP: 317, EUR: 365, AUD: 595, CAD: 538, AED: 1465 },
  coach3: { USD: 1500, GBP: 1197, EUR: 1380, AUD: 2247, CAD: 2033, AED: 5532 },
  coach_archive: { USD: 67, GBP: 54, EUR: 62, AUD: 100, CAD: 90, AED: 250 },
  // Membership pricing (using same exchange rates as other products)
  memq: { USD: 297, GBP: 237, EUR: 274, AUD: 448, CAD: 403, AED: 1093 },
  mem6: { USD: 497, GBP: 396, EUR: 459, AUD: 749, CAD: 674, AED: 1829 },
  mema: { USD: 897, GBP: 715, EUR: 828, AUD: 1352, CAD: 1215, AED: 3301 },
  // Monthly billing option (post-purchase switch)
  mem_monthly: { USD: 97, GBP: 77, EUR: 90, AUD: 146, CAD: 131, AED: 357 },
  // Black Friday Challenge products
  bfc: { USD: 97, GBP: 78, EUR: 89, AUD: 146, CAD: 132, AED: 358 },
  bfc_vip: { USD: 497, GBP: 397, EUR: 457, AUD: 745, CAD: 674, AED: 1834 },
  // Tracksuit
  tracksuit: { USD: 187, GBP: 149, EUR: 174, CAD: 254, AUD: 280, AED: 687 },
  // 21-Day Challenge products
  '21dc_entry': { USD: 147, GBP: 117, EUR: 136, AUD: 220, CAD: 199, AED: 540 },
  '21dc_premium': { USD: 297, GBP: 237, EUR: 273, AUD: 445, CAD: 403, AED: 1095 },
  '21dc_vip': { USD: 497, GBP: 397, EUR: 457, AUD: 745, CAD: 674, AED: 1834 },
};

// Membership products - now support multi-currency
export const MEMBERSHIP_PRODUCTS = ['memq', 'mem6', 'mema', 'ltall_297', 'ltall_197'];

export const isMembershipProduct = (metadata?: string): boolean => {
  if (!metadata) return false;
  // Only ltall products remain USD-only
  return metadata === 'ltall_297' || metadata === 'ltall_197';
};

export const formatPrice = (
  amount: number,
  currency: Currency,
  hideSymbol: boolean = false
): string => {
  const config = CURRENCIES[currency];
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (hideSymbol) {
    return formattedAmount;
  }

  // For AED, put symbol after number
  if (currency === 'AED') {
    return `${config.symbol} ${formattedAmount}`;
  }

  return `${config.symbol}${formattedAmount}`;
};

export const getProductPrice = (metadata?: string, currency: Currency = 'USD'): number | null => {
  // Return null if no metadata provided
  if (!metadata) {
    return null;
  }

  // Membership products are always USD only
  if (isMembershipProduct(metadata)) {
    return null;
  }

  const prices = PRODUCT_PRICES[metadata];
  if (!prices) {
    console.warn(`No pricing found for product metadata: ${metadata}`);
    return null;
  }

  return prices[currency] || prices.USD;
};

export const detectCurrencyFromCountry = (countryCode: string): Currency => {
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || 'USD';
};

// Detect user location and return currency
export const detectUserCurrency = async (): Promise<Currency> => {
  try {
    // Use our server-side API route to avoid CORS issues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch('/api/detect-location', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('Location detection API returned error');

    const data = await response.json();
    const countryCode = data.country_code;

    if (!countryCode) {
      console.warn('No country code in response');
      return 'USD';
    }

    console.log('Currency detected from location:', countryCode);
    return detectCurrencyFromCountry(countryCode);
  } catch (error) {
    // Silently fall back to USD - this is expected behavior when API fails
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Currency detection timed out, using USD');
    } else {
      console.log('Currency detection unavailable, using USD');
    }
    return 'USD'; // Default to USD on error
  }
};

// Get Stripe price ID for a product in a specific currency
export const getStripePriceId = (
  product: any,
  currency: Currency
): string => {
  // If product has multi-currency price IDs, use them
  if (product.price_ids) {
    // Check for currency-specific price ID first (e.g., usd, gbp, eur)
    const currencyKey = currency.toLowerCase() as Lowercase<Currency>;
    const specificPriceId = product.price_ids[currencyKey];
    if (specificPriceId) {
      return specificPriceId;
    }

    // Use multicurrency price ID if available (works for all currencies)
    const multicurrencyPriceId = product.price_ids.multicurrency;
    if (multicurrencyPriceId) {
      return multicurrencyPriceId;
    }
  }

  // Fallback to default price ID (should work for all currencies if it's a multicurrency price)
  return product.stripe_price_id;
};

// Helper to format product descriptions with currency-aware prices
export const formatProductDescription = (
  productId: string,
  description: string,
  currency: Currency
): string => {
  // Map of price replacements by product
  const priceReplacements: Record<string, Array<{find: RegExp, getReplacement: () => string}>> = {
    'bundle': [
      { find: /\$297/g, getReplacement: () => formatPrice(getProductPrice('bffp', currency) || 297, currency) },
      { find: /\$147/g, getReplacement: () => formatPrice(getProductPrice('brdmp', currency) || 147, currency) },
      { find: /\$444/g, getReplacement: () => formatPrice((getProductPrice('bffp', currency) || 297) + (getProductPrice('brdmp', currency) || 147), currency) },
      { find: /\$397/g, getReplacement: () => formatPrice(getProductPrice('obm', currency) || 397, currency) },
      { find: /\$47/g, getReplacement: () => {
        const total = (getProductPrice('bffp', currency) || 297) + (getProductPrice('brdmp', currency) || 147);
        const bundlePrice = getProductPrice('obm', currency) || 397;
        return formatPrice(total - bundlePrice, currency);
      }},
    ],
    'recordings-vault': [
      { find: /Normally \$197/g, getReplacement: () => {
        const price = 197; // Reference price in description
        return `Normally ${formatPrice(price, currency)}`;
      }},
      { find: /\$67/g, getReplacement: () => formatPrice(getProductPrice('rcv', currency) || 67, currency) },
    ],
    'lifetime-bffp': [
      {
        find: /Normally \$297/g,
        getReplacement: () => {
          const price = getProductPrice('bffp', currency) || 297;
          return `**Normally ${formatPrice(price, currency)}**`;
        }
      },
      {
        find: /just \$147/g,
        getReplacement: () => {
          const price = getProductPrice('ltbffp', currency) || 147;
          return `just **${formatPrice(price, currency)}**`;
        }
      },
    ],
    'lifetime-roadmap': [
      {
        find: /Normally \$147/g,
        getReplacement: () => {
          const price = getProductPrice('brdmp', currency) || 147;
          return `Normally ${formatPrice(price, currency)}`;
        }
      },
      {
        find: /just \$97/g,
        getReplacement: () => {
          const price = getProductPrice('ltbrdmp', currency) || 97;
          return `just ${formatPrice(price, currency)}`;
        }
      },
    ],
  };

  const replacements = priceReplacements[productId];
  if (!replacements) return description;

  let result = description;
  replacements.forEach(({ find, getReplacement }) => {
    const replacement = getReplacement();
    result = result.replace(find, replacement);
  });

  return result;
};
