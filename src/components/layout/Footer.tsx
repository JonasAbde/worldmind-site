import { PRODUCT } from '../../data/product'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-void py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-display text-text-bright font-medium">{PRODUCT.name}</p>
          <p className="text-sm text-muted mt-1">
            Simulation-first AI game engine · {PRODUCT.version}
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted">
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
          <span className="font-mono text-xs">{PRODUCT.testCount} tests</span>
        </div>
      </div>
    </footer>
  )
}
