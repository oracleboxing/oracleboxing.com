'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { courses } from '@/lib/courses'
import Image from 'next/image'
import { Check } from 'lucide-react'

interface BundleModalProps {
  isOpen: boolean
  onClose: () => void
  onPurchase: (stripeUrl: string) => void
  stripeUrl?: string
}

export function BundleModal({ isOpen, onClose, onPurchase, stripeUrl }: BundleModalProps) {
  const handlePurchase = () => {
    if (stripeUrl) {
      onPurchase(stripeUrl)
    }
  }

  // Get individual courses (exclude the bundle itself)
  const individualCourses = courses.filter(c => !c.isBundle)
  const totalValue = individualCourses.reduce((sum, course) => sum + course.price, 0)
  const bundlePrice = 397
  const savings = totalValue - bundlePrice

  // Convert markdown bold (**text**) and semi-bold (*text*) to HTML
  const parseMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/)
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>
            } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
              return <span key={j} className="font-medium">{part.slice(1, -1)}</span>
            }
            return part
          })}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      )
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-sub font-bold text-white mb-2">
            Complete Bundle
          </DialogTitle>
          <p className="text-gray-400">
            Get complete access to the entire Oracle Boxing system
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* What's Included */}
          <div>
            <h3 className="text-sub font-bold text-white mb-4">What's Included:</h3>
            <div className="space-y-3">
              {individualCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 bg-zinc-800 rounded-lg p-4"
                >
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{course.title}</h4>
                    <p className="text-body text-gray-400">Individual price: ${course.price}</p>
                  </div>
                  <Check className="w-6 h-6 text-[#F25C05] flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-zinc-800 rounded-lg p-6">
            <div className="text-gray-300 leading-relaxed">
              {parseMarkdown(courses.find(c => c.isBundle)?.description || '')}
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t border-zinc-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-body text-gray-400 line-through">
                  Regular price: ${totalValue}
                </p>
                <p className="text-section font-bold text-[#F25C05]">
                  ${bundlePrice}
                </p>
                <p className="text-title text-green-400 font-semibold">
                  Save ${savings}!
                </p>
              </div>

              <Button
                onClick={handlePurchase}
                disabled={!stripeUrl}
                className="bg-[#F25C05] hover:bg-[#FF6B1A] text-white font-semibold px-8 py-6 text-title rounded-full"
              >
                Buy Complete Bundle
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
