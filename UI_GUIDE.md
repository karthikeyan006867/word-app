# 🎨 UI Component Guide

Visual reference for all UI components and their features.

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  MenuBar (Top)                                              │
│  [☰] Document Title   File Edit View Insert Format Tools   │
├─────┬───────────────────────────────────────────────────────┤
│     │  Toolbar (Formatting)                                 │
│     │  [↶↷] [Font▾] [Size▾] [B I U S] [↑↓] [A⚫] [≣≣≣] ... │
│     ├───────────────────────────────────────────────────────┤
│ S   │                                                       │
│ i   │              Editor Area (White Page)                │
│ d   │                                                       │
│ e   │  Start typing your document here...                  │
│ b   │                                                       │
│ a   │                                                       │
│ r   │                                                       │
│     │                                                       │
│     │                                                       │
└─────┴───────────────────────────────────────────────────────┘
                                    [Collaboration Status ●]
```

## 🧩 Component Details

### 1. MenuBar Component

**Location:** Top of screen (sticky)

**Menus:**
```
File    Edit    View    Insert    Format    Tools    Help
```

#### File Menu
```
📄 New Document        Ctrl+N
📂 Open...            Ctrl+O
─────────────────
📋 Templates...
─────────────────
🖨️  Print             Ctrl+P
─────────────────
Export as...
  📑 PDF
  📘 Word Document (.docx)
  🌐 HTML
  📝 Markdown
  📄 Plain Text
  🔧 JSON
