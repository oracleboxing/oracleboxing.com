'use client'

export default function MembershipTestimonialsSection() {
  const testimonials = [
    {
      quote: "It's transformed me in so many ways and the real joy of it is I'm not the only one.",
      name: "Kristopher Saville",
      role: "Strategic Business Development Director",
      image: "https://sb.oracleboxing.com/Website/kris.jpg"
    },
    {
      quote: "The value that the coaches bring is WAY BEYOND what I ever expected when I joined.",
      name: "Bruno Martins",
      role: "Engineer",
      image: "https://sb.oracleboxing.com/Website/1560863789646.jpeg"
    },
    {
      quote: "I've improved more in 3 weeks with Oracle than 2 years at my local gym.",
      name: "Kris Qually",
      role: "Sales Professional",
      image: "https://sb.oracleboxing.com/Website/kris_qually.webp"
    },
    {
      quote: "Oracle Boxing is a team of top notch young dedicated boxers bringing sharpest boxing technique, attention and dedication to you individually.",
      name: "Anton Polyakov",
      role: "PhD, Director at NVIDIA",
      image: "https://sb.oracleboxing.com/Website/anton.webp"
    },
    {
      quote: "As a minority in the martial arts world, I feel safe joining classes in this respectful community, where scientific coaching has truly transformed my movement.",
      name: "Meiyan C",
      role: "PhD, Organizational Culture Strategist at Google",
      image: "https://sb.oracleboxing.com/Website/meiyan.webp"
    },
    {
      quote: "Real coaching, real people, real progress — that's what makes this class different.",
      name: "Pascal Perau",
      role: "Software Developer",
      image: "https://sb.oracleboxing.com/Website/pascal.webp"
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-[#F7F5F3]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-section font-normal mb-4">
            Trusted by Boxers <span className="text-[#9CABA8]">Worldwide</span>
          </h2>
          <p className="text-title text-[#605A57] max-w-3xl mx-auto">
            Join professionals, executives, and dedicated athletes learning from Oracle Boxing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-[#37322F]">{testimonial.name}</div>
                  <div className="text-sm text-[#605A57]">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-[#49423D] leading-relaxed italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
