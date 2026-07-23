import { create } from 'zustand'

interface Photo {
  id: string
  src: string
  title: string
  subtitle: string
  date: string
  caption: string
  unlocked: boolean
  unlockedBy: string | null
}

interface PhotosState {
  photos: Photo[]
  hasEverOpenedPhoto: boolean
  setHasEverOpenedPhoto: () => void
  unlockPhoto: (id: string) => void
  isUnlocked: (id: string) => boolean
}

export const usePhotosStore = create<PhotosState>((set, get) => ({
  photos: [
    {
      id: 'photo-1',
      src: '/assets/images/photos/photo-1.jpg',
      title: 'First Memory',
      subtitle: 'The day everything started.',
      date: '25/06/2023',
      caption: "The very first screenshot. The conversation that started it all. I still remember how my heart raced when I saw that notification... 📱✨",
      unlocked: false,
      unlockedBy: 'first-contact',
    },
    {
      id: 'photo-2',
      src: '/assets/images/photos/photo-2.jpg',
      title: 'Getting Closer',
      subtitle: 'When curiosity became something more.',
      date: '28/06/2023',
      caption: "Late night talks, getting to know each other. Every message made me smile like an idiot. 😊",
      unlocked: false,
      unlockedBy: 'first-real-talk',
    },
    {
      id: 'photo-3',
      src: '/assets/images/photos/photo-3.jpg',
      title: 'First Picture',
      subtitle: 'A face to remember.',
      date: '26/06/2023',
      caption: "The first time I saw his face. That baby face comment still makes me laugh. He was cuter than I imagined. 📸",
      unlocked: false,
      unlockedBy: 'first-picture',
    },
    {
      id: 'photo-4',
      src: '/assets/images/photos/photo-4.jpg',
      title: 'Si Chef',
      subtitle: 'The nickname that stuck.',
      date: '03/07/2023',
      caption: "From that day on, he became 'Si Chef'. A silly nickname that became ours. 🍳",
      unlocked: false,
      unlockedBy: 'nickname',
    },
    {
      id: 'photo-5',
      src: '/assets/images/photos/photo-5.jpg',
      title: 'Jealous Moments',
      subtitle: 'When feelings got real.',
      date: '10/07/2023',
      caption: "The first time I felt jealous... That's when I knew it wasn't just friendship anymore. 💚",
      unlocked: false,
      unlockedBy: 'jealousy',
    },
    {
      id: 'photo-6',
      src: '/assets/images/photos/photo-6.jpg',
      title: 'Almost Love',
      subtitle: 'So close to saying it.',
      date: '11/07/2023',
      caption: "We were both dancing around the words. So close to saying 'I love you' but not quite there yet. 🫣",
      unlocked: false,
      unlockedBy: 'almost-confession',
    },
    {
      id: 'photo-7',
      src: '/assets/images/photos/photo-7.jpg',
      title: 'I Love You',
      subtitle: 'The words that changed everything.',
      date: '15/07/2023',
      caption: "He sang for me. And then he said those three words. I cried. Happy tears, I promise. ❤️😭",
      unlocked: false,
      unlockedBy: 'first-i-love-you',
    },
    {
      id: 'photo-8',
      src: '/assets/images/photos/photo-8.jpg',
      title: 'Late Nights',
      subtitle: 'Endless conversations.',
      date: '22/07/2023',
      caption: "All those 'hobi' and '3ssal love youuu' messages. Every single one is precious to me. 💕",
      unlocked: false,
      unlockedBy: 'growing-closer',
    },
  ],
  hasEverOpenedPhoto: false,

  setHasEverOpenedPhoto: () => {
    set({ hasEverOpenedPhoto: true })
  },

  unlockPhoto: (id: string) => {
    set((state) => ({
      photos: state.photos.map((p) =>
        p.id === id ? { ...p, unlocked: true } : p
      ),
    }))
  },

  isUnlocked: (id: string) => {
    return get().photos.find((p) => p.id === id)?.unlocked ?? false
  },
}))