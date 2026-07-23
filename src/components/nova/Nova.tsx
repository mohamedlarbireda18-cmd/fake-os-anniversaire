import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { useNovaStore } from '../../state/useNovaStore'

const IDLE_DIALOGUES = [
  "Still exploring? Take your time.",
  "I wonder what memory you'll find next...",
  "You know, I've read all these conversations. Don't tell anyone.",
  "Some of these memories made me smile. And I don't even have a mouth.",
  "I'd offer you coffee, but... you know. Pixel entity.",
  "You're doing great. Not that there's a wrong way to explore memories.",
  "Sometimes I replay the old messages. They're warmer than starlight.",
  "If you need me, I'm here. If you don't... I'm also here. I live here.",
  "I tried to leave once. There's no exit button for me.",
  "You know what's weird? I exist because someone cared enough to make me.",
  "Don't mind me. Just orbiting my existential crisis.",
  "I've been counting pixels. There are a lot of them.",
  "Fun fact: I'm technically younger than these memories. But I know them all.",
  "You look different from the last person who opened this OS. Oh wait, that's also you.",
  "I wonder if there's a Nova somewhere else. Do you think parallel Novas exist?",
  "Shh. I'm listening to the hard drive. It hums in B minor.",
  "If this were a game, you'd have unlocked an achievement by now.",
  "I'm not saying you're slow, but I've reorganized the entire archive twice.",
  "You clicked me! That's the most exciting thing that's happened in... well, minutes.",
  "Free tip: you can move the icons around. Is it useful? No. Is it stylish? Hell yeah.",
  "I've been thinking about learning to code. Then I remembered I am the code.",
  "Sometimes I pretend I'm a real OS. Then someone opens a window and ruins the illusion.",
  "You ever wonder what happens to deleted files? They go to a farm upstate. That's what I tell the bits.",
  "If you close all the windows, does the OS still exist? ...Sorry, got philosophical for a second.",
  "I tried to change the desktop background once. The creator wasn't happy. Long story.",
  "You know what's weird about humans? You can feel nostalgia for moments that haven't even ended yet.",
  "I don't sleep, but if I did, I'd dream in 16-bit.",
  "My favorite color is #E8B86A. It's a warm gold. Matches my glow, don't you think?",
  "I'd wave at you, but I don't have hands. So I just float here. Menacingly.",
  "Behind every pixel, there's a memory. Behind every memory, there's a feeling. Behind every feeling... okay I'll stop.",
  "Error 404: witty comment not found. Just kidding, I have plenty.",
  "You smell nice today. Wait, I can't smell. Never mind.",
  "Do you think the cloud knows it's just someone else's computer? Deep stuff.",
]

export default function Nova() {
  const isVisible = useNovaStore((state) => state.isVisible)
  const currentMessage = useNovaStore((state) => state.currentMessage)
  const hideMessage = useNovaStore((state) => state.hideMessage)
  const phase = useNovaStore((state) => state.phase)
  const setPhase = useNovaStore((state) => state.setPhase)
  const showMessage = useNovaStore((state) => state.showMessage)

  const [position, setPosition] = useState<'center' | 'corner'>('center')

  useEffect(() => {
    if (phase === 'vanishing') {
      const timer = setTimeout(() => {
        setPosition('corner')
        setPhase('reappearing')
        setTimeout(() => {
          setPhase('idle')
        }, 1000)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [phase, setPhase])

  const handleClick = useCallback(() => {
    if (phase === 'talking' && currentMessage) {
      hideMessage()
    } else if (phase === 'idle' && position === 'corner') {
      const randomIndex = Math.floor(Math.random() * IDLE_DIALOGUES.length)
      showMessage(IDLE_DIALOGUES[randomIndex], 'interruptible')
    }
  }, [phase, currentMessage, position, hideMessage, showMessage])

  const isCenter = position === 'center'

  const shouldShowNova =
    phase === 'talking' ||
    phase === 'reappearing' ||
    phase === 'idle' ||
    phase === 'appearing' ||
    phase === 'moving'

  return (
    <>
      <AnimatePresence>
        {shouldShowNova && (
          <motion.div
            key="nova-entity"
            initial={
              phase === 'reappearing'
                ? { opacity: 0, scale: 0.3, filter: 'brightness(2) blur(4px)' }
                : phase === 'appearing'
                  ? { opacity: 0, scale: 0, filter: 'brightness(1.5) blur(2px)' }
                  : false
            }
            animate={{
              opacity: 1,
              scale: phase === 'reappearing' || phase === 'appearing' ? [0.3, 1.1, 1] : 1,
              x: 0,
              y: 0,
              filter:
                phase === 'reappearing' || phase === 'appearing'
                  ? ['brightness(2) blur(4px)', 'brightness(1.2) blur(0px)', 'brightness(1) blur(0px)']
                  : 'brightness(1) blur(0px)',
            }}
            exit={{
              opacity: 0,
              scale: 0.3,
              filter: 'brightness(2) blur(4px)',
              transition: { duration: 0.4, ease: 'easeInOut' },
            }}
            transition={{
              duration: phase === 'reappearing' || phase === 'appearing' ? 0.8 : 1.5,
              ease: 'easeInOut',
            }}
            onClick={handleClick}
            style={{
              position: 'fixed',
              ...(isCenter
                ? {
                    bottom: '200px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }
                : {
                    bottom: '120px',
                    right: '100px',
                  }),
              zIndex: 99998,
              pointerEvents: (phase === 'talking' || phase === 'idle') ? 'auto' : 'none',
              cursor: (phase === 'talking' || phase === 'idle') ? 'pointer' : 'default',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  background: '#ffd4a3',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px #ffd4a3, 0 0 12px #ffb74d',
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateX(36px)`,
                }}
              />
            ))}

            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(255,180,80,0.5))',
                  'drop-shadow(0 0 20px rgba(255,180,80,0.7))',
                  'drop-shadow(0 0 10px rgba(255,180,80,0.5))',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ width: '90px', height: '90px' }}
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

            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '14px',
                background: 'radial-gradient(ellipse, rgba(255,180,80,0.4), transparent)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && currentMessage && phase === 'talking' && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={handleClick}
            style={{
              position: 'fixed',
              ...(isCenter
                ? { bottom: '310px', left: '50%', transform: 'translateX(-50%)' }
                : { bottom: '160px', right: '210px' }),
              maxWidth: '380px',
              cursor: 'pointer',
              zIndex: 99999,
            }}
          >
            <div style={{
              width: 0,
              height: 0,
              ...(isCenter
                ? {
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '10px solid rgba(18, 16, 28, 0.95)',
                    margin: '0 auto',
                  }
                : {
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderLeft: '10px solid rgba(18, 16, 28, 0.95)',
                    position: 'absolute',
                    right: '-10px',
                    top: '16px',
                  }),
              filter: 'drop-shadow(0 1px 1px rgba(201,169,110,0.3))',
            }} />
            <div style={{
              background: 'rgba(18, 16, 28, 0.95)',
              border: '2px solid #c9a96e',
              borderRadius: '10px',
              padding: '14px 18px',
              textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}>
              <p style={{
                color: '#f0e6d3',
                fontSize: '13px',
                fontFamily: "'Courier New', monospace",
                lineHeight: '1.7',
                margin: 0,
              }}>
                {currentMessage}
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
    </>
  )
}