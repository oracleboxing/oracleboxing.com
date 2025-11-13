export const tracksuitConfig = {
  // Stock management
  totalStock: 50,
  currentSold: 0, // Update this manually as sales come in

  // Presale dates
  presaleStart: new Date('2025-12-02'),
  presaleEnd: new Date('2025-12-09'),
  shippingDeadline: 'Before Christmas (20 December 2025)',

  // Colors with hex codes for UI
  colors: {
    Forest: {
      name: 'Forest',
      hex: '#637C73',
    },
    Hazel: {
      name: 'Hazel',
      hex: '#836F6C',
    },
    Steel: {
      name: 'Steel',
      hex: '#9FA4B3',
    },
    Black: {
      name: 'Black',
      hex: '#0A0A0A',
    },
  } as const,

  // Size guide measurements (in cm)
  sizeGuide: {
    XS: {
      chest: '86-91',
      waist: '71-76',
      hips: '86-91',
      inseam: '76',
    },
    S: {
      chest: '91-96',
      waist: '76-81',
      hips: '91-96',
      inseam: '79',
    },
    M: {
      chest: '96-102',
      waist: '81-86',
      hips: '96-102',
      inseam: '81',
    },
    L: {
      chest: '102-109',
      waist: '86-94',
      hips: '102-109',
      inseam: '84',
    },
    XL: {
      chest: '109-117',
      waist: '94-102',
      hips: '109-117',
      inseam: '86',
    },
  } as const,

  // FAQ content
  faq: [
    {
      question: 'When will my order ship?',
      answer: 'All pre-orders ship before 20 December 2025 (UK). You\'ll receive tracking information via email once your order ships.',
    },
    {
      question: 'How many are being made?',
      answer: 'Roughly 50 total worldwide. This is a limited presale run — once they\'re gone, they\'re gone.',
    },
    {
      question: 'Can I change my size after ordering?',
      answer: 'Yes, within 24 hours of purchase. Email team@oracleboxing.com with your order number and new size preference.',
    },
    {
      question: 'Do you ship worldwide?',
      answer: 'Yes — we ship to UK, EU, US, Canada, Australia, and UAE. Shipping rates are calculated at checkout based on your location.',
    },
    {
      question: 'Can I return it?',
      answer: 'Exchanges for defects only. We inspect every piece before shipping to ensure quality.',
    },
    {
      question: 'What is Atelier?',
      answer: 'It means workshop. This tracksuit comes straight from ours — hand-designed for fighters.',
    },
    {
      question: 'What\'s the fabric weight?',
      answer: 'Premium heavyweight 100% cotton, 470-500 gsm (garment-dyed fleece). It\'s substantial, breathable, and built to last.',
    },
  ] as const,

  // Product details
  fabric: {
    material: '100% cotton',
    weight: '470-500 gsm',
    type: 'Garment-dyed fleece',
  },

  fit: 'Relaxed athletic fit — true to size',

  care: [
    'Machine wash cold, inside out',
    'Air dry to preserve embroidery',
    'Do not bleach',
    'Iron on low heat if needed',
  ],
} as const

export type TracksuitColor = keyof typeof tracksuitConfig.colors
export type TracksuitSize = keyof typeof tracksuitConfig.sizeGuide

// Helper function to get remaining stock
export function getRemainingStock(): number {
  return tracksuitConfig.totalStock - tracksuitConfig.currentSold
}

// Helper function to check if presale is active
export function isPresaleActive(): boolean {
  const now = new Date()
  return now >= tracksuitConfig.presaleStart && now <= tracksuitConfig.presaleEnd
}

// Helper function to check if sold out
export function isSoldOut(): boolean {
  return getRemainingStock() <= 0
}
