'use client'

import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { getVersionHistory } from '@/utils/export'
import { useDocumentStore } from '@/store/documentStore'

interface VersionHistoryProps {
  isOpen: boolean
  onClose: () => void
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ isOpen, onClose }) => {
  const { setContent, updateSettings } = useDocumentStore()
  const [versions] = useState(getVersionHistory())

  if (!isOpen) return null

  const handleRestore = (version: any) => {
    if (confirm(`Restore version from ${new Date(version.timestamp).toLocaleString()}?`)) {
      setContent(version.content)
      updateSettings({ title: version.title })
      onClose()
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Version History</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Auto-saved versions (last 10)
        </p>

        {versions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No version history yet</p>
            <p className="text-sm text-gray-400 mt-2">Versions are auto-saved every 30 seconds</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold">{version.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(version.timestamp)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Version {versions.length - index}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestore(version)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Cloud Sync</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            With database integration, versions will be synced across devices and preserved indefinitely
          </p>
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed opacity-50"
          >
            Enable Cloud Sync
          </button>
        </div>
      </div>
    </div>
  )
}

export default VersionHistory
