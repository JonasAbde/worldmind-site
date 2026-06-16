import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  className?: string
  external?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-amber/90 to-amber-glow/80 text-void font-semibold hover:from-amber hover:to-amber-glow glow-amber',
  secondary:
    'border border-cyan/40 text-cyan-glow bg-cyan/5 hover:bg-cyan/10 hover:border-cyan/60',
  ghost:
    'border border-border/60 text-text hover:border-muted hover:bg-elevated/50',
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  external = false,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${variants[variant]} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={classes}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
}
