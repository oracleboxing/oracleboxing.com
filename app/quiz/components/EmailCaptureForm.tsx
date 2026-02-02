"use client"
import React, { useState } from 'react'

interface Props {
  onSubmit?: (name: string, email: string) => void;
}

export function EmailCaptureForm({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit(name, email)
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="text-neutral-900">Thanks! Redirecting to your full results...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-3 py-2 border border-neutral-300 rounded bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 border border-neutral-300 rounded bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
      />
      <button
        type="submit"
        className="ob-btn ob-btn-primary w-full"
      >
        Get Full PDF Report
      </button>
    </form>
  )
}
