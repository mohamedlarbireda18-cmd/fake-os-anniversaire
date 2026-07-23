import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useOSStore } from '../../state/useOSStore'
import { useIconStore } from '../../state/useIconStore'
import { useNovaStore } from '../../state/useNovaStore'

interface DesktopIconProps {
  id: string
  label: string
  isUnlocked: boolean
}

const FIRST_OPEN_MESSAGES: Record<string, string> = {
  conversations: "Ah, the conversations... This is where it all began. Fair warning: it gets sentimental in there.",
  photos: "Photos! Every picture tells a story. Some of them are even in focus.",
  music: "Music archive unlocked. These songs have memories attached to them. Handle with care.",
  notes: "Notes. Little fragments of thoughts. Some are deep, some are grocery lists. I won't judge.",
  final: "...You found it. I don't have a joke for this one. Just... take your time.",
}

const TRASH_MESSAGES = [
  "The trash? Really? There's nothing in there. I checked. Multiple times. Out of boredom. Please don't click this again.",
  "I told you, it's empty. You're just wasting clicks. And my patience.",
  "THAT'S IT. I'm locking it. You brought this upon yourself.",
]

export default function DesktopIcon({ id, label, isUnlocked }: DesktopIconProps) {
  const openWindow = useOSStore((state) => state.openWindow)
  const position = useIconStore((state) => state.positions[id])
  const setPosition = useIconStore((state) => state.setPosition)
  const selectedIcon = useIconStore((state) => state.selectedIcon)
  const setSelectedIcon = useIconStore((state) => state.setSelectedIcon)
  const showMessage = useNovaStore((state) => state.showMessage)
  const phase = useNovaStore((state) => state.phase)

  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const iconStartPos = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)
  const clickTimeout = useRef<number | null>(null)

  const hasBeenOpened = useRef(false)
  const trashClickCount = useRef(0)
  const [trashLocked, setTrashLocked] = useState(false)

  const isSelected = selectedIcon === id
  const isAppLocked = id === 'trash' ? (trashLocked || !isUnlocked) : !isUnlocked

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAppLocked) return

    e.preventDefault()
    e.stopPropagation()

    setSelectedIcon(id)
    hasMoved.current = false

    dragStartPos.current = { x: e.clientX, y: e.clientY }
    iconStartPos.current = { x: position.x, y: position.y }

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
      clickTimeout.current = null
      if (!hasMoved.current) {
        if (id === 'trash') {
          trashClickCount.current += 1

          if (trashClickCount.current <= 3) {
            openWindow(id, label)
            const messageIndex = trashClickCount.current - 1
            const message = TRASH_MESSAGES[messageIndex]

            if (phase === 'idle') {
              showMessage(message, 'interruptible')
            } else {
              setTimeout(() => {
                showMessage(message, 'interruptible')
              }, 500)
            }

            if (trashClickCount.current >= 3) {
              setTimeout(() => {
                setTrashLocked(true)
                showMessage("See? Now it's locked forever. I hope you're proud of yourself.", 'interruptible')
              }, 3000)
            }
          }
        } else {
          openWindow(id, label)

          if (!hasBeenOpened.current && FIRST_OPEN_MESSAGES[id]) {
            hasBeenOpened.current = true
            if (phase === 'idle') {
              showMessage(FIRST_OPEN_MESSAGES[id], 'interruptible')
            } else {
              setTimeout(() => {
                showMessage(FIRST_OPEN_MESSAGES[id], 'interruptible')
              }, 500)
            }
          }
        }
      }
      return
    }

    clickTimeout.current = window.setTimeout(() => {
      clickTimeout.current = null
    }, 300)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartPos.current.x
      const deltaY = moveEvent.clientY - dragStartPos.current.y

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasMoved.current = true
        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current)
          clickTimeout.current = null
        }
      }

      if (hasMoved.current) {
        const newX = iconStartPos.current.x + deltaX
        const newY = iconStartPos.current.y + deltaY

        const clampedX = Math.max(0, Math.min(newX, window.innerWidth - 100))
        const clampedY = Math.max(0, Math.min(newY, window.innerHeight - 140))

        setPosition(id, clampedX, clampedY)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      setTimeout(() => {
        hasMoved.current = false
      }, 100)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <motion.div
      animate={{
        scale: isDragging ? 1.06 : 1,
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 28,
        mass: 0.6,
      }}
      onMouseDown={handleMouseDown}
      whileHover={!isAppLocked && !isDragging ? { scale: 1.04 } : {}}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        cursor: isDragging ? 'grabbing' : isAppLocked ? 'not-allowed' : 'pointer',
        opacity: isAppLocked ? 0.4 : 1,
        filter: isAppLocked ? 'grayscale(100%)' : 'none',
        userSelect: 'none',
        width: '90px',
        padding: '10px 6px',
        borderRadius: '6px',
        position: 'absolute',
        zIndex: isDragging ? 50 : isSelected ? 5 : 1,
        background: isSelected
          ? 'rgba(201, 169, 110, 0.12)'
          : 'transparent',
        border: isSelected
          ? '1px dashed rgba(201, 169, 110, 0.35)'
          : '1px solid transparent',
        transition: 'filter 0.3s, opacity 0.3s, background 0.15s, border 0.15s',
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        pointerEvents: 'none',
      }}>
        <img
          src={getIconPath(id)}
          alt={label}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            imageRendering: 'pixelated',
            filter: isAppLocked
              ? 'grayscale(100%) drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          }}
        />

        {!isAppLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.12 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, #ffd4a3, transparent)',
              borderRadius: '6px',
              pointerEvents: 'none',
            }}
          />
        )}

        {id === 'trash' && trashLocked && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            opacity: 0.8,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}>
            🔒
          </div>
        )}
      </div>

      <span style={{
        fontSize: '11px',
        color: isSelected ? '#fff' : 'rgba(255,255,255,0.9)',
        textShadow: isSelected
          ? '0 0 6px rgba(201, 169, 110, 0.6), 1px 1px 2px rgba(0,0,0,0.9)'
          : '1px 1px 2px rgba(0,0,0,0.9)',
        textAlign: 'center',
        wordBreak: 'break-word',
        maxWidth: '82px',
        lineHeight: '1.3',
        background: isSelected
          ? 'rgba(30, 30, 60, 0.85)'
          : 'rgba(0, 0, 0, 0.4)',
        padding: '2px 5px',
        borderRadius: '3px',
        pointerEvents: 'none',
        fontWeight: isSelected ? 'bold' : 'normal',
      }}>
        {id === 'trash' && trashLocked ? 'Locked 🗑️' : label}
      </span>
    </motion.div>
  )
}

function getIconPath(id: string): string {
  const iconMap: Record<string, string> = {
    conversations: '/assets/images/icons/conversations.png',
    photos: '/assets/images/icons/photos.png',
    music: '/assets/images/icons/music.png',
    notes: '/assets/images/icons/notes.png',
    final: '/assets/images/icons/final.png',
    trash: '/assets/images/icons/trash.png',
  }
  return iconMap[id] || '/assets/images/icons/notes.png'
}