'use client'

import { useState } from 'react'

interface ResearchItem {
  title: string
  highlightWord: string
  finding: string
  source: string
}

const researchItems: ResearchItem[] = [
  {
    title: 'Less',
    highlightWord: 'anxiety',
    finding: '51% reduction in anxiety symptoms with non-contact boxing training',
    source: 'Bozdarov et al. (2025). PLoS ONE, Mindfulness-Based Boxing Therapy study'
  },
  {
    title: 'More',
    highlightWord: 'assertiveness',
    finding: 'Self-defense training led to significantly higher assertiveness and ability to stand your ground',
    source: 'Weitlauf et al. (2000). Journal of Applied Psychology'
  },
  {
    title: 'Improved',
    highlightWord: 'coping',
    finding: 'Training conditions the endocrine system to view stress as "challenge" rather than "threat"',
    source: 'PubMed (2020). Testosterone and Cortisol in Combat Athletes'
  },
  {
    title: 'Higher',
    highlightWord: 'stress resilience',
    finding: 'Martial artists exhibit superior autonomic regulation and faster recovery after stressors',
    source: 'PMC (2023). Heart Rate Variability in Karate Practitioners'
  },
  {
    title: 'Higher',
    highlightWord: 'grit',
    finding: 'Grit and resilience significantly correlated with years of training - experts score higher with less variance',
    source: 'PMC (2024). Grit and Resilience in Combat Sports'
  },
  {
    title: 'Improved',
    highlightWord: 'self-regulation',
    finding: 'Martial arts training improved self-regulation and even better classroom behavior',
    source: 'ScienceDirect. Self-Regulation Through Martial Arts'
  },
]

function AccordionItem({ item }: { item: ResearchItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="w-full text-left py-4 border-b border-[#e5e2dc] last:border-b-0"
    >
      <div className="flex items-center justify-between gap-4">
        <h3
          className="text-sub font-semibold text-[#37322F]"
        >
          {item.title} <span className="text-[#9a928d]">{item.highlightWord}</span>
        </h3>
        <svg
          className={`w-5 h-5 text-[#9a928d] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
          <p className="text-[#37322F] text-body font-medium">
            {item.finding}
          </p>
          <p className="text-xs text-[#847971] flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {item.source}
          </p>
        </div>
      )}
    </button>
  )
}

export default function ResearchBenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="w-full px-4 md:px-8">
        {/* Two-column layout: title left, accordion right */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-[1400px] mx-auto">
          {/* Left: Title */}
          <div className="lg:w-[480px] flex-shrink-0 lg:self-center">
            <h2
              className="text-hero font-semibold text-[#37322F] mb-3"
            >
              Learning to Fight Impacts Your Life in Many Ways
            </h2>
            <p className="text-[#605A57] text-body">
              Peer-reviewed studies highlighting the benefits of combat sports training.
            </p>
          </div>

          {/* Right: Accordion Items */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#f9f8f6] border border-[#e5e2dc] rounded-2xl px-6 md:px-8 py-2">
              {researchItems.map((item, index) => (
                <AccordionItem key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
