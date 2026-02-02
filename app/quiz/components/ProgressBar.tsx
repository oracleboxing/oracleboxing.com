"use client"
import React from 'react'

interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
      <div
        className="h-full rounded-full bg-neutral-900 transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
