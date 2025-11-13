'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type AccordionSection = 'details' | 'shipping' | null

export function ProductAccordion() {
  const [openSection, setOpenSection] = useState<AccordionSection>(null)

  const toggleSection = (section: AccordionSection) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="space-y-0 border-t border-gray-300 pt-6">
      {/* Details */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleSection('details')}
          className="w-full flex items-center justify-between py-4 text-left hover:opacity-70 transition-opacity"
        >
          <span className="text-sm font-medium text-black">Details</span>
          <ChevronDown
            className={`w-4 h-4 text-black transition-transform ${
              openSection === 'details' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSection === 'details' && (
          <div className="pb-4 text-sm text-black space-y-2">
            <p>Fabric: 100% cotton</p>
            <p>Garment dyed</p>
            <p>Fit: Relaxed fit, true to size</p>
          </div>
        )}
      </div>

      {/* Shipping */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleSection('shipping')}
          className="w-full flex items-center justify-between py-4 text-left hover:opacity-70 transition-opacity"
        >
          <span className="text-sm font-medium text-black">Shipping</span>
          <ChevronDown
            className={`w-4 h-4 text-black transition-transform ${
              openSection === 'shipping' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSection === 'shipping' && (
          <div className="pb-4 text-sm text-black space-y-2">
            <p>All pre-orders will be shipped before 20 December 2025.</p>
            <p>International shipping rates calculated at checkout based on your location.</p>
          </div>
        )}
      </div>
    </div>
  )
}
