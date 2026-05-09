'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  business_name?: string
  phone_number?: string
  user_type?: string
  verified?: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  role: string | null
  userId: number | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  setUserAndToken: (user: User, token: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function readUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

function readToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setUser(readUser())
    setToken(readToken())
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
    setUser(null)
    setToken(null)
    router.push('/login')
  }, [router])

  const setUserAndToken = useCallback((u: User, t: string) => {
    setUser(u)
    setToken(t)
  }, [])

  const role = user?.user_type ?? null
  const userId = user?.id ?? null
  const isAuthenticated = !!user && !!token

  return (
    <AuthContext.Provider value={{ user, token, role, userId, isAuthenticated, isLoading, logout, setUserAndToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
