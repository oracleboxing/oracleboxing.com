// Facebook Pixel tracking functions

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Initialize Facebook Pixel
export const initFBPixel = () => {
  if (typeof window !== 'undefined' && !window.fbq) {
    const n: any = window.fbq = function() {
      (n as any).callMethod ? (n as any).callMethod.apply(n, arguments) : (n as any).queue.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
  }
};

// Track page view
export const fbPageView = (metadata: any = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventID = metadata.eventID || metadata.event_id || Date.now().toString();
    window.fbq('track', 'PageView', {}, {
      eventID: eventID
    });
  }
};

// Removed ViewContent - focusing on core conversion events

// Track InitiateCheckout event with enhanced parameters
export const fbInitiateCheckout = (value: number, currency: string = 'USD', numItems: number = 1, buttonLocation?: string, metadata: any = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventID = metadata.eventID || metadata.event_id || Date.now().toString();
    const parameters = {
      value: value,
      currency: currency,
      num_items: numItems,
      content_type: 'product',
      content_ids: ['6-week-challenge'],
      content_name: '6-Week Boxing Challenge',
      content_category: 'Online Course',
      ...(buttonLocation && { button_location: buttonLocation }),
      // Include all metadata (fbclid, utm params, etc) except eventID
      ...metadata
    };
    
    // Remove eventID from parameters (it goes in options)
    delete parameters.eventID;
    
    try {
      window.fbq('track', 'InitiateCheckout', parameters, {
        eventID: eventID
      });
    } catch (error) {
      console.error('Error sending FB InitiateCheckout:', error);
    }
  } else {
    console.warn('FB InitiateCheckout NOT sent - fbq not available:', {
      windowExists: typeof window !== 'undefined',
      fbqExists: typeof window !== 'undefined' && !!window.fbq
    });
  }
};

// Track Purchase event with enhanced parameters
export const fbPurchase = (value: number, currency: string = 'USD', transactionId?: string, orderBumps?: string[], metadata: any = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventID = metadata.eventID || metadata.event_id || Date.now().toString();
    const contentIds = ['6-week-challenge'];
    if (orderBumps && orderBumps.length > 0) {
      contentIds.push(...orderBumps);
    }
    
    const parameters = {
      value: value,
      currency: currency,
      content_type: 'product',
      content_ids: contentIds,
      contents: [
        {
          id: '6-week-challenge',
          quantity: 1,
          item_price: 197
        },
        ...(orderBumps?.includes('recordings-vault') ? [{
          id: 'recordings-vault',
          quantity: 1,
          item_price: 67
        }] : []),
        ...(orderBumps?.includes('lifetime-access') ? [{
          id: 'lifetime-access',
          quantity: 1,
          item_price: 97
        }] : [])
      ],
      num_items: contentIds.length,
      ...(transactionId && { order_id: transactionId })
    };
    
    window.fbq('track', 'Purchase', parameters, {
      eventID: eventID
    });
  }
};

// Track Lead event (for email capture or interest)
export const fbLead = (contentName: string, value?: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: contentName,
      value: value,
      currency: 'USD'
    });
  }
};

// Track custom events with enhanced debugging
export const fbTrackCustom = (eventName: string, parameters?: any, metadata: any = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventID = metadata.eventID || metadata.event_id || Date.now().toString();
    
    window.fbq('trackCustom', eventName, parameters, {
      eventID: eventID
    });
  }
};

// Track standard events with enhanced debugging
export const fbTrack = (eventName: string, parameters?: any, metadata: any = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventID = metadata.eventID || metadata.event_id || Date.now().toString();
    
    window.fbq('track', eventName, parameters, {
      eventID: eventID
    });
  }
};

// Removed AddToCart and Video events - focusing on core conversion tracking