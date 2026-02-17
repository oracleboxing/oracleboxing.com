interface LearningCard {
  emoji: string
  text: string
  imageUrl?: string
}

interface CourseCurriculumProps {
  title?: string
  learningCards: LearningCard[]
  showButton?: boolean
  buttonText?: string
  onButtonClick?: (e: React.MouseEvent) => void
}

export function CourseCurriculum({
  title = "This Course Will Teach You...",
  learningCards,
  showButton = false,
  buttonText = "JOIN NOW",
  onButtonClick
}: CourseCurriculumProps) {
  const isVideo = (url?: string) => {
    if (!url) return false
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov')
  }

  return (
    <section className="py-8 sm:py-16 bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-section font-bold text-gray-900 mb-6 sm:mb-12 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full mx-auto">
          {learningCards.map((card, index) => (
            <div key={index} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              {/* Image or Video - full width at top */}
              <div className="w-full aspect-[4/3] overflow-hidden">
                {isVideo(card.imageUrl) ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={card.imageUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={card.imageUrl || 'https://placehold.co/400x300/e5e5e5/666666?text=Boxing'}
                    alt="Course visual"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Text content below */}
              <div className="p-4 sm:p-6 text-center">
                <p className="font-bold text-gray-900 text-title leading-relaxed">{card.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Optional CTA Button */}
        {showButton && (
          <div className="text-center mt-6 sm:mt-12">
            <a
              href="#pricing"
              onClick={onButtonClick}
              className="inline-block py-3 sm:py-4 lg:py-5 px-8 sm:px-10 lg:px-12 bg-yellow-100 text-black border-4 border-black font-black text-sub rounded-xl uppercase tracking-wide cursor-pointer animate-bounce-subtle hover:bg-black hover:text-white transition-colors duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
