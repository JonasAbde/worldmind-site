import { motion } from 'framer-motion'
import { PRODUCT } from '../../data/product'
import { Button } from '../ui/Button'

export function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-void/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-md border border-cyan/30 bg-cyan/5 flex items-center justify-center group-hover:border-cyan/50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
          </div>
          <div>
            <span className="font-display font-semibold text-text-bright text-sm tracking-wide">
              {PRODUCT.name}
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-muted ml-2">
              {PRODUCT.version}
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Play', href: '#play' },
            { label: 'Simulation', href: '#simulation' },
            { label: 'Leno', href: '#leno' },
            { label: 'District', href: '#district' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-cyan-glow transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          href={PRODUCT.playInstructionsUrl}
          variant="secondary"
          className="!px-4 !py-2 text-xs"
          external
        >
          View Play Instructions
        </Button>
      </div>
    </motion.header>
  )
}
