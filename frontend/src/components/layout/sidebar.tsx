'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
import { navGroups, ChevronIcon } from './nav-items'
import type { NavGroup } from './nav-items'

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const isActive = useCallback(
    (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href)),
    [pathname]
  )

  const filteredGroups = navGroups
    .map(group => ({
      ...group,
      children: group.children.filter(item => {
        if (!item.roles) return true
        if (!user) return false
        return item.roles.includes(user.role)
      }),
    }))
    .filter(group => {
      if (group.children.length === 0) return false
      if (!group.roles) return true
      if (!user) return false
      return group.roles.includes(user.role)
    })

  const activeGroup = filteredGroups.find(g => g.children.some(item => isActive(item.href)))

  const isGroupExpanded = (group: NavGroup) =>
    expandedGroups.has(group.labelKey) || activeGroup?.labelKey === group.labelKey

  const toggleGroup = (labelKey: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(labelKey)) next.delete(labelKey)
      else next.add(labelKey)
      return next
    })
  }

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">{t('app.name')}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{t('app.tagline')}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredGroups.map((group) => {
          const expanded = isGroupExpanded(group)
          const groupActive = group === activeGroup
          return (
            <div key={group.labelKey}>
              <button
                onClick={() => toggleGroup(group.labelKey)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  groupActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="w-5 h-5 shrink-0">{group.icon}</span>
                <span className="truncate">{t(group.labelKey)}</span>
                <span
                  className={`ml-auto transition-transform duration-200 ${
                    expanded ? 'rotate-180' : ''
                  }`}
                >
                  {ChevronIcon}
                </span>
              </button>
              {expanded && (
                <div className="mt-1 space-y-0.5">
                  {group.children.map((item) => {
                    const itemActive = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2 pl-8 rounded-lg text-sm font-medium transition-colors ${
                          itemActive
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
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
