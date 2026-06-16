import { PRODUCT } from '../../data/product'
import type { GameShellTopbar } from '../../lib/play-api'

interface PlayBrandedHeaderProps {
  topbar: GameShellTopbar
  version?: string
  episodeTitle?: string
}

function WorldMindMark() {
  return (
    <div className="relative w-9 h-9 rounded-lg border border-cyan/30 bg-cyan/5 flex items-center justify-center overflow-hidden shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-amber shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/15 to-transparent" aria-hidden />
    </div>
  )
}

export function PlayBrandedHeader({
  topbar,
  version,
  episodeTitle = 'The Missing Delivery',
}: PlayBrandedHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-void/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <a href="/" className="flex items-center gap-3 group min-w-0">
              <WorldMindMark />
              <div className="min-w-0">
                <p className="font-display font-semibold text-lg text-gradient-cyan tracking-tight leading-none group-hover:opacity-90 transition-opacity">
                  {PRODUCT.name}
                </p>
                <p className="font-mono text-[10px] text-muted uppercase tracking-[0.22em] mt-0.5 truncate">
                  Nordic simulation · live play
                </p>
              </div>
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
            {version && <span className="text-cyan/70">{version}</span>}
            <span>
              <strong className="text-cyan-glow">Day</strong> {topbar.day ?? '—'}
            </span>
            <span>
              <strong className="text-cyan-glow">Time</strong> {topbar.time ?? '—'}
            </span>
            <span>
              <strong className="text-amber-glow">¢</strong> {topbar.money ?? 0}
            </span>
            {topbar.reputation != null && (
              <span>
                <strong className="text-amber-glow">Rep</strong> {topbar.reputation}
              </span>
            )}
            {topbar.energy != null && (
              <span>
                <strong className="text-cyan-glow">E</strong> {topbar.energy}
              </span>
            )}
            <span>
              <strong className="text-registry-glow">Leno</strong> {topbar.lenoStatus ?? 'standby'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border/40 pt-3">
          <div>
            <p className="font-mono text-[10px] text-cyan/60 uppercase tracking-[0.28em] mb-1">Episode</p>
            <h1 className="font-display text-xl md:text-2xl font-semibold text-text-bright tracking-tight">
              {episodeTitle}
            </h1>
            <p className="text-sm text-muted mt-0.5">
              {topbar.worldName ?? 'New Aarhus District 01'}
              {' · '}
              <span className="text-cyan-glow/90">branch {topbar.branchName ?? 'main'}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
