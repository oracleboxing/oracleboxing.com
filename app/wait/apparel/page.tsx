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
