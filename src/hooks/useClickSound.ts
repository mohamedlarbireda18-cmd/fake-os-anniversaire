import { useEffect, useRef } from 'react'
import { Howl } from 'howler'

let clickSound: Howl | null = null

const getClickSound = () => {
  if (!clickSound) {
    clickSound = new Howl({
      src: ['/assets/audio/click.mp3'],
      volume: 0.15,
      preload: true,
    })
  }
  return clickSound
}

export function useClickSound() {
  const soundRef = useRef(getClickSound())

  useEffect(() => {
    const handleClick = () => {
      soundRef.current.play()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const playClick = () => {
    soundRef.current.play()
  }

  return { playClick }
}