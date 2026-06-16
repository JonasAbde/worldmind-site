import { LENO } from '../../data/product'
import { Badge } from '../ui/Badge'
import { Section, SectionHeader } from '../ui/Section'
import { LenoEvidenceScreenshot } from '../ui/ScreenshotFrame'

export function LenoCompanion() {
  return (
    <Section id="leno" className="bg-surface overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-dim/10 via-transparent to-registry-dim/10 pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-12 items-center">
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
          <div className="flex flex-wrap gap-2 mt-6">
            {LENO.guardrails.map((g) => (
              <Badge key={g} label={g} variant="cyan" />
            ))}
          </div>
        </div>

        <LenoEvidenceScreenshot />
      </div>
    </Section>
  )
}
