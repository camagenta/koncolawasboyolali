'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
import { fetchApi } from '@/lib/api'
import { timeAgo } from '@/lib/timeago'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface NotificationItem {
  id: string
  type: string
  title: string
  body?: string
  link?: string
  isRead: boolean
  createdAt: string
}

export function Header() {
  const { user, logout } = useAuth()
  const { t, lang, setLang } = useTranslation()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetchApi<{ count: number }>('/notifications/unread-count')
      setUnreadCount(res.count)
    } catch {}
  }, [])

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetchApi<{ data: NotificationItem[] }>('/notifications?limit=5')
      setNotifications(res.data)
    } catch {}
  }, [])

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  useEffect(() => {
    if (notifOpen) fetchNotifications()
  }, [notifOpen, fetchNotifications])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotifClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await fetchApi(`/notifications/${notif.id}/read`, { method: 'PUT' })
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch {}
    }
    setNotifOpen(false)
    if (notif.link) router.push(notif.link)
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case 'forum_reply':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      case 'forum_like':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      case 'job_approved':
      case 'job_rejected':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )
    }
  }

  return (
    <header className="sticky top-0 z-30 h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 lg:px-6">
      <div className="flex items-center gap-2 lg:gap-3 min-w-0">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo-sma1.png"
            alt="Logo SMA N 1 Boyolali"
            className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover"
          />
          <span className="text-sm lg:text-base font-bold text-gray-800 truncate">
            Konco Lawas
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1 lg:gap-2">
        <Link
          href="/profile"
          className="lg:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </Link>

        <button
          onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
          className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          {lang === 'id' ? 'EN' : 'ID'}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Notifikasi</span>
                <Link
                  href="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Lihat semua
                </Link>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-400">Belum ada notifikasi</div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full text-left p-3 flex gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                        !notif.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">{typeIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{notif.title}</p>
                        {notif.body && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{notif.body}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notif.createdAt)}</p>
                      </div>
                      {!notif.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Profil Saya
              </Link>
              <button
                onClick={() => { setDropdownOpen(false); logout() }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                {t('auth.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
