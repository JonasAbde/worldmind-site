import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  dark?: boolean
}

export function Section({ id, children, className = '', dark = true }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 px-6 md:px-8 ${dark ? 'bg-deep' : 'bg-surface'} ${className}`}
    >
      <div className="relative z-10 max-w-6xl mx-auto">{children}</div>
    </section>
  )
}

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'left' }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''

  return (
    <motion.div
      className={`mb-12 md:mb-16 max-w-3xl ${alignClass}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      {eyebrow && (
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan/80 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text-bright tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  )
}
