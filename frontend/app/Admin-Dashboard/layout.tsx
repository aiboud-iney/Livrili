'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return
    if (!user || !role) {
      router.replace('/login')
      return
    }
    if (role !== 'admin') {
      router.replace('/Dashboard')
    }
  }, [user, role, isLoading, router, pathname])

  if (isLoading || !user || role !== 'admin') {
    return null
  }

  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  )
}
