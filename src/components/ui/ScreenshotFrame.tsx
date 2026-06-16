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
  'web-play': 'from-cyan-dim/60 via-deep to-void border-cyan/20',
  saves:      'from-amber-dim/60 via-deep to-void border-amber/20',
  timeline:   'from-registry-dim/60 via-deep to-void border-registry/20',
  leno:       'from-cyan-dim/60 via-deep to-registry-dim/50 border-cyan/20',
}

const dotColor: Record<ScreenshotVariant, string> = {
  'web-play': 'bg-cyan',
  saves:      'bg-amber',
  timeline:   'bg-registry',
  leno:       'bg-cyan',
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
      className={`relative rounded-xl border bg-void overflow-hidden ${variantAccent[variant].split(' ').slice(2).join(' ')}`}
      style={{ boxShadow: '0 0 40px rgba(34,211,238,0.05), inset 0 1px 0 rgba(103,232,249,0.04)' }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${variantAccent[variant].split(' ').slice(0, 2).join(' ')} opacity-50 pointer-events-none`} />

      {/* Title bar */}
      <div className="relative px-4 py-3 border-b border-border/60 flex items-center gap-3 text-xs font-mono text-muted bg-void/60 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber/50" />
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor[variant]}/50`} />
        </div>
        <span className="truncate flex-1">{title}</span>
        <span className="px-2 py-0.5 rounded-full border border-border/60 bg-elevated/60 text-[9px] uppercase tracking-widest flex-shrink-0">
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="relative">
        {showImage ? (
          <img
            src={imageSrc}
            alt={imageAlt ?? title}
            loading="lazy"
            className="w-full max-h-[420px] object-cover object-top"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="p-5 min-h-[180px] flex items-center justify-center text-xs text-muted">
            {children ?? (
              <span className="opacity-50 font-mono">
                Screenshot placeholder — wired to real runtime later.
              </span>
            )}
          </div>
        )}
        {/* Bottom vignette when showing image */}
        {showImage && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-void/70 to-transparent pointer-events-none" />
        )}
      </div>
    </motion.div>
  )
}

export const LiveWebPlayScreenshot = () => (
  <ScreenshotFrame
    title="Live Web Play UI — NPC portrait panel"
    label="rc8 generated"
    variant="web-play"
    imageSrc="/assets/npc-agent-portrait-set.png"
    imageAlt="WorldMind multi-agent portrait panel representing 10 active NPC personalities in the live simulation UI"
  />
)

export const SaveBrowserScreenshot = () => (
  <ScreenshotFrame
    title="Save Browser — snapshot diff"
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
