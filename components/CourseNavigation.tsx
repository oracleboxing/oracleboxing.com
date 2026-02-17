'use client'

export function CourseNavigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="sticky top-0 z-40 bg-white/95 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile & Desktop - Horizontal Buttons */}
        <nav className="flex items-center justify-center md:justify-end gap-3 md:gap-8 py-3 md:py-4 overflow-x-auto">
          <button
            onClick={() => scrollToSection('overview')}
            className="text-body font-semibold text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap px-2 md:px-0"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection('lessons')}
            className="text-body font-semibold text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap px-2 md:px-0"
          >
            Lessons
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="text-body font-semibold text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap px-2 md:px-0"
          >
            Testimonials
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-body font-semibold text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap px-2 md:px-0"
          >
            Pricing
          </button>
        </nav>
      </div>
    </div>
  )
}
