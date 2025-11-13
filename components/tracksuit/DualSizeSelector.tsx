'use client'

import { TracksuitSize } from '@/lib/tracksuit-config'

interface DualSizeSelectorProps {
  hoodieSize: TracksuitSize
  joggersSize: TracksuitSize
  onHoodieSizeChange: (size: TracksuitSize) => void
  onJoggersSizeChange: (size: TracksuitSize) => void
}

const sizes: TracksuitSize[] = ['XS', 'S', 'M', 'L', 'XL']

export function DualSizeSelector({
  hoodieSize,
  joggersSize,
  onHoodieSizeChange,
  onJoggersSizeChange
}: DualSizeSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Hoodie Size */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-black">Hoodie Size</label>
        <div className="grid grid-cols-5 gap-2">
          {sizes.map((size) => {
            const isSelected = hoodieSize === size
            return (
              <button
                key={size}
                onClick={() => onHoodieSizeChange(size)}
                className={`
                  px-4 py-3 rounded-lg font-medium transition-all text-sm
                  ${
                    isSelected
                      ? 'bg-yellow-100 text-black border-2 border-black'
                      : 'bg-white text-black hover:bg-gray-100 border-2 border-gray-400'
                  }
                `}
                aria-label={`Select hoodie size ${size}`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Joggers Size */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-black">Joggers Size</label>
        <div className="grid grid-cols-5 gap-2">
          {sizes.map((size) => {
            const isSelected = joggersSize === size
            return (
              <button
                key={size}
                onClick={() => onJoggersSizeChange(size)}
                className={`
                  px-4 py-3 rounded-lg font-medium transition-all text-sm
                  ${
                    isSelected
                      ? 'bg-yellow-100 text-black border-2 border-black'
                      : 'bg-white text-black hover:bg-gray-100 border-2 border-gray-400'
                  }
                `}
                aria-label={`Select joggers size ${size}`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
