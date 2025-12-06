export const FONTS = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Impact',
  'Lucida Console',
  'Tahoma',
  'Palatino',
  'Garamond',
  'Bookman',
  'Helvetica',
]

export const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]

export const LINE_HEIGHTS = [
  { label: 'Single', value: 1 },
  { label: '1.15', value: 1.15 },
  { label: '1.5', value: 1.5 },
  { label: 'Double', value: 2 },
  { label: '2.5', value: 2.5 },
  { label: '3', value: 3 },
]

export const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
  '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
  '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
  '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
  '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
  '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47',
  '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130',
]

export const TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start with a blank page',
    content: [{ type: 'paragraph', children: [{ text: '' }] }],
  },
  {
    id: 'resume',
    name: 'Professional Resume',
    description: 'A clean resume template',
    content: [
      { type: 'heading-one', children: [{ text: 'Your Name', bold: true }] },
      { type: 'paragraph', children: [{ text: 'Email | Phone | Location', align: 'center' }] },
      { type: 'heading-two', children: [{ text: 'Experience', bold: true }] },
      { type: 'paragraph', children: [{ text: 'Job Title - Company Name' }] },
      { type: 'paragraph', children: [{ text: '• Describe your key achievements and responsibilities' }] },
    ],
  },
  {
    id: 'letter',
    name: 'Business Letter',
    description: 'Formal business letter format',
    content: [
      { type: 'paragraph', children: [{ text: 'Your Name' }] },
      { type: 'paragraph', children: [{ text: 'Your Address' }] },
      { type: 'paragraph', children: [{ text: '' }] },
      { type: 'paragraph', children: [{ text: 'Date' }] },
      { type: 'paragraph', children: [{ text: '' }] },
      { type: 'paragraph', children: [{ text: 'Recipient Name' }] },
      { type: 'paragraph', children: [{ text: 'Recipient Address' }] },
      { type: 'paragraph', children: [{ text: '' }] },
      { type: 'paragraph', children: [{ text: 'Dear [Name],' }] },
    ],
  },
  {
    id: 'report',
    name: 'Report',
    description: 'Professional report structure',
    content: [
      { type: 'heading-one', children: [{ text: 'Report Title', bold: true, align: 'center' }] },
      { type: 'paragraph', children: [{ text: 'Date', align: 'center' }] },
      { type: 'heading-two', children: [{ text: '1. Executive Summary', bold: true }] },
      { type: 'paragraph', children: [{ text: 'Brief overview of the report contents...' }] },
      { type: 'heading-two', children: [{ text: '2. Introduction', bold: true }] },
      { type: 'paragraph', children: [{ text: 'Background and context...' }] },
    ],
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Template for meeting minutes',
    content: [
      { type: 'heading-one', children: [{ text: 'Meeting Notes', bold: true }] },
      { type: 'paragraph', children: [{ text: 'Date: ' }] },
      { type: 'paragraph', children: [{ text: 'Attendees: ' }] },
      { type: 'heading-two', children: [{ text: 'Agenda', bold: true }] },
      { type: 'paragraph', children: [{ text: '1. ' }] },
      { type: 'heading-two', children: [{ text: 'Discussion Points', bold: true }] },
      { type: 'paragraph', children: [{ text: '• ' }] },
      { type: 'heading-two', children: [{ text: 'Action Items', bold: true }] },
      { type: 'paragraph', children: [{ text: '[ ] ' }] },
    ],
  },
]

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl+B', action: 'Bold' },
  { key: 'Ctrl+I', action: 'Italic' },
  { key: 'Ctrl+U', action: 'Underline' },
  { key: 'Ctrl+S', action: 'Save' },
  { key: 'Ctrl+P', action: 'Print' },
  { key: 'Ctrl+Z', action: 'Undo' },
  { key: 'Ctrl+Y', action: 'Redo' },
  { key: 'Ctrl+F', action: 'Find' },
  { key: 'Ctrl+H', action: 'Replace' },
  { key: 'Ctrl+K', action: 'Insert Link' },
  { key: 'Ctrl+Shift+C', action: 'Word Count' },
  { key: 'Ctrl+]', action: 'Increase Indent' },
  { key: 'Ctrl+[', action: 'Decrease Indent' },
  { key: 'Ctrl+E', action: 'Center Align' },
  { key: 'Ctrl+L', action: 'Left Align' },
  { key: 'Ctrl+R', action: 'Right Align' },
  { key: 'Ctrl+J', action: 'Justify' },
]
