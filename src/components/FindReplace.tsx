'use client'

import React, { useState } from 'react'
import { FiX, FiSearch, FiRefreshCw } from 'react-icons/fi'

interface FindReplaceProps {
  isOpen: boolean
  onClose: () => void
}

const FindReplace: React.FC<FindReplaceProps> = ({ isOpen, onClose }) => {
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [results, setResults] = useState<number>(0)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  if (!isOpen) return null

  const handleFind = () => {
    // This would integrate with the editor to find text
    // For now, it's a placeholder
    const editorContent = document.getElementById('editor-content')?.innerText || ''
    let searchText = findText
    
    if (!useRegex) {
      searchText = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
    
    const flags = caseSensitive ? 'g' : 'gi'
    const pattern = wholeWord ? `\\b${searchText}\\b` : searchText
    
    try {
      const regex = new RegExp(pattern, flags)
      const matches = editorContent.match(regex)
      setResults(matches?.length || 0)
      if (matches && matches.length > 0) {
        setCurrentIndex(1)
      }
    } catch (error) {
      console.error('Invalid regex:', error)
    }
  }

  const handleReplace = () => {
    // Placeholder for replace functionality
    alert('Replace current match')
  }

  const handleReplaceAll = () => {
    // Placeholder for replace all functionality
    if (confirm(`Replace all ${results} occurrences?`)) {
      alert('All occurrences replaced')
    }
  }

  const handleNext = () => {
    if (currentIndex < results) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 1) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Find & Replace</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Find Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Find</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFind()}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                placeholder="Enter text to find..."
                autoFocus
              />
              <button
                onClick={handleFind}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FiSearch />
              </button>
            </div>
          </div>

          {/* Replace Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Replace with</label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              placeholder="Enter replacement text..."
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Match case</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Match whole word</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Use regular expressions</span>
            </label>
          </div>

          {/* Results */}
          {results > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">
                {currentIndex} of {results} matches
              </span>
              <div className="flex gap-1">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex <= 1}
                  className="px-2 py-1 text-sm rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50"
                >
                  ←
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= results}
                  className="px-2 py-1 text-sm rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleReplace}
              disabled={results === 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Replace
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={results === 0}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiRefreshCw /> Replace All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindReplace
