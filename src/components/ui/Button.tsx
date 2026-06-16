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
    'bg-gradient-to-r from-amber to-amber-glow text-void font-semibold shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:from-amber-glow hover:to-amber',
  secondary:
    'border border-cyan/35 text-cyan-glow bg-cyan/5 hover:bg-cyan/12 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]',
  ghost:
    'border border-border/70 text-text hover:border-muted/60 hover:bg-elevated/60 hover:text-text-bright',
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
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
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
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}
