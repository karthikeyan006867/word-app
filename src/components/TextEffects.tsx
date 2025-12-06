'use client'

import React, { useState } from 'react'
import { FiX, FiType } from 'react-icons/fi'
import { Editor, Transforms } from 'slate'
import { useSlate } from 'slate-react'

interface TextEffectsProps {
  isOpen: boolean
  onClose: () => void
}

const TextEffects: React.FC<TextEffectsProps> = ({ isOpen, onClose }) => {
  const editor = useSlate()
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [wordSpacing, setWordSpacing] = useState(0)
  const [textTransform, setTextTransform] = useState('none')
  const [textShadow, setTextShadow] = useState(false)
  const [textOutline, setTextOutline] = useState(false)

  if (!isOpen) return null

  const applyEffects = () => {
    const effects: any = {}
    
    if (letterSpacing !== 0) effects.letterSpacing = `${letterSpacing}px`
    if (wordSpacing !== 0) effects.wordSpacing = `${wordSpacing}px`
    if (textTransform !== 'none') effects.textTransform = textTransform
    if (textShadow) effects.textShadow = '2px 2px 4px rgba(0,0,0,0.3)'
    if (textOutline) effects.textStroke = '1px black'

    Object.keys(effects).forEach(key => {
      Editor.addMark(editor, key, effects[key])
    })

    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiType /> Text Effects
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Letter Spacing */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Letter Spacing: {letterSpacing}px
            </label>
            <input
              type="range"
              min="-5"
              max="10"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Word Spacing */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Word Spacing: {wordSpacing}px
            </label>
            <input
              type="range"
              min="-5"
              max="20"
              value={wordSpacing}
              onChange={(e) => setWordSpacing(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Text Transform */}
          <div>
            <label className="block text-sm font-medium mb-2">Text Transform</label>
            <select
              value={textTransform}
              onChange={(e) => setTextTransform(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            >
              <option value="none">None</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="lowercase">lowercase</option>
              <option value="capitalize">Capitalize Each Word</option>
            </select>
          </div>

          {/* Text Shadow */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={textShadow}
              onChange={(e) => setTextShadow(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Text Shadow</span>
          </label>

          {/* Text Outline */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={textOutline}
              onChange={(e) => setTextOutline(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Text Outline</span>
          </label>

          {/* Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
            <p
              style={{
                letterSpacing: `${letterSpacing}px`,
                wordSpacing: `${wordSpacing}px`,
                textTransform: textTransform as any,
                textShadow: textShadow ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
                WebkitTextStroke: textOutline ? '1px black' : 'none',
              }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={applyEffects}
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

export default TextEffects
