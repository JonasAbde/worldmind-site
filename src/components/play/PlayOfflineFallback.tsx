import { DEMO_COMMAND_STRIP, PRODUCT } from '../../data/product'
import { CORE_URL } from '../../lib/play-api'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function PlayOfflineFallback() {
  return (
    <div className="min-h-screen bg-void text-text">
      <div className="pointer-events-none fixed inset-0 z-[55] vignette" aria-hidden />
      <header className="border-b border-border/50 bg-void/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display font-semibold text-text-bright text-sm hover:text-cyan-glow transition-colors">
            ← {PRODUCT.name}
          </a>
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest">offline</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-mono text-xs text-cyan/70 uppercase tracking-[0.25em] mb-4">Play portal</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-text-bright mb-4">
          Core unreachable
        </h1>
        <p className="text-muted leading-relaxed mb-8 max-w-2xl">
          WorldMind play-server is not running at{' '}
          <code className="font-mono text-xs text-cyan-glow/90 bg-elevated px-1.5 py-0.5 rounded border border-border">
            {CORE_URL}
          </code>
          . Start the simulation core locally, or browse the demo commands below.
        </p>

        <Card accent="neutral" className="!p-5 border-dashed border-border/70 mb-8">
          <p className="font-mono text-[11px] text-muted uppercase tracking-[0.25em] mb-3">
            Demo command strip — read-only preview
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-text">
            {DEMO_COMMAND_STRIP.map((cmd) => (
              <span
                key={cmd}
                className="px-3 py-1.5 rounded-full bg-elevated/80 border border-border/80 text-cyan-glow/70"
              >
                {cmd}
              </span>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button href={PRODUCT.githubUrl} variant="primary" external>
            Clone worldmind-core
          </Button>
          <Button href="/" variant="secondary">
            Back to site
          </Button>
        </div>

        <pre className="mt-10 p-4 rounded-lg border border-border bg-surface font-mono text-xs text-muted overflow-x-auto">
{`git clone ${PRODUCT.githubUrl}.git
cd worldmind-core
WM_CORS_ORIGIN=http://localhost:5173 npm run play:server`}
        </pre>
      </main>
    </div>
  )
}
