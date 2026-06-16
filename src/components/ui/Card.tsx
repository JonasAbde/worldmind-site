import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Accent = 'amber' | 'cyan' | 'registry' | 'neutral'

interface CardProps {
  children: ReactNode
  accent?: Accent
  className?: string
  delay?: number
}

const accentBorder: Record<Accent, string> = {
  amber: 'border-amber/20 hover:border-amber/50',
  cyan: 'border-cyan/20 hover:border-cyan/50',
  registry: 'border-registry/20 hover:border-registry/50',
  neutral: 'border-border/80 hover:border-muted/50',
}

const accentStrip: Record<Accent, string> = {
  amber: 'from-amber/60 to-amber-glow/20',
  cyan: 'from-cyan/60 to-cyan-glow/20',
  registry: 'from-registry/60 to-registry-glow/20',
  neutral: 'from-border to-transparent',
}

const accentInnerGlow: Record<Accent, string> = {
  amber: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.12),inset_0_1px_0_rgba(251,191,36,0.1)]',
  cyan: 'hover:shadow-[0_0_40px_rgba(34,211,238,0.1),inset_0_1px_0_rgba(103,232,249,0.08)]',
  registry: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.1),inset_0_1px_0_rgba(96,165,250,0.08)]',
  neutral: '',
}

export function Card({ children, accent = 'neutral', className = '', delay = 0 }: CardProps) {
  return (
    <motion.div
      className={`relative rounded-xl border overflow-hidden transition-all duration-500 ${accentBorder[accent]} ${accentInnerGlow[accent]} ${className}`}
      style={{ background: 'rgba(13, 18, 25, 0.75)', backdropFilter: 'blur(16px)' }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
    >
      {/* Top accent strip */}
      <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r ${accentStrip[accent]} opacity-70`} />
      <div className="p-6">{children}</div>
    </motion.div>
  )
}
