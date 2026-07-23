import { create } from 'zustand'

export type NovaPhase = 'hidden' | 'appearing' | 'talking' | 'vanishing' | 'moving' | 'reappearing' | 'idle'

interface QueuedMessage {
  text: string
  priority: 'sequence' | 'interruptible'
}

interface NovaState {
  isVisible: boolean
  currentMessage: string | null
  phase: NovaPhase
  messagePriority: 'sequence' | 'interruptible'
  showMessage: (message: string, priority?: 'sequence' | 'interruptible') => void
  hideMessage: () => void
  queueMessages: (messages: string[], priority?: 'sequence' | 'interruptible') => void
  setPhase: (phase: NovaPhase) => void
  queue: QueuedMessage[]
  processQueue: () => void
}

export const useNovaStore = create<NovaState>((set, get) => ({
  isVisible: false,
  currentMessage: null,
  phase: 'hidden',
  messagePriority: 'sequence',
  queue: [],

  showMessage: (message: string, priority: 'sequence' | 'interruptible' = 'sequence') => {
    const state = get()
    
    if (state.isVisible && state.currentMessage) {
      if (state.messagePriority === 'sequence') {
        set((s) => ({
          queue: [...s.queue, { text: message, priority }],
        }))
        return
      }
    }
    
    set({ isVisible: true, currentMessage: message, phase: 'talking', messagePriority: priority })
  },

  hideMessage: () => {
    set({ isVisible: false, currentMessage: null, messagePriority: 'sequence' })
    setTimeout(() => {
      const { queue } = get()
      if (queue.length > 0) {
        get().processQueue()
      } else {
        set({ phase: 'idle' })
      }
    }, 400)
  },

  queueMessages: (messages: string[], priority: 'sequence' | 'interruptible' = 'sequence') => {
    set((state) => ({
      queue: [...state.queue, ...messages.map(text => ({ text, priority }))],
    }))
    const { currentMessage } = get()
    if (!currentMessage) {
      get().processQueue()
    }
  },

  processQueue: () => {
    const { queue } = get()
    if (queue.length > 0) {
      const next = queue[0]
      set({ queue: queue.slice(1) })
      get().showMessage(next.text, next.priority)
    }
  },

  setPhase: (phase: NovaPhase) => {
    set({ phase })
  },
}))