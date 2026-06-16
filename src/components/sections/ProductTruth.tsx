import { PRODUCT_TRUTH } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'

export function ProductTruthSection() {
  return (
    <Section id="product-truth" className="bg-surface">
      <SectionHeader
        eyebrow="Product truth"
        title="What exists today / what comes later"
        subtitle="Grounded in WorldMind v1.0-rc7 — a living AI-world simulation prototype, not a finished commercial release."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card accent="cyan">
          <h3 className="font-display text-xl text-text-bright mb-3">What exists today</h3>
          <ul className="space-y-2 text-sm text-muted leading-relaxed list-disc list-inside">
            {PRODUCT_TRUTH.existsToday.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card accent="registry">
          <h3 className="font-display text-xl text-text-bright mb-3">What comes later</h3>
          <ul className="space-y-2 text-sm text-muted leading-relaxed list-disc list-inside">
            {PRODUCT_TRUTH.comesLater.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  )
}
