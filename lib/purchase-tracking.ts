// Purchase tracking utilities for success page

export interface PurchaseData {
  // Core purchase info
  session_id?: string;
  amount_total?: number;
  currency?: string;
  
  // Customer info
  customer_email?: string;
  customer_name?: string;
  customer_id?: string;
  
  // Products purchased
  products?: string[]; // Array of product names
  has_recordings_vault?: boolean;
  has_lifetime_access?: boolean;
  
  // Attribution data
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  button_location?: string;
  client_reference_id?: string;
}

/**
 * Parse URL parameters from Stripe success redirect
 * Stripe can append these parameters to your success URL
 */
export function parsePurchaseDataFromURL(): PurchaseData {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const data: PurchaseData = {};
  
  // Testing helper: Allow manual testing with test params
  // Example: /success/challenge?test=true&test_amount=361
  if (urlParams.get('test') === 'true') {
    const testAmount = urlParams.get('test_amount');
    if (testAmount) {
      data.amount_total = parseInt(testAmount, 10);
    }
  }
  
  // Core checkout session data
  data.session_id = urlParams.get('session_id') || urlParams.get('checkout_session_id') || undefined;
  
  // event_id from Stripe URL is available via urlParams.get('event_id') if needed
  
  // Parse amount if provided (Stripe sometimes includes this)
  const amount = urlParams.get('amount') || urlParams.get('amount_total');
  if (amount) {
    const amountNum = parseInt(amount, 10);
    // Check if amount is likely in cents (>10000 would be $100+)
    if (amountNum > 10000) {
      data.amount_total = amountNum / 100; // Convert from cents
    } else {
      data.amount_total = amountNum; // Already in dollars
    }
  }
  
  // Customer data
  data.customer_email = urlParams.get('customer_email') || undefined;
  data.customer_name = urlParams.get('customer_name') || undefined;
  data.customer_id = urlParams.get('customer_id') || undefined;
  
  // Product data - check multiple possible parameter names
  const products = urlParams.get('products');
  if (products) {
    data.products = products.split(',');
    
    // Check for specific products in the products list
    data.has_recordings_vault = products.toLowerCase().includes('recordings');
    data.has_lifetime_access = products.toLowerCase().includes('lifetime');
  }
  
  // Check for various parameter formats (highest priority)
  // Check standard boolean params
  if (urlParams.get('recordings_vault') === 'true' || 
      urlParams.get('recordingsVault') === 'true' ||
      urlParams.get('recordings') === 'true') {
    data.has_recordings_vault = true;
  }
  if (urlParams.get('lifetime_access') === 'true' || 
      urlParams.get('lifetimeAccess') === 'true' ||
      urlParams.get('lifetime') === 'true' ||
      urlParams.get('course') === 'true') {
    data.has_lifetime_access = true;
  }
  
  // Check for Stripe metadata format (metadata[key])
  if (urlParams.get('metadata[recordings_vault]') === 'true' ||
      urlParams.get('metadata[recordingsVault]') === 'true') {
    data.has_recordings_vault = true;
  }
  if (urlParams.get('metadata[lifetime_access]') === 'true' ||
      urlParams.get('metadata[lifetimeAccess]') === 'true') {
    data.has_lifetime_access = true;
  }
  
  // NEW: Check for product_type metadata format (e.g., "challenge & recordings & course")
  const productType = urlParams.get('product_type') || 
                      urlParams.get('metadata[product_type]') ||
                      urlParams.get('productType');
  
  if (productType) {
    const productTypeLower = productType.toLowerCase();
    
    // Check for recordings in product_type
    if (productTypeLower.includes('recordings') ||
        productTypeLower.includes('vault')) {
      data.has_recordings_vault = true;
    }
    
    // Check for lifetime/course in product_type
    if (productTypeLower.includes('course') ||
        productTypeLower.includes('lifetime') ||
        productTypeLower.includes('bffp')) {
      data.has_lifetime_access = true;
    }
  }
  
  // FALLBACK: If no explicit order bump params but amount is provided,
  // try to detect order bumps from the amount
  if (data.amount_total) {
    const total = data.amount_total;
    
    // Possible totals:
    // $197 = Base only
    // $264 = Base + Recordings ($197 + $67)
    // $294 = Base + Lifetime ($197 + $97)
    // $361 = Base + Both ($197 + $67 + $97)
    
    // Only apply detection if we don't already have order bump data
    if (!data.has_recordings_vault && !data.has_lifetime_access) {
      if (total === 361) {
        data.has_recordings_vault = true;
        data.has_lifetime_access = true;
      } else if (total === 264) {
        data.has_recordings_vault = true;
      } else if (total === 294) {
        data.has_lifetime_access = true;
      }
    }
  }
  
  // Attribution data
  data.utm_source = urlParams.get('utm_source') || undefined;
  data.utm_medium = urlParams.get('utm_medium') || undefined;
  data.utm_campaign = urlParams.get('utm_campaign') || undefined;
  data.utm_term = urlParams.get('utm_term') || undefined;
  data.utm_content = urlParams.get('utm_content') || undefined;
  data.button_location = urlParams.get('button_location') || undefined;
  data.client_reference_id = urlParams.get('client_reference_id') || urlParams.get('ref') || undefined;
  
  return data;
}

/**
 * Calculate total purchase value based on products
 */
export function calculatePurchaseValue(data: PurchaseData): number {
  let total = 197; // Base challenge price
  
  if (data.has_recordings_vault) {
    total += 67; // Recordings Vault price
  }
  
  if (data.has_lifetime_access) {
    total += 97; // Lifetime Access price
  }
  
  // If amount_total was provided in URL, use that instead
  if (data.amount_total) {
    return data.amount_total;
  }
  
  return total;
}

/**
 * Build product list for analytics tracking
 */
export function buildProductsList(data: PurchaseData): Array<{
  item_name: string;
  price: number;
  quantity: number;
}> {
  const items = [
    {
      item_name: '6-Week Boxing Challenge',
      price: 197,
      quantity: 1
    }
  ];
  
  if (data.has_recordings_vault) {
    items.push({
      item_name: 'Recordings Vault Access',
      price: 67,
      quantity: 1
    });
  }
  
  if (data.has_lifetime_access) {
    items.push({
      item_name: 'Lifetime Access - Boxing Masterclass',
      price: 97,
      quantity: 1
    });
  }
  
  return items;
}

/**
 * Format purchase data for analytics events
 */
export function formatPurchaseEvent(data: PurchaseData) {
  const value = calculatePurchaseValue(data);
  const items = buildProductsList(data);
  
  return {
    // Transaction data
    transaction_id: data.session_id || Date.now().toString(),
    value: value,
    currency: data.currency || 'USD',
    items: items,
    
    // Customer data
    customer_email: data.customer_email,
    customer_id: data.customer_id,
    
    // Attribution data
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    utm_term: data.utm_term,
    utm_content: data.utm_content,
    button_location: data.button_location,
    client_reference_id: data.client_reference_id,
    
    // Product flags
    has_recordings_vault: data.has_recordings_vault || false,
    has_lifetime_access: data.has_lifetime_access || false
  };
}