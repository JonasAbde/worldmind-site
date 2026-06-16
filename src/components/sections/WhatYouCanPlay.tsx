import { DEMO_COMMAND_STRIP, PLAYABLE_FEATURES, PLAYER_COMMANDS } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'

export function WhatYouCanPlay() {
  return (
    <Section id="play">
      <SectionHeader
        eyebrow="Current prototype"
        title="What You Can Play Today"
        subtitle="The living AI-world simulation prototype in New Aarhus District 01 — inspect, converse, investigate, and reshape timelines."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {PLAYABLE_FEATURES.map((feature, i) => (
          <Card key={feature.title} accent="cyan" delay={i * 0.05}>
            <h3 className="font-display font-medium text-text-bright mb-2">{feature.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </div>

      <Card accent="neutral" className="!p-8 mb-6">
        <p className="font-mono text-xs text-cyan/70 uppercase tracking-widest mb-4">
          14 player commands
        </p>
        <div className="flex flex-wrap gap-2">
          {PLAYER_COMMANDS.map((cmd) => (
            <code
              key={cmd}
              className="px-3 py-1.5 rounded-md bg-void border border-border font-mono text-xs text-cyan-glow/80"
            >
              {cmd}
            </code>
          ))}
        </div>
      </Card>

      <Card accent="neutral" className="!p-5 bg-void/80 border-dashed border-border/70">
        <p className="font-mono text-[11px] text-muted uppercase tracking-[0.25em] mb-3">
          Cinematic demo strip (current commands)
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-text">
          {DEMO_COMMAND_STRIP.map((cmd) => (
            <div
              key={cmd}
              className="px-3 py-1.5 rounded-full bg-elevated/80 border border-border/80 text-cyan-glow/90"
            >
              {cmd}
            </div>
          ))}
        </div>
      </Card>
    </Section>
  )
}
