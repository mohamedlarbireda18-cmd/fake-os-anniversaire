import { useOSStore } from '../../state/useOSStore'
import type { WindowState } from '../../state/useOSStore'
import Window from './Window'
import ConversationsApp from '../apps/conversations/ConversationsApp'
import PhotosApp from '../apps/photos/PhotosApp'
import MusicApp from '../apps/music/MusicApp'
import NotesApp from '../apps/notes/NotesApp'
import FinalApp from '../apps/final/FinalApp'
import TrashApp from '../apps/trash/TrashApp'
import type { ComponentType } from 'react'

const appComponents: Record<string, ComponentType> = {
  conversations: ConversationsApp,
  photos: PhotosApp,
  music: MusicApp,
  notes: NotesApp,
  final: FinalApp,
  trash: TrashApp,
}

export default function WindowManager() {
  const windows: WindowState[] = useOSStore((state) => state.windows)

  return (
    <>
      {windows.map((win: WindowState) => {
        if (!win.isOpen) return null
        const AppComponent = appComponents[win.id]
        if (!AppComponent) return null

        return (
          <Window key={win.id} windowState={win}>
            <AppComponent />
          </Window>
        )
      })}
    </>
  )
}