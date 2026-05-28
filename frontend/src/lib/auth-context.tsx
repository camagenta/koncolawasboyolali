'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'ikasmansa_token'
const USER_KEY = 'ikasmansa_user'

function getStoredAuth(): { token: string | null; user: User | null } {
  if (typeof window === 'undefined') return { token: null, user: null }
  try {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      return { token: storedToken, user: JSON.parse(storedUser) }
    }
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
  return { token: null, user: null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ token: string | null; user: User | null }>({
    token: null,
    user: null,
  })
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored = getStoredAuth()
    setState(stored)
    setReady(true)
  }, [])

  const login = useCallback(() => {
    window.location.href = 'http://localhost:3001/api/auth/google'
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setState({ token: null, user: null })
    router.push('/login')
  }, [router])

  const getToken = useCallback(() => {
    if (state.token) return state.token
    return localStorage.getItem(TOKEN_KEY)
  }, [state.token])

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isLoading: !ready,
        isAuthenticated: !!state.token,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
