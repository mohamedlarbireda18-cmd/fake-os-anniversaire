import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useOSStore } from '../../state/useOSStore'
import type { WindowState } from '../../state/useOSStore'
import type { ReactNode } from 'react'

interface WindowProps {
  windowState: WindowState
  children: ReactNode
}

export default function Window({ windowState, children }: WindowProps) {
  const closeWindow = useOSStore((state) => state.closeWindow)
  const minimizeWindow = useOSStore((state) => state.minimizeWindow)
  const maximizeWindow = useOSStore((state) => state.maximizeWindow)
  const focusWindow = useOSStore((state) => state.focusWindow)
  
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 900, height: 600 })

  // Recalculer la taille au resize de l'écran (utile si plein écran)
  useEffect(() => {
    const handleResize = () => {
      if (!windowState.isMaximized) {
        // Garder une taille proportionnelle mais pas trop grande
        const maxWidth = Math.min(900, window.innerWidth - 40)
        const maxHeight = Math.min(600, window.innerHeight - 100)
        setWindowSize({ width: maxWidth, height: maxHeight })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [windowState.isMaximized])

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCloseConfirm(true)
  }

  const confirmClose = () => {
    setShowCloseConfirm(false)
    closeWindow(windowState.id)
  }

  const cancelClose = () => {
    setShowCloseConfirm(false)
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    minimizeWindow(windowState.id)
  }

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation()
    maximizeWindow(windowState.id)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={() => focusWindow(windowState.id)}
        style={{
          position: 'fixed',
          ...(windowState.isMaximized
            ? {
                top: 0,
                left: 0,
                width: '100vw',
                height: 'calc(100vh - 40px)',
                borderRadius: 0,
              }
            : {
                top: '50%',
                left: '50%',
                width: `${windowSize.width}px`,
                height: `${windowSize.height}px`,
                marginTop: `-${windowSize.height / 2}px`,
                marginLeft: `-${windowSize.width / 2}px`,
                borderRadius: '8px',
                maxWidth: '95vw',
                maxHeight: 'calc(100vh - 100px)',
              }),
          background: '#F7F0E7',
          border: windowState.isMaximized ? 'none' : '3px solid #C8A996',
          boxShadow: windowState.isMaximized
            ? 'none'
            : '0 0 0 2px rgba(0,0,0,0.2), 0 16px 48px rgba(0,0,0,0.35)',
          zIndex: windowState.zIndex + 10,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Barre de titre */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: 'linear-gradient(90deg, #e8dcc8 0%, #d4c8b0 50%, #c8b898 100%)',
          borderBottom: '2px solid #b8a888',
          cursor: 'default',
          minHeight: '36px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>❤️</span>
            <span style={{
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              color: '#3a3a4e',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              fontFamily: "'Courier New', monospace",
            }}>
              {windowState.title}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <WindowButton onClick={handleMinimize} symbol="─" />
            <WindowButton onClick={handleMaximize} symbol={windowState.isMaximized ? '❐' : '□'} />
            <WindowButton onClick={handleClose} symbol="✕" isClose />
          </div>
        </div>

        {/* Contenu - responsive */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          minHeight: 0,
        }}>
          {children}
        </div>
      </motion.div>

      {/* Popup de confirmation */}
      <AnimatePresence>
        {showCloseConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
            onClick={cancelClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#F7F0E7',
                border: '3px solid #C8A996',
                borderRadius: '8px',
                padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 28px)',
                textAlign: 'center',
                maxWidth: '90vw',
                width: '340px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                fontFamily: "'Courier New', monospace",
              }}
            >
              <div style={{ fontSize: 'clamp(22px, 4vw, 28px)', marginBottom: '12px' }}>💾</div>
              <h3 style={{
                fontSize: 'clamp(12px, 2vw, 14px)',
                color: '#4F413D',
                margin: '0 0 8px',
              }}>
                Close this memory?
              </h3>
              <p style={{
                fontSize: 'clamp(10px, 1.5vw, 11px)',
                color: '#8A746B',
                margin: '0 0 20px',
                fontStyle: 'italic',
              }}>
                You can always open it again later.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={cancelClose} style={buttonStyle}>
                  Stay
                </button>
                <button onClick={confirmClose} style={{ ...buttonStyle, background: '#F6C7D7' }}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const buttonStyle: React.CSSProperties = {
  padding: 'clamp(6px, 1vw, 8px) clamp(16px, 2vw, 20px)',
  background: '#EEDFD6',
  border: '2px solid #C8A996',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: 'clamp(10px, 1.5vw, 12px)',
  color: '#4F413D',
  fontFamily: "'Courier New', monospace",
}

function WindowButton({ onClick, symbol, isClose }: {
  onClick: (e: React.MouseEvent) => void
  symbol: string
  isClose?: boolean
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 'clamp(18px, 2vw, 22px)',
        height: 'clamp(16px, 1.8vw, 20px)',
        background: isClose ? '#e8c8c0' : '#d4c8b0',
        border: '1px solid #a89878',
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(8px, 1vw, 10px)',
        color: isClose ? '#6b3a3a' : '#5a5a6e',
        cursor: 'pointer',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
        fontFamily: "'Courier New', monospace",
      }}
    >
      {symbol}
    </div>
  )
}