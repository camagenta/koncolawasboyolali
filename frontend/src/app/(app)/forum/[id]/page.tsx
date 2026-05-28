'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/lib/auth-context'
import { fetchApi, type Thread, type Comment } from '@/lib/api'
import { timeAgo } from '@/lib/timeago'

export default function ThreadDetailPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const threadId = params.id as string

  const [thread, setThread] = useState<Thread | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editingThread, setEditingThread] = useState(false)
  const [editThreadTitle, setEditThreadTitle] = useState('')
  const [editThreadContent, setEditThreadContent] = useState('')

  const fetchThread = useCallback(async () => {
    try {
      const data = await fetchApi<Thread>(`/forums/threads/${threadId}`)
      setThread(data)
      return data
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat thread')
      return null
    }
  }, [threadId])

  const fetchComments = useCallback(async () => {
    try {
      const data = await fetchApi<{ data: Comment[] }>(`/forums/threads/${threadId}/comments`)
      setComments(data.data)
    } catch {
      /* ignore */
    }
  }, [threadId])

  const fetchLikes = useCallback(async () => {
    try {
      const data = await fetchApi<{ likes: number; liked: boolean }>(`/forums/threads/${threadId}/likes`)
      setLikeCount(data.likes)
      setLiked(data.liked)
    } catch {
      /* ignore */
    }
  }, [threadId])

  useEffect(() => {
    Promise.all([fetchThread(), fetchComments(), fetchLikes()]).finally(() => setLoading(false))
  }, [fetchThread, fetchComments, fetchLikes])

  const handleLike = async () => {
    try {
      const data = await fetchApi<{ liked: boolean }>(`/forums/threads/${threadId}/like`, { method: 'POST' })
      setLiked(data.liked)
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1))
    } catch {
      /* ignore */
    }
  }

  const handleCommentLike = async (commentId: string) => {
    try {
      await fetchApi(`/forums/comments/${commentId}/like`, { method: 'POST' })
    } catch {
      /* ignore */
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      const body: Record<string, unknown> = { content: commentText.trim() }
      if (replyTo) body.parentId = replyTo.id
      await fetchApi(`/forums/threads/${threadId}/comments`, {
        method: 'POST',
        body: JSON.stringify(body),
      })
      setCommentText('')
      setReplyTo(null)
      await fetchComments()
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Hapus komentar ini?')) return
    try {
      await fetchApi(`/forums/comments/${commentId}`, { method: 'DELETE' })
      await fetchComments()
    } catch {
      /* ignore */
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return
    try {
      await fetchApi(`/forums/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editText.trim() }),
      })
      setEditingComment(null)
      setEditText('')
      await fetchComments()
    } catch {
      /* ignore */
    }
  }

  const handleSaveThreadEdit = async () => {
    if (!editThreadTitle.trim() || !editThreadContent.trim()) return
    try {
      await fetchApi(`/forums/threads/${threadId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: editThreadTitle.trim(), content: editThreadContent.trim() }),
      })
      setEditingThread(false)
      await fetchThread()
    } catch {
      /* ignore */
    }
  }

  const handleDeleteThread = async () => {
    if (!confirm('Hapus thread ini?')) return
    try {
      await fetchApi(`/forums/threads/${threadId}`, { method: 'DELETE' })
      router.push('/forum')
    } catch {
      /* ignore */
    }
  }

  const buildCommentTree = (flatComments: Comment[]): Comment[] => {
    const map = new Map<string, Comment>()
    const roots: Comment[] = []

    flatComments.forEach((c) => {
      map.set(c.id, { ...c, replies: [] })
    })

    flatComments.forEach((c) => {
      const comment = map.get(c.id)!
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.replies!.push(comment)
      } else {
        roots.push(comment)
      }
    })

    return roots
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !thread) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error || 'Thread tidak ditemukan'}</p>
        <Link href="/forum" className="text-blue-600 text-sm mt-2 inline-block">{t('common.back')}</Link>
      </div>
    )
  }

  const isOwner = user?.id === thread.author.id
  const commentTree = buildCommentTree(comments)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Link
          href="/forum"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          {t('common.back')}
        </Link>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
        {editingThread ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editThreadTitle}
              onChange={(e) => setEditThreadTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={editThreadContent}
              onChange={(e) => setEditThreadContent(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <div className="flex gap-2">
              <button onClick={handleSaveThreadEdit} className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                {t('common.save')}
              </button>
              <button onClick={() => setEditingThread(false)} className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              {thread.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  {t('forum.pinned')}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-3">{thread.title}</h1>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{thread.content}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[10px]">
                    {thread.author.name.charAt(0).toUpperCase()}
                  </div>
                  {thread.author.name}
                </span>
                <span>{timeAgo(thread.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    liked ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
                  }`}
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  {likeCount}
                </button>
                {isOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingThread(true)
                        setEditThreadTitle(thread.title)
                        setEditThreadContent(thread.content)
                      }}
                      className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={handleDeleteThread}
                      className="text-sm text-gray-400 hover:text-red-600 transition-colors"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            {t('forum.comments')} ({comments.length})
          </h2>
        </div>

        {commentTree.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">{t('forum.no_comments')}</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {commentTree.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isOwner={user?.id === comment.author.id}
                depth={0}
                onReply={(id, name) => setReplyTo({ id, name })}
                onLike={handleCommentLike}
                onDelete={handleDeleteComment}
                onEdit={(id) => {
                  setEditingComment(id)
                  setEditText(comment.content)
                }}
                editingComment={editingComment}
                editText={editText}
                setEditText={setEditText}
                onSaveEdit={handleEditComment}
                onCancelEdit={() => setEditingComment(null)}
                t={t}
                timeAgo={timeAgo}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100">
        {replyTo && (
          <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg mb-3 text-sm">
            <span className="text-blue-700">
              {t('common.reply')} <strong>{replyTo.name}</strong>
            </span>
            <button onClick={() => setReplyTo(null)} className="text-blue-500 hover:text-blue-700">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={2}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder={replyTo ? t('forum.reply_placeholder') : t('forum.comment_placeholder')}
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="shrink-0 self-end px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              t('common.send')
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  isOwner,
  depth,
  onReply,
  onLike,
  onDelete,
  onEdit,
  editingComment,
  editText,
  setEditText,
  onSaveEdit,
  onCancelEdit,
  t,
  timeAgo: fmt,
}: {
  comment: Comment
  isOwner: boolean
  depth: number
  onReply: (id: string, name: string) => void
  onLike: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  editingComment: string | null
  editText: string
  setEditText: (v: string) => void
  onSaveEdit: (id: string) => void
  onCancelEdit: () => void
  t: (key: string) => string
  timeAgo: (date: string) => string
}) {
  const isEditing = editingComment === comment.id

  return (
    <div className={depth > 0 ? 'ml-6 pl-4 border-l-2 border-gray-100' : ''}>
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <div className="flex gap-2">
              <button onClick={() => onSaveEdit(comment.id)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                {t('common.save')}
              </button>
              <button onClick={onCancelEdit} className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[8px]">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
                {comment.author.name}
              </span>
              <span>{fmt(comment.createdAt)}</span>
              <button onClick={() => onLike(comment.id)} className="hover:text-blue-600 transition-colors">
                {t('forum.like')}
              </button>
              {depth === 0 && (
                <button onClick={() => onReply(comment.id, comment.author.name)} className="hover:text-blue-600 transition-colors">
                  {t('common.reply')}
                </button>
              )}
              {isOwner && (
                <>
                  <button onClick={() => onEdit(comment.id)} className="hover:text-blue-600 transition-colors">
                    {t('common.edit')}
                  </button>
                  <button onClick={() => onDelete(comment.id)} className="hover:text-red-600 transition-colors">
                    {t('common.delete')}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          isOwner={isOwner}
          depth={depth + 1}
          onReply={onReply}
          onLike={onLike}
          onDelete={onDelete}
          onEdit={onEdit}
          editingComment={editingComment}
          editText={editText}
          setEditText={setEditText}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          t={t}
          timeAgo={fmt}
        />
      ))}
    </div>
  )
}
