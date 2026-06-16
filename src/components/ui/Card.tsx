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
  amber: 'border-amber/20 hover:border-amber/40',
  cyan: 'border-cyan/20 hover:border-cyan/40',
  registry: 'border-registry/20 hover:border-registry/40',
  neutral: 'border-border hover:border-muted/40',
}

const accentGlow: Record<Accent, string> = {
  amber: 'hover:glow-amber',
  cyan: 'hover:glow-cyan',
  registry: 'hover:glow-registry',
  neutral: '',
}

export function Card({ children, accent = 'neutral', className = '', delay = 0 }: CardProps) {
  return (
    <motion.div
      className={`relative rounded-xl border bg-surface/80 backdrop-blur-sm p-6 transition-all duration-500 ${accentBorder[accent]} ${accentGlow[accent]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  )
}
