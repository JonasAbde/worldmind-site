import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { TIMELINE } from '../../data/product'
import { Badge } from '../ui/Badge'
import { Section, SectionHeader } from '../ui/Section'
import { TimelineBranchesScreenshot } from '../ui/ScreenshotFrame'

export function TimelineBranches() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineH = useTransform(scrollYProgress, [0.1, 0.6], ['0%', '100%'])

  return (
    <Section id="timeline" ref={ref as React.RefObject<HTMLElement>}>
      <SectionHeader
        eyebrow="Persistence layer"
        title={TIMELINE.title}
        subtitle={TIMELINE.headline}
        gradient="cyan"
      />

      <div className="grid lg:grid-cols-2 gap-14 items-start">
        {/* Steps with animated spine */}
        <div className="relative">
          {/* Scroll-driven vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40" aria-hidden />
          <motion.div
            className="absolute left-4 top-0 w-px bg-gradient-to-b from-cyan via-registry to-amber origin-top"
            style={{ height: lineH }}
            aria-hidden
          />

          <div className="space-y-0">
            {TIMELINE.steps.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex gap-6 relative pb-10 last:pb-0"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Step node */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-8 h-8 rounded-full border border-cyan/40 bg-void flex items-center justify-center font-mono text-xs text-cyan-glow">
                    {i + 1}
                  </div>
                </div>

                <div className="pt-1">
                  <h3 className="font-display font-semibold text-text-bright mb-1.5">{step.label}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex flex-wrap gap-2 mt-8 ml-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {TIMELINE.features.map((f) => (
              <Badge key={f} label={f} variant="cyan" />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <TimelineBranchesScreenshot />
        </motion.div>
      </div>
    </Section>
  )
}
