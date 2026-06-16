import { motion } from 'framer-motion'
import { HERO, PRODUCT, PROOF_BADGES } from '../../data/product'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { RainEffect } from '../ui/RainEffect'
import { SimulationOverlay } from '../ui/SimulationOverlay'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-void noise-overlay">
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <RainEffect />
      <SimulationOverlay />

      {/* Harbour gradient — cold blue left, warm amber right */}
      <img
        src="/assets/worldmind-hero-key-art.png"
        alt="Cinematic key art for WorldMind showing New Aarhus District 01 with simulation overlays"
        className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen"
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-registry-dim/30 via-deep/50 to-amber-dim/20" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-deep via-transparent to-transparent" />

      {/* Concrete blocks silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 opacity-20">
        <div className="absolute bottom-0 left-[5%] w-24 h-32 bg-gradient-to-t from-slate-700 to-transparent" />
        <div className="absolute bottom-0 left-[20%] w-32 h-40 bg-gradient-to-t from-slate-600 to-transparent" />
        <div className="absolute bottom-0 right-[15%] w-28 h-36 bg-gradient-to-t from-slate-700 to-transparent" />
        <div className="absolute bottom-0 right-[30%] w-20 h-28 bg-gradient-to-t from-slate-600 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 pt-32 pb-24 text-center">
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {PROOF_BADGES.map((badge) => (
            <Badge key={badge.label} label={badge.label} variant={badge.variant} />
          ))}
        </motion.div>

        <motion.p
          className="font-mono text-xs tracking-[0.25em] uppercase text-cyan/70 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {PRODUCT.tagline}
        </motion.p>

        <motion.h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-text-bright tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          {HERO.headline}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-text max-w-2xl mx-auto leading-relaxed mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          {HERO.subheadline}
        </motion.p>

        <motion.p
          className="font-mono text-sm text-muted mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          {HERO.proof}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <Button href={PRODUCT.playInstructionsUrl} external>
            {HERO.primaryCta}
          </Button>
          <Button href="#simulation" variant="secondary">
            {HERO.secondaryCta}
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="w-px h-16 bg-gradient-to-b from-cyan/50 to-transparent"
            animate={{ scaleY: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  )
}
