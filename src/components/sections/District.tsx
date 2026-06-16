import { motion } from 'framer-motion'
import { DISTRICT, LOCATIONS } from '../../data/product'
import { Section, SectionHeader } from '../ui/Section'

const moodBorder: Record<string, string> = {
  warm: 'border-amber/30 hover:border-amber/60',
  neutral: 'border-cyan/20 hover:border-cyan/50',
  cold: 'border-registry/25 hover:border-registry/55',
}

const moodGlow: Record<string, string> = {
  warm: '#f59e0b',
  neutral: '#22d3ee',
  cold: '#3b82f6',
}

const moodText: Record<string, string> = {
  warm: 'text-amber-glow',
  neutral: 'text-cyan-glow',
  cold: 'text-registry-glow',
}

const moodBg: Record<string, string> = {
  warm: 'bg-amber/8',
  neutral: 'bg-cyan/5',
  cold: 'bg-registry/8',
}

export function District() {
  return (
    <Section id="district" className="overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-registry-dim/15 via-transparent to-amber-dim/15 pointer-events-none" />

      <SectionHeader
        eyebrow="World setting"
        title={DISTRICT.title}
        subtitle={DISTRICT.description}
      />

      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden border border-border/50 mb-10 aspect-[21/9]">
        <img
          src="/assets/new-aarhus-district-01.png"
          alt="WorldMind district environment art showing New Aarhus District 01 as a lived simulation space"
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />
        <div className="absolute bottom-5 left-6">
          <p className="font-display text-text-bright font-semibold text-lg">{DISTRICT.headline}</p>
          <p className="font-mono text-xs text-muted mt-1">10 agents · 4 locations · living simulation</p>
        </div>
      </div>

      {/* 4 location cards — matching real locations from core */}
      <div className="grid md:grid-cols-2 gap-4">
        {LOCATIONS.map((loc, i) => (
          <motion.div
            key={loc.id}
            className={`relative rounded-xl border p-6 transition-all duration-400 cursor-default ${moodBorder[loc.mood]} ${moodBg[loc.mood]}`}
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(10,14,20,0.65)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            {/* Accent dot */}
            <div
              className="absolute top-4 right-4 w-2 h-2 rounded-full"
              style={{ backgroundColor: moodGlow[loc.mood], boxShadow: `0 0 8px ${moodGlow[loc.mood]}` }}
            />

            <p className={`font-display font-semibold text-lg mb-1 ${moodText[loc.mood]}`}>
              {loc.name}
            </p>
            <p className="text-sm text-muted leading-relaxed mb-4">{loc.description}</p>

            {/* Agents in this location */}
            <div className="flex flex-wrap gap-2">
              {loc.agents.map((agentName) => (
                <span
                  key={agentName}
                  className="font-mono text-[10px] text-muted border border-border/60 rounded-full px-2.5 py-0.5 bg-elevated/40"
                >
                  {agentName}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
