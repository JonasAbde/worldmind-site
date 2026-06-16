import { motion } from 'framer-motion'
import { AGENTS, DEMO_COMMAND_STRIP, PLAYABLE_FEATURES, PLAYER_COMMANDS } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'

const colorClass: Record<string, string> = {
  amber: 'border-amber/30 bg-amber/8 text-amber-glow',
  cyan: 'border-cyan/30 bg-cyan/8 text-cyan-glow',
  registry: 'border-registry/30 bg-registry/8 text-registry-glow',
}

const dotClass: Record<string, string> = {
  amber: 'bg-amber',
  cyan: 'bg-cyan',
  registry: 'bg-registry',
}

export function WhatYouCanPlay() {
  return (
    <Section id="play">
      <SectionHeader
        eyebrow="Current prototype"
        title="What You Can Play Today"
        subtitle="The living AI-world simulation prototype in New Aarhus District 01 — 10 agents, 4 locations, 14 commands."
      />

      {/* 10 Agents grid */}
      <div className="mb-12">
        <p className="font-mono text-xs text-muted uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
          <span className="h-px w-6 bg-gradient-to-r from-cyan/40 to-transparent" />
          10 active agents
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              className={`relative rounded-xl border p-4 text-center transition-all duration-300 hover:scale-[1.03] ${colorClass[agent.color]}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              {/* Live dot */}
              <span className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full ${dotClass[agent.color]} opacity-70`} />
              <p className="font-display font-semibold text-text-bright text-sm mb-0.5">{agent.name}</p>
              <p className="font-mono text-[10px] text-muted leading-tight">{agent.role}</p>
              <p className="font-mono text-[9px] text-muted/50 mt-1 truncate">@ {agent.location}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Playable features */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {PLAYABLE_FEATURES.map((feature, i) => (
          <Card key={feature.title} accent="cyan" delay={i * 0.05}>
            <h3 className="font-display font-medium text-text-bright mb-2">{feature.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* All 14 commands */}
      <Card accent="neutral" className="!p-8 mb-6">
        <p className="font-mono text-xs text-cyan/70 uppercase tracking-widest mb-4">
          14 player commands
        </p>
        <div className="flex flex-wrap gap-2">
          {PLAYER_COMMANDS.map((cmd) => (
            <code
              key={cmd}
              className="px-3 py-1.5 rounded-md bg-void border border-border font-mono text-xs text-cyan-glow/80 hover:border-cyan/40 hover:text-cyan-glow transition-colors"
            >
              {cmd}
            </code>
          ))}
        </div>
      </Card>

      {/* Demo command strip */}
      <Card accent="neutral" className="!p-5 border-dashed border-border/70">
        <p className="font-mono text-[11px] text-muted uppercase tracking-[0.25em] mb-3">
          Cinematic demo strip — real commands from the vertical slice
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-text">
          {DEMO_COMMAND_STRIP.map((cmd, i) => (
            <motion.div
              key={cmd}
              className="px-3 py-1.5 rounded-full bg-elevated/80 border border-border/80 text-cyan-glow/90"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              {cmd}
            </motion.div>
          ))}
        </div>
      </Card>
    </Section>
  )
}
