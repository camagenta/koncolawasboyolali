'use client'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface Category {
  id: string
  name: string
  description?: string
}

export interface Author {
  id: string
  name: string
  avatarUrl?: string
}

export interface Thread {
  id: string
  title: string
  content: string
  categoryId: string
  author: Author
  isPinned: boolean
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  threadId: string
  author: Author
  parentId?: string | null
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface ChatGroup {
  id: string
  name: string
  description?: string
  type: 'public' | 'private'
  maxMembers: number
  memberCount: number
  lastMessage?: Message
  createdAt: string
}

export interface Message {
  id: string
  senderId: string
  sender: Author
  receiverId?: string
  groupId?: string
  message: string
  messageType?: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function fetchApi<T = any>(
  path: string,
  options: RequestInit & { params?: Record<string, string | number | undefined | null> } = {},
): Promise<T> {
  const { params, ...fetchOpts } = options

  let url = `${API_BASE}${path}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') searchParams.set(k, String(v))
    })
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('ikasmansa_token') : null

  const headers: Record<string, string> = {
    ...(fetchOpts.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (fetchOpts.body && typeof fetchOpts.body === 'string') {
    headers['Content-Type'] = 'application/json'
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  let res: Response
  try {
    res = await fetch(url, { ...fetchOpts, headers, signal: controller.signal })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Permintaan waktu habis. Silakan coba lagi.')
    }
    throw new Error('Gagal terhubung ke server. Periksa koneksi Anda.')
  } finally {
    clearTimeout(timeoutId)
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ikasmansa_token')
      localStorage.removeItem('ikasmansa_user')
      window.location.href = '/'
    }
    throw new Error('Sesi telah berakhir. Silakan login kembali.')
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

export async function downloadBlob(url: string, filename: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ikasmansa_token') : null

  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${url}`, { headers })

  if (res.status === 401) {
    localStorage.removeItem('ikasmansa_token')
    localStorage.removeItem('ikasmansa_user')
    window.location.href = '/'
    throw new Error('Sesi telah berakhir. Silakan login kembali.')
  }

  if (!res.ok) throw new Error('Download failed')

  const blob = await res.blob()
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(a.href)
}
