'use client'

import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useDocumentStore } from '@/store/documentStore'

interface PageLayoutProps {
  isOpen: boolean
  onClose: () => void
}

const PageLayout: React.FC<PageLayoutProps> = ({ isOpen, onClose }) => {
  const [pageSize, setPageSize] = useState('letter')
  const [orientation, setOrientation] = useState('portrait')
  const [margins, setMargins] = useState({ top: 1, bottom: 1, left: 1, right: 1 })
  const [columns, setColumns] = useState(1)
  const [columnGap, setColumnGap] = useState(0.5)

  if (!isOpen) return null

  const handleApply = () => {
    // Apply page layout settings
    const editorPage = document.querySelector('.editor-page') as HTMLElement
    if (editorPage) {
      // Apply margins
      editorPage.style.padding = `${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in`
      
      // Apply columns
      if (columns > 1) {
        editorPage.style.columnCount = columns.toString()
        editorPage.style.columnGap = `${columnGap}in`
      } else {
        editorPage.style.columnCount = 'auto'
      }
      
      // Apply page size
      if (pageSize === 'a4') {
        editorPage.style.width = '8.27in'
        editorPage.style.minHeight = '11.69in'
      } else if (pageSize === 'legal') {
        editorPage.style.width = '8.5in'
        editorPage.style.minHeight = '14in'
      } else {
        editorPage.style.width = '8.5in'
        editorPage.style.minHeight = '11in'
      }
      
      // Apply orientation
      if (orientation === 'landscape') {
        const width = editorPage.style.width
        const height = editorPage.style.minHeight
        editorPage.style.width = height
        editorPage.style.minHeight = width
      }
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Page Layout</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Page Size */}
          <div>
            <label className="block text-sm font-medium mb-2">Page Size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            >
              <option value="letter">Letter (8.5&quot; × 11&quot;)</option>
              <option value="a4">A4 (8.27&quot; × 11.69&quot;)</option>
              <option value="legal">Legal (8.5&quot; × 14&quot;)</option>
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium mb-2">Orientation</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="portrait"
                  checked={orientation === 'portrait'}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Portrait</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="landscape"
                  checked={orientation === 'landscape'}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Landscape</span>
              </label>
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="block text-sm font-medium mb-2">Margins (inches)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Top</label>
                <input
                  type="number"
                  value={margins.top}
                  onChange={(e) => setMargins({ ...margins, top: parseFloat(e.target.value) })}
                  step="0.25"
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Bottom</label>
                <input
                  type="number"
                  value={margins.bottom}
                  onChange={(e) => setMargins({ ...margins, bottom: parseFloat(e.target.value) })}
                  step="0.25"
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Left</label>
                <input
                  type="number"
                  value={margins.left}
                  onChange={(e) => setMargins({ ...margins, left: parseFloat(e.target.value) })}
                  step="0.25"
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Right</label>
                <input
                  type="number"
                  value={margins.right}
                  onChange={(e) => setMargins({ ...margins, right: parseFloat(e.target.value) })}
                  step="0.25"
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Columns */}
          <div>
            <label className="block text-sm font-medium mb-2">Columns</label>
            <div className="space-y-3">
              <select
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              >
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
              
              {columns > 1 && (
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Column Gap (inches)
                  </label>
                  <input
                    type="number"
                    value={columnGap}
                    onChange={(e) => setColumnGap(parseFloat(e.target.value))}
                    step="0.1"
                    min="0"
                    max="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageLayout
