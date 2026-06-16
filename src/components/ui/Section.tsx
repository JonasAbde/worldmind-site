import { motion } from 'framer-motion'
import { forwardRef, type ReactNode } from 'react'
import { SplitReveal } from './TextReveal'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  dark?: boolean
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, children, className = '', dark = true }, ref) => (
    <section
      ref={ref}
      id={id}
      className={`relative py-24 md:py-32 px-6 md:px-8 ${dark ? 'bg-deep' : 'bg-surface'} ${className}`}
    >
      <div className="relative z-10 max-w-6xl mx-auto">{children}</div>
    </section>
  )
)
Section.displayName = 'Section'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  gradient?: 'cyan' | 'amber' | 'none'
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  gradient = 'none',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''
  const wordClass =
    gradient === 'cyan'
      ? 'text-gradient-cyan'
      : gradient === 'amber'
        ? 'text-gradient-amber'
        : 'text-text-bright'

  return (
    <motion.div
      className={`mb-12 md:mb-16 max-w-3xl ${alignClass}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <motion.div
          className={`flex items-center gap-3 mb-4 ${align === 'center' ? 'justify-center' : ''}`}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="h-px w-8 bg-gradient-to-r from-cyan/60 to-transparent" />
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-cyan/70">{eyebrow}</p>
        </motion.div>
      )}

      <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08] ${align === 'center' ? 'text-center' : ''}`}>
        <SplitReveal
          text={title}
          wordClassName={wordClass}
          delay={0.1}
        />
      </h2>

      {subtitle && (
        <motion.p
          className="mt-5 text-lg text-muted leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
