'use client'

import { useState } from 'react'
import { TracksuitColor } from '@/lib/tracksuit-config'
import Image from 'next/image'

interface ImageGalleryProps {
  selectedColor: TracksuitColor
}

// Color name mapping for image filenames
const colorNameMap: Record<TracksuitColor, string> = {
  Forest: 'green',
  Hazel: 'brown',
  Steel: 'blue',
  Black: 'black',
}

// Image configuration: [angle_name, filename_prefix]
const imageConfigs = [
  { label: 'Hoodie Front', prefix: 'hoodie', angle: 'front' },
  { label: 'Hoodie Back', prefix: 'hoodie', angle: 'back' },
  { label: 'Joggers Front', prefix: 'jogger', angle: 'front' },
  { label: 'Joggers Back', prefix: 'jogger', angle: 'back' },
]

export function ImageGallery({ selectedColor }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const colorName = colorNameMap[selectedColor]

  const currentImage = imageConfigs[selectedImageIndex]
  const imageUrl = `https://media.oracleboxing.com/tracksuit/${currentImage.prefix}_${colorName}_${currentImage.angle}.webp`

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={`${selectedColor} tracksuit - ${currentImage.label}`}
          width={800}
          height={1067}
          className="w-full h-full object-cover"
          priority
          unoptimized
          onError={(e) => {
            console.error('Failed to load image:', imageUrl)
          }}
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-3">
        {imageConfigs.map((config, index) => {
          const thumbUrl = `https://media.oracleboxing.com/tracksuit/${config.prefix}_${colorName}_${config.angle}.webp`
          return (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`
                aspect-square rounded-lg overflow-hidden transition-all bg-gray-100
                ${selectedImageIndex === index ? 'ring-2 ring-black scale-105' : 'opacity-60 hover:opacity-100'}
              `}
            >
              <Image
                src={thumbUrl}
                alt={`${selectedColor} - ${config.label}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
                unoptimized
                onError={(e) => {
                  console.error('Failed to load thumbnail:', thumbUrl)
                }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
