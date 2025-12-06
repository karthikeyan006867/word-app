'use client'

import React, { useState } from 'react'
import { FiX, FiMessageSquare, FiTrash2, FiCheck, FiEdit2 } from 'react-icons/fi'

interface Comment {
  id: string
  text: string
  author: string
  timestamp: Date
  resolved: boolean
  position?: { start: number; end: number }
}

interface CommentsReviewProps {
  isOpen: boolean
  onClose: () => void
}

const CommentsReview: React.FC<CommentsReviewProps> = ({ isOpen, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      text: 'This section needs more detail',
      author: 'User',
      timestamp: new Date(),
      resolved: false,
    },
  ])
  const [newComment, setNewComment] = useState('')
  const [trackChanges, setTrackChanges] = useState(false)

  if (!isOpen) return null

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        author: 'Current User',
        timestamp: new Date(),
        resolved: false,
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  const handleResolveComment = (id: string) => {
    setComments(comments.map(c => c.id === id ? { ...c, resolved: true } : c))
  }

  const handleDeleteComment = (id: string) => {
    if (confirm('Delete this comment?')) {
      setComments(comments.filter(c => c.id !== id))
    }
  }

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Comments & Review</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Track Changes Toggle */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={trackChanges}
              onChange={(e) => setTrackChanges(e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <div className="font-semibold">Track Changes</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Record all edits and revisions (Database integration required)
              </div>
            </div>
          </label>
        </div>

        {/* Add Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Add Comment</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Type your comment..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FiMessageSquare />
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-3">
          <h3 className="font-semibold">All Comments ({comments.length})</h3>
          {comments.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 rounded-lg border ${
                  comment.resolved
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{comment.author}</div>
                    <div className="text-xs text-gray-500">{formatTime(comment.timestamp)}</div>
                  </div>
                  <div className="flex gap-1">
                    {!comment.resolved && (
                      <button
                        onClick={() => handleResolveComment(comment.id)}
                        className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                        title="Resolve comment"
                      >
                        <FiCheck className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      title="Delete comment"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm">{comment.text}</p>
                {comment.resolved && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <FiCheck className="w-3 h-3" /> Resolved
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Revision History Placeholder */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FiEdit2 /> Revision History
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            View and restore previous versions of your document (Database integration required)
          </p>
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed opacity-50"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentsReview
