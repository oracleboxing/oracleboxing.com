'use client'

import { useState, ButtonHTMLAttributes, ReactNode } from 'react'

interface LiquidGlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark'
}

export function LiquidGlassButton({
  children,
  size = 'md',
  variant = 'light',
  className = '',
  onClick,
  ...props
}: LiquidGlassButtonProps) {
  const [isMagnified, setIsMagnified] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsMagnified(true)
    setTimeout(() => setIsMagnified(false), 400)
    onClick?.(e)
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const variantClasses = {
    light: {
      base: 'bg-white/40 border-white/60 text-gray-900',
      hover: 'hover:bg-white/50',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
    },
    dark: {
      base: 'bg-white/20 border-white/30 text-white',
      hover: 'hover:bg-white/30',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`rounded-full ${variantClasses[variant].base} border font-semibold transition-all duration-200 ${
        isMagnified ? 'scale-105' : `hover:scale-[1.02] ${variantClasses[variant].hover}`
      } ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: variantClasses[variant].boxShadow
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default LiquidGlassButton
