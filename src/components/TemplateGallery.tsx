'use client'

import React from 'react'
import { FiX, FiCheck } from 'react-icons/fi'
import { TEMPLATES } from '@/utils/constants'
import { useDocumentStore } from '@/store/documentStore'

interface TemplateGalleryProps {
  isOpen: boolean
  onClose: () => void
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ isOpen, onClose }) => {
  const { setContent, setTitle } = useDocumentStore()

  if (!isOpen) return null

  const handleSelectTemplate = (template: any) => {
    if (confirm(`Load template "${template.name}"? Current document will be replaced.`)) {
      setContent(template.content)
      setTitle(template.name)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Template Gallery</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg group-hover:text-blue-600">
                  {template.name}
                </h3>
                <FiCheck className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {template.description}
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-xs font-mono overflow-hidden">
                <div className="line-clamp-4">
                  {template.content.map((node: any, i: number) => (
                    <div key={i}>
                      {node.children?.map((child: any) => child.text).join('') || '...'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Custom Templates Section */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Create Custom Template</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Save your current document as a reusable template (Database feature - coming soon)
          </p>
          <button
            disabled
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save as Template
          </button>
        </div>
      </div>
    </div>
  )
}

export default TemplateGallery
