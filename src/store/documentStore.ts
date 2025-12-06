import { create } from 'zustand'
import { Descendant } from 'slate'

export interface Settings {
  darkMode: boolean
  showRuler: boolean
  zoom: number
  fontSize: number
  fontFamily: string
  title: string
}

export interface DocumentState {
  content: Descendant[]
  settings: Settings
  isDirty: boolean
  lastSaved: Date | null
  
  setContent: (content: Descendant[]) => void
  updateSettings: (settings: Partial<Settings>) => void
  setIsDirty: (isDirty: boolean) => void
  setLastSaved: (date: Date) => void
  reset: () => void
}

const initialContent: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  } as any,
]

const initialSettings: Settings = {
  darkMode: false,
  showRuler: true,
  zoom: 100,
  fontSize: 12,
  fontFamily: 'Calibri',
  title: 'Untitled Document'
}

export const useDocumentStore = create<DocumentState>((set) => ({
  content: initialContent,
  settings: initialSettings,
  isDirty: false,
  lastSaved: null,
  
  setContent: (content) => set({ content, isDirty: true }),
  updateSettings: (newSettings) => set((state) => ({ 
    settings: { ...state.settings, ...newSettings },
    isDirty: true 
  })),
  setIsDirty: (isDirty) => set({ isDirty }),
  setLastSaved: (date) => set({ lastSaved: date, isDirty: false }),
  reset: () => set({
    content: initialContent,
    settings: initialSettings,
    isDirty: false,
    lastSaved: null,
  }),
}))
