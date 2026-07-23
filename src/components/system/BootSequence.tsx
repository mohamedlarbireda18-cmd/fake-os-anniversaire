import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BootSequenceProps {
  onComplete: () => void
}

const bootLines = [
  'Initializing Memory OS...',
  'Scanning personal archives...',
  'Restoring saved memories...',
  'Loading emotional database...',
  'Preparing desktop...',
]

const loadingMessages = [
  'Scanning memory sectors...',
  'Loading conversations...',
  'Restoring photographs...',
  'Loading music...',
  'Synchronizing memories...',
  'Restoring timeline...',
  'Preparing desktop...',
]

const iconImages = [
  '/assets/images/icons/conversations.png',
  '/assets/images/icons/photos.png',
  '/assets/images/icons/music.png',
  '/assets/images/icons/notes.png',
  '/assets/images/icons/final.png',
]

const novaDialogues = [
  "Oh...",
  "A human!",
  "I haven't seen one in a long time...",
  "Kidding. I know what you're here for.",
  "Follow me.",
]

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<'boot' | 'loading' | 'nova' | 'transition'>('boot')
  const [lines, setLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [showCrt, setShowCrt] = useState(false)

  useEffect(() => {
    if (phase !== 'boot') return

    if (currentLineIndex < bootLines.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, bootLines[currentLineIndex]])
        setCurrentLineIndex(prev => prev + 1)
      }, 1800)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setShowCursor(false)
        setPhase('loading')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [currentLineIndex, phase])

  useEffect(() => {
    const timer = setTimeout(() => setShowCrt(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        pointerEvents: 'none',
        zIndex: 10,
      }} />

      {/* CRT flicker */}
      {showCrt && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.008)',
          animation: 'crtFlicker 8s infinite',
          pointerEvents: 'none',
          zIndex: 11,
        }} />
      )}

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
        zIndex: 9,
      }} />

      <AnimatePresence mode="wait">
        {phase === 'boot' && (
          <BootLinesPhase
            key="boot"
            lines={lines}
            showCursor={showCursor}
            totalLines={bootLines.length}
          />
        )}

        {phase === 'loading' && (
          <LoadingWindowPhase
            key="loading"
            onComplete={() => setPhase('nova')}
          />
        )}

        {phase === 'nova' && (
          <NovaPhase
            key="nova"
            onComplete={() => setPhase('transition')}
          />
        )}

        {phase === 'transition' && (
          <TransitionPhase
            key="transition"
            onComplete={onComplete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// PHASE 1 : LIGNES DE BOOT
// ============================================
function BootLinesPhase({ lines, showCursor, totalLines }: {
  lines: string[]
  showCursor: boolean
  totalLines: number
}) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        zIndex: 5,
      }}
    >
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            color: i === lines.length - 1 ? '#d4c8a0' : '#888',
            fontSize: '13px',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ color: '#555', marginRight: '6px' }}>&gt;</span>
          {line}
          {i === lines.length - 1 && showCursor && i < totalLines - 1 && (
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '14px',
              background: '#d4c8a0',
              animation: 'blink 1s step-end infinite',
              marginLeft: '2px',
            }} />
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}

