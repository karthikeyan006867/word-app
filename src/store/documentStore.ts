import { create } from 'zustand'
import { Descendant } from 'slate'

export interface DocumentState {
  content: Descendant[]
  title: string
  isDirty: boolean
  lastSaved: Date | null
  darkMode: boolean
  showRuler: boolean
  zoom: number
  fontSize: number
  fontFamily: string
  
  setContent: (content: Descendant[]) => void
  setTitle: (title: string) => void
  setIsDirty: (isDirty: boolean) => void
  setLastSaved: (date: Date) => void
  toggleDarkMode: () => void
  toggleRuler: () => void
  setZoom: (zoom: number) => void
  setFontSize: (size: number) => void
  setFontFamily: (family: string) => void
  reset: () => void
}

const initialContent: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  } as any,
]

export const useDocumentStore = create<DocumentState>((set) => ({
  content: initialContent,
  title: 'Untitled Document',
  isDirty: false,
  lastSaved: null,
  darkMode: false,
  showRuler: true,
  zoom: 100,
  fontSize: 12,
  fontFamily: 'Arial',
  
  setContent: (content) => set({ content, isDirty: true }),
  setTitle: (title) => set({ title }),
  setIsDirty: (isDirty) => set({ isDirty }),
  setLastSaved: (date) => set({ lastSaved: date, isDirty: false }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleRuler: () => set((state) => ({ showRuler: !state.showRuler })),
  setZoom: (zoom) => set({ zoom }),
  setFontSize: (fontSize) => set({ fontSize }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  reset: () => set({
    content: initialContent,
    title: 'Untitled Document',
    isDirty: false,
    lastSaved: null,
  }),
}))
