'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { io, type Socket } from 'socket.io-client'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/lib/auth-context'
import { fetchApi, type ChatGroup, type Message, type PaginatedResponse } from '@/lib/api'
import { timeAgo } from '@/lib/timeago'

const SOCKET_URL = 'http://localhost:3001'

export default function ChatRoomPage() {
  const { t } = useTranslation()
  const { user, getToken } = useAuth()
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const [groups, setGroups] = useState<ChatGroup[]>([])
  const [currentGroup, setCurrentGroup] = useState<ChatGroup | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const prevMessageCount = useRef(0)

  const scrollToBottom = useCallback((smooth = true) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    }, 50)
  }, [])

  useEffect(() => {
    fetchApi<ChatGroup[]>('/chat/groups')
      .then(setGroups)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const found = groups.find((g) => g.id === roomId)
    if (found) setCurrentGroup(found)
    else {
      fetchApi<ChatGroup>(`/chat/groups/${roomId}`)
        .then(setCurrentGroup)
        .catch(() => router.push('/chat'))
    }
  }, [roomId, groups, router])

  const fetchMessages = useCallback(
    async (pageNum: number, append = false) => {
      try {
        setLoadingMessages(true)
        const res = await fetchApi<PaginatedResponse<Message>>('/chat/messages', {
          params: { groupId: roomId, page: pageNum, limit: 20 },
        })

        if (append) {
          setMessages((prev) => [...res.data, ...prev])
        } else {
          setMessages(res.data)
        }
        setTotalPages(res.totalPages)
        setPage(pageNum)

        if (!append) {
          setTimeout(() => scrollToBottom(false), 100)
        }
      } catch {
        /* ignore */
      } finally {
        setLoadingMessages(false)
        setLoading(false)
      }
    },
    [roomId, scrollToBottom],
  )

  useEffect(() => {
    if (roomId) {
      setMessages([])
      setPage(1)
      setTotalPages(1)
      fetchMessages(1)
    }
  }, [roomId, fetchMessages])

  useEffect(() => {
    const token = getToken()
    if (!token || !roomId || !currentGroup) return

    const socket = io(SOCKET_URL, { query: { token } })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join:room', roomId)
    })

    socket.on('chat:message', (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev
        return [...prev, message]
      })
    })

    socket.on('chat:typing', ({ roomId: rId, userId, isTyping: typing }: { roomId: string; userId: string; isTyping: boolean }) => {
      if (rId !== roomId || userId === user?.id) return
      setTypingUsers((prev) => {
        const next = new Set(prev)
        if (typing) next.add(userId)
        else next.delete(userId)
        return next
      })
    })

    return () => {
      socket.emit('leave:room', roomId)
      socket.disconnect()
      socketRef.current = null
    }
  }, [roomId, currentGroup, getToken, user?.id])

  useEffect(() => {
    if (messages.length > 0 && messages.length > prevMessageCount.current && prevMessageCount.current > 0) {
      scrollToBottom()
    }
    prevMessageCount.current = messages.length
  }, [messages.length, scrollToBottom])

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || !socketRef.current) return

      socketRef.current.emit('chat:send', {
        groupId: roomId,
        message: input.trim(),
      })
      setInput('')
    },
    [input, roomId],
  )

  const handleTyping = useCallback(() => {
    if (!socketRef.current) return

    if (!isTyping) {
      setIsTyping(true)
      socketRef.current.emit('chat:typing', { roomId, isTyping: true })
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false)
      socketRef.current?.emit('chat:typing', { roomId, isTyping: false })
    }, 2000)
  }, [roomId, isTyping])

  const handleLoadOlder = () => {
    if (page < totalPages && !loadingMessages) {
      const container = messagesContainerRef.current
      const prevScrollHeight = container?.scrollHeight || 0

      fetchMessages(page + 1, true).then(() => {
        setTimeout(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - prevScrollHeight
          }
        }, 50)
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !currentGroup) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-red-500">{error || 'Percakapan tidak ditemukan'}</p>
      </div>
    )
  }

  const typingName = typingUsers.size > 0
    ? `${[...typingUsers].map((id) => {
        const member = currentGroup
        return id === user?.id ? '' : 'Seseorang'
      }).filter(Boolean).join(', ')} ${t('chat.typing')}`
    : ''

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-4 lg:-m-6">
      <div className="hidden lg:flex lg:flex-col w-80 bg-white border-r border-gray-200 rounded-l-xl overflow-hidden">
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
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/chat/${group.id}`}
              className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${
                group.id === roomId ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                {group.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">{group.name}</h3>
                {group.lastMessage && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {group.lastMessage.sender.name}: {group.lastMessage.message}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white lg:rounded-r-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
          <button
            onClick={() => router.push('/chat')}
            className="lg:hidden p-1 -ml-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
            {currentGroup.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{currentGroup.name}</h2>
            {currentGroup.memberCount > 0 && (
              <p className="text-xs text-gray-400">{currentGroup.memberCount} anggota</p>
            )}
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50"
        >
          {page < totalPages && (
            <div className="text-center">
              <button
                onClick={handleLoadOlder}
                disabled={loadingMessages}
                className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {loadingMessages ? t('common.loading') : t('chat.load_older')}
              </button>
            </div>
          )}

          {loadingMessages && messages.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <p className="text-sm">Belum ada pesan</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === user?.id
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${isOwn ? 'order-1' : 'order-1'}`}>
                    {!isOwn && (
                      <p className="text-xs text-gray-400 mb-1 ml-1">{msg.sender.name}</p>
                    )}
                    <div
                      className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      {msg.message}
                    </div>
                    <p className={`text-[10px] text-gray-400 mt-0.5 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>
                      {timeAgo(msg.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })
          )}

          {typingUsers.size > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              {typingName}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="flex items-end gap-2 p-4 border-t border-gray-100 bg-white">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              handleTyping()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e)
              }
            }}
            rows={1}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
            placeholder={t('chat.message_placeholder')}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
