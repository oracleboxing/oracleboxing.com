'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/lib/types'

interface MerchCartItem {
  product: Product
  quantity: number
  metadata?: Record<string, string>
}

interface MerchCartContextType {
  items: MerchCartItem[]
  total: number
  isOpen: boolean
  addItem: (product: Product, metadata?: Record<string, string>) => void
  removeItem: (productId: string, metadata?: Record<string, string>) => void
  updateQuantity: (productId: string, metadata: Record<string, string> | undefined, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const MerchCartContext = createContext<MerchCartContextType | undefined>(undefined)

export function MerchCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MerchCartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('merch_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load merch cart:', error)
      }
    }
    setHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('merch_cart', JSON.stringify(items))
    }
  }, [items, hydrated])

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const addItem = (product: Product, metadata?: Record<string, string>) => {
    setItems(prevItems => {
      // Check if exact same item (product + metadata) already exists
      const metadataString = JSON.stringify(metadata || {})
      const existingIndex = prevItems.findIndex(item =>
        item.product.id === product.id &&
        JSON.stringify(item.metadata || {}) === metadataString
      )

      if (existingIndex >= 0) {
        // Item with same product and metadata exists - update it
        const newItems = [...prevItems]
        newItems[existingIndex] = { product, quantity: 1, metadata }
        return newItems
      } else {
        // Add as new item (allows multiple of same product with different colors/sizes)
        return [...prevItems, { product, quantity: 1, metadata }]
      }
    })
    setIsOpen(true) // Open cart when item added
  }

  const removeItem = (productId: string, metadata?: Record<string, string>) => {
    setItems(prevItems => {
      if (metadata) {
        // Remove specific item by product ID and metadata
        const metadataString = JSON.stringify(metadata)
        return prevItems.filter(item =>
          !(item.product.id === productId && JSON.stringify(item.metadata || {}) === metadataString)
        )
      } else {
        // Remove all items with this product ID
        return prevItems.filter(item => item.product.id !== productId)
      }
    })
  }

  const updateQuantity = (productId: string, metadata: Record<string, string> | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, metadata)
      return
    }

    setItems(prevItems => {
      const metadataString = JSON.stringify(metadata || {})
      return prevItems.map(item => {
        if (item.product.id === productId && JSON.stringify(item.metadata || {}) === metadataString) {
          return { ...item, quantity }
        }
        return item
      })
    })
  }

  const clearCart = () => {
    setItems([])
    setIsOpen(false)
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <MerchCartContext.Provider
      value={{
        items,
        total,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </MerchCartContext.Provider>
  )
}

export function useMerchCart() {
  const context = useContext(MerchCartContext)
  if (context === undefined) {
    throw new Error('useMerchCart must be used within a MerchCartProvider')
  }
  return context
}
