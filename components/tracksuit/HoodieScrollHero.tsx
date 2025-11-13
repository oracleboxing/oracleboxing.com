'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function HoodieScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Enhanced parallax effects with smoother transitions
  // Sequence 1: Title - smooth fade in, long hold, smooth fade out
  const textOpacity1 = useTransform(scrollYProgress, [0, 0.08, 0.25, 0.32], [0, 1, 1, 0])
  const textY1 = useTransform(scrollYProgress, [0, 0.08, 0.32], [20, 0, -20])

  // Sequence 2: "The way people treat you" - elegant transition
  const textOpacity2 = useTransform(scrollYProgress, [0.32, 0.4, 0.58, 0.65], [0, 1, 1, 0])
  const textY2 = useTransform(scrollYProgress, [0.32, 0.4, 0.65], [20, 0, -20])

  // Sequence 3: "This hoodie was designed" - final hold
  const textOpacity3 = useTransform(scrollYProgress, [0.65, 0.72, 1], [0, 1, 1])
  const textY3 = useTransform(scrollYProgress, [0.65, 0.72], [20, 0])

  // Refined image parallax - more subtle and premium
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.2, 0.5, 0.7, 0.9])

  return (
    <div ref={containerRef} className="relative min-h-[400vh]">
      {/* Fixed viewport for parallax effect */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111] to-[#0a0a0a]" />

        {/* Placeholder hoodie image with parallax */}
        <motion.div
          style={{ scale: imageScale, opacity: imageOpacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-full max-w-2xl aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg opacity-20" />
        </motion.div>

        {/* Scrolling text overlays with vertical movement */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="max-w-4xl px-8 text-center">
            {/* Text sequence 1 */}
            <motion.div
              style={{ opacity: textOpacity1, y: textY1 }}
              className="absolute inset-0 flex items-center justify-center px-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                Oracle Boxing Hoodie
              </h1>
            </motion.div>

            {/* Text sequence 2 */}
            <motion.div
              style={{ opacity: textOpacity2, y: textY2 }}
              className="absolute inset-0 flex items-center justify-center px-8"
            >
              <p className="text-2xl md:text-4xl text-gray-100 max-w-3xl leading-relaxed font-light">
                The way people treat you changes when they know you can fight.
              </p>
            </motion.div>

            {/* Text sequence 3 */}
            <motion.div
              style={{ opacity: textOpacity3, y: textY3 }}
              className="absolute inset-0 flex items-center justify-center px-8"
            >
              <p className="text-2xl md:text-4xl text-gray-100 max-w-3xl leading-relaxed font-light">
                This hoodie was designed so that they know without you saying a word.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
