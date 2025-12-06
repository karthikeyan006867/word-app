'use client';

import { useState } from 'react';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import { useSlate } from 'slate-react';
import {
  FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter,
  FiAlignRight, FiAlignJustify, FiImage, FiLink, FiTable,
  FiFileText, FiSave, FiPrinter, FiDownload, FiCopy,
  FiScissors, FiClipboard, FiList, FiChevronDown,
  FiSun, FiMoon, FiSearch, FiMessageSquare, FiClock,
  FiZoomIn, FiZoomOut, FiLayout, FiColumns, FiBookOpen,
  FiCheckSquare, FiBarChart2, FiType, FiGrid
} from 'react-icons/fi';
import { MdFormatColorText, MdFormatColorFill } from 'react-icons/md';
import { useDocumentStore } from '@/store/documentStore';
import {
  exportToPDF,
  exportToDOCX,
  exportToHTML,
  exportToMarkdown,
  exportToText,
  serializeToHTML
} from '@/utils/export';

const FONT_FAMILIES = [
  'Arial', 'Times New Roman', 'Calibri', 'Georgia', 'Verdana',
  'Courier New', 'Comic Sans MS', 'Impact', 'Tahoma', 'Trebuchet MS'
];

const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36', '48', '72'];

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080', '#808000',
  '#800080', '#008080', '#C0C0C0', '#808080', '#FFA500', '#FFC0CB',
  '#FFD700', '#A52A2A', '#D2691E', '#4B0082', '#8B008B', '#556B2F'
];

interface RibbonProps {
  onFindReplace: () => void;
  onPageLayout: () => void;
  onComments: () => void;
  onVersionHistory: () => void;
  onInsertChart: () => void;
  onTextEffects: () => void;
}

type TabType = 'home' | 'insert' | 'design' | 'layout' | 'references' | 'review' | 'view';

