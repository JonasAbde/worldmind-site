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
        const t = setTimeout(() => setDisplayed(cmd.slice(0, displayed.length + 1)), 50)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('pause'), 1800)
        return () => clearTimeout(t)
      }
    }
    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('erasing'), 400)
      return () => clearTimeout(t)
    }
    if (phase === 'erasing') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 24)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => {
          setCmdIndex((i) => (i + 1) % TYPED_COMMANDS.length)
          setPhase('typing')
        }, 0)
        return () => clearTimeout(t)
      }
    }
  }, [displayed, phase, cmdIndex])

  return (
    <div className="flex items-center gap-2 font-mono text-sm md:text-base">
      <span className="text-cyan/40 select-none">$&gt;</span>
      <span className="text-cyan-glow/90">{displayed}</span>
      <span className="cursor-blink w-2 h-[1.1em] bg-cyan-glow/70 inline-block align-middle" />
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const imgY       = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const imgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const textY      = useTransform(scrollYProgress, [0, 0.8], ['0%', '28%'])
  const opacity    = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5], [0.45, 0.08])

  const chars = 'WorldMind'.split('')

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-void noise-overlay scanlines"
    >
      {/* Parallax key art */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: imgY, scale: imgScale }}
      >
        <img
          src="/assets/optimized/worldmind-hero-key-art.webp"
          alt="Cinematic key art for WorldMind showing New Aarhus District 01 with simulation overlays"
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
          onError={(e) => { e.currentTarget.src = '/assets/worldmind-hero-key-art.png' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/55 via-void/30 to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/60 via-transparent to-void/60" />
      </motion.div>

      {/* Grid pattern fades on scroll */}
      <motion.div
        className="absolute inset-0 z-1 grid-pattern"
        style={{ opacity: gridOpacity }}
      />
      <RainEffect />
      <SimulationOverlay />

      {/* Atmosphere glows */}
      <div className="absolute top-1/4 left-1/5 w-[600px] h-[600px] rounded-full bg-cyan/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] rounded-full bg-amber/3 blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 pt-32 pb-24 text-center"
        style={{ y: textY, opacity }}
      >
        {/* Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {PROOF_BADGES.map((badge) => (
            <Badge key={badge.label} label={badge.label} variant={badge.variant} />
          ))}
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          className="font-mono text-xs tracking-[0.35em] uppercase text-cyan/55 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {PRODUCT.tagline}
        </motion.p>

        {/* Per-character headline stagger */}
        <h1
          className="font-display font-bold tracking-tight mb-8"
          aria-label="WorldMind"
        >
          <span className="flex justify-center">
            {chars.map((ch, i) => (
              <motion.span
                key={i}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gradient-cyan inline-block"
                initial={{ opacity: 0, y: 60, rotateX: 40, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.5 + i * 0.055,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformPerspective: 800, display: 'inline-block' }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Sub */}
        <motion.p
          className="text-lg md:text-xl text-text max-w-2xl mx-auto leading-relaxed mb-2"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
        >
          {HERO.subheadline}
        </motion.p>
        <motion.p
          className="font-mono text-sm text-muted mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {HERO.proof}
        </motion.p>

        {/* Terminal */}
        <motion.div
          className="mx-auto max-w-lg mb-12 rounded-xl border border-cyan/15 bg-void/75 backdrop-blur-xl px-5 py-4"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.55 }}
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/55" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber/55" />
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45 }}
        >
          <Button href={PRODUCT.playInstructionsUrl} external>
            {HERO.primaryCta}
          </Button>
          <Button href="#simulation" variant="secondary">
            {HERO.secondaryCta}
          </Button>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
        >
          <span className="font-mono text-[9px] text-muted/50 tracking-[0.4em] uppercase">scroll</span>
          <motion.div
            className="w-px h-14 bg-gradient-to-b from-cyan/40 to-transparent"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
