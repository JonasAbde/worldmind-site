import { progressionXpPercent, type GameShellProgression, type GameShellTopbar } from '../../../lib/play-api'

interface PlayGameTopBarProps {
  topbar: GameShellTopbar
  version?: string
  locationName?: string
  progression?: GameShellProgression
  cameraMode: 'follow' | 'overview'
  isWalking: boolean
  interiorOpen: boolean
  hasInterior: boolean
  mapOpen: boolean
  dockOpen: boolean
  onToggleCamera: () => void
  onToggleInterior: () => void
  onToggleMap: () => void
  onToggleDock: () => void
  onOpenHelp: () => void
  onOpenLeno?: () => void
}

export function PlayGameTopBar({
  topbar,
  version,
  locationName,
  progression,
  cameraMode,
  isWalking,
  interiorOpen,
  hasInterior,
  mapOpen,
  dockOpen,
  onToggleCamera,
  onToggleInterior,
  onToggleMap,
  onToggleDock,
  onOpenHelp,
  onOpenLeno,
}: PlayGameTopBarProps) {
  const xpPct = progression ? progressionXpPercent(progression) : 0

  return (
    <header className="shrink-0 z-[60] border-b border-cyan/15 bg-gradient-to-b from-void/95 to-void/80 backdrop-blur-xl">
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 min-h-[44px]">
        <div className="flex items-center gap-2 min-w-0 shrink">
          <div className="w-7 h-7 rounded-md border border-cyan/30 bg-cyan/5 flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-amber shadow-[0_0_8px_rgba(245,158,11,0.55)]" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="font-mono text-[9px] text-cyan/70 uppercase tracking-[0.2em] leading-none">
              The Missing Delivery
            </p>
            <p className="font-display text-sm text-text-bright truncate leading-tight mt-0.5">
              {locationName ?? topbar.worldName ?? 'District'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mx-auto justify-center">
          <span className="play-hud-chip text-cyan-glow/90">
            D{topbar.day ?? '—'}
          </span>
          <span className="play-hud-chip text-muted">{topbar.time ?? '—'}</span>
          <span className="play-hud-chip text-amber-glow">¢{topbar.money ?? 0}</span>
          {topbar.reputation != null && (
            <span className="play-hud-chip text-amber-glow/90 hidden xs:inline">Rep {topbar.reputation}</span>
          )}
          {topbar.energy != null && (
            <span className="play-hud-chip text-cyan-glow hidden md:inline">E {topbar.energy}</span>
          )}
          <span className="play-hud-chip text-registry-glow hidden lg:inline">
            Leno {topbar.lenoStatus ?? 'standby'}
          </span>
          {progression && (
            <span className="play-hud-chip text-cyan-glow hidden lg:inline-flex items-center gap-1.5">
              Lv {progression.level ?? 1}
              <span className="inline-block w-12 h-1 rounded-full bg-void/80 overflow-hidden align-middle">
                <span
                  className="block h-full bg-cyan-glow/80 transition-all"
                  style={{ width: `${xpPct}%` }}
                />
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {!isWalking && cameraMode === 'follow' && (
            <span className="play-hud-chip text-muted hidden xl:inline">WASD · E enter</span>
          )}
          <button type="button" onClick={onToggleMap} className={hudBtn(mapOpen)} title="District map">
            Map
          </button>
          {hasInterior && (
            <button type="button" onClick={onToggleInterior} className={hudBtn(interiorOpen)}>
              {interiorOpen ? 'District' : 'Enter'}
            </button>
          )}
          <button type="button" onClick={onToggleCamera} className={hudBtn(false)} title="Camera mode">
            {cameraMode === 'follow' ? 'Overview' : 'Follow'}
          </button>
          <button type="button" onClick={onToggleDock} className={hudBtn(dockOpen)}>
            Data
          </button>
          {onOpenLeno && (
            <button type="button" onClick={onOpenLeno} className={hudBtn(false)} title="Ask Leno">
              Leno
            </button>
          )}
          <button type="button" onClick={onOpenHelp} className={hudBtn(false)} title="Controls">
            ?
          </button>
          <a href="/play" className={`${hudBtn(false)} hidden sm:inline`}>
            2D
          </a>
          {version && (
            <span className="font-mono text-[9px] text-muted/70 hidden md:inline">{version}</span>
          )}
        </div>
      </div>
    </header>
  )
}

function hudBtn(active: boolean) {
  return `font-mono text-[10px] px-2 py-1 rounded border transition-colors ${
    active
      ? 'border-cyan/45 text-cyan-glow bg-cyan/10'
      : 'border-border/50 text-muted hover:text-cyan-glow hover:border-cyan/30 bg-void/40'
  }`
}
