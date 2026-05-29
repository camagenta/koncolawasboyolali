'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
import { navGroups, DashboardIcon, AlumniIcon, JobsIcon, MoreIcon } from './nav-items'
import { BottomSheet } from './bottom-sheet'

const MAIN_TABS = [
  { href: '/', icon: DashboardIcon, labelKey: 'Beranda' },
  { href: '/alumni', icon: AlumniIcon, labelKey: 'Jaringan' },
  { href: '/jobs', icon: JobsIcon, labelKey: 'Karir' },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [sheetOpen, setSheetOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  const isItemVisible = (item: { roles?: string[] }) => {
    if (!item.roles) return true
    if (!user) return false
    return item.roles.includes(user.role)
  }

  const filteredGroups = navGroups
    .map(group => ({
      ...group,
      children: group.children.filter(isItemVisible),
    }))
    .filter(group => {
      if (group.children.length === 0) return false
      if (!group.roles) return true
      if (!user) return false
      return group.roles.includes(user.role)
    })

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {MAIN_TABS.map((tab) => {
            const active = isActive(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="w-5 h-5">{tab.icon}</span>
                <span>{tab.labelKey}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setSheetOpen(true)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sheetOpen ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="w-5 h-5">{MoreIcon}</span>
            <span>Lainnya</span>
          </button>
        </div>
      </nav>

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Menu">
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <div key={group.labelKey}>
              <div className="flex items-center gap-2 px-1 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span className="w-4 h-4">{group.icon}</span>
                {t(group.labelKey)}
              </div>
              <div className="mt-1 space-y-0.5">
                {group.children.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="w-5 h-5 shrink-0">{item.icon}</span>
                      {t(item.labelKey)}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
