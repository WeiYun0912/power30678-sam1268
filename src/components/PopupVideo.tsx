import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface PopupVideoProps {
  src: string
  x: number
  y: number
  onClose?: (isAutoClose?: boolean) => void // isAutoClose: true 表示自動播完，false 表示手動關閉
  showCloseButton?: boolean
  autoCloseOnEnd?: boolean // 影片播完自動關閉
  loop?: boolean // 是否循環播放
}

export function PopupVideo({ src, x, y, onClose, showCloseButton = false, autoCloseOnEnd = false, loop = false }: PopupVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile] = useState(window.innerWidth < 600)
  const onCloseRef = useRef(onClose)
  
  // 更新 onClose ref
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // 確保位置不會超出螢幕
  const safeX = Math.min(Math.max(10, x), window.innerWidth - (isMobile ? 180 : 290))
  const safeY = Math.min(Math.max(10, y), window.innerHeight - 200)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.3
      videoRef.current.play().catch(() => {})
    }
  }, [])

  // 影片播完自動關閉
  const hasCalledRef = useRef(false)
  useEffect(() => {
    if (!autoCloseOnEnd || !videoRef.current) return

    const video = videoRef.current
    hasCalledRef.current = false // 重置標記
    const handleEnded = () => {
      if (hasCalledRef.current) return // 已經調用過，直接返回
      hasCalledRef.current = true
      onCloseRef.current?.(true) // true 表示自動播完
    }
    video.addEventListener('ended', handleEnded)
    return () => {
      video.removeEventListener('ended', handleEnded)
      hasCalledRef.current = false // 清理時重置
    }
  }, [autoCloseOnEnd]) // 移除 onClose 依賴，使用 ref

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        position: 'fixed',
        left: safeX,
        top: safeY,
        zIndex: 1000,
        borderRadius: isMobile ? 8 : 12,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 40px rgba(245, 158, 11, 0.15), 0 20px 50px rgba(0,0,0,0.6)',
        background: '#1A1A24',
      }}
    >
      {showCloseButton && (
        <motion.button
          onClick={() => onClose?.(false)} // false 表示手動關閉
          whileHover={{ scale: 1.1, background: '#F59E0B' }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: isMobile ? 32 : 28,
            height: isMobile ? 32 : 28,
            background: 'rgba(26, 26, 36, 0.9)',
            backdropFilter: 'blur(8px)',
            color: '#FAFAFA',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            fontSize: isMobile ? 16 : 14,
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
          width: isMobile ? 160 : 280,
          height: 'auto',
          display: 'block',
        }}
      />
    </motion.div>
  )
}
