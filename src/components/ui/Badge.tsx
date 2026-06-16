import { motion } from 'framer-motion'

type BadgeVariant = 'cyan' | 'amber' | 'registry' | 'neutral'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  icon?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  cyan: 'border-cyan/30 bg-cyan/10 text-cyan-glow',
  amber: 'border-amber/30 bg-amber/10 text-amber-glow',
  registry: 'border-registry/30 bg-registry/10 text-registry-glow',
  neutral: 'border-border bg-elevated/60 text-text',
}

export function Badge({ label, variant = 'neutral', icon }: BadgeProps) {
  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono tracking-wide ${variantStyles[variant]}`}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      {label}
    </motion.span>
  )
}
