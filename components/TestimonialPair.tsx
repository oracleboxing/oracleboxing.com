'use client'

import Image from 'next/image'

interface Testimonial {
  quote: string
  name: string
  role: string
  image: string
}

interface TestimonialPairProps {
  testimonials: [Testimonial, Testimonial]
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex items-start gap-4 md:gap-5">
      {/* Image */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#37322F]/10">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Quote text */}
        <p className="text-[#37322F] text-sm md:text-base leading-relaxed">
          {testimonial.quote}
        </p>

        {/* Name and role */}
        <div className="mt-3">
          <p className="text-[#37322F] text-sm md:text-base font-semibold">
            {testimonial.name}
          </p>
          <p className="text-[#49423D]/60 text-xs md:text-sm">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialPair({ testimonials }: TestimonialPairProps) {
  const [first, second] = testimonials

  return (
    <section className="w-full bg-white py-10 md:py-14 border-b border-[rgba(55,50,47,0.12)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <TestimonialCard testimonial={first} />
          <TestimonialCard testimonial={second} />
        </div>
      </div>
    </section>
  )
}

// Single testimonial centered
export function TestimonialSingle({ testimonial }: { testimonial: Testimonial }) {
  return (
    <section className="w-full bg-white py-10 md:py-14 border-b border-[rgba(55,50,47,0.12)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <TestimonialCard testimonial={testimonial} />
      </div>
    </section>
  )
}

// Four testimonials in a 2x2 grid
export function TestimonialQuad({ testimonials }: { testimonials: [Testimonial, Testimonial, Testimonial, Testimonial] }) {
  return (
    <section className="w-full bg-white py-10 md:py-14 border-b border-[rgba(55,50,47,0.12)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={idx} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Full testimonials section with title and all testimonials
export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="w-full bg-white border-b border-[rgba(55,50,47,0.12)]">
      <div className="flex justify-center items-start">
        {/* Left decorative pattern - CSS gradient instead of DOM elements */}
        <div
          className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 11px,
              rgba(3,7,18,0.08) 11px,
              rgba(3,7,18,0.08) 12px
            )`
          }}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0 py-12 md:py-16 sm:border-l sm:border-r border-[rgba(55,50,47,0.12)]">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12 px-4">
            <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-normal" style={{ fontFamily: 'ClashDisplay, sans-serif' }}>
              What Our Members Say
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {testimonials.map((testimonial, idx) => (
                <TestimonialCard key={idx} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>

        {/* Right decorative pattern - CSS gradient instead of DOM elements */}
        <div
          className="hidden sm:block sm:w-4 md:w-8 lg:w-12 self-stretch relative overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 11px,
              rgba(3,7,18,0.08) 11px,
              rgba(3,7,18,0.08) 12px
            )`
          }}
        />
      </div>
    </section>
  )
}

// Export individual card for flexibility
export { TestimonialCard }

// Export testimonials data for reuse
export const allTestimonials = {
  krisSaville: {
    quote: "It's transformed me in so many ways and the real joy of it is I'm not the only one.",
    name: "Kristopher Saville",
    role: "Strategic Business Development Director",
    image: "https://sb.oracleboxing.com/Website/kris.jpg"
  },
  brunoMartins: {
    quote: "The value that the coaches bring is WAY BEYOND what I ever expected when I joined this challenge.",
    name: "Bruno Martins",
    role: "Engineer",
    image: "https://sb.oracleboxing.com/Website/1560863789646.jpeg"
  },
  krisQually: {
    quote: "I've improved more in 3 weeks with Oracle than 2 years at my local gym.",
    name: "Kris Qually",
    role: "Sales Professional",
    image: "https://sb.oracleboxing.com/Website/kris_qually.webp"
  },
  antonPolyakov: {
    quote: "Oracle Boxing is a team of top notch young dedicated boxers bringing sharpest boxing technique, attention and dedication to you individually.",
    name: "Anton Polyakov",
    role: "PhD, Director at NVIDIA",
    image: "https://sb.oracleboxing.com/Website/anton.webp"
  },
  meiyanC: {
    quote: "As a minority in the martial arts world, I feel safe joining classes in this respectful community, where scientific coaching has truly transformed my movement.",
    name: "Meiyan C",
    role: "PhD, Organizational Culture Strategist at Google",
    image: "https://sb.oracleboxing.com/Website/meiyan.webp"
  },
  mikeForouzanfar: {
    quote: "Oracle Boxing is all about fun, form, and focus—embedded in a strong, supportive community of coaches and fellow boxing enthusiasts.",
    name: "Mike Forouzanfar",
    role: "Consultant Urologist & Pelvic-Floor Specialist",
    image: "https://sb.oracleboxing.com/Website/Forouzanfar-M.-Uroloog_LR.webp"
  },
  rodKeher: {
    quote: "Boxing elevated to a true martial art, curated for and shared by a dedicated, supportive and truly special community.",
    name: "Rod Keher",
    role: "CEO",
    image: "https://sb.oracleboxing.com/Website/rod.webp"
  },
  leoCarrillo: {
    quote: "I came for better boxing, but this community completely reset my mindset - and that's made me better in boxing, business, and life.",
    name: "Leo Carrillo III",
    role: "CEO & Co-Founder, Craft",
    image: "https://sb.oracleboxing.com/Website/leo.webp"
  },
  pascalPerau: {
    quote: "Real coaching, real people, real progress — that's what makes this class different.",
    name: "Pascal Perau",
    role: "Software Developer",
    image: "https://sb.oracleboxing.com/Website/pascal.webp"
  },
  thomasHaeusle: {
    quote: "No matter how rough my day was, the training with Oracle boxing team brings me back on track.",
    name: "Thomas Haeusle",
    role: "Managing Director / CSO",
    image: "https://sb.oracleboxing.com/Website/thomas.webp"
  }
}
