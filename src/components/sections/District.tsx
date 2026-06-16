import { DISTRICT } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'

const moodAccent = {
  warm: 'amber' as const,
  cold: 'registry' as const,
  neutral: 'cyan' as const,
}

export function District() {
  return (
    <Section id="district" className="overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-registry-dim/20 via-transparent to-amber-dim/20 pointer-events-none" />
      <SectionHeader
        eyebrow="World setting"
        title={DISTRICT.title}
        subtitle={DISTRICT.description}
      />

      <h3 className="font-display text-2xl text-text-bright mb-6">{DISTRICT.headline}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DISTRICT.locations.map((loc, i) => (
          <Card key={loc.name} accent={moodAccent[loc.mood]} delay={i * 0.06}>
            <p className="font-display text-text-bright mb-2">{loc.name}</p>
            <p className="text-sm text-muted">{loc.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
