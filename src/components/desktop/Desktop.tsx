import { motion } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import Nova from '../nova/Nova'
import DesktopIcon from './DesktopIcon'
import WindowManager from '../window/WindowManager'
import MemoryProgressBar from '../system/MemoryProgressBar'
import { useProgressStore } from '../../state/useProgressStore'
import { useNovaStore } from '../../state/useNovaStore'
import { useIconStore } from '../../state/useIconStore'
import { useOSStore } from '../../state/useOSStore'
import { useMusicStore } from '../../state/useMusicStore'

const apps = [
  { id: 'conversations', label: 'Conversations', unlockedAt: 0 },
  { id: 'photos', label: 'Photos', unlockedAt: 0 },
  { id: 'music', label: 'Music', unlockedAt: 0 },
  { id: 'notes', label: 'Notes', unlockedAt: 0 },
  { id: 'trash', label: 'Trash', unlockedAt: 0 },
]

export default function Desktop() {
  const progress = useProgressStore((state) => state.progress)
  const showMessage = useNovaStore((state) => state.showMessage)
  const setPhase = useNovaStore((state) => state.setPhase)
  const phase = useNovaStore((state) => state.phase)
  const setSelectedIcon = useIconStore((state) => state.setSelectedIcon)
  const windows = useOSStore((state) => state.windows)

  const [showProgressBar, setShowProgressBar] = useState(false)
  const [progressBarMinimized, setProgressBarMinimized] = useState(false)
  const [showFinalIcon, setShowFinalIcon] = useState(false)

  const introPlayed = useRef(false)
  const secondMessagePlayed = useRef(false)
  const vanishingStarted = useRef(false)
  const finalMessagePlayed = useRef(false)
  const idleTimerRef = useRef<number | null>(null)

  const isAnyWindowOpen = windows.some((w) => w.isOpen && !w.isMinimized)

  useEffect(() => {
    if (!introPlayed.current) {
      const timer = setTimeout(() => {
        introPlayed.current = true
        setPhase('appearing')
        setTimeout(() => {
          setPhase('talking')
          showMessage("My creator, if we can call him that, made this for you.")
        }, 1000)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (introPlayed.current && !secondMessagePlayed.current && phase === 'idle') {
      const timer = setTimeout(() => {
        secondMessagePlayed.current = true
        showMessage("I'll leave you sometimes to explore it.  Oh and im Nova btw, nice to meet you! 😎")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  useEffect(() => {
    if (secondMessagePlayed.current && !vanishingStarted.current && phase === 'idle') {
      const timer = setTimeout(() => {
        vanishingStarted.current = true
        setPhase('vanishing')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  useEffect(() => {
    if (vanishingStarted.current && !finalMessagePlayed.current && phase === 'idle') {
      const timer = setTimeout(() => {
        finalMessagePlayed.current = true
        showMessage("I'm here if you need anything. I'm as lost as you are, in fact... but I'm not supposed to say that.")

        idleTimerRef.current = window.setTimeout(() => {
          showMessage(
            "You look a bit lost. I don't know how that's possible, but... double-click on an icon to open it! 💡",
            'interruptible'
          )
        }, 30000)
      }, 1500)
      return () => {
        clearTimeout(timer)
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current)
          idleTimerRef.current = null
        }
      }
    }
  }, [phase])

  useEffect(() => {
    if (isAnyWindowOpen && idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
  }, [isAnyWindowOpen])

  useEffect(() => {
    if (progress >= 99 && !showFinalIcon) {
      setShowFinalIcon(true)
    }
  }, [progress, showFinalIcon])

  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null)
    }
  }, [setSelectedIcon])

  const getChapter = () => {
    if (progress >= 99) return 5
    if (progress >= 80) return 4
    if (progress >= 50) return 3
    if (progress >= 20) return 2
    return 1
  }

  const chapter = getChapter()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      onClick={handleDesktopClick}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/assets/images/backgrounds/desktop-bg.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isAnyWindowOpen
            ? 'rgba(0, 0, 0, 0.45)'
            : getOverlayForChapter(chapter),
          transition: 'background 0.8s ease',
        }} />
      </div>

      {/* Contrôles musique en haut à droite */}
      <MusicControls />

      {apps.map((app, index) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 + index * 0.3, duration: 0.5 }}
          style={{ position: 'absolute', zIndex: 1 }}
        >
          <DesktopIcon
            id={app.id}
            label={app.label}
            isUnlocked={progress >= app.unlockedAt}
          />
        </motion.div>
      ))}

      {showFinalIcon && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
          style={{ position: 'absolute', zIndex: 1 }}
        >
          <DesktopIcon id="final" label="FINAL" isUnlocked={true} />
        </motion.div>
      )}

      <Taskbar
        progress={progress}
        onToggleProgressBar={() => {
          if (progressBarMinimized) {
            setProgressBarMinimized(false)
            setShowProgressBar(true)
          } else {
            setShowProgressBar(!showProgressBar)
            setProgressBarMinimized(false)
          }
        }}
        isProgressBarOpen={showProgressBar}
      />

      <Nova />

      {showProgressBar && (
        <MemoryProgressBar
          progress={progress}
          onClose={() => {
            setShowProgressBar(false)
            setProgressBarMinimized(true)
          }}
        />
      )}

      <WindowManager />
    </motion.div>
  )
}

// Contrôles musique en haut à droite
function MusicControls() {
  const hasEverPlayed = useMusicStore((state) => state.hasEverPlayed)
  const isPlaying = useMusicStore((state) => state.isPlaying)
  const isMuted = useMusicStore((state) => state.isMuted)
  const toggleMute = useMusicStore((state) => state.toggleMute)
  const pause = useMusicStore((state) => state.pause)
  const play = useMusicStore((state) => state.play)
  const currentTrackId = useMusicStore((state) => state.currentTrackId)
  const backgroundAudio = useMusicStore((state) => state.backgroundAudio)

  if (!hasEverPlayed) return null

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause()
    } else if (currentTrackId && backgroundAudio) {
      play(currentTrackId)
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        padding: '4px 6px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Play/Pause */}
      <button
        onClick={handleTogglePlay}
        style={{
          width: '32px',
          height: '32px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isPlaying ? '#fff' : '#888',
          padding: 0,
        }}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Séparateur */}
      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />

      {/* Mute/Unmute */}
      <button
        onClick={toggleMute}
        style={{
          width: '32px',
          height: '32px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isMuted ? '#888' : '#fff',
          padding: 0,
        }}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}

