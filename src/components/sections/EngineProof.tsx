import { ENGINE_PROOF } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'
import { LiveWebPlayScreenshot, SaveBrowserScreenshot } from '../ui/ScreenshotFrame'

export function EngineProof() {
  return (
    <Section id="proof" className="bg-surface">
      <SectionHeader
        eyebrow="Engine proof"
        title="Built on a validated simulation core"
        subtitle="The product claims are backed by running systems in WorldMind v1.0-rc7."
      />

      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 items-start">
        <div className="grid sm:grid-cols-2 gap-4">
          {ENGINE_PROOF.map((item, i) => (
            <Card key={item.label} accent={i % 2 === 0 ? 'cyan' : 'amber'} delay={i * 0.05}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-cyan/70">{item.icon}</span>
                <p className="text-sm text-text">{item.label}</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <LiveWebPlayScreenshot />
          <SaveBrowserScreenshot />
        </div>
      </div>
    </Section>
  )
}
