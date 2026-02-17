'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Phase, roadmapPhases } from '@/lib/courses'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface RoadmapModalProps {
  isOpen: boolean
  onClose: () => void
  onPurchase: (stripeUrl: string) => void
  stripeUrl?: string
}

export function RoadmapModal({ isOpen, onClose, onPurchase, stripeUrl }: RoadmapModalProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null)

  const handlePurchase = () => {
    if (stripeUrl) {
      onPurchase(stripeUrl)
    }
  }

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase)
  }

  const handleBackToPhases = () => {
    setSelectedPhase(null)
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
    <Dialog open={isOpen} onOpenChange={() => {
      setSelectedPhase(null)
      onClose()
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 text-white border-zinc-800">
        {!selectedPhase ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-sub font-bold text-white">
                Boxing Roadmap - All 5 Phases
              </DialogTitle>
              <p className="text-gray-400 mt-2">
                Complete 5-phase boxing training system from fundamentals to mastery
              </p>
            </DialogHeader>

            <div className="space-y-4">
              {roadmapPhases.map((phase) => (
                <div
                  key={phase.id}
                  onClick={() => handlePhaseClick(phase)}
                  className="group cursor-pointer bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 transition-all duration-200 border border-zinc-700 hover:border-[#F25C05]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={phase.image}
                        alt={phase.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-title text-white group-hover:text-[#F25C05] transition-colors">
                        {phase.title}
                      </h4>
                      <p className="text-body text-gray-400 mt-1">
                        Focus: {phase.focus}
                      </p>
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-[#F25C05] transition-colors" />
                  </div>
                </div>
              ))}

              <div className="border-t border-zinc-800 pt-6 flex items-center justify-between">
                <div>
                  <p className="text-body text-gray-400">Complete Package</p>
                  <p className="text-section font-bold text-[#F25C05]">$147</p>
                </div>

                <Button
                  onClick={handlePurchase}
                  disabled={!stripeUrl}
                  className="bg-[#F25C05] hover:bg-[#FF6B1A] text-white font-semibold px-8 py-6 text-title rounded-full"
                >
                  Buy All 5 Phases
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <Button
                variant="ghost"
                onClick={handleBackToPhases}
                className="text-gray-400 hover:text-white mb-4 w-fit"
              >
                ← Back to All Phases
              </Button>
              <DialogTitle className="text-sub font-bold text-white">
                {selectedPhase.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedPhase.image}
                  alt={selectedPhase.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-title leading-relaxed">
                    {parseMarkdown(selectedPhase.description)}
                  </p>
                </div>

                <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-body text-gray-400">Focus:</span>
                    <p className="text-white font-medium">{selectedPhase.focus}</p>
                  </div>
                  <div>
                    <span className="text-body text-gray-400">Outcome:</span>
                    <p className="text-white font-medium">{selectedPhase.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
