'use client'

import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { createEditor, Descendant, Editor as SlateEditor, Transforms, Element as SlateElement, BaseEditor } from 'slate'
import { Slate, Editable, withReact, ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react'
import { withHistory } from 'slate-history'
import Ribbon from './Ribbon'
import FindReplace from './FindReplace'
import PageLayout from './PageLayout'
import CommentsReview from './CommentsReview'
import VersionHistory from './VersionHistory'
import ChartInsert from './ChartInsert'
import TextEffects from './TextEffects'
import { useDocumentStore } from '@/store/documentStore'
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/export'

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

type CustomElement = {
  type: string
  align?: string
  children: CustomText[]
  url?: string
  alt?: string
  lineHeight?: number
  [key: string]: any
}

type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  superscript?: boolean
  subscript?: boolean
  color?: string
  backgroundColor?: string
  fontSize?: number
  fontFamily?: string
}

const Editor: React.FC = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const { content, setContent, settings } = useDocumentStore()
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [showPageLayout, setShowPageLayout] = useState(false)
  const [showCommentsReview, setShowCommentsReview] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showChartInsert, setShowChartInsert] = useState(false)
  const [showTextEffects, setShowTextEffects] = useState(false)

  // Load saved document on mount
  useEffect(() => {
    const saved = loadFromLocalStorage()
    if (saved) {
      setContent(saved.content)
      useDocumentStore.getState().updateSettings({ title: saved.title })
    }
  }, [setContent])

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const { content, settings, isDirty } = useDocumentStore.getState()
      if (isDirty) {
        saveToLocalStorage(content, settings.title)
        useDocumentStore.getState().setLastSaved(new Date())
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'b':
          event.preventDefault()
          toggleFormat(editor, 'bold')
          break
        case 'i':
          event.preventDefault()
          toggleFormat(editor, 'italic')
          break
        case 'u':
          event.preventDefault()
          toggleFormat(editor, 'underline')
          break
        case 's':
          event.preventDefault()
          handleSave()
          break
        case 'p':
          event.preventDefault()
          window.print()
          break
        case 'f':
          event.preventDefault()
          setShowFindReplace(true)
          break
        case 'h':
          event.preventDefault()
          setShowFindReplace(true)
          break
        case 'e':
          event.preventDefault()
          toggleBlock(editor, 'align', 'center')
          break
        case 'l':
          if (!event.shiftKey) {
            event.preventDefault()
            toggleBlock(editor, 'align', 'left')
          }
          break
        case 'r':
          event.preventDefault()
          toggleBlock(editor, 'align', 'right')
          break
        case 'j':
          event.preventDefault()
          toggleBlock(editor, 'align', 'justify')
          break
        case 'n':
          event.preventDefault()
          if (confirm('Create new document?')) {
            useDocumentStore.getState().reset()
          }
          break
      }
    }
    // F7 for spell check
    if (event.key === 'F7') {
      event.preventDefault()
      alert('Spell check feature - coming with database integration')
    }
  }

  const handleSave = () => {
    const { content, settings } = useDocumentStore.getState()
    saveToLocalStorage(content, settings.title)
    useDocumentStore.getState().setLastSaved(new Date())
  }

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.darkMode])

  return (
    <div className={`flex flex-col h-screen ${settings.darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <Slate
        editor={editor}
        initialValue={content}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          if (isAstChange) {
            setContent(value)
          }
        }}
      >
        <Ribbon
          onFindReplace={() => setShowFindReplace(true)}
          onPageLayout={() => setShowPageLayout(true)}
          onComments={() => setShowCommentsReview(true)}
          onVersionHistory={() => setShowVersionHistory(true)}
          onInsertChart={() => setShowChartInsert(true)}
          onTextEffects={() => setShowTextEffects(true)}
        />

        {/* Ruler */}
        <div className="ruler bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 h-6 flex items-center px-4 text-xs text-gray-500">
          <div className="flex-1 relative">
            {Array.from({ length: 17 }).map((_, i) => (
              <span key={i} className="absolute" style={{ left: `${i * 6.25}%` }}>
                {i}
              </span>
            ))}
          </div>
        </div>

        {/* Document Area */}
        <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-900 py-8" style={{ zoom: `${settings.zoom}%` }}>
          <div className="max-w-[8.5in] mx-auto">
            {/* A4/Letter Page */}
            <div className="word-page bg-white shadow-lg mb-8 mx-auto"
                 style={{
                   width: '8.5in',
                   minHeight: '11in',
                   padding: '1in',
                 }}>
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Start typing your document..."
                spellCheck
                autoFocus
                onKeyDown={handleKeyDown}
                className="outline-none min-h-full text-black"
                style={{
                  fontFamily: 'Calibri, sans-serif',
                  fontSize: '11pt',
                  lineHeight: '1.5'
                }}
              />
            </div>
          </div>
        </div>
      </Slate>

      {/* Modals */}
      {showFindReplace && <FindReplace isOpen={showFindReplace} onClose={() => setShowFindReplace(false)} />}
      {showPageLayout && <PageLayout isOpen={showPageLayout} onClose={() => setShowPageLayout(false)} />}
      {showCommentsReview && <CommentsReview isOpen={showCommentsReview} onClose={() => setShowCommentsReview(false)} />}
      {showVersionHistory && <VersionHistory isOpen={showVersionHistory} onClose={() => setShowVersionHistory(false)} />}
      {showChartInsert && <ChartInsert isOpen={showChartInsert} onClose={() => setShowChartInsert(false)} onInsert={() => {}} />}
      {showTextEffects && <TextEffects isOpen={showTextEffects} onClose={() => setShowTextEffects(false)} />}
    </div>
  )
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: React.CSSProperties = {
    textAlign: (element as any).align || 'left',
    lineHeight: (element as any).lineHeight || 1.5,
  }

  switch ((element as any).type) {
    case 'heading-one':
      return <h1 style={style} {...attributes} className="text-3xl font-bold my-4">{children}</h1>
    case 'heading-two':
      return <h2 style={style} {...attributes} className="text-2xl font-bold my-3">{children}</h2>
    case 'heading-three':
      return <h3 style={style} {...attributes} className="text-xl font-bold my-2">{children}</h3>
    case 'block-quote':
      return <blockquote style={style} {...attributes} className="border-l-4 border-gray-400 pl-4 italic my-4">{children}</blockquote>
    case 'bulleted-list':
      return <ul style={style} {...attributes} className="list-disc list-inside my-2">{children}</ul>
    case 'numbered-list':
      return <ol style={style} {...attributes} className="list-decimal list-inside my-2">{children}</ol>
    case 'list-item':
      return <li style={style} {...attributes}>{children}</li>
    case 'link':
      return (
        <a
          {...attributes}
          href={(element as any).url}
          className="text-blue-600 underline hover:text-blue-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    case 'image':
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <img
              src={(element as any).url}
              alt={(element as any).alt || ''}
              className="max-w-full h-auto my-4"
            />
          </div>
          {children}
        </div>
      )
    case 'table':
      return (
        <table {...attributes} className="border-collapse w-full my-4">
          <tbody>{children}</tbody>
        </table>
      )
    case 'table-row':
      return <tr {...attributes}>{children}</tr>
    case 'table-cell':
      return <td {...attributes} className="table-cell">{children}</td>
    case 'code-block':
      return (
        <pre {...attributes} className="code-block my-4">
          <code>{children}</code>
        </pre>
      )
    case 'page-break':
      return (
        <div {...attributes} contentEditable={false} className="page-break my-8 border-t-2 border-dashed border-gray-400">
          {children}
        </div>
      )
    default:
      return <p style={style} {...attributes} className="my-1">{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const customLeaf = leaf as CustomText
  
  let style: React.CSSProperties = {}
  
  if (customLeaf.color) style.color = customLeaf.color
  if (customLeaf.backgroundColor) style.backgroundColor = customLeaf.backgroundColor
  if (customLeaf.fontSize) style.fontSize = `${customLeaf.fontSize}pt`
  if (customLeaf.fontFamily) style.fontFamily = customLeaf.fontFamily

  if (customLeaf.bold) children = <strong>{children}</strong>
  if (customLeaf.italic) children = <em>{children}</em>
  if (customLeaf.underline) children = <u>{children}</u>
  if (customLeaf.strikethrough) children = <s>{children}</s>
  if (customLeaf.code) children = <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{children}</code>
  if (customLeaf.superscript) children = <sup>{children}</sup>
  if (customLeaf.subscript) children = <sub>{children}</sub>

  return <span {...attributes} style={style}>{children}</span>
}

const toggleFormat = (editor: SlateEditor, format: string) => {
  const isActive = isFormatActive(editor, format)
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true } as any,
    { match: (n: any) => n.text !== undefined, split: true }
  )
}

const isFormatActive = (editor: SlateEditor, format: string) => {
  const marks = SlateEditor.marks(editor) as any
  return marks ? marks[format] === true : false
}

const toggleBlock = (editor: SlateEditor, property: string, value: string) => {
  const isActive = isBlockActive(editor, property, value)
  Transforms.setNodes(
    editor,
    { [property]: isActive ? null : value } as any,
    { match: (n: any) => SlateEditor.isBlock(editor, n) }
  )
}

const isBlockActive = (editor: SlateEditor, property: string, value: string) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: SlateEditor.unhangRange(editor, selection),
      match: (n: any) => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && (n as any)[property] === value,
    })
  )

  return !!match
}

export default Editor
