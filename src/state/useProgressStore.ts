import { create } from 'zustand'

interface ProgressState {
  progress: number
  advance: (amount: number) => void
  getChapter: () => number
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: 0,
  
  advance: (amount: number) => {
    set((state) => ({
      progress: Math.min(100, state.progress + amount)
    }))
  },
  
  getChapter: () => {
    const p = get().progress
    if (p >= 99) return 5
    if (p >= 80) return 4
    if (p >= 50) return 3
    if (p >= 20) return 2
    return 1
  }
}))