function getOverlayForChapter(chapter: number): string {
  const overlays: Record<number, string> = {
    1: 'rgba(10, 8, 20, 0.35)',
    2: 'rgba(15, 12, 30, 0.25)',
    3: 'rgba(20, 15, 35, 0.15)',
    4: 'rgba(10, 8, 25, 0.20)',
    5: 'rgba(8, 6, 18, 0.30)',
  }
  return overlays[chapter] || overlays[1]
}

function Taskbar({
  progress,
  onToggleProgressBar,
  isProgressBarOpen,
}: {
  progress: number
  onToggleProgressBar: () => void
  isProgressBarOpen: boolean
}) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40px',
      background: 'rgba(0, 0, 0, 0.75)',
      borderTop: '2px solid #555',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      fontSize: '13px',
      color: '#aaa',
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div
          onClick={onToggleProgressBar}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: isProgressBarOpen
              ? 'rgba(201, 169, 110, 0.2)'
              : 'rgba(255, 255, 255, 0.05)',
            border: isProgressBarOpen
              ? '1px solid rgba(201, 169, 110, 0.4)'
              : '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '12px',
            fontFamily: "'Courier New', monospace",
          }}
        >
          <span style={{ fontSize: '14px' }}>💾</span>
          <span style={{ color: isProgressBarOpen ? '#e8dcc8' : '#888' }}>
            Archives
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: '#777' }}>
            {Math.floor(progress)}%
          </span>
          <div style={{
            width: '100px',
            height: '6px',
            background: '#222',
            borderRadius: '3px',
            overflow: 'hidden',
            border: '1px solid #333',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #6b5b8a, #c9a96e, #ffd4a3)',
                borderRadius: '2px',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>

      <div style={{
        fontSize: '12px',
        color: '#777',
        fontFamily: "'Courier New', monospace",
        padding: '3px 10px',
        border: '1px solid #333',
        borderRadius: '3px',
      }}>
        {currentTime}
      </div>
    </div>
  )
}

function getCurrentTime(): string {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}