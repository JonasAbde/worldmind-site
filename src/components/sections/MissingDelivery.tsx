import { MISSING_DELIVERY, RESOLUTION_PATHS } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'

const accentMap = {
  amber: 'amber' as const,
  cyan: 'cyan' as const,
  registry: 'registry' as const,
}

export function MissingDelivery() {
  return (
    <Section id="missing-delivery" className="bg-surface">
      <SectionHeader
        eyebrow="Vertical slice"
        title={MISSING_DELIVERY.title}
        subtitle={MISSING_DELIVERY.subtitle}
      />

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Card accent="amber" className="!p-8">
          <div className="space-y-4">
            {MISSING_DELIVERY.setup.map((line, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-mono text-amber/60 text-sm mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-text leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="relative rounded-xl overflow-hidden border border-border bg-void p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-transparent to-registry/5" />
          <div className="relative">
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
              District incident
            </p>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex gap-3 text-amber-glow/80">
                <span className="text-muted">[cafe]</span>
                <span>supply_shortage → sara.cafe</span>
              </div>
              <div className="flex gap-3 text-registry-glow/80">
                <span className="text-muted">[rumor]</span>
                <span>false_registry_claim → nadia</span>
              </div>
              <div className="flex gap-3 text-cyan-glow/80">
                <span className="text-muted">[agent]</span>
                <span>malik.refuse_delivery</span>
              </div>
              <div className="flex gap-3 text-cyan-glow/60">
                <span className="text-muted">[witness]</span>
                <span>rune.observation → pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
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
