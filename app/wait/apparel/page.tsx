'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ApparelWaitlistPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/tracksuit')
  }, [router])

  return null
}

// Old waitlist page - now redirects to /tracksuit
function OldApparelWaitlistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    size: '',
    preferred_color: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Black', 'Blue', 'Brown', 'Green']
  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden',
    'Norway', 'Denmark', 'Finland', 'Ireland', 'Portugal', 'Greece', 'Poland',
    'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovakia',
    'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Cyprus',
    'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'Taiwan', 'New Zealand',
    'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'India',
    'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Israel', 'Turkey',
    'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Algeria',
    'China', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 'Malaysia',
    'Russia', 'Ukraine', 'Belarus', 'Kazakhstan', 'Iceland', 'Other'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/waitlist/apparel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          country: formData.country,
          size: formData.size,
          preferred_color: formData.preferred_color,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('You\'re on the list! We\'ll email you when it\'s ready.')
        // Reset form
        setFormData({
          name: '',
          email: '',
          country: '',
          size: '',
          preferred_color: '',
        })
      } else {
        toast.error(data.error || 'Oops! Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Waitlist submission error:', error)
      toast.error('Oops! Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900">
        <Header />

        {/* Hero Section */}
        <section className="pt-20 pb-12 sm:pt-24 sm:pb-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Oracle Boxing Clothing
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-yellow-100 font-bold mb-6">
              Coming Before The End Of The Year
            </p>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
              Be the first to know when our new clothes are ready. Sign up now.
            </p>
          </div>
        </section>

        {/* Product Showcase Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image */}
              <div>
                <div className="relative overflow-hidden">
                  <img
                    src="https://media.oracleboxing.com/Website/trackymafia.png"
                    alt="Oracle Boxing Tracksuit"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Product Description */}
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Our First Ever Clothing Drop
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed">
                  We're making clothes for boxers. Super comfy. Really good quality.
                  Wear them to show you're a boxer. Show you're part of our team.
                  Support a real boxer who teaches boxing.
                </p>

                {/* Product Specifications */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What Makes It Special</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span className="text-base sm:text-lg text-gray-700">Made from 100% cotton</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span className="text-base sm:text-lg text-gray-700">Super thick and warm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span className="text-base sm:text-lg text-gray-700">Special dye for better color</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span className="text-base sm:text-lg text-gray-700">Made in Britain</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Form Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Join The Waiting List
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-2">
                We'll email you when it's ready. Only a few will be made.
              </p>
              <p className="text-base text-gray-500">
                Your size and color choice helps us plan. You can change your mind when you buy.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl">
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Shipping Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Shipping Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black bg-white text-gray-900"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label htmlFor="size" className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Size *
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black bg-white text-gray-900"
                  >
                    <option value="">Select Size</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Color */}
                <div>
                  <label htmlFor="preferred_color" className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Preferred Color *
                  </label>
                  <select
                    id="preferred_color"
                    name="preferred_color"
                    value={formData.preferred_color}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black bg-white text-gray-900"
                  >
                    <option value="">Select Color</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-black text-white font-black text-lg uppercase tracking-wide rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? 'Signing Up...' : 'Sign Me Up'}
                </button>

                <p className="text-sm text-gray-600 text-center mt-4">
                  We'll send you an email when the clothes are ready to buy.
                </p>
              </div>
            </form>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
