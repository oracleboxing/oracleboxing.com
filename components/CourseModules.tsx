'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Module {
  title: string
  description: string
  lessons?: number
}

interface CourseModulesProps {
  modules: Module[]
  headerImage?: string
  showButton?: boolean
  buttonText?: string
  onButtonClick?: (e: React.MouseEvent) => void
}

export function CourseModules({ modules, headerImage, showButton = false, buttonText = "BUY NOW", onButtonClick }: CourseModulesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleModule = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-8 sm:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-section font-bold text-gray-900 mb-4 sm:mb-8 text-center">
          Sounds great! But what <em className="text-red-600">exactly</em> is included?
        </h2>

        {/* Header Image */}
        {headerImage && (
          <div className="mb-4 sm:mb-8 rounded-lg overflow-hidden">
            <img
              src={headerImage}
              alt="Course overview"
              className="w-full h-40 sm:h-64 object-cover"
            />
          </div>
        )}

        {/* FAQ-style Module Dropdowns */}
        <div className="space-y-3 sm:space-y-4">
          {modules.map((module, index) => (
            <div key={index} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleModule(index)}
                className="w-full px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors min-h-[60px]"
              >
                <div className="flex-1">
                  <h3 className="text-title font-bold text-gray-900">{module.title}</h3>
                  {module.lessons && (
                    <p className="text-body text-gray-500 mt-0.5 sm:mt-1">{module.lessons} lessons</p>
                  )}
                </div>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-3 sm:px-6 pb-3 sm:pb-5 pt-2 border-t-2 border-gray-100">
                  <p className="text-body text-gray-700 leading-relaxed whitespace-pre-line">{module.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Optional CTA Button */}
        {showButton && (
          <div className="text-center mt-6 sm:mt-8">
            <a
              href="#pricing"
              onClick={onButtonClick}
              className="inline-block py-4 sm:py-5 lg:py-6 px-10 sm:px-12 lg:px-14 bg-yellow-100 text-black border-4 border-black font-black text-sub rounded-lg uppercase tracking-wide cursor-pointer animate-bounce-subtle hover:bg-black hover:text-white transition-colors duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
