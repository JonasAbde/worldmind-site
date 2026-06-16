import { motion } from 'framer-motion'

interface SectionDividerProps {
  label?: string
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="relative py-6 px-6 md:px-8 bg-void overflow-hidden" aria-hidden>
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <motion.div
          className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-cyan/30"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        {label && (
          <motion.span
            className="font-mono text-[9px] uppercase tracking-[0.35em] text-muted/50 flex-shrink-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {label}
          </motion.span>
        )}
        <motion.div
          className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-amber/20"
          initial={{ scaleX: 0, originX: 1 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
