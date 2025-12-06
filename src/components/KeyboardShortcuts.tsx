'use client'

import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { KEYBOARD_SHORTCUTS } from '@/utils/constants'

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('')

  if (!isOpen) return null

  const filteredShortcuts = KEYBOARD_SHORTCUTS.filter(
    (shortcut) =>
      shortcut.action.toLowerCase().includes(search.toLowerCase()) ||
      shortcut.key.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shortcuts..."
          className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        />

        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Shortcut</th>
              </tr>
            </thead>
            <tbody>
              {filteredShortcuts.map((shortcut, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3">{shortcut.action}</td>
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredShortcuts.length === 0 && (
            <p className="text-center py-8 text-gray-500">No shortcuts found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcuts
