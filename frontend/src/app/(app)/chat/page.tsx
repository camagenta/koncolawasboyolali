'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { fetchApi, type ChatGroup } from '@/lib/api'
import { timeAgo } from '@/lib/timeago'

export default function ChatPage() {
  const { t } = useTranslation()
  const [groups, setGroups] = useState<ChatGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApi<ChatGroup[]>('/chat/groups')
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-4 lg:-m-6">
      <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-sm bg-white border-r border-gray-200 flex flex-col lg:rounded-l-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">{t('nav.chat')}</h1>
            <Link
              href="/chat/groups/new"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-sm">{error}</div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 px-4">
              <svg className="w-12 h-12 mb-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-sm">{t('chat.no_conversations')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {groups.map((group) => (
                <Link
                  key={group.id}
                  href={`/chat/${group.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{group.name}</h3>
                      {group.lastMessage && (
                        <span className="text-xs text-gray-400 shrink-0 ml-2">
                          {timeAgo(group.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {group.lastMessage ? (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {group.lastMessage.sender.name}: {group.lastMessage.message}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {group.memberCount} anggota
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50 rounded-r-xl">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p className="text-sm">{t('chat.select_conversation')}</p>
        </div>
      </div>
    </div>
  )
}
