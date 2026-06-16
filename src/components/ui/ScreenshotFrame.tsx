import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type ScreenshotVariant = 'web-play' | 'saves' | 'timeline' | 'leno'

interface ScreenshotFrameProps {
  title: string
  label: string
  variant?: ScreenshotVariant
  children?: ReactNode
}

const variantAccent: Record<ScreenshotVariant, string> = {
  'web-play': 'from-cyan-dim/80 via-deep to-void',
  saves: 'from-amber-dim/80 via-deep to-void',
  timeline: 'from-registry-dim/80 via-deep to-void',
  leno: 'from-cyan-dim/80 via-deep to-registry-dim/80',
}

export function ScreenshotFrame({
  title,
  label,
  variant = 'web-play',
  children,
}: ScreenshotFrameProps) {
  return (
    <motion.div
      className="relative rounded-xl border border-border bg-void overflow-hidden glow-cyan"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${variantAccent[variant]} opacity-60`} />
      <div className="relative p-4 border-b border-border/70 flex items-center justify-between gap-3 text-xs font-mono text-muted">
        <span className="truncate">{title}</span>
        <span className="px-2 py-0.5 rounded-full border border-border bg-elevated/80 text-[10px] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="relative p-5 min-h-[180px] flex items-center justify-center text-xs text-muted">
        {children ?? <span className="opacity-70">Screenshot placeholder — wired to real runtime later.</span>}
      </div>
    </motion.div>
  )
}

export const LiveWebPlayScreenshot = () => (
  <ScreenshotFrame title="Live Web Play UI" label="Generated from core repo" variant="web-play" />
)

export const SaveBrowserScreenshot = () => (
  <ScreenshotFrame title="Save Browser" label="Inspect and diff saves" variant="saves" />
)

export const TimelineBranchesScreenshot = () => (
  <ScreenshotFrame title="Timeline Branches" label="Branch & compare worlds" variant="timeline" />
)

export const LenoEvidenceScreenshot = () => (
  <ScreenshotFrame title="Leno Evidence Guard" label="Evidence-gated answers" variant="leno" />
)
