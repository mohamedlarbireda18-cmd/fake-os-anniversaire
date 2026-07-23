import { create } from 'zustand'

interface ConversationState {
  unlockedIds: string[]
  shownNovaMessages: string[]
  unlock: (id: string) => void
  isUnlocked: (id: string) => boolean
  markNovaMessageShown: (id: string) => void
  isNovaMessageShown: (id: string) => boolean
  reset: () => void
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  unlockedIds: ['first-contact'],
  shownNovaMessages: [],
  
  unlock: (id: string) => {
    set((state) => ({
      unlockedIds: state.unlockedIds.includes(id)
        ? state.unlockedIds
        : [...state.unlockedIds, id],
    }))
  },
  
  isUnlocked: (id: string) => {
    return get().unlockedIds.includes(id)
  },

  markNovaMessageShown: (id: string) => {
    set((state) => ({
      shownNovaMessages: state.shownNovaMessages.includes(id)
        ? state.shownNovaMessages
        : [...state.shownNovaMessages, id],
    }))
  },

  isNovaMessageShown: (id: string) => {
    return get().shownNovaMessages.includes(id)
  },
  
  reset: () => {
    set({ unlockedIds: ['first-contact'], shownNovaMessages: [] })
  },
}))