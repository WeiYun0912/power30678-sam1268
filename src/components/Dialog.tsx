import { motion } from 'framer-motion'

interface DialogProps {
  title: string
  lines?: string[]
  onStart: () => void
}

export function Dialog({ title, lines = [], onStart }: DialogProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: 16,
        boxSizing: 'border-box',
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        style={{
          width: 520,
          maxWidth: '100%',
          background: '#12121A',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          padding: 'clamp(16px, 4vw, 24px)',
          color: '#FAFAFA',
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ display: 'grid', gap: 8, color: '#D4D4D8' }}>
          {lines.map((t, i) => (
            <div key={i} style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', lineHeight: 1.5 }}>{t}</div>
          ))}
        </div>
        <div style={{ height: 16 }} />
        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: 'clamp(12px, 2.5vw, 14px) 14px',
            background: '#F59E0B',
            color: '#0A0A0F',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            cursor: 'pointer',
          }}
        >
          開始
        </button>
      </motion.div>
    </div>
  )
}

