'use client'

import { tracksuitConfig, TracksuitColor } from '@/lib/tracksuit-config'
import { Check } from 'lucide-react'

interface ColorSelectorProps {
  selectedColor: TracksuitColor
  onColorChange: (color: TracksuitColor) => void
}

export function ColorSelector({ selectedColor, onColorChange }: ColorSelectorProps) {
  const colors = Object.entries(tracksuitConfig.colors)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-black">Colour: {selectedColor}</label>
      </div>
      <div className="flex gap-3">
        {colors.map(([colorName, colorData]) => {
          const isSelected = selectedColor === colorName
          const isSoldOut = colorData.soldOut
          return (
            <button
              key={colorName}
              onClick={() => !isSoldOut && onColorChange(colorName as TracksuitColor)}
              disabled={isSoldOut}
              className={`
                relative w-10 h-10 rounded-full transition-all
                ${isSelected ? 'border-2 border-black scale-110' : 'border-0'}
                ${isSoldOut ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                backgroundColor: colorData.hex,
              }}
              aria-label={`${colorName}${isSoldOut ? ' (Sold Out)' : ''}`}
            >
              {isSoldOut && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-red-600 rotate-45 transform scale-125"></div>
                </div>
              )}
              <span className="sr-only">{colorName}{isSoldOut ? ' (Sold Out)' : ''}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
