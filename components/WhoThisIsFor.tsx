interface PersonaCard {
  emoji: string
  title: string
  subtitle: string
}

interface WhoThisIsForProps {
  courseName: string
  personas: PersonaCard[]
}

export function WhoThisIsFor({ courseName, personas }: WhoThisIsForProps) {
  return (
    <section className="py-8 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-section font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          <span className="italic">{courseName}</span> is built for:
        </h2>

        {/* Black divider line - 70% width, 2pt thick */}
        <div className="w-[70%] h-[2pt] bg-black mb-6 sm:mb-12 mx-auto"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {personas.map((persona, index) => (
            <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 sm:p-6 text-center">
              <p className="text-gray-900 leading-relaxed">
                <span className="text-sub font-bold">{persona.title}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