```

#### Edit Menu
```
↶ Undo               Ctrl+Z
↷ Redo               Ctrl+Y
─────────────────
✂️  Cut               Ctrl+X
📋 Copy              Ctrl+C
📎 Paste             Ctrl+V
─────────────────
🔍 Find & Replace    Ctrl+F
📌 Select All        Ctrl+A
```

#### View Menu
```
🔍+ Zoom In          Ctrl++
🔍- Zoom Out         Ctrl+-
🔍  Reset Zoom (100%)
─────────────────
✓ Show Ruler
🌙 Dark Mode
─────────────────
⚙️  Page Layout...
```

#### Insert Menu
```
🖼️  Image...
📊 Table...
🔗 Link              Ctrl+K
📈 Chart...
─────────────────
📄 Page Break
➖ Horizontal Line
🔤 Special Character...
∑ Equation...
─────────────────
🗒️  Header & Footer...
#️⃣  Page Numbers...
📑 Table of Contents
```

#### Format Menu
```
🔤 Font...
¶ Paragraph...
↕️  Line Spacing...
─────────────────
✨ Text Effects...
🧹 Clear Formatting
─────────────────
🎨 Styles...
📰 Columns...
```

#### Tools Menu
```
✓ Spell Check        F7
🔢 Word Count        Ctrl+Shift+C
─────────────────
💬 Comments & Review
⏰ Version History
─────────────────
⚙️  Auto-Correct...
🔧 Preferences...
```

#### Help Menu
```
⌨️  Keyboard Shortcuts
📖 Documentation
💡 Tips & Tricks
─────────────────
ℹ️  About
```

### 2. Toolbar Component

**Location:** Below MenuBar (sticky)

**Sections:**
```
[History] [Font] [Style] [Format] [Color] [Align] [Lists] [Insert] [Actions]
```

#### Visual Layout
```
┌──────────────────────────────────────────────────────────────┐
│ [↶][↷] │ [Arial ▾] [12▾] │ [B][I][U][S] [↑][↓] │           │
│         │                  │                       │           │
│ History │  Font Controls   │   Text Formatting    │  Colors   │
│         │                  │                       │           │
│ [A▾][🎨▾] │ [≡][≡][≡][≡] │ [•][1.] │ [🔗][🖼️][📊][</>]       │
│           │                 │          │                        │
│  Colors   │   Alignment     │  Lists   │     Insert            │
│           │                 │          │                        │
│ [💾][🖨️]                                                       │
│                                                                 │
│ Actions                                                        │
└──────────────────────────────────────────────────────────────┘
```

### 3. Sidebar Component

**Location:** Left side (collapsible)

```
┌─────────────────────────┐
│  📄 Document Stats      │
├─────────────────────────┤
│  📝 Words: 1,234        │
│  🔤 Characters: 6,789   │
│  (no spaces): 5,432     │
│  📄 Pages: 5            │
│  ⏰ Last Saved: 2m ago  │
├─────────────────────────┤
│  📚 Document Outline    │
├─────────────────────────┤
│  • Introduction         │
│    • Background         │
│    • Objectives         │
│  • Main Content         │
│    • Section 1          │
│    • Section 2          │
│  • Conclusion           │
├─────────────────────────┤
│  📖 Reading Time        │
│  Approx. 6 min          │
├─────────────────────────┤
│  📄 Estimated Pages     │
│  Single-spaced: 2       │
│  Double-spaced: 5       │
├─────────────────────────┤
│  🔧 Quick Actions       │
│  [Copy Statistics]      │
└─────────────────────────┘
```

### 4. Modal Components

#### Find & Replace Modal
```
┌────────────────────────────┐
│ 🔍 Find & Replace      [×] │
├────────────────────────────┤
│ Find:                      │
│ [text to find...     ] [🔍]│
│                            │
│ Replace with:              │
│ [replacement text...     ] │
│                            │
│ ☐ Match case               │
│ ☐ Match whole word         │
│ ☐ Use regular expressions  │
│                            │
│ 📊 1 of 5 matches          │
│                    [←] [→] │
│                            │
│ [Replace] [🔄 Replace All] │
└────────────────────────────┘
```

#### Template Gallery Modal
```
┌────────────────────────────────────────┐
│ 📋 Template Gallery              [×]   │
├────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐     │
│ │ Blank  │ │ Resume │ │ Letter │     │
│ │   📄   │ │   👔   │ │   ✉️    │     │
│ │        │ │        │ │        │     │
│ │ Start  │ │ Profes-│ │Business│     │
│ │ with a │ │ sional │ │ format │     │
│ │ blank  │ │ resume │ │ letter │     │
│ └────────┘ └────────┘ └────────┘     │
│                                        │
│ ┌────────┐ ┌────────┐                │
│ │ Report │ │ Meeting│                │
│ │   📊   │ │   📝   │                │
│ │        │ │        │                │
│ │ Profes-│ │ Meeting│                │
│ │ sional │ │ notes  │                │
│ │ report │ │ template│               │
│ └────────┘ └────────┘                │
│                                        │
│ 💡 Create Custom Template              │
│ [Save as Template (DB Required)]      │
└────────────────────────────────────────┘
```

#### Page Layout Modal
```
┌──────────────────────────┐
│ 📄 Page Layout      [×]  │
├──────────────────────────┤
│ Page Size:               │
│ [Letter (8.5" × 11") ▾]  │
│                          │
│ Orientation:             │
│ ○ Portrait  ○ Landscape  │
│                          │
│ Margins (inches):        │
│ ┌──────┬──────┐          │
│ │Top: 1│Bot: 1│          │
│ ├──────┼──────┤          │
│ │Left:1│Right│          │
│ └──────┴──────┘          │
│                          │
│ Columns:                 │
│ [One ▾]                  │
│                          │
│ [Apply]  [Cancel]        │
└──────────────────────────┘
```

#### Keyboard Shortcuts Modal
```
┌─────────────────────────────────┐
│ ⌨️  Keyboard Shortcuts    [×]   │
├─────────────────────────────────┤
│ [Search shortcuts...        ]   │
│                                 │
│ ┌───────────┬──────────────┐    │
│ │ Action    │ Shortcut     │    │
│ ├───────────┼──────────────┤    │
│ │ Bold      │ [Ctrl+B]     │    │
│ │ Italic    │ [Ctrl+I]     │    │
│ │ Underline │ [Ctrl+U]     │    │
│ │ Save      │ [Ctrl+S]     │    │
│ │ Print     │ [Ctrl+P]     │    │
│ │ Find      │ [Ctrl+F]     │    │
│ │ Undo      │ [Ctrl+Z]     │    │
│ │ Redo      │ [Ctrl+Y]     │    │
│ │ New Doc   │ [Ctrl+N]     │    │
│ │ ...       │ ...          │    │
│ └───────────┴──────────────┘    │
└─────────────────────────────────┘
```

#### Comments & Review Modal
```
┌────────────────────────────────┐
│ 💬 Comments & Review      [×]  │
├────────────────────────────────┤
│ ☐ Track Changes                │
│ Record all edits and revisions │
│                                │
│ Add Comment:                   │
│ [Your comment...       ] [💬]  │
│                                │
│ All Comments (3)               │
│ ┌────────────────────────────┐ │
│ │ 👤 User · 5m ago       [✓] │ │
│ │ This section needs more    │ │
│ │ detail                     │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ 👤 User · 10m ago      [✓] │ │
│ │ Good point!                │ │
│ │ ✓ Resolved                 │ │
│ └────────────────────────────┘ │
│                                │
│ 📝 Revision History            │
│ View previous versions         │
│ [View History (DB Required)]   │
└────────────────────────────────┘
```

#### Version History Modal
```
┌────────────────────────────────┐
│ ⏰ Version History        [×]  │
├────────────────────────────────┤
│ Auto-saved versions (last 10)  │
│                                │
│ ┌────────────────────────────┐ │
│ │ Document Title             │ │
│ │ Dec 6, 2025, 10:30 AM      │ │
│ │ Version 10      [Restore]  │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ Document Title             │ │
│ │ Dec 6, 2025, 10:00 AM      │ │
│ │ Version 9       [Restore]  │ │
│ └────────────────────────────┘ │
│ ...                            │
│                                │
│ 💡 Cloud Sync                  │
│ With database integration,     │
│ versions will be synced        │
│ across devices                 │
│ [Enable Cloud Sync]            │
└────────────────────────────────┘
```

### 5. Collaboration Status (Bottom-Right)

```
┌─────────────────────┐
│ 🌐 Connected    [×] │
├─────────────────────┤
│ 👥 3 Active         │
│                     │
│ ● User 1            │
│ ● User 2            │
│ ● User 3            │
│                     │
│ 💡 Enable collab    │
│ with database       │
└─────────────────────┘
```

## 🎨 Color Palette

### Light Theme
- Background: `#f3f4f6` (gray-100)
- Editor: `#ffffff` (white)
- Text: `#000000` (black)
- Borders: `#e5e7eb` (gray-200)
- Hover: `#f3f4f6` (gray-100)
- Active: `#dbeafe` (blue-100)

