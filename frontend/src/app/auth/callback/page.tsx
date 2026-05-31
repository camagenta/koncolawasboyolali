'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const TOKEN_KEY = 'ikasmansa_token'
const USER_KEY = 'ikasmansa_user'

function CallbackHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const userEncoded = searchParams.get('user')

    if (token && userEncoded) {
      try {
        const user = JSON.parse(atob(userEncoded))
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        // Full page reload required: AuthProvider reads localStorage on mount.
        // router.push would not re-initialize AuthProvider, causing a race
        // condition where AppShell sees isAuthenticated=false and redirects away.
        window.location.href = '/alumni'
      } catch {
        window.location.href = '/?error=invalid_data'
      }
    } else {
      window.location.href = '/?error=no_token'
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
      <p className="text-gray-500 text-sm">Memproses login...</p>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}
