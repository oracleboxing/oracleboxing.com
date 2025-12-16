export type TrackSuitColor = 'black' | 'steel' | 'forest' | 'grey' | 'hazel'

export interface ColorOption {
  id: TrackSuitColor
  name: string
  hoodieUrl: string
  joggerUrl: string
}

export const TRACKSUIT_COLORS: ColorOption[] = [
  {
    id: 'black',
    name: 'Black',
    hoodieUrl: 'https://sb.oracleboxing.com/tracksuit/hoodie_black',
    joggerUrl: 'https://sb.oracleboxing.com/tracksuit/jogger_black',
  },
  {
    id: 'steel',
    name: 'Steel',
    hoodieUrl: 'https://sb.oracleboxing.com/tracksuit/hoodie_blue',
    joggerUrl: 'https://sb.oracleboxing.com/tracksuit/jogger_blue',
  },
  {
    id: 'forest',
    name: 'Forest',
    hoodieUrl: 'https://sb.oracleboxing.com/tracksuit/hoodie_green',
    joggerUrl: 'https://sb.oracleboxing.com/tracksuit/jogger_green',
  },
  {
    id: 'grey',
    name: 'Grey',
    hoodieUrl: 'https://sb.oracleboxing.com/tracksuit/hoodie_grey',
    joggerUrl: 'https://sb.oracleboxing.com/tracksuit/jogger_grey',
  },
  {
    id: 'hazel',
    name: 'Hazel',
    hoodieUrl: 'https://sb.oracleboxing.com/tracksuit/hoodie_brown',
    joggerUrl: 'https://sb.oracleboxing.com/tracksuit/jogger_brown',
  },
]

interface ColorSelectorProps {
  selectedColor?: TrackSuitColor
  onColorChange?: (color: TrackSuitColor) => void
  variant?: 'thumbnails' | 'swatches' | 'grid'
  className?: string
}

export function ColorSelector({
  selectedColor = 'black',
  onColorChange,
  variant = 'thumbnails',
  className = '',
}: ColorSelectorProps) {
  if (variant === 'grid') {
    // Grid variant - Full image grid
    return (
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${className}`}>
        {TRACKSUIT_COLORS.map((color) => (
          <div
            key={color.id}
            className="group cursor-pointer"
            onClick={() => onColorChange?.(color.id)}
          >
            <div className="relative overflow-hidden rounded-2xl mb-3">
              <img
                src={`${color.hoodieUrl}_front.webp`}
                alt={color.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-center font-semibold text-gray-900">{color.name}</p>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'swatches') {
    // Swatch variant - Small thumbnail selector
    return (
      <div className={`grid grid-cols-5 gap-3 ${className}`}>
        {TRACKSUIT_COLORS.map((color) => (
          <div key={color.id} className="text-center">
            <div
              className={`w-full aspect-square rounded-xl overflow-hidden mb-1 border-2 cursor-pointer transition-colors ${
                selectedColor === color.id
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              onClick={() => onColorChange?.(color.id)}
            >
              <img
                src={`${color.hoodieUrl}_front.webp`}
                alt={color.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-gray-700">{color.name}</p>
          </div>
        ))}
      </div>
    )
  }

  // Default 'thumbnails' variant
  return (
    <div className={`flex gap-4 min-w-max ${className}`}>
      {TRACKSUIT_COLORS.map((color) => (
        <div
          key={color.id}
          className="flex-shrink-0 w-48 cursor-pointer"
          onClick={() => onColorChange?.(color.id)}
        >
          <div className="relative rounded-2xl overflow-hidden mb-2">
            <img
              src={`${color.hoodieUrl}_front.webp`}
              alt={color.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-white font-semibold text-center">{color.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper function to get images for a specific color
export function getColorImages(colorId: TrackSuitColor) {
  const color = TRACKSUIT_COLORS.find((c) => c.id === colorId)
  if (!color) return null

  return {
    hoodieFront: `${color.hoodieUrl}_front.webp`,
    hoodieBack: `${color.hoodieUrl}_back.webp`,
    joggerFront: `${color.joggerUrl}_front.webp`,
    joggerBack: `${color.joggerUrl}_back.webp`,
  }
}
