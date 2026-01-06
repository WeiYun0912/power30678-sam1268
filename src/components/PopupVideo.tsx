import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface PopupVideoProps {
  src: string
  x: number
  y: number
  onClose?: () => void
  showCloseButton?: boolean
  autoCloseOnEnd?: boolean // 影片播完自動關閉
  loop?: boolean // 是否循環播放
}

export function PopupVideo({ src, x, y, onClose, showCloseButton = false, autoCloseOnEnd = false, loop = false }: PopupVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.3
      videoRef.current.play().catch(() => {})
    }
  }, [])

  // 影片播完自動關閉
  useEffect(() => {
    if (!autoCloseOnEnd || !videoRef.current) return

    const video = videoRef.current
    const handleEnded = () => {
      onClose?.()
    }
    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [autoCloseOnEnd, onClose])

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 1000,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 40px rgba(245, 158, 11, 0.15), 0 20px 50px rgba(0,0,0,0.6)',
        background: '#1A1A24',
      }}
    >
      {showCloseButton && (
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, background: '#F59E0B' }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            background: 'rgba(26, 26, 36, 0.9)',
            backdropFilter: 'blur(8px)',
            color: '#FAFAFA',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 200ms ease-out',
          }}
        >
          ✕
        </motion.button>
      )}
      <video
        ref={videoRef}
        src={src}
        loop={loop}
        playsInline
        style={{
          width: 280,
          height: 'auto',
          display: 'block',
        }}
      />
    </motion.div>
  )
}
