import { create } from 'zustand'

interface IconPosition {
  x: number
  y: number
}

interface IconState {
  positions: Record<string, IconPosition>
  selectedIcon: string | null
  setPosition: (id: string, x: number, y: number) => void
  getPosition: (id: string) => IconPosition
  setSelectedIcon: (id: string | null) => void
}

const defaultPositions: Record<string, IconPosition> = {
  conversations: { x: 40, y: 30 },
  photos: { x: 40, y: 120 },
  music: { x: 40, y: 210 },
  notes: { x: 40, y: 300 },
  trash: { x: 40, y: 390 },
  final: { x: 200, y: 250 },
}

export const useIconStore = create<IconState>((set, get) => ({
  positions: { ...defaultPositions },
  selectedIcon: null,
  
  setPosition: (id, x, y) => {
    set((state) => ({
      positions: {
        ...state.positions,
        [id]: { x, y },
      },
    }))
  },
  
  getPosition: (id) => {
    return get().positions[id] || { x: 40, y: 30 }
  },

  setSelectedIcon: (id) => {
    set({ selectedIcon: id })
  },
}))