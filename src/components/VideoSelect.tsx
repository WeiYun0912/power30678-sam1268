import { motion } from 'framer-motion'

const BASE = import.meta.env.BASE_URL

interface VideoSelectProps {
  onSelect: (video: string) => void
}

const videos = [
  { id: 'A', name: '哭蕊宿頭', src: `${BASE}哭蕊宿頭.mp4` },
  { id: 'B', name: '溝通溝通', src: `${BASE}溝通溝通.mp4` },
]

export function VideoSelect({ onSelect }: VideoSelectProps) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        gap: 40,
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          color: '#fff',
          fontSize: 48,
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(255,255,255,0.3)',
        }}
      >
        選擇素材
      </motion.h1>

      <div style={{ display: 'flex', gap: 40 }}>
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(video.src)}
            style={{
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: 20,
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            <video
              src={video.src}
              muted
              loop
              autoPlay
              playsInline
              style={{
                width: 300,
                height: 200,
                objectFit: 'cover',
                borderRadius: 10,
              }}
            />
            <div
              style={{
                color: '#fff',
                fontSize: 24,
                textAlign: 'center',
                marginTop: 15,
                fontWeight: 'bold',
              }}
            >
              {video.name}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 16,
          marginTop: 20,
        }}
      >
        按 1: 旋轉 | 按 2: 預判 | 按 3: 失控
      </motion.div>
    </div>
  )
}
