'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product, MerchVariant } from '@/lib/types'

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  hasPhysicalItems: boolean
  addItem: (product: Product, variant?: MerchVariant, metadata?: Record<string, string>) => void
  removeItem: (productId: string, variantSku?: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'oracle-boxing-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isHydrated])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const hasPhysicalItems = items.some(item => item.product.type === 'merch')

  const addItem = (product: Product, variant?: MerchVariant, metadata?: Record<string, string>) => {
    setItems(currentItems => {
      // Determine the price_id to use
      const price_id = variant ? variant.stripe_price_id : product.stripe_price_id
      let updatedItems = [...currentItems]

      // AUTO-SWAP LOGIC FOR MEMBERSHIPS
      if (product.type === 'membership') {
        // If adding 6-month and monthly exists, remove monthly
        if (product.id === 'membership-6month') {
          updatedItems = updatedItems.filter(item => item.product.id !== 'membership-monthly')
        }
        // If adding annual and monthly/6-month exists, remove lower tiers
        if (product.id === 'membership-annual') {
          updatedItems = updatedItems.filter(
            item => item.product.id !== 'membership-monthly' && item.product.id !== 'membership-6month'
          )
        }
      }

      // Note: AUTO-SWAP LOGIC FOR COURSE BUNDLE is handled by CourseBundleUpsellBump component
      // We don't auto-swap here to avoid import issues with products array

      // Check if item already exists
      const existingIndex = updatedItems.findIndex(item => {
        if (variant && item.variant) {
          return item.product.id === product.id && item.variant.sku === variant.sku
        }
        return item.product.id === product.id && !item.variant
      })

      if (existingIndex > -1) {
        // All products have max quantity of 1 - don't increase
        return updatedItems
      }

      // Add new item
      return [
        ...updatedItems,
        {
          product,
          quantity: 1,
          variant,
          price_id,
          metadata
        }
      ]
    })
  }

  const removeItem = (productId: string, variantSku?: string) => {
    setItems(currentItems =>
      currentItems.filter(item => {
        if (variantSku && item.variant) {
          return !(item.product.id === productId && item.variant.sku === variantSku)
        }
        return item.product.id !== productId
      })
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        hasPhysicalItems,
        addItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