export default function Ribbon({
  onFindReplace,
  onPageLayout,
  onComments,
  onVersionHistory,
  onInsertChart,
  onTextEffects
}: RibbonProps) {
  const editor = useSlate();
  const { content, settings, updateSettings } = useDocumentStore();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const isMarkActive = (format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format as keyof typeof marks] === true : false;
  };

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isBlockActive = (format: string) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === format,
      })
    );

    return !!match;
  };

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(format);
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : format } as any,
      { match: (n: any) => Editor.isBlock(editor, n) }
    );
  };

  const setAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
    Transforms.setNodes(
      editor,
      { align } as any,
      { 
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
        mode: 'all'
      }
    );
  };

  const setFontFamily = (font: string) => {
    Editor.addMark(editor, 'fontFamily', font);
    setShowFontDropdown(false);
  };

  const setFontSize = (size: string) => {
    Editor.addMark(editor, 'fontSize', size);
    setShowSizeDropdown(false);
  };

  const setTextColor = (color: string) => {
    Editor.addMark(editor, 'color', color);
    setShowTextColorPicker(false);
  };

  const setHighlight = (color: string) => {
    Editor.addMark(editor, 'backgroundColor', color);
    setShowHighlightPicker(false);
  };

  const handleExport = (format: string) => {
    const html = serializeToHTML(content);
    const title = settings.title || 'Document';

    switch (format) {
      case 'pdf':
        exportToPDF(html, title);
        break;
      case 'docx':
        exportToDOCX(content, title);
        break;
      case 'html':
        exportToHTML(content, title);
        break;
      case 'markdown':
        exportToMarkdown(content, title);
        break;
      case 'text':
        exportToText(content, title);
        break;
    }
  };

  const handleSave = () => {
    const dataStr = JSON.stringify({ content, settings }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${settings.title || 'document'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatButton = (icon: React.ReactNode, onClick: () => void, isActive = false, title = '') => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        isActive ? 'bg-blue-100 dark:bg-blue-900' : ''
      }`}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="ribbon-container bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Tabs */}
      <div className="ribbon-tabs flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center px-2 py-1 text-blue-600 dark:text-blue-400 font-bold text-lg">
          <FiFileText className="mr-2" /> Word
        </div>
        {(['home', 'insert', 'design', 'layout', 'references', 'review', 'view'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ribbon Content */}
      <div className="ribbon-content p-2">
        {activeTab === 'home' && (
          <div className="flex items-center gap-4 flex-wrap">
            {/* Clipboard Group */}
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Clipboard</div>
              <div className="flex gap-1">
                {formatButton(<FiScissors size={18} />, () => document.execCommand('cut'), false, 'Cut (Ctrl+X)')}
                {formatButton(<FiCopy size={18} />, () => document.execCommand('copy'), false, 'Copy (Ctrl+C)')}
                {formatButton(<FiClipboard size={18} />, () => document.execCommand('paste'), false, 'Paste (Ctrl+V)')}
              </div>
            </div>

            {/* Font Group */}
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Font</div>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <button
                    onClick={() => setShowFontDropdown(!showFontDropdown)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 min-w-[120px]"
                  >
                    <span className="text-sm">Calibri</span>
                    <FiChevronDown size={14} />
                  </button>
                  {showFontDropdown && (
                    <div className="absolute top-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                      {FONT_FAMILIES.map((font) => (
                        <button
                          key={font}
                          onClick={() => setFontFamily(font)}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm whitespace-nowrap"
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 w-16"
                  >
                    <span className="text-sm">12</span>
                    <FiChevronDown size={14} />
                  </button>
                  {showSizeDropdown && (
                    <div className="absolute top-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                      {FONT_SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size + 'px')}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {formatButton(<FiBold size={18} />, () => toggleMark('bold'), isMarkActive('bold'), 'Bold (Ctrl+B)')}
                {formatButton(<FiItalic size={18} />, () => toggleMark('italic'), isMarkActive('italic'), 'Italic (Ctrl+I)')}
                {formatButton(<FiUnderline size={18} />, () => toggleMark('underline'), isMarkActive('underline'), 'Underline (Ctrl+U)')}

                <div className="relative">
                  <button
                    onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Text Color"
                  >
                    <MdFormatColorText size={18} />
                  </button>
                  {showTextColorPicker && (
                    <div className="absolute top-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50 p-2 grid grid-cols-6 gap-1">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setTextColor(color)}
                          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Highlight"
                  >
                    <MdFormatColorFill size={18} />
                  </button>
                  {showHighlightPicker && (
                    <div className="absolute top-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50 p-2 grid grid-cols-6 gap-1">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setHighlight(color)}
                          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Paragraph Group */}
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Paragraph</div>
              <div className="flex gap-1">
                {formatButton(<FiList size={18} />, () => toggleBlock('bulleted-list'), isBlockActive('bulleted-list'), 'Bullets')}
                {formatButton(<FiList size={18} />, () => toggleBlock('numbered-list'), isBlockActive('numbered-list'), 'Numbering')}
                {formatButton(<FiAlignLeft size={18} />, () => setAlignment('left'), false, 'Align Left')}
                {formatButton(<FiAlignCenter size={18} />, () => setAlignment('center'), false, 'Center')}
                {formatButton(<FiAlignRight size={18} />, () => setAlignment('right'), false, 'Align Right')}
                {formatButton(<FiAlignJustify size={18} />, () => setAlignment('justify'), false, 'Justify')}
              </div>
            </div>

            {/* Styles Group */}
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Styles</div>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleBlock('heading-one')}
                  className={`px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold ${
                    isBlockActive('heading-one') ? 'bg-blue-100 dark:bg-blue-900' : ''
                  }`}
                >
                  H1
                </button>
                <button
                  onClick={() => toggleBlock('heading-two')}
                  className={`px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold ${
                    isBlockActive('heading-two') ? 'bg-blue-100 dark:bg-blue-900' : ''
                  }`}
                >
                  H2
                </button>
                <button
                  onClick={() => toggleBlock('heading-three')}
                  className={`px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold ${
                    isBlockActive('heading-three') ? 'bg-blue-100 dark:bg-blue-900' : ''
                  }`}
                >
                  H3
                </button>
              </div>
            </div>

            {/* Editing Group */}
            <div className="ribbon-group">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Editing</div>
              <div className="flex gap-1">
                {formatButton(<FiSearch size={18} />, onFindReplace, false, 'Find & Replace')}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insert' && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Illustrations</div>
              <div className="flex gap-1">
                {formatButton(<FiImage size={18} />, () => {}, false, 'Picture')}
                {formatButton(<FiBarChart2 size={18} />, onInsertChart, false, 'Chart')}
              </div>
            </div>

            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Links</div>
              <div className="flex gap-1">
                {formatButton(<FiLink size={18} />, () => {}, false, 'Hyperlink')}
              </div>
            </div>

            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tables</div>
              <div className="flex gap-1">
                {formatButton(<FiGrid size={18} />, () => {}, false, 'Table')}
              </div>
            </div>

            <div className="ribbon-group">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Text</div>
              <div className="flex gap-1">
                {formatButton(<FiType size={18} />, onTextEffects, false, 'Text Effects')}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Themes</div>
              <div className="flex gap-1">
                <button
                  onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Toggle Dark Mode"
                >
                  {settings.darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Page Setup</div>
              <div className="flex gap-1">
                {formatButton(<FiLayout size={18} />, onPageLayout, false, 'Page Layout')}
                {formatButton(<FiColumns size={18} />, onPageLayout, false, 'Columns')}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'references' && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Table of Contents</div>
              <div className="flex gap-1">
                {formatButton(<FiBookOpen size={18} />, () => {}, false, 'Table of Contents')}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Comments</div>
              <div className="flex gap-1">
                {formatButton(<FiMessageSquare size={18} />, onComments, false, 'Comments')}
              </div>
            </div>

            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tracking</div>
              <div className="flex gap-1">
                {formatButton(<FiCheckSquare size={18} />, onComments, false, 'Track Changes')}
              </div>
            </div>

            <div className="ribbon-group">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Changes</div>
              <div className="flex gap-1">
                {formatButton(<FiClock size={18} />, onVersionHistory, false, 'Version History')}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'view' && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="ribbon-group border-r border-gray-300 dark:border-gray-600 pr-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Zoom</div>
              <div className="flex gap-1 items-center">
                {formatButton(<FiZoomOut size={18} />, () => {
                  const newZoom = Math.max(50, settings.zoom - 10);
                  updateSettings({ zoom: newZoom });
                }, false, 'Zoom Out')}
                <span className="px-2 text-sm">{settings.zoom}%</span>
                {formatButton(<FiZoomIn size={18} />, () => {
                  const newZoom = Math.min(200, settings.zoom + 10);
                  updateSettings({ zoom: newZoom });
                }, false, 'Zoom In')}
              </div>
            </div>

            <div className="ribbon-group">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Show</div>
              <div className="flex gap-1">
                <button className="px-3 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  ✓ Ruler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Toolbar */}
      <div className="quick-access-toolbar absolute top-0 left-20 flex items-center gap-1 p-1">
        {formatButton(<FiSave size={16} />, handleSave, false, 'Save')}
        {formatButton(<FiPrinter size={16} />, handlePrint, false, 'Print')}
        <div className="relative group">
          {formatButton(<FiDownload size={16} />, () => {}, false, 'Export')}
          <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50 py-1 min-w-[150px]">
            <button onClick={() => handleExport('pdf')} className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">
              Export as PDF
            </button>
            <button onClick={() => handleExport('docx')} className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">
              Export as DOCX
            </button>
            <button onClick={() => handleExport('html')} className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">
              Export as HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
