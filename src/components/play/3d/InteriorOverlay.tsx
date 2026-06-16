import { assetUrl } from '../../../lib/play-api'
import type { VisualCuesInterior } from '../../../lib/play-api'

interface InteriorOverlayProps {
  interior: VisualCuesInterior
  busy: boolean
  onCommand: (cmd: string) => void
  onClose: () => void
}

export function InteriorOverlay({ interior, busy, onCommand, onClose }: InteriorOverlayProps) {
  const sceneSrc = assetUrl(interior.sceneTexture)
  const hotspots = interior.hotspots ?? []

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-void/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border/50">
        <div>
          <p className="font-mono text-[10px] text-cyan/70 uppercase tracking-widest">Interior</p>
          <h2 className="font-display text-lg text-text-bright">{interior.label ?? interior.locationId}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-xs px-3 py-1.5 rounded border border-border text-muted hover:text-cyan-glow"
        >
          Exit to district
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {sceneSrc ? (
          <img
            src={sceneSrc}
            alt={interior.label ?? 'Location interior'}
            className="w-full max-h-[50vh] object-cover rounded-lg border border-border/40"
          />
        ) : (
          <div className="h-48 grid-pattern rounded-lg border border-border/40 flex items-center justify-center text-muted font-mono text-sm">
            {interior.locationId}
          </div>
        )}
        <div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Hotspots</p>
          {hotspots.length === 0 ? (
            <p className="text-sm text-muted italic">Nothing to inspect here.</p>
          ) : (
            <ul className="space-y-2">
              {hotspots.map((spot) => (
                <li
                  key={spot.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-elevated/40 px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-text-bright">{spot.label}</p>
                    {spot.preview && <p className="text-xs text-muted">{spot.preview}</p>}
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onCommand(spot.command)}
                    className="font-mono text-xs px-3 py-1.5 rounded border border-cyan/35 text-cyan-glow bg-cyan/5 hover:bg-cyan/12 disabled:opacity-40"
                  >
                    Inspect
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
