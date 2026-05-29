'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { MobileNav } from './mobile-nav'

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, getToken } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [onboardingCheckDone, setOnboardingCheckDone] = useState(false)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated || isLoading) return

    if (pathname === '/profile') {
      setOnboardingCheckDone(true)
      return
    }

    let cancelled = false

    const check = async () => {
      try {
        const token = getToken()
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'
        const res = await fetch(`${API_BASE}/alumni/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (cancelled) return

        if (res.status === 404) {
          setNeedsOnboarding(true)
        } else if (res.ok) {
          const data = await res.json()
          setNeedsOnboarding(!data.tahunMasuk || !data.tahunLulus)
        } else {
          setNeedsOnboarding(true)
        }
      } catch {
        if (!cancelled) setNeedsOnboarding(true)
      } finally {
        if (!cancelled) setOnboardingCheckDone(true)
      }
    }

    check()

    return () => { cancelled = true }
  }, [isAuthenticated, isLoading, pathname, getToken])

  useEffect(() => {
    if (onboardingCheckDone && needsOnboarding && pathname !== '/profile') {
      router.push('/profile')
    }
  }, [onboardingCheckDone, needsOnboarding, pathname, router])

  if (isLoading || (isAuthenticated && !onboardingCheckDone)) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 pb-16 lg:pb-0">
        <Header />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
