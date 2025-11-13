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
      <label className="text-sm font-medium text-black">Color</label>
      <div className="flex gap-3">
        {colors.map(([colorName, colorData]) => {
          const isSelected = selectedColor === colorName
          return (
            <button
              key={colorName}
              onClick={() => onColorChange(colorName as TracksuitColor)}
              className={`
                relative w-10 h-10 rounded-full transition-all
                ${isSelected ? 'border-2 border-black scale-110' : 'border-0'}
              `}
              style={{
                backgroundColor: colorData.hex,
              }}
              aria-label={`Select ${colorName}`}
            >
              <span className="sr-only">{colorName}</span>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-black mt-2">Selected: {selectedColor}</p>
    </div>
  )
}
