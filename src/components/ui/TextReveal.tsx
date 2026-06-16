import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface TextRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function TextReveal({ children, className = '', delay = 0, as = 'span' }: TextRevealProps) {
  const reduced = usePrefersReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: '110%', rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 800 }}
    >
      {children}
    </Tag>
  )
}

interface SplitRevealProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
}

export function SplitReveal({ text, className = '', wordClassName = '', delay = 0 }: SplitRevealProps) {
  const reduced = usePrefersReducedMotion()
  const words = text.split(' ')

  if (reduced) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={`inline-flex flex-wrap ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="overflow-hidden inline-block mr-[0.28em] last:mr-0">
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.65,
              delay: delay + i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
