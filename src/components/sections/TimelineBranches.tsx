import { motion } from 'framer-motion'
import { TIMELINE } from '../../data/product'
import { Badge } from '../ui/Badge'
import { Section, SectionHeader } from '../ui/Section'
import { TimelineBranchesScreenshot } from '../ui/ScreenshotFrame'

export function TimelineBranches() {
  return (
    <Section id="timeline">
      <SectionHeader
        eyebrow="Persistence layer"
        title={TIMELINE.title}
        subtitle={TIMELINE.headline}
      />

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          {TIMELINE.steps.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-cyan/40 bg-cyan/10 flex items-center justify-center font-mono text-xs text-cyan-glow">
                  {i + 1}
                </div>
                {i < TIMELINE.steps.length - 1 && (
                  <div className="w-px h-8 bg-border mt-2" />
                )}
              </div>
              <div className="pb-4">
                <h3 className="font-display font-medium text-text-bright">{step.label}</h3>
                <p className="text-sm text-muted mt-1">{step.description}</p>
              </div>
            </motion.div>
          ))}

          <div className="flex flex-wrap gap-2 pt-4">
            {TIMELINE.features.map((f) => (
              <Badge key={f} label={f} variant="cyan" />
            ))}
          </div>
        </div>

        <TimelineBranchesScreenshot />
      </div>
    </Section>
  )
}
