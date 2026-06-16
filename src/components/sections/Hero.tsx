import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { HERO, PRODUCT, PROOF_BADGES } from '../../data/product'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { RainEffect } from '../ui/RainEffect'
import { SimulationOverlay } from '../ui/SimulationOverlay'

const TYPED_COMMANDS = [
  'inspect cafe',
  'talk sara',
  'ask sara "what happened to the delivery?"',
  'listen_rumors market',
  'trace_rumor',
  'ask_leno',
  'save',
  'branch',
]

function TypedCommandLine() {
  const [cmdIndex, setCmdIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing'>('typing')

  useEffect(() => {
    const cmd = TYPED_COMMANDS[cmdIndex]

    if (phase === 'typing') {
      if (displayed.length < cmd.length) {
        const t = setTimeout(() => setDisplayed(cmd.slice(0, displayed.length + 1)), 55)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('pause'), 1600)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('erasing'), 400)
      return () => clearTimeout(t)
    }

    if (phase === 'erasing') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28)
        return () => clearTimeout(t)
      } else {
        setCmdIndex((i) => (i + 1) % TYPED_COMMANDS.length)
        setPhase('typing')
      }
    }
  }, [displayed, phase, cmdIndex])

  return (
    <div className="flex items-center gap-2 font-mono text-sm md:text-base text-cyan-glow/90">
      <span className="text-muted select-none">$&gt;</span>
      <span>{displayed}</span>
      <span className="cursor-blink w-2 h-4 bg-cyan-glow/80 inline-block" />
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-void noise-overlay scanlines"
    >
      {/* Parallax key art */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
        <img
          src="/assets/worldmind-hero-key-art.png"
          alt="Cinematic key art for WorldMind showing New Aarhus District 01 with simulation overlays"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/40 to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/50 via-transparent to-void/50" />
      </motion.div>

      {/* Grid + atmosphere */}
      <div className="absolute inset-0 z-1 grid-pattern opacity-50" />
      <RainEffect />
      <SimulationOverlay />

      {/* Radial accent glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber/4 blur-3xl pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 pt-32 pb-24 text-center"
        style={{ y: textY, opacity }}
      >
        {/* Proof badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {PROOF_BADGES.map((badge) => (
            <Badge key={badge.label} label={badge.label} variant={badge.variant} />
          ))}
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          className="font-mono text-xs tracking-[0.3em] uppercase text-cyan/60 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {PRODUCT.tagline}
        </motion.p>

        {/* Main headline */}
        <motion.h1
          className="font-display font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gradient-cyan">
            WorldMind
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-text max-w-2xl mx-auto leading-relaxed mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {HERO.subheadline}
        </motion.p>

        <motion.p
          className="font-mono text-sm text-muted mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {HERO.proof}
        </motion.p>

        {/* Terminal command strip */}
        <motion.div
          className="mx-auto max-w-lg mb-12 rounded-xl border border-cyan/15 bg-void/70 backdrop-blur-xl px-5 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/60">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan/40" />
            <span className="ml-2 font-mono text-[10px] text-muted uppercase tracking-widest">
              worldmind — new-aarhus-district-01
            </span>
          </div>
          <TypedCommandLine />
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button href={PRODUCT.playInstructionsUrl} external>
            {HERO.primaryCta}
          </Button>
          <Button href="#simulation" variant="secondary">
            {HERO.secondaryCta}
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <span className="font-mono text-[10px] text-muted tracking-widest uppercase">scroll</span>
          <motion.div
            className="w-px h-14 bg-gradient-to-b from-cyan/40 to-transparent"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
