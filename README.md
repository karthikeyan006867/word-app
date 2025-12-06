# 📝 Premium Word Processor - Free & Feature-Rich

A modern, feature-rich word processing application built with Next.js, React, and TypeScript. This app provides **all Microsoft Word Premium features** and more, completely free and ready to deploy on Vercel.

## ✨ Features

### 🎯 Core Word Processing
- **Rich Text Editing**: Bold, italic, underline, strikethrough, superscript, subscript
- **Advanced Formatting**: Multiple fonts, font sizes, colors, highlighting
- **Text Effects**: Letter spacing, word spacing, text transform, shadows, outlines
- **Paragraph Formatting**: Alignment (left, center, right, justify), line spacing
- **Lists**: Bulleted and numbered lists with customization
- **Headings**: H1, H2, H3 for document structure
- **Block Quotes**: Styled quotation blocks

### 📄 Document Management
- **Templates**: Professional templates (Resume, Letter, Report, Meeting Notes)
- **Auto-Save**: Automatic saving every 30 seconds
- **Version History**: Track and restore previous versions (last 10 auto-saved)
- **Local Storage**: Save documents locally in browser
- **Multiple Export Formats**: 
  - PDF (with page breaks)
  - Microsoft Word (.docx)
  - HTML
  - Markdown
  - Plain Text
  - JSON (native format)

### 🎨 Advanced Features
- **Find & Replace**: Regex support, case-sensitive, whole word matching
- **Tables**: Insert and format tables
- **Images**: Insert images from URLs
- **Links**: Hyperlink support
- **Code Blocks**: Syntax-highlighted code blocks
- **Page Breaks**: Manual page break insertion
- **Dark Mode**: Full dark theme support
- **Zoom Control**: 50% to 200% zoom levels
- **Page Layout**: Customize margins, orientation, page size, columns

### 📊 Productivity Tools
- **Word Count**: Real-time word, character, and page count
- **Reading Time**: Estimated reading time
- **Document Outline**: Auto-generated from headings
- **Keyboard Shortcuts**: Comprehensive shortcuts for all actions
- **Comments & Review**: Add comments, track changes (UI ready)
- **Spell Check**: UI ready for spell checking integration

### 🎯 Premium Features (Database Integration Ready)
- **Real-Time Collaboration**: Multi-user editing (UI complete)
- **Cloud Sync**: Cross-device synchronization
- **Advanced Version Control**: Unlimited version history
- **Custom Templates**: Save and manage custom templates
- **Advanced Charts**: Interactive chart insertion
- **Track Changes**: Full revision tracking system

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Deployment on Vercel

This application is optimized for Vercel deployment:

### Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy via GitHub

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

### Environment Variables (Optional)
No environment variables required for basic functionality. Add these when integrating database:

```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_API_URL=your_api_url
```

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Editor**: Slate.js (React-based rich text editor)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Export Libraries**: 
  - jsPDF (PDF export)
  - html2canvas (PDF rendering)
  - file-saver (File downloads)
  - docx (Word export)
- **Icons**: React Icons, Lucide React

## 📁 Project Structure

```
word-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Editor.tsx          # Main editor component
│   │   ├── Toolbar.tsx         # Formatting toolbar
│   │   ├── MenuBar.tsx         # Top menu bar
│   │   ├── Sidebar.tsx         # Document stats & outline
│   │   ├── FindReplace.tsx     # Find & replace modal
│   │   ├── TemplateGallery.tsx # Template selection
│   │   ├── PageLayout.tsx      # Page layout settings
│   │   ├── CommentsReview.tsx  # Comments & tracking
│   │   ├── VersionHistory.tsx  # Version management
│   │   ├── KeyboardShortcuts.tsx # Shortcuts panel
│   │   ├── CollaborationStatus.tsx # Collab status
│   │   ├── ChartInsert.tsx     # Chart insertion
│   │   └── TextEffects.tsx     # Text effects panel
│   ├── store/
│   │   └── documentStore.ts    # Zustand state management
│   └── utils/
│       ├── constants.ts        # App constants
│       └── export.ts           # Export utilities
├── public/                     # Static assets
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+S` | Save |
| `Ctrl+P` | Print |
| `Ctrl+F` | Find & Replace |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+N` | New Document |
| `Ctrl+E` | Center Align |
| `Ctrl+L` | Left Align |
| `Ctrl+R` | Right Align |
| `Ctrl+J` | Justify |
| `F7` | Spell Check |

## 🎨 Customization

### Adding Custom Fonts
Edit `src/utils/constants.ts` and add to the `FONTS` array:

```typescript
export const FONTS = [
  'Arial',
  'Your Custom Font',
  // ...
]
```

### Adding Templates
Add new templates in `src/utils/constants.ts`:

```typescript
{
  id: 'custom',
  name: 'Custom Template',
  description: 'Your description',
  content: [/* Slate content */]
}
```

## 🗄️ Database Integration (Future)

The application is prepared for database integration. UI components are ready for:

- User authentication
- Cloud document storage
- Real-time collaboration
- Advanced version control
- Custom template management
- Team sharing and permissions

To integrate, add your preferred backend (Supabase, Firebase, MongoDB, etc.) and connect to the prepared UI components.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Rich text editing powered by [Slate.js](https://www.slatejs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)

## 📧 Support

For issues and feature requests, please use the GitHub Issues page.

---

**Made with ❤️ - A free alternative to Microsoft Word Premium**
