import { create } from 'zustand'

export interface WindowState {
  id: string
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

interface OSState {
  windows: WindowState[]
  openWindow: (id: string, title: string) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  focusWindow: (id: string) => void
  highestZIndex: number
}

export const useOSStore = create<OSState>((set, get) => ({
  windows: [
    { id: 'conversations', title: 'Conversations', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    { id: 'photos', title: 'Photos', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    { id: 'music', title: 'Music', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    { id: 'notes', title: 'Notes', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    { id: 'final', title: 'FINAL', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    { id: 'trash', title: 'Trash', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
  ],
  highestZIndex: 0,
  
  openWindow: (id, title) => {
    set((state) => ({
      highestZIndex: state.highestZIndex + 1,
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, isOpen: true, isMinimized: false, title, zIndex: state.highestZIndex + 1 }
          : w
      ),
    }))
  },
  
  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isOpen: false, isMaximized: false } : w
      ),
    }))
  },
  
  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    }))
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }))
  },
  
  focusWindow: (id) => {
    set((state) => ({
      highestZIndex: state.highestZIndex + 1,
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: state.highestZIndex + 1 } : w
      ),
    }))
  },
}))