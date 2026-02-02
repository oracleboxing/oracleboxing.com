"use client"
import React from 'react'

interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-900 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
