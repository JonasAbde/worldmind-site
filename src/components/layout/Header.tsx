import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { PRODUCT } from '../../data/product'
import { Button } from '../ui/Button'

const NAV = [
  { label: 'Play', href: '/play' },
  { label: 'Simulation', href: '#simulation' },
  { label: 'Leno', href: '#leno' },
  { label: 'District', href: '#district' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40)
  })

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-border/50 bg-void/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent backdrop-blur-none'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href="#main-content"
        className="absolute left-4 top-[-44px] focus:top-3 z-[80] rounded-md border border-cyan/40 bg-void px-3 py-1.5 font-mono text-xs text-cyan-glow transition-all"
      >
        Skip to content
      </a>
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg border border-cyan/25 bg-cyan/5 flex items-center justify-center overflow-hidden group-hover:border-cyan/50 transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-amber group-hover:bg-amber-glow transition-colors" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-transparent"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-semibold text-text-bright text-sm tracking-wide group-hover:text-cyan-glow transition-colors">
              {PRODUCT.name}
            </span>
            <span className="hidden sm:inline font-mono text-[9px] text-muted bg-elevated/60 px-1.5 py-0.5 rounded border border-border/60">
              {PRODUCT.version}
            </span>
          </div>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm text-muted hover:text-cyan-glow transition-colors group"
            >
              {link.label}
              <span className="absolute bottom-0 left-4 right-4 h-px bg-cyan/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}
        </nav>

        <Button href="/play" variant="secondary" className="!px-4 !py-2 text-xs">
          Play
        </Button>
      </div>
    </motion.header>
  )
}