// ============================================
// PHASE 2 : FENÊTRE DE CHARGEMENT
// ============================================
function LoadingWindowPhase({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [currentIconIndex, setCurrentIconIndex] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState<string[]>([])

  useEffect(() => {
    const totalDuration = 8000
    const steps = loadingMessages.length
    const stepDuration = totalDuration / steps

    setVisibleMessages([loadingMessages[0]])

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / steps)
        return Math.min(newProgress, 100)
      })

      setCurrentIconIndex((prev) => {
        const next = prev + 1
        return Math.min(next, iconImages.length - 1)
      })

      setVisibleMessages((prev) => {
        const nextIndex = prev.length
        if (nextIndex < loadingMessages.length) {
          return [...prev, loadingMessages[nextIndex]]
        }
        return prev
      })
    }, stepDuration)

    const completeTimer = setTimeout(() => {
      clearInterval(interval)
      setTimeout(onComplete, 600)
    }, totalDuration + 400)

    return () => {
      clearInterval(interval)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        width: '400px',
        background: '#1e1e2e',
        border: '3px solid #c4b8a8',
        borderRadius: '6px',
        boxShadow: '0 0 0 2px #0a0a0f, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {/* Barre de titre */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 8px',
        background: 'linear-gradient(90deg, #e8dcc8 0%, #d4c8b0 100%)',
        borderBottom: '2px solid #b8a888',
        fontFamily: "'Courier New', monospace",
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px' }}>💾</span>
          <span style={{
            fontSize: '12px',
            color: '#3a3a4e',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
          }}>
            MemoryOS v1.0
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <MiniButton symbol="─" />
          <MiniButton symbol="□" />
          <MiniButton symbol="✕" />
        </div>
      </div>

      {/* Contenu */}
      <div style={{
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #1e1e32 100%)',
      }}>
        {/* Icônes - PLUS GRANDES */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '4px',
        }}>
          {iconImages.map((iconSrc, i) => (
            <motion.img
              key={i}
              src={iconSrc}
              alt=""
              initial={{ opacity: 0, y: 6 }}
              animate={{
                opacity: i <= currentIconIndex ? 1 : 0.2,
                y: 0,
              }}
              transition={{ delay: i * 0.3, duration: 0.4 }}
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                imageRendering: 'pixelated',
                filter: i <= currentIconIndex ? 'none' : 'grayscale(100%)',
              }}
            />
          ))}
        </div>

        {/* Barre de progression */}
        <div style={{
          width: '100%',
          height: '18px',
          background: '#0a0a14',
          border: '2px solid #555',
          borderRadius: '2px',
          padding: '2px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #6b5b8a 0%, #c9a96e 50%, #ffd4a3 100%)',
              borderRadius: '1px',
              position: 'relative',
              width: `${progress}%`,
            }}
            transition={{ duration: 0.3, ease: 'linear' }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '1px 1px 0 0',
            }} />
          </motion.div>

          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${i * 10}%`,
                top: '2px',
                width: '1px',
                height: 'calc(100% - 4px)',
                background: 'rgba(0,0,0,0.3)',
              }}
            />
          ))}
        </div>

        {/* Messages */}
        <div style={{
          fontSize: '11px',
          fontFamily: "'Courier New', monospace",
          color: '#888',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {visibleMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: '#555' }}>&gt;</span>
              <span style={{
                color: i === visibleMessages.length - 1 ? '#d4c8a0' : '#666',
              }}>
                {msg}
              </span>
              {i === visibleMessages.length - 1 && (
                <span style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '10px',
                  background: '#d4c8a0',
                  animation: 'blink 1s step-end infinite',
                }} />
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 50 ? 1 : 0 }}
          style={{
            fontSize: '10px',
            color: '#6b5b8a',
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: '4px',
          }}
        >
          Each memory finds its place...
        </motion.p>
      </div>
    </motion.div>
  )
}

// ============================================
// PHASE 3 : INTRODUCTION DE NOVA
// ============================================
function NovaPhase({ onComplete }: { onComplete: () => void }) {
  const [appeared, setAppeared] = useState(false)
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [showBubble, setShowBubble] = useState(false)
  const [isVanishing, setIsVanishing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAppeared(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!appeared) return
    const timer = setTimeout(() => {
      setShowBubble(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [appeared])

  const handleNextDialogue = () => {
    if (dialogueIndex < novaDialogues.length - 1) {
      setShowBubble(false)
      setTimeout(() => {
        setDialogueIndex(prev => prev + 1)
        setShowBubble(true)
      }, 300)
    } else {
      // Dernier dialogue ("Follow me.") -> Nova disparaît
      setShowBubble(false)
      setIsVanishing(true)
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        background: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a14 70%)',
      }}
    >
      {/* Nova */}
      <motion.div
        initial={{ opacity: 0, scale: 0, x: 100, y: 100 }}
        animate={
          isVanishing
            ? { opacity: 0, scale: 0.3, filter: 'brightness(2) blur(4px)' }
            : appeared
              ? { opacity: 1, scale: 1, x: 0, y: 0 }
              : { opacity: 0, scale: 0, x: 100, y: 100 }
        }
        transition={{
          duration: isVanishing ? 0.8 : 1.5,
          ease: 'easeOut',
          type: 'spring',
          stiffness: 50,
          damping: 15,
        }}
        style={{
          position: 'relative',
          marginBottom: '40px',
        }}
      >
        {/* Particules orbitantes */}
        {!isVanishing && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3,
            }}
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              background: '#ffd4a3',
              borderRadius: '50%',
              boxShadow: '0 0 4px #ffd4a3',
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 60}deg) translateX(28px)`,
            }}
          />
        ))}

        {/* Image de Nova */}
        <motion.div
          animate={
            isVanishing
              ? { scale: 0.5 }
              : { scale: [1, 1.08, 1] }
          }
          transition={{
            duration: isVanishing ? 0.8 : 2.5,
            repeat: isVanishing ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: '80px',
            height: '80px',
            position: 'relative',
          }}
        >
          <img
            src="/assets/images/nova.png"
            alt="Nova"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Bulle de dialogue */}
      <AnimatePresence>
        {showBubble && dialogueIndex < novaDialogues.length && !isVanishing && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={handleNextDialogue}
            style={{
              cursor: 'pointer',
              position: 'relative',
              maxWidth: '340px',
            }}
          >
            <div style={{
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '10px solid rgba(20, 18, 30, 0.95)',
              margin: '0 auto',
              filter: 'drop-shadow(0 -1px 1px rgba(201,169,110,0.3))',
            }} />

            <div style={{
              background: 'rgba(20, 18, 30, 0.95)',
              border: '2px solid #c9a96e',
              borderRadius: '10px',
              padding: '16px 20px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}>
              <p style={{
                color: '#f0e6d3',
                fontSize: '13px',
                fontFamily: "'Courier New', monospace",
                lineHeight: '1.7',
                margin: 0,
              }}>
                {novaDialogues[dialogueIndex]}
              </p>
              <p style={{
                color: '#6b5b8a',
                fontSize: '9px',
                marginTop: '8px',
                marginBottom: 0,
              }}>
                (click to continue)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================
// PHASE 4 : TRANSITION VERS LE DESKTOP
// ============================================
function TransitionPhase({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #1a1a2e 0%, #2d1f3d 40%, #3d2d4e 70%, #4d3d5e 100%)',
        }}
      />

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.15,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: '#ffd4a3',
            borderRadius: '50%',
            boxShadow: '0 0 6px #ffd4a3',
            left: `${30 + (i * 6)}%`,
            top: `${40 + Math.sin(i) * 15}%`,
          }}
        />
      ))}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, times: [0, 0.5, 1] }}
        style={{
          color: '#d4c8a0',
          fontSize: '12px',
          zIndex: 2,
          fontFamily: "'Courier New', monospace",
        }}
      >
        Entering memories...
      </motion.p>
    </motion.div>
  )
}

// ============================================
// COMPOSANT UTILITAIRE
// ============================================
function MiniButton({ symbol }: { symbol: string }) {
  return (
    <div style={{
      width: '20px',
      height: '18px',
      background: '#d4c8b0',
      border: '1px solid #a89878',
      borderRadius: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '9px',
      color: '#5a5a6e',
      cursor: 'default',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
    }}>
      {symbol}
    </div>
  )
}