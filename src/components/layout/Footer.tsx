import { motion } from 'framer-motion'
import { PRODUCT } from '../../data/product'

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-void py-14 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <motion.div
        className="relative max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 rounded-md border border-cyan/20 bg-cyan/5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-amber" />
              </div>
              <span className="font-display font-semibold text-text-bright">{PRODUCT.name}</span>
            </div>
            <p className="text-sm text-muted">
              Simulation-first AI game engine ·{' '}
              <span className="font-mono text-xs">{PRODUCT.version}</span>
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-mono text-lg font-semibold text-cyan-glow">{PRODUCT.testCount}</p>
              <p className="font-mono text-[10px] text-muted uppercase tracking-wide">tests passing</p>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <div className="flex items-center gap-5 text-sm text-muted">
              <a
                href={PRODUCT.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-glow transition-colors"
              >
                GitHub
              </a>
              <a href="#play" className="hover:text-cyan-glow transition-colors">
                Play
              </a>
              <a href="#district" className="hover:text-cyan-glow transition-colors">
                District
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/20 flex items-center justify-between">
          <p className="text-xs text-muted/50 font-mono">
            New Aarhus District 01 · Living AI-world simulation prototype
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan/60 animate-pulse" />
            <span className="font-mono text-[10px] text-muted/50 uppercase tracking-wider">live</span>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
