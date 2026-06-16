import { motion } from 'framer-motion'
import { useState } from 'react'
import type { ReactNode } from 'react'

type ScreenshotVariant = 'web-play' | 'saves' | 'timeline' | 'leno'

interface ScreenshotFrameProps {
  title: string
  label: string
  imageSrc?: string
  imageAlt?: string
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
  imageSrc,
  imageAlt,
  variant = 'web-play',
  children,
}: ScreenshotFrameProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(imageSrc) && !imageFailed

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
        {showImage ? (
          <img
            src={imageSrc}
            alt={imageAlt ?? title}
            loading="lazy"
            className="w-full h-full max-h-[440px] object-cover rounded-lg border border-border/50"
            onError={() => setImageFailed(true)}
          />
        ) : (
          children ?? <span className="opacity-70">Screenshot placeholder — wired to real runtime later.</span>
        )}
      </div>
    </motion.div>
  )
}

export const LiveWebPlayScreenshot = () => (
  <ScreenshotFrame
    title="Live Web Play UI"
    label="Generated from core repo"
    variant="web-play"
    imageSrc="/assets/npc-agent-portrait-set.png"
    imageAlt="WorldMind multi-agent portrait panel representing active NPC personalities in the live simulation UI"
  />
)

export const SaveBrowserScreenshot = () => (
  <ScreenshotFrame
    title="Save Browser"
    label="Inspect and diff saves"
    variant="saves"
    imageSrc="/assets/save-browser-snapshot-diff.png"
    imageAlt="WorldMind save browser visual showing timeline snapshot comparison and restore workflow"
  />
)

export const TimelineBranchesScreenshot = () => (
  <ScreenshotFrame
    title="Timeline Branches"
    label="Branch & compare worlds"
    variant="timeline"
    imageSrc="/assets/timeline-branches.png"
    imageAlt="WorldMind timeline branching visual showing save, restore and snapshot diff concepts"
  />
)

export const LenoEvidenceScreenshot = () => (
  <ScreenshotFrame
    title="Leno Evidence Guard"
    label="Evidence-gated answers"
    variant="leno"
    imageSrc="/assets/leno-evidence-guard.png"
    imageAlt="WorldMind Leno evidence guard visual showing redacted hidden truth and known evidence"
  />
)
