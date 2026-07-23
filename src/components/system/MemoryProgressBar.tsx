import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MemoryProgressBarProps {
  progress: number // 0 à 100
  onClose?: () => void
}

const statusMessages: Record<number, string> = {
  0: 'Initialisation des archives...',
  5: 'Restauration des conversations...',
  15: 'Analyse des souvenirs partagés...',
  25: 'Reconstruction de la timeline...',
  35: 'Récupération des photographies...',
  45: 'Organisation des moments précieux...',
  55: 'Synchronisation des musiques...',
  65: 'Lecture des notes personnelles...',
  75: 'Assemblage des fragments émotionnels...',
  85: 'Presque terminé...',
  95: 'Préparation de l\'archive finale...',
  99: 'Un dernier souvenir à dévoiler...',
  100: 'Archive complète restaurée.',
}

export default function MemoryProgressBar({ progress, onClose }: MemoryProgressBarProps) {
  const [currentMessage, setCurrentMessage] = useState(statusMessages[0])
  const [showSparkle, setShowSparkle] = useState(false)
  const [sparklePosition, setSparklePosition] = useState({ x: 0, y: 0 })
  const sparkleIntervalRef = useRef<number | null>(null)

  // Mettre à jour le message selon la progression
  useEffect(() => {
    const thresholds = Object.keys(statusMessages).map(Number).sort((a, b) => a - b)
    let selectedMessage = statusMessages[0]
    
    for (const threshold of thresholds) {
      if (progress >= threshold) {
        selectedMessage = statusMessages[threshold]
      }
    }
    setCurrentMessage(selectedMessage)
  }, [progress])

  // Étincelles aléatoires dans la barre remplie
  useEffect(() => {
    if (progress <= 0) return

    sparkleIntervalRef.current = window.setInterval(() => {
      if (Math.random() > 0.6) {
        const x = Math.random() * (progress / 100) * 280
        const y = Math.random() * 14
        setSparklePosition({ x, y })
        setShowSparkle(true)
        setTimeout(() => setShowSparkle(false), 600)
      }
    }, 2000)

    return () => {
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current)
      }
    }
  }, [progress])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        width: '380px',
        background: 'linear-gradient(180deg, #1e1e32 0%, #1a1a2e 100%)',
        border: '3px solid #c4b8a8',
        borderRadius: '6px',
        boxShadow: `
          0 0 0 2px #0a0a0f,
          0 8px 32px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.03),
          0 0 40px rgba(201,169,110,0.05)
        `,
        zIndex: 200,
        overflow: 'hidden',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* ===== BARRE DE TITRE ===== */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 8px',
        background: 'linear-gradient(90deg, #e8dcc8 0%, #d4c8b0 50%, #c8b898 100%)',
        borderBottom: '2px solid #b8a888',
        fontFamily: "'Courier New', monospace",
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Icône dossier pixel */}
          <PixelFolderIcon />
          <span style={{
            fontSize: '11px',
            color: '#3a3a4e',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
          }}>
            Archive Restoration
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <TitleButton symbol="─" />
          <TitleButton symbol="□" />
          <div
            onClick={onClose}
            style={{
              width: '18px',
              height: '16px',
              background: '#d4c8b0',
              border: '1px solid #a89878',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#5a5a6e',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            ✕
          </div>
        </div>
      </div>

      {/* ===== CONTENU ===== */}
      <div style={{
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #1e1e32 100%)',
      }}>
        {/* ===== BARRE DE PROGRESSION ===== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {/* La barre */}
          <div style={{
            flex: 1,
            height: '18px',
            background: '#0e0e1a',
            border: '2px solid #3a3a4e',
            borderRadius: '2px',
            padding: '2px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
          }}>
            {/* Partie remplie */}
            <motion.div
              style={{
                height: '100%',
                borderRadius: '1px',
                position: 'relative',
                background: 'linear-gradient(90deg, #4a3a6e 0%, #8b6b7a 40%, #c9a08a 70%, #e8c896 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              {/* Reflet supérieur */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '35%',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '1px 1px 0 0',
              }} />

              {/* Étincelles */}
              <AnimatePresence>
                {showSparkle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      position: 'absolute',
                      left: sparklePosition.x,
                      top: sparklePosition.y,
                      width: '4px',
                      height: '4px',
                      background: '#fff8e0',
                      borderRadius: '50%',
                      boxShadow: '0 0 6px #ffd4a3, 0 0 12px #ffb74d',
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Petits pixels lumineux statiques */}
              {progress > 10 && (
                <PixelGlow left="20%" delay={0} />
              )}
              {progress > 30 && (
                <PixelGlow left="45%" delay={1.5} />
              )}
              {progress > 50 && (
                <PixelGlow left="65%" delay={0.8} />
              )}
              {progress > 70 && (
                <PixelGlow left="80%" delay={2} />
              )}
              {progress > 90 && (
                <PixelGlow left="92%" delay={1.2} />
              )}
            </motion.div>

            {/* Graduations pixel */}
            {[0, 25, 50, 75].map((pos) => (
              <div
                key={pos}
                style={{
                  position: 'absolute',
                  left: `${pos}%`,
                  top: '2px',
                  width: '1px',
                  height: 'calc(100% - 4px)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              />
            ))}
          </div>

          {/* Pourcentage */}
          <motion.span
            key={Math.floor(progress)}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: '13px',
              fontFamily: "'Courier New', monospace",
              color: '#e8dcc8',
              minWidth: '36px',
              textAlign: 'right',
              letterSpacing: '0.5px',
            }}
          >
            {Math.floor(progress)}%
          </motion.span>
        </div>

        {/* ===== MESSAGE POÉTIQUE ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              minHeight: '32px',
            }}
          >
            {/* Petite icône animée */}
            <motion.span
              animate={{
                opacity: [0.5, 1, 0.5],
                rotate: [0, 3, 0, -3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ fontSize: '11px', marginTop: '1px' }}
            >
              {progress < 100 ? '💾' : '✨'}
            </motion.span>

            <div>
              <p style={{
                fontSize: '10px',
                fontFamily: "'Courier New', monospace",
                color: progress < 100 ? '#a09888' : '#c9a96e',
                margin: 0,
                lineHeight: '1.6',
                letterSpacing: '0.3px',
              }}>
                {currentMessage}
              </p>

              {/* Message supplémentaire à 99% */}
              {progress >= 99 && progress < 100 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    fontSize: '9px',
                    fontFamily: "'Courier New', monospace",
                    color: '#6b5b8a',
                    margin: '4px 0 0 0',
                    fontStyle: 'italic',
                  }}
                >
                  L'archive est presque complète...
                </motion.p>
              )}

              {/* Message à 100% */}
              {progress >= 100 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    fontSize: '9px',
                    fontFamily: "'Courier New', monospace",
                    color: '#c9a96e',
                    margin: '4px 0 0 0',
                  }}
                >
                  Tout est prêt. Le dernier souvenir t'attend.
                </motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ===== LUEUR PÉRIPHÉRIQUE SUBTILE ===== */}
      <motion.div
        animate={{
          opacity: [0, 0.03, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '8px',
          background: 'transparent',
          boxShadow: '0 0 20px rgba(201,169,110,0.15)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  )
}

// ============================================
// PETITS COMPOSANTS UTILITAIRES
// ============================================

function TitleButton({ symbol }: { symbol: string }) {
  return (
    <div style={{
      width: '18px',
      height: '16px',
      background: '#d4c8b0',
      border: '1px solid #a89878',
      borderRadius: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '8px',
      color: '#5a5a6e',
      cursor: 'default',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
    }}>
      {symbol}
    </div>
  )
}

function PixelFolderIcon() {
  return (
    <div style={{
      width: '14px',
      height: '12px',
      position: 'relative',
    }}>
      {/* Arrière du dossier */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '14px',
        height: '10px',
        background: '#c9a96e',
        borderRadius: '1px',
        border: '1px solid #a88858',
      }} />
      {/* Onglet */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 1,
        width: '8px',
        height: '4px',
        background: '#d4b878',
        borderRadius: '1px 1px 0 0',
        border: '1px solid #a88858',
        borderBottom: 'none',
      }} />
      {/* Petit reflet */}
      <div style={{
        position: 'absolute',
        bottom: 2,
        left: 2,
        width: '6px',
        height: '2px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '1px',
      }} />
    </div>
  )
}

function PixelGlow({ left, delay }: { left: string; delay: number }) {
  return (
    <motion.div
      animate={{
        opacity: [0.3, 0.9, 0.3],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        left,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '3px',
        height: '3px',
        background: '#fff8e0',
        borderRadius: '50%',
        boxShadow: '0 0 4px #ffd4a3',
      }}
    />
  )
}