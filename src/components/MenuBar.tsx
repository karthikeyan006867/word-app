'use client'

import React, { useState } from 'react'
import { useDocumentStore } from '@/store/documentStore'
import { exportToHTML, exportToText, exportToPDF, exportToDOCX, exportToMarkdown } from '@/utils/export'
import { FiMenu, FiFile, FiDownload, FiUpload, FiPrinter, FiSettings, FiSun, FiMoon, FiZoomIn, FiZoomOut } from 'react-icons/fi'

interface MenuBarProps {
  onToggleSidebar: () => void
  onShowTemplates?: () => void
  onShowFindReplace?: () => void
  onShowComments?: () => void
  onShowVersionHistory?: () => void
  onShowKeyboardShortcuts?: () => void
  onShowPageLayout?: () => void
}

const MenuBar: React.FC<MenuBarProps> = ({ 
  onToggleSidebar, 
  onShowTemplates,
  onShowFindReplace,
  onShowComments,
  onShowVersionHistory,
  onShowKeyboardShortcuts,
  onShowPageLayout
}) => {
  const { title, setTitle, content, darkMode, toggleDarkMode, zoom, setZoom, reset, showRuler, toggleRuler } = useDocumentStore()
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [showEditMenu, setShowEditMenu] = useState(false)
  const [showViewMenu, setShowViewMenu] = useState(false)
  const [showInsertMenu, setShowInsertMenu] = useState(false)
  const [showFormatMenu, setShowFormatMenu] = useState(false)
  const [showToolsMenu, setShowToolsMenu] = useState(false)
  const [showHelpMenu, setShowHelpMenu] = useState(false)

  const closeAllMenus = () => {
    setShowFileMenu(false)
    setShowEditMenu(false)
    setShowViewMenu(false)
    setShowInsertMenu(false)
    setShowFormatMenu(false)
    setShowToolsMenu(false)
    setShowHelpMenu(false)
  }

  const handleNewDocument = () => {
    if (confirm('Create a new document? Any unsaved changes will be lost.')) {
      reset()
      closeAllMenus()
    }
  }

  const handleOpenDocument = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.html,.txt,.md'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string
            if (file.name.endsWith('.json')) {
              const data = JSON.parse(content)
              useDocumentStore.getState().setContent(data.content || data)
              if (data.title) useDocumentStore.getState().setTitle(data.title)
            } else {
              // Handle plain text/HTML/markdown
              const paragraphs = content.split('\n').map(text => ({
                type: 'paragraph',
                children: [{ text }],
              }))
              useDocumentStore.getState().setContent(paragraphs as any)
            }
          } catch (error) {
            alert('Error opening file: ' + error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
    closeAllMenus()
  }

  const handleExport = async (format: string) => {
    try {
      switch (format) {
        case 'pdf':
          await exportToPDF('editor-content', title)
          break
        case 'html':
          exportToHTML(content, title)
          break
        case 'txt':
          exportToText(content, title)
          break
        case 'docx':
          await exportToDOCX(content, title)
          break
        case 'md':
          exportToMarkdown(content, title)
          break
        case 'json':
          const blob = new Blob([JSON.stringify({ title, content }, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${title}.json`
          a.click()
          break
      }
      closeAllMenus()
    } catch (error) {
      alert('Export failed: ' + error)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 10)
    closeAllMenus()
  }

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 10)
    closeAllMenus()
  }

  const handleZoomReset = () => {
    setZoom(100)
    closeAllMenus()
  }

  return (
    <div className="menu-bar no-print">
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Toggle Sidebar"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium bg-transparent border-none outline-none focus:bg-gray-50 dark:focus:bg-gray-700 px-2 py-1 rounded"
            style={{ minWidth: '200px' }}
          />
        </div>

        {/* Menu items */}
        <div className="flex items-center gap-1">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => { closeAllMenus(); setShowFileMenu(!showFileMenu) }}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              File
            </button>
            {showFileMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-2 z-50 min-w-[200px]">
                <button onClick={handleNewDocument} className="menu-item">
                  <FiFile /> New Document <span className="shortcut">Ctrl+N</span>
                </button>
                <button onClick={handleOpenDocument} className="menu-item">
                  <FiUpload /> Open... <span className="shortcut">Ctrl+O</span>
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button onClick={() => onShowTemplates?.()} className="menu-item">
                  Templates...
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button onClick={() => { window.print(); closeAllMenus() }} className="menu-item">
                  <FiPrinter /> Print <span className="shortcut">Ctrl+P</span>
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <div className="px-3 py-1 text-xs font-semibold text-gray-500">Export as...</div>
                <button onClick={() => handleExport('pdf')} className="menu-item">
                  <FiDownload /> PDF
                </button>
                <button onClick={() => handleExport('docx')} className="menu-item">
                  <FiDownload /> Word Document (.docx)
                </button>
                <button onClick={() => handleExport('html')} className="menu-item">
                  <FiDownload /> HTML
                </button>
                <button onClick={() => handleExport('md')} className="menu-item">
                  <FiDownload /> Markdown
                </button>
                <button onClick={() => handleExport('txt')} className="menu-item">
                  <FiDownload /> Plain Text
                </button>
                <button onClick={() => handleExport('json')} className="menu-item">
                  <FiDownload /> JSON
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => { closeAllMenus(); setShowEditMenu(!showEditMenu) }}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Edit
            </button>
            {showEditMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-2 z-50 min-w-[200px]">
                <button onClick={() => { document.execCommand('undo'); closeAllMenus() }} className="menu-item">
                  Undo <span className="shortcut">Ctrl+Z</span>
                </button>
                <button onClick={() => { document.execCommand('redo'); closeAllMenus() }} className="menu-item">
                  Redo <span className="shortcut">Ctrl+Y</span>
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button onClick={() => { document.execCommand('cut'); closeAllMenus() }} className="menu-item">
                  Cut <span className="shortcut">Ctrl+X</span>
                </button>
                <button onClick={() => { document.execCommand('copy'); closeAllMenus() }} className="menu-item">
                  Copy <span className="shortcut">Ctrl+C</span>
                </button>
                <button onClick={() => { document.execCommand('paste'); closeAllMenus() }} className="menu-item">
                  Paste <span className="shortcut">Ctrl+V</span>
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button onClick={() => { onShowFindReplace?.(); closeAllMenus() }} className="menu-item">
                  Find & Replace <span className="shortcut">Ctrl+F</span>
                </button>
                <button onClick={() => { document.execCommand('selectAll'); closeAllMenus() }} className="menu-item">
                  Select All <span className="shortcut">Ctrl+A</span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => { closeAllMenus(); setShowViewMenu(!showViewMenu) }}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              View
            </button>
            {showViewMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-2 z-50 min-w-[200px]">
                <button onClick={handleZoomIn} className="menu-item">
                  <FiZoomIn /> Zoom In <span className="shortcut">Ctrl++</span>
                </button>
                <button onClick={handleZoomOut} className="menu-item">
                  <FiZoomOut /> Zoom Out <span className="shortcut">Ctrl+-</span>
                </button>
                <button onClick={handleZoomReset} className="menu-item">
                  Reset Zoom ({zoom}%)
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button onClick={() => { toggleRuler(); closeAllMenus() }} className="menu-item">
                  {showRuler ? '✓ ' : ''}Show Ruler
                </button>
                <button onClick={() => { toggleDarkMode(); closeAllMenus() }} className="menu-item">
                  {darkMode ? <FiSun /> : <FiMoon />} {darkMode ? 'Light' : 'Dark'} Mode
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button onClick={() => { onShowPageLayout?.(); closeAllMenus() }} className="menu-item">
                  <FiSettings /> Page Layout...
                </button>
              </div>
            )}
          </div>

          {/* Insert Menu */}
          <div className="relative">
            <button
              onClick={() => { closeAllMenus(); setShowInsertMenu(!showInsertMenu) }}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Insert
            </button>
            {showInsertMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-2 z-50 min-w-[200px]">
                <button className="menu-item">Image...</button>
                <button className="menu-item">Table...</button>
                <button className="menu-item">Link <span className="shortcut">Ctrl+K</span></button>
                <button className="menu-item">Chart...</button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button className="menu-item">Page Break</button>
                <button className="menu-item">Horizontal Line</button>
                <button className="menu-item">Special Character...</button>
                <button className="menu-item">Equation...</button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button className="menu-item">Header & Footer...</button>
                <button className="menu-item">Page Numbers...</button>
                <button className="menu-item">Table of Contents</button>
              </div>
            )}
          </div>

          {/* Format Menu */}
          <div className="relative">
            <button
              onClick={() => { closeAllMenus(); setShowFormatMenu(!showFormatMenu) }}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Format
            </button>
            {showFormatMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-2 z-50 min-w-[200px]">
                <button className="menu-item">Font...</button>
                <button className="menu-item">Paragraph...</button>
                <button className="menu-item">Line Spacing...</button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button className="menu-item">Text Effects...</button>
                <button className="menu-item">Clear Formatting</button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button className="menu-item">Styles...</button>
                <button className="menu-item">Columns...</button>
              </div>
            )}
          </div>

          {/* Tools Menu */}
          <div className="relative">
            <button
              onClick={() => { closeAllMenus(); setShowToolsMenu(!showToolsMenu) }}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Tools
            </button>
            {showToolsMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-2 z-50 min-w-[200px]">
                <button className="menu-item">Spell Check <span className="shortcut">F7</span></button>
                <button className="menu-item">Word Count <span className="shortcut">Ctrl+Shift+C</span></button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button onClick={() => { onShowComments?.(); closeAllMenus() }} className="menu-item">
                  Comments & Review
                </button>
                <button onClick={() => { onShowVersionHistory?.(); closeAllMenus() }} className="menu-item">
                  Version History
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button className="menu-item">Auto-Correct...</button>
                <button className="menu-item">Preferences...</button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => { closeAllMenus(); setShowHelpMenu(!showHelpMenu) }}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Help
            </button>
            {showHelpMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-2 z-50 min-w-[200px]">
                <button onClick={() => { onShowKeyboardShortcuts?.(); closeAllMenus() }} className="menu-item">
                  Keyboard Shortcuts
                </button>
                <button className="menu-item">Documentation</button>
                <button className="menu-item">Tips & Tricks</button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button className="menu-item">About</button>
              </div>
            )}
          </div>
        </div>

        {/* Right section - Zoom indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">{zoom}%</span>
        </div>
      </div>

      <style jsx>{`
        .menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 16px;
          text-align: left;
          transition: background-color 0.2s;
        }
        .menu-item:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .dark .menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .shortcut {
          margin-left: auto;
          font-size: 0.75rem;
          opacity: 0.6;
        }
      `}</style>
    </div>
  )
}

export default MenuBar
