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
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

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
    if (!stored.token) {
      setState(stored)
      setReady(true)
      return
    }

    // Set local-storage data first so UI renders immediately
    setState(stored)
    setReady(true)

    // Then refresh user data from backend to get the current role/permissions
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${stored.token}` },
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
            setState({ token: null, user: null })
          }
          throw new Error('Auth refresh failed')
        }
        return res.json()
      })
      .then(backendUser => {
        if (backendUser) {
          const freshUser: User = {
            id: backendUser.id,
            email: backendUser.email,
            name: backendUser.name,
            role: backendUser.role,
            avatarUrl: backendUser.avatarUrl,
          }
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
          setState({ token: stored.token, user: freshUser })
        }
      })
      .catch(() => {
        // Keep local-storage data on network errors (offline etc.)
      })
  }, [])

  const login = useCallback(() => {
    window.location.href = '/api/auth/google'
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setState({ token: null, user: null })
    window.location.href = '/'
  }, [])

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
