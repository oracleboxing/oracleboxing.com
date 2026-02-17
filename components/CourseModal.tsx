'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Course } from '@/lib/courses'
import Image from 'next/image'

interface CourseModalProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
  onPurchase: (stripeUrl: string) => void
}

export function CourseModal({ course, isOpen, onClose, onPurchase }: CourseModalProps) {
  if (!course) return null

  const handlePurchase = () => {
    if (course.stripeUrl) {
      onPurchase(course.stripeUrl)
    }
  }

  // Convert markdown bold (**text**) and semi-bold (*text*) to HTML
  const parseMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Split by both ** and * patterns, preserving the delimiters
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-sub font-bold text-white">
            {course.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed">
              {parseMarkdown(course.description)}
            </div>
          </div>

          {/* Price and Purchase */}
          <div className="border-t border-zinc-800 pt-6 flex items-center justify-between">
            <div>
              <p className="text-body text-gray-400">Course Price</p>
              <p className="text-section font-bold text-[#F25C05]">
                ${course.price}
              </p>
            </div>

            <Button
              onClick={handlePurchase}
              disabled={!course.stripeUrl}
              className="bg-[#F25C05] hover:bg-[#FF6B1A] text-white font-semibold px-8 py-6 text-title rounded-full"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
