import { create } from 'zustand'

interface Track {
  id: string
  title: string
  artist: string
  file: string
  unlocked: boolean
  memoryText: string
}

interface MusicState {
  tracks: Track[]
  currentTrackId: string | null
  isPlaying: boolean
  volume: number
  isMuted: boolean
  hasEverPlayed: boolean
  backgroundAudio: HTMLAudioElement | null
  setBackgroundAudio: (audio: HTMLAudioElement | null) => void
  unlockTrack: (id: string) => void
  isUnlocked: (id: string) => boolean
  play: (id: string) => void
  pause: () => void
  stop: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setHasEverPlayed: () => void
}

export const useMusicStore = create<MusicState>((set, get) => ({
  tracks: [
    {
      id: 'first-song',
      title: 'Zina',
      artist: 'Raïna Raï',
      file: '/static/Zina.mp3',
      unlocked: false,
      memoryText: 'The song that became your soundtrack.',
    },
  ],
  currentTrackId: null,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  hasEverPlayed: false,
  backgroundAudio: null,

  setBackgroundAudio: (audio) => set({ backgroundAudio: audio }),

  unlockTrack: (id: string) => {
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === id ? { ...t, unlocked: true } : t
      ),
    }))
  },

  isUnlocked: (id: string) => {
    return get().tracks.find((t) => t.id === id)?.unlocked ?? false
  },

  play: (id: string) => {
    set({ currentTrackId: id, isPlaying: true })
  },

  pause: () => {
    set({ isPlaying: false })
  },

  stop: () => {
    set({ currentTrackId: null, isPlaying: false })
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) })
  },

  toggleMute: () => {
    const state = get()
    const audio = state.backgroundAudio
    if (audio) {
      if (state.isMuted) {
        audio.volume = state.volume
        set({ isMuted: false })
      } else {
        audio.volume = 0
        set({ isMuted: true })
      }
    }
  },

  setHasEverPlayed: () => {
    set({ hasEverPlayed: true })
  },
}))