'use client'

import Image from 'next/image'

interface VideoPlayerProps {
  videoUrl?: string
  thumbnail?: string
  title: string
}

export function VideoPlayer({ videoUrl = 'https://sb.oracleboxing.com/Website/optimized/videos/VSL2_2.webm', thumbnail, title }: VideoPlayerProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-sm">TRAILER VIDEO COMING SOON</p>
        </div>
      )}
    </div>
  )
}
