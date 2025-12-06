'use client'

import React, { useEffect, useState } from 'react'
import { useDocumentStore } from '@/store/documentStore'
import { countWords } from '@/utils/export'
import { FiFileText, FiClock, FiHash, FiType, FiBook } from 'react-icons/fi'

const Sidebar: React.FC = () => {
  const { content, lastSaved } = useDocumentStore()
  const [stats, setStats] = useState({ words: 0, characters: 0, charactersNoSpaces: 0 })
  const [outline, setOutline] = useState<Array<{ text: string; level: number; id: string }>>([])

  useEffect(() => {
    // Update word count
    const wordStats = countWords(content)
    setStats(wordStats)

    // Generate document outline from headings
    const headings: Array<{ text: string; level: number; id: string }> = []
    content.forEach((node: any, index) => {
      if (node.type?.startsWith('heading')) {
        const level = parseInt(node.type.replace('heading-', '')) || 1
        const text = node.children?.map((child: any) => child.text).join('') || ''
        headings.push({ text, level, id: `heading-${index}` })
      }
    })
    setOutline(headings)
  }, [content])

  const handleOutlineClick = (id: string) => {
    // Scroll to heading - this would require adding IDs to heading elements
    const element = document.querySelector(`[data-heading-id="${id}"]`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="sidebar no-print w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto">
      {/* Document Stats */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FiFileText /> Document Stats
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <FiType /> Words
            </span>
            <span className="font-medium">{stats.words.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <FiHash /> Characters
            </span>
            <span className="font-medium">{stats.characters.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-xs">
              (no spaces)
            </span>
            <span className="font-medium text-xs">{stats.charactersNoSpaces.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Pages</span>
            <span className="font-medium">{Math.ceil(stats.words / 250)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <FiClock /> Last Saved
            </span>
            <span className="font-medium text-xs">{formatTime(lastSaved)}</span>
          </div>
        </div>
      </div>

      {/* Document Outline */}
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FiBook /> Document Outline
        </h3>
        
        {outline.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No headings yet. Use heading styles to create an outline.
          </p>
        ) : (
          <div className="space-y-1">
            {outline.map((heading, index) => (
              <button
                key={index}
                onClick={() => handleOutlineClick(heading.id)}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
              >
                <span className={`${heading.level === 1 ? 'font-semibold' : ''}`}>
                  {heading.text || '(Empty heading)'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reading Time */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold mb-2">Reading Time</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Approx. {Math.ceil(stats.words / 200)} min
        </p>
      </div>

      {/* Page Count by Format */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold mb-2">Estimated Pages</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Single-spaced:</span>
            <span>{Math.ceil(stats.words / 500)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Double-spaced:</span>
            <span>{Math.ceil(stats.words / 250)}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <button 
            onClick={() => navigator.clipboard.writeText(JSON.stringify(stats))}
            className="w-full text-left px-3 py-2 text-sm rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            Copy Statistics
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
