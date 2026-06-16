import { assetUrl, type GameShell } from '../../lib/play-api'

interface LenoPanelProps {
  shell: Pick<GameShell, 'leno' | 'assets'> | null | undefined
  busy: boolean
  onCommand: (cmd: string) => void
}

export function LenoPanel({ shell, busy, onCommand }: LenoPanelProps) {
  const leno = shell?.leno
  const overlaySrc = assetUrl(shell?.assets?.lenoOverlay ?? 'assets/ui/leno-overlay.png')
  const suggestions = leno?.suggestions ?? []

  return (
    <>
      <h2 className="font-display font-medium text-text-bright mb-3">Leno</h2>
      <div className="flex gap-3">
        {overlaySrc ? (
          <img
            src={overlaySrc}
            alt=""
            className="w-14 h-14 rounded-lg object-cover border border-registry/30 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-registry-dim/40 border border-registry/25 shrink-0 flex items-center justify-center font-mono text-registry-glow text-lg">
            ◎
          </div>
        )}
        <div className="min-w-0 flex-1">
          {leno?.summary ? (
            <p className="text-xs text-text leading-relaxed whitespace-pre-wrap">{leno.summary}</p>
          ) : (
            <p className="text-xs text-muted italic">Ask Leno for evidence-gated interpretation.</p>
          )}
        </div>
      </div>
      {suggestions.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {suggestions.slice(0, 3).map((s) => (
            <li key={s} className="text-[11px] font-mono text-cyan-glow/80 pl-3 border-l border-cyan/25">
              {s}
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => onCommand('ask_leno')}
        className="mt-4 w-full font-mono text-xs px-4 py-2 rounded-lg border border-registry/35 text-registry-glow bg-registry/8 hover:bg-registry/15 disabled:opacity-40 transition-colors"
      >
        Ask Leno
      </button>
    </>
  )
}
