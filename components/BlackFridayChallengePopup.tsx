'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export function BlackFridayChallengePopup() {
  // Popup disabled - return null to hide completely
  return null

  const [isOpen, setIsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Countdown to December 2, 10 PM UK time (22:00 GMT = 22:00 UTC in winter)
  useEffect(() => {
    const targetDate = new Date('2025-12-02T22:00:00+00:00') // 10 PM UK time

    const updateCountdown = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Check if user has already closed the popup
    const hasClosedPopup = localStorage.getItem('bfc-popup-closed')

    if (!hasClosedPopup) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('bfc-popup-closed', 'true')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close popup"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Content */}
          <div className="text-center">
            {/* Badge */}
            <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 text-black border-2 border-black rounded-lg font-black text-sm uppercase tracking-wider">
              Limited 30 Spots
            </div>

            {/* Headline */}
            <h2 className="text-section font-bold text-gray-900 mb-3">
              The Black Friday Challenge
            </h2>

            {/* Subheadline */}
            <p className="text-sub font-bold text-gray-900 mb-4">
              Learn Boxing Fundamentals In 48 Days
            </p>

            {/* Description */}
            <p className="text-body text-gray-700 leading-relaxed mb-4">
              6-week structured challenge for beginners. Train from home, get coached over the holidays.
            </p>

            {/* Pricing */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-title text-gray-500 line-through">$197</span>
              <span className="text-section font-black text-gray-900">$97</span>
              <span className="inline-block bg-yellow-100 text-black px-3 py-1 rounded-lg text-sm font-black uppercase">
                50% OFF
              </span>
            </div>

            {/* Countdown Timer */}
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <div className="text-xs font-bold uppercase tracking-wide mb-3 text-center text-gray-700">
                Starts In:
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="text-sub font-black mb-0.5 text-gray-900">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase opacity-60 font-medium text-gray-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-sub font-black mb-0.5 text-gray-900">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase opacity-60 font-medium text-gray-600">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-sub font-black mb-0.5 text-gray-900">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase opacity-60 font-medium text-gray-600">Mins</div>
                </div>
                <div className="text-center">
                  <div className="text-sub font-black mb-0.5 text-gray-900">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase opacity-60 font-medium text-gray-600">Secs</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/6wc"
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-white text-black border-4 border-black rounded-xl font-black text-title uppercase tracking-wide hover:bg-black hover:text-white transition-all text-center"
              >
                Learn More
              </Link>
              <Link
                href="/checkout?product=bfc&source=popup"
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-yellow-100 text-black border-4 border-black rounded-xl font-black text-title uppercase tracking-wide hover:bg-black hover:text-yellow-100 transition-all text-center"
              >
                Buy Now →
              </Link>
            </div>

            {/* Close text */}
            <button
              onClick={handleClose}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              No thanks, I'll continue browsing
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
