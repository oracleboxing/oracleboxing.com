'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Ruler, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export function SizeGuideModal() {
  const [currentGuide, setCurrentGuide] = useState<'hoodie' | 'joggers'>('hoodie')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-gray-400 hover:text-black transition-colors flex items-center gap-1.5">
          <Ruler className="w-4 h-4" />
          Size Guide
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-white border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">
            SIZE GUIDE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentGuide('hoodie')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentGuide === 'hoodie'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Hoodie
            </button>
            <button
              onClick={() => setCurrentGuide('joggers')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentGuide === 'joggers'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Joggers
            </button>
          </div>

          {/* SVG Display */}
          <div className="w-full overflow-auto max-h-[70vh]">
            {currentGuide === 'hoodie' ? (
              <Image
                src="https://media.oracleboxing.com/tracksuit/oracle_boxing_hoodie_size_guide.svg"
                alt="Oracle Boxing Hoodie Size Guide"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            ) : (
              <Image
                src="https://media.oracleboxing.com/tracksuit/oracle_boxing_jogger_size_guide.svg"
                alt="Oracle Boxing Joggers Size Guide"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
