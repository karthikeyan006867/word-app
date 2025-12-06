import { Descendant } from 'slate'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const serializeToHTML = (nodes: Descendant[]): string => {
  return nodes.map(node => serializeNode(node)).join('')
}

const serializeNode = (node: any): string => {
  if (node.text !== undefined) {
    let text = node.text
    if (node.bold) text = `<strong>${text}</strong>`
    if (node.italic) text = `<em>${text}</em>`
    if (node.underline) text = `<u>${text}</u>`
    if (node.strikethrough) text = `<s>${text}</s>`
    if (node.code) text = `<code>${text}</code>`
    if (node.superscript) text = `<sup>${text}</sup>`
    if (node.subscript) text = `<sub>${text}</sub>`
    if (node.color) text = `<span style="color: ${node.color}">${text}</span>`
    if (node.backgroundColor) text = `<span style="background-color: ${node.backgroundColor}">${text}</span>`
    if (node.fontSize) text = `<span style="font-size: ${node.fontSize}pt">${text}</span>`
    if (node.fontFamily) text = `<span style="font-family: ${node.fontFamily}">${text}</span>`
    return text
  }

  const children = node.children?.map((n: any) => serializeNode(n)).join('') || ''
  
  const style: string[] = []
  if (node.align) style.push(`text-align: ${node.align}`)
  if (node.lineHeight) style.push(`line-height: ${node.lineHeight}`)
  const styleAttr = style.length > 0 ? ` style="${style.join('; ')}"` : ''

  switch (node.type) {
    case 'heading-one':
      return `<h1${styleAttr}>${children}</h1>`
    case 'heading-two':
      return `<h2${styleAttr}>${children}</h2>`
    case 'heading-three':
      return `<h3${styleAttr}>${children}</h3>`
    case 'block-quote':
      return `<blockquote${styleAttr}>${children}</blockquote>`
    case 'bulleted-list':
      return `<ul${styleAttr}>${children}</ul>`
    case 'numbered-list':
      return `<ol${styleAttr}>${children}</ol>`
    case 'list-item':
      return `<li${styleAttr}>${children}</li>`
    case 'link':
      return `<a href="${node.url}"${styleAttr}>${children}</a>`
    case 'image':
      return `<img src="${node.url}" alt="${node.alt || ''}" style="max-width: 100%" />`
    case 'table':
      return `<table border="1" style="border-collapse: collapse; width: 100%"${styleAttr}>${children}</table>`
    case 'table-row':
      return `<tr${styleAttr}>${children}</tr>`
    case 'table-cell':
      return `<td style="border: 1px solid #ccc; padding: 8px"${styleAttr}>${children}</td>`
    case 'code-block':
      return `<pre${styleAttr}><code>${children}</code></pre>`
    default:
      return `<p${styleAttr}>${children}</p>`
  }
}

export const exportToHTML = (content: Descendant[], title: string) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 1in;
      line-height: 1.6;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    td {
      border: 1px solid #ccc;
      padding: 8px;
    }
  </style>
</head>
<body>
  ${serializeToHTML(content)}
</body>
</html>
  `
  
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  saveAs(blob, `${title}.html`)
}

export const exportToText = (content: Descendant[], title: string) => {
  const text = content.map(node => extractText(node)).join('\n\n')
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, `${title}.txt`)
}

const extractText = (node: any): string => {
  if (node.text !== undefined) {
    return node.text
  }
  if (node.children) {
    return node.children.map((n: any) => extractText(n)).join('')
  }
  return ''
}

export const exportToPDF = async (elementId: string, title: string) => {
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter',
  })

  const imgWidth = 8.5
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const pageHeight = 11
  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(`${title}.pdf`)
}

export const countWords = (content: Descendant[]): { words: number; characters: number; charactersNoSpaces: number } => {
  const text = content.map(node => extractText(node)).join(' ')
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  
  return { words, characters, charactersNoSpaces }
}

export const saveToLocalStorage = (content: Descendant[], title: string) => {
  const data = {
    content,
    title,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem('word-doc', JSON.stringify(data))
  
  // Save to version history
  const history = JSON.parse(localStorage.getItem('word-doc-history') || '[]')
  history.unshift(data)
  // Keep only last 10 versions
  if (history.length > 10) history.pop()
  localStorage.setItem('word-doc-history', JSON.stringify(history))
}

export const loadFromLocalStorage = (): { content: Descendant[]; title: string } | null => {
  const data = localStorage.getItem('word-doc')
  if (data) {
    return JSON.parse(data)
  }
  return null
}

export const getVersionHistory = (): Array<{ content: Descendant[]; title: string; timestamp: string }> => {
  const history = localStorage.getItem('word-doc-history')
  return history ? JSON.parse(history) : []
}

export const formatDate = (date: Date | null): string => {
  if (!date) return 'Never'
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  
  return date.toLocaleString()
}

// Export to Markdown
export const exportToMarkdown = (content: Descendant[], title: string) => {
  const markdown = content.map(node => nodeToMarkdown(node)).join('\n\n')
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  saveAs(blob, `${title}.md`)
}

const nodeToMarkdown = (node: any): string => {
  if (node.text !== undefined) {
    let text = node.text
    if (node.bold) text = `**${text}**`
    if (node.italic) text = `*${text}*`
    if (node.code) text = `\`${text}\``
    if (node.strikethrough) text = `~~${text}~~`
    return text
  }

  const children = node.children?.map((n: any) => nodeToMarkdown(n)).join('') || ''

  switch (node.type) {
    case 'heading-one':
      return `# ${children}`
    case 'heading-two':
      return `## ${children}`
    case 'heading-three':
      return `### ${children}`
    case 'block-quote':
      return `> ${children}`
    case 'bulleted-list':
      return children
    case 'numbered-list':
      return children
    case 'list-item':
      return `- ${children}`
    case 'link':
      return `[${children}](${node.url})`
    case 'image':
      return `![${node.alt || ''}](${node.url})`
    case 'code-block':
      return `\`\`\`\n${children}\n\`\`\``
    default:
      return children
  }
}

// Export to DOCX (using docx library)
export const exportToDOCX = async (content: Descendant[], title: string) => {
  // Placeholder for DOCX export
  // In production, you'd use the 'docx' library
  // For now, we'll create a basic implementation
  
  const htmlContent = serializeToHTML(content)
  const docxBlob = new Blob(
    [
      `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head><meta charset='utf-8'><title>${title}</title></head>
<body>${htmlContent}</body>
</html>`
    ],
    { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  )
  
  saveAs(docxBlob, `${title}.docx`)
}