### Dark Theme
- Background: `#111827` (gray-900)
- Editor: `#1e293b` (slate-800)
- Text: `#e2e8f0` (slate-200)
- Borders: `#334155` (slate-700)
- Hover: `#334155` (slate-700)
- Active: `#1e40af` (blue-700)

## 📱 Responsive Breakpoints

```
Mobile:    < 640px   (Stack sidebar, compact toolbar)
Tablet:    640-1024px (Collapsible sidebar)
Desktop:   > 1024px   (Full layout)
```

## ⚡ Interactive States

### Buttons
```
Default:  bg-transparent border-none
Hover:    bg-gray-100 (light) / bg-gray-700 (dark)
Active:   bg-blue-100 (light) / bg-blue-900 (dark)
Disabled: opacity-50 cursor-not-allowed
```

### Input Fields
```
Default:  border-gray-300
Focus:    border-blue-500 ring-2 ring-blue-500
Error:    border-red-500
```

## 🎯 Z-Index Layers

```
Base Layer:         z-0   (Editor content)
Toolbar/MenuBar:    z-100 (Always on top)
Sidebar:            z-90  (Below toolbar)
Modals Overlay:     z-1000 (Cover everything)
Modals Content:     z-1001 (Above overlay)
Collaboration:      z-50  (Above content, below UI)
```

## 📐 Spacing Scale

```
4px   → 0.25rem → gap-1, p-1
8px   → 0.5rem  → gap-2, p-2
12px  → 0.75rem → gap-3, p-3
16px  → 1rem    → gap-4, p-4
24px  → 1.5rem  → gap-6, p-6
32px  → 2rem    → gap-8, p-8
```

## 🖼️ Icon Usage

All icons from `react-icons`:
- `FiMenu` - Sidebar toggle
- `FiFile` - New document
- `FiDownload` - Export
- `FiUpload` - Open
- `FiPrinter` - Print
- `FiSun/FiMoon` - Dark mode
- `FiSearch` - Find
- Many more...

## 🎨 Typography

```
Headings:
  H1: text-3xl font-bold (30px)
  H2: text-2xl font-bold (24px)
  H3: text-xl font-bold (20px)

Body:
  Default: text-base (16px)
  Small: text-sm (14px)
  Tiny: text-xs (12px)

Font Family:
  Default: 'Inter' (Next.js font)
  Editor: User-selectable (15+ fonts)
```

---

**All components are fully styled and responsive! 🎨**
