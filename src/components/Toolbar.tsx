'use client'

import React, { useState } from 'react'
import { useSlate } from 'slate-react'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough, FaHighlighter,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaListUl, FaListOl, FaLink, FaImage, FaTable, FaCode,
  FaSuperscript, FaSubscript, FaUndo, FaRedo, FaPrint, FaSave
} from 'react-icons/fa'
import { FONTS, FONT_SIZES, COLORS } from '@/utils/constants'
import { saveToLocalStorage } from '@/utils/export'
import { useDocumentStore } from '@/store/documentStore'

const Toolbar: React.FC = () => {
  const editor = useSlate()
  const { fontFamily, fontSize, setFontFamily, setFontSize } = useDocumentStore()
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)

  const isMarkActive = (format: string) => {
    const marks = Editor.marks(editor) as any
    return marks ? marks[format] === true : false
  }

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  const isBlockActive = (blockType: string) => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n: any) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === blockType,
      })
    )

    return !!match
  }

  const toggleBlock = (blockType: string) => {
    const isActive = isBlockActive(blockType)
    const isList = ['numbered-list', 'bulleted-list'].includes(blockType)

    Transforms.unwrapNodes(editor, {
      match: (n: any) => !Editor.isEditor(n) && SlateElement.isElement(n) && ['numbered-list', 'bulleted-list'].includes(n.type),
      split: true,
    })

    const newProperties: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : blockType,
    } as any

    Transforms.setNodes<SlateElement>(editor, newProperties)

    if (!isActive && isList) {
      const block = { type: blockType, children: [] } as any
      Transforms.wrapNodes(editor, block)
    }
  }

  const setAlignment = (align: string) => {
    Transforms.setNodes(
      editor,
      { align } as any,
      { match: (n: any) => Editor.isBlock(editor, n) }
    )
  }

  const applyColor = (color: string) => {
    Editor.addMark(editor, 'color', color)
    setShowColorPicker(false)
  }

  const applyHighlight = (color: string) => {
    Editor.addMark(editor, 'backgroundColor', color)
    setShowHighlightPicker(false)
  }

  const insertLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      const { selection } = editor
      const isCollapsed = selection && selection.anchor.offset === selection.focus.offset

      if (isCollapsed) {
        const text = window.prompt('Enter link text:')
        if (text) {
          Transforms.insertNodes(editor, {
            type: 'link',
            url,
            children: [{ text }],
          } as any)
        }
      } else {
        Transforms.wrapNodes(
          editor,
          { type: 'link', url, children: [] } as any,
          { split: true }
        )
      }
    }
  }

  const insertImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      const image = {
        type: 'image',
        url,
        children: [{ text: '' }],
      }
      Transforms.insertNodes(editor, image as any)
    }
  }

  const insertTable = () => {
    const rows = parseInt(window.prompt('Number of rows:', '3') || '3')
    const cols = parseInt(window.prompt('Number of columns:', '3') || '3')

    const table = {
      type: 'table',
      children: Array.from({ length: rows }, () => ({
        type: 'table-row',
        children: Array.from({ length: cols }, () => ({
          type: 'table-cell',
          children: [{ type: 'paragraph', children: [{ text: '' }] }],
        })),
      })),
    }

    Transforms.insertNodes(editor, table as any)
  }

  const handleSave = () => {
    const { content, title } = useDocumentStore.getState()
    saveToLocalStorage(content, title)
    useDocumentStore.getState().setLastSaved(new Date())
    alert('Document saved!')
  }

  const handleFontChange = (font: string) => {
    setFontFamily(font)
    Editor.addMark(editor, 'fontFamily', font)
  }

  const handleFontSizeChange = (size: number) => {
    setFontSize(size)
    Editor.addMark(editor, 'fontSize', size)
  }

  return (
    <div className="toolbar no-print">
      <div className="flex flex-wrap items-center gap-1">
        {/* Undo/Redo */}
        <button
          onClick={() => (editor as any).undo()}
          className="toolbar-button"
          title="Undo (Ctrl+Z)"
        >
          <FaUndo />
        </button>
        <button
          onClick={() => (editor as any).redo()}
          className="toolbar-button"
          title="Redo (Ctrl+Y)"
        >
          <FaRedo />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          className="toolbar-button px-2 py-1"
          title="Font Family"
        >
          {FONTS.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <select
          value={fontSize}
          onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
          className="toolbar-button px-2 py-1"
          title="Font Size"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <button
          onClick={() => toggleMark('bold')}
          className={`toolbar-button ${isMarkActive('bold') ? 'active' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <FaBold />
        </button>
        <button
          onClick={() => toggleMark('italic')}
          className={`toolbar-button ${isMarkActive('italic') ? 'active' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <FaItalic />
        </button>
        <button
          onClick={() => toggleMark('underline')}
          className={`toolbar-button ${isMarkActive('underline') ? 'active' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <FaUnderline />
        </button>
        <button
          onClick={() => toggleMark('strikethrough')}
          className={`toolbar-button ${isMarkActive('strikethrough') ? 'active' : ''}`}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Superscript/Subscript */}
        <button
          onClick={() => toggleMark('superscript')}
          className={`toolbar-button ${isMarkActive('superscript') ? 'active' : ''}`}
          title="Superscript"
        >
          <FaSuperscript />
        </button>
        <button
          onClick={() => toggleMark('subscript')}
          className={`toolbar-button ${isMarkActive('subscript') ? 'active' : ''}`}
          title="Subscript"
        >
          <FaSubscript />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="toolbar-button"
            title="Text Color"
          >
            <span style={{ color: (Editor.marks(editor) as any)?.color || '#000' }}>A</span>
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border rounded shadow-lg p-2 z-50">
              <div className="grid grid-cols-10 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => applyColor(color)}
                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <button
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            className="toolbar-button"
            title="Highlight"
          >
            <FaHighlighter />
          </button>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border rounded shadow-lg p-2 z-50">
              <div className="grid grid-cols-10 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => applyHighlight(color)}
                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button onClick={() => setAlignment('left')} className="toolbar-button" title="Align Left (Ctrl+L)">
          <FaAlignLeft />
        </button>
        <button onClick={() => setAlignment('center')} className="toolbar-button" title="Align Center (Ctrl+E)">
          <FaAlignCenter />
        </button>
        <button onClick={() => setAlignment('right')} className="toolbar-button" title="Align Right (Ctrl+R)">
          <FaAlignRight />
        </button>
        <button onClick={() => setAlignment('justify')} className="toolbar-button" title="Justify (Ctrl+J)">
          <FaAlignJustify />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          onClick={() => toggleBlock('bulleted-list')}
          className={`toolbar-button ${isBlockActive('bulleted-list') ? 'active' : ''}`}
          title="Bulleted List"
        >
          <FaListUl />
        </button>
        <button
          onClick={() => toggleBlock('numbered-list')}
          className={`toolbar-button ${isBlockActive('numbered-list') ? 'active' : ''}`}
          title="Numbered List"
        >
          <FaListOl />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Insert */}
        <button onClick={insertLink} className="toolbar-button" title="Insert Link (Ctrl+K)">
          <FaLink />
        </button>
        <button onClick={insertImage} className="toolbar-button" title="Insert Image">
          <FaImage />
        </button>
        <button onClick={insertTable} className="toolbar-button" title="Insert Table">
          <FaTable />
        </button>
        <button
          onClick={() => toggleBlock('code-block')}
          className={`toolbar-button ${isBlockActive('code-block') ? 'active' : ''}`}
          title="Code Block"
        >
          <FaCode />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Actions */}
        <button onClick={handleSave} className="toolbar-button" title="Save (Ctrl+S)">
          <FaSave />
        </button>
        <button onClick={() => window.print()} className="toolbar-button" title="Print (Ctrl+P)">
          <FaPrint />
        </button>
      </div>
    </div>
  )
}

export default Toolbar
