'use client'

import { TracksuitSize } from '@/lib/tracksuit-config'

interface SizeSelectorProps {
  selectedSize: TracksuitSize
  onSizeChange: (size: TracksuitSize) => void
}

const sizes: TracksuitSize[] = ['XS', 'S', 'M', 'L', 'XL']

export function SizeSelector({ selectedSize, onSizeChange }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-black">Size</label>
      <div className="grid grid-cols-5 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size
          return (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`
                px-4 py-3 rounded-lg font-medium transition-all text-sm
                ${
                  isSelected
                    ? 'bg-yellow-100 text-black border-2 border-black'
                    : 'bg-white text-black hover:bg-gray-100 border-2 border-gray-400'
                }
              `}
              aria-label={`Select size ${size}`}
            >
              {size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
