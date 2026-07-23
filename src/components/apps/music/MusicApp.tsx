import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMusicStore } from '../../../state/useMusicStore'
import { useNovaStore } from '../../../state/useNovaStore'
import './MusicApp.scss'

export default function MusicApp() {
  const tracks = useMusicStore((state) => state.tracks)
  const currentTrackId = useMusicStore((state) => state.currentTrackId)
  const isPlaying = useMusicStore((state) => state.isPlaying)
  const volume = useMusicStore((state) => state.volume)
  const isMuted = useMusicStore((state) => state.isMuted)
  const hasEverPlayed = useMusicStore((state) => state.hasEverPlayed)
  const play = useMusicStore((state) => state.play)
  const pause = useMusicStore((state) => state.pause)
  const stop = useMusicStore((state) => state.stop)
  const setVolume = useMusicStore((state) => state.setVolume)
  const setHasEverPlayed = useMusicStore((state) => state.setHasEverPlayed)
  const backgroundAudio = useMusicStore((state) => state.backgroundAudio)
  const setBackgroundAudio = useMusicStore((state) => state.setBackgroundAudio)
  const showMessage = useNovaStore((state) => state.showMessage)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)

  const currentTrack = tracks.find((t) => t.id === currentTrackId)

  // Créer ou récupérer l'élément audio persistant
  useEffect(() => {
    const existingAudio = backgroundAudio

    if (existingAudio) {
      // Réutiliser l'audio existant (garde la position)
      audioRef.current = existingAudio
      setAudioLoaded(true)
      setDuration(existingAudio.duration || 0)
      setCurrentTime(existingAudio.currentTime || 0)
    } else {
      // Créer un nouvel audio
      const audio = new Audio()
      audio.preload = 'auto'
      audioRef.current = audio
      setBackgroundAudio(audio)
    }

    const audio = audioRef.current!

    const onCanPlay = () => {
      setAudioLoaded(true)
      setLoading(false)
      setDuration(audio.duration)
    }

    const onError = () => {
      setAudioLoaded(false)
      setLoading(false)
    }

    const onTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime)
      }
    }

    const onLoadedMeta = () => {
      setDuration(audio.duration)
    }

    const onEnded = () => {
      pause()
    }

    audio.addEventListener('canplaythrough', onCanPlay)
    audio.addEventListener('error', onError)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMeta)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('canplaythrough', onCanPlay)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMeta)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  // Charger la source seulement si elle change
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    const targetSrc = '/static/Zina.mp3'
    // Ne recharger que si la source est différente
    if (!audio.src.endsWith('Zina.mp3')) {
      setLoading(true)
      setAudioLoaded(false)
      audio.src = targetSrc
      audio.load()
    }
  }, [currentTrack?.id])

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioLoaded) return

    if (isPlaying) {
      audio.play().catch(() => {
        pause()
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, audioLoaded, pause])

  // Volume + Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handlePlay = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId)
    if (!track?.unlocked) {
      showMessage("This song is still locked. Maybe a special memory will unlock it... 🎵", 'interruptible')
      return
    }

    if (currentTrackId === trackId && isPlaying) {
      pause()
    } else {
      play(trackId)
      if (!hasEverPlayed) {
        setHasEverPlayed()
        setTimeout(() => {
          showMessage("New feature unlocked! You can now play music in the background, even when this app is closed. Check the sound icon in the top right! 🎵", 'interruptible')
        }, 500)
      }
    }
  }

  const handleStop = () => {
    stop()
    setCurrentTime(0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const value = parseFloat(e.target.value)
    setCurrentTime(value)
    setIsSeeking(true)
  }

  const handleSeekEnd = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = currentTime
    setIsSeeking(false)
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="music-app">
      <div className="music-header">
        <div className="music-header-icon">🎵</div>
        <div className="music-header-info">
          <h3 className="music-title">Music Archive</h3>
          <p className="music-subtitle">Songs that became memories.</p>
        </div>
        {loading && <span className="loading-badge">Loading...</span>}
      </div>

      <div className="music-body">
        <div className="music-sidebar">
          <div className="sidebar-header">
            <h4 className="sidebar-title">Playlist</h4>
            <p className="sidebar-subtitle">Songs that marked your story</p>
          </div>

          <div className="music-list">
            {tracks.map((track) => {
              const isActive = currentTrackId === track.id && isPlaying
              return (
                <motion.div
                  key={track.id}
                  className={`track-card ${isActive ? 'active' : ''} ${!track.unlocked ? 'locked' : ''}`}
                  whileHover={track.unlocked ? { scale: 1.02, x: 2 } : {}}
                  onClick={() => handlePlay(track.id)}
                >
                  <div className="track-icon">
                    {track.unlocked ? (
                      <motion.span
                        animate={isActive ? { rotate: [0, 15, -15, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🎵
                      </motion.span>
                    ) : '🔒'}
                  </div>
                  <div className="track-content">
                    <div className="track-title">
                      {track.unlocked ? track.title : '???'}
                      {track.unlocked && <span className="track-check">✓</span>}
                    </div>
                    <div className="track-artist">{track.unlocked ? track.artist : 'Locked'}</div>
                  </div>
                  {isActive && (
                    <div className="equalizer">
                      <span className="eq-bar" style={{ animationDelay: '0s' }} />
                      <span className="eq-bar" style={{ animationDelay: '0.2s' }} />
                      <span className="eq-bar" style={{ animationDelay: '0.4s' }} />
                      <span className="eq-bar" style={{ animationDelay: '0.1s' }} />
                    </div>
                  )}
                  <div className="track-duration">
                    {track.unlocked ? formatTime(duration || 0) : '--:--'}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="music-player-panel">
          <div className="album-art-container">
            <motion.div
              className="album-art"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className={`album-art-inner ${!currentTrack?.unlocked ? 'locked' : ''}`}>
                <img
                  src="/assets/images/music-cover.png"
                  alt="Album cover"
                  draggable={false}
                />
              </div>
            </motion.div>
            <div className="album-frame" />
          </div>

          <div className="song-info">
            {currentTrack ? (
              <>
                <h2 className="song-title">{currentTrack.title}</h2>
                <p className="song-artist">{currentTrack.artist}</p>
                <span className="song-memory">Memory #{tracks.findIndex(t => t.id === currentTrack.id) + 1}</span>
              </>
            ) : (
              <>
                <h2 className="song-title">No Song Selected</h2>
                <p className="song-artist">Choose a song from the playlist</p>
              </>
            )}
          </div>

          <div className="progress-container">
            <span className="time-label">{formatTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                <div className="progress-knob" style={{ left: `${progressPercent}%` }} />
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                className="progress-input"
              />
            </div>
            <span className="time-label">{formatTime(duration)}</span>
          </div>

          <div className="player-controls">
            <button className="ctrl-btn" title="Shuffle">🔀</button>
            <button className="ctrl-btn" disabled={!currentTrackId} title="Previous">⏮</button>
            <button
              className="ctrl-btn play-btn"
              onClick={() => currentTrackId && handlePlay(currentTrackId)}
              disabled={!currentTrackId || loading}
            >
              {loading ? '...' : isPlaying ? '⏸' : '▶'}
            </button>
            <button className="ctrl-btn" disabled={!currentTrackId} title="Next">⏭</button>
            <button className="ctrl-btn" title="Repeat">🔂</button>
          </div>

          <div className="volume-container">
            <span className="volume-icon">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
            <span className="volume-icon">🔊</span>
          </div>
        </div>
      </div>

      <div className="music-footer">
        <span className="footer-icon">💾</span>
        <span>MemoryOS v1.0 — Music Archive</span>
      </div>
    </div>
  )
}