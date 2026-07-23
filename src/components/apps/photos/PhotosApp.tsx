import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePhotosStore } from '../../../state/usePhotosStore'
import { useNovaStore } from '../../../state/useNovaStore'
import './PhotosApp.scss'

export default function PhotosApp() {
  const photos = usePhotosStore((state) => state.photos)
  const isUnlocked = usePhotosStore((state) => state.isUnlocked)
  const hasEverOpenedPhoto = usePhotosStore((state) => state.hasEverOpenedPhoto)
  const setHasEverOpenedPhoto = usePhotosStore((state) => state.setHasEverOpenedPhoto)
  const showMessage = useNovaStore((state) => state.showMessage)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  const selectedPhoto = photos.find((p) => p.id === selectedId)

  const handlePhotoClick = (photoId: string) => {
    if (isUnlocked(photoId)) {
      setSelectedId(photoId)
      setViewerOpen(true)
      setShowCaption(false)

      if (!hasEverOpenedPhoto) {
        setHasEverOpenedPhoto()
        setTimeout(() => {
          showMessage("Photo viewer tip: click the image to see the full caption, and use the download button to save this memory! 📸💾", 'interruptible')
        }, 500)
      }
    } else {
      showMessage("This memory is still locked. Keep exploring conversations to unlock it! 📸", 'interruptible')
    }
  }

  const handleCloseViewer = () => {
    setViewerOpen(false)
    setShowCaption(false)
  }

  const handleImageClick = () => {
    setShowCaption(!showCaption)
  }

  const handleDownload = () => {
    if (!selectedPhoto) return
    const link = document.createElement('a')
    link.href = selectedPhoto.src
    link.download = `${selectedPhoto.title.replace(/\s+/g, '-').toLowerCase()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="photos-app">
      {/* Header */}
      <div className="photos-header">
        <div className="photos-header-icon">📷</div>
        <div className="photos-header-info">
          <h3 className="photos-title">Photo Archive</h3>
          <p className="photos-subtitle">Every picture tells a story.</p>
        </div>
      </div>

      {/* Grille de photos */}
      <div className="photos-grid">
        {photos.map((photo, index) => {
          const unlocked = isUnlocked(photo.id)
          return (
            <motion.div
              key={photo.id}
              className={`photo-card ${!unlocked ? 'locked' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              whileHover={unlocked ? { scale: 1.03 } : {}}
              onClick={() => handlePhotoClick(photo.id)}
            >
              <div className="photo-thumb">
                <img
                  src={photo.src}
                  alt={photo.title}
                  draggable={false}
                />
                {!unlocked && (
                  <div className="photo-lock-overlay">
                    <span className="lock-icon">🔒</span>
                  </div>
                )}
              </div>
              <div className="photo-info">
                <span className="photo-title">{unlocked ? photo.title : '???'}</span>
                <span className="photo-date">{unlocked ? photo.date : 'Locked'}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Visionneuse plein écran */}
      <AnimatePresence>
        {viewerOpen && selectedPhoto && (
          <motion.div
            className="photo-viewer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseViewer}
          >
            <motion.div
              ref={viewerRef}
              className="photo-viewer"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barre de titre */}
              <div className="viewer-header">
                <div className="viewer-header-info">
                  <h3>{selectedPhoto.title}</h3>
                  <p>{selectedPhoto.subtitle}</p>
                </div>
                <div className="viewer-actions">
                  <button className="viewer-btn" onClick={handleDownload} title="Download">
                    💾
                  </button>
                  <button className="viewer-close" onClick={handleCloseViewer}>✕</button>
                </div>
              </div>

              {/* Image */}
              <div className="viewer-image" onClick={handleImageClick}>
                <img src={selectedPhoto.src} alt={selectedPhoto.title} draggable={false} />
              </div>

              {/* Légende */}
              <AnimatePresence>
                {showCaption && (
                  <motion.div
                    className="viewer-caption"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="caption-line"></div>
                    <p>{selectedPhoto.caption}</p>
                    <p className="caption-hint">Click the image to hide caption</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="viewer-footer">
                <span>{selectedPhoto.date}</span>
                <div className="viewer-footer-right">
                  {!showCaption && (
                    <span className="caption-hint-small">Click image for caption</span>
                  )}
                  <span className="memory-badge">Memory Restored</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="photos-footer">
        <span className="footer-icon">💾</span>
        <span>MemoryOS v1.0 — Photo Archive</span>
      </div>
    </div>
  )
}