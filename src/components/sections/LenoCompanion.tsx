import { motion } from 'framer-motion'
import { LENO, PHONE_TABS } from '../../data/product'
import { Badge } from '../ui/Badge'
import { Section, SectionHeader } from '../ui/Section'
import { LenoEvidenceScreenshot } from '../ui/ScreenshotFrame'

export function LenoCompanion() {
  return (
    <Section id="leno" className="bg-surface overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-dim/8 via-transparent to-registry-dim/8 pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <SectionHeader eyebrow="Companion" title={LENO.title} />
          <h3 className="font-display text-2xl text-text-bright mb-6 -mt-8">
            {LENO.headline}
          </h3>
          {LENO.paragraphs.map((p, i) => (
            <p key={i} className="text-muted leading-relaxed mb-4">
              {p}
            </p>
          ))}
          <div className="flex flex-wrap gap-2 mt-6 mb-8">
            {LENO.guardrails.map((g) => (
              <Badge key={g} label={g} variant="cyan" />
            ))}
          </div>

          {/* Phone tabs strip — rc8 feature */}
          <motion.div
            className="rounded-xl border border-border/50 bg-void/60 overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="px-4 py-2.5 border-b border-border/40 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                Phone UI — 8 tabs (rc8)
              </span>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              {PHONE_TABS.map((tab, i) => (
                <motion.div
                  key={tab.label}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    tab.label === 'Leno'
                      ? 'border-cyan/40 bg-cyan/8 text-cyan-glow'
                      : 'border-border/50 bg-elevated/30 text-muted hover:border-border'
                  }`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  title={tab.desc}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wide">{tab.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <LenoEvidenceScreenshot />
      </div>
    </Section>
  )
}
