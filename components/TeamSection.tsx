"use client"

import Image from "next/image"

const team = [
  {
    name: "Oliver Betts",
    role: "Founder",
    image: "https://sb.oracleboxing.com/Website/team_ollie.webp",
  },
  {
    name: "Jordan Lyne",
    role: "Co-Founder",
    image: "https://sb.oracleboxing.com/Website/team_jordan.webp",
  },
  {
    name: "Antonio Troni",
    role: "Coach",
    image: "https://sb.oracleboxing.com/Website/team_toni.webp",
  },
  {
    name: "Charlie Snider",
    role: "Coach",
    image: "https://sb.oracleboxing.com/Website/team_charlie.webp",
  },
]

export default function TeamSection() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-10 md:mb-12 px-4">
        <h2 className="text-[#37322F] text-section font-normal">
          Your Dream Team
        </h2>
      </div>

      {/* Full-width Team Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {team.map((member, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Photo with hover effect */}
            <div className="w-full aspect-square overflow-hidden relative">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105 grayscale-0 md:grayscale md:group-hover:grayscale-0"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#37322F]/0 group-hover:bg-[#37322F]/10 transition-all duration-300" />
            </div>

            {/* Name and Role - appears on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#37322F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-body font-semibold font-sans text-center">
                {member.name}
              </p>
              <p className="text-white/80 text-body font-medium font-sans text-center">
                {member.role}
              </p>
            </div>

            {/* Always visible name below on mobile */}
            <div className="md:hidden text-center py-3 px-2">
              <p className="text-[#37322F] text-body font-semibold font-sans">
                {member.name}
              </p>
              <p className="text-[#847971] text-xs font-medium font-sans">
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
