import { SIMULATION_SYSTEMS } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'
import { ScreenshotFrame } from '../ui/ScreenshotFrame'

const colorMap = {
  cyan: 'text-cyan-glow',
  amber: 'text-amber-glow',
  registry: 'text-registry-glow',
}

const accentMap = {
  cyan: 'cyan' as const,
  amber: 'amber' as const,
  registry: 'registry' as const,
}

export function HowSimulationWorks() {
  return (
    <Section id="simulation">
      <SectionHeader
        eyebrow="Engine architecture"
        title="How the Simulation Works"
        subtitle="Not scripted quests. Every system layer contributes to emergent story — validated by the World Engine at runtime."
        align="center"
      />

      <div className="mb-8">
        <ScreenshotFrame
          title="Simulation HUD: memory and permissions"
          label="Runtime systems"
          variant="web-play"
          imageSrc="/assets/simulation-hud-memory-permissions.png"
          imageAlt="WorldMind simulation HUD visual showing memory state and permission-aware agent behavior"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SIMULATION_SYSTEMS.map((system, i) => (
          <Card
            key={system.name}
            accent={accentMap[system.color]}
            delay={i * 0.06}
            className={i === 0 ? 'lg:col-span-2' : ''}
          >
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <h3 className={`font-display font-semibold ${colorMap[system.color]}`}>
                {system.name}
              </h3>
              <span className="font-mono text-[10px] text-muted uppercase tracking-wide">
                {system.role}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">{system.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
