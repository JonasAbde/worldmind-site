import { motion } from 'framer-motion'
import { ENGINE_PROOF, PRODUCT } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'
import { LiveWebPlayScreenshot, SaveBrowserScreenshot } from '../ui/ScreenshotFrame'

const accentCycle = ['cyan', 'amber', 'registry', 'cyan', 'amber', 'registry', 'cyan', 'amber'] as const

export function EngineProof() {
  return (
    <Section id="proof" className="bg-surface">
      <SectionHeader
        eyebrow="Engine proof"
        title="Built on a validated simulation core"
        subtitle={`${PRODUCT.version} · ${PRODUCT.testCount} tests · 15-step ci:gate · strict TypeScript runtime`}
      />

      {/* Key stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { value: '200/200', label: 'tests passing', color: 'text-cyan-glow' },
          { value: '10',      label: 'NPC agents',    color: 'text-amber-glow' },
          { value: '4',       label: 'locations',     color: 'text-registry-glow' },
          { value: '0',       label: 'event violations', color: 'text-cyan-glow' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="rounded-xl border border-border/60 bg-elevated/30 p-5 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <p className={`font-display text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
            <p className="font-mono text-[10px] text-muted uppercase tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.3fr,1fr] gap-6 items-start">
        {/* Feature checklist */}
        <div className="grid sm:grid-cols-2 gap-3">
          {ENGINE_PROOF.map((item, i) => (
            <Card key={item.label} accent={accentCycle[i % accentCycle.length]} delay={i * 0.04}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-cyan/60 text-base flex-shrink-0">{item.icon}</span>
                <p className="text-sm text-text leading-snug">{item.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Screenshot panels */}
        <div className="space-y-4">
          <LiveWebPlayScreenshot />
          <SaveBrowserScreenshot />
        </div>
      </div>
    </Section>
  )
}
