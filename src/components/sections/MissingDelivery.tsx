import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MISSING_DELIVERY, RESOLUTION_PATHS } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'
import { ScreenshotFrame } from '../ui/ScreenshotFrame'

const LIVE_EVENTS = [
  { tag: 'cafe', color: 'text-amber-glow', content: 'supply_shortage → sara.cafe', time: '09:14' },
  { tag: 'rumor', color: 'text-registry-glow', content: 'false_registry_claim → nadia', time: '09:31' },
  { tag: 'agent', color: 'text-cyan-glow', content: 'malik.refuse_delivery', time: '09:47' },
  { tag: 'witness', color: 'text-cyan-glow/70', content: 'rune.observation → logged', time: '10:02' },
  { tag: 'memory', color: 'text-amber-glow/70', content: 'sara.belief updated', time: '10:18' },
  { tag: 'incident', color: 'text-registry-glow/80', content: 'incident.escalated → OPEN', time: '10:33' },
]

const accentMap = {
  amber: 'amber' as const,
  cyan: 'cyan' as const,
  registry: 'registry' as const,
}

function LiveEventFeed() {
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    if (visibleCount >= LIVE_EVENTS.length) return
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 1100)
    return () => clearTimeout(t)
  }, [visibleCount])

  return (
    <div className="font-mono text-sm space-y-2 p-1">
      <AnimatePresence>
        {LIVE_EVENTS.slice(0, visibleCount).map((ev) => (
          <motion.div
            key={ev.tag + ev.time}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <span className="text-muted/50 text-[10px] pt-0.5 min-w-[38px]">{ev.time}</span>
            <span className="text-muted/60 min-w-[52px]">[{ev.tag}]</span>
            <span className={ev.color}>{ev.content}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      {visibleCount < LIVE_EVENTS.length && (
        <motion.div
          className="flex items-center gap-1.5 text-muted/40"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan/40" />
          <span className="text-[10px]">world engine processing…</span>
        </motion.div>
      )}
    </div>
  )
}

export function MissingDelivery() {
  return (
    <Section id="missing-delivery" className="bg-surface">
      <SectionHeader
        eyebrow="Vertical slice"
        title={MISSING_DELIVERY.title}
        subtitle={MISSING_DELIVERY.subtitle}
        gradient="amber"
      />

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Card accent="amber" className="!p-8">
          <div className="space-y-4">
            {MISSING_DELIVERY.setup.map((line, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <span className="font-mono text-amber/50 text-sm mt-0.5 min-w-[28px]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-text leading-relaxed">{line}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        <ScreenshotFrame
          title="Missing Delivery — Event Log"
          label="District incident"
          variant="saves"
          imageSrc="/assets/missing-delivery-case-board.png"
          imageAlt="WorldMind missing delivery investigation board showing connected claims, witnesses and delivery evidence"
        >
          <LiveEventFeed />
        </ScreenshotFrame>
      </div>

      <p className="font-mono text-xs text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
        <span className="h-px w-6 bg-gradient-to-r from-cyan/40 to-transparent" />
        3 resolution paths
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {RESOLUTION_PATHS.map((path, i) => (
          <Card key={path.id} accent={accentMap[path.accent]} delay={i * 0.1}>
            <span className="text-2xl mb-4 block opacity-60">{path.icon}</span>
            <h3 className="font-display text-lg font-medium text-text-bright mb-3">
              {path.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">{path.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
