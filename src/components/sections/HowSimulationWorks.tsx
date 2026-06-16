import { motion } from 'framer-motion'
import { LOCATIONS, PHONE_TABS, SIMULATION_SYSTEMS } from '../../data/product'
import { Card } from '../ui/Card'
import { Section, SectionHeader } from '../ui/Section'

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

const moodStroke: Record<string, string> = {
  warm: '#f59e0b',
  neutral: '#22d3ee',
  cold: '#3b82f6',
}

// District mini-map matching the SVG coordinates from core's district-view.js
function DistrictMiniMap() {
  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ]

  return (
    <motion.div
      className="relative rounded-xl border border-border/60 bg-void overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
        <span className="font-mono text-xs text-muted uppercase tracking-widest">District View — New Aarhus District 01</span>
      </div>
      <div className="relative p-4">
        <img
          src="/assets/new-aarhus-district-01.png"
          alt="WorldMind district environment art showing New Aarhus District 01"
          loading="lazy"
          className="w-full max-h-[220px] object-cover rounded-lg opacity-40"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        {/* SVG overlay matching core district-view.js coordinates */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edges */}
          {edges.map(({ from, to }) => {
            const a = LOCATIONS[from]
            const b = LOCATIONS[to]
            return (
              <line
                key={`${from}-${to}`}
                x1={a.svgX} y1={a.svgY}
                x2={b.svgX} y2={b.svgY}
                stroke="rgba(34,211,238,0.25)"
                strokeWidth="0.6"
                strokeDasharray="2 3"
              />
            )
          })}
          {/* Location nodes */}
          {LOCATIONS.map((loc, i) => (
            <motion.g
              key={loc.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
            >
              <circle
                cx={loc.svgX}
                cy={loc.svgY}
                r="3"
                fill={moodStroke[loc.mood]}
                fillOpacity="0.25"
                stroke={moodStroke[loc.mood]}
                strokeWidth="0.6"
              />
              <circle
                cx={loc.svgX}
                cy={loc.svgY}
                r="1.2"
                fill={moodStroke[loc.mood]}
              />
              <text
                x={loc.svgX}
                y={loc.svgY + 6}
                textAnchor="middle"
                fontSize="4"
                fill="rgba(238,244,250,0.7)"
                fontFamily="monospace"
              >
                {loc.name.split("'")[0].replace("'s", '').trim()}
              </text>
              <text
                x={loc.svgX}
                y={loc.svgY + 10}
                textAnchor="middle"
                fontSize="2.8"
                fill="rgba(107,122,143,0.8)"
                fontFamily="monospace"
              >
                {loc.agents.length} agent{loc.agents.length !== 1 ? 's' : ''}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </motion.div>
  )
}

// Phone tab strip from rc8
function PhoneUITeaser() {
  return (
    <motion.div
      className="relative rounded-xl border border-border/60 bg-void overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
        <span className="font-mono text-xs text-muted uppercase tracking-widest">Phone UI — 8 tabs (rc8)</span>
      </div>
      <div className="p-4 grid grid-cols-4 gap-2">
        {PHONE_TABS.map((tab, i) => (
          <motion.div
            key={tab.label}
            className="rounded-lg border border-border/50 bg-elevated/40 p-3 text-center hover:border-cyan/30 transition-colors"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.06 }}
          >
            <div className="text-lg mb-1">{tab.icon}</div>
            <p className="font-mono text-[9px] text-muted uppercase tracking-wide">{tab.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
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

      {/* District map + phone UI side by side */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <DistrictMiniMap />
        <PhoneUITeaser />
      </div>

      {/* System cards */}
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